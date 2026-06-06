import assert from 'node:assert/strict'
import test from 'node:test'
import { plantingActivitiesForMonth } from '@/app/data/planting-calendar/helpers'
import { getPlantingRecommendationsForMonth } from '@/lib/plantingRecommendations'
import { PLANTING_MONTHS } from '@/lib/planting/types'
import { findPlaceByName, userLocationFromPlace } from '@/lib/places'

function placeLocation(city: string, state: string) {
  const place = findPlaceByName(city, state)
  assert.ok(place, `${city}, ${state} should exist in place registry`)
  return userLocationFromPlace(place)
}

test('calendar sow/plant lists match dashboard recommendations for Hobart June', () => {
  const loc = placeLocation('Hobart', 'TAS')
  const month = 'June' as const
  const rec = getPlantingRecommendationsForMonth(loc, month)
  const activities = plantingActivitiesForMonth(loc, month)
  const sow = activities.filter((a) => a.type === 'sow').map((a) => a.name)
  const plant = activities.filter((a) => a.type === 'plant').map((a) => a.name)
  assert.deepEqual(sow, rec.sow)
  assert.deepEqual(plant, rec.plant)
})

test('calendar sow/plant lists match dashboard recommendations for Sydney November', () => {
  const loc = placeLocation('Sydney', 'NSW')
  const month = 'November' as const
  const rec = getPlantingRecommendationsForMonth(loc, month)
  const activities = plantingActivitiesForMonth(loc, month)
  const sow = activities.filter((a) => a.type === 'sow').map((a) => a.name)
  const plant = activities.filter((a) => a.type === 'plant').map((a) => a.name)
  assert.deepEqual(sow, rec.sow)
  assert.deepEqual(plant, rec.plant)
})

test('calendar sow/plant lists match dashboard recommendations for Brisbane March', () => {
  const loc = placeLocation('Brisbane', 'QLD')
  const month = 'March' as const
  const rec = getPlantingRecommendationsForMonth(loc, month)
  const activities = plantingActivitiesForMonth(loc, month)
  const sow = activities.filter((a) => a.type === 'sow').map((a) => a.name)
  const plant = activities.filter((a) => a.type === 'plant').map((a) => a.name)
  assert.deepEqual(sow, rec.sow)
  assert.deepEqual(plant, rec.plant)
})

test('year calendar guide uses same matrix for every month (Sydney sample)', () => {
  const loc = placeLocation('Sydney', 'NSW')
  for (const month of PLANTING_MONTHS) {
    const rec = getPlantingRecommendationsForMonth(loc, month)
    const activities = plantingActivitiesForMonth(loc, month)
    const sow = activities.filter((a) => a.type === 'sow').map((a) => a.name)
    const plant = activities.filter((a) => a.type === 'plant').map((a) => a.name)
    assert.deepEqual(sow, rec.sow, `sow mismatch for ${month}`)
    assert.deepEqual(plant, rec.plant, `plant mismatch for ${month}`)
  }
})
