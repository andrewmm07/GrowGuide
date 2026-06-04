import type { SuburbRecord } from '@/lib/types/location'
import type { AuPlace } from './types'
import { inferDefaultTags, slugifyPlaceId, tagsFromLegacyMicroclimate } from './tagInference'

export function suburbToPlace(record: SuburbRecord): AuPlace {
  const legacyTags =
    record.microclimateTags ?? tagsFromLegacyMicroclimate(record.microclimate)
  const microclimateTags = inferDefaultTags(
    record.name,
    record.state,
    record.auHardinessZone,
    legacyTags,
    { lat: record.lat, lon: record.lon }
  )
  return {
    id: slugifyPlaceId(record.state, record.name),
    name: record.name,
    state: record.state,
    lat: record.lat,
    lon: record.lon,
    auHardinessZone: record.auHardinessZone,
    microclimateTags,
  }
}
