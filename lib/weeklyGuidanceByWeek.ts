/**
 * Canonical week-of-season guidance (14 unique lines per climate × season).
 */

import type { Climate } from '@/lib/types/location'
import type { SouthernSeason } from '@/lib/seasonDisplay'
import { applyGuidanceModifiers } from '@/lib/microclimate/guidanceModifiers'
import type { MicroclimateTag } from '@/lib/types/location'
import type { WeekBand } from '@/lib/microclimate/guidanceModifiers.types'
import { getWeekLinesForClimateSeason } from '@/lib/weeklyGuidanceWeekLines'

export function weekBandFromIndex(weekInSeason: number): WeekBand {
  if (weekInSeason <= 4) return 'early'
  if (weekInSeason <= 8) return 'mid'
  return 'late'
}

/** Base guidance for one week of the season (1–12), before microclimate and weather. */
export function getBaseWeekGuidanceLine(
  climate: Climate,
  season: SouthernSeason,
  weekInSeason: number,
  guidanceLineWeek?: number,
  tags: MicroclimateTag[] = []
): string {
  const week = Math.min(
    14,
    Math.max(1, Math.round(guidanceLineWeek ?? weekInSeason))
  )
  const lines = getWeekLinesForClimateSeason(climate, season, tags)
  return lines[week - 1] ?? lines[0]
}

export interface WeeklyLineContext {
  climate: Climate
  season: SouthernSeason
  month: string
  weekInSeason: number
  guidanceLineWeek?: number
  weekBand: WeekBand
  tags: MicroclimateTag[]
}

/** Week line after tag modifiers (coastal, inland, etc.). */
export function resolveWeeklyGuidanceLine(ctx: WeeklyLineContext): string {
  const base = getBaseWeekGuidanceLine(
    ctx.climate,
    ctx.season,
    ctx.weekInSeason,
    ctx.guidanceLineWeek,
    ctx.tags
  )
  const adjusted = applyGuidanceModifiers(
    { focus: '', weekLine: base, frost: null },
    {
      climate: ctx.climate,
      season: ctx.season,
      month: ctx.month,
      weekBand: ctx.weekBand,
      weekInSeason: ctx.weekInSeason,
      tags: ctx.tags,
    }
  )
  let line = (adjusted.overview ?? adjusted.weekLine).trim()
  const monthFocus = adjusted.focus?.trim()
  if (
    monthFocus &&
    ctx.tags.includes('mediterranean') &&
    adjusted.weekLine.trim() === base.trim() &&
    (ctx.weekInSeason === 1 || ctx.weekInSeason === 5 || ctx.weekInSeason === 9)
  ) {
    line = /[.!?]\s*$/.test(monthFocus) ? monthFocus : `${monthFocus}.`
  }
  const frost = adjusted.frost?.trim()
  if (frost && !/\b(frost|frost-hardy|cold night|cover tender|below 2)\b/i.test(line)) {
    line = `${line.replace(/[.!?]+\s*$/, '')}. ${frost.replace(/[.!?]+\s*$/, '')}.`
  }
  return line
}
