/**
 * Location detection and management service
 * Handles suburb lookup and location storage via Supabase
 *
 * Note: Geolocation uses Capacitor on native Android/iOS, browser API on web
 *
 * Flow:
 * 1. User selects suburb or device provides location via Capacitor
 * 2. lookupSuburbByName() converts to UserLocation object
 * 3. updateUserLocation() saves to Supabase profiles.location (jsonb UserLocation)
 * 4. On app open: getUserLocationFromDB() loads from DB (instant, no geolocation)
 */

import { createClient } from '@supabase/supabase-js';
import { UserLocation } from './types/location';
import { normalizeUserLocation } from './location/normalizeUserLocation';
import { Capacitor } from '@capacitor/core';
import {
  findNearestPlace,
  findPlaceById,
  findPlaceByName,
  getAllPlacesForPicker,
  userLocationFromPlace,
} from './places';

/** Rough bounding box for mainland Australia + Tasmania. */
const AU_LAT_MIN = -44;
const AU_LAT_MAX = -9;
const AU_LON_MIN = 112;
const AU_LON_MAX = 154;
const GEOLOCATION_TIMEOUT_MS = 10_000;
const NEAREST_PLACE_MAX_KM = 100;

// Initialize Supabase client (same as in app/lib/supabase.ts)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Error types for location detection
 */
export enum LocationErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  GEOLOCATION_UNAVAILABLE = 'GEOLOCATION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  DB_ERROR = 'DB_ERROR',
  INVALID_COORDINATES = 'INVALID_COORDINATES',
  SUBURB_NOT_FOUND = 'SUBURB_NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}

export class LocationError extends Error {
  constructor(
    public type: LocationErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'LocationError';
  }
}

function isWithinAustralia(lat: number, lon: number): boolean {
  return lat >= AU_LAT_MIN && lat <= AU_LAT_MAX && lon >= AU_LON_MIN && lon <= AU_LON_MAX;
}

function mapGeolocationFailure(error: unknown): LocationError {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (message.includes('permission') || message.includes('denied')) {
    return new LocationError(
      LocationErrorType.PERMISSION_DENIED,
      'Location permission was denied. Please enable location access in your device settings or select your suburb manually.',
      error instanceof Error ? error : undefined
    );
  }

  if (message.includes('timeout') || message.includes('timed out')) {
    return new LocationError(
      LocationErrorType.TIMEOUT,
      'Location detection timed out. Please try again or select your suburb manually.',
      error instanceof Error ? error : undefined
    );
  }

  if (message.includes('unavailable') || message.includes('disabled')) {
    return new LocationError(
      LocationErrorType.GEOLOCATION_UNAVAILABLE,
      'Location services are unavailable on this device. Please select your suburb manually.',
      error instanceof Error ? error : undefined
    );
  }

  return new LocationError(
    LocationErrorType.UNKNOWN,
    'Could not detect your location. Please select your suburb manually.',
    error instanceof Error ? error : undefined
  );
}

async function getDeviceCoordinates(): Promise<{ lat: number; lon: number }> {
  if (Capacitor.isNativePlatform()) {
    const { Geolocation } = await import('@capacitor/geolocation');
    const permission = await Geolocation.requestPermissions();

    if (permission.location === 'denied') {
      throw new LocationError(
        LocationErrorType.PERMISSION_DENIED,
        'Location permission was denied. Please enable location access in your device settings or select your suburb manually.'
      );
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: GEOLOCATION_TIMEOUT_MS,
    });

    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
  }

  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject(
              new LocationError(
                LocationErrorType.PERMISSION_DENIED,
                'Location permission was denied. Please allow location access or select your suburb manually.'
              )
            );
            return;
          }

          if (error.code === error.TIMEOUT) {
            reject(
              new LocationError(
                LocationErrorType.TIMEOUT,
                'Location detection timed out. Please try again or select your suburb manually.'
              )
            );
            return;
          }

          reject(
            new LocationError(
              LocationErrorType.GEOLOCATION_UNAVAILABLE,
              'Location services are unavailable in this browser. Please select your suburb manually.'
            )
          );
        },
        {
          enableHighAccuracy: true,
          timeout: GEOLOCATION_TIMEOUT_MS,
          maximumAge: 0,
        }
      );
    });
  }

  throw new LocationError(
    LocationErrorType.GEOLOCATION_UNAVAILABLE,
    'Automatic location detection is only available on the mobile app. Please select your suburb from the dropdown below.'
  );
}

/**
 * Detect user location using device geolocation (Capacitor on mobile, browser API on web).
 * Maps GPS coordinates to the nearest known place in the registry.
 *
 * @returns UserLocation with city, state, zone, climate
 * @throws LocationError when geolocation fails or no nearby place is found
 */
export async function detectLocationOnce(): Promise<UserLocation> {
  try {
    const { lat, lon } = await getDeviceCoordinates();

    if (!isWithinAustralia(lat, lon)) {
      throw new LocationError(
        LocationErrorType.INVALID_COORDINATES,
        'Your location appears to be outside Australia. Please select your suburb manually.'
      );
    }

    const place = findNearestPlace(lat, lon, NEAREST_PLACE_MAX_KM);
    if (!place) {
      throw new LocationError(
        LocationErrorType.SUBURB_NOT_FOUND,
        'No nearby suburbs found for your location. Please select your suburb manually.'
      );
    }

    return userLocationFromPlace(place);
  } catch (error) {
    if (error instanceof LocationError) {
      throw error;
    }

    throw mapGeolocationFailure(error);
  }
}

/** Parse profiles.location from jsonb (preferred) or legacy TEXT JSON strings. */
function parseStoredLocation(raw: unknown): Partial<UserLocation> | null {
  if (!raw) return null
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Partial<UserLocation>
    } catch {
      return null
    }
  }
  if (typeof raw === 'object') {
    return raw as Partial<UserLocation>
  }
  return null
}

/** Match profiles.city/state to canonical places registry. */
export function lookupByCityAndState(city: string, state: string): UserLocation | null {
  const place = findPlaceByName(city, state)
  return place ? userLocationFromPlace(place) : null
}

function enrichPartialLocation(partial: Partial<UserLocation>): UserLocation | null {
  return normalizeUserLocation(partial)
}

function resolveLocationFromProfile(row: {
  location?: unknown
  state?: string | null
  city?: string | null
}): { location: UserLocation | null; shouldPersistLegacy: boolean } {
  const parsed = parseStoredLocation(row.location)
  if (parsed) {
    const enriched = enrichPartialLocation(parsed)
    if (enriched) {
      const storedComplete =
        isCompleteUserLocation(parsed as UserLocation) &&
        !!parsed.lat &&
        !!parsed.lon &&
        typeof row.location !== 'string'
      return { location: enriched, shouldPersistLegacy: !storedComplete }
    }
  }

  if (row.city && row.state) {
    const legacy = lookupByCityAndState(row.city, row.state)
    if (legacy) {
      return { location: legacy, shouldPersistLegacy: true }
    }
  }

  return { location: null, shouldPersistLegacy: false }
}

/**
 * Get user location from Supabase database
 * Fast, no geolocation required, used on every app open
 *
 * @param userId - Supabase user ID
 * @returns UserLocation from database, or null if not set
 * @throws LocationError if database query fails
 */
export async function getUserLocationFromDB(userId: string): Promise<UserLocation | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('location, state, city')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new LocationError(
        LocationErrorType.DB_ERROR,
        `Failed to fetch location from database: ${error.message}`,
        error
      );
    }

    if (!data) return null;

    const { location, shouldPersistLegacy } = resolveLocationFromProfile(data)

    if (location && shouldPersistLegacy) {
      try {
        await updateUserLocation(userId, location)
      } catch (persistError) {
        console.warn('Could not persist legacy profile location:', persistError)
      }
    }

    return location ? normalizeUserLocation(location) : null
  } catch (error) {
    if (error instanceof LocationError) {
      throw error;
    }

    throw new LocationError(
      LocationErrorType.DB_ERROR,
      `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error as Error
    );
  }
}

/**
 * Update user location in Supabase database
 * Called after user confirms detected or selected location
 *
 * @param userId - Supabase user ID
 * @param location - UserLocation to store
 * @throws LocationError if update fails
 */
export async function updateUserLocation(
  userId: string,
  location: UserLocation
): Promise<void> {
  const toSave = normalizeUserLocation(location)
  if (!toSave) {
    throw new LocationError(
      LocationErrorType.INVALID_COORDINATES,
      'Invalid location data: could not resolve place'
    )
  }
  try {
    // Validate location before saving
    if (
      !toSave.lat ||
      !toSave.lon ||
      !toSave.city ||
      !toSave.state ||
      !toSave.auHardinessZone ||
      !toSave.climate
    ) {
      throw new LocationError(
        LocationErrorType.INVALID_COORDINATES,
        'Invalid location data: missing required fields'
      );
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        location: toSave,
        state: toSave.state,
        city: toSave.city,
      })
      .eq('id', userId);

    if (error) {
      throw new LocationError(
        LocationErrorType.DB_ERROR,
        `Failed to update location: ${error.message}`,
        error
      );
    }
  } catch (error) {
    if (error instanceof LocationError) {
      throw error;
    }

    throw new LocationError(
      LocationErrorType.DB_ERROR,
      `Update failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error as Error
    );
  }
}

/**
 * Manual location lookup by suburb name
 * Used when geolocation is denied or user wants to change location
 *
 * @param suburbName - Suburb name to search for
 * @returns UserLocation if suburb found
 * @throws LocationError if suburb not found
 */
/** Resolve canonical location from places registry id. */
export function lookupPlaceById(placeId: string): UserLocation {
  const place = findPlaceById(placeId)
  if (!place) {
    throw new LocationError(
      LocationErrorType.SUBURB_NOT_FOUND,
      `Place "${placeId}" not found in database`
    )
  }
  return userLocationFromPlace(place)
}

/**
 * Manual location lookup by suburb name (picker value may be place id or legacy name).
 */
export function lookupSuburbByName(suburbNameOrId: string): UserLocation {
  const byId = findPlaceById(suburbNameOrId)
  if (byId) return userLocationFromPlace(byId)

  const place = findPlaceByName(suburbNameOrId)
  if (!place) {
    throw new LocationError(
      LocationErrorType.SUBURB_NOT_FOUND,
      `Suburb "${suburbNameOrId}" not found in database`
    )
  }
  return userLocationFromPlace(place)
}

/** True when profiles.location has all fields required for zone-aware features. */
export function isCompleteUserLocation(
  loc: UserLocation | null | undefined
): loc is UserLocation {
  const normalized = loc ? normalizeUserLocation(loc) : null
  return !!(
    normalized?.city &&
    normalized?.state &&
    normalized?.auHardinessZone &&
    normalized?.climate &&
    normalized.microclimateTags.length > 0
  )
}

/** Canonical post-auth route for returning users. */
export function getHomeRouteForLocation(
  loc: UserLocation | null | undefined
): '/dashboard' | '/location-select' {
  return isCompleteUserLocation(loc) ? '/dashboard' : '/location-select'
}

/** Safe in-app path for ?returnTo= (blocks open redirects). */
export function getSafeReturnTo(param: string | null | undefined): string | null {
  if (!param || !param.startsWith('/') || param.startsWith('//')) return null
  return param
}

/** Link to location picker when changing an existing location (e.g. from settings). */
export function locationSelectChangeHref(returnTo: string): string {
  const safe = getSafeReturnTo(returnTo)
  if (!safe) return '/location-select/'
  return `/location-select/?returnTo=${encodeURIComponent(safe)}`
}

/** Read ?returnTo= from the current URL (client-only). */
export function getLocationSelectReturnToFromSearch(search: string): string | null {
  return getSafeReturnTo(new URLSearchParams(search).get('returnTo'))
}

/**
 * Get list of all available suburbs for picker UI
 */
/** Places for location picker (canonical). */
export function getAllSuburbs() {
  return getAllPlacesForPicker()
}

export { getAllPlacesForPicker } from './places'
