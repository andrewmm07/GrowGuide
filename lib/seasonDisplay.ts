import type { SeasonCalendarModel } from '@/lib/microclimate/resolve'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

export type SouthernSeason = 'Summer' | 'Autumn' | 'Winter' | 'Spring'
export type TropicalSeasonLabel = 'Wet season' | 'Dry season' | 'Build-up'

/** Southern season used by week-band templates in weeklyGuidanceBands. */
export type BandSeason = SouthernSeason

const MONTH_TO_SOUTHERN: Record<(typeof MONTHS)[number], SouthernSeason> = {
  January: 'Summer',
  February: 'Summer',
  December: 'Summer',
  March: 'Autumn',
  April: 'Autumn',
  May: 'Autumn',
  June: 'Winter',
  July: 'Winter',
  August: 'Winter',
  September: 'Spring',
  October: 'Spring',
  November: 'Spring',
}

/** AU tropical north: wet / dry / build-up (band keys align with weeklyGuidanceBands tropical). */
const MONTH_TO_TROPICAL: Record<(typeof MONTHS)[number], { label: TropicalSeasonLabel; bandSeason: BandSeason }> = {
  January: { label: 'Wet season', bandSeason: 'Summer' },
  February: { label: 'Wet season', bandSeason: 'Summer' },
  March: { label: 'Wet season', bandSeason: 'Summer' },
  April: { label: 'Wet season', bandSeason: 'Summer' },
  May: { label: 'Dry season', bandSeason: 'Winter' },
  June: { label: 'Dry season', bandSeason: 'Winter' },
  July: { label: 'Dry season', bandSeason: 'Winter' },
  August: { label: 'Dry season', bandSeason: 'Winter' },
  September: { label: 'Build-up', bandSeason: 'Spring' },
  October: { label: 'Build-up', bandSeason: 'Spring' },
  November: { label: 'Build-up', bandSeason: 'Spring' },
  December: { label: 'Wet season', bandSeason: 'Summer' },
}

export interface SeasonDisplay {
  /** Card title segment, e.g. "Winter" or "Wet season". */
  label: string
  /** Display week within season (capped at 14). */
  weekInSeason: number
  /** Week index for guidance line lookup (cycles 1–14 when season runs longer). */
  guidanceLineWeek: number
  month: string
  bandSeason: BandSeason
}

function packSeasonWeeks(daysSinceStart: number): {
  weekInSeason: number
  guidanceLineWeek: number
} {
  const raw = Math.floor(daysSinceStart / 7) + 1
  const weekInSeason = Math.min(14, Math.max(1, raw))
  const guidanceLineWeek = raw > 14 ? ((raw - 1) % 14) + 1 : weekInSeason
  return { weekInSeason, guidanceLineWeek }
}

/** Month indices in calendar order within each southern season (handles summer wrapping Dec–Feb). */
const SOUTHERN_SEASON_MONTHS: Record<SouthernSeason, number[]> = {
  Summer: [11, 0, 1],
  Autumn: [2, 3, 4],
  Winter: [5, 6, 7],
  Spring: [8, 9, 10],
}

function startOfSouthernSeason(date: Date, season: SouthernSeason): Date {
  const months = SOUTHERN_SEASON_MONTHS[season]
  const firstMonth = months[0]
  let year = date.getFullYear()
  const monthIndex = date.getMonth()

  if (season === 'Summer' && monthIndex < firstMonth) {
    year -= 1
  } else if (monthIndex < firstMonth) {
    year -= 1
  }

  return new Date(year, firstMonth, 1)
}

function guidanceWeeksInSouthernSeason(
  date: Date,
  season: SouthernSeason
): { weekInSeason: number; guidanceLineWeek: number } {
  const months = SOUTHERN_SEASON_MONTHS[season]
  if (!months.includes(date.getMonth())) {
    return { weekInSeason: 1, guidanceLineWeek: 1 }
  }

  const seasonStart = startOfSouthernSeason(date, season)
  const msPerDay = 24 * 60 * 60 * 1000
  const daysSinceStart = Math.floor(
    (date.getTime() - seasonStart.getTime()) / msPerDay
  )
  return packSeasonWeeks(daysSinceStart)
}

function startOfMonthBlockSeason(date: Date, seasonMonthIndices: number[]): Date {
  const sorted = [...seasonMonthIndices].sort((a, b) => a - b)
  const wraps =
    sorted.length > 1 &&
    sorted.some((m) => m >= 10) &&
    sorted.some((m) => m <= 2)
  const monthIndex = date.getMonth()
  let year = date.getFullYear()

  if (wraps) {
    if (monthIndex >= sorted[0]) {
      return new Date(year, sorted[0], 1)
    }
    return new Date(year - 1, sorted[0], 1)
  }

  const firstMonth = sorted[0]
  if (monthIndex < firstMonth) year -= 1
  return new Date(year, firstMonth, 1)
}

function weeksInMonthBlockSeason(
  date: Date,
  seasonMonthIndices: number[]
): { weekInSeason: number; guidanceLineWeek: number } {
  const seasonStart = startOfMonthBlockSeason(date, seasonMonthIndices)
  const msPerDay = 24 * 60 * 60 * 1000
  const daysSinceStart = Math.floor(
    (date.getTime() - seasonStart.getTime()) / msPerDay
  )
  return packSeasonWeeks(daysSinceStart)
}

export function computeSeasonDisplay(
  date: Date = new Date(),
  seasonCalendar: SeasonCalendarModel = 'southern_four_seasons'
): SeasonDisplay {
  const monthIndex = date.getMonth()
  const month = MONTHS[monthIndex]

  if (seasonCalendar === 'tropical_wet_dry') {
    const tropical = MONTH_TO_TROPICAL[month]
    const indices = MONTHS.map((m, i) =>
      MONTH_TO_TROPICAL[m].label === tropical.label ? i : -1
    ).filter((i) => i >= 0)
    const weeks = weeksInMonthBlockSeason(date, indices)
    return {
      label: tropical.label,
      weekInSeason: weeks.weekInSeason,
      guidanceLineWeek: weeks.guidanceLineWeek,
      month,
      bandSeason: tropical.bandSeason,
    }
  }

  const bandSeason = MONTH_TO_SOUTHERN[month] ?? 'Spring'
  const weeks = guidanceWeeksInSouthernSeason(date, bandSeason)
  return {
    label: bandSeason,
    weekInSeason: weeks.weekInSeason,
    guidanceLineWeek: weeks.guidanceLineWeek,
    month,
    bandSeason,
  }
}
