/**
 * @deprecated Canonical location lives in profiles.location via lib/locationService.ts
 * and app/context/AuthContext (useAuth().userLocation).
 *
 * Use gardenLocationFromUserLocation() from @/lib/locationView with useAuth() instead.
 * Do not read localStorage for location.
 */

import { GardenLocation } from '../types/location';

export type { GardenLocation } from '../types/location';

/**
 * @deprecated Returns null. Migrate callers to useAuth().userLocation + lib/locationView.
 */
export function getNormalizedLocation(_location?: string): GardenLocation | null {
  if (typeof window !== 'undefined') {
    console.warn(
      '[ARCHITECTURE] getNormalizedLocation() is deprecated. Use useAuth().userLocation and gardenLocationFromUserLocation() from @/lib/locationView.'
    );
  }
  return null;
}
