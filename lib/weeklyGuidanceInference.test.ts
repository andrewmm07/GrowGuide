import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAccumulatedCondition } from '@/lib/rollingWeatherCondition'
import { inferWeeklyGuidance } from '@/lib/weeklyGuidanceInference'

function norm(rain = 10, max = 20) {
  return {
    climate: 'cold' as const,
    month: 'July',
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

test('sustained winter dry replacements differ by week-in-season', () => {
  const actual = [week(2, 12), week(2, 12), week(2, 12, true)]
  const norms = [norm(), norm(), norm()]
  const acc = buildAccumulatedCondition(actual, norms)
  const a = inferWeeklyGuidance({
    baseWeekLine: 'Midwinter maintenance.',
    accumulatedCondition: acc,
    season: 'Winter',
    weekInSeason: 6,
    weekBand: 'mid',
    climate: 'cold',
    tags: ['coastal'],
    frostThisWeek: false,
    warmMagnitude: null,
    dryMagnitude: 'strong',
    wetMagnitude: null,
  })
  const b = inferWeeklyGuidance({
    baseWeekLine: 'Midwinter maintenance.',
    accumulatedCondition: acc,
    season: 'Winter',
    weekInSeason: 7,
    weekBand: 'mid',
    climate: 'cold',
    tags: ['coastal'],
    frostThisWeek: false,
    warmMagnitude: null,
    dryMagnitude: 'strong',
    wetMagnitude: null,
  })
  assert.equal(a.replacedBaseLine, true)
  assert.equal(b.replacedBaseLine, true)
  assert.notEqual(a.inferredParagraph, b.inferredParagraph)
  assert.match(a.inferredParagraph, /dormant|pots|overwintering/i)
})

test('single wet spring week appends and keeps base line', () => {
  const actual = [week(10, 15), week(10, 15), week(44, 15, true)]
  const norms = [norm(13), norm(13), norm(13)]
  const acc = buildAccumulatedCondition(actual, norms)
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
  })
  assert.equal(result.replacedBaseLine, false)
  assert.match(result.inferredParagraph, /Harden off cool-season seedlings/)
})

test('dry spell with wet current week uses transition wording', () => {
  const actual = [week(2, 14), week(2, 14), week(23, 14, true)]
  const norms = [norm(16), norm(16), norm(16)]
  const acc = buildAccumulatedCondition(actual, norms)
  const accRelief = { ...acc, currentWeekRainRelief: true }
  const result = inferWeeklyGuidance({
    baseWeekLine: 'Check overwintering brassicas and greens.',
    accumulatedCondition: accRelief,
    season: 'Winter',
    weekInSeason: 7,
    weekBand: 'mid',
    climate: 'cold',
    tags: ['coastal'],
    frostThisWeek: false,
    warmMagnitude: null,
    dryMagnitude: 'moderate',
    wetMagnitude: null,
  })
  assert.match(
    result.inferredParagraph,
    /recovering from a dry spell|dry weather|useful rain is forecast|brought useful rain/i
  )
})

test('frost with dry rolling state mentions frost first', () => {
  const actual = [week(2, 13), week(2, 13), week(2, 13, true)]
  actual[2].hasFrost = true
  const norms = [norm(15), norm(15), norm(15)]
  const acc = buildAccumulatedCondition(actual, norms)
  const result = inferWeeklyGuidance({
    baseWeekLine: 'Spring is approaching: finalise seed orders.',
    accumulatedCondition: acc,
    season: 'Winter',
    weekInSeason: 12,
    weekBand: 'late',
    climate: 'cold',
    tags: ['coastal'],
    frostThisWeek: true,
    warmMagnitude: null,
    dryMagnitude: 'strong',
    wetMagnitude: null,
  })
  assert.match(result.inferredParagraph, /cold nights|frost|tender crops/i)
})

test('marginal warm april week appends calibrated warm context', () => {
  const actual = [week(11, 19), week(11, 19), week(16, 19, true)]
  const norms = [norm(13, 16), norm(13, 16), norm(13, 16)]
  const acc = buildAccumulatedCondition(actual, norms)
  const result = inferWeeklyGuidance({
    baseWeekLine: 'Evenings are cooling on the coast.',
    accumulatedCondition: acc,
    season: 'Autumn',
    weekInSeason: 7,
    weekBand: 'mid',
    climate: 'cold',
    tags: ['coastal'],
    frostThisWeek: false,
    warmMagnitude: 'marginal',
    dryMagnitude: null,
    wetMagnitude: null,
  })
  assert.match(result.inferredParagraph, /Evenings are cooling on the coast\./)
  assert.match(result.inferredParagraph, /slightly above normal|warmer than usual/i)
  assert.doesNotMatch(result.inferredParagraph, /stress/i)
})

test('sustained saturated autumn week keeps seasonal base and appends wet context', () => {
  const actual = [week(55, 18), week(48, 17), week(40, 16, true)]
  const norms = [norm(12, 18), norm(12, 18), norm(12, 18)]
  const acc = buildAccumulatedCondition(actual, norms)
  const base =
    'The last stretch of autumn in Melbourne is practically winter. Serious transition week. Keep covers handy for surprise cold or frost.'
  const result = inferWeeklyGuidance({
    baseWeekLine: base,
    accumulatedCondition: acc,
    season: 'Autumn',
    weekInSeason: 13,
    weekBand: 'late',
    climate: 'cool',
    tags: ['coastal'],
    frostThisWeek: false,
    warmMagnitude: null,
    dryMagnitude: null,
    wetMagnitude: 'strong',
  })
  assert.equal(result.replacedBaseLine, false)
  assert.match(result.inferredParagraph, /practically winter/i)
  assert.doesNotMatch(result.inferredParagraph, /^Soil is heavy and wet; finish garlic/i)
})

test('single wet week does not replace base line when sustained is false', () => {
  const actual = [week(8, 17), week(10, 17), week(44, 17, true)]
  const norms = [norm(13, 17), norm(13, 17), norm(13, 17)]
  const acc = buildAccumulatedCondition(actual, norms)
  const result = inferWeeklyGuidance({
    baseWeekLine: 'Plant summer crops under cover; increase watering as growth accelerates.',
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
  })
  assert.equal(acc.sustainedAnomaly, false)
  assert.equal(result.replacedBaseLine, false)
  assert.match(result.inferredParagraph, /Plant summer crops under cover/)
})
