/**
 * Schedule generation service for zone-aware plant timelines
 * Generates personalized planting and care schedules based on user's hardiness zone
 */

import { AUHardinessZone, mapZoneToClimate, type UserLocation } from './types/location';
import {
  getPlantTimeline,
  adjustTimelineForZone,
  PlantTimelineData,
} from './plantTimelineService';
import { resolveLocationContext } from './microclimate/resolve';
import {
  applyActivityAdjustments,
  adjustedWateringFrequency,
  deriveScheduleAdjustments,
  mergeExtraCare,
} from './microclimate/scheduleAdjustments';
import {
  adjustActivitiesForPhase,
  type PlantSchedulePhase,
} from './plantCareSchedule';
import { polishScheduleActivities } from './plantActivityCopy';

export type ScheduleLocationInput = UserLocation | AUHardinessZone;

function isUserLocation(input: ScheduleLocationInput): input is UserLocation {
  return typeof input === 'object' && input !== null && 'auHardinessZone' in input;
}

function resolveScheduleLocation(input: ScheduleLocationInput): {
  zone: AUHardinessZone;
  locationContext: ReturnType<typeof resolveLocationContext>;
} {
  if (isUserLocation(input)) {
    const ctx = resolveLocationContext(input);
    const zone = ctx?.zone ?? input.auHardinessZone;
    return { zone, locationContext: ctx };
  }
  return { zone: input, locationContext: null };
}

/**
 * Single activity entry in a plant's timeline
 */
export interface ScheduleActivity {
  daysSincePlanting: number;
  activity: string;
  details: string;
  category: 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest';
}

/**
 * Complete schedule for a plant in a specific zone
 */
export interface PlantSchedule {
  plantName: string;
  zone: AUHardinessZone;
  climate: string;
  /** Human-readable growing context when location was provided. */
  growingContextLabel?: string;
  microclimateTags?: string[];
  sowDate?: Date; // User-provided start date
  seedlingDate?: Date; // Calculated: sowDate + sowToSeedling
  harvestStartDate?: Date; // Calculated: sowDate + sowToSeedling + seedlingToHarvest
  harvestEndDate?: Date; // Calculated: harvestStartDate + harvestWindow
  sowToSeedling: number; // Adjusted days from sowing to seedling stage
  seedlingToHarvest: number; // Adjusted days from seedling to harvest
  totalDays: number;
  growthMultiplier: number;
  wateringFrequencyDays: number;
  extraCare: string[];
  activities: ScheduleActivity[];
}

/**
 * Generate a complete plant schedule for a specific zone
 *
 * @param plantName - Name of the plant (e.g., 'Tomatoes')
 * @param locationOrZone - Full UserLocation (preferred) or hardiness zone only
 * @param sowDate - Optional date to start seeds/transplant
 * @returns Complete schedule with adjusted timelines and activities
 * @throws Error if plant not found for zone
 */
export async function generatePlantSchedule(
  plantName: string,
  locationOrZone: ScheduleLocationInput,
  sowDate?: Date,
  startPhase: PlantSchedulePhase = 'sow'
): Promise<PlantSchedule> {
  const { zone, locationContext } = resolveScheduleLocation(locationOrZone);
  const adjustments = locationContext ? deriveScheduleAdjustments(locationContext) : null;

  // Fetch zone-specific plant data from Supabase
  const plantData = await getPlantTimeline(plantName, zone);

  // Validate and default timeline values (prevent NaN)
  const sowToSeedling = plantData.sowToSeedling || 14; // default 14 days
  const seedlingToHarvest = plantData.seedlingToHarvest || 45; // default 45 days
  const harvestWindow = plantData.harvestWindow || 30; // default 30 days
  const zoneGrowthMultiplier = plantData.growthMultiplier || 1; // default 1.0
  const effectiveMultiplier = zoneGrowthMultiplier * (adjustments?.growthFactor ?? 1);

  // Calculate adjusted timeline values based on growth multiplier
  const adjustedSowToSeedling = adjustTimelineForZone(sowToSeedling, effectiveMultiplier);
  const adjustedSeedlingToHarvest = adjustTimelineForZone(seedlingToHarvest, effectiveMultiplier);
  const totalDays = adjustedSowToSeedling + adjustedSeedlingToHarvest;

  // Calculate milestone dates if sow date provided
  let seedlingDate: Date | undefined;
  let harvestStartDate: Date | undefined;
  let harvestEndDate: Date | undefined;

  const anchorDate = sowDate ? new Date(sowDate) : undefined

  if (anchorDate) {
    if (startPhase === 'established') {
      seedlingDate = new Date(anchorDate)
      harvestStartDate = new Date(anchorDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + adjustedSeedlingToHarvest)
    } else {
      seedlingDate = new Date(anchorDate)
      seedlingDate.setDate(seedlingDate.getDate() + adjustedSowToSeedling)

      harvestStartDate = new Date(seedlingDate)
      harvestStartDate.setDate(harvestStartDate.getDate() + adjustedSeedlingToHarvest)
    }

    harvestEndDate = new Date(harvestStartDate)
    harvestEndDate.setDate(harvestEndDate.getDate() + harvestWindow)
  }

  let activities: ScheduleActivity[] = plantData.keyActivities
    .filter((activity) => activity.timing != null) // Skip activities with null timing
    .map((activity) => {
      const adjustedTiming = adjustTimelineForZone(activity.timing, effectiveMultiplier);

      return {
        daysSincePlanting: adjustedTiming,
        activity: activity.activity,
        details: activity.details,
        category: activity.category,
      };
    });

  if (adjustments) {
    activities = applyActivityAdjustments(activities, adjustments);
  }

  activities = polishScheduleActivities(
    adjustActivitiesForPhase(activities, startPhase, adjustedSowToSeedling)
  );

  const climate = locationContext?.climate ?? mapZoneToClimate(zone);

  return {
    plantName,
    zone,
    climate,
    growingContextLabel: adjustments?.contextLabel,
    microclimateTags: locationContext?.microclimateTags,
    sowDate: anchorDate,
    seedlingDate,
    harvestStartDate,
    harvestEndDate,
    sowToSeedling: adjustedSowToSeedling,
    seedlingToHarvest: adjustedSeedlingToHarvest,
    totalDays,
    growthMultiplier: effectiveMultiplier,
    wateringFrequencyDays: adjustedWateringFrequency(
      plantData.wateringFrequency || 3,
      adjustments?.wateringDayDelta ?? 0
    ),
    extraCare: mergeExtraCare(plantData.extraCare || [], adjustments?.extraCare ?? []),
    activities,
  };
}

/**
 * Generate schedules for multiple plants in a zone
 * Useful for planning an entire garden
 *
 * @param plantNames - Array of plant names
 * @param zone - User's hardiness zone
 * @param sowDates - Optional map of plant names to sow dates
 * @returns Array of schedules
 */
export async function generateMultiplePlantSchedules(
  plantNames: string[],
  locationOrZone: ScheduleLocationInput,
  sowDates?: Record<string, Date>
): Promise<PlantSchedule[]> {
  const schedules = await Promise.all(
    plantNames.map((plantName) =>
      generatePlantSchedule(plantName, locationOrZone, sowDates?.[plantName])
    )
  );

  return schedules;
}

/**
 * Get upcoming activities for the next N days
 * Useful for "today's tasks" UI
 *
 * @param schedule - Plant schedule
 * @param fromDate - Starting date (defaults to today)
 * @param days - Number of days to look ahead (default 7)
 * @returns Activities occurring within the window
 */
export function getUpcomingActivities(
  schedule: PlantSchedule,
  fromDate: Date = new Date(),
  days: number = 7
): ScheduleActivity[] {
  if (!schedule.sowDate) {
    return []; // Can't calculate without sow date
  }

  const windowEnd = new Date(fromDate);
  windowEnd.setDate(windowEnd.getDate() + days);

  return schedule.activities.filter((activity) => {
    const activityDate = new Date(schedule.sowDate!);
    activityDate.setDate(activityDate.getDate() + activity.daysSincePlanting);

    return activityDate >= fromDate && activityDate <= windowEnd;
  });
}

/**
 * Format a date range as human-readable string
 * Example: "March 15 - April 20"
 */
export function formatDateRange(startDate?: Date, endDate?: Date): string {
  if (!startDate) return 'Not scheduled';
  if (!endDate) return startDate.toLocaleDateString();

  // Ensure dates are valid Date objects
  const start = startDate instanceof Date && !isNaN(startDate.getTime())
    ? startDate.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
    : 'Invalid date';
  const end = endDate instanceof Date && !isNaN(endDate.getTime())
    ? endDate.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
    : 'Invalid date';

  return `${start} - ${end}`;
}

/**
 * Calculate days remaining until next milestone
 */
export function daysUntilMilestone(
  milestone: Date | undefined,
  fromDate: Date = new Date()
): number | null {
  if (!milestone) return null;

  const timeDiff = milestone.getTime() - fromDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return daysDiff;
}
