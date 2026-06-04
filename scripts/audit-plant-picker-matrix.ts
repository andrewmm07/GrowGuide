/**
 * Plant picker suitability — every app location × every ISO week × seed/seedling.
 * Matches My Garden PlantPicker (evaluatePlantSuitability + zone meta).
 *
 * Run (Windows PowerShell — use npm.cmd if execution policy blocks npm.ps1):
 *   npm.cmd run audit:plant-picker
 *   npm.cmd run audit:plant-picker:matrix          (10-city sample, faster)
 *   npm.cmd run audit:plant-picker -- --place Sydney --state NSW --detail
 *
 * Outputs: scripts/audit-output/plant-picker/
 *   plant-picker-everywhere-summary.csv   — counts (all places, default)
 *   plant-picker-everywhere-plants.csv    — every plant × week × place × method
 *   plant-picker-matrix-summary.csv       — counts (10-city sample with --matrix)
 *   <place-slug>-plant-picker-audit.txt   — readable detail (--detail + one place)
 */

import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  type WriteStream,
} from 'fs'
import * as path from 'path'
import { assessFortnightTiming, buildFortnightTimingWindows, fortnightLabel } from '../lib/planting/fortnightTiming'
import { resolvePlantingProfileWithContext } from '../lib/planting/resolvePlantingProfile'
import { AU_PLACES, findPlaceByName, userLocationFromPlace } from '../lib/places'
import { resolveLocationContext } from '../lib/microclimate/resolve'
import {
  assessClimateSuitability,
  evaluatePlantSuitability,
  seasonalTimingLabel,
} from '../lib/plantSuitabilityService'
import type { PlantZoneMeta } from '../lib/plantTimelineService'
import type { AUHardinessZone, UserLocation } from '../lib/types/location'
import type { AuPlace } from '../lib/places/types'

const MATRIX: { place: string; state: string }[] = [
  { place: 'Blackmans Bay', state: 'TAS' },
  { place: 'Canberra', state: 'ACT' },
  { place: 'Melbourne', state: 'VIC' },
  { place: 'Adelaide', state: 'SA' },
  { place: 'Darwin', state: 'NT' },
  { place: 'Toowoomba', state: 'QLD' },
  { place: 'Perth', state: 'WA' },
  { place: 'Sydney', state: 'NSW' },
  { place: 'Fremantle', state: 'WA' },
  { place: 'Potts Point', state: 'NSW' },
]

const ALL_ZONES: AUHardinessZone[] = [
  '8a', '8b', '9a', '9b', '10a', '10b', '11a', '11b', '12a', '12b',
]

const OUT_DIR = path.join(__dirname, 'audit-output', 'plant-picker')

const PLANT_CSV_HEADER =
  'place_id,city,state,zone,profile,microclimate_tags,year,iso_week,reference_date,fortnight,method,plant_name,seasonal_tier,seasonal_label,climate_tier,distance_fortnights,method_match'

const SUMMARY_CSV_HEADER =
  'place_id,city,state,zone,profile,microclimate_tags,year,iso_week,reference_date,fortnight,method,ideal,good,timing_caution,not_advised,climate_not_suitable,total_plants'

function loadEnvFile(filename: string): void {
  const filePath = path.join(process.cwd(), filename)
  if (!existsSync(filePath)) return
  try {
    for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!(key in process.env)) process.env[key] = value
    }
  } catch {
    // .env optional
  }
}

function parseYearArg(): number {
  const idx = process.argv.indexOf('--year')
  if (idx >= 0 && process.argv[idx + 1]) {
    const y = Number.parseInt(process.argv[idx + 1], 10)
    if (!Number.isNaN(y) && y >= 2000 && y <= 2100) return y
  }
  return new Date().getFullYear()
}

function parseStringArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag)
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return undefined
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag)
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function csvCell(value: string | number): string {
  const s = String(value)
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function isoWeekWednesday(year: number, week: number): Date {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const day = jan4.getUTCDay() || 7
  const mondayWeek1 = new Date(Date.UTC(year, 0, 4 - (day - 1)))
  const wed = new Date(mondayWeek1)
  wed.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7 + 2)
  return new Date(wed.getUTCFullYear(), wed.getUTCMonth(), wed.getUTCDate())
}

function weeksInYear(year: number): number {
  const dec28 = new Date(year, 11, 28)
  const day = dec28.getDay() || 7
  const thursday = new Date(dec28)
  thursday.setDate(dec28.getDate() + 4 - day)
  const yearStart = new Date(thursday.getFullYear(), 0, 1)
  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

const zoneMetaCache = new Map<AUHardinessZone, Map<string, PlantZoneMeta>>()
let zoneMetaSource: 'supabase' | 'csv' = 'csv'

function buildZoneMetaMapFromCsv(zone: string): Map<string, PlantZoneMeta> {
  const csv = readFileSync(path.join(__dirname, '..', 'plant_timelines_corrected.csv'), 'utf8')
  const map = new Map<string, PlantZoneMeta>()

  for (const line of csv.split('\n').slice(1)) {
    const head = line.match(/^[^,]+,([^,]+),([^,]+),/)
    if (!head || head[2] !== zone) continue
    const plantName = head[1]
    const unsuitable = /,True\s*$/.test(line.trim())
    const gmMatch = line.match(
      new RegExp(`,${plantName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')},${zone},\\d+,\\d+,\\d+,\\d+,[^,]*,[^,]*,(\\d+\\.?\\d*)`)
    )
    const noteMatch = line.match(/,"([^"]*)",(?:True|False)\s*$/)
    map.set(plantName, {
      plantName,
      plantCategory: null,
      unsuitableZone: unsuitable,
      growthMultiplier: gmMatch ? parseFloat(gmMatch[1]) : 1,
      climateNote: noteMatch?.[1] ?? null,
      extraCare: [],
    })
  }

  return map
}

async function preloadZoneMeta(): Promise<void> {
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (hasSupabase) {
    try {
      const { getPlantZoneMetaForZone } = await import('../lib/plantTimelineService')
      for (const zone of ALL_ZONES) {
        const rows = await getPlantZoneMetaForZone(zone)
        const map = new Map<string, PlantZoneMeta>()
        for (const row of rows) map.set(row.plantName, row)
        zoneMetaCache.set(zone, map)
      }
      zoneMetaSource = 'supabase'
      console.log(`Zone metadata loaded from Supabase (${ALL_ZONES.length} zones)`)
      return
    } catch (err) {
      console.warn('Supabase zone meta failed, falling back to CSV:', err)
    }
  } else {
    console.log('No Supabase env — using plant_timelines_corrected.csv')
  }

  for (const zone of ALL_ZONES) {
    zoneMetaCache.set(zone, buildZoneMetaMapFromCsv(zone))
  }
  zoneMetaSource = 'csv'
  console.log(`Zone metadata loaded from CSV (${ALL_ZONES.length} zones)`)
}

type AuditRow = {
  plant: string
  tier: string
  label: string
  climate: string
  dist: number | null
  methodMatch: string
}

function auditLocationWeek(
  location: Partial<UserLocation>,
  zoneMeta: Map<string, PlantZoneMeta>,
  date: Date,
  method: 'seed' | 'seedling'
): AuditRow[] {
  const rows: AuditRow[] = []

  for (const plant of [...zoneMeta.keys()].sort()) {
    const meta = zoneMeta.get(plant)!
    const a = evaluatePlantSuitability(plant, location, {
      plantingMethod: method,
      referenceDate: date,
      zoneMeta: meta,
    })
    const t = assessFortnightTiming(plant, location, method, date)

    rows.push({
      plant,
      tier: a.seasonalTiming,
      label: seasonalTimingLabel(a.seasonalTiming),
      climate: assessClimateSuitability(plant, location, meta),
      dist: t.distanceFortnights,
      methodMatch: t.methodMatch,
    })
  }

  return rows
}

function countSummary(rows: AuditRow[]) {
  const climateNotSuitable = rows.filter((r) => r.climate === 'not_advised').length
  const timingRows = rows.filter((r) => r.climate !== 'not_advised')
  return {
    ideal: timingRows.filter((r) => r.tier === 'ideal').length,
    good: timingRows.filter((r) => r.tier === 'good').length,
    timing_caution: timingRows.filter((r) => r.tier === 'timing_caution').length,
    not_advised: timingRows.filter((r) => r.tier === 'not_advised').length,
    climate_not_suitable: climateNotSuitable,
    total: rows.length,
  }
}

function formatDetailSection(
  title: string,
  rows: AuditRow[],
  tierFilter: (r: AuditRow) => boolean
): string {
  const filtered = rows.filter(tierFilter)
  const lines = [`\n=== ${title} (${filtered.length}) ===`]
  for (const r of filtered) {
    lines.push(
      `${r.plant.padEnd(22)} ${r.label.padEnd(28)} dist=${String(r.dist).padEnd(4)} ${r.methodMatch}`
    )
  }
  return lines.join('\n')
}

function formatWeekDetail(
  date: Date,
  week: number,
  method: 'seed' | 'seedling',
  rows: AuditRow[]
): string {
  const fortnight = date.getMonth() * 2 + (date.getDate() <= 15 ? 0 : 1)
  const lines = [
    `\n${'='.repeat(72)}`,
    `Week ${week} — ${date.toISOString().slice(0, 10)} — ${fortnightLabel(fortnight)} — ${method.toUpperCase()}`,
    '='.repeat(72),
  ]

  lines.push(formatDetailSection('Good seasonal timing', rows, (r) => r.tier === 'ideal' && r.climate !== 'not_advised'))
  lines.push(formatDetailSection('Acceptable seasonal timing', rows, (r) => r.tier === 'good' && r.climate !== 'not_advised'))
  lines.push(formatDetailSection('Timing caution', rows, (r) => r.tier === 'timing_caution' && r.climate !== 'not_advised'))
  lines.push(formatDetailSection('Not advised for this season', rows, (r) => r.tier === 'not_advised' && r.climate !== 'not_advised'))
  lines.push(formatDetailSection('Not suitable for this climate', rows, (r) => r.climate === 'not_advised'))

  return lines.join('\n')
}

function writePlantRows(
  stream: WriteStream | null,
  base: string[],
  rows: AuditRow[]
): void {
  if (!stream) return
  for (const r of rows) {
    stream.write(
      [
        ...base,
        csvCell(r.plant),
        r.tier,
        csvCell(r.label),
        r.climate,
        r.dist ?? '',
        r.methodMatch,
      ].join(',') + '\n'
    )
  }
}

function runForPlace(
  place: AuPlace,
  year: number,
  weekCount: number,
  detail: boolean,
  plantStream: WriteStream | null,
  summaryRows: string[]
): void {
  const location = userLocationFromPlace(place)
  const ctx = resolveLocationContext(location)
  const zone = location.auHardinessZone
  const zoneMeta = zoneMetaCache.get(zone)
  if (!zoneMeta) {
    console.error(`No zone meta for ${zone} (${place.name})`)
    return
  }
  const { profile } = resolvePlantingProfileWithContext(location)
  const tags = (ctx?.microclimateTags ?? location.microclimateTags ?? []).join('|')
  const placeId = place.id

  const detailParts: string[] = [
    [
      `Location: ${location.city}, ${location.state} (${placeId})`,
      `Zone: ${zone} | Climate: ${location.climate} | Tags: ${tags || '—'}`,
      `Planting profile: ${profile}`,
      `Plants in zone: ${zoneMeta.size} | Data: ${zoneMetaSource}`,
      `Year: ${year}`,
    ].join('\n'),
  ]

  for (let week = 1; week <= weekCount; week++) {
    const date = isoWeekWednesday(year, week)
    const fortnight = fortnightLabel(date.getMonth() * 2 + (date.getDate() <= 15 ? 0 : 1))
    const dateStr = date.toISOString().slice(0, 10)

    for (const method of ['seed', 'seedling'] as const) {
      const rows = auditLocationWeek(location, zoneMeta, date, method)
      const counts = countSummary(rows)

      const summaryBase = [
        placeId,
        csvCell(location.city ?? place.name),
        location.state,
        zone,
        profile,
        csvCell(tags),
        year,
        week,
        dateStr,
        csvCell(fortnight),
        method,
      ]

      summaryRows.push(
        [
          ...summaryBase,
          counts.ideal,
          counts.good,
          counts.timing_caution,
          counts.not_advised,
          counts.climate_not_suitable,
          counts.total,
        ].join(',')
      )

      writePlantRows(plantStream, [...summaryBase.map(String)], rows)

      if (detail) {
        detailParts.push(formatWeekDetail(date, week, method, rows))
      }
    }
  }

  if (detail) {
    const outPath = path.join(OUT_DIR, `${slugify(place.name)}-${slugify(place.state)}-plant-picker-audit.txt`)
    writeFileSync(outPath, detailParts.join('\n'), 'utf8')
    console.log(`  detail → ${path.basename(outPath)}`)
  }
}

function resolvePlaces(
  useMatrix: boolean,
  placeFilter: string | undefined,
  stateFilter: string | undefined
): AuPlace[] {
  if (placeFilter && stateFilter) {
    const p = findPlaceByName(placeFilter, stateFilter)
    if (!p) {
      console.error(`Place not found: ${placeFilter}, ${stateFilter}`)
      process.exit(1)
    }
    return [p]
  }
  if (useMatrix) {
    const places: AuPlace[] = []
    for (const { place, state } of MATRIX) {
      const p = findPlaceByName(place, state)
      if (p) places.push(p)
      else console.warn(`Missing matrix place: ${place}, ${state}`)
    }
    return places
  }
  return AU_PLACES
}

async function main(): Promise<void> {
  loadEnvFile('.env.local')
  loadEnvFile('.env')

  const year = parseYearArg()
  const useMatrix = hasFlag('--matrix')
  const summaryOnly = hasFlag('--summary-only')
  const detail = hasFlag('--detail')
  const placeFilter = parseStringArg('--place')
  const stateFilter = parseStringArg('--state')
  const writePlantsCsv = !summaryOnly && !hasFlag('--no-plants-csv')

  const places = resolvePlaces(useMatrix, placeFilter, stateFilter)
  const singlePlace = Boolean(placeFilter && stateFilter)

  if (detail && places.length > 1) {
    console.error('--detail only supports one location. Use --place and --state, or omit --detail.')
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })
  await preloadZoneMeta()

  const weekCount = weeksInYear(year)
  const summaryRows: string[] = [SUMMARY_CSV_HEADER]

  const summaryName = singlePlace
    ? `${slugify(placeFilter!)}-plant-picker-summary.csv`
    : useMatrix
      ? 'plant-picker-matrix-summary.csv'
      : 'plant-picker-everywhere-summary.csv'

  const plantsName = singlePlace
    ? `${slugify(placeFilter!)}-plant-picker-plants.csv`
    : useMatrix
      ? 'plant-picker-matrix-plants.csv'
      : 'plant-picker-everywhere-plants.csv'

  const plantStream =
    writePlantsCsv ? createWriteStream(path.join(OUT_DIR, plantsName), { encoding: 'utf8' }) : null
  if (plantStream) plantStream.write(PLANT_CSV_HEADER + '\n')

  const expectedRows = places.length * weekCount * 2
  console.log(
    `Auditing ${places.length} place(s) × ${weekCount} weeks × 2 methods = ${expectedRows} summary rows`
  )
  console.log(`Year ${year} | zone data: ${zoneMetaSource}`)

  let done = 0
  for (const place of places) {
    runForPlace(place, year, weekCount, detail, plantStream, summaryRows)
    done++
    if (done % 25 === 0 || done === places.length) {
      console.log(`  ${done}/${places.length} — ${place.name}, ${place.state}`)
    }
  }

  plantStream?.end()

  const summaryPath = path.join(OUT_DIR, summaryName)
  writeFileSync(summaryPath, summaryRows.join('\n'), 'utf8')

  console.log(`\nWrote ${summaryPath} (${summaryRows.length - 1} data rows)`)
  if (plantStream) {
    console.log(`Wrote ${path.join(OUT_DIR, plantsName)} (every plant classification)`)
  }
  console.log(
    '\nFilter plant-picker-everywhere-plants.csv by city + iso_week + plant_name to verify a specific label.'
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
