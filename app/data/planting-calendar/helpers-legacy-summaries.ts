import { CALENDAR_STATE_MONTH_SUMMARIES } from './state-month-summaries-calendar'
import { STATE_ALIASES, type StateAlias, type StateName } from './constants'

function capitalizeMonth(month: string): string {
  const lower = month.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function resolveStateKeys(state: string): string[] {
  const canonicalName = (
    state in STATE_ALIASES ? STATE_ALIASES[state as StateAlias] : state
  ) as StateName
  const upper = state.toUpperCase()
  return [canonicalName, state, upper]
}

/** @deprecated Legacy state-keyed prose; use getMonthGuidance(climate, state, month). */
export function getLegacyCalendarStateSummaries(state: string): Record<string, string> {
  for (const key of resolveStateKeys(state)) {
    if (CALENDAR_STATE_MONTH_SUMMARIES[key]) {
      return CALENDAR_STATE_MONTH_SUMMARIES[key]
    }
  }
  return CALENDAR_STATE_MONTH_SUMMARIES.DEFAULT ?? CALENDAR_STATE_MONTH_SUMMARIES.TAS
}

export function getLegacyCalendarMonthOverview(state: string, month: string): string {
  const summaries = getLegacyCalendarStateSummaries(state)
  const cap = capitalizeMonth(month)
  const lower = month.toLowerCase()
  return summaries[cap] ?? summaries[lower] ?? ''
}
