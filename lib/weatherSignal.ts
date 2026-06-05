/**
 * Past-week weather signal for dashboard guidance (Open-Meteo, no API key).
 * Post-composition layer only; does not replace band templates.
 */

import type { Climate } from '@/lib/types/location'
import {
  getSeasonalNormForMonth,
  getSeasonalNormForWeek,
  weekOfMonthFromDate,
} from '@/lib/weatherSignalSeasonalNorms'
import type { SouthernSeason } from '@/lib/seasonDisplay'
import { weaveWeatherIntoWeekLine as weaveWeatherClause } from '@/lib/weatherSignalWeave'
import type {
  RollingWeatherContext,
  SignalMagnitude,
  WeatherSignal,
  WeatherSignalDetail,
  WarmIntensity,
  WeekNorm,
  WeekWeatherSummary,
} from '@/lib/types/weatherGuidance'

export type WeatherWeekBand = 'early' | 'mid' | 'late'

export { weaveWeatherIntoWeekLine } from '@/lib/weatherSignalWeave'
export type { WeatherWeaveContext } from '@/lib/weatherSignalWeave'

export type { WeatherSignal, WeatherSignalDetail, WarmIntensity }
export type { RollingWeatherContext }

const CACHE_PREFIX = 'weather_signal_'
const ROLLING_CACHE_PREFIX = 'weather_rolling_'
const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast'
const OPEN_METEO_ARCHIVE = 'https://archive-api.open-meteo.com/v1/archive'

export interface WeeklyWeatherBundle {
  signal: WeatherSignalDetail
  rolling: RollingWeatherContext
}

const recentDailyInflight = new Map<string, Promise<OpenMeteoDaily | null>>()

const WARM_OPENING =
  'The past week has been warmer than you would usually expect for this time of year, so watch for faster drying in beds and containers and extra stress on newly planted seedlings.'

const FROST_SENTENCE =
  'Night temperatures dropped below 2°C in the past week, so cover tender crops or bring pots under shelter when further cold nights are forecast.'

const DROUGHT_CLOSING =
  'Rain over the past seven days has been well below the usual amount for this month, so check soil moisture and water deeply where plants are flagging.'

const FROST_ADVICE_PATTERN =
  /\b(frost|frost-hardy|frost-sensitive|tender crop|cold night|cover tender|below 2)\b/i

const COASTAL_COMPOSED_PATTERN =
  /conditions run a few weeks behind inland|trust local conditions over regional calendars|Growth is still steady, but watch for the first cold nights on the coast/i
const WATER_STRESS_PATTERN =
  /\b(soil moisture|water deeply|ease back on watering|faster drying|well below the usual amount)\b/i

function shouldSkipWarmInjection(paragraph: string): boolean {
  if (paragraph.length > 280) return true
  if (COASTAL_COMPOSED_PATTERN.test(paragraph)) return true
  if (WATER_STRESS_PATTERN.test(paragraph) && paragraphHasFrostAdvice(paragraph)) return true
  return false
}

function shouldSkipDryInjection(paragraph: string, warmApplied: boolean): boolean {
  if (warmApplied) return true
  if (WATER_STRESS_PATTERN.test(paragraph)) return true
  if (paragraph.length > 260) return true
  if (COASTAL_COMPOSED_PATTERN.test(paragraph)) return true
  return false
}

function roundCoord(n: number): string {
  return n.toFixed(3)
}

function localDateKey(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function cacheKey(lat: number, lon: number, date: Date): string {
  return `${CACHE_PREFIX}${roundCoord(lat)}_${roundCoord(lon)}_${localDateKey(date)}`
}

function readCache(lat: number, lon: number, date: Date): WeatherSignalDetail | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(cacheKey(lat, lon, date))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { signal: WeatherSignalDetail; dateKey: string }
    if (parsed.dateKey === localDateKey(date)) return parsed.signal
  } catch {
    /* ignore */
  }
  return null
}

function writeCache(lat: number, lon: number, date: Date, signal: WeatherSignalDetail): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      cacheKey(lat, lon, date),
      JSON.stringify({ signal, dateKey: localDateKey(date) })
    )
  } catch {
    /* quota */
  }
}

function rollingCacheKey(lat: number, lon: number, date: Date): string {
  return `${ROLLING_CACHE_PREFIX}${roundCoord(lat)}_${roundCoord(lon)}_${localDateKey(date)}`
}

function readRollingCache(lat: number, lon: number, date: Date): RollingWeatherContext | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(rollingCacheKey(lat, lon, date))
    if (!raw) return null
    const parsed = JSON.parse(raw) as { rolling: RollingWeatherContext; dateKey: string }
    if (parsed.dateKey === localDateKey(date)) return parsed.rolling
  } catch {
    /* ignore */
  }
  return null
}

function writeRollingCache(lat: number, lon: number, date: Date, rolling: RollingWeatherContext): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      rollingCacheKey(lat, lon, date),
      JSON.stringify({ rolling, dateKey: localDateKey(date) })
    )
  } catch {
    /* quota */
  }
}

/** Synchronous read of cached weather used for weekly guidance enrichment. */
export function readWeeklyWeatherBundleFromCache(
  lat: number,
  lon: number,
  date: Date = new Date()
): WeeklyWeatherBundle | null {
  const signal = readCache(lat, lon, date)
  const rolling = readRollingCache(lat, lon, date)
  if (!signal || !rolling) return null
  return { signal, rolling }
}

interface OpenMeteoDaily {
  time: string[]
  temperature_2m_max: (number | null)[]
  temperature_2m_min: (number | null)[]
  precipitation_sum: (number | null)[]
}

function recentDailyInflightKey(lat: number, lon: number, date: Date): string {
  return `${roundCoord(lat)}_${roundCoord(lon)}_${localDateKey(date)}`
}

async function fetchRecentAndForecastDaily(
  lat: number,
  lon: number,
  date: Date = new Date()
): Promise<OpenMeteoDaily | null> {
  const key = recentDailyInflightKey(lat, lon, date)
  const existing = recentDailyInflight.get(key)
  if (existing) return existing

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    past_days: '14',
    forecast_days: '7',
    timezone: 'auto',
  })

  const promise = (async () => {
    try {
      const res = await fetch(`${OPEN_METEO}?${params.toString()}`)
      if (!res.ok) return null
      const body = (await res.json()) as { daily?: OpenMeteoDaily }
      return body.daily ?? null
    } finally {
      recentDailyInflight.delete(key)
    }
  })()

  recentDailyInflight.set(key, promise)
  return promise
}

function summariseDailyRows(
  daily: OpenMeteoDaily,
  options?: { lastNDays?: number }
): {
  avgMaxC: number
  avgMinC: number
  frostEvent: boolean
  totalRainMm: number
} | null {
  const maxes: number[] = []
  const mins: number[] = []
  let totalRainMm = 0

  const len = daily.temperature_2m_max.length
  const start =
    options?.lastNDays != null ? Math.max(0, len - options.lastNDays) : 0

  for (let i = start; i < len; i++) {
    const max = daily.temperature_2m_max[i]
    const min = daily.temperature_2m_min[i]
    const rain = daily.precipitation_sum[i]
    if (max != null) maxes.push(max)
    if (min != null) mins.push(min)
    if (rain != null) totalRainMm += rain
  }

  if (maxes.length === 0) return null

  const frostEvent = mins.some((t) => t < 2)
  const avgMaxC = maxes.reduce((a, b) => a + b, 0) / maxes.length
  const avgMinC = mins.length > 0 ? mins.reduce((a, b) => a + b, 0) / mins.length : 0

  return { avgMaxC, avgMinC, frostEvent, totalRainMm }
}

function summarisePastSevenDays(daily: OpenMeteoDaily) {
  return summariseDailyRows(daily, { lastNDays: 7 })
}

function summariseByDateRange(
  daily: OpenMeteoDaily,
  startIso: string,
  endIso: string
): { avgMaxC: number; avgMinC: number; frostEvent: boolean; totalRainMm: number } | null {
  const maxes: number[] = []
  const mins: number[] = []
  let totalRainMm = 0

  for (let i = 0; i < daily.time.length; i++) {
    const time = daily.time[i]
    if (time < startIso || time > endIso) continue
    const max = daily.temperature_2m_max[i]
    const min = daily.temperature_2m_min[i]
    const rain = daily.precipitation_sum[i]
    if (max != null) maxes.push(max)
    if (min != null) mins.push(min)
    if (rain != null) totalRainMm += rain
  }

  if (maxes.length === 0) return null
  return {
    avgMaxC: maxes.reduce((a, b) => a + b, 0) / maxes.length,
    avgMinC: mins.length > 0 ? mins.reduce((a, b) => a + b, 0) / mins.length : 0,
    frostEvent: mins.some((m) => m < 2),
    totalRainMm,
  }
}

function isoDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfDay(d: Date): Date {
  const out = new Date(d)
  out.setHours(0, 0, 0, 0)
  return out
}

function addDays(d: Date, days: number): Date {
  const out = new Date(d)
  out.setDate(out.getDate() + days)
  return out
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

function monthNameLocal(date: Date): string {
  return MONTH_NAMES[date.getMonth()]
}

function buildWeekNorm(climate: Climate, date: Date): WeekNorm {
  const month = monthNameLocal(date)
  const weekOfMonth = weekOfMonthFromDate(date)
  return getSeasonalNormForWeek(climate, month, weekOfMonth)
}

function summariseWeekSlice(
  daily: OpenMeteoDaily,
  startIndex: number,
  dayCount: number
): { avgMaxC: number; avgMinC: number; frostEvent: boolean; totalRainMm: number } | null {
  const slice: OpenMeteoDaily = {
    time: daily.time.slice(startIndex, startIndex + dayCount),
    temperature_2m_max: daily.temperature_2m_max.slice(startIndex, startIndex + dayCount),
    temperature_2m_min: daily.temperature_2m_min.slice(startIndex, startIndex + dayCount),
    precipitation_sum: daily.precipitation_sum.slice(startIndex, startIndex + dayCount),
  }
  return summariseDailyRows(slice)
}

function toWeekSummary(
  summary: { avgMaxC: number; avgMinC: number; frostEvent: boolean; totalRainMm: number },
  isForecast: boolean
): WeekWeatherSummary {
  return {
    avgMaxTempC: summary.avgMaxC,
    avgMinTempC: summary.avgMinC,
    totalRainMm: summary.totalRainMm,
    hasFrost: summary.frostEvent,
    isForecast,
  }
}

function warmIntensityFromDelta(delta: number): WarmIntensity {
  if (delta >= 5) return 'strong'
  if (delta >= 4) return 'moderate'
  if (delta >= 3) return 'slight'
  return 'none'
}

function magnitudeFromWarmDelta(delta: number): SignalMagnitude | null {
  if (delta >= 5) return 'strong'
  if (delta >= 4) return 'moderate'
  if (delta >= 3) return 'marginal'
  return null
}

function magnitudeFromDryRatio(rainRatio: number): SignalMagnitude | null {
  if (rainRatio < 0.1) return 'strong'
  if (rainRatio < 0.2) return 'moderate'
  if (rainRatio < 0.3) return 'marginal'
  return null
}

function magnitudeFromWetRatio(rainRatio: number): SignalMagnitude | null {
  if (rainRatio > 3) return 'strong'
  if (rainRatio > 2) return 'moderate'
  if (rainRatio > 1.5) return 'marginal'
  return null
}

function deriveSignal(
  summary: { avgMaxC: number; avgMinC: number; frostEvent: boolean; totalRainMm: number },
  climate: Climate,
  month: string
): WeatherSignalDetail {
  const weekNorm = getSeasonalNormForWeek(climate, month, 2)
  const norm = getSeasonalNormForMonth(climate, month)
  const warmDelta = summary.avgMaxC - norm.avgMaxC
  const rainRatio = weekNorm.expectedRainfallMm > 0 ? summary.totalRainMm / weekNorm.expectedRainfallMm : 1
  const warmIntensity = warmIntensityFromDelta(warmDelta)
  return {
    warmDeviation: warmIntensity !== 'none',
    warmIntensity,
    warmMagnitude: magnitudeFromWarmDelta(warmDelta),
    frostEvent: summary.frostEvent,
    droughtSignal: rainRatio < 0.3,
    dryMagnitude: magnitudeFromDryRatio(rainRatio),
    wetSignal: rainRatio > 1.5,
    wetMagnitude: magnitudeFromWetRatio(rainRatio),
    avgMaxC: summary.avgMaxC,
    avgMinC: summary.avgMinC,
    totalRainMm: summary.totalRainMm,
    normAvgMaxC: norm.avgMaxC,
    normAvgMinC: norm.avgMinC,
    normWeeklyRainMm: norm.weeklyRainMm,
    forecastAvgMaxTemp: summary.avgMaxC,
    forecastTotalRainMm: summary.totalRainMm,
    forecastHasFrost: summary.frostEvent,
  }
}

async function fetchArchiveDaily(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<OpenMeteoDaily | null> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: startDate,
    end_date: endDate,
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    timezone: 'auto',
  })

  const res = await fetch(`${OPEN_METEO_ARCHIVE}?${params.toString()}`)
  if (!res.ok) return null

  const body = (await res.json()) as { daily?: OpenMeteoDaily }
  return body.daily ?? null
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchArchiveDailyWithRetry(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string,
  attempts = 4
): Promise<OpenMeteoDaily | null> {
  for (let i = 0; i < attempts; i++) {
    const daily = await fetchArchiveDaily(lat, lon, startDate, endDate)
    if (daily && daily.time.length > 0) return daily
    if (i < attempts - 1) await sleepMs(500 * 2 ** i)
  }
  return null
}

/** One archive request for preview scripts (includes prior December for rolling week 1). */
export async function fetchPreviewYearArchive(
  lat: number,
  lon: number,
  year: number
): Promise<OpenMeteoDaily | null> {
  return fetchArchiveDailyWithRetry(
    lat,
    lon,
    `${year - 1}-12-04`,
    `${year}-12-31`
  )
}

/** 7-day signal from a preloaded archive daily series. */
export function weatherSignalFromArchiveDaily(
  daily: OpenMeteoDaily,
  climate: Climate,
  month: string,
  asOfDate: Date
): WeatherSignalDetail | null {
  const end = startOfDay(asOfDate)
  const today = startOfDay(new Date())
  if (end > today) return null

  const summary = summariseByDateRange(
    daily,
    isoDateLocal(addDays(end, -6)),
    isoDateLocal(end)
  )
  if (!summary) return null
  return deriveSignal(summary, climate, month)
}

/** Rolling 3-week context from a preloaded archive daily series. */
export function rollingContextFromArchiveDaily(
  daily: OpenMeteoDaily,
  climate: Climate,
  asOfDate: Date
): RollingWeatherContext | null {
  const end = startOfDay(asOfDate)
  const today = startOfDay(new Date())
  if (end > today) return null

  const endIdx = daily.time.indexOf(isoDateLocal(end))
  if (endIdx < 20) return null

  const week1 = summariseWeekSlice(daily, endIdx - 20, 7)
  const week2 = summariseWeekSlice(daily, endIdx - 13, 7)
  const week3 = summariseWeekSlice(daily, endIdx - 6, 7)
  if (!week1 || !week2 || !week3) return null

  const weekDates = [addDays(end, -17), addDays(end, -10), end]
  const weekWeather: WeekWeatherSummary[] = [
    toWeekSummary(week1, false),
    toWeekSummary(week2, false),
    toWeekSummary(week3, true),
  ]
  const weekNorms = weekDates.map((d) => buildWeekNorm(climate, d))
  const month = monthNameLocal(end)
  const signal = deriveSignal(week3, climate, month)
  signal.forecastAvgMaxTemp = week3.avgMaxC
  signal.forecastTotalRainMm = week3.totalRainMm
  signal.forecastHasFrost = week3.frostEvent

  return { signal, weekWeather, weekNorms }
}

/**
 * Past-seven-days signal for a specific end date (archive API). For preview scripts.
 * Returns null for future dates or when archive data is unavailable.
 */
export async function getWeatherSignalForDate(
  lat: number,
  lon: number,
  climate: Climate,
  month: string,
  asOfDate: Date
): Promise<WeatherSignalDetail | null> {
  const end = startOfDay(asOfDate)
  const today = startOfDay(new Date())

  if (end > today) return null

  try {
    if (end.getTime() === today.getTime()) {
      const daily = await fetchRecentAndForecastDaily(lat, lon, asOfDate)
      if (!daily) return null
      const summary = summariseByDateRange(
        daily,
        isoDateLocal(addDays(end, -6)),
        isoDateLocal(end)
      )
      if (!summary) return null
      return deriveSignal(summary, climate, month)
    }

    const start = addDays(end, -6)
    const daily = await fetchArchiveDailyWithRetry(
      lat,
      lon,
      isoDateLocal(start),
      isoDateLocal(end)
    )
    if (!daily) return null

    return weatherSignalFromArchiveDaily(daily, climate, month, asOfDate)
  } catch {
    return null
  }
}

/**
 * Rolling 3-week context for a historical as-of date (archive only).
 * Weeks are the 7-day blocks ending 14–8, 7–1, and 0 days before asOfDate.
 */
export async function getRollingWeatherContextForDate(
  lat: number,
  lon: number,
  climate: Climate,
  asOfDate: Date
): Promise<RollingWeatherContext | null> {
  const end = startOfDay(asOfDate)
  const today = startOfDay(new Date())
  if (end > today) return null

  if (Math.abs(end.getTime() - today.getTime()) <= 2 * 24 * 60 * 60 * 1000) {
    return getRollingWeatherContext(lat, lon, climate, asOfDate)
  }

  try {
    const rangeStart = addDays(end, -20)
    const daily = await fetchArchiveDailyWithRetry(
      lat,
      lon,
      isoDateLocal(rangeStart),
      isoDateLocal(end)
    )
    if (!daily) return null
    return rollingContextFromArchiveDaily(daily, climate, asOfDate)
  } catch {
    return null
  }
}

/**
 * Rolling 3-week context: two prior actual weeks + current forecast week.
 * Returns null when forecast/actual windows cannot be resolved.
 */
function buildRollingContextFromDaily(
  recent: OpenMeteoDaily,
  climate: Climate,
  today: Date
): RollingWeatherContext | null {
  const currentIso = isoDateLocal(today)
  const forecastEndIso = isoDateLocal(addDays(today, 6))
  const priorActualStartIso = isoDateLocal(addDays(today, -7))
  const priorActualEndIso = isoDateLocal(addDays(today, -1))

  const forecastSummary = summariseByDateRange(recent, currentIso, forecastEndIso)
  const priorWeekSummary = summariseByDateRange(recent, priorActualStartIso, priorActualEndIso)
  if (!forecastSummary || !priorWeekSummary) return null

  const olderStart = isoDateLocal(addDays(today, -14))
  const olderEnd = isoDateLocal(addDays(today, -8))
  const olderSummary = summariseByDateRange(recent, olderStart, olderEnd)
  if (!olderSummary) return null

  const weekDates = [addDays(today, -10), addDays(today, -3), today]
  const weekWeather: WeekWeatherSummary[] = [
    toWeekSummary(olderSummary, false),
    toWeekSummary(priorWeekSummary, false),
    toWeekSummary(forecastSummary, true),
  ]
  const weekNorms: WeekNorm[] = weekDates.map((d) => buildWeekNorm(climate, d))
  const signal = deriveSignal(forecastSummary, climate, monthNameLocal(today))
  signal.forecastAvgMaxTemp = forecastSummary.avgMaxC
  signal.forecastTotalRainMm = forecastSummary.totalRainMm
  signal.forecastHasFrost = forecastSummary.frostEvent

  return { signal, weekWeather, weekNorms }
}

export async function getRollingWeatherContext(
  lat: number,
  lon: number,
  climate: Climate,
  date: Date = new Date()
): Promise<RollingWeatherContext | null> {
  const today = startOfDay(new Date())
  const target = startOfDay(date)
  // Forecast signal is only meaningful near "now". Preserve fallback behavior otherwise.
  if (Math.abs(target.getTime() - today.getTime()) > 2 * 24 * 60 * 60 * 1000) return null

  const cached = readRollingCache(lat, lon, date)
  if (cached) return cached

  try {
    const recent = await fetchRecentAndForecastDaily(lat, lon, date)
    if (!recent) return null

    const rolling = buildRollingContextFromDaily(recent, climate, today)
    if (rolling) writeRollingCache(lat, lon, date, rolling)
    return rolling
  } catch {
    return null
  }
}

/** One Open-Meteo fetch for signal + rolling context (cached per day). */
export async function getWeeklyWeatherBundle(
  lat: number,
  lon: number,
  climate: Climate,
  month: string,
  date: Date = new Date()
): Promise<WeeklyWeatherBundle | null> {
  const cached = readWeeklyWeatherBundleFromCache(lat, lon, date)
  if (cached) return cached

  const today = startOfDay(new Date())
  const target = startOfDay(date)
  if (Math.abs(target.getTime() - today.getTime()) > 2 * 24 * 60 * 60 * 1000) {
    return null
  }

  try {
    const daily = await fetchRecentAndForecastDaily(lat, lon, date)
    if (!daily) return null

    const start = isoDateLocal(addDays(today, -6))
    const end = isoDateLocal(today)
    const forecastStart = isoDateLocal(today)
    const forecastEnd = isoDateLocal(addDays(today, 6))

    const summary = summariseByDateRange(daily, start, end)
    const forecastSummary = summariseByDateRange(daily, forecastStart, forecastEnd)
    if (!summary || !forecastSummary) return null

    const signal = deriveSignal(summary, climate, month)
    signal.forecastAvgMaxTemp = forecastSummary.avgMaxC
    signal.forecastTotalRainMm = forecastSummary.totalRainMm
    signal.forecastHasFrost = forecastSummary.frostEvent
    writeCache(lat, lon, date, signal)

    const rolling = buildRollingContextFromDaily(daily, climate, today)
    if (!rolling) return { signal, rolling: { signal, weekWeather: [], weekNorms: [] } }
    writeRollingCache(lat, lon, date, rolling)

    return { signal, rolling }
  } catch {
    return null
  }
}

/** Fetch or read cached 7-day weather signal for guidance modifiers. */
export async function getWeatherSignal(
  lat: number,
  lon: number,
  climate: Climate,
  month: string,
  date: Date = new Date()
): Promise<WeatherSignalDetail | null> {
  const cached = readCache(lat, lon, date)
  if (cached) return cached

  try {
    const daily = await fetchRecentAndForecastDaily(lat, lon, date)
    if (!daily) return null
    const today = startOfDay(new Date())
    const start = isoDateLocal(addDays(today, -6))
    const end = isoDateLocal(today)
    const forecastStart = isoDateLocal(today)
    const forecastEnd = isoDateLocal(addDays(today, 6))

    const summary = summariseByDateRange(daily, start, end)
    const forecastSummary = summariseByDateRange(daily, forecastStart, forecastEnd)
    if (!summary || !forecastSummary) return null

    const signal = deriveSignal(summary, climate, month)
    signal.forecastAvgMaxTemp = forecastSummary.avgMaxC
    signal.forecastTotalRainMm = forecastSummary.totalRainMm
    signal.forecastHasFrost = forecastSummary.frostEvent
    writeCache(lat, lon, date, signal)
    return signal
  } catch {
    return null
  }
}

export function paragraphHasFrostAdvice(text: string): boolean {
  return FROST_ADVICE_PATTERN.test(text)
}

function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]+/g)
  return parts?.map((s) => s.trim()).filter(Boolean) ?? [text.trim()]
}

function joinWarmOpening(body: string): string {
  const trimmed = body.trim()
  if (!trimmed) return `${WARM_OPENING}.`
  return `${WARM_OPENING} ${trimmed}`
}

function injectFrostSentence(text: string): string {
  const sentences = splitSentences(text)
  if (sentences.length <= 1) {
    const base = text.trim().replace(/[.!?]+\s*$/, '')
    return `${base}. ${FROST_SENTENCE}`
  }
  return `${sentences[0]} ${FROST_SENTENCE} ${sentences.slice(1).join(' ')}`
}

function appendDroughtClosing(text: string): string {
  const base = text.trim().replace(/[.!?]+\s*$/, '')
  return `${base}. ${DROUGHT_CLOSING}`
}

/**
 * @deprecated Prefer weaveWeatherIntoWeekLine for dashboard guidance.
 */
export function applyWeatherModifiers(
  paragraph: string,
  signal: WeatherSignal | null,
  season: SouthernSeason,
  _band: WeatherWeekBand
): string {
  if (!signal || !paragraph.trim()) return paragraph
  return weaveWeatherClause(paragraph, signal, null, {
    season,
    month: 'September',
    weekInSeason: 1,
  })
}
