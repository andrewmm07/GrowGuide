import type {
  AccumulatedCondition,
  SignalMagnitude,
  WeeklyGuidanceInferenceInput,
  WeeklyGuidanceInferenceResult,
} from '@/lib/types/weatherGuidance'
import { appendClause, replacedParagraph } from '@/lib/weeklyGuidanceInferenceTemplates'
import {
  frameAppendedClause,
  frameReplacedParagraph,
  resolveWeatherClauseTone,
  type WeatherClauseTone,
} from '@/lib/weeklyGuidanceWeatherTone'

const REDUCE_WATERING_PATTERN = /\b(ease back|reduce watering|water less|ease watering)\b/i
const INCREASE_WATERING_PATTERN = /\b(water deeply|keep water up|increase watering|soil moisture)\b/i
const WET_BED_ACTION_PATTERN =
  /\b(avoid digging wet beds?|sodden soil|waterlogged soil|stay off sodden soil)\b/i

export function hasWateringConflict(
  baseWeekLine: string,
  accumulatedCondition: AccumulatedCondition
): boolean {
  const base = baseWeekLine.toLowerCase()
  const suggestsReduce = REDUCE_WATERING_PATTERN.test(base)
  const suggestsIncrease = INCREASE_WATERING_PATTERN.test(base)
  const dryOrWarm =
    accumulatedCondition.dominantSignal === 'DRY' ||
    accumulatedCondition.soilMoistureState === 'dry'

  const wetOrSaturated =
    accumulatedCondition.dominantSignal === 'WET' ||
    accumulatedCondition.soilMoistureState === 'wet' ||
    accumulatedCondition.soilMoistureState === 'saturated'

  if (suggestsReduce && dryOrWarm) return true
  if (suggestsIncrease && wetOrSaturated) return true
  return false
}

export function hasSoilStateConflict(
  baseWeekLine: string,
  accumulatedCondition: AccumulatedCondition
): boolean {
  const base = baseWeekLine.toLowerCase()
  if (accumulatedCondition.soilMoistureState === 'dry' && WET_BED_ACTION_PATTERN.test(base)) {
    return true
  }
  return false
}

function isMarginalWarm(magnitude: SignalMagnitude | null): boolean {
  return magnitude === 'marginal' || magnitude == null
}

function shouldReplaceBaseLine(input: WeeklyGuidanceInferenceInput): boolean {
  const { accumulatedCondition: acc } = input
  if (
    hasWateringConflict(input.baseWeekLine, acc) &&
    acc.streakWeeks >= 2 &&
    acc.currentWeekSignal !== 'NORMAL'
  ) {
    return true
  }
  if (
    hasSoilStateConflict(input.baseWeekLine, acc) &&
    acc.soilMoistureState === 'dry' &&
    acc.currentWeekSignal === 'DRY'
  ) {
    return true
  }

  if (!acc.sustainedAnomaly) return false

  // Wet/saturated: always append — keep seasonal week framing on the dashboard.
  if (acc.soilMoistureState === 'wet' || acc.soilMoistureState === 'saturated') {
    return false
  }

  if (acc.soilMoistureState === 'dry') {
    if (input.tags.includes('mediterranean') && input.season === 'Summer') return false
    return acc.streakWeeks >= 2
  }

  if (acc.dominantSignal === 'WARM') {
    return !isMarginalWarm(input.warmMagnitude) && acc.streakWeeks >= 2
  }

  return false
}

function resolveReplaceProfile(input: WeeklyGuidanceInferenceInput): Parameters<typeof replacedParagraph>[5] {
  const acc = input.accumulatedCondition

  if (input.frostThisWeek && (acc.soilMoistureState === 'dry' || input.dryMagnitude)) {
    return 'frost_dry'
  }

  if (
    acc.soilMoistureState === 'dry' &&
    acc.temperatureTrend !== 'near_norm' &&
    (input.warmMagnitude != null || acc.forecastTempDirection === 'warming')
  ) {
    return 'dry_warm'
  }

  if (
    acc.soilMoistureState === 'dry' &&
    acc.streakWeeks >= 2 &&
    (acc.currentWeekSignal === 'WET' || acc.currentWeekRainRelief)
  ) {
    return 'transition_dry_then_wet'
  }

  if (acc.soilMoistureState === 'saturated') return 'saturated'
  if (acc.soilMoistureState === 'wet') return 'wet'
  if (acc.soilMoistureState === 'dry') return 'dry'
  if (acc.dominantSignal === 'WARM') return 'warm'
  if (acc.dominantSignal === 'COOL') return 'cool'
  return 'dry'
}

function resolveAppendKind(input: WeeklyGuidanceInferenceInput): Parameters<typeof appendClause>[5] | null {
  const acc = input.accumulatedCondition

  if (input.frostThisWeek) return 'frost'

  if (acc.soilMoistureState === 'dry' && (acc.currentWeekSignal === 'WET' || acc.currentWeekRainRelief)) {
    return 'transition_wet_after_dry'
  }
  if (
    (acc.soilMoistureState === 'wet' || acc.soilMoistureState === 'saturated') &&
    acc.currentWeekSignal === 'DRY'
  ) {
    return 'transition_dry_after_wet'
  }
  if (
    (acc.soilMoistureState === 'wet' || acc.soilMoistureState === 'saturated') &&
    acc.currentWeekSignal === 'NORMAL'
  ) {
    return 'wet_settling'
  }

  if (acc.soilMoistureState === 'wet' || acc.soilMoistureState === 'saturated') {
    return 'wet'
  }
  if (acc.soilMoistureState === 'dry' || acc.dominantSignal === 'DRY') {
    return 'dry'
  }
  if (acc.dominantSignal === 'WARM') {
    return 'warm'
  }
  if (acc.dominantSignal === 'COOL') {
    return 'cool'
  }

  return null
}

function resolveTone(input: WeeklyGuidanceInferenceInput): WeatherClauseTone {
  const acc = input.accumulatedCondition
  const weeks = input.weekWeather ?? []
  if (weeks.length === 0) return acc.currentWeekIsForecast ? 'forecast' : 'observed'
  return resolveWeatherClauseTone(acc, weeks)
}

export function inferWeeklyGuidance(input: WeeklyGuidanceInferenceInput): WeeklyGuidanceInferenceResult {
  const base = input.baseWeekLine.trim().replace(/\s+/g, ' ')
  const acc = input.accumulatedCondition
  const tone = resolveTone(input)

  const hasMoistureSignal =
    acc.dominantSignal != null &&
    acc.dominantSignal !== 'NORMAL' &&
    acc.dominantSignal !== 'WARM' &&
    acc.dominantSignal !== 'COOL'
  const hasTempSignal =
    acc.dominantSignal === 'WARM' || acc.dominantSignal === 'COOL' || acc.temperatureTrend !== 'near_norm'

  const anySignal =
    hasMoistureSignal ||
    hasTempSignal ||
    acc.soilMoistureState !== 'normal' ||
    input.frostThisWeek

  if (!anySignal && !acc.sustainedAnomaly) {
    return { inferredParagraph: base, replacedBaseLine: false, weatherClauseTone: tone }
  }

  if (shouldReplaceBaseLine(input)) {
    const profile = resolveReplaceProfile(input)
    const replaced = replacedParagraph(
      input.season,
      input.weekInSeason,
      input.weekBand,
      input.tags,
      input.climate,
      profile,
      {
        dry: input.dryMagnitude,
        wet: input.wetMagnitude,
        warm: input.warmMagnitude,
      },
      {
        rain: acc.forecastDirection,
        temp: acc.forecastTempDirection,
      }
    )
    return {
      inferredParagraph: frameReplacedParagraph(replaced, tone),
      replacedBaseLine: true,
      weatherClauseTone: tone,
    }
  }

  const appendKind = resolveAppendKind(input)
  if (!appendKind) {
    return { inferredParagraph: base, replacedBaseLine: false, weatherClauseTone: tone }
  }

  const clause = appendClause(
    input.season,
    input.weekInSeason,
    input.weekBand,
    input.tags,
    input.climate,
    appendKind,
    input.warmMagnitude,
    input.wetMagnitude,
    input.baseWeekLine
  )

  return {
    inferredParagraph: `${base.replace(/[.!?]+\s*$/, '')}. ${frameAppendedClause(clause, tone)}`,
    replacedBaseLine: false,
    weatherClauseTone: tone,
  }
}
