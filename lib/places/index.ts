import { SUBURB_DATA } from '@/lib/auSuburbData'
import type { UserLocation } from '@/lib/types/location'
import { mapZoneToClimate } from '@/lib/types/location'
import { findNearest } from '@/lib/utils/haversine'
import { PLACE_SEEDS } from './auPlacesBulk'
import { AU_PLACES_EXTRA } from './auPlacesExtra'
import { placeFromSeed } from './buildPlace'
import { formatTagsLabel } from './tagInference'
import { suburbToPlace } from './legacySuburb'
import type { AuPlace, PlacePickerOption } from './types'
import { PLACES_DATA_VERSION } from './types'

export type { AuPlace, PlacePickerOption } from './types'
export { PLACES_DATA_VERSION } from './types'
export { formatTagsLabel } from './tagInference'

const NEAREST_PLACE_MAX_KM = 35

const FROM_LEGACY: AuPlace[] = SUBURB_DATA.map(suburbToPlace)
const FROM_BULK: AuPlace[] = PLACE_SEEDS.map(placeFromSeed)

const BY_ID = new Map<string, AuPlace>()
const BY_KEY = new Map<string, AuPlace>()

function placeKey(name: string, state: string): string {
  return `${state.toUpperCase()}:${name.trim().toLowerCase()}`
}

for (const place of [...FROM_LEGACY, ...AU_PLACES_EXTRA, ...FROM_BULK]) {
  if (!BY_ID.has(place.id)) {
    BY_ID.set(place.id, place)
  }
  const key = placeKey(place.name, place.state)
  if (!BY_KEY.has(key)) {
    BY_KEY.set(key, place)
  }
}

export const AU_PLACES: AuPlace[] = Array.from(BY_ID.values()).sort((a, b) =>
  a.state.localeCompare(b.state) || a.name.localeCompare(b.name)
)

export function getPlacesDataVersion(): string {
  return PLACES_DATA_VERSION
}

export function findPlaceById(id: string): AuPlace | undefined {
  return BY_ID.get(id)
}

export function findPlaceByName(name: string, state?: string): AuPlace | undefined {
  if (state) {
    return BY_KEY.get(placeKey(name, state))
  }
  const lower = name.trim().toLowerCase()
  return AU_PLACES.find((p) => p.name.toLowerCase() === lower)
}

export function findNearestPlace(
  lat: number,
  lon: number,
  maxDistanceKm = NEAREST_PLACE_MAX_KM
): AuPlace | null {
  const nearest = findNearest(lat, lon, AU_PLACES)
  if (!nearest || nearest.distanceKm > maxDistanceKm) return null
  return nearest.point
}

export function userLocationFromPlace(place: AuPlace): UserLocation {
  return {
    lat: place.lat,
    lon: place.lon,
    city: place.name,
    state: place.state,
    auHardinessZone: place.auHardinessZone,
    climate: mapZoneToClimate(place.auHardinessZone),
    microclimateTags: [...place.microclimateTags],
    placeId: place.id,
  }
}

export function getAllPlacesForPicker(): PlacePickerOption[] {
  return AU_PLACES.map((p) => ({
    id: p.id,
    name: p.name,
    state: p.state,
    zone: p.auHardinessZone,
    tagsLabel: formatTagsLabel(p.microclimateTags),
  }))
}

/** @deprecated Use getAllPlacesForPicker */
export function getAllSuburbsForPicker() {
  return getAllPlacesForPicker().map((p) => ({
    name: p.name,
    state: p.state,
    zone: p.zone,
  }))
}
