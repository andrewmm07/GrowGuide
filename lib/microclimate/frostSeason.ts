import type { Climate, MicroclimateTag } from '@/lib/types/location'
import type { FrostProfile, LocationContext } from '@/lib/microclimate/resolve'

/** How forecast and seasonal copy treat frost for a location and date. */
export interface FrostGuidanceConfig {
  /** Show month/week frost hints on the season card. */
  seasonalFrostAdvice: boolean
  /** Min °C at or below which to warn from forecast data; null disables frost tips. */
  forecastFrostMinC: number | null
}

function hasTag(tags: MicroclimateTag[], tag: MicroclimateTag): boolean {
  return tags.includes(tag)
}

function toDayOfYear(month: number, day: number): number {
  const d = new Date(2024, month - 1, day)
  const start = new Date(2024, 0, 0)
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000)
}

function shiftFrostDate(
  month: number,
  day: number,
  weekOffset: number
): { month: number; day: number } {
  const d = new Date(2024, month - 1, day)
  d.setDate(d.getDate() + weekOffset * 7)
  return { month: d.getMonth() + 1, day: d.getDate() }
}

/** True when regional first/last frost window includes this date (Southern Hemisphere calendar). */
export function isInRegionalFrostSeason(profile: FrostProfile, date: Date = new Date()): boolean {
  const first = shiftFrostDate(
    profile.firstFrostDateMonth,
    profile.firstFrostDateDay,
    profile.firstFrostWeekOffset
  )
  const last = shiftFrostDate(
    profile.lastFrostDateMonth,
    profile.lastFrostDateDay,
    profile.lastFrostWeekOffset
  )

  const now = toDayOfYear(date.getMonth() + 1, date.getDate())
  const firstDoy = toDayOfYear(first.month, first.day)
  const lastDoy = toDayOfYear(last.month, last.day)

  if (firstDoy <= lastDoy) {
    return now >= firstDoy && now <= lastDoy
  }
  return now >= firstDoy || now <= lastDoy
}

function forecastThresholdInSeason(
  climate: Climate,
  tags: MicroclimateTag[]
): number {
  if (hasTag(tags, 'alpine_highland')) return 0
  if (hasTag(tags, 'coastal')) return 4
  if (hasTag(tags, 'urban_heat')) return 3
  if (climate === 'cold' || climate === 'cool') return 2
  return 2
}

/** Resolve frost guidance for weather panels and seasonal copy. */
export function getFrostGuidanceConfig(
  ctx: LocationContext | null,
  date: Date = new Date()
): FrostGuidanceConfig {
  if (!ctx) {
    return { seasonalFrostAdvice: true, forecastFrostMinC: 2 }
  }

  const { climate, microclimateTags: tags, frostProfile, seasonCalendar } = ctx
  const inSeason = isInRegionalFrostSeason(frostProfile, date)

  if (
    seasonCalendar === 'tropical_wet_dry' &&
    !hasTag(tags, 'alpine_highland')
  ) {
    return { seasonalFrostAdvice: false, forecastFrostMinC: null }
  }

  if (climate === 'tropical') {
    return { seasonalFrostAdvice: false, forecastFrostMinC: 0 }
  }

  if (climate === 'warm' && !inSeason) {
    return { seasonalFrostAdvice: false, forecastFrostMinC: 0 }
  }

  if (!inSeason) {
    return {
      seasonalFrostAdvice: false,
      forecastFrostMinC: 0,
    }
  }

  return {
    seasonalFrostAdvice: true,
    forecastFrostMinC: forecastThresholdInSeason(climate, tags),
  }
}

export function shouldWarnForecastFrost(
  minC: number,
  config: FrostGuidanceConfig
): boolean {
  const threshold = config.forecastFrostMinC
  if (threshold === null) return false
  return minC <= threshold
}
