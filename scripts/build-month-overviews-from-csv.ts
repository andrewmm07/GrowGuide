/**
 * Compile growguide-rewritten-sharp-voice.csv → month-overviews.generated.ts
 *
 * Source of truth: app/data/planting-calendar/growguide-rewritten-sharp-voice.csv
 * Run: npm run build:month-overviews
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PLANTING_CALENDAR_MONTHS } from '../app/data/planting-calendar/constants'
import { monthOverviewLookupKey } from '../app/data/planting-calendar/month-overview-keys'
import { AU_PLACES } from '../lib/places'

const CSV_PATH = join(
  process.cwd(),
  'app/data/planting-calendar/growguide-rewritten-sharp-voice.csv'
)
const OUT_PATH = join(
  process.cwd(),
  'app/data/planting-calendar/month-overviews.generated.ts'
)

function parseCsv(content: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < content.length; i++) {
    const c = content[i]
    if (inQuotes) {
      if (c === '"') {
        if (content[i + 1] === '"') {
          field += '"'
          i++
        } else inQuotes = false
      } else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || (c === '\r' && content[i + 1] === '\n')) {
      row.push(field)
      field = ''
      if (row.length > 1 || row[0]) rows.push(row)
      row = []
      if (c === '\r') i++
    } else field += c
  }

  if (field || row.length) {
    row.push(field)
    rows.push(row)
  }

  return rows
}

function capitalizeMonth(month: string): string {
  const lower = month.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function main(): void {
  const content = readFileSync(CSV_PATH, 'utf8')
  const rows = parseCsv(content)
  const header = rows[0]

  if (
    header?.join(',') !== 'place,state,climate,zone,tags,month,overview' &&
    header?.[0] !== 'place'
  ) {
    throw new Error(`Unexpected CSV header: ${header?.join(',')}`)
  }

  const lookup: Record<string, string> = {}
  const seen = new Set<string>()

  for (let i = 1; i < rows.length; i++) {
    const [place, state, , , , month, overview] = rows[i]
    if (!place || !state || !month || overview === undefined) continue

    const capMonth = capitalizeMonth(month)
    const key = monthOverviewLookupKey(state, place, capMonth)

    if (seen.has(key)) {
      throw new Error(`Duplicate CSV row for ${key}`)
    }
    seen.add(key)
    lookup[key] = overview.trim()
  }

  const expected = AU_PLACES.length * PLANTING_CALENDAR_MONTHS.length
  if (seen.size !== expected) {
    throw new Error(`Expected ${expected} overviews, got ${seen.size}`)
  }

  const missing: string[] = []
  for (const place of AU_PLACES) {
    for (const month of PLANTING_CALENDAR_MONTHS) {
      const key = monthOverviewLookupKey(place.state, place.name, month)
      if (!lookup[key]) missing.push(key)
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing overviews for ${missing.length} place-months (e.g. ${missing[0]})`)
  }

  const out = `/** AUTO-GENERATED — do not edit. Run: npm run build:month-overviews */
/** Source: app/data/planting-calendar/growguide-rewritten-sharp-voice.csv (${seen.size} entries) */

export const MONTH_OVERVIEW_BY_PLACE_MONTH: Record<string, string> = ${JSON.stringify(lookup, null, 2)}
`

  writeFileSync(OUT_PATH, out, 'utf8')
  console.log(`Wrote ${OUT_PATH} (${seen.size} entries)`)
}

main()
