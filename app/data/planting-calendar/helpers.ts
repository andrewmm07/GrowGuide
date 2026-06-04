import type { Climate, UserLocation } from '@/lib/types/location'
import { applyGuidanceModifiers } from '@/lib/microclimate/guidanceModifiers'
import { resolveLocationContext } from '@/lib/microclimate/resolve'
import { getPlantingRecommendationsForMonth } from '@/lib/plantingRecommendations'
import type { PlantingMonth } from '@/lib/planting/types'
import type { PlantInfo } from '@/app/types/plants'
import { getMonthGuidance, monthGuidanceToOverview, monthGuidanceToRichOverview } from './month-guidance'
import type { MonthGuidance } from './month-guidance-types'
import { PLANTING_CALENDAR_MONTHS } from './constants'
import { getMonthOverviewFromSharpVoiceCsv } from './month-overview-lookup'
import { getRichMonthOverview } from './rich-state-month-summaries'
import { getLegacyCalendarStateSummaries } from './helpers-legacy-summaries'

export type { MonthGuidance } from './month-guidance-types'
export { getMonthGuidance, monthGuidanceToOverview, monthGuidanceToRichOverview } from './month-guidance'

function capitalizeMonth(month: string): string {
  const lower = month.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

/** Climate-first month guidance; state used for legacy fallback only. */
export function getMonthGuidanceForUser(
  climate: Climate | undefined,
  state: string,
  month: string,
  location?: Pick<UserLocation, 'city' | 'state' | 'microclimateTags' | 'placeId' | 'microclimate'> | null
): MonthGuidance {
  const cap = capitalizeMonth(month)
  const guidance = getMonthGuidance(climate, state, cap)
  if (!location) return guidance

  const locCtx = resolveLocationContext(location as UserLocation)
  if (!locCtx || !climate) return guidance

  const adjusted = applyGuidanceModifiers(
    { focus: guidance.focus, weekLine: '', frost: null },
    {
      climate,
      season: getMonthSeason(cap),
      month: cap,
      weekBand: 'mid',
      weekInSeason: 0,
      tags: locCtx.microclimateTags,
    }
  )
  return { ...guidance, focus: adjusted.focus }
}

/** Rich overview for year calendar — sharp-voice CSV first, then legacy guidance. */
export function getRichMonthOverviewForLocation(
  location: Pick<
    UserLocation,
    'climate' | 'state' | 'city' | 'microclimateTags' | 'placeId' | 'microclimate'
  > | null,
  month: string,
  stateFallback = ''
): string {
  const cap = capitalizeMonth(month)
  const state = location?.state ?? stateFallback

  const fromCsv = getMonthOverviewFromSharpVoiceCsv(location, cap)
  if (fromCsv) return fromCsv

  if (location?.climate) {
    const guidance = getMonthGuidanceForUser(location.climate, state, cap, location)
    const rich = monthGuidanceToRichOverview(guidance)
    if (rich) return rich
  }

  return getRichMonthOverview(state, cap, location?.climate)
}

export { getRichMonthOverview } from './rich-state-month-summaries'

/** Full rich paragraph overview (state-specific legacy prose). */
export function getCalendarMonthRichOverview(state: string, month: string): string {
  return getRichMonthOverview(state, month)
}

/** @deprecated Prefer getMonthGuidanceForUser — returns focus line only. */
export function getCalendarStateSummaries(state: string): Record<string, string> {
  return getLegacyCalendarStateSummaries(state)
}

export function hasCalendarStateSummaries(state: string): boolean {
  return Boolean(state?.trim())
}

/** True when location can show month guidance (climate-first). */
export function hasMonthGuidanceForLocation(
  location: Pick<UserLocation, 'climate' | 'auHardinessZone' | 'state'> | null | undefined
): boolean {
  if (!location?.state?.trim()) return false
  return Boolean(location.climate || location.auHardinessZone)
}

/** Prefer getMonthGuidanceForUser; uses structured climate data when climate is known. */
export function getCalendarMonthOverview(
  state: string,
  month: string,
  climate?: Climate
): string {
  return monthGuidanceToOverview(getMonthGuidance(climate, state, month))
}

export function getCalendarMonthActivities(
  state: string,
  month: string,
  climate?: Climate
): string[] {
  const guidance = getMonthGuidance(climate, state, month)
  if (guidance.tasks.length > 0) return guidance.tasks
  const text = monthGuidanceToOverview(guidance)
  return text ? [text] : []
}

/** Sow/plant rows for one month (canonical climate matrix). */
export function plantingActivitiesForMonth(
  location: Pick<UserLocation, 'climate' | 'auHardinessZone' | 'state'> | null | undefined,
  month: PlantingMonth
): PlantInfo[] {
  const { sow, plant } = getPlantingRecommendationsForMonth(location, month)
  return [
    ...sow.map((name) => ({ name, type: 'sow' as const })),
    ...plant.map((name) => ({ name, type: 'plant' as const })),
  ]
}

export { resolveCalendarPlantName, hasCalendarPlantDetails } from '@/lib/planting/plantNameAliases'

/** Year grid: month name → sow/plant activities for the user's climate. */
export function buildClimatePlantingGuideForLocation(
  location: Pick<UserLocation, 'climate' | 'auHardinessZone' | 'state'> | null | undefined
): Record<string, PlantInfo[]> {
  const guide: Record<string, PlantInfo[]> = {}
  for (const month of PLANTING_CALENDAR_MONTHS) {
    guide[month] = plantingActivitiesForMonth(location, month as PlantingMonth)
  }
  return guide
}

export function getMonthSeason(month: string): string {
  const seasons = {
    Summer: ['December', 'January', 'February'],
    Autumn: ['March', 'April', 'May'],
    Winter: ['June', 'July', 'August'],
    Spring: ['September', 'October', 'November'],
  }

  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(month) || months.map((m) => m.toLowerCase()).includes(month.toLowerCase())) {
      return season
    }
  }
  return ''
}
