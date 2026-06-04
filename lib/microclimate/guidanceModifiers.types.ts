import type { Climate, MicroclimateTag } from '@/lib/types/location'

export type WeekBand = 'early' | 'mid' | 'late'

export interface ModifierContext {
  climate: Climate
  season: string
  month: string
  weekBand: WeekBand
  /** 1–12 within the current season (for unique weekly copy). */
  weekInSeason: number
  tags: MicroclimateTag[]
}

export interface GuidanceFragments {
  focus: string
  weekLine: string
  frost: string | null
  /** When set, used as the full dashboard paragraph (other fragments ignored). */
  overview?: string | null
}

export type ModifierRule = {
  tags?: MicroclimateTag[]
  /** Skip rule when any of these tags are present. */
  excludeTags?: MicroclimateTag[]
  climates?: Climate[]
  season?: string
  month?: string
  weekBand?: WeekBand | WeekBand[]
  weekInSeason?: number | number[]
  set: Partial<GuidanceFragments>
}
