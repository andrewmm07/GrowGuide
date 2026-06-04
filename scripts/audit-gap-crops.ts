import { assessFortnightTiming, buildFortnightTimingWindows } from '../lib/planting/fortnightTiming'
import { resolvePlantingProfileWithContext } from '../lib/planting/resolvePlantingProfile'
import { findPlaceByName, userLocationFromPlace } from '../lib/places'

const crops = ['Cabbage', 'Peppers', 'Chilli', 'Basil', 'Okra', 'Sweet Potato']
const places: [string, string][] = [
  ['Blackmans Bay', 'TAS'],
  ['Canberra', 'ACT'],
  ['Darwin', 'NT'],
  ['Sydney', 'NSW'],
  ['Perth', 'WA'],
]
const nov = new Date(2026, 10, 8)
const may = new Date(2026, 4, 8)

for (const [city, state] of places) {
  const loc = userLocationFromPlace(findPlaceByName(city, state)!)
  const { profile } = resolvePlantingProfileWithContext(loc)
  const parts = crops.map((p) => {
    const w = buildFortnightTimingWindows(p, loc)
    const tNov = assessFortnightTiming(p, loc, 'seed', nov)
    const tMay = assessFortnightTiming(p, loc, 'seed', may)
    const windows = w.sowFortnights.size + w.plantFortnights.size
    return `${p}:w${windows}/Nov:${tNov.methodMatch}/May:${tMay.methodMatch}`
  })
  console.log(`${profile} | ${city}: ${parts.join(' | ')}`)
}
