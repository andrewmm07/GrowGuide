/**
 * Full plant-picker timing audit — Hobart / cool:coastal, late May.
 * Run: npx tsx scripts/audit-hobart-late-may.ts
 */
import { readFileSync } from 'fs'
import path from 'path'
import { assessFortnightTiming, buildFortnightTimingWindows } from '../lib/planting/fortnightTiming'
import { getPlantingGuideForProfile } from '../lib/planting/plantingProfileData'
import { resolvePlantingProfileWithContext } from '../lib/planting/resolvePlantingProfile'
import {
  assessClimateSuitability,
  evaluatePlantSuitability,
  seasonalTimingLabel,
} from '../lib/plantSuitabilityService'
import type { PlantZoneMeta } from '../lib/plantTimelineService'
import type { UserLocation } from '../lib/types/location'

const hobart: Partial<UserLocation> = {
  lat: -43.0,
  lon: 147.32,
  city: 'Blackmans Bay',
  state: 'TAS',
  auHardinessZone: '9a',
  climate: 'cold',
  microclimateTags: ['coastal'],
}

const LATE_MAY = new Date('2026-05-29')
const EARLY_MAY = new Date('2026-05-01')

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

function uniquePlantNames(): string[] {
  const csv = readFileSync(path.join(__dirname, '..', 'plant_timelines_corrected.csv'), 'utf8')
  const names = new Set<string>()
  for (const line of csv.split('\n').slice(1)) {
    const p = line.split(',')[1]
    if (p) names.add(p)
  }
  return [...names].sort()
}

function audit(date: Date, method: 'seed' | 'seedling') {
  const rows: Array<{
    plant: string
    tier: string
    label: string
    climate: string
    dist: number | null
    methodMatch: string
    sowMonths: string[]
    plantMonths: string[]
  }> = []

  for (const plant of uniquePlantNames()) {
    const meta = zoneMetaFromCsv(plant)
    const a = evaluatePlantSuitability(plant, hobart, {
      plantingMethod: method,
      referenceDate: date,
      zoneMeta: meta,
    })
    const t = assessFortnightTiming(plant, hobart, method, date)
    const w = buildFortnightTimingWindows(plant, hobart)
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const fortnightToMonth = (f: number) => monthNames[Math.floor(f / 2)]

    rows.push({
      plant,
      tier: a.seasonalTiming,
      label: seasonalTimingLabel(a.seasonalTiming),
      climate: assessClimateSuitability(plant, hobart, meta),
      dist: t.distanceFortnights,
      methodMatch: t.methodMatch,
      sowMonths: [...new Set([...w.sowFortnights].map(fortnightToMonth))],
      plantMonths: [...new Set([...w.plantFortnights].map(fortnightToMonth))],
    })
  }

  return rows
}

function printGroup(title: string, rows: ReturnType<typeof audit>, tiers: string[]) {
  const filtered = rows.filter((r) => tiers.includes(r.tier) && r.climate !== 'not_advised')
  console.log(`\n=== ${title} (${filtered.length}) ===`)
  for (const r of filtered) {
    console.log(
      `${r.plant.padEnd(22)} ${r.label.padEnd(28)} dist=${String(r.dist).padEnd(2)} ${r.methodMatch.padEnd(12)} sow=[${r.sowMonths.join(',')}] plant=[${r.plantMonths.join(',')}]`
    )
  }
}

const { profile } = resolvePlantingProfileWithContext(hobart)
const mayGuide = getPlantingGuideForProfile(profile, 'May')
console.log('Location: Hobart TAS (cool:coastal)')
console.log('Profile:', profile)
console.log('May sow:', mayGuide.sow.join(', '))
console.log('May plant:', mayGuide.plant.join(', '))

for (const [label, date] of [['LATE MAY (29 May)', LATE_MAY], ['EARLY MAY (1 May)', EARLY_MAY]] as const) {
  for (const method of ['seed', 'seedling'] as const) {
    console.log(`\n${'='.repeat(70)}`)
    console.log(`${label} — ${method.toUpperCase()}`)
    console.log('='.repeat(70))
    const rows = audit(date, method)
    printGroup('GOOD seasonal timing (ideal tier)', rows, ['ideal'])
    printGroup('ACCEPTABLE seasonal timing (good tier)', rows, ['good'])
    printGroup('TIMING CAUTION', rows, ['timing_caution'])
    printGroup('NOT ADVISED (timing)', rows, ['not_advised'])
    printGroup('CLIMATE NOT SUITABLE', rows.filter((r) => r.climate === 'not_advised').map((r) => ({ ...r, tier: 'climate' })), ['climate'])
  }
}
