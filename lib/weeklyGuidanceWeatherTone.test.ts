import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAccumulatedCondition } from '@/lib/rollingWeatherCondition'
import { inferWeeklyGuidance } from '@/lib/weeklyGuidanceInference'
import {
  frameAppendedClause,
  plantingWeatherCalloutLabel,
  resolveWeatherClauseTone,
  weatherEnrichmentFootnote,
} from '@/lib/weeklyGuidanceWeatherTone'

function norm(rain = 10, max = 20) {
  return {
    climate: 'cold' as const,
    month: 'October',
    weekOfMonth: 1 as const,
    expectedMaxTemp: max,
    expectedMinTemp: 5,
    expectedRainfallMm: rain,
  }
}

function week(rain: number, max: number, isForecast = false) {
  return {
    avgMaxTempC: max,
    avgMinTempC: 5,
    totalRainMm: rain,
    hasFrost: false,
    isForecast,
  }
}

test('forecast week uses forecast tone and wording', () => {
  const actual = [week(10, 15), week(10, 15), week(44, 15, true)]
  const norms = [norm(13), norm(13), norm(13)]
  const acc = buildAccumulatedCondition(actual, norms)
  assert.equal(acc.currentWeekIsForecast, true)
  assert.equal(resolveWeatherClauseTone(acc, actual), 'forecast')

  const result = inferWeeklyGuidance({
    baseWeekLine: 'Harden off cool-season seedlings on the coast and sow peas.',
    accumulatedCondition: acc,
    season: 'Spring',
    weekInSeason: 10,
    weekBand: 'late',
    climate: 'cold',
    tags: ['coastal'],
    frostThisWeek: false,
    warmMagnitude: null,
    dryMagnitude: null,
    wetMagnitude: 'strong',
    weekWeather: actual,
  })

  assert.equal(result.weatherClauseTone, 'forecast')
  assert.match(result.inferredParagraph, /7-day forecast/i)
  assert.doesNotMatch(result.inferredParagraph, /\bBeds are wetter than usual\b/i)
  assert.doesNotMatch(result.inferredParagraph, /\bthe week was much wetter\b/i)
  assert.match(result.inferredParagraph, /is forecast|are forecast/i)
})

test('weather enrichment footnote explains recent vs forecast clearly', () => {
  assert.equal(
    weatherEnrichmentFootnote('mixed'),
    'This guidance has been informed by your recent and forecast weather.'
  )
  assert.match(weatherEnrichmentFootnote('forecast'), /informed by the weather forecast/)
  assert.match(weatherEnrichmentFootnote('observed'), /informed by your recent weather/)
})

test('frameAppendedClause hedges transition rain after dry spell', () => {
  const observed =
    'Beds are recovering from a dry spell, and this week brought useful rain; pause heavy watering and reassess soil condition before direct sowing or digging.'
  const framed = frameAppendedClause(observed, 'forecast')
  assert.match(framed, /7-day forecast/i)
  assert.match(framed, /forecast.*useful rain|useful rain is forecast/i)
  assert.doesNotMatch(framed, /this week brought useful rain/i)
})

test('frameAppendedClause lowercases continuation after forecast comma prefix', () => {
  const observed =
    'This is more than a wet winter week; focus on drainage recovery and plant survival before routine maintenance.'
  const framed = frameAppendedClause(observed, 'forecast')
  assert.match(
    framed,
    /Based on the 7-day forecast for your area, more than a typical wet winter week is forecast/i
  )
  assert.doesNotMatch(framed, /your area, More than/)
})

test('plantingWeatherCalloutLabel describes weather provenance', () => {
  assert.equal(plantingWeatherCalloutLabel('observed'), 'Based on recent weather')
  assert.equal(plantingWeatherCalloutLabel('forecast'), 'Based on your 7-day forecast')
  assert.equal(
    plantingWeatherCalloutLabel('mixed'),
    'Based on recent weather and forecast'
  )
})
