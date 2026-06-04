/**
 * Gardening-oriented interpretation of live + daily forecast weather.
 */

import type { SeasonCalendarModel } from '@/lib/microclimate/resolve'
import {
  shouldWarnForecastFrost,
  type FrostGuidanceConfig,
} from '@/lib/microclimate/frostSeason'

export type { FrostGuidanceConfig } from '@/lib/microclimate/frostSeason'

export interface WeatherSeasonContext {
  seasonLabel: string
  seasonCalendar: SeasonCalendarModel
}

export type GardeningSynthesisTone = 'favorable' | 'caution' | 'neutral'

export interface GardeningSynthesis {
  tone: GardeningSynthesisTone
  summary: string
  details: string[]
}

export interface WeatherGardeningInput {
  currentTempC: number
  currentConditionCode: number
  currentConditionText: string
  windKph: number
  humidity: number
  todayMaxC: number
  todayMinC: number
  todayConditionCode: number
  todayConditionText: string
}

export function mapConditionEmoji(code: number): string {
  if (code === 1000) return '☀️'
  if (code === 1003) return '⛅️'
  if ([1006, 1009].includes(code)) return '☁️'
  if ([1030, 1135, 1147].includes(code)) return '🌫️'
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return '❄️'
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return '⛈️'
  return '🌧️'
}

function isRainCode(code: number): boolean {
  return (code >= 1063 && code <= 1201) || (code >= 1240 && code <= 1246)
}

function isStormCode(code: number): boolean {
  return [1087, 1273, 1276, 1279, 1282].includes(code)
}

function isHeavyRainCode(code: number): boolean {
  if (isStormCode(code)) return true
  return [1189, 1192, 1195, 1243, 1246].includes(code)
}

const FROST_MIN_C = 2
const HEATWAVE_MAX_C = 35
const HEAVY_WIND_KPH = 40

function isOvercast(code: number): boolean {
  return [1006, 1009].includes(code)
}

function seasonPhrase(season?: WeatherSeasonContext): string {
  if (season?.seasonLabel) return season.seasonLabel.toLowerCase()
  const month = new Date().getMonth()
  if (month >= 11 || month <= 1) return 'summer'
  if (month >= 2 && month <= 4) return 'autumn'
  if (month >= 5 && month <= 7) return 'winter'
  return 'spring'
}

function isWetSeasonMonth(season?: WeatherSeasonContext): boolean {
  if (season?.seasonCalendar !== 'tropical_wet_dry') return false
  return season.seasonLabel === 'Wet season'
}

export function buildGardeningSynthesis(
  input: WeatherGardeningInput,
  frostConfig?: FrostGuidanceConfig,
  season?: WeatherSeasonContext
): GardeningSynthesis {
  const {
    currentTempC,
    currentConditionCode,
    windKph,
    humidity,
    todayMaxC,
    todayMinC,
    todayConditionCode,
    todayConditionText,
  } = input

  const details: string[] = []
  let tone: GardeningSynthesisTone = 'neutral'
  const seasonName = seasonPhrase(season)
  const wetSeason = isWetSeasonMonth(season)

  const rainyNow = isRainCode(currentConditionCode) || isStormCode(currentConditionCode)
  const rainyToday = isRainCode(todayConditionCode) || isStormCode(todayConditionCode)
  const windy = windKph >= 30
  const breezy = windKph >= 20 && windKph < 30
  const hot = todayMaxC >= 28
  const warm = todayMaxC >= 22 && todayMaxC < 28
  const coolDay = todayMaxC < 14
  const frostRisk = shouldWarnForecastFrost(todayMinC, frostConfig ?? { seasonalFrostAdvice: true, forecastFrostMinC: FROST_MIN_C })
  const humid = humidity >= 85
  const mildBand = todayMaxC >= 15 && todayMaxC <= 25

  if (frostRisk) {
    tone = 'caution'
    details.push(
      `Overnight low around ${Math.round(todayMinC)}°C. Cover frost-tender plants or move pots under shelter.`
    )
  }

  if (hot) {
    tone = 'caution'
    details.push(
      `High near ${Math.round(todayMaxC)}°C. Water early, avoid heavy work 11am–3pm, and shade sensitive crops.`
    )
  } else if (coolDay && !rainyToday) {
    details.push(
      `Cool day (high ${Math.round(todayMaxC)}°C). Growth is slow; focus on pruning, planning, and indoor seed work.`
    )
  }

  if (rainyNow || rainyToday) {
    tone = 'caution'
    details.push(
      rainyNow
        ? wetSeason
          ? 'Wet season rain now. Skip watering; focus on drainage and undercover jobs.'
          : 'Wet now. Skip watering; tackle undercover jobs (potting, labels, tool maintenance).'
        : wetSeason
          ? `Rain in the forecast (${todayConditionText.toLowerCase()}). In wet season, delay open-bed sowing until soil drains.`
          : `Rain in the forecast (${todayConditionText.toLowerCase()}). Hold off sowing in open beds until soil dries.`
    )
  } else if (windy) {
    tone = 'caution'
    details.push(
      `Strong wind (~${Math.round(windKph)} km/h). Delay spraying and transplanting seedlings.`
    )
  } else if (breezy) {
    details.push(`Breezy (~${Math.round(windKph)} km/h). Fine for most work; stake tall plants if needed.`)
  }

  if (humid && !rainyToday) {
    tone = 'caution'
    details.push(
      wetSeason
        ? 'High humidity in wet season. Improve airflow to reduce fungal issues on leaves.'
        : 'High humidity. Improve airflow to reduce fungal issues on leaves.'
    )
  }

  let summary: string

  if (tone !== 'caution' && mildBand && !rainyToday && windKph < 20) {
    tone = 'favorable'
    if (isOvercast(todayConditionCode)) {
      summary = `Mild and overcast (up to ${Math.round(todayMaxC)}°C). Soft light and less water stress; good for transplanting, weeding, and feeding.`
    } else if (todayConditionCode === 1003) {
      summary = `Partly cloudy and comfortable (to ${Math.round(todayMaxC)}°C). One of the better days for planting and general garden work.`
    } else if (todayConditionCode === 1000) {
      summary = `Clear and mild (to ${Math.round(todayMaxC)}°C). Excellent for sowing, transplanting, and harvesting.`
    } else {
      summary = `Settled ${seasonName} conditions (to ${Math.round(todayMaxC)}°C). Suitable for most outdoor gardening tasks.`
    }
  } else if (hot) {
    summary = `Hot day ahead (${Math.round(todayMaxC)}°C max). Work early or late; prioritise watering and shade.`
  } else if (rainyToday || rainyNow) {
    summary = `Wet conditions. Outdoor sowing can wait; use the time for indoor prep or bed planning.`
  } else if (windy) {
    summary = `Windy day. Protect delicate plants and postpone spray or transplant jobs.`
  } else if (coolDay) {
    summary = `Cool (${Math.round(todayMaxC)}°C high, now ${Math.round(currentTempC)}°C). Gentle on plants; ideal for maintenance rather than heat-loving crops.`
  } else if (warm) {
    summary = `Warm (${Math.round(todayMaxC)}°C). Water in the morning; good for fast-growing ${seasonName} crops.`
  } else if (isOvercast(todayConditionCode)) {
    summary = `Overcast with a ${Math.round(todayMaxC)}°C high. Even light helps reduce heat stress; fine for most tasks if it stays dry.`
  } else {
    summary = `Typical ${seasonName} day (${Math.round(todayMinC)}–${Math.round(todayMaxC)}°C). Steady conditions for routine garden care.`
  }

  if (
    currentTempC + 4 < todayMaxC &&
    !rainyNow &&
    !hot &&
    details.length < 2
  ) {
    details.push(
      `Cool now (${Math.round(currentTempC)}°C) but warming to ${Math.round(todayMaxC)}°C. Mid-morning to afternoon is often the best window outdoors.`
    )
  }

  return {
    tone,
    summary,
    details: details.slice(0, 2),
  }
}

export interface ForecastDaySnapshot {
  date: string
  shortLabel: string
  minC: number
  maxC: number
  maxWindKph: number
  conditionCode: number
}

export function shortWeekdayLabel(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00')
    .toLocaleDateString('en-AU', { weekday: 'short' })
    .replace(/\.$/, '')
}

/** Prefer wind icon when gusty but not rainy. */
export function pickDayIcon(conditionCode: number, maxWindKph: number): string {
  if (
    maxWindKph >= 28 &&
    !isRainCode(conditionCode) &&
    !isStormCode(conditionCode)
  ) {
    return '💨'
  }
  return mapConditionEmoji(conditionCode)
}

/** Written guidance only for frost, heatwave, very heavy wind, or heavy rain. */
export function buildForecastGardenTips(
  days: ForecastDaySnapshot[],
  frostConfig?: FrostGuidanceConfig,
  season?: WeatherSeasonContext
): string[] {
  if (days.length === 0) return []

  const tips: string[] = []
  const frostCfg = frostConfig ?? { seasonalFrostAdvice: true, forecastFrostMinC: FROST_MIN_C }

  const frostDays = days.filter(d => shouldWarnForecastFrost(d.minC, frostCfg))
  if (frostDays.length === 1) {
    tips.push(
      `Frost expected on ${frostDays[0].shortLabel}. Protect tender plants.`
    )
  } else if (frostDays.length > 1) {
    tips.push(
      `Frost expected ${frostDays.map(d => d.shortLabel).join(', ')}. Protect tender plants.`
    )
  }

  const heatDays = days.filter(d => d.maxC >= HEATWAVE_MAX_C)
  if (heatDays.length === 1) {
    tips.push(
      `Heatwave ${heatDays[0].shortLabel} (to ${Math.round(heatDays[0].maxC)}°C). Water early and shade sensitive crops.`
    )
  } else if (heatDays.length > 1) {
    tips.push(
      `Heatwave ${heatDays.map(d => d.shortLabel).join(', ')}. Water early and shade sensitive crops.`
    )
  }

  const heavyRainDays = days.filter(d => isHeavyRainCode(d.conditionCode))
  if (heavyRainDays.length === 1) {
    tips.push(
      season?.seasonCalendar === 'tropical_wet_dry'
        ? `Heavy rain ${heavyRainDays[0].shortLabel}. Wet season: clear drainage before sowing in open beds.`
        : `Heavy rain ${heavyRainDays[0].shortLabel}. Hold off sowing and ensure drainage is clear.`
    )
  } else if (heavyRainDays.length > 1) {
    tips.push(
      season?.seasonCalendar === 'tropical_wet_dry'
        ? `Heavy rain ${heavyRainDays.map(d => d.shortLabel).join(', ')}. Let beds drain in wet season before outdoor work.`
        : `Heavy rain ${heavyRainDays.map(d => d.shortLabel).join(', ')}. Let beds dry before outdoor work.`
    )
  }

  const veryWindy = days.filter(d => d.maxWindKph >= HEAVY_WIND_KPH)
  if (veryWindy.length === 1) {
    tips.push(
      `Very strong wind ${veryWindy[0].shortLabel} (to ${Math.round(veryWindy[0].maxWindKph)} km/h). Delay spraying and transplanting.`
    )
  } else if (veryWindy.length > 1) {
    tips.push(
      `Very strong winds ${veryWindy.map(d => d.shortLabel).join(', ')}. Stake plants and hold off delicate work.`
    )
  }

  return tips.slice(0, 3)
}

export function getGardenNotices(
  input: WeatherGardeningInput,
  frostConfig?: FrostGuidanceConfig
): string[] {
  const notices: string[] = []
  const frostCfg = frostConfig ?? { seasonalFrostAdvice: true, forecastFrostMinC: FROST_MIN_C }
  if (shouldWarnForecastFrost(input.todayMinC, frostCfg)) {
    notices.push(
      `❄️ Frost risk overnight (${Math.round(input.todayMinC)}°C). Protect tender plants.`
    )
  }
  if (input.todayMaxC >= 35) {
    notices.push(
      `🔥 Extreme heat (${Math.round(input.todayMaxC)}°C). Water deeply and provide shade.`
    )
  }
  return notices
}
