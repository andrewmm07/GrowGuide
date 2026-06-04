/**
 * Audit suitability for Tasmania (Blackmans Bay) in May.
 * Run: npx tsx scripts/audit-tas-suitability.ts
 */
import { assessFortnightTiming } from '../lib/planting/fortnightTiming'
import { getPlantingGuideForProfile } from '../lib/planting/plantingProfileData'
import { resolvePlantingProfileWithContext } from '../lib/planting/resolvePlantingProfile'
import {
  assessClimateSuitability,
  evaluatePlantSuitability,
} from '../lib/plantSuitabilityService'
import type { PlantZoneMeta } from '../lib/plantTimelineService'
import { readFileSync } from 'fs'
import path from 'path'

import type { UserLocation } from '../lib/types/location'

const tasLocation: Partial<UserLocation> = {
  lat: -43.0,
  lon: 147.32,
  city: 'Blackmans Bay',
  state: 'TAS',
  auHardinessZone: '9a',
  climate: 'cold',
  microclimateTags: ['coastal'],
}

const mayDate = new Date('2026-05-15')

function zoneMetaFromCsv(plantName: string, zone = '9a'): PlantZoneMeta {
  const csv = readFileSync(path.join(__dirname, '..', 'plant_timelines_corrected.csv'), 'utf8')
  const line = csv.split('\n').find((l) => l.includes(`,${plantName},${zone},`))
  if (!line) {
    return {
      plantName,
      plantCategory: null,
      unsuitableZone: false,
      growthMultiplier: 1,
      climateNote: null,
      extraCare: [],
    }
  }
  const unsuitable = /,True\s*$/.test(line.trim())
  const gmMatch = line.match(new RegExp(`,${plantName},${zone},\\d+,\\d+,\\d+,\\d+,[^,]*,[^,]*,(\\d+\\.?\\d*)`))
  const noteMatch = line.match(/,"([^"]*)",(?:True|False)\s*$/)
  return {
    plantName,
    plantCategory: null,
    unsuitableZone: unsuitable,
    growthMultiplier: gmMatch ? parseFloat(gmMatch[1]) : 1,
    climateNote: noteMatch?.[1] ?? null,
    extraCare: [],
  }
}

const { profile } = resolvePlantingProfileWithContext(tasLocation)
const mayGuide = getPlantingGuideForProfile(profile, 'May')
console.log('Profile:', profile)
console.log('May sow:', mayGuide.sow.join(', '))
console.log('May plant:', mayGuide.plant.join(', '))
console.log('---')

const checks = [
  'Apple',
  'Radish',
  'Rocket',
  'Spinach',
  'English Spinach',
  'Lettuce',
  'Tomatoes',
  'Banana',
  'Garlic',
  'Broad Beans',
  'Broccoli',
  'Cauliflower',
  'Rhubarb',
]

for (const name of checks) {
  const meta = zoneMetaFromCsv(name)
  const a = evaluatePlantSuitability(name, tasLocation, {
    plantingMethod: 'seedling',
    referenceDate: mayDate,
    zoneMeta: meta,
  })
  const climate = assessClimateSuitability(name, tasLocation, meta)
  const t = assessFortnightTiming(name, tasLocation, 'seedling', mayDate)
  console.log(
    `${name.padEnd(18)} climate=${climate.padEnd(12)} timing=${a.seasonalTiming.padEnd(16)} unsuit_db=${meta.unsuitableZone}`
  )
}
