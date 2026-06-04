/**
 * Fortnight-level planting timing helpers.
 * Maps calendar month matrices to early/late fortnights (24 per year).
 */

import { applyPlantingModifiers } from '@/lib/planting/plantingModifiers'
import { getPlantingGuideForProfile } from '@/lib/planting/plantingProfileData'
import { resolvePlantingProfileWithContext } from '@/lib/planting/resolvePlantingProfile'
import type { MonthPlantingGuide, PlantingMonth } from '@/lib/planting/types'
import { PLANTING_MONTHS } from '@/lib/planting/types'
import type { UserLocation } from '@/lib/types/location'

export type FortnightIndex = number // 0–23

export const FORTNIGHTS_PER_YEAR = 24

export function dateToFortnight(date: Date): FortnightIndex {
  return date.getMonth() * 2 + (date.getDate() <= 15 ? 0 : 1)
}

export function fortnightLabel(fortnight: FortnightIndex): string {
  const month = PLANTING_MONTHS[Math.floor(fortnight / 2)]
  const half = fortnight % 2 === 0 ? 'early' : 'late'
  return `${month} (${half})`
}

function normalizePlantName(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .trim()
    .toLowerCase()
}

export function plantNamesMatch(a: string, b: string): boolean {
  const na = normalizePlantName(a)
  const nb = normalizePlantName(b)
  if (na === nb) return true
  if (na.endsWith('s') && na.slice(0, -1) === nb) return true
  if (nb.endsWith('s') && nb.slice(0, -1) === na) return true
  if (na.endsWith('es') && na.slice(0, -2) === nb) return true
  return false
}

import { isDirectSowOnly, plantingMatrixMatches } from '@/lib/planting/plantTimingAliases'

function stripIndoorsHint(name: string): string {
  return name.replace(/\s*\(start indoors\)\s*$/i, '').trim()
}

function monthToFortnights(month: PlantingMonth): FortnightIndex[] {
  const base = PLANTING_MONTHS.indexOf(month) * 2
  return [base, base + 1]
}

function findInGuide(
  plantName: string,
  guide: MonthPlantingGuide
): { sow: boolean; plant: boolean; indoorsSow: boolean } {
  const sow = guide.sow.some((entry) =>
    plantingMatrixMatches(plantName, stripIndoorsHint(entry))
  )
  const indoorsSow = guide.sow.some(
    (entry) =>
      plantingMatrixMatches(plantName, stripIndoorsHint(entry)) &&
      /\(start indoors\)/i.test(entry)
  )
  const plant = guide.plant.some((entry) => plantingMatrixMatches(plantName, entry))
  return { sow, plant, indoorsSow }
}

export interface FortnightTimingWindows {
  /** Fortnights ideal for direct sow */
  sowFortnights: Set<FortnightIndex>
  /** Fortnights ideal for planting seedlings / transplants */
  plantFortnights: Set<FortnightIndex>
  frostDeferred: boolean
}

/** Build fortnight sow/plant windows for a plant across the year. */
export function buildFortnightTimingWindows(
  plantName: string,
  location: Partial<UserLocation> | null | undefined
): FortnightTimingWindows {
  const { profile, context } = resolvePlantingProfileWithContext(location)
  const sowFortnights = new Set<FortnightIndex>()
  const plantFortnights = new Set<FortnightIndex>()
  let frostDeferred = false

  for (const month of PLANTING_MONTHS) {
    const guide = applyPlantingModifiers(
      context,
      month,
      getPlantingGuideForProfile(profile, month)
    )
    const match = findInGuide(plantName, guide)

    if (match.sow) {
      for (const f of monthToFortnights(month)) sowFortnights.add(f)
    }

    const deferredThisMonth = guide.frostDeferredPlant?.some((n) =>
      plantingMatrixMatches(plantName, n)
    )
    if (deferredThisMonth) {
      frostDeferred = true
      // Frost season: plant-out moves to late fortnight (protected / post-frost timing).
      const [, late] = monthToFortnights(month)
      plantFortnights.add(late)
    } else if (match.plant) {
      for (const f of monthToFortnights(month)) plantFortnights.add(f)
    }
  }

  return { sowFortnights, plantFortnights, frostDeferred }
}

function circularFortnightDistance(a: FortnightIndex, b: FortnightIndex): number {
  const diff = Math.abs(a - b)
  return Math.min(diff, FORTNIGHTS_PER_YEAR - diff)
}

function nearestFortnightDistance(
  current: FortnightIndex,
  windows: Set<FortnightIndex>
): number | null {
  if (windows.size === 0) return null
  let min = FORTNIGHTS_PER_YEAR
  for (const w of windows) {
    min = Math.min(min, circularFortnightDistance(current, w))
  }
  return min
}

export type SeasonalTimingTier = 'ideal' | 'good' | 'timing_caution' | 'not_advised'

export interface FortnightTimingResult {
  tier: SeasonalTimingTier
  distanceFortnights: number | null
  methodMatch: 'matched' | 'wrong_method' | 'no_window'
  activeWindows: FortnightIndex[]
  frostDeferred: boolean
}

function tierFromDistance(
  distance: number | null,
  methodMatch: FortnightTimingResult['methodMatch']
): SeasonalTimingTier {
  if (methodMatch === 'no_window') return 'not_advised'
  if (methodMatch === 'wrong_method') return 'timing_caution'
  if (distance === null) return 'not_advised'
  if (distance === 0) return 'ideal'
  if (distance === 1) return 'timing_caution'
  return 'not_advised'
}

/** Assess planting timing for seed vs seedling at fortnight precision. */
export function assessFortnightTiming(
  plantName: string,
  location: Partial<UserLocation> | null | undefined,
  method: 'seed' | 'seedling',
  referenceDate: Date = new Date()
): FortnightTimingResult {
  const windows = buildFortnightTimingWindows(plantName, location)
  const current = dateToFortnight(referenceDate)

  // Direct-sow crops are not planted out as seedlings.
  if (method === 'seedling' && isDirectSowOnly(plantName) && windows.plantFortnights.size === 0) {
    const sowDistance = nearestFortnightDistance(current, windows.sowFortnights)
    const tier: SeasonalTimingTier =
      sowDistance === null || sowDistance >= 2 ? 'not_advised' : 'timing_caution'
    return {
      tier,
      distanceFortnights: sowDistance,
      methodMatch: 'wrong_method',
      activeWindows: [],
      frostDeferred: windows.frostDeferred,
    }
  }

  // Direct-sow crops (garlic, peas, etc.): "seed" in the picker means in-ground planting;
  // matrix often lists those under plant (sets/cloves) not sow.
  const seedWindows =
    method === 'seed' && isDirectSowOnly(plantName)
      ? new Set([...windows.sowFortnights, ...windows.plantFortnights])
      : windows.sowFortnights

  const primary = method === 'seed' ? seedWindows : windows.plantFortnights
  const alternate =
    method === 'seed' ? windows.plantFortnights : windows.sowFortnights

  let methodMatch: FortnightTimingResult['methodMatch'] = 'no_window'
  let distance = nearestFortnightDistance(current, primary)

  if (distance !== null) {
    methodMatch = 'matched'
  } else if (nearestFortnightDistance(current, alternate) !== null) {
    methodMatch = 'wrong_method'
    distance = nearestFortnightDistance(current, alternate)
  }

  // Seedlings started from sow-only windows: indoors sow counts as partial match
  if (
    method === 'seedling' &&
    methodMatch === 'wrong_method' &&
    !isDirectSowOnly(plantName)
  ) {
    const sowDistance = nearestFortnightDistance(current, windows.sowFortnights)
    if (sowDistance !== null && sowDistance <= 2) {
      methodMatch = 'matched'
      distance = sowDistance + 1
    }
  }

  const tier = tierFromDistance(distance, methodMatch)

  return {
    tier,
    distanceFortnights: distance,
    methodMatch,
    activeWindows: [...primary],
    frostDeferred: windows.frostDeferred,
  }
}

export const SEASONAL_TIMING_RANK: Record<SeasonalTimingTier, number> = {
  ideal: 4,
  good: 3,
  timing_caution: 2,
  not_advised: 1,
}

export function seasonalTimingLabel(tier: SeasonalTimingTier): string {
  switch (tier) {
    case 'ideal':
      return 'Good seasonal timing'
    case 'good':
      return 'Acceptable seasonal timing'
    case 'timing_caution':
      return 'Timing caution'
    case 'not_advised':
      return 'Not advised for this season'
  }
}

export function seasonalTimingClasses(tier: SeasonalTimingTier): string {
  switch (tier) {
    case 'ideal':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'good':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200'
    case 'timing_caution':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'not_advised':
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}
