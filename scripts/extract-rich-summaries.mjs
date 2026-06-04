import { writeFileSync, statSync } from 'node:fs'
import { execSync } from 'node:child_process'

const src = execSync('git show HEAD:app/planting-calendar/page.tsx', {
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
})
const start = src.indexOf('const monthSummaries')
const end = src.indexOf('// In the MonthCard component')
let block = src.slice(start, end).trim()
block = block
  .replace('const monthSummaries', 'export const DEFAULT_RICH_MONTH_SUMMARIES')
  .replace('const tasmaniaSummaries', 'export const TASMANIA_RICH_MONTH_SUMMARIES')
  .replace('const STATE_MONTH_SUMMARIES', 'export const RICH_STATE_MONTH_SUMMARIES')

const header = `/** Rich month overview prose — restored from legacy planting calendar. */
import { STATE_ALIASES, type StateAlias, type StateName } from './constants'

`

const footer = `

function capitalizeMonth(month: string): string {
  const lower = month.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function resolveStateKeys(state: string): string[] {
  const canonicalName = (
    state in STATE_ALIASES ? STATE_ALIASES[state as StateAlias] : state
  ) as StateName
  return [canonicalName, state, state.toUpperCase()]
}

/** Full paragraph overview for a month (state-specific when available). */
export function getRichMonthOverview(state: string, month: string): string {
  const cap = capitalizeMonth(month)
  for (const key of resolveStateKeys(state)) {
    const summaries = RICH_STATE_MONTH_SUMMARIES[key]
    if (summaries?.[cap]) return summaries[cap]
  }
  return DEFAULT_RICH_MONTH_SUMMARIES[cap] ?? ''
}
`

const out = 'app/data/planting-calendar/rich-state-month-summaries.ts'
writeFileSync(out, header + block + footer)
console.log('written', statSync(out).size)
