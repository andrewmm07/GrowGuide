import { findPlaceByName, userLocationFromPlace } from '@/lib/places'
import type { SuburbRecord, UserLocation } from '@/lib/types/location'
import { suburbToPlace } from '@/lib/places/legacySuburb'

/** @deprecated Use userLocationFromPlace from @/lib/places */
export function userLocationFromSuburbRecord(suburb: SuburbRecord): UserLocation {
  const place = suburbToPlace(suburb)
  return userLocationFromPlace(place)
}

export function userLocationFromSuburbName(name: string, state: string): UserLocation | null {
  const place = findPlaceByName(name, state)
  return place ? userLocationFromPlace(place) : null
}
