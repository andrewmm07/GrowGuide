import test from 'node:test'
import assert from 'node:assert/strict'
import { assessFortnightTiming, buildFortnightTimingWindows } from '@/lib/planting/fortnightTiming'
import { plantingMatrixMatches } from '@/lib/planting/plantTimingAliases'
import { evaluatePlantSuitability } from '@/lib/plantSuitabilityService'
import { findPlaceByName, userLocationFromPlace } from '@/lib/places'
import type { PlantZoneMeta } from '@/lib/plantTimelineService'

test('plantingMatrixMatches aliases for QA gap crops', () => {
  assert.equal(plantingMatrixMatches('Cabbage', 'Winter Cabbage'), true)
  assert.equal(plantingMatrixMatches('Peppers', 'Capsicum'), true)
  assert.equal(plantingMatrixMatches('Chilli', 'Capsicum'), true)
  assert.equal(plantingMatrixMatches('Sweet Potato', 'Sweet Potato'), true)
  assert.equal(plantingMatrixMatches('Sweet Potatoes', 'Sweet Potato'), true)
  assert.equal(plantingMatrixMatches('Peas', 'Early Peas'), true)
  assert.equal(plantingMatrixMatches('Carrots', 'Early Carrots'), true)
})

test('Basil and Okra have planting windows where expected', () => {
  const canberra = userLocationFromPlace(findPlaceByName('Canberra', 'ACT')!)
  assert.ok(buildFortnightTimingWindows('Basil', canberra).sowFortnights.size > 0)
  const sydney = userLocationFromPlace(findPlaceByName('Sydney', 'NSW')!)
  assert.ok(buildFortnightTimingWindows('Okra', sydney).sowFortnights.size > 0)
})

test('October tomato seedling is ideal for Canberra after frost boundary fix', () => {
  const canberra = userLocationFromPlace(findPlaceByName('Canberra', 'ACT')!)
  const oct = new Date(2026, 9, 8) // October (early)
  const t = assessFortnightTiming('Tomatoes', canberra, 'seedling', oct)
  assert.equal(t.tier, 'ideal', `expected ideal, got ${t.tier} dist=${t.distanceFortnights}`)
})

test('November tomato seedling is ideal for Sydney', () => {
  const sydney = userLocationFromPlace(findPlaceByName('Sydney', 'NSW')!)
  const nov = new Date(2026, 10, 8) // November (early)
  const t = assessFortnightTiming('Tomatoes', sydney, 'seedling', nov)
  assert.equal(t.tier, 'ideal', `expected ideal, got ${t.tier}`)
})

test('Garlic seed in May is ideal for Blackmans Bay (direct-sow plant window)', () => {
  const hobart = userLocationFromPlace(findPlaceByName('Blackmans Bay', 'TAS')!)
  const may = new Date(2026, 4, 8)
  const t = assessFortnightTiming('Garlic', hobart, 'seed', may)
  assert.equal(t.tier, 'ideal', `expected ideal, got ${t.tier} match=${t.methodMatch}`)
})

test('formerly missing crops are not no_window in peak season', () => {
  const sydney = userLocationFromPlace(findPlaceByName('Sydney', 'NSW')!)
  const perth = userLocationFromPlace(findPlaceByName('Perth', 'WA')!)
  const nov = new Date(2026, 10, 8)
  const oct = new Date(2026, 9, 15)
  const meta: PlantZoneMeta = {
    plantName: 'Basil',
    plantCategory: null,
    unsuitableZone: false,
    growthMultiplier: 1,
    climateNote: null,
    extraCare: [],
  }
  for (const plant of ['Cabbage', 'Peppers', 'Chilli', 'Basil', 'Okra']) {
    const t = assessFortnightTiming(plant, sydney, 'seed', nov)
    assert.notEqual(t.methodMatch, 'no_window', `${plant} should match matrix`)
    const a = evaluatePlantSuitability(plant, sydney, {
      plantingMethod: 'seed',
      referenceDate: nov,
      zoneMeta: { ...meta, plantName: plant },
    })
    assert.notEqual(a.seasonalTiming, 'not_advised', `${plant} should not be not_advised in Nov Sydney`)
  }
  const sp = assessFortnightTiming('Sweet Potato', perth, 'seed', oct)
  assert.notEqual(sp.methodMatch, 'no_window', 'Sweet Potato should match matrix')

  const canberra = userLocationFromPlace(findPlaceByName('Canberra', 'ACT')!)
  const darwin = userLocationFromPlace(findPlaceByName('Darwin', 'NT')!)
  const octCanberra = new Date(2026, 9, 15)
  for (const plant of ['Peppers', 'Chilli', 'Basil']) {
    const t = assessFortnightTiming(plant, canberra, 'seedling', octCanberra)
    assert.notEqual(t.methodMatch, 'no_window', `${plant} Canberra should have frost-deferred windows`)
  }
  const basilDarwin = assessFortnightTiming('Basil', darwin, 'seed', nov)
  const okraDarwin = assessFortnightTiming('Okra', darwin, 'seed', nov)
  assert.notEqual(basilDarwin.methodMatch, 'no_window', 'Basil Darwin wet/dry')
  assert.notEqual(okraDarwin.methodMatch, 'no_window', 'Okra Darwin wet/dry')
})

test('plantingMatrixMatches aliases for medium-priority vegetables', () => {
  assert.equal(plantingMatrixMatches('Artichoke', 'Globe Artichoke'), true)
  assert.equal(plantingMatrixMatches('Cardoon', 'Globe Artichoke'), true)
  assert.equal(plantingMatrixMatches('Endive', 'Lettuce'), true)
  assert.equal(plantingMatrixMatches('Chicory', 'Lettuce'), true)
  assert.equal(plantingMatrixMatches('Radicchio', 'Lettuce'), true)
  assert.equal(plantingMatrixMatches('Watercress', 'Lettuce'), true)
  assert.equal(plantingMatrixMatches('Warrigal Greens', 'Asian Greens'), true)
})

test('medium-priority vegetables have planting windows in peak season', () => {
  const sydney = userLocationFromPlace(findPlaceByName('Sydney', 'NSW')!)
  const canberra = userLocationFromPlace(findPlaceByName('Canberra', 'ACT')!)
  const mar = new Date(2026, 2, 10)
  const sep = new Date(2026, 8, 10)
  const jul = new Date(2026, 6, 10)

  for (const plant of ['Endive', 'Chicory', 'Radicchio', 'Watercress', 'Warrigal Greens']) {
    const t = assessFortnightTiming(plant, sydney, 'seed', mar)
    assert.notEqual(t.methodMatch, 'no_window', `${plant} should match matrix`)
  }

  const fennel = assessFortnightTiming('Fennel', sydney, 'seed', mar)
  assert.notEqual(fennel.methodMatch, 'no_window', 'Fennel should match matrix')

  const celeriac = assessFortnightTiming('Celeriac', sydney, 'seed', sep)
  assert.notEqual(celeriac.methodMatch, 'no_window', 'Celeriac should match matrix')

  const artichoke = assessFortnightTiming('Globe Artichoke', canberra, 'seedling', jul)
  assert.notEqual(artichoke.methodMatch, 'no_window', 'Globe Artichoke should match matrix')

  const samphire = assessFortnightTiming('Sea Asparagus', sydney, 'seed', mar)
  assert.equal(samphire.methodMatch, 'no_window', 'Sea Asparagus remains intentionally excluded')
})
