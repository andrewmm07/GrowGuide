import type { AUHardinessZone, MicroclimateTag } from '@/lib/types/location'

export const PLACES_DATA_VERSION = '2026.05.g'

export interface AuPlace {
  id: string
  name: string
  state: string
  lat: number
  lon: number
  auHardinessZone: AUHardinessZone
  /** Primary tag first; max 3. */
  microclimateTags: MicroclimateTag[]
}

export interface PlacePickerOption {
  id: string
  name: string
  state: string
  zone: AUHardinessZone
  tagsLabel: string
}
