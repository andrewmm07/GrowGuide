import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAccumulatedCondition } from '@/lib/rollingWeatherCondition'
import { hasWateringConflict } from '@/lib/weeklyGuidanceInference'
import type { WeekNorm, WeekWeatherSummary } from '@/lib/types/weatherGuidance'

function norm(rain = 10, max = 20): WeekNorm {
  return {
    climate: 'cold',
    month: 'April',
    weekOfMonth: 1,
    expectedMaxTemp: max,
    expectedMinTemp: 10,
    expectedRainfallMm: rain,
  }
}

function week(rain = 10, max = 20, isForecast = false): WeekWeatherSummary {
  return {
    avgMaxTempC: max,
    avgMinTempC: 10,
    totalRainMm: rain,
    hasFrost: false,
    isForecast,
  }
}

test('all-normal input stays normal', () => {
  const actual = [week(10, 20), week(9, 21), week(11, 19, true)]
  const norms = [norm(10, 20), norm(10, 20), norm(10, 20)]
  const out = buildAccumulatedCondition(actual, norms)
  assert.equal(out.soilMoistureState, 'normal')
  assert.equal(out.temperatureTrend, 'near_norm')
  assert.equal(out.dominantSignal, 'NORMAL')
  assert.equal(out.sustainedAnomaly, false)
  assert.equal(out.currentWeekSignal, 'NORMAL')
  assert.equal(out.currentWeekIsForecast, true)
})

test('sustained DRY over 2 of 3 weeks', () => {
  const actual = [week(2, 20), week(1.5, 20), week(2, 20, true)]
  const norms = [norm(), norm(), norm()]
  const out = buildAccumulatedCondition(actual, norms)
  assert.equal(out.soilMoistureState, 'dry')
  assert.equal(out.dominantSignal, 'DRY')
  assert.equal(out.sustainedAnomaly, true)
  assert.equal(out.forecastDirection, 'drying')
})

test('sustained WET becomes saturated', () => {
  const actual = [week(18, 20), week(20, 20), week(16, 20, true)]
  const norms = [norm(), norm(), norm()]
  const out = buildAccumulatedCondition(actual, norms)
  assert.equal(out.soilMoistureState, 'saturated')
  assert.equal(out.dominantSignal, 'WET')
  assert.equal(out.sustainedAnomaly, true)
  assert.equal(out.forecastDirection, 'wetting')
})

test('WARM + DRY combination still prioritizes DRY dominant signal', () => {
  const actual = [week(2, 24), week(2, 25), week(2, 24, true)]
  const norms = [norm(10, 20), norm(10, 20), norm(10, 20)]
  const out = buildAccumulatedCondition(actual, norms)
  assert.equal(out.soilMoistureState, 'dry')
  assert.equal(out.temperatureTrend, 'significantly_above')
  assert.equal(out.dominantSignal, 'DRY')
})

test('watering conflict detection catches contradictory baseline', () => {
  const accumulated = buildAccumulatedCondition(
    [week(2, 24), week(2, 24), week(2, 24, true)],
    [norm(10, 20), norm(10, 20), norm(10, 20)]
  )
  assert.equal(
    hasWateringConflict('Ease back on watering as temperatures cool.', accumulated),
    true
  )
})
