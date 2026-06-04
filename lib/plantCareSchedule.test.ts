import test from 'node:test'
import assert from 'node:assert/strict'
import {
  adjustActivitiesForPhase,
  isEstablishedPlant,
  isPrePlantActivityTitle,
  repairPlantFullSchedule,
  schedulePhaseForPlant,
  shouldSkipActivityForPhase,
} from '@/lib/plantCareSchedule'

test('established plant skips pre-transplant basil tasks', () => {
  const sowOffset = 14
  const activities = [
    { daysSincePlanting: 14, activity: 'Transplant seedlings', details: '', category: 'planting' },
    { daysSincePlanting: 21, activity: 'Apply fertilizer', details: '', category: 'fertilizing' },
  ]

  const out = adjustActivitiesForPhase(activities, 'established', sowOffset)
  assert.equal(out.length, 1)
  assert.equal(out[0].activity, 'Apply fertilizer')
  assert.equal(out[0].daysSincePlanting, 7)
})

test('established skips sow indoors by title at any day', () => {
  assert.equal(
    shouldSkipActivityForPhase(
      { daysSincePlanting: 21, activity: 'Sow indoors', details: '', category: 'planting' },
      'established',
      14,
      false
    ),
    true
  )
})

test('sow phase also skips setup activities like sow indoors', () => {
  assert.equal(
    shouldSkipActivityForPhase(
      { daysSincePlanting: 1, activity: 'Sow indoors', details: '', category: 'planting' },
      'sow',
      14,
      false
    ),
    true
  )
})

test('schedulePhase from JSON overrides missing DB type', () => {
  assert.equal(
    schedulePhaseForPlant({
      fullSchedule: { schedulePhase: 'established', plantingMethod: 'seedling' },
    }),
    'established'
  )
})

test('repair strips transplant for seedling stored without schedulePhase', () => {
  const repaired = repairPlantFullSchedule({
    name: 'Basil',
    datePlanted: new Date().toISOString(),
    type: 'seedling',
    activityType: 'plant',
    fullSchedule: {
      plantName: 'Basil',
      zone: '9',
      climate: 'cool',
      totalDays: 74,
      growthMultiplier: 1,
      wateringFrequencyDays: 3,
      extraCare: [],
      activities: [
        {
          daysSincePlanting: 14,
          activity: 'Transplant seedlings',
          details: 'Harden off indoors',
          category: 'planting',
        },
        {
          daysSincePlanting: 21,
          activity: 'Apply fertilizer',
          details: '',
          category: 'fertilizing',
        },
      ],
    },
  })

  assert.equal(repaired.fullSchedule?.schedulePhase, 'established')
  assert.equal(repaired.fullSchedule?.activities.length, 1)
  assert.equal(repaired.fullSchedule?.activities[0].activity, 'Apply fertilizer')
  assert.equal(repaired.fullSchedule?.activities[0].daysSincePlanting, 7)
})

test('sow phase removes setup tasks and keeps actionable timeline', () => {
  const activities = [
    { daysSincePlanting: 0, activity: 'Sow seeds indoors', details: '', category: 'planting' },
    { daysSincePlanting: 14, activity: 'Transplant seedlings', details: '', category: 'planting' },
    { daysSincePlanting: 21, activity: 'Apply fertilizer', details: '', category: 'fertilizing' },
  ]
  const out = adjustActivitiesForPhase(activities, 'sow', 14)
  assert.equal(out.length, 1)
  assert.equal(out[0].activity, 'Apply fertilizer')
})

test('isPrePlantActivityTitle matches transplant and sow indoors', () => {
  assert.equal(isPrePlantActivityTitle({ activity: 'Sow indoors' }), true)
  assert.equal(isPrePlantActivityTitle({ activity: 'Transplant seedlings' }), true)
  assert.equal(isPrePlantActivityTitle({ activity: 'Apply fertilizer' }), false)
})

test('isPrePlantActivityTitle matches imperative Plant X tasks', () => {
  assert.equal(
    isPrePlantActivityTitle({ activity: 'Plant vigorous sucker in spring' }),
    true
  )
  assert.equal(isPrePlantActivityTitle({ activity: 'Plant 2 varieties' }), true)
  assert.equal(
    isPrePlantActivityTitle({ activity: 'Choose and plant 2 varieties' }),
    true
  )
  assert.equal(
    isPrePlantActivityTitle({ activity: 'Install trellis for climbing varieties' }),
    false
  )
})

test('established skips planting-category establishment tasks at day 14', () => {
  assert.equal(
    shouldSkipActivityForPhase(
      {
        daysSincePlanting: 14,
        activity: 'Plant vigorous sucker in spring',
        details: '',
        category: 'planting',
      },
      'established',
      14,
      true
    ),
    true
  )
  assert.equal(
    shouldSkipActivityForPhase(
      {
        daysSincePlanting: 35,
        activity: 'Install trellis for climbing varieties',
        details: '',
        category: 'planting',
      },
      'established',
      14,
      true
    ),
    false
  )
})

test('repair strips Plant X tasks for established banana-style schedules', () => {
  const repaired = repairPlantFullSchedule({
    name: 'Banana',
    datePlanted: new Date().toISOString(),
    type: 'seedling',
    activityType: 'plant',
    fullSchedule: {
      plantName: 'Banana',
      zone: '11b',
      climate: 'warm',
      schedulePhase: 'established',
      totalDays: 74,
      growthMultiplier: 1,
      wateringFrequencyDays: 3,
      extraCare: [],
      activities: [
        {
          daysSincePlanting: 14,
          activity: 'Plant vigorous sucker in spring',
          details: 'Select one sucker per mat.',
          category: 'planting',
        },
        {
          daysSincePlanting: 21,
          activity: 'Apply fertilizer',
          details: '',
          category: 'fertilizing',
        },
      ],
    },
  })

  assert.equal(repaired.fullSchedule?.activities.length, 1)
  assert.equal(repaired.fullSchedule?.activities[0].activity, 'Apply fertilizer')
})
