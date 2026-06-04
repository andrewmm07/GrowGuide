import type { AUHardinessZone } from '@/lib/types/location'

/** Named localities known to sit well above surrounding plains. */
const HIGHLAND_NAME_KEYS = new Set(
  [
    'katoomba',
    'blackheath',
    'wentworth falls',
    'orange',
    'bathurst',
    'armidale',
    'toowoomba',
    'ballarat',
    'daylesford',
    'healesville',
    'warburton',
    'mount barker',
    'stirling',
    'hahndorf',
    'lobethal',
    'gumeracha',
    'woodend',
    'kyneton',
    'castlemaine',
    'beechworth',
    'bright',
    'mount beauty',
    'marysville',
    'oberon',
    'cooma',
    'jindabyne',
    'thredbo',
    'mount gambier',
  ].map((s) => s.toLowerCase())
)

/** Rough bounding boxes for elevated regions (lat/lon). */
const HIGHLAND_REGIONS: ReadonlyArray<{
  minLat: number
  maxLat: number
  minLon: number
  maxLon: number
}> = [
  { minLat: -33.85, maxLat: -33.55, minLon: 150.15, maxLon: 150.45 }, // Blue Mountains
  { minLat: -37.65, maxLat: -37.35, minLon: 143.7, maxLon: 144.1 }, // Ballarat uplands
  { minLat: -36.95, maxLat: -36.55, minLon: 147.0, maxLon: 147.6 }, // Alps fringe
]

export function isLikelyHighland(
  name: string,
  lat: number,
  lon: number,
  zone: AUHardinessZone
): boolean {
  const lower = name.toLowerCase()
  if (HIGHLAND_NAME_KEYS.has(lower)) return true
  if (lower.includes('heights') || lower.includes('highlands')) return true
  if (zone === '8a' || zone === '9a') {
    for (const r of HIGHLAND_REGIONS) {
      if (lat >= r.minLat && lat <= r.maxLat && lon >= r.minLon && lon <= r.maxLon) {
        return true
      }
    }
  }
  return false
}
