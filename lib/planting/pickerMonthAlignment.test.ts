import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { assessFortnightTiming } from '@/lib/planting/fortnightTiming'
import { plantingMatrixMatches } from '@/lib/planting/plantTimingAliases'
import { getPlantingRecommendationsForMonth } from '@/lib/plantingRecommendations'
import type { PlantingMonth } from '@/lib/planting/types'
import { PLANTING_MONTHS } from '@/lib/planting/types'
import { findPlaceByName, userLocationFromPlace } from '@/lib/places'
import type { UserLocation } from '@/lib/types/location'

function placeLocation(city: string, state: string): UserLocation {
  const place = findPlaceByName(city, state)
  assert.ok(place, `${city}, ${state} should exist in place registry`)
  return userLocationFromPlace(place)
}

function zonePlantsFromCsv(zone: string): string[] {
  const csvPath = path.join(process.cwd(), 'plant_timelines_corrected.csv')
  const csv = readFileSync(csvPath, 'utf8')
  const plants: string[] = []
  for (const line of csv.split('\n').slice(1)) {
    const head = line.match(/^[^,]+,([^,]+),([^,]+),/)
    if (!head || head[2] !== zone) continue
    plants.push(head[1])
  }
  return plants
}

function referenceDateForMonth(month: PlantingMonth): Date {
  return new Date(2026, PLANTING_MONTHS.indexOf(month), 8)
}

const ALIGNMENT_CITIES = [
  { city: 'Sydney', state: 'NSW' },
  { city: 'Blackmans Bay', state: 'TAS' },
  { city: 'Brisbane', state: 'QLD' },
  { city: 'Canberra', state: 'ACT' },
  { city: 'Perth', state: 'WA' },
  { city: 'Darwin', state: 'NT' },
] as const

test('monthly matrix sow/plant entries rate ideal in plant picker timing', () => {
  for (const { city, state } of ALIGNMENT_CITIES) {
    const loc = placeLocation(city, state)
    for (const month of PLANTING_MONTHS) {
      const rec = getPlantingRecommendationsForMonth(loc, month)
      const refDate = referenceDateForMonth(month)

      for (const name of rec.sow) {
        const t = assessFortnightTiming(name, loc, 'seed', refDate)
        assert.equal(
          t.tier,
          'ideal',
          `${city} ${month} sow "${name}" should be ideal, got ${t.tier} (${t.methodMatch})`
        )
      }

      for (const name of rec.plant) {
        const t = assessFortnightTiming(name, loc, 'seedling', refDate)
        assert.equal(
          t.tier,
          'ideal',
          `${city} ${month} plant "${name}" should be ideal, got ${t.tier} (${t.methodMatch})`
        )
      }
    }
  }
})

test('monthly matrix entries map to at least one zone plant in picker', () => {
  for (const { city, state } of ALIGNMENT_CITIES) {
    const loc = placeLocation(city, state)
    const zonePlants = zonePlantsFromCsv(loc.auHardinessZone!)

    for (const month of PLANTING_MONTHS) {
      const rec = getPlantingRecommendationsForMonth(loc, month)

      for (const name of [...rec.sow, ...rec.plant]) {
        const hasZonePlant = zonePlants.some((p) => plantingMatrixMatches(p, name))
        assert.ok(
          hasZonePlant,
          `${city} ${month}: matrix "${name}" has no matching plant_timelines name in zone ${loc.auHardinessZone}`
        )
      }
    }
  }
})

test('zone plants listed this month in matrix rate ideal in picker', () => {
  for (const { city, state } of ALIGNMENT_CITIES) {
    const loc = placeLocation(city, state)
    const zonePlants = zonePlantsFromCsv(loc.auHardinessZone!)

    for (const month of PLANTING_MONTHS) {
      const rec = getPlantingRecommendationsForMonth(loc, month)
      const matrixNames = [...rec.sow, ...rec.plant]
      const refDate = referenceDateForMonth(month)

      for (const zonePlant of zonePlants) {
        const matrixName = matrixNames.find((m) => plantingMatrixMatches(zonePlant, m))
        if (!matrixName) continue

        const method = rec.sow.some((m) => plantingMatrixMatches(zonePlant, m))
          ? 'seed'
          : 'seedling'
        const t = assessFortnightTiming(zonePlant, loc, method, refDate)
        assert.equal(
          t.tier,
          'ideal',
          `${city} ${month}: zone plant "${zonePlant}" (${method}) should be ideal for matrix "${matrixName}", got ${t.tier}`
        )
      }
    }
  }
})
