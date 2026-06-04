/**
 * Preview dashboard week guidance for a full calendar year.
 *
 * Run:
 *   npm.cmd run preview:blackmans-bay
 *   npm.cmd run preview:blackmans-bay -- --year 2025
 *   npm.cmd exec tsx scripts/preview-blackmans-bay-weekly.ts -- --place "Potts Point" --state NSW --year 2025
 *   npm.cmd exec tsx scripts/preview-blackmans-bay-weekly.ts -- --place Fremantle --state WA --year 2025
 *
 * Output: scripts/<place-slug>-weekly-output.txt
 */

import { writeFileSync } from 'fs'
import { join } from 'path'
import { findPlaceByName, userLocationFromPlace } from '../lib/places'
import {
  applyWeatherToWeeklyOverview,
  buildWeeklySeasonGuidance,
} from '../lib/weeklyGuidanceService'
import { computeSeasonDisplay } from '../lib/seasonDisplay'
import { resolveLocationContext } from '../lib/microclimate/resolve'
import { buildAccumulatedCondition } from '../lib/rollingWeatherCondition'
import { inferWeeklyGuidance } from '../lib/weeklyGuidanceInference'
import {
  fetchPreviewYearArchive,
  getRollingWeatherContextForDate,
  getWeatherSignalForDate,
  rollingContextFromArchiveDaily,
  weatherSignalFromArchiveDaily,
  type WeatherSignalDetail,
} from '../lib/weatherSignal'

const TODAY = new Date()
const ARCHIVE_DELAY_MS = 0

function parseYearArg(): number {
  const idx = process.argv.indexOf('--year')
  if (idx >= 0 && process.argv[idx + 1]) {
    const y = Number.parseInt(process.argv[idx + 1], 10)
    if (!Number.isNaN(y) && y >= 2000 && y <= 2100) return y
  }
  return TODAY.getFullYear()
}

function parseStringArg(flag: string, fallback: string): string {
  const idx = process.argv.indexOf(flag)
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return fallback
}

function slugifyPlace(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const PREVIEW_YEAR = parseYearArg()
const PLACE_NAME = parseStringArg('--place', 'Blackmans Bay')
const PLACE_STATE = parseStringArg('--state', 'TAS')

const place = findPlaceByName(PLACE_NAME, PLACE_STATE)
if (!place) {
  console.error('Place not found')
  process.exit(1)
}

const { lat, lon } = place
const location = userLocationFromPlace(place)
const ctx = resolveLocationContext(location)
const tags = ctx?.microclimateTags ?? []

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatSignal(signal: WeatherSignalDetail | null, skipped: boolean): string {
  if (skipped) return 'weather: skipped (future date)'
  if (!signal) return 'weather: unavailable'
  const warmLabel =
    signal.warmIntensity === 'strong'
      ? 'WARM+'
      : signal.warmIntensity === 'moderate'
        ? 'WARM'
        : signal.warmIntensity === 'slight'
          ? 'warm'
          : null
  const flags = [
    warmLabel,
    signal.frostEvent ? 'FROST' : null,
    signal.droughtSignal ? 'DRY' : null,
    signal.wetSignal ? 'WET' : null,
  ].filter(Boolean)
  const flagStr = flags.length > 0 ? flags.join(' + ') : 'none'
  return (
    `weather: ${flagStr} | 7d avg max ${signal.avgMaxC.toFixed(1)}°C (norm ${signal.normAvgMaxC}°C), ` +
    `rain ${signal.totalRainMm.toFixed(0)} mm (norm ${signal.normWeeklyRainMm.toFixed(0)} mm/wk)`
  )
}

function formatAccumulated(
  guidance: ReturnType<typeof buildWeeklySeasonGuidance>,
  rolling: Awaited<ReturnType<typeof getRollingWeatherContextForDate>>,
  signal: WeatherSignalDetail | null
): string {
  if (!guidance || !rolling) return 'rolling: unavailable'
  const acc = buildAccumulatedCondition(rolling.weekWeather, rolling.weekNorms)
  const inferred = inferWeeklyGuidance({
    baseWeekLine: guidance.overview,
    accumulatedCondition: acc,
    season: guidance.bandSeason,
    weekInSeason: guidance.weekInSeason,
    weekBand:
      guidance.weekInSeason <= 4 ? 'early' : guidance.weekInSeason <= 8 ? 'mid' : 'late',
    climate: guidance.climate,
    tags,
    frostThisWeek: (signal?.frostEvent ?? rolling?.signal.frostEvent) ?? false,
    warmMagnitude: rolling?.signal.warmMagnitude ?? null,
    dryMagnitude: rolling?.signal.dryMagnitude ?? null,
    wetMagnitude: rolling?.signal.wetMagnitude ?? null,
  })
  const mode = inferred.replacedBaseLine ? 'replaced' : inferred.inferredParagraph === guidance.overview ? 'base' : 'append'
  const dominantForDisplay =
    (signal?.frostEvent ?? rolling?.signal.frostEvent) && acc.dominantSignal === 'NORMAL'
      ? 'FROST'
      : acc.dominantSignal ?? 'none'
  return (
    `rolling: soil=${acc.soilMoistureState} temp=${acc.temperatureTrend} ` +
    `forecast=${acc.forecastDirection}/${acc.forecastTempDirection} ` +
    `dominant=${dominantForDisplay} sustained=${acc.sustainedAnomaly} mode=${mode}`
  )
}

const header = [
  `Location: ${location.city}, ${location.state}`,
  `Place id: ${location.placeId}`,
  `Climate: ${ctx?.climate} | Tags: ${tags.join(', ') || 'none'}`,
  `Preview year: ${PREVIEW_YEAR} (use --year YYYY for a full archive year)`,
  '---',
  '',
].join('\n')

const lines: string[] = [header]

function isoDateLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

async function run(): Promise<void> {
  const yearArchive = await fetchPreviewYearArchive(lat, lon, PREVIEW_YEAR)
  if (!yearArchive) {
    console.warn(
      `Warning: could not load ${PREVIEW_YEAR} archive for ${PLACE_NAME}; per-week fetches will be slower and may rate-limit.`
    )
  }

  for (let w = 0; w < 52; w++) {
    const date = new Date(PREVIEW_YEAR, 0, 1 + w * 7)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const isFuture =
      dateOnly > new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate())

    const guidance = buildWeeklySeasonGuidance(location, date)
    if (!guidance) continue

    const display = computeSeasonDisplay(date, ctx?.seasonCalendar ?? 'southern_four_seasons')
    const band =
      display.weekInSeason <= 4 ? 'early' : display.weekInSeason <= 8 ? 'mid' : 'late'

    let signal: WeatherSignalDetail | null = null
    let rolling: Awaited<ReturnType<typeof getRollingWeatherContextForDate>> = null

    if (!isFuture) {
      if (yearArchive) {
        signal = weatherSignalFromArchiveDaily(
          yearArchive,
          guidance.climate,
          guidance.month,
          date
        )
        rolling = rollingContextFromArchiveDaily(yearArchive, guidance.climate, date)
      } else {
        ;[signal, rolling] = await Promise.all([
          getWeatherSignalForDate(lat, lon, guidance.climate, guidance.month, date),
          getRollingWeatherContextForDate(lat, lon, guidance.climate, date),
        ])
        if (ARCHIVE_DELAY_MS > 0) await sleep(ARCHIVE_DELAY_MS)
      }
    }

    const final = isFuture
      ? guidance
      : applyWeatherToWeeklyOverview(guidance, signal, signal, rolling, tags)

    const dateStr = isoDateLocal(date)
    lines.push(
      `### W${String(w + 1).padStart(2, '0')} · ${dateStr} · ${display.month} · ${band}`,
      `**${final.season} (Week ${final.weekInSeason})**`,
      formatSignal(signal, isFuture),
      formatAccumulated(guidance, rolling, signal),
      '',
      final.overview,
      ''
    )
  }

  const outPath = join(__dirname, `${slugifyPlace(PLACE_NAME)}-weekly-output.txt`)
  writeFileSync(outPath, lines.join('\n'), 'utf8')
  console.log(lines.join('\n'))
  console.log(`\nWritten to ${outPath}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
