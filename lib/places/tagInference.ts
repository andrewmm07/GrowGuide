import type { AUHardinessZone, Climate, Microclimate, MicroclimateTag } from '@/lib/types/location'
import { mapZoneToClimate } from '@/lib/types/location'
import { isNearAustralianCoast } from './coastHeuristics'
import { isLikelyHighland } from './elevationHeuristics'

const COASTAL_NAME_KEYS = new Set(
  [
    'manly',
    'bondi',
    'cronulla',
    'newcastle',
    'wollongong',
    'st kilda',
    'brighton',
    'glenelg',
    'henley beach',
    'fremantle',
    'blackmans bay',
    'kingston',
    'sandy bay',
    'battery point',
    'taroona',
    'howrah',
    'lauderdale',
    'bellerine',
    'broadbeach',
    'surfers paradise',
    'noosa heads',
    'maroochydore',
    'caloundra',
    'port douglas',
    'coffs harbour',
    'margaret river',
    'busselton',
    'applecross',
  ].map((s) => s.toLowerCase())
)

export function slugifyPlaceId(state: string, name: string): string {
  const st = state.trim().toLowerCase()
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${st}-${slug}`
}

export function tagsFromLegacyMicroclimate(
  legacy?: Microclimate
): MicroclimateTag[] | undefined {
  if (legacy === 'coastal') return ['coastal']
  if (legacy === 'inland') return ['inland']
  return undefined
}

/** Default tags from zone + place name when not explicitly curated. */
export function inferDefaultTags(
  name: string,
  state: string,
  zone: AUHardinessZone,
  explicit?: MicroclimateTag[],
  coords?: { lat: number; lon: number }
): MicroclimateTag[] {
  if (explicit && explicit.length > 0) return explicit

  const climate = mapZoneToClimate(zone)
  const lower = name.toLowerCase()
  const st = state.toUpperCase()

  if (COASTAL_NAME_KEYS.has(lower)) return ['coastal']

  if (coords && isNearAustralianCoast(coords.lat, coords.lon)) {
    if (st === 'WA' || st === 'SA') return ['coastal', 'mediterranean']
    if (climate === 'tropical') return ['coastal', 'tropical_wet_dry']
    if (climate === 'warm') return ['coastal', 'subtropical_humid']
    return ['coastal']
  }

  if (coords && isLikelyHighland(name, coords.lat, coords.lon, zone)) {
    return ['alpine_highland', 'inland']
  }

  if (climate === 'tropical') {
    if (lower.includes('alice') || st === 'NT' && lower.includes('springs')) {
      return ['arid_inland']
    }
    return ['tropical_wet_dry']
  }

  if (st === 'WA' || st === 'SA') {
    if (COASTAL_NAME_KEYS.has(lower) || ['fremantle', 'glenelg', 'henley beach'].includes(lower)) {
      return ['mediterranean', 'coastal']
    }
    return ['mediterranean']
  }

  if (climate === 'warm' && (st === 'QLD' || st === 'NSW')) {
    if (['cairns', 'townsville', 'mackay', 'darwin', 'palmerston'].some((k) => lower.includes(k))) {
      return ['tropical_wet_dry']
    }
    return ['subtropical_humid']
  }

  if (['ballarat', 'orange', 'bathurst', 'armidale', 'toowoomba'].some((k) => lower.includes(k))) {
    return ['inland', 'alpine_highland']
  }

  if (['canberra', 'launceston', 'invermay', 'riverside'].some((k) => lower.includes(k))) {
    return ['inland']
  }

  if (climate === 'cold' || climate === 'cool') {
    return ['inland']
  }

  if (climate === 'temperate') {
    return ['inland']
  }

  return ['inland']
}

export function formatTagsLabel(tags: MicroclimateTag[]): string {
  const labels: Record<MicroclimateTag, string> = {
    coastal: 'Coastal',
    inland: 'Inland',
    alpine_highland: 'Highland',
    arid_inland: 'Arid inland',
    mediterranean: 'Mediterranean',
    subtropical_humid: 'Subtropical',
    tropical_wet_dry: 'Tropical wet/dry',
    urban_heat: 'Urban',
  }
  return tags.map((t) => labels[t] ?? t).join(' · ')
}
