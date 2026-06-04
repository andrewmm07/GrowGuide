/**
 * Short planting note from recent + forecast weather (dashboard / weekly brief).
 * No raw °C or mm in copy — qualitative only.
 */

import { buildAccumulatedCondition } from '@/lib/rollingWeatherCondition'
import type { RollingWeatherContext, WeatherSignalDetail } from '@/lib/types/weatherGuidance'
import {
  resolveWeatherClauseTone,
  type WeatherClauseTone,
} from '@/lib/weeklyGuidanceWeatherTone'

export type PlantingWeatherCallout = {
  note: string
  tone: WeatherClauseTone
}

export function buildPlantingWeatherNote(
  signal: WeatherSignalDetail | null,
  rolling: RollingWeatherContext | null
): string | null {
  if (!signal && !rolling) return null

  const detail = signal ?? rolling?.signal ?? null
  const acc =
    rolling != null
      ? buildAccumulatedCondition(rolling.weekWeather, rolling.weekNorms)
      : null

  const frostRisk = Boolean(detail?.frostEvent || detail?.forecastHasFrost || rolling?.signal.frostEvent)

  if (acc?.soilMoistureState === 'saturated') {
    return 'Beds are waterlogged after sustained rain — avoid planting into sodden soil; use containers or wait until you can work soil without compacting it.'
  }

  if (
    acc?.soilMoistureState === 'wet' &&
    (detail?.wetMagnitude === 'strong' || detail?.wetMagnitude === 'moderate' || acc.streakWeeks >= 2)
  ) {
    return 'Recent rain has left beds soft — hold off sowing in open ground until soil firms; raised beds and pots are safer for new plantings.'
  }

  if (acc?.soilMoistureState === 'wet' || detail?.wetSignal) {
    return 'Soil is holding extra moisture — delay direct sowing in wet patches and favour well-drained spots or containers.'
  }

  if (
    acc?.temperatureTrend === 'significantly_above' ||
    acc?.currentWeekSignal === 'WARM' ||
    detail?.warmMagnitude === 'strong' ||
    detail?.warmMagnitude === 'moderate'
  ) {
    return 'A warm stretch is ahead — plant in the cool of the day, water seedlings in deeply, and shade tender transplants until they settle.'
  }

  if (acc?.soilMoistureState === 'dry' && (acc.dominantSignal === 'DRY' || detail?.droughtSignal)) {
    return 'Dry weeks are stressing beds — if you plant now, water in well and mulch straight away; otherwise wait for a good soaking rain.'
  }

  if (frostRisk) {
    return 'Cold nights are in the mix — keep frost-tender seedlings under cover and plant out only hardier crops outdoors.'
  }

  if (acc?.forecastDirection === 'wetting' && acc.currentWeekSignal !== 'DRY') {
    return 'More rain is forecast — finish urgent planting in free-draining spots and hold off filling waterlogged beds.'
  }

  return null
}

/** Note plus observed/forecast tone for UI callouts. */
export function buildPlantingWeatherCallout(
  signal: WeatherSignalDetail | null,
  rolling: RollingWeatherContext | null
): PlantingWeatherCallout | null {
  const note = buildPlantingWeatherNote(signal, rolling)
  if (!note) return null

  const tone =
    rolling != null
      ? resolveWeatherClauseTone(
          buildAccumulatedCondition(rolling.weekWeather, rolling.weekNorms),
          rolling.weekWeather
        )
      : 'observed'

  return { note, tone }
}
