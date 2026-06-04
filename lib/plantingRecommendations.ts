/**
 * Climate/month planting recommendations (canonical for dashboard + weekly brief + calendar).
 */

import { applyPlantingModifiers } from '@/lib/planting/plantingModifiers'
import { getPlantingGuideForProfile } from '@/lib/planting/plantingProfileData'
import type { PlantingProfileKey } from '@/lib/planting/plantingProfiles'
import { plantingProfileLabel } from '@/lib/planting/plantingProfiles'
import {
  resolvePlantingProfile,
  resolvePlantingProfileWithContext,
} from '@/lib/planting/resolvePlantingProfile'
import {
  climateToPlantingKey,
  plantingClimateLabel,
  resolvePlantingClimate,
} from '@/lib/planting/resolvePlantingClimate'
import type { MonthPlantingGuide, PlantingMonth } from '@/lib/planting/types'
import { PLANTING_MONTHS } from '@/lib/planting/types'
import type { UserLocation } from '@/lib/types/location'

export { PLANTING_MONTHS }
export type { MonthPlantingGuide, PlantingMonth }
export type { PlantingClimateKey } from '@/lib/planting/plantingByClimate'
export type { PlantingProfileKey } from '@/lib/planting/plantingProfiles'
export {
  climateToPlantingKey,
  plantingClimateLabel,
  resolvePlantingClimate,
} from '@/lib/planting/resolvePlantingClimate'
export { plantingProfileLabel } from '@/lib/planting/plantingProfiles'
export {
  resolvePlantingProfile,
  resolvePlantingProfileWithContext,
} from '@/lib/planting/resolvePlantingProfile'

export function getCurrentPlantingMonth(date: Date = new Date()): PlantingMonth {
  return PLANTING_MONTHS[date.getMonth()]
}

export type PlantingRecommendationsResult = MonthPlantingGuide & {
  profile: PlantingProfileKey
  frostDeferredPlant?: string[]
}

/** Recommendations for the user's location profile and month (matrix + frost modifiers). */
export function getPlantingRecommendationsForMonth(
  location: Partial<UserLocation> | null | undefined,
  month?: PlantingMonth
): PlantingRecommendationsResult {
  const currentMonth = month ?? getCurrentPlantingMonth()
  const { profile, context } = resolvePlantingProfileWithContext(location)
  const base = getPlantingGuideForProfile(profile, currentMonth)
  const adjusted = applyPlantingModifiers(context, currentMonth, base)
  return {
    sow: adjusted.sow,
    plant: adjusted.plant,
    profile,
    frostDeferredPlant: adjusted.frostDeferredPlant,
  }
}

/** Flat list for compact UI (sow + plant, deduped). */
export function getPlantingRecommendationNames(
  location: Partial<UserLocation> | null | undefined,
  month?: PlantingMonth,
  limit = 8
): string[] {
  const { sow, plant } = getPlantingRecommendationsForMonth(location, month)
  return Array.from(new Set([...sow, ...plant])).slice(0, limit)
}
