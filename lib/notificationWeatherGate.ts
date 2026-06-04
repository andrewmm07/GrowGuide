/**
 * Whether outdoor planting advice is workable from a short-range forecast.
 */

import type { FrostGuidanceConfig } from '@/lib/microclimate/frostSeason'
import { shouldWarnForecastFrost } from '@/lib/microclimate/frostSeason'
import type { WeatherForecastData } from '@/lib/weatherService'

const HEAVY_RAIN_CODES = [1189, 1192, 1195, 1243, 1246, 1087, 1273, 1276, 1279, 1282]

function isHeavyRainCode(code: number): boolean {
  return HEAVY_RAIN_CODES.includes(code)
}

export interface PlantingWeatherAssessment {
  workable: boolean
  summary?: string
}

/** Next N forecast days (includes today). */
export function assessPlantingWeather(
  forecast: WeatherForecastData | null | undefined,
  frostConfig?: FrostGuidanceConfig
): PlantingWeatherAssessment {
  if (!forecast?.forecast?.forecastday?.length) {
    return { workable: true }
  }

  const days = forecast.forecast.forecastday.slice(0, 4)
  const frostCfg = frostConfig ?? { seasonalFrostAdvice: true, forecastFrostMinC: 2 }

  const frostDays = days.filter((d) =>
    shouldWarnForecastFrost(d.day.mintemp_c, frostCfg)
  )
  const heavyRainDays = days.filter((d) => isHeavyRainCode(d.day.condition.code))
  const extremeHeatDays = days.filter((d) => d.day.maxtemp_c >= 38)

  if (frostDays.length >= 2) {
    return {
      workable: false,
      summary: 'Frost in the forecast. Hold off frost-tender plantings outdoors.',
    }
  }

  if (heavyRainDays.length >= 2) {
    return {
      workable: false,
      summary: 'Heavy rain ahead. Wait for beds to drain before sowing in open ground.',
    }
  }

  if (extremeHeatDays.length >= 2) {
    return {
      workable: false,
      summary: 'Extreme heat ahead. Delay transplanting until conditions ease.',
    }
  }

  const mildNights = days.filter((d) => d.day.mintemp_c >= 8 && d.day.maxtemp_c <= 32)
  const lightRain = days.some(
    (d) => d.day.condition.code >= 1063 && d.day.condition.code <= 1183
  )

  if (mildNights.length >= 2) {
    let summary = 'Mild conditions look workable for planting this week.'
    if (lightRain) summary += ' Light rain should help new sowings settle.'
    if (frostDays.length === 1) {
      summary += ' One cold night: keep frost-tender seedlings under cover.'
    }
    return { workable: true, summary }
  }

  if (frostDays.length === 1 || heavyRainDays.length === 1) {
    return {
      workable: false,
      summary:
        frostDays.length === 1
          ? 'A cold night is coming. Hold frost-tender seedlings until it passes.'
          : 'Rain in the forecast. Favour containers or well-drained spots for now.',
    }
  }

  return { workable: true, summary: 'Conditions look reasonable for planting this week.' }
}

/** Block planting notification when qualitative note advises delay. */
export function plantingNoteBlocksNotification(note: string | null | undefined): boolean {
  if (!note) return false
  return /\b(hold off|avoid planting|delay direct|wait for|waterlogged|do not plant)\b/i.test(
    note
  )
}
