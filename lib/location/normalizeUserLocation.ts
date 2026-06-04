import { findPlaceById, findPlaceByName, userLocationFromPlace } from '@/lib/places'
import type { MicroclimateTag, UserLocation } from '@/lib/types/location'
import { mapZoneToClimate } from '@/lib/types/location'
import { tagsFromLegacyMicroclimate } from '@/lib/places/tagInference'
import { inferDefaultTags } from '@/lib/places/tagInference'

export function normalizeUserLocation(raw: Partial<UserLocation> & { city?: string; state?: string }): UserLocation | null {
  if (!raw.city || !raw.state) return null

  if (raw.placeId) {
    const place = findPlaceById(raw.placeId)
    if (place) return userLocationFromPlace(place)
  }

  const byName = findPlaceByName(raw.city, raw.state)
  if (
    byName &&
    raw.lat &&
    raw.lon &&
    raw.auHardinessZone &&
    raw.climate
  ) {
    return userLocationFromPlace(byName)
  }

  if (byName) {
    return userLocationFromPlace(byName)
  }

  if (
    !raw.lat ||
    !raw.lon ||
    !raw.auHardinessZone ||
    !raw.climate
  ) {
    return null
  }

  const legacyTags = tagsFromLegacyMicroclimate(raw.microclimate)
  const existing = raw.microclimateTags as MicroclimateTag[] | undefined
  const microclimateTags =
    existing && existing.length > 0
      ? existing
      : inferDefaultTags(raw.city, raw.state, raw.auHardinessZone, legacyTags)

  return {
    lat: raw.lat,
    lon: raw.lon,
    city: raw.city,
    state: raw.state,
    auHardinessZone: raw.auHardinessZone,
    climate: raw.climate ?? mapZoneToClimate(raw.auHardinessZone),
    microclimateTags,
    placeId: raw.placeId,
  }
}
