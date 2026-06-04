import type { AccumulatedCondition, WeekWeatherSummary } from '@/lib/types/weatherGuidance'

export type WeatherClauseTone = 'observed' | 'forecast' | 'mixed'

/** Whether the rolling window's current week is forecast (not yet observed). */
export function currentWeekIsForecast(weekWeather: WeekWeatherSummary[]): boolean {
  const last = weekWeather[weekWeather.length - 1]
  return last?.isForecast === true
}

/**
 * How to phrase weather clauses appended to the seasonal week line.
 * - observed: past/recent actual weather only
 * - forecast: current-week signal comes from the 7-day forecast
 * - mixed: sustained pattern from prior weeks + forecast for the rest of this week
 */
export function resolveWeatherClauseTone(
  acc: AccumulatedCondition,
  weekWeather: WeekWeatherSummary[]
): WeatherClauseTone {
  if (!acc.currentWeekIsForecast) return 'observed'

  const observedCount = weekWeather.filter((w) => !w.isForecast).length
  if (observedCount === 0) return 'forecast'

  const streakWeeks = weekWeather.slice(-Math.max(acc.streakWeeks, 1))
  const streakUsesObserved = streakWeeks.some((w) => !w.isForecast) && acc.streakWeeks >= 2

  if (streakUsesObserved && acc.sustainedAnomaly) return 'mixed'

  // Observed dry run with forecast rain relief (transition append)
  if (
    acc.currentWeekRainRelief &&
    acc.soilMoistureState === 'dry' &&
    acc.currentWeekSignal === 'WET'
  ) {
    return 'mixed'
  }

  // Saturated/wet streak spanning observed + forecast weeks
  if (
    (acc.soilMoistureState === 'wet' || acc.soilMoistureState === 'saturated') &&
    streakUsesObserved &&
    streakWeeks.some((w) => w.isForecast)
  ) {
    return 'mixed'
  }

  return 'forecast'
}

const FORECAST_PREFIX = 'Based on the 7-day forecast for your area,'

/** Lowercase the first letter when continuing a sentence after a comma-ending prefix. */
function continueAfterComma(prefix: string, continuation: string): string {
  const body = continuation.trim()
  if (!body) return prefix
  return `${prefix} ${body.charAt(0).toLowerCase()}${body.slice(1)}`
}

/** Wrap an observed-style clause for forecast or mixed tone. */
export function frameAppendedClause(clause: string, tone: WeatherClauseTone): string {
  if (tone === 'observed') return clause

  if (/recovering from a dry spell/i.test(clause)) {
    const indoor = /under cover|propagation/i.test(clause)
    if (indoor) {
      return continueAfterComma(
        FORECAST_PREFIX,
        'After recent dry weather, useful rain is forecast for the rest of the week; keep propagation work moving under cover while outdoor bed prep waits until beds drain fully.'
      )
    }
    const transition =
      'After recent dry weather, useful rain is forecast for the rest of the week; pause heavy watering and reassess soil condition before direct sowing or digging.'
    if (tone === 'forecast') return continueAfterComma(FORECAST_PREFIX, transition)
    return `Beds are still recovering from recent dry weather, and ${transition.charAt(0).toLowerCase()}${transition.slice(1)}`
  }

  if (tone === 'forecast') {
    return continueAfterComma(FORECAST_PREFIX, forecastHedge(clause))
  }

  // mixed: observed soil/history + forecast for the rest of the week
  const hedged = forecastHedge(clause)
  if (/drying after recent wet/i.test(clause)) {
    return `Soil is drying after recent wet weather; ${hedged.charAt(0).toLowerCase()}${hedged.slice(1)}`
  }
  if (/easing|settling|recovering/i.test(clause)) {
    return `Recent conditions have been unsettled; ${hedged.charAt(0).toLowerCase()}${hedged.slice(1)}`
  }
  return continueAfterComma(FORECAST_PREFIX, hedged)
}

function forecastHedge(clause: string): string {
  let s = clause.trim()
  const replacements: [RegExp, string][] = [
    [/\bthis week brought useful rain\b/gi, 'useful rain is forecast for the rest of the week'],
    [/\bthis week brought relief\b/gi, 'rain is forecast to bring relief'],
    [/\bthis week\b/gi, 'the rest of this week'],
    [/\bMonsoonal moisture is dominating this week\b/gi, 'monsoonal moisture is expected this week'],
    [/\bMoisture remains high this week\b/gi, 'more wet weather is forecast for the rest of the week'],
    [/\bBeds are wetter than usual\b/gi, 'rain is forecast to be wetter than usual'],
    [/\bBeds are\b/g, 'Beds may be'],
    [/\bSoil is\b/g, 'Soil is likely to be'],
    [/\bSoil is staying\b/gi, 'Soil is expected to stay'],
    [/\bPersistent wet conditions are\b/gi, 'Wet conditions are forecast to be'],
    [/\bAutumn beds are remaining wetter than normal\b/gi, 'Wetter-than-usual rain is forecast for autumn beds'],
    [/\bWinter soil remains persistently wet\b/gi, 'Persistently wet weather is forecast'],
    [/\bSpring beds are staying wet\b/gi, 'Wet weather is forecast to keep spring beds damp'],
    [/\bRain is easing\b/gi, 'Rain is forecast to ease'],
    [/\bWet-season pressure is easing\b/gi, 'Wet-season pressure is forecast to ease'],
    [/\bConditions are beginning to settle\b/gi, 'Conditions are forecast to settle'],
    [/\bRecent wet conditions are easing\b/gi, 'Recent wet conditions may ease, though the forecast still looks damp'],
    [/\bThe wet spell is easing\b/gi, 'The wet spell may ease, though the forecast still looks damp'],
    [/\bHigh humidity and persistent moisture are\b/gi, 'High humidity and persistent moisture are expected to be'],
    [/\bWarm wet conditions favour\b/gi, 'Warm wet conditions are likely to favour'],
    [/\bRainfall is extreme for tropical conditions\b/gi, 'Extreme rainfall is forecast for tropical conditions'],
    [/\bThis wet pulse is severe\b/gi, 'A severe wet pulse is forecast'],
    [/\bExceptionally heavy tropical rain needs\b/gi, 'Exceptionally heavy tropical rain is forecast—plan for'],
    [/\bRainfall has been exceptionally heavy\b/gi, 'Exceptionally heavy rain is forecast'],
    [/\bRainfall is well above normal\b/gi, 'Rainfall is forecast well above normal'],
    [/\bThis is more than a wet winter week\b/gi, 'More than a typical wet winter week is forecast'],
    [/\bSpring rain is exceptionally heavy\b/gi, 'Exceptionally heavy spring rain is forecast'],
    [/\bDry summer week\b/gi, 'A dry summer week is forecast'],
    [/\bLong dry spell\b/gi, 'A long dry spell is forecast'],
    [/\bSoil is parched\b/gi, 'Soil is forecast to stay parched'],
    [/\bHeat and low rain\b/gi, 'Heat and low rain are forecast'],
    [/\bA dry break after rain\b/gi, 'A dry break is forecast after recent rain'],
    [/\bTopsoil is drying\b/gi, 'Topsoil is forecast to dry'],
    [/\bA dry winter week is unusual\b/gi, 'An unusually dry winter week is forecast'],
    [/\bSurface soil is dry\b/gi, 'Surface soil is forecast to dry'],
    [/\bDry spring patch\b/gi, 'A dry spring patch is forecast'],
    [/\bRain is easing early\b/gi, 'Rain is forecast to ease early'],
    [/\bSoil is drying fast\b/gi, 'Soil is forecast to dry quickly'],
    [/\bDry conditions\b/gi, 'Dry conditions are forecast'],
    [/\bSoil is drying\b/gi, 'Soil is forecast to dry'],
    [/\bBeds are drier than usual\b/gi, 'Beds are forecast to be drier than usual'],
    [/\bDry air and little rain\b/gi, 'Dry air and little rain are forecast'],
    [/\bHeat is clearly above normal\b/gi, 'Heat is forecast clearly above normal'],
    [/\bDays are running warmer than usual\b/gi, 'Days are forecast warmer than usual'],
    [/\bTemperatures are slightly above normal\b/gi, 'Temperatures are forecast slightly above normal'],
    [/\bGrowth may be slower\b/gi, 'Growth may be slower if cool weather arrives as forecast'],
    [/\bCooler than usual\b/gi, 'Cooler-than-usual weather is forecast'],
    [/\bCold conditions\b/gi, 'Cold conditions are forecast'],
    [/\bCool spell\b/gi, 'A cool spell is forecast'],
    [/\bTender crops are at risk after recent cold nights\b/gi, 'Tender crops are at risk if cold nights arrive as forecast'],
    [/\ba night below 2°C was recorded recently\b/gi, 'frost is possible in the forecast'],
    [/\bkeep cover ready for tender crops\b/gi, 'keep cover ready for tender crops if frost is forecast'],
  ]

  for (const [pattern, replacement] of replacements) {
    s = s.replace(pattern, replacement)
  }

  return s
}

export function frameReplacedParagraph(
  paragraph: string,
  tone: WeatherClauseTone
): string {
  if (tone === 'observed') return paragraph

  const sentences = paragraph.match(/[^.!?]+[.!?]+/g) ?? [paragraph]
  if (sentences.length === 0) return paragraph

  if (tone === 'forecast') {
    return continueAfterComma(FORECAST_PREFIX, forecastHedge(sentences.join(' ').trim()))
  }

  // mixed: hedge only the final sentence if it describes the forecast week
  const last = sentences[sentences.length - 1] ?? ''
  const rest = sentences.slice(0, -1).join(' ').trim()
  const hedgedLast = forecastHedge(last)
  if (!rest) return continueAfterComma(FORECAST_PREFIX, hedgedLast)
  return `${rest} ${hedgedLast}`
}

export function weatherEnrichmentFootnote(tone: WeatherClauseTone): string {
  switch (tone) {
    case 'forecast':
      return 'This guidance has been informed by the weather forecast for your area.'
    case 'mixed':
      return 'This guidance has been informed by your recent and forecast weather.'
    default:
      return 'This guidance has been informed by your recent weather.'
  }
}

/** Short label for weather-only planting callouts (dashboard / weekly brief). */
export function plantingWeatherCalloutLabel(tone: WeatherClauseTone): string {
  switch (tone) {
    case 'forecast':
      return 'Based on your 7-day forecast'
    case 'mixed':
      return 'Based on recent weather and forecast'
    default:
      return 'Based on recent weather'
  }
}
