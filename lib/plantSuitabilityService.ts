/**
 * Plant suitability & timing intelligence — decision support, not gating.
 * Two independent axes: seasonal timing (fortnight + seed/seedling) and climate fit.
 */

import {
  assessFortnightTiming,
  SEASONAL_TIMING_RANK,
  seasonalTimingClasses,
  seasonalTimingLabel,
  type SeasonalTimingTier,
} from '@/lib/planting/fortnightTiming'
import {
  isPerennialPlantCategory,
  PERENNIAL_TIMING_INSIGHT,
  PERENNIAL_TIMING_WARNING,
} from '@/lib/perennialPlanting'
import type { PlantZoneMeta } from '@/lib/plantTimelineService'
import type { UserLocation } from '@/lib/types/location'

export type ClimateSuitabilityTier = 'thrives' | 'grows_well' | 'marginal' | 'not_advised'

export type RecommendedAction = 'plant_now' | 'wait' | 'avoid'

export interface PlantSuitabilityInsight {
  harvestDelayDays?: number
  yieldLikelihood?: 'good' | 'reduced' | 'poor'
  tip?: string
}

export interface PlantSuitabilityAssessment {
  plantName: string
  seasonalTiming: SeasonalTimingTier
  climateSuitability: ClimateSuitabilityTier
  recommendedAction: RecommendedAction
  insight?: PlantSuitabilityInsight
  /** True when plant_category is perennial_* (trees, shrubs, perennial herbs, etc.) */
  isPerennial: boolean
  /** Internal sort key only — not shown in UI */
  sortRank: number
}

export interface GroupedPlantSuitability {
  ideal: PlantSuitabilityAssessment[]
  good: PlantSuitabilityAssessment[]
  timingCaution: PlantSuitabilityAssessment[]
  notAdvised: PlantSuitabilityAssessment[]
}

export interface EvaluatePlantSuitabilityOptions {
  plantingMethod?: 'seed' | 'seedling'
  referenceDate?: Date
  zoneMeta?: PlantZoneMeta
}

const CLIMATE_RANK: Record<ClimateSuitabilityTier, number> = {
  thrives: 4,
  grows_well: 3,
  marginal: 2,
  not_advised: 1,
}

/** Climate axis — not_advised only from explicit DB unsuitable_zone flag. */
export function assessClimateSuitability(
  _plantName: string,
  _location: Partial<UserLocation> | null | undefined,
  meta?: PlantZoneMeta
): ClimateSuitabilityTier {
  const unsuitable = meta?.unsuitableZone ?? false
  const multiplier = meta?.growthMultiplier ?? 1

  if (unsuitable || multiplier <= 0.05) return 'not_advised'
  if (multiplier <= 0.92) return 'thrives'
  return 'grows_well'
}

function deriveRecommendedAction(
  seasonal: SeasonalTimingTier,
  climate: ClimateSuitabilityTier
): RecommendedAction {
  if (climate === 'not_advised') return 'avoid'
  if (seasonal === 'not_advised' || seasonal === 'timing_caution') return 'wait'
  return 'plant_now'
}

function buildInsight(
  seasonal: SeasonalTimingTier,
  climate: ClimateSuitabilityTier,
  method: 'seed' | 'seedling',
  meta: PlantZoneMeta | undefined,
  frostDeferred: boolean,
  methodMatch: 'matched' | 'wrong_method' | 'no_window',
  isPerennial: boolean
): PlantSuitabilityInsight | undefined {
  const tips: string[] = []
  let yieldLikelihood: PlantSuitabilityInsight['yieldLikelihood'] = 'good'
  let harvestDelayDays: number | undefined

  if (climate === 'not_advised') {
    yieldLikelihood = 'poor'
    tips.push(
      'This crop is at the edge of or beyond reliable production in your climate without controlled conditions.'
    )
  }

  if (seasonal === 'not_advised') {
    if (isPerennial && methodMatch === 'no_window') {
      tips.push(PERENNIAL_TIMING_INSIGHT)
    } else {
      yieldLikelihood = yieldLikelihood === 'poor' ? 'poor' : 'reduced'
      tips.push(
        method === 'seed'
          ? 'Sowing now is well outside the usual window for your area — expect slower germination or poor establishment.'
          : 'Planting out now is well outside the usual window — growth may stall or fail to crop reliably.'
      )
    }
  } else if (seasonal === 'timing_caution') {
    yieldLikelihood = yieldLikelihood === 'poor' ? 'poor' : 'reduced'
    tips.push('Within a few weeks of ideal — workable, but not peak timing for this method.')
  }

  if (methodMatch === 'wrong_method') {
    tips.push(
      method === 'seed'
        ? 'This fortnight suits planting seedlings more than direct sowing.'
        : 'This fortnight suits sowing seed more than planting seedlings out.'
    )
  }

  if (frostDeferred) {
    tips.push('Regional frost risk — consider starting indoors or waiting for a warmer fortnight.')
  }

  if (meta && meta.growthMultiplier >= 1.2 && climate !== 'not_advised') {
    harvestDelayDays = Math.round((meta.growthMultiplier - 1) * 50)
  }

  if (tips.length === 0) return undefined
  return { harvestDelayDays, yieldLikelihood, tip: tips[0] }
}

function computeSortRank(seasonal: SeasonalTimingTier, climate: ClimateSuitabilityTier): number {
  return SEASONAL_TIMING_RANK[seasonal] * 10 + CLIMATE_RANK[climate]
}

/** Evaluate a single plant — timing and climate are separate assessments. */
export function evaluatePlantSuitability(
  plantName: string,
  location: Partial<UserLocation> | null | undefined,
  options: EvaluatePlantSuitabilityOptions = {}
): PlantSuitabilityAssessment {
  const referenceDate = options.referenceDate ?? new Date()
  const method = options.plantingMethod ?? 'seedling'
  const meta = options.zoneMeta

  const timing = assessFortnightTiming(plantName, location, method, referenceDate)
  const climate = assessClimateSuitability(plantName, location, meta)
  const isPerennial = isPerennialPlantCategory(meta?.plantCategory)
  let recommendedAction = deriveRecommendedAction(timing.tier, climate)
  if (
    isPerennial &&
    climate !== 'not_advised' &&
    timing.methodMatch === 'no_window'
  ) {
    recommendedAction = 'plant_now'
  }
  const insight = buildInsight(
    timing.tier,
    climate,
    method,
    meta,
    timing.frostDeferred,
    timing.methodMatch,
    isPerennial
  )

  return {
    plantName,
    seasonalTiming: timing.tier,
    climateSuitability: climate,
    recommendedAction,
    insight,
    isPerennial,
    sortRank: computeSortRank(timing.tier, climate),
  }
}

export function rankPlantsBySuitability(
  plantNames: string[],
  location: Partial<UserLocation> | null | undefined,
  zoneMetaByPlant: Map<string, PlantZoneMeta> = new Map(),
  options: Omit<EvaluatePlantSuitabilityOptions, 'zoneMeta'> = {}
): PlantSuitabilityAssessment[] {
  return plantNames
    .map((plantName) =>
      evaluatePlantSuitability(plantName, location, {
        ...options,
        zoneMeta: zoneMetaByPlant.get(plantName),
      })
    )
    .sort(
      (a, b) =>
        b.sortRank - a.sortRank ||
        a.plantName.localeCompare(b.plantName)
    )
}

export function groupPlantsBySuitability(
  assessments: PlantSuitabilityAssessment[]
): GroupedPlantSuitability {
  return {
    ideal: assessments.filter((a) => a.seasonalTiming === 'ideal'),
    good: assessments.filter((a) => a.seasonalTiming === 'good'),
    timingCaution: assessments.filter((a) => a.seasonalTiming === 'timing_caution'),
    notAdvised: assessments.filter((a) => a.seasonalTiming === 'not_advised'),
  }
}

/** Plants flagged as genuinely unsuitable for the user's climate (separate from timing groups). */
export function filterClimateNotSuitable(
  assessments: PlantSuitabilityAssessment[]
): PlantSuitabilityAssessment[] {
  return assessments.filter((a) => a.climateSuitability === 'not_advised')
}

/** Timing groups exclude climate-not-suitable plants (shown in their own section). */
export function groupPlantsByTimingOnly(
  assessments: PlantSuitabilityAssessment[]
): GroupedPlantSuitability {
  const suitable = assessments.filter((a) => a.climateSuitability !== 'not_advised')
  return groupPlantsBySuitability(suitable)
}

export function climateSuitabilityLabel(tier: ClimateSuitabilityTier): string {
  switch (tier) {
    case 'thrives':
      return 'Thrives here'
    case 'grows_well':
      return 'Grows well'
    case 'marginal':
      return 'Marginal — high effort'
    case 'not_advised':
      return 'Not advised for climate'
  }
}

export function climateSuitabilityClasses(tier: ClimateSuitabilityTier): string {
  switch (tier) {
    case 'thrives':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'grows_well':
      return 'bg-teal-50 text-teal-800 border-teal-200'
    case 'marginal':
      return 'bg-orange-100 text-orange-900 border-orange-200'
    case 'not_advised':
      return 'bg-red-100 text-red-800 border-red-200'
  }
}

export { seasonalTimingLabel, seasonalTimingClasses, type SeasonalTimingTier }

export interface SuitabilityWarnings {
  timing?: string
  climate?: string
}

export function partitionNotAdvisedByLifespan(
  assessments: PlantSuitabilityAssessment[]
): {
  perennials: PlantSuitabilityAssessment[]
  offSeasonAnnuals: PlantSuitabilityAssessment[]
} {
  return {
    perennials: assessments.filter((a) => a.isPerennial),
    offSeasonAnnuals: assessments.filter((a) => !a.isPerennial),
  }
}

export function recommendedActionWarnings(
  assessment: PlantSuitabilityAssessment
): SuitabilityWarnings | null {
  const warnings: SuitabilityWarnings = {}

  if (assessment.seasonalTiming === 'not_advised') {
    warnings.timing = assessment.isPerennial
      ? PERENNIAL_TIMING_WARNING
      : 'This fortnight is well outside the usual planting window for this crop and method.'
  } else if (assessment.seasonalTiming === 'timing_caution') {
    warnings.timing =
      'Timing is workable but not ideal — you may see slower growth or reduced yield.'
  }

  if (assessment.climateSuitability === 'not_advised') {
    warnings.climate =
      'This plant is not well suited to your climate and may struggle without protected conditions.'
  }

  if (!warnings.timing && !warnings.climate) return null
  return warnings
}

export type GardenStatusBadge =
  | 'on_track'
  | 'off_season'
  | 'perennial'
  | 'climate_risk'
  | 'marginal_climate'

export function gardenStatusFromAssessment(
  assessment: PlantSuitabilityAssessment
): GardenStatusBadge {
  if (assessment.climateSuitability === 'not_advised') return 'climate_risk'
  if (
    assessment.isPerennial &&
    assessment.seasonalTiming === 'not_advised'
  ) {
    return 'perennial'
  }
  if (
    assessment.seasonalTiming === 'not_advised' ||
    assessment.seasonalTiming === 'timing_caution'
  ) {
    return 'off_season'
  }
  return 'on_track'
}

export function statusBadgeLabel(badge: GardenStatusBadge): string {
  switch (badge) {
    case 'on_track':
      return 'On track'
    case 'off_season':
      return 'Off-season start'
    case 'perennial':
      return 'Perennial'
    case 'marginal_climate':
      return 'Marginal climate'
    case 'climate_risk':
      return 'Climate risk'
  }
}

export function statusBadgeClasses(badge: GardenStatusBadge): string {
  switch (badge) {
    case 'on_track':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'off_season':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'perennial':
      return 'bg-slate-100 text-slate-700 border-slate-200'
    case 'marginal_climate':
      return 'bg-orange-100 text-orange-900 border-orange-200'
    case 'climate_risk':
      return 'bg-red-100 text-red-800 border-red-200'
  }
}

export function timingGroupLabel(key: keyof GroupedPlantSuitability): string {
  return seasonalTimingLabel(
    key === 'ideal'
      ? 'ideal'
      : key === 'good'
        ? 'good'
        : key === 'timingCaution'
          ? 'timing_caution'
          : 'not_advised'
  )
}
