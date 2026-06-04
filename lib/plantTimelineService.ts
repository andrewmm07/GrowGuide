/**
 * Plant timeline service for zone-aware plant data
 * Queries plant timelines from Supabase with zone-specific growth multipliers and care instructions
 * Activities are normalized in plant_activities table for efficient querying
 */

import { createClient } from '@supabase/supabase-js';
import { AUHardinessZone, mapZoneToClimate } from './types/location';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory cache for plant timelines — keyed by "plantName|zone"
// Avoids repeated Supabase queries (2 per plant) every time the garden re-renders
const timelineCache = new Map<string, PlantTimelineData>();

/**
 * Plant timeline from database
 * Includes zone-specific growth adjustments and keyed activities
 */
export interface PlantTimelineData {
  plantName: string;
  zone: AUHardinessZone;
  sowToSeedling: number;
  seedlingToHarvest: number;
  harvestWindow: number;
  growthMultiplier: number;
  wateringFrequency: number;
  extraCare: string[];
  keyActivities: Array<{
    timing: number;
    activity: string;
    details: string;
    category: 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest';
  }>;
}

/**
 * Get plant timeline for a specific plant and hardiness zone
 * Fetches both timeline data and normalized activities from plant_activities table
 *
 * @param plantName - Plant name (e.g., 'Tomatoes')
 * @param zone - User's hardiness zone (e.g., '9b')
 * @returns PlantTimelineData with zone-specific adjustments and activities
 * @throws Error if plant not found for zone
 */
export async function getPlantTimeline(
  plantName: string,
  zone: AUHardinessZone
): Promise<PlantTimelineData> {
  const cacheKey = `${plantName}|${zone}`;
  const cached = timelineCache.get(cacheKey);
  if (cached) return cached;

  try {
    // Fetch timeline data
    const { data, error } = await supabase
      .from('plant_timelines')
      .select('*')
      .eq('plant_name', plantName)
      .eq('au_hardiness_zone', zone)
      .single();

    if (error) {
      throw new Error(`Failed to fetch plant timeline: ${error.message}`);
    }

    if (!data) {
      throw new Error(`Plant "${plantName}" not found for zone ${zone}`);
    }

    // Fetch normalized activities for this plant/zone
    const { data: activities, error: activitiesError } = await supabase
      .from('plant_activities')
      .select('*')
      .eq('plant_name', plantName)
      .eq('au_hardiness_zone', zone)
      .order('timing_days', { ascending: true });

    if (activitiesError) {
      console.error(`CRITICAL: Failed to fetch activities for ${plantName} (${zone}):`, activitiesError);
      throw new Error(`Cannot fetch activities: ${activitiesError.message}`);
    }

    if (!activities || activities.length === 0) {
      console.warn(`No activities found for ${plantName} in zone ${zone}`);
    }

    // Transform activities to expected format
    const keyActivities = (activities || []).map((activity) => ({
      timing: activity.timing_days,
      activity: activity.activity_name,
      details: activity.details,
      category: activity.activity_category as 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest',
    }));

    const result: PlantTimelineData = {
      plantName: data.plant_name,
      zone: data.au_hardiness_zone as AUHardinessZone,
      sowToSeedling: Number(data.sow_to_seedling) || 14,
      seedlingToHarvest: Number(data.seedling_to_harvest) || 45,
      harvestWindow: Number(data.harvest_window) || 30,
      growthMultiplier: Number(data.growth_multiplier) || 1,
      wateringFrequency: Number(data.watering_frequency) || 3,
      extraCare: Array.isArray(data.extra_care) ? data.extra_care : (data.extra_care ? [data.extra_care] : []),
      keyActivities,
    };
    timelineCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Plant timeline fetch error:', error);
    throw error;
  }
}

/**
 * Zone-level metadata for suitability scoring (lighter than full timeline fetch).
 */
export interface PlantZoneMeta {
  plantName: string;
  plantCategory: string | null;
  unsuitableZone: boolean;
  growthMultiplier: number;
  climateNote: string | null;
  extraCare: string[];
}

/**
 * Get all plants available for a specific hardiness zone
 * Used to populate plant selector UI with zone-appropriate options
 *
 * @param zone - User's hardiness zone
 * @returns Array of plant names available in that zone
 */
export async function getAvailablePlantsForZone(zone: AUHardinessZone): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('plant_timelines')
      .select('plant_name')
      .eq('au_hardiness_zone', zone)
      .order('plant_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch plants for zone: ${error.message}`);
    }

    return (data || []).map((row) => row.plant_name);
  } catch (error) {
    console.error('Available plants fetch error:', error);
    throw error;
  }
}

/**
 * Zone metadata for all plants (suitability scoring without per-plant timeline fetches).
 */
export async function getPlantZoneMetaForZone(
  zone: AUHardinessZone
): Promise<PlantZoneMeta[]> {
  try {
    const { data, error } = await supabase
      .from('plant_timelines')
      .select(
        'plant_name, plant_category, unsuitable_zone, growth_multiplier, climate_note, extra_care'
      )
      .eq('au_hardiness_zone', zone)
      .order('plant_name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch plant zone metadata: ${error.message}`);
    }

    return (data || []).map((row) => ({
      plantName: row.plant_name,
      plantCategory: row.plant_category ?? null,
      unsuitableZone:
        row.unsuitable_zone === true ||
        row.unsuitable_zone === 'true' ||
        row.unsuitable_zone === 'True',
      growthMultiplier: Number(row.growth_multiplier) || 1,
      climateNote: row.climate_note ?? null,
      extraCare: Array.isArray(row.extra_care)
        ? row.extra_care
        : row.extra_care
          ? [String(row.extra_care)]
          : [],
    }));
  } catch (error) {
    console.error('Plant zone metadata fetch error:', error);
    throw error;
  }
}

/**
 * Get all zones available for a specific plant
 * Useful for showing compatibility across regions
 *
 * @param plantName - Plant name to search for
 * @returns Array of zones where plant can be grown
 */
export async function getZonesForPlant(plantName: string): Promise<AUHardinessZone[]> {
  try {
    const { data, error } = await supabase
      .from('plant_timelines')
      .select('au_hardiness_zone')
      .eq('plant_name', plantName)
      .order('au_hardiness_zone', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch zones for plant: ${error.message}`);
    }

    return (data || []).map((row) => row.au_hardiness_zone as AUHardinessZone);
  } catch (error) {
    console.error('Plant zones fetch error:', error);
    throw error;
  }
}

/**
 * Calculate adjusted timeline based on growth multiplier
 * This converts the base timeline (designed for temperate conditions)
 * to zone-specific timing
 *
 * Example: Tomatoes in warm zone (multiplier 0.9) = 60 * 0.9 = 54 days
 * Example: Tomatoes in cool zone (multiplier 1.2) = 60 * 1.2 = 72 days
 *
 * @param baseValue - Original timeline value in days
 * @param multiplier - Growth multiplier for the zone
 * @returns Adjusted value in days, rounded to nearest integer
 */
export function adjustTimelineForZone(baseValue: number, multiplier: number): number {
  return Math.round(baseValue * multiplier);
}

/**
 * Get planting windows for a plant in a specific zone
 * Useful for determining when to start seeds and when to expect harvest
 *
 * @param plantName - Plant name
 * @param zone - User's hardiness zone
 * @returns Object with key timing milestones in days
 */
export async function getPlantingWindows(
  plantName: string,
  zone: AUHardinessZone
): Promise<{
  sowToSeedling: number;
  seedlingToHarvest: number;
  totalDays: number;
  harvestWindow: number;
}> {
  const timeline = await getPlantTimeline(plantName, zone);

  return {
    sowToSeedling: adjustTimelineForZone(timeline.sowToSeedling, timeline.growthMultiplier),
    seedlingToHarvest: adjustTimelineForZone(timeline.seedlingToHarvest, timeline.growthMultiplier),
    totalDays: adjustTimelineForZone(
      timeline.sowToSeedling + timeline.seedlingToHarvest,
      timeline.growthMultiplier
    ),
    harvestWindow: timeline.harvestWindow,
  };
}
