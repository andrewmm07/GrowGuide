import type {
  AUHardinessZone,
  Climate,
  FrostDates,
  MicroclimateTag,
  UserLocation,
} from '@/lib/types/location'
import { getFrostDates, mapZoneToClimate } from '@/lib/types/location'
import { normalizeUserLocation } from '@/lib/location/normalizeUserLocation'

export type SeasonCalendarModel = 'southern_four_seasons' | 'tropical_wet_dry'

export interface FrostProfile extends FrostDates {
  /** Weeks to shift last frost later (coastal) or earlier (highland). */
  lastFrostWeekOffset: number
  /** Weeks to shift first frost later (coastal). */
  firstFrostWeekOffset: number
}

export interface LocationContext {
  climate: Climate
  zone: AUHardinessZone
  microclimateTags: MicroclimateTag[]
  frostProfile: FrostProfile
  seasonCalendar: SeasonCalendarModel
  placeId?: string
  city: string
  state: string
}

function hasTag(tags: MicroclimateTag[], tag: MicroclimateTag): boolean {
  return tags.includes(tag)
}

function deriveSeasonCalendar(tags: MicroclimateTag[], climate: Climate): SeasonCalendarModel {
  if (hasTag(tags, 'tropical_wet_dry') || (climate === 'tropical' && !hasTag(tags, 'arid_inland'))) {
    return 'tropical_wet_dry'
  }
  return 'southern_four_seasons'
}

function deriveFrostOffsets(tags: MicroclimateTag[]): {
  lastFrostWeekOffset: number
  firstFrostWeekOffset: number
} {
  let lastFrostWeekOffset = 0
  let firstFrostWeekOffset = 0

  if (hasTag(tags, 'coastal')) {
    // Later autumn frost onset only; do not push spring last-frost into October (peak tomato planting).
    firstFrostWeekOffset += 2
  }
  if (hasTag(tags, 'alpine_highland')) {
    lastFrostWeekOffset -= 2
    firstFrostWeekOffset -= 1
  }
  if (hasTag(tags, 'urban_heat')) {
    lastFrostWeekOffset += 1
    firstFrostWeekOffset += 1
  }
  if (hasTag(tags, 'arid_inland')) {
    lastFrostWeekOffset -= 1
  }

  return { lastFrostWeekOffset, firstFrostWeekOffset }
}

export function buildFrostProfile(zone: AUHardinessZone, tags: MicroclimateTag[]): FrostProfile {
  const base = getFrostDates(zone)
  const offsets = deriveFrostOffsets(tags)
  return { ...base, ...offsets }
}

/** Canonical location context for guidance, weather thresholds, and calendar framing. */
export function resolveLocationContext(
  location: UserLocation | Partial<UserLocation> | null | undefined
): LocationContext | null {
  const normalized = normalizeUserLocation(location ?? {})
  if (!normalized) return null

  const tags = normalized.microclimateTags
  const climate = normalized.climate ?? mapZoneToClimate(normalized.auHardinessZone)

  return {
    climate,
    zone: normalized.auHardinessZone,
    microclimateTags: tags,
    frostProfile: buildFrostProfile(normalized.auHardinessZone, tags),
    seasonCalendar: deriveSeasonCalendar(tags, climate),
    placeId: normalized.placeId,
    city: normalized.city,
    state: normalized.state,
  }
}

export function formatGrowingContextLabel(ctx: LocationContext): string {
  const climateLabel: Record<Climate, string> = {
    cold: 'Cold',
    cool: 'Cool',
    temperate: 'Temperate',
    warm: 'Warm',
    tropical: 'Tropical',
  }
  const primary = ctx.microclimateTags[0]
  const tagShort: Partial<Record<MicroclimateTag, string>> = {
    coastal: 'coastal',
    inland: 'inland',
    alpine_highland: 'highland',
    arid_inland: 'arid',
    mediterranean: 'mediterranean',
    subtropical_humid: 'subtropical',
    tropical_wet_dry: 'wet/dry tropics',
    urban_heat: 'urban',
  }
  const tag = primary ? tagShort[primary] : undefined
  return tag
    ? `${climateLabel[ctx.climate]} climate · ${tag}`
    : `${climateLabel[ctx.climate]} climate`
}
