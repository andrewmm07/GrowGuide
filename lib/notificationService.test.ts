import test from 'node:test'
import assert from 'node:assert/strict'
import { composeWeekendTasksNotification } from '@/lib/notificationService'
import type { GardenPlant } from '@/app/context/GardenContext'

function plantWithActivities(
  name: string,
  activities: Array<{ activity: string; details: string; category: string; daysSincePlanting: number }>
): GardenPlant {
  const planted = new Date()
  planted.setDate(planted.getDate() - 10)
  return {
    id: `p-${name}`,
    name,
    datePlanted: planted.toISOString().slice(0, 10),
    type: 'seedling',
    activityType: 'plant',
    isHarvested: false,
    fullSchedule: {
      totalDays: 90,
      schedulePhase: 'established',
      plantingMethod: 'seedling',
      activities: activities.map((a) => ({
        ...a,
        completed: false,
      })),
    },
  } as GardenPlant
}

test('weekend notification uses load + task list and skips routine watering', () => {
  const now = new Date('2026-06-05T12:00:00')
  const plants = [
    plantWithActivities('Tomato', [
      {
        activity: 'Apply fertiliser',
        details: 'Side-dress',
        category: 'fertilizing',
        daysSincePlanting: 12,
      },
      {
        activity: 'Water fortnightly until established',
        details: 'Then rarely',
        category: 'watering',
        daysSincePlanting: 14,
      },
      {
        activity: 'Extreme sheltered planting only',
        details: '',
        category: 'planting',
        daysSincePlanting: 15,
      },
      {
        activity: 'Check for aphids',
        details: 'Leaf undersides',
        category: 'pest',
        daysSincePlanting: 16,
      },
    ]),
  ]

  const payload = composeWeekendTasksNotification(plants, [], now)
  assert.ok(payload)
  assert.match(payload!.body, /^You have a \w+ weekend\. Tasks include: /)
  assert.match(payload!.body, /Apply fertiliser/)
  assert.match(payload!.body, /Check for aphids/)
  assert.doesNotMatch(payload!.body, /fortnightly/i)
  assert.doesNotMatch(payload!.body, /sheltered planting/i)
  assert.doesNotMatch(payload!.body, /—/)
})

test('weekend notification omitted when no actionable tasks', () => {
  const now = new Date('2026-06-05T12:00:00')
  const plants = [
    plantWithActivities('Basil', [
      {
        activity: 'Maintain consistent moisture',
        details: 'Water regularly',
        category: 'watering',
        daysSincePlanting: 12,
      },
    ]),
  ]

  assert.equal(composeWeekendTasksNotification(plants, [], now), null)
})
