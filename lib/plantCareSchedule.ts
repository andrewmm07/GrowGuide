/**
 * Align care-task due dates with how the plant was added (sow vs already planted).
 */

import type { GardenPlant, FullPlantSchedule } from '@/app/context/GardenContext'
import { polishScheduleActivities } from '@/lib/plantActivityCopy'

export type ScheduleActivityLike = {
  daysSincePlanting: number
  activity: string
  details: string
  category: string
  completed?: boolean
}

export type PlantSchedulePhase = 'sow' | 'established'

const DEFAULT_SOW_TO_SEEDLING = 14

/** User already has a plant in the ground (seedling tray finished or bought potted). */
export function isEstablishedPlant(plant: {
  type?: string
  activityType?: string
  fullSchedule?: { schedulePhase?: PlantSchedulePhase; plantingMethod?: string } | null
}): boolean {
  if (plant.fullSchedule?.schedulePhase === 'established') return true
  if (plant.fullSchedule?.schedulePhase === 'sow') return false
  if (plant.fullSchedule?.plantingMethod === 'seedling') return true
  return plant.type === 'seedling' || plant.activityType === 'plant'
}

export function schedulePhaseForPlant(plant: {
  type?: string
  activityType?: string
  fullSchedule?: {
    schedulePhase?: PlantSchedulePhase
    plantingMethod?: string
  } | null
}): PlantSchedulePhase {
  const stored = plant.fullSchedule?.schedulePhase
  if (stored === 'established' || stored === 'sow') return stored
  if (plant.fullSchedule?.plantingMethod === 'seedling') return 'established'
  if (plant.fullSchedule?.plantingMethod === 'seed') return 'sow'
  return isEstablishedPlant(plant) ? 'established' : 'sow'
}

export function sowToSeedlingDays(
  fullSchedule?: { sowToSeedling?: number } | null
): number {
  const n = fullSchedule?.sowToSeedling
  if (typeof n === 'number' && n > 0 && Number.isFinite(n)) return Math.round(n)
  return DEFAULT_SOW_TO_SEEDLING
}

/**
 * Setup steps are completed by the act of adding a plant and should not show as future tasks.
 * Covers sow/transplant flows and imperative "Plant X" titles from perennial/fruit timelines.
 */
const SETUP_ACTIVITY_TITLE =
  /\b(sow|sown|germinat|transplant|harden off|hardening|start seeds?|indoors?|under cover|seed tray|prick out|thin(?:\s+to|\s+seedlings?)?|emergence|plant seeds?|plant out|set out|replant|check for germination)\b/i

/** "Plant 2 varieties", "Plant vigorous sucker in spring", etc. */
const PLANT_VERB_TITLE = /^plant\s+/i

/** "Choose and plant 2 varieties" — planting verb not at string start */
const PLANT_VERB_MID = /\bplant\s+(?:\d+|two|three|four|five|six|seven|eight|nine|ten)\b/i

/** In-ground infrastructure (trellis, stakes) — not initial "put plant in ground" steps */
const IN_GARDEN_PLANTING_TASK =
  /\b(install|support|stakes?|trellis|cages?|mulch|wire|netting|row covers?|fencing)\b/i

export function isPrePlantActivityTitle(activity: Pick<ScheduleActivityLike, 'activity'>): boolean {
  const title = activity.activity.trim()
  if (!title) return false
  if (PLANT_VERB_TITLE.test(title) || PLANT_VERB_MID.test(title)) return true
  return SETUP_ACTIVITY_TITLE.test(title)
}

/** Planting-category tasks that mean "establish this crop", not ongoing bed work. */
export function isEstablishmentPlantingTask(
  activity: Pick<ScheduleActivityLike, 'activity' | 'category'>
): boolean {
  if (activity.category !== 'planting') return false
  const title = activity.activity.trim()
  if (!title) return false
  if (isPrePlantActivityTitle({ activity: title })) return true
  return !IN_GARDEN_PLANTING_TASK.test(title)
}

/** Stored schedule was generated for seedling / plant-out (days already shifted). */
export function isSchedulePhaseAdjusted(
  fullSchedule?: { schedulePhase?: PlantSchedulePhase } | null
): boolean {
  return fullSchedule?.schedulePhase === 'established'
}

export function shouldSkipActivityForPhase(
  activity: ScheduleActivityLike,
  phase: PlantSchedulePhase,
  sowOffset: number,
  alreadyAdjusted: boolean
): boolean {
  // Applies to both seed and seedling entries: user has already done setup by adding plant.
  if (isPrePlantActivityTitle(activity)) return true

  if (phase === 'established' && isEstablishmentPlantingTask(activity)) return true

  if (phase === 'sow') return false

  if (alreadyAdjusted) return false

  return activity.daysSincePlanting <= sowOffset
}

/** Shift timeline so date_planted = establishment day for seedling/plant entries. */
export function adjustActivitiesForPhase<T extends ScheduleActivityLike>(
  activities: T[],
  phase: PlantSchedulePhase,
  sowOffset: number
): T[] {
  if (phase === 'sow') {
    return polishScheduleActivities(
      activities
        .filter((act) => !isPrePlantActivityTitle(act))
        .sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)
    )
  }

  return polishScheduleActivities(
    activities
      .filter((act) => !shouldSkipActivityForPhase(act, phase, sowOffset, false))
      .map((act) => ({
        ...act,
        daysSincePlanting: Math.max(0, act.daysSincePlanting - sowOffset),
      }))
      .sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)
  ) as T[]
}

export function adjustScheduleActivitiesForPlant<T extends ScheduleActivityLike>(
  activities: T[],
  plant: {
    type?: string
    activityType?: string
    fullSchedule?: {
      sowToSeedling?: number
      schedulePhase?: PlantSchedulePhase
      plantingMethod?: string
    } | null
  }
): T[] {
  const phase = schedulePhaseForPlant(plant)
  const offset = sowToSeedlingDays(plant.fullSchedule)
  const alreadyAdjusted = isSchedulePhaseAdjusted(plant.fullSchedule)

  if (alreadyAdjusted) {
    return polishScheduleActivities(
      activities
        .filter((act) => !shouldSkipActivityForPhase(act, phase, offset, true))
        .sort((a, b) => a.daysSincePlanting - b.daysSincePlanting)
    ) as T[]
  }

  return adjustActivitiesForPhase(activities, phase, offset) as T[]
}

export function activityDueDate(
  plant: { datePlanted: string },
  activity: ScheduleActivityLike
): Date {
  const planted = new Date(plant.datePlanted)
  const due = new Date(planted)
  due.setDate(due.getDate() + activity.daysSincePlanting)
  return due
}

export function daysUntilActivity(
  plant: { datePlanted: string },
  activity: ScheduleActivityLike,
  fromDate: Date = new Date()
): number {
  const due = activityDueDate(plant, activity)
  return Math.ceil((due.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))
}

export function getActionableActivities(
  plant: GardenPlant | {
    datePlanted: string
    type?: string
    activityType?: string
    fullSchedule?: FullPlantSchedule | null
    isHarvested?: boolean
  },
  options?: { includeCompleted?: boolean }
): ScheduleActivityLike[] {
  if (plant.isHarvested) return []
  const raw = plant.fullSchedule?.activities ?? []
  if (!raw.length) return []

  const adjusted = adjustScheduleActivitiesForPlant(raw, plant)
  const includeCompleted = options?.includeCompleted ?? false

  return adjusted.filter((act) => {
    if (!includeCompleted && act.completed) return false
    return true
  })
}

/** Fix stored schedules: phase alignment, drop setup tasks, active task copy. */
export function repairPlantFullSchedule(plant: GardenPlant): GardenPlant {
  const fs = plant.fullSchedule
  if (!fs?.activities?.length) return plant

  const phase = schedulePhaseForPlant(plant)

  if (phase === 'sow') {
    const activities = polishScheduleActivities(
      fs.activities
    ) as FullPlantSchedule['activities']
    if (JSON.stringify(activities) === JSON.stringify(fs.activities)) return plant
    return { ...plant, fullSchedule: { ...fs, activities } }
  }

  const offset = sowToSeedlingDays(fs)
  const hasStalePrePlant = fs.activities.some(
    (a) =>
      isPrePlantActivityTitle(a) ||
      isEstablishmentPlantingTask(a) ||
      a.daysSincePlanting <= offset
  )
  const needsPhaseTag = fs.schedulePhase !== 'established'
  const alreadyAdjusted = isSchedulePhaseAdjusted(fs)

  let activities: FullPlantSchedule['activities']
  if (hasStalePrePlant || needsPhaseTag || !alreadyAdjusted) {
    activities = alreadyAdjusted
      ? fs.activities.filter(
          (a) => !isPrePlantActivityTitle(a) && !isEstablishmentPlantingTask(a)
        )
      : (adjustActivitiesForPhase(
          fs.activities,
          'established',
          offset
        ) as FullPlantSchedule['activities'])
  } else {
    activities = fs.activities
  }

  activities = polishScheduleActivities(activities) as FullPlantSchedule['activities']

  if (
    !hasStalePrePlant &&
    !needsPhaseTag &&
    alreadyAdjusted &&
    JSON.stringify(activities) === JSON.stringify(fs.activities)
  ) {
    return plant
  }

  return {
    ...plant,
    type: plant.type ?? 'seedling',
    activityType: plant.activityType ?? 'plant',
    fullSchedule: {
      ...fs,
      schedulePhase: 'established',
      plantingMethod: 'seedling',
      sowToSeedling: fs.sowToSeedling ?? offset,
      activities,
    },
  }
}
