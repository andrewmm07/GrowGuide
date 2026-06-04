/**
 * Read-only view helpers for canonical UserLocation (profiles.location).
 * Does not read localStorage or write to Supabase.
 */

import type { UserLocation, Climate } from './types/location';
import type { GardenLocation, StateCode, ClimateZone } from '@/app/types/location';
import { climateToPlantingKey, resolvePlantingClimate } from '@/lib/planting/resolvePlantingClimate';
import type { PlantingClimateKey } from '@/lib/planting/plantingByClimate';

/** Legacy 3-key grids (PLANTING_GUIDE, CLIMATE_ZONE_PLANTING_GUIDE). */
export type LegacyPlantingGridKey = 'cool' | 'warm' | 'tropical';

function climateToGardenZone(climate: Climate): ClimateZone {
  const map: Record<Climate, ClimateZone> = {
    cold: 'cool temperate',
    cool: 'cool temperate',
    temperate: 'temperate',
    warm: 'temperate',
    tropical: 'tropical',
  };
  return map[climate];
}

/** Map canonical climate to legacy 3-key planting grids. */
export function mapUserClimateToPlantingGuideKey(
  climate: Climate | undefined
): LegacyPlantingGridKey {
  const key: PlantingClimateKey = climate ? climateToPlantingKey(climate) : 'cool';
  return plantingGridKey(key);
}

/** Map 4-key planting climate to legacy 3-key calendar grids. */
export function plantingGridKey(key: PlantingClimateKey): LegacyPlantingGridKey {
  if (key === 'temperate' || key === 'cold') return 'warm';
  return key;
}

export function resolvePlantingGridKey(
  location: Partial<Pick<UserLocation, 'climate' | 'auHardinessZone' | 'state'>> | null | undefined
): LegacyPlantingGridKey {
  return plantingGridKey(resolvePlantingClimate(location));
}

/** Calendar UI still uses GardenLocation; derive from canonical UserLocation only. */
export function gardenLocationFromUserLocation(loc: UserLocation): GardenLocation {
  const state = loc.state.toUpperCase() as StateCode;
  return {
    state,
    city: loc.city,
    climateZone: climateToGardenZone(loc.climate),
  };
}

/** Map inline PLANTING_GUIDE climate keys (cool / warm / tropical) from GardenLocation. */
export function mapGardenClimateZoneToPlantingGuideKey(
  climateZone: ClimateZone | undefined
): 'cool' | 'warm' | 'tropical' {
  const climateZoneMap: Record<string, 'cool' | 'warm' | 'tropical'> = {
    'cool temperate': 'cool',
    temperate: 'warm',
    'warm temperate': 'warm',
    subtropical: 'tropical',
    tropical: 'tropical',
    mediterranean: 'warm',
    arid: 'warm',
  };
  if (!climateZone) return 'cool';
  return climateZoneMap[climateZone] ?? 'cool';
}
