import test from 'node:test'
import assert from 'node:assert/strict'
import {
  isNonActionableActivity,
  normalizeActivityCopy,
  polishScheduleActivities,
} from '@/lib/plantActivityCopy'

test('drops vague watering advice', () => {
  assert.equal(
    isNonActionableActivity({
      activity: 'Maintain consistent moisture',
      details: 'Water regularly',
    }),
    true
  )
  assert.equal(
    isNonActionableActivity({
      activity: 'Water consistently to slow bolting',
      details: 'Keep soil moist',
    }),
    true
  )
  assert.equal(
    normalizeActivityCopy({
      activity: 'Keep consistently moist',
      details: 'Daily misting',
      category: 'watering',
    }),
    null
  )
})

test('Monitor becomes Check', () => {
  const out = normalizeActivityCopy({
    activity: 'Monitor for pests and disease',
    details: 'Inspect plants regularly. Monitor for aphids.',
    category: 'pest',
  })
  assert.ok(out)
  assert.equal(out!.activity, 'Check for pests and disease')
  assert.match(out!.details, /Check for aphids/)
})

test('Avoid nitrogen becomes active fertiliser task', () => {
  const out = normalizeActivityCopy({
    activity: 'Avoid high nitrogen fertiliser',
    details: 'Use a low-nitrogen blend when side-dressing.',
    category: 'fertilizing',
  })
  assert.ok(out)
  assert.equal(out!.activity, 'Apply potassium and phosphorus')
  assert.match(out!.details, /Avoid high-nitrogen/)
})

test('drops sheltered planting advice and routine watering titles', () => {
  assert.equal(
    isNonActionableActivity({
      activity: 'Extreme sheltered planting only',
      details: '',
      category: 'planting',
    }),
    true
  )
  assert.equal(
    isNonActionableActivity({
      activity: 'Water fortnightly until established',
      details: 'Then rarely',
      category: 'watering',
    }),
    true
  )
})

test('polishScheduleActivities removes non-actionable entries', () => {
  const out = polishScheduleActivities([
    {
      activity: 'Apply fertiliser',
      details: 'Ring around stem',
      category: 'fertilizing',
      daysSincePlanting: 21,
    },
    {
      activity: 'Maintain consistent moisture',
      details: 'Water regularly',
      category: 'watering',
      daysSincePlanting: 50,
    },
    {
      activity: 'Monitor for aphids',
      details: 'Check leaf undersides',
      category: 'pest',
      daysSincePlanting: 35,
    },
  ])
  assert.equal(out.length, 2)
  assert.equal(out[1].activity, 'Check for aphids')
})
