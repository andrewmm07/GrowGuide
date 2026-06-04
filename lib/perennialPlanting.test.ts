import assert from 'node:assert/strict'
import { test } from 'node:test'
import { evaluatePlantSuitability } from '@/lib/plantSuitabilityService'
import {
  isPerennialPlantCategory,
  PERENNIAL_TIMING_INSIGHT,
} from '@/lib/perennialPlanting'
import { recommendedActionWarnings } from '@/lib/plantSuitabilityService'

test('isPerennialPlantCategory recognises perennial_tree', () => {
  assert.equal(isPerennialPlantCategory('perennial_tree'), true)
  assert.equal(isPerennialPlantCategory('annual_vegetable'), false)
})

test('perennial with no sow window is plant_now with explanatory insight', () => {
  const sydney = { state: 'NSW', climate: 'warm' as const, auHardinessZone: '10b' as const }
  const apple = evaluatePlantSuitability('Apple', sydney, {
    plantingMethod: 'seedling',
    referenceDate: new Date('2026-06-01'),
    zoneMeta: {
      plantName: 'Apple',
      plantCategory: 'perennial_tree',
      unsuitableZone: false,
      growthMultiplier: 1,
      climateNote: null,
      extraCare: [],
    },
  })

  assert.equal(apple.isPerennial, true)
  assert.equal(apple.recommendedAction, 'plant_now')
  assert.equal(apple.seasonalTiming, 'not_advised')
  assert.equal(apple.insight?.tip, PERENNIAL_TIMING_INSIGHT)
  const warnings = recommendedActionWarnings(apple)
  assert.ok(warnings?.timing?.includes('Perennial'))
})
