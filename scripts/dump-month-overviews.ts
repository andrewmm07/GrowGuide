/**
 * Dump month overview text for every app location and climate baseline.
 *
 * Run: npm exec tsx scripts/dump-month-overviews.ts
 *
 * Output:
 *   scripts/audit-output/month-overviews/climate-baseline.txt
 *   scripts/audit-output/month-overviews/all-locations.txt
 *   scripts/audit-output/month-overviews/all-locations.csv
 */

import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PLANTING_CALENDAR_MONTHS } from '../app/data/planting-calendar/constants'
import { getRichMonthOverviewForLocation } from '../app/data/planting-calendar/helpers'
import { AU_PLACES, userLocationFromPlace } from '../lib/places'
import type { Climate } from '../lib/types/location'

const OUT_DIR = join(process.cwd(), 'scripts', 'audit-output', 'month-overviews')
const CLIMATES: Climate[] = ['cold', 'cool', 'temperate', 'warm', 'tropical']

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, '""')}"`
}

function main(): void {
  mkdirSync(OUT_DIR, { recursive: true })

  const climateLines: string[] = [
    'CLIMATE BASELINES (no location / microclimate tweaks)',
    '='.repeat(72),
    '',
  ]

  const climateCsvRows = ['climate,month,overview']

  for (const climate of CLIMATES) {
    climateLines.push(`## ${climate.toUpperCase()}`)
    climateLines.push('')
    for (const month of PLANTING_CALENDAR_MONTHS) {
      const overview = getRichMonthOverviewForLocation({ climate, state: 'NSW' } as never, month, 'NSW')
      climateLines.push(`${month}`)
      climateLines.push(overview)
      climateLines.push('')
      climateCsvRows.push([climate, month, csvEscape(overview)].join(','))
    }
    climateLines.push('-'.repeat(72))
    climateLines.push('')
  }

  const locationLines: string[] = [
    `ALL LOCATIONS (${AU_PLACES.length} places × 12 months)`,
    '='.repeat(72),
    '',
  ]

  const locationCsvRows = ['place,state,climate,zone,tags,month,overview']

  for (const place of AU_PLACES) {
    const location = userLocationFromPlace(place)
    const tags = location.microclimateTags.join('|') || 'none'

    locationLines.push(`# ${place.name}, ${place.state} (${location.climate}, zone ${place.auHardinessZone}, tags: ${tags})`)
    locationLines.push('')

    for (const month of PLANTING_CALENDAR_MONTHS) {
      const overview = getRichMonthOverviewForLocation(location, month, place.state)
      locationLines.push(`${month}: ${overview}`)
      locationCsvRows.push(
        [
          csvEscape(place.name),
          place.state,
          location.climate,
          place.auHardinessZone,
          csvEscape(tags),
          month,
          csvEscape(overview),
        ].join(',')
      )
    }

    locationLines.push('')
    locationLines.push('-'.repeat(72))
    locationLines.push('')
  }

  const climatePath = join(OUT_DIR, 'climate-baseline.txt')
  const allTxtPath = join(OUT_DIR, 'all-locations.txt')
  const allCsvPath = join(OUT_DIR, 'all-locations.csv')

  writeFileSync(climatePath, climateLines.join('\n'), 'utf8')
  writeFileSync(allTxtPath, locationLines.join('\n'), 'utf8')
  writeFileSync(allCsvPath, locationCsvRows.join('\n'), 'utf8')

  console.log(`Wrote ${climatePath}`)
  console.log(`Wrote ${allTxtPath}`)
  console.log(`Wrote ${allCsvPath}`)
  console.log(`Locations: ${AU_PLACES.length}, rows: ${AU_PLACES.length * 12}`)
}

main()
