import type { AUHardinessZone } from '@/lib/types/location'
import type { AuPlace } from './types'
import { inferDefaultTags, slugifyPlaceId } from './tagInference'

/** Compact seed: name, state, lat, lon, zone */
export type PlaceSeed = readonly [
  string,
  string,
  number,
  number,
  AUHardinessZone,
]

export function placeFromSeed(seed: PlaceSeed): AuPlace {
  const [name, state, lat, lon, auHardinessZone] = seed
  const microclimateTags = inferDefaultTags(name, state, auHardinessZone, undefined, {
    lat,
    lon,
  })
  return {
    id: slugifyPlaceId(state, name),
    name,
    state,
    lat,
    lon,
    auHardinessZone,
    microclimateTags,
  }
}
