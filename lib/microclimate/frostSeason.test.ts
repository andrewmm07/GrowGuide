import test from 'node:test'
import assert from 'node:assert/strict'
import { isInRegionalFrostSeason } from '@/lib/microclimate/frostSeason'
import { buildFrostProfile } from '@/lib/microclimate/resolve'
import { assessFortnightTiming } from '@/lib/planting/fortnightTiming'
import { findPlaceByName, userLocationFromPlace } from '@/lib/places'

test('mid-October is outside regional frost season for cool zones 9a–10b', () => {
  const midOct = new Date(2026, 9, 15)
  for (const zone of ['9a', '9b', '10a', '10b'] as const) {
    const fp = buildFrostProfile(zone, [])
    assert.equal(
      isInRegionalFrostSeason(fp, midOct),
      false,
      `${zone} should not treat mid-October as frost season`
    )
  }
})

test('mid-October is outside frost season for Tasmania cold zones', () => {
  const midOct = new Date(2026, 9, 15)
  for (const zone of ['8a', '8b'] as const) {
    const fp = buildFrostProfile(zone, [])
    assert.equal(
      isInRegionalFrostSeason(fp, midOct),
      false,
      `${zone} last spring frost should be before mid-October`
    )
  }
})

test('October tomato seedling is ideal for Hobart and Launceston', () => {
  const oct = new Date(2026, 9, 8)
  for (const [city, state] of [
    ['Hobart', 'TAS'],
    ['Launceston', 'TAS'],
  ] as const) {
    const loc = userLocationFromPlace(findPlaceByName(city, state)!)
    const t = assessFortnightTiming('Tomatoes', loc, 'seedling', oct)
    assert.equal(
      t.tier,
      'ideal',
      `${city} expected ideal in October, got ${t.tier} (dist=${t.distanceFortnights})`
    )
  }
})
