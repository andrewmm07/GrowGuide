/**
 * Regenerate stored garden_plants.full_schedule when the user's location context changes.
 */

import { generatePlantSchedule, type PlantSchedule } from '@/lib/scheduleService'
import { schedulePhaseForPlant } from '@/lib/plantCareSchedule'
import type { UserLocation } from '@/lib/types/location'

export interface StoredFullSchedule {
  plantName: string
  zone: string
  climate: string
  growingContextLabel?: string
  microclimateTags?: string[]
  sowDate?: string
  seedlingDate?: string
  harvestStartDate?: string
  harvestEndDate?: string
  sowToSeedling?: number
  seedlingToHarvest?: number
  schedulePhase?: 'sow' | 'established'
  /** Persisted when DB type column is unavailable — drives task filtering. */
  plantingMethod?: 'seed' | 'seedling'
  totalDays: number
  growthMultiplier: number
  wateringFrequencyDays: number
  extraCare: string[]
  activities: Array<{
    daysSincePlanting: number
    activity: string
    details: string
    category: 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest'
    completed?: boolean
  }>
}

export interface GardenPlantForScheduleRefresh {
  id?: string
  name: string
  datePlanted: string
  type?: 'seed' | 'seedling'
  activityType?: 'sow' | 'plant'
  isHarvested?: boolean
  fullSchedule?: StoredFullSchedule
}

export function locationScheduleKey(location: UserLocation): string {
  const tags = [...(location.microclimateTags ?? [])].sort().join(',')
  return (
    location.placeId ??
    `${location.city}|${location.state}|${location.auHardinessZone}|${location.climate}|${tags}`
  )
}

export function plantScheduleNeedsRefresh(
  plant: GardenPlantForScheduleRefresh,
  location: UserLocation
): boolean {
  if (plant.isHarvested) return false
  if (!plant.datePlanted) return false

  const stored = plant.fullSchedule
  if (!stored) return true

  if (stored.zone !== location.auHardinessZone) return true
  if (stored.climate !== location.climate) return true

  const expectedTags = [...(location.microclimateTags ?? [])].sort()
  const storedTags = [...(stored.microclimateTags ?? [])].sort()
  if (expectedTags.length !== storedTags.length) return true
  return expectedTags.some((tag, i) => tag !== storedTags[i])
}

export function scheduleFromGenerated(
  schedule: PlantSchedule,
  schedulePhase?: 'sow' | 'established'
): StoredFullSchedule {
  return {
    plantName: schedule.plantName,
    zone: schedule.zone,
    climate: schedule.climate,
    growingContextLabel: schedule.growingContextLabel,
    microclimateTags: schedule.microclimateTags,
    sowDate: schedule.sowDate?.toISOString(),
    seedlingDate: schedule.seedlingDate?.toISOString(),
    harvestStartDate: schedule.harvestStartDate?.toISOString(),
    harvestEndDate: schedule.harvestEndDate?.toISOString(),
    sowToSeedling: schedule.sowToSeedling,
    seedlingToHarvest: schedule.seedlingToHarvest,
    schedulePhase,
    plantingMethod: schedulePhase === 'established' ? 'seedling' : 'seed',
    totalDays: schedule.totalDays,
    growthMultiplier: schedule.growthMultiplier,
    wateringFrequencyDays: schedule.wateringFrequencyDays,
    extraCare: schedule.extraCare,
    activities: schedule.activities,
  }
}

function activityCompletionKey(activity: {
  daysSincePlanting: number
  activity: string
}): string {
  return `${activity.daysSincePlanting}:${activity.activity}`
}

export function mergeActivityCompletion(
  previous: StoredFullSchedule['activities'],
  next: StoredFullSchedule['activities']
): StoredFullSchedule['activities'] {
  const completedByKey = new Set<string>()
  const completedByName = new Set<string>()
  for (const act of previous) {
    if (act.completed) {
      completedByKey.add(activityCompletionKey(act))
      completedByName.add(act.activity.trim().toLowerCase())
    }
  }
  return next.map((act) => ({
    ...act,
    completed:
      completedByKey.has(activityCompletionKey(act)) ||
      completedByName.has(act.activity.trim().toLowerCase()) ||
      act.completed,
  }))
}

export async function buildRefreshedFullSchedule(
  plant: GardenPlantForScheduleRefresh,
  location: UserLocation
): Promise<StoredFullSchedule> {
  const anchorDate = new Date(plant.datePlanted)
  const phase = schedulePhaseForPlant(plant)
  const schedule = await generatePlantSchedule(plant.name, location, anchorDate, phase)
  const next = scheduleFromGenerated(schedule, phase)
  if (plant.fullSchedule?.activities?.length) {
    next.activities = mergeActivityCompletion(plant.fullSchedule.activities, next.activities)
  }
  return next
}
