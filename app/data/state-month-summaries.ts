/**
 * @deprecated Prefer app/data/planting-calendar/helpers.ts (getMonthGuidanceForUser).
 * Lowercase month keys for legacy consumers (climate.ts).
 */
import type { Climate } from '@/lib/types/location'
import { getMonthGuidance, monthGuidanceToOverview } from './planting-calendar/month-guidance'

interface MonthSummaries {
  [month: string]: string
}

interface StateSummaries {
  [state: string]: MonthSummaries
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

const STATE_CLIMATE: Record<string, Climate> = {
  TAS: 'cool',
  VIC: 'cool',
  SA: 'cool',
  NSW: 'temperate',
  ACT: 'temperate',
  WA: 'temperate',
  QLD: 'warm',
  NT: 'warm',
}

function toLowercaseMonthKeys(summaries: Record<string, string>): MonthSummaries {
  return Object.fromEntries(
    Object.entries(summaries).map(([month, text]) => [month.toLowerCase(), text])
  )
}

function summariesForState(code: string, climate: Climate): MonthSummaries {
  return toLowercaseMonthKeys(
    Object.fromEntries(
      MONTHS.map((month) => [
        month,
        monthGuidanceToOverview(getMonthGuidance(climate, code, month)),
      ])
    )
  )
}

export const STATE_MONTH_SUMMARIES: StateSummaries = Object.fromEntries(
  Object.entries(STATE_CLIMATE).map(([code, climate]) => [
    code,
    summariesForState(code, climate),
  ])
)

export const DEFAULT_MONTH_SUMMARIES: MonthSummaries =
  STATE_MONTH_SUMMARIES.TAS ?? summariesForState('TAS', 'cool')
