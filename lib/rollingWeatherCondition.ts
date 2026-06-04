import type {
  AccumulatedCondition,
  DominantSignal,
  WeekNorm,
  WeekWeatherSummary,
} from '@/lib/types/weatherGuidance'

function ratio(actual: number, expected: number): number {
  if (expected <= 0) return 1
  return actual / expected
}

function warmDelta(actualMax: number, expectedMax: number): number {
  return actualMax - expectedMax
}

function weekSignal(week: WeekWeatherSummary, norm: WeekNorm): DominantSignal {
  const rainRatio = ratio(week.totalRainMm, norm.expectedRainfallMm)
  const maxDelta = warmDelta(week.avgMaxTempC, norm.expectedMaxTemp)

  if (rainRatio > 1.5) return 'WET'
  if (rainRatio < 0.3) return 'DRY'
  if (maxDelta >= 3) return 'WARM'
  if (maxDelta <= -3) return 'COOL'
  return 'NORMAL'
}

function countConsecutiveFromEnd(values: DominantSignal[], target: DominantSignal): number {
  let count = 0
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] !== target) break
    count++
  }
  return count
}

export function buildAccumulatedCondition(
  actualWeeks: WeekWeatherSummary[],
  normWeeks: WeekNorm[]
): AccumulatedCondition {
  const zipped = actualWeeks
    .map((w, i) => ({ week: w, norm: normWeeks[i] }))
    .filter((x): x is { week: WeekWeatherSummary; norm: WeekNorm } => Boolean(x?.norm))

  if (zipped.length === 0) {
    return {
      soilMoistureState: 'normal',
      temperatureTrend: 'near_norm',
      forecastDirection: 'stable',
      forecastTempDirection: 'stable',
      sustainedAnomaly: false,
      dominantSignal: null,
      currentWeekSignal: 'NORMAL',
      streakWeeks: 0,
      currentWeekRainRelief: false,
      currentWeekIsForecast: false,
    }
  }

  const current = zipped[zipped.length - 1]
  const previous = zipped[zipped.length - 2]
  const rainRatios = zipped.map((z) => ratio(z.week.totalRainMm, z.norm.expectedRainfallMm))
  const maxDeltas = zipped.map((z) => warmDelta(z.week.avgMaxTempC, z.norm.expectedMaxTemp))
  const signals = zipped.map((z) => weekSignal(z.week, z.norm))

  const consecutiveWetFromEnd = countConsecutiveFromEnd(signals, 'WET')
  const dryCount = signals.filter((s) => s === 'DRY').length
  const hasCurrentWet = signals[signals.length - 1] === 'WET'
  const hasPriorWet = signals.length > 1 && signals[signals.length - 2] === 'WET'

  const soilMoistureState: AccumulatedCondition['soilMoistureState'] =
    consecutiveWetFromEnd >= 2
      ? 'saturated'
      : hasCurrentWet || hasPriorWet
        ? 'wet'
        : signals[signals.length - 1] === 'DRY' || dryCount >= 2
          ? 'dry'
          : 'normal'

  const significantlyAboveWeeks = maxDeltas.filter((d) => d >= 4).length
  const currentMaxDelta = maxDeltas[maxDeltas.length - 1] ?? 0
  const temperatureTrend: AccumulatedCondition['temperatureTrend'] =
    significantlyAboveWeeks >= 2
      ? 'significantly_above'
      : currentMaxDelta >= 3
        ? 'above_norm'
        : currentMaxDelta <= -3
          ? 'below_norm'
          : 'near_norm'

  // Forecast direction is based on the forecast-week (current) vs norm only.
  const currentRainRatio = rainRatios[rainRatios.length - 1] ?? 1
  const forecastDirection: AccumulatedCondition['forecastDirection'] =
    currentRainRatio > 1.5 ? 'wetting' : currentRainRatio < 0.3 ? 'drying' : 'stable'

  const forecastTempDirection: AccumulatedCondition['forecastTempDirection'] =
    currentMaxDelta >= 3 ? 'warming' : currentMaxDelta <= -3 ? 'cooling' : 'stable'

  const dominantSignal: DominantSignal =
    soilMoistureState === 'saturated' || soilMoistureState === 'wet'
      ? 'WET'
      : soilMoistureState === 'dry'
        ? 'DRY'
        : temperatureTrend === 'significantly_above' || temperatureTrend === 'above_norm'
          ? 'WARM'
          : temperatureTrend === 'below_norm'
            ? 'COOL'
            : 'NORMAL'

  const currentWeekSignal = signals[signals.length - 1] ?? 'NORMAL'
  const currentWeekRainRelief = currentRainRatio > 1.1
  const streakWeeks =
    dominantSignal != null && dominantSignal !== 'NORMAL'
      ? countConsecutiveFromEnd(signals, dominantSignal)
      : 0

  const sustainedAnomaly = streakWeeks >= 2 && dominantSignal !== 'NORMAL'
  const currentWeekIsForecast = current.week.isForecast === true

  void previous

  return {
    soilMoistureState,
    temperatureTrend,
    forecastDirection,
    forecastTempDirection,
    sustainedAnomaly,
    dominantSignal,
    currentWeekSignal,
    streakWeeks,
    currentWeekRainRelief,
    currentWeekIsForecast,
  }
}
