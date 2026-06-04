import type { UserLocation } from '@/lib/types/location'
import { findPlaceById } from '@/lib/places'
import { monthOverviewLookupKey } from './month-overview-keys'
import { MONTH_OVERVIEW_BY_PLACE_MONTH } from './month-overviews.generated'

/** Sharp-voice month overview from CSV (year calendar source of truth). */
export function getMonthOverviewFromSharpVoiceCsv(
  location: Pick<UserLocation, 'city' | 'state' | 'placeId'> | null,
  month: string
): string | null {
  if (!location) return null

  let place = location.city?.trim() ?? ''
  let state = location.state?.trim() ?? ''

  if (location.placeId) {
    const resolved = findPlaceById(location.placeId)
    if (resolved) {
      place = resolved.name
      state = resolved.state
    }
  }

  if (!place || !state) return null

  const key = monthOverviewLookupKey(state, place, month)
  return MONTH_OVERVIEW_BY_PLACE_MONTH[key] ?? null
}
