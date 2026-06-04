import type { Climate } from '@/lib/types/location'
import type { SouthernSeason } from '@/lib/seasonDisplay'
import type { WeatherClauseTone } from '@/lib/weeklyGuidanceWeatherTone'

export type DominantSignal = 'DRY' | 'WET' | 'WARM' | 'COOL' | 'NORMAL' | null
export type SignalMagnitude = 'marginal' | 'moderate' | 'strong'
export type WarmIntensity = 'none' | 'slight' | 'moderate' | 'strong'

export interface WeekWeatherSummary {
  avgMaxTempC: number
  avgMinTempC: number
  totalRainMm: number
  hasFrost: boolean
  isForecast: boolean
}

export interface WeekNorm {
  climate: Climate
  month: string
  weekOfMonth: 1 | 2 | 3 | 4
  expectedMaxTemp: number
  expectedMinTemp: number
  expectedRainfallMm: number
}

export interface WeatherSignal {
  warmDeviation: boolean
  warmIntensity: WarmIntensity
  warmMagnitude: SignalMagnitude | null
  frostEvent: boolean
  droughtSignal: boolean
  dryMagnitude: SignalMagnitude | null
  wetSignal: boolean
  wetMagnitude: SignalMagnitude | null
}

export interface WeatherSignalDetail extends WeatherSignal {
  avgMaxC: number
  avgMinC: number
  totalRainMm: number
  normAvgMaxC: number
  normAvgMinC: number
  normWeeklyRainMm: number
  forecastAvgMaxTemp: number
  forecastTotalRainMm: number
  forecastHasFrost: boolean
}

export interface RollingWeatherContext {
  signal: WeatherSignalDetail
  weekWeather: WeekWeatherSummary[]
  weekNorms: WeekNorm[]
}

export interface AccumulatedCondition {
  soilMoistureState: 'dry' | 'normal' | 'wet' | 'saturated'
  temperatureTrend: 'below_norm' | 'near_norm' | 'above_norm' | 'significantly_above'
  forecastDirection: 'drying' | 'stable' | 'wetting'
  forecastTempDirection: 'cooling' | 'stable' | 'warming'
  sustainedAnomaly: boolean
  dominantSignal: DominantSignal
  /** Signal for the current (forecast) week in the 3-week window. */
  currentWeekSignal: DominantSignal
  /** Consecutive weeks at end matching dominant moisture/temp signal. */
  streakWeeks: number
  /** Current week rainfall noticeably above norm (relief after dry spell). */
  currentWeekRainRelief: boolean
  /** True when the current week in the rolling window is forecast data, not observed. */
  currentWeekIsForecast: boolean
}

export interface WeeklyGuidanceInferenceInput {
  baseWeekLine: string
  accumulatedCondition: AccumulatedCondition
  season: SouthernSeason
  weekInSeason: number
  weekBand: 'early' | 'mid' | 'late'
  climate: Climate
  tags: string[]
  frostThisWeek: boolean
  warmMagnitude: SignalMagnitude | null
  dryMagnitude: SignalMagnitude | null
  wetMagnitude: SignalMagnitude | null
  /** Rolling 3-week window; used to phrase forecast vs observed weather. */
  weekWeather?: WeekWeatherSummary[]
}

export interface WeeklyGuidanceInferenceResult {
  inferredParagraph: string
  replacedBaseLine: boolean
  /** How observed vs forecast data shaped the weather clause. */
  weatherClauseTone: WeatherClauseTone
}
