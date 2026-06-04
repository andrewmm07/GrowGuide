/**
 * Varied weather clauses for dashboard week lines (vs seasonal norms).
 */

import type { SouthernSeason } from '@/lib/seasonDisplay'
import type { WeatherSignal, WeatherSignalDetail, WarmIntensity } from '@/lib/weatherSignal'

const FROST_ADVICE_PATTERN =
  /\b(frost|frost-hardy|frost-sensitive|tender crop|cold night|cover tender|below 2)\b/i

function paragraphHasFrostAdvice(text: string): boolean {
  return FROST_ADVICE_PATTERN.test(text)
}

export interface WeatherWeaveContext {
  season: SouthernSeason
  month: string
  weekInSeason: number
  /** When true, clause describes forecast conditions, not observed past weather. */
  isForecastWeek?: boolean
}

function variantIndex(ctx: WeatherWeaveContext, salt: number, count: number): number {
  const seed =
    ctx.weekInSeason * 7 +
    ctx.month.length * 3 +
    ctx.season.length +
    salt
  return Math.abs(seed) % count
}

function pickVariant<T>(items: readonly T[], ctx: WeatherWeaveContext, salt: number): T {
  return items[variantIndex(ctx, salt, items.length)]
}

function weatherIntro(ctx: WeatherWeaveContext): string {
  if (ctx.isForecastWeek) {
    return pickVariant(
      [
        'Based on the 7-day forecast for your area,',
        'The short-range forecast suggests that, relative to what is typical for this week of the season,',
        'Looking ahead at the forecast for the rest of this week,',
      ],
      ctx,
      0
    )
  }
  return pickVariant(
    [
      `Relative to what's typical for ${ctx.month},`,
      'Looking at the past seven days,',
      'Compared with the usual pattern for this week of the season,',
      'Locally this week,',
    ],
    ctx,
    0
  )
}

function forecastVerb(ctx: WeatherWeaveContext, observed: string, forecast: string): string {
  return ctx.isForecastWeek ? forecast : observed
}

function warmNote(
  intensity: WarmIntensity | undefined,
  detail: WeatherSignalDetail | null,
  ctx: WeatherWeaveContext
): string {
  const level: WarmIntensity =
    intensity === 'strong' || intensity === 'moderate' || intensity === 'slight'
      ? intensity
      : 'slight'

  const stats =
    detail != null
      ? ` (${detail.avgMaxC.toFixed(1)}°C avg max, norm ${detail.normAvgMaxC}°C)`
      : ''

  if (level === 'strong') {
    return pickVariant(
      [
        forecastVerb(ctx,
          `temperatures were well above normal${stats}, so prioritize shade and watering for stressed crops`,
          `temperatures are forecast well above normal${stats}, so plan shade and watering for stressed crops`),
        forecastVerb(ctx,
          `the week was unusually warm for ${ctx.month}${stats}; tender seedlings and shallow beds will need extra care`,
          `the rest of the week is forecast unusually warm for ${ctx.month}${stats}; tender seedlings and shallow beds may need extra care`),
        forecastVerb(ctx,
          `heat sat well above the usual ${ctx.month} pattern${stats}, so harvest and water in the cooler part of the day`,
          `heat is forecast well above the usual ${ctx.month} pattern${stats}, so plan to harvest and water in the cooler part of the day`),
        forecastVerb(ctx,
          `the past week brought strong warmth for ${ctx.month}${stats}, so prioritise shade cloth and deep watering on exposed beds`,
          `strong warmth is forecast for ${ctx.month}${stats}, so prioritise shade cloth and deep watering on exposed beds`),
      ],
      ctx,
      1
    )
  }

  if (level === 'moderate') {
    return pickVariant(
      [
        forecastVerb(ctx,
          `days ran warmer than you'd expect for ${ctx.month}${stats}, so soil may be drying faster than usual`,
          `days are forecast warmer than you'd expect for ${ctx.month}${stats}, so soil may dry faster than usual`),
        forecastVerb(ctx,
          `the past week was noticeably warm for the season${stats}, so watch young plants and container beds`,
          `the forecast is noticeably warm for the season${stats}, so watch young plants and container beds`),
        forecastVerb(ctx,
          `temperatures sat above the usual ${ctx.month} range${stats}, so keep mulch and water up on establishing crops`,
          `temperatures are forecast above the usual ${ctx.month} range${stats}, so keep mulch and water up on establishing crops`),
        forecastVerb(ctx,
          `warmth was clearly above the ${ctx.month} norm${stats}, so check seedlings and shallow containers first`,
          `warmth is forecast above the ${ctx.month} norm${stats}, so check seedlings and shallow containers first`),
      ],
      ctx,
      2
    )
  }

  return pickVariant(
    [
      forecastVerb(ctx,
        `it was a touch warmer than usual${stats}, so keep an eye on moisture in exposed beds`,
        `it is forecast a touch warmer than usual${stats}, so keep an eye on moisture in exposed beds`),
      forecastVerb(ctx,
        `temperatures edged above the typical ${ctx.month} pattern${stats}, but growth should stay steady with normal care`,
        `temperatures are forecast slightly above the typical ${ctx.month} pattern${stats}, but growth should stay steady with normal care`),
      forecastVerb(ctx,
        `the week ran slightly warm${stats}, so check seedlings on sunny walls and paved edges`,
        `the week is forecast slightly warm${stats}, so check seedlings on sunny walls and paved edges`),
      forecastVerb(ctx,
        `days were a little warmer than the usual ${ctx.month} pattern${stats}, without major stress for established crops`,
        `days are forecast a little warmer than the usual ${ctx.month} pattern${stats}, without major stress for established crops`),
    ],
    ctx,
    3
  )
}

function dryNote(detail: WeatherSignalDetail | null, ctx: WeatherWeaveContext): string {
  const rain =
    detail != null
      ? ` (${detail.totalRainMm.toFixed(0)} mm vs about ${detail.normWeeklyRainMm.toFixed(0)} mm typical)`
      : ''

  const summerDry = [
    forecastVerb(ctx,
      `rain was scarce${rain}, so irrigate deeply in the morning before heat and sea breeze pull soil moisture down`,
      `rain is forecast scarce${rain}, so plan to irrigate deeply in the morning before heat and sea breeze pull soil moisture down`),
    forecastVerb(ctx,
      `the week was very dry${rain}, so mulch exposed beds and prioritise water for fruiting crops and new seedlings`,
      `the week is forecast very dry${rain}, so mulch exposed beds and prioritise water for fruiting crops and new seedlings`),
  ]
  const autumnDry = [
    forecastVerb(ctx,
      `rainfall was well below normal${rain}, so water in new garlic and brassicas while soil still has warmth`,
      `rainfall is forecast well below normal${rain}, so water in new garlic and brassicas while soil still has warmth`),
    forecastVerb(ctx,
      `the week was drier than usual${rain}, so check establishing winter crops rather than assuming recent showers were enough`,
      `the week is forecast drier than usual${rain}, so check establishing winter crops rather than assuming showers will be enough`),
  ]
  const defaultDry = [
    forecastVerb(ctx,
      `rain was well below normal${rain}, so verify soil moisture before you delay watering`,
      `rain is forecast well below normal${rain}, so verify soil moisture before you delay watering`),
    forecastVerb(ctx,
      `the past week brought little rain${rain}, so water deeply where plants are flagging`,
      `little rain is forecast${rain}, so plan to water deeply where plants are flagging`),
  ]

  if (ctx.season === 'Summer') return pickVariant(summerDry, ctx, 4)
  if (ctx.season === 'Autumn') return pickVariant(autumnDry, ctx, 5)
  return pickVariant(defaultDry, ctx, 6)
}

function wetNote(detail: WeatherSignalDetail | null, ctx: WeatherWeaveContext): string {
  const rain =
    detail != null
      ? ` (${detail.totalRainMm.toFixed(0)} mm vs about ${detail.normWeeklyRainMm.toFixed(0)} mm typical)`
      : ''

  return pickVariant(
    [
      forecastVerb(ctx,
        `rain was well above normal${rain}, so avoid sowing into waterlogged beds, improve drainage where water sits, and watch brassicas for mildew`,
        `rain is forecast well above normal${rain}, so avoid sowing into waterlogged beds, improve drainage where water sits, and watch brassicas for mildew`),
      forecastVerb(ctx,
        `the week was much wetter than usual${rain}, so hold off harvesting root crops from soggy soil and ventilate covered greens`,
        `the week is forecast much wetter than usual${rain}, so plan to hold off harvesting root crops from soggy soil and ventilate covered greens`),
      forecastVerb(ctx,
        `heavy rain compared with the ${ctx.month} norm${rain}, so check slugs around seedlings and delay digging until beds firm up`,
        `heavy rain is forecast compared with the ${ctx.month} norm${rain}, so check slugs around seedlings and delay digging until beds firm up`),
      forecastVerb(ctx,
        `wet weather dominated${rain}, so favour container work and paths, and protect soft fruit from splitting and fungal spots`,
        `wet weather is expected${rain}, so favour container work and paths, and protect soft fruit from splitting and fungal spots`),
    ],
    ctx,
    7
  )
}

function frostNote(ctx: WeatherWeaveContext): string {
  return ctx.isForecastWeek
    ? 'frost is possible in the forecast, so keep cover ready for tender crops'
    : 'a night below 2°C was recorded recently, so keep cover ready for tender crops'
}

function lowercaseFirst(s: string): string {
  if (!s) return s
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function joinNotes(intro: string, notes: string[]): string {
  if (notes.length === 0) return ''
  if (notes.length === 1) return `${intro} ${lowercaseFirst(notes[0])}.`
  if (notes.length === 2) return `${intro} ${lowercaseFirst(notes[0])}, and ${notes[1]}.`
  return `${intro} ${lowercaseFirst(notes[0])}, ${notes[1]}, and ${notes[2]}.`
}

const WET_ALREADY_PATTERN =
  /\b(waterlog|soggy|drainage|mildew|fungal|slug|sodden|heavy rain|wet weather)\b/i

export function weaveWeatherIntoWeekLine(
  weekLine: string,
  signal: WeatherSignal | null,
  detail: WeatherSignalDetail | null,
  ctx?: WeatherWeaveContext
): string {
  if (!signal || !weekLine.trim()) return weekLine

  const base = weekLine.trim().replace(/[.!?]+\s*$/, '')
  const weaveCtx: WeatherWeaveContext = ctx ?? {
    season: 'Spring',
    month: 'September',
    weekInSeason: 1,
  }

  const notes: string[] = []

  if (signal.frostEvent && !paragraphHasFrostAdvice(base)) {
    notes.push(frostNote(weaveCtx))
  }

  if (signal.wetSignal && !WET_ALREADY_PATTERN.test(base)) {
    notes.push(wetNote(detail, weaveCtx))
  }

  if (signal.warmDeviation && signal.warmIntensity !== 'none') {
    notes.push(warmNote(signal.warmIntensity, detail, weaveCtx))
  }

  if (signal.droughtSignal && !signal.wetSignal) {
    notes.push(dryNote(detail, weaveCtx))
  }

  const capped = notes.filter(Boolean).slice(0, 2)
  if (capped.length === 0) return `${base}.`

  const clause = joinNotes(weatherIntro(weaveCtx), capped)
  return `${base}. ${clause}`
}
