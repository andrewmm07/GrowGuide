import type { Climate } from '@/lib/types/location'
import type { WeekNorm } from '@/lib/types/weatherGuidance'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/** Rough southern-AU monthly norms for weather signal comparison (not forecast data). */
const MONTHLY_AVG_MAX_C: Record<Climate, Record<string, number>> = {
  cold: {
    January: 22,
    February: 22,
    March: 20,
    April: 16,
    May: 13,
    June: 11,
    July: 10,
    August: 11,
    September: 13,
    October: 15,
    November: 17,
    December: 19,
  },
  cool: {
    January: 24,
    February: 24,
    March: 22,
    April: 18,
    May: 15,
    June: 13,
    July: 12,
    August: 13,
    September: 15,
    October: 17,
    November: 19,
    December: 21,
  },
  temperate: {
    January: 28,
    February: 28,
    March: 25,
    April: 22,
    May: 18,
    June: 15,
    July: 14,
    August: 16,
    September: 19,
    October: 22,
    November: 24,
    December: 26,
  },
  warm: {
    January: 31,
    February: 31,
    March: 29,
    April: 26,
    May: 22,
    June: 19,
    July: 18,
    August: 20,
    September: 23,
    October: 26,
    November: 28,
    December: 30,
  },
  tropical: {
    January: 32,
    February: 32,
    March: 31,
    April: 30,
    May: 28,
    June: 27,
    July: 27,
    August: 28,
    September: 30,
    October: 31,
    November: 32,
    December: 32,
  },
}

/** Typical monthly rainfall (mm), southern hemisphere calendar months. */
const MONTHLY_RAIN_MM: Record<Climate, Record<string, number>> = {
  cold: {
    January: 50,
    February: 45,
    March: 50,
    April: 55,
    May: 60,
    June: 65,
    July: 70,
    August: 65,
    September: 60,
    October: 65,
    November: 55,
    December: 50,
  },
  cool: {
    January: 45,
    February: 40,
    March: 45,
    April: 50,
    May: 55,
    June: 60,
    July: 65,
    August: 60,
    September: 55,
    October: 50,
    November: 50,
    December: 45,
  },
  temperate: {
    January: 40,
    February: 40,
    March: 45,
    April: 50,
    May: 55,
    June: 60,
    July: 55,
    August: 50,
    September: 45,
    October: 45,
    November: 50,
    December: 40,
  },
  warm: {
    January: 35,
    February: 30,
    March: 35,
    April: 40,
    May: 45,
    June: 50,
    July: 45,
    August: 40,
    September: 35,
    October: 35,
    November: 40,
    December: 35,
  },
  tropical: {
    January: 320,
    February: 300,
    March: 200,
    April: 80,
    May: 25,
    June: 10,
    July: 5,
    August: 5,
    September: 15,
    October: 40,
    November: 120,
    December: 250,
  },
}

/** Rough southern-AU monthly average minimum temperatures. */
const MONTHLY_AVG_MIN_C: Record<Climate, Record<string, number>> = {
  cold: {
    January: 13,
    February: 13,
    March: 11,
    April: 9,
    May: 7,
    June: 5,
    July: 4,
    August: 5,
    September: 6,
    October: 8,
    November: 10,
    December: 12,
  },
  cool: {
    January: 15,
    February: 15,
    March: 13,
    April: 11,
    May: 9,
    June: 7,
    July: 6,
    August: 7,
    September: 9,
    October: 11,
    November: 13,
    December: 14,
  },
  temperate: {
    January: 18,
    February: 18,
    March: 16,
    April: 13,
    May: 10,
    June: 8,
    July: 7,
    August: 8,
    September: 10,
    October: 13,
    November: 15,
    December: 17,
  },
  warm: {
    January: 21,
    February: 21,
    March: 19,
    April: 16,
    May: 13,
    June: 10,
    July: 9,
    August: 10,
    September: 13,
    October: 16,
    November: 18,
    December: 20,
  },
  tropical: {
    January: 25,
    February: 25,
    March: 24,
    April: 23,
    May: 20,
    June: 18,
    July: 17,
    August: 18,
    September: 21,
    October: 23,
    November: 24,
    December: 25,
  },
}

const COLD_WEEKLY_NORMS: Record<(typeof MONTHS)[number], readonly [WeekNorm, WeekNorm, WeekNorm, WeekNorm]> = {
  January: [
    { climate: 'cold', month: 'January', weekOfMonth: 1, expectedMaxTemp: 21.5, expectedMinTemp: 12.5, expectedRainfallMm: 10 },
    { climate: 'cold', month: 'January', weekOfMonth: 2, expectedMaxTemp: 22, expectedMinTemp: 13, expectedRainfallMm: 12 },
    { climate: 'cold', month: 'January', weekOfMonth: 3, expectedMaxTemp: 22.5, expectedMinTemp: 13.5, expectedRainfallMm: 14 },
    { climate: 'cold', month: 'January', weekOfMonth: 4, expectedMaxTemp: 22, expectedMinTemp: 13, expectedRainfallMm: 14 },
  ],
  February: [
    { climate: 'cold', month: 'February', weekOfMonth: 1, expectedMaxTemp: 22, expectedMinTemp: 13, expectedRainfallMm: 10 },
    { climate: 'cold', month: 'February', weekOfMonth: 2, expectedMaxTemp: 21.5, expectedMinTemp: 12.5, expectedRainfallMm: 10 },
    { climate: 'cold', month: 'February', weekOfMonth: 3, expectedMaxTemp: 21.5, expectedMinTemp: 12.5, expectedRainfallMm: 12 },
    { climate: 'cold', month: 'February', weekOfMonth: 4, expectedMaxTemp: 21, expectedMinTemp: 12, expectedRainfallMm: 13 },
  ],
  March: [
    { climate: 'cold', month: 'March', weekOfMonth: 1, expectedMaxTemp: 20.5, expectedMinTemp: 11.5, expectedRainfallMm: 11 },
    { climate: 'cold', month: 'March', weekOfMonth: 2, expectedMaxTemp: 20, expectedMinTemp: 11, expectedRainfallMm: 12 },
    { climate: 'cold', month: 'March', weekOfMonth: 3, expectedMaxTemp: 19.5, expectedMinTemp: 10.5, expectedRainfallMm: 13 },
    { climate: 'cold', month: 'March', weekOfMonth: 4, expectedMaxTemp: 19, expectedMinTemp: 10, expectedRainfallMm: 14 },
  ],
  April: [
    { climate: 'cold', month: 'April', weekOfMonth: 1, expectedMaxTemp: 17, expectedMinTemp: 9.5, expectedRainfallMm: 12 },
    { climate: 'cold', month: 'April', weekOfMonth: 2, expectedMaxTemp: 16.5, expectedMinTemp: 9, expectedRainfallMm: 13 },
    { climate: 'cold', month: 'April', weekOfMonth: 3, expectedMaxTemp: 16, expectedMinTemp: 8.5, expectedRainfallMm: 14 },
    { climate: 'cold', month: 'April', weekOfMonth: 4, expectedMaxTemp: 15.5, expectedMinTemp: 8, expectedRainfallMm: 16 },
  ],
  May: [
    { climate: 'cold', month: 'May', weekOfMonth: 1, expectedMaxTemp: 14, expectedMinTemp: 7.5, expectedRainfallMm: 13 },
    { climate: 'cold', month: 'May', weekOfMonth: 2, expectedMaxTemp: 13.5, expectedMinTemp: 7, expectedRainfallMm: 14 },
    { climate: 'cold', month: 'May', weekOfMonth: 3, expectedMaxTemp: 13, expectedMinTemp: 6.5, expectedRainfallMm: 15 },
    { climate: 'cold', month: 'May', weekOfMonth: 4, expectedMaxTemp: 12.5, expectedMinTemp: 6, expectedRainfallMm: 16 },
  ],
  June: [
    { climate: 'cold', month: 'June', weekOfMonth: 1, expectedMaxTemp: 11.5, expectedMinTemp: 5.5, expectedRainfallMm: 15 },
    { climate: 'cold', month: 'June', weekOfMonth: 2, expectedMaxTemp: 11, expectedMinTemp: 5, expectedRainfallMm: 15 },
    { climate: 'cold', month: 'June', weekOfMonth: 3, expectedMaxTemp: 10.5, expectedMinTemp: 4.5, expectedRainfallMm: 16 },
    { climate: 'cold', month: 'June', weekOfMonth: 4, expectedMaxTemp: 10.5, expectedMinTemp: 4.5, expectedRainfallMm: 17 },
  ],
  July: [
    { climate: 'cold', month: 'July', weekOfMonth: 1, expectedMaxTemp: 10.5, expectedMinTemp: 4, expectedRainfallMm: 16 },
    { climate: 'cold', month: 'July', weekOfMonth: 2, expectedMaxTemp: 10, expectedMinTemp: 4, expectedRainfallMm: 17 },
    { climate: 'cold', month: 'July', weekOfMonth: 3, expectedMaxTemp: 10, expectedMinTemp: 3.5, expectedRainfallMm: 18 },
    { climate: 'cold', month: 'July', weekOfMonth: 4, expectedMaxTemp: 10.5, expectedMinTemp: 4, expectedRainfallMm: 19 },
  ],
  August: [
    { climate: 'cold', month: 'August', weekOfMonth: 1, expectedMaxTemp: 11, expectedMinTemp: 4.5, expectedRainfallMm: 16 },
    { climate: 'cold', month: 'August', weekOfMonth: 2, expectedMaxTemp: 11, expectedMinTemp: 5, expectedRainfallMm: 16 },
    { climate: 'cold', month: 'August', weekOfMonth: 3, expectedMaxTemp: 11.5, expectedMinTemp: 5.5, expectedRainfallMm: 17 },
    { climate: 'cold', month: 'August', weekOfMonth: 4, expectedMaxTemp: 12, expectedMinTemp: 5.5, expectedRainfallMm: 17 },
  ],
  September: [
    { climate: 'cold', month: 'September', weekOfMonth: 1, expectedMaxTemp: 12.5, expectedMinTemp: 6, expectedRainfallMm: 14 },
    { climate: 'cold', month: 'September', weekOfMonth: 2, expectedMaxTemp: 13, expectedMinTemp: 6, expectedRainfallMm: 14 },
    { climate: 'cold', month: 'September', weekOfMonth: 3, expectedMaxTemp: 13.5, expectedMinTemp: 6.5, expectedRainfallMm: 15 },
    { climate: 'cold', month: 'September', weekOfMonth: 4, expectedMaxTemp: 14, expectedMinTemp: 7, expectedRainfallMm: 15 },
  ],
  October: [
    { climate: 'cold', month: 'October', weekOfMonth: 1, expectedMaxTemp: 14.5, expectedMinTemp: 8, expectedRainfallMm: 15 },
    { climate: 'cold', month: 'October', weekOfMonth: 2, expectedMaxTemp: 15, expectedMinTemp: 8, expectedRainfallMm: 15 },
    { climate: 'cold', month: 'October', weekOfMonth: 3, expectedMaxTemp: 15.5, expectedMinTemp: 8.5, expectedRainfallMm: 16 },
    { climate: 'cold', month: 'October', weekOfMonth: 4, expectedMaxTemp: 16, expectedMinTemp: 9, expectedRainfallMm: 16 },
  ],
  November: [
    { climate: 'cold', month: 'November', weekOfMonth: 1, expectedMaxTemp: 16.5, expectedMinTemp: 10, expectedRainfallMm: 12 },
    { climate: 'cold', month: 'November', weekOfMonth: 2, expectedMaxTemp: 17, expectedMinTemp: 10, expectedRainfallMm: 13 },
    { climate: 'cold', month: 'November', weekOfMonth: 3, expectedMaxTemp: 17.5, expectedMinTemp: 10.5, expectedRainfallMm: 14 },
    { climate: 'cold', month: 'November', weekOfMonth: 4, expectedMaxTemp: 18, expectedMinTemp: 11, expectedRainfallMm: 15 },
  ],
  December: [
    { climate: 'cold', month: 'December', weekOfMonth: 1, expectedMaxTemp: 18.5, expectedMinTemp: 11.5, expectedRainfallMm: 11 },
    { climate: 'cold', month: 'December', weekOfMonth: 2, expectedMaxTemp: 19, expectedMinTemp: 12, expectedRainfallMm: 12 },
    { climate: 'cold', month: 'December', weekOfMonth: 3, expectedMaxTemp: 19.5, expectedMinTemp: 12.5, expectedRainfallMm: 13 },
    { climate: 'cold', month: 'December', weekOfMonth: 4, expectedMaxTemp: 20, expectedMinTemp: 13, expectedRainfallMm: 14 },
  ],
}

const FALLBACK_MONTH = 'January'
const FALLBACK_MONTH_INDEX = 0

function normalizeMonth(month: string): (typeof MONTHS)[number] {
  return (MONTHS.find((m) => m === month) ?? MONTHS[FALLBACK_MONTH_INDEX]) as (typeof MONTHS)[number]
}

function monthNeighbor(month: string, offset: -1 | 1): (typeof MONTHS)[number] {
  const currentIndex = MONTHS.indexOf(normalizeMonth(month))
  const nextIndex = (currentIndex + offset + MONTHS.length) % MONTHS.length
  return MONTHS[nextIndex]
}

export function weekOfMonthFromDate(date: Date): 1 | 2 | 3 | 4 {
  const week = Math.floor((date.getDate() - 1) / 7) + 1
  return Math.max(1, Math.min(4, week)) as 1 | 2 | 3 | 4
}

function interpolateWeekNorm(climate: Climate, month: string, weekOfMonth: 1 | 2 | 3 | 4): WeekNorm {
  const safeMonth = normalizeMonth(month)
  const prevMonth = monthNeighbor(safeMonth, -1)
  const nextMonth = monthNeighbor(safeMonth, 1)

  const maxTable = MONTHLY_AVG_MAX_C[climate] ?? MONTHLY_AVG_MAX_C.cool
  const minTable = MONTHLY_AVG_MIN_C[climate] ?? MONTHLY_AVG_MIN_C.cool
  const rainTable = MONTHLY_RAIN_MM[climate] ?? MONTHLY_RAIN_MM.cool

  const currentMax = maxTable[safeMonth] ?? maxTable[FALLBACK_MONTH]
  const currentMin = minTable[safeMonth] ?? minTable[FALLBACK_MONTH]
  const currentRain = rainTable[safeMonth] ?? rainTable[FALLBACK_MONTH]
  const prevMax = maxTable[prevMonth] ?? currentMax
  const prevMin = minTable[prevMonth] ?? currentMin
  const prevRain = rainTable[prevMonth] ?? currentRain
  const nextMax = maxTable[nextMonth] ?? currentMax
  const nextMin = minTable[nextMonth] ?? currentMin
  const nextRain = rainTable[nextMonth] ?? currentRain

  const progress = (weekOfMonth - 1) / 3
  const expectedMaxTemp = currentMax + ((nextMax - prevMax) * progress) * 0.35
  const expectedMinTemp = currentMin + ((nextMin - prevMin) * progress) * 0.35
  const expectedRainfallMm = (currentRain * (7 / 30)) * (0.9 + progress * 0.2)

  return {
    climate,
    month: safeMonth,
    weekOfMonth,
    expectedMaxTemp: Math.round(expectedMaxTemp * 10) / 10,
    expectedMinTemp: Math.round(expectedMinTemp * 10) / 10,
    expectedRainfallMm: Math.max(0.5, Math.round(expectedRainfallMm * 10) / 10),
  }
}

export function getSeasonalNormForMonth(
  climate: Climate,
  month: string
): { avgMaxC: number; avgMinC: number; monthlyRainMm: number; weeklyRainMm: number } {
  const maxTable = MONTHLY_AVG_MAX_C[climate] ?? MONTHLY_AVG_MAX_C.cool
  const minTable = MONTHLY_AVG_MIN_C[climate] ?? MONTHLY_AVG_MIN_C.cool
  const rainTable = MONTHLY_RAIN_MM[climate] ?? MONTHLY_RAIN_MM.cool
  const avgMaxC = maxTable[month] ?? maxTable[FALLBACK_MONTH]
  const avgMinC = minTable[month] ?? minTable[FALLBACK_MONTH]
  const monthlyRainMm = rainTable[month] ?? rainTable[FALLBACK_MONTH]
  const weeklyRainMm = monthlyRainMm * (7 / 30)
  return { avgMaxC, avgMinC, monthlyRainMm, weeklyRainMm }
}

export function getSeasonalNormForWeek(
  climate: Climate,
  month: string,
  weekOfMonth: 1 | 2 | 3 | 4
): WeekNorm {
  if (climate === 'cold') {
    const safeMonth = normalizeMonth(month)
    const row = COLD_WEEKLY_NORMS[safeMonth]?.[weekOfMonth - 1]
    if (row) return row
  }
  return interpolateWeekNorm(climate, month, weekOfMonth)
}
