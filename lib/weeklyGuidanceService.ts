/**
 * Composed weekly season guidance for the dashboard.
 * One unique line per week-in-season (1–14), plus a single weather adjustment clause.
 */

import type { Climate, UserLocation } from '@/lib/types/location'
import { getMonthSeason } from '@/app/data/planting-calendar/helpers'
import { resolveLocationContext } from '@/lib/microclimate/resolve'
import { computeSeasonDisplay, type SouthernSeason } from '@/lib/seasonDisplay'
import {
  resolveWeeklyGuidanceLine,
  weekBandFromIndex,
} from '@/lib/weeklyGuidanceByWeek'
import { applySeasonWeekFrame } from '@/lib/weeklyGuidanceSeasonFrame'
import {
  weaveWeatherIntoWeekLine,
  type WeatherSignal,
  type WeatherSignalDetail,
} from '@/lib/weatherSignal'
import { buildAccumulatedCondition } from '@/lib/rollingWeatherCondition'
import { inferWeeklyGuidance } from '@/lib/weeklyGuidanceInference'
import type { RollingWeatherContext } from '@/lib/weatherSignal'
import type { WeatherClauseTone } from '@/lib/weeklyGuidanceWeatherTone'

type WeekBand = 'early' | 'mid' | 'late'

export type WeeklyGuidanceWeekBand = WeekBand

export interface WeeklySeasonGuidance {
  /** Display label, e.g. "Winter" or "Wet season". */
  season: string
  weekInSeason: number
  /** Line lookup week (may differ from display when season exceeds 14 weeks). */
  guidanceLineWeek?: number
  overview: string
  bandSeason: SouthernSeason
  weekBand: WeekBand
  month: string
  climate: Climate
  /** Set when weather enrichment ran; drives forecast vs observed footnote. */
  weatherClauseTone?: WeatherClauseTone
}

/** @deprecated Use computeSeasonDisplay */
export function computeSeasonWeek(date: Date = new Date()) {
  const display = computeSeasonDisplay(date, 'southern_four_seasons')
  return {
    season: display.bandSeason as SouthernSeason,
    weekInSeason: display.weekInSeason,
    month: display.month,
  }
}

/**
 * Dashboard season card: unique week line + optional weather vs seasonal norms.
 */
export function buildWeeklySeasonGuidance(
  location: UserLocation,
  date: Date = new Date()
): WeeklySeasonGuidance | null {
  if (!location.state) return null

  const locCtx = resolveLocationContext(location)
  const seasonDisplay = computeSeasonDisplay(
    date,
    locCtx?.seasonCalendar ?? 'southern_four_seasons'
  )
  const { label, weekInSeason, guidanceLineWeek, month, bandSeason } = seasonDisplay
  const climate = location.climate ?? 'cool'
  const weekBand = weekBandFromIndex(weekInSeason)
  const tags = locCtx?.microclimateTags ?? []

  const baseLine = resolveWeeklyGuidanceLine({
    climate,
    season: bandSeason,
    month,
    weekInSeason,
    guidanceLineWeek,
    weekBand,
    tags,
  })

  const place =
    locCtx?.city?.trim() ||
    location.city?.trim() ||
    locCtx?.state?.trim() ||
    location.state?.trim() ||
    'your garden'

  const overview = applySeasonWeekFrame({
    place,
    seasonLabel: label,
    bandSeason,
    weekInSeason,
    guidanceLineWeek,
    weekBand,
    climate,
    tags,
    baseLine,
  })

  return {
    season: label,
    weekInSeason,
    guidanceLineWeek,
    overview,
    bandSeason,
    weekBand,
    month,
    climate,
  }
}

/** Apply past-week weather vs historical norms (one woven clause, not stacked blocks). */
export function applyWeatherToWeeklyOverview(
  guidance: WeeklySeasonGuidance,
  signal: WeatherSignal | null,
  detail?: WeatherSignalDetail | null,
  rolling?: RollingWeatherContext | null,
  tags: string[] = []
): WeeklySeasonGuidance {
  const effectiveSignal = signal ?? rolling?.signal ?? null
  if (!effectiveSignal && !rolling) return guidance

  if (rolling != null) {
    const accumulated = buildAccumulatedCondition(rolling.weekWeather, rolling.weekNorms)
    const inferred = inferWeeklyGuidance({
      baseWeekLine: guidance.overview,
      accumulatedCondition: accumulated,
      season: guidance.bandSeason,
      weekInSeason: guidance.guidanceLineWeek ?? guidance.weekInSeason,
      weekBand: guidance.weekBand,
      climate: guidance.climate,
      tags,
      frostThisWeek:
        effectiveSignal?.frostEvent || rolling.signal.frostEvent || false,
      warmMagnitude: effectiveSignal?.warmMagnitude ?? rolling.signal.warmMagnitude,
      dryMagnitude: effectiveSignal?.dryMagnitude ?? rolling.signal.dryMagnitude,
      wetMagnitude: effectiveSignal?.wetMagnitude ?? rolling.signal.wetMagnitude,
      weekWeather: rolling.weekWeather,
    })
    return {
      ...guidance,
      overview: inferred.inferredParagraph,
      weatherClauseTone: inferred.weatherClauseTone,
    }
  }
  return {
    ...guidance,
    overview: weaveWeatherIntoWeekLine(
      guidance.overview,
      effectiveSignal,
      detail ?? null,
      {
        season: guidance.bandSeason,
        month: guidance.month,
        weekInSeason: guidance.weekInSeason,
        isForecastWeek: false,
      }
    ),
    weatherClauseTone: 'observed',
  }
}
