/**
 * Australian location types and zone mapping
 * Supports hardiness zones 8a (coldest) to 12b (warmest)
 */

export type AUHardinessZone =
  | '8a'
  | '8b'
  | '9a'
  | '9b'
  | '10a'
  | '10b'
  | '11a'
  | '11b'
  | '12a'
  | '12b';

export type Climate = 'cold' | 'cool' | 'temperate' | 'warm' | 'tropical';

/** Meso-scale growing context tags (Australia-wide). Primary tag first. */
export type MicroclimateTag =
  | 'coastal'
  | 'inland'
  | 'alpine_highland'
  | 'arid_inland'
  | 'mediterranean'
  | 'subtropical_humid'
  | 'tropical_wet_dry'
  | 'urban_heat';

/** @deprecated Use microclimateTags. Migrated on load. */
export type Microclimate = 'coastal' | 'inland';

export interface UserLocation {
  lat: number;
  lon: number;
  city: string;
  state: string;
  auHardinessZone: AUHardinessZone;
  climate: Climate;
  microclimateTags: MicroclimateTag[];
  placeId?: string;
  /** @deprecated */
  microclimate?: Microclimate;
}

export interface SuburbRecord {
  name: string;
  state: string;
  lat: number;
  lon: number;
  auHardinessZone: AUHardinessZone;
  microclimate?: Microclimate;
  microclimateTags?: MicroclimateTag[];
}

/**
 * Map Australian hardiness zone to climate category
 * Used for plant selection and care recommendations
 *
 * @param zone - Hardiness zone (e.g., '9a', '10b')
 * @returns Climate category for the zone
 */
export function mapZoneToClimate(zone: AUHardinessZone): Climate {
  const zoneNum = parseInt(zone.substring(0, 2));

  if (zoneNum <= 8) return 'cold';
  if (zoneNum === 9) return 'cool';
  if (zoneNum === 10) return 'temperate';
  if (zoneNum === 11) return 'warm';
  return 'tropical';
}

/**
 * Get minimum winter temperature for a hardiness zone
 * Used to determine frost-sensitive plant suitability
 *
 * @param zone - Hardiness zone
 * @returns Minimum temperature in Celsius
 */
export function getMinWinterTemp(zone: AUHardinessZone): number {
  const tempMap: Record<AUHardinessZone, number> = {
    '8a': -12.2, // -10 to -12.2 °C
    '8b': -9.4,
    '9a': -6.7,
    '9b': -3.9,
    '10a': -1.1,
    '10b': 1.7,
    '11a': 4.4,
    '11b': 7.2,
    '12a': 10.0,
    '12b': 12.2,
  };
  return tempMap[zone];
}

/**
 * Get first/last frost dates for a zone
 * Used for seasonal planting timing
 */
export interface FrostDates {
  lastFrostDateMonth: number; // 1-12
  lastFrostDateDay: number;   // 1-31
  firstFrostDateMonth: number;
  firstFrostDateDay: number;
}

export function getFrostDates(zone: AUHardinessZone): FrostDates {
  const frostMap: Record<AUHardinessZone, FrostDates> = {
    // Last frost = spring end; first frost = autumn start (frost-risk window for modifiers).
    // 8a/8b: spring last frost mid-Oct (not Nov) so October planting calendars apply for tomatoes.
    '8a': { lastFrostDateMonth: 10, lastFrostDateDay: 12, firstFrostDateMonth: 4, firstFrostDateDay: 15 },
    '8b': { lastFrostDateMonth: 10, lastFrostDateDay: 12, firstFrostDateMonth: 4, firstFrostDateDay: 20 },
    '9a': { lastFrostDateMonth: 5, lastFrostDateDay: 15, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    '9b': { lastFrostDateMonth: 5, lastFrostDateDay: 1, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    '10a': { lastFrostDateMonth: 4, lastFrostDateDay: 15, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    '10b': { lastFrostDateMonth: 4, lastFrostDateDay: 1, firstFrostDateMonth: 11, firstFrostDateDay: 18 },
    '11a': { lastFrostDateMonth: 3, lastFrostDateDay: 15, firstFrostDateMonth: 12, firstFrostDateDay: 1 },
    '11b': { lastFrostDateMonth: 3, lastFrostDateDay: 1, firstFrostDateMonth: 12, firstFrostDateDay: 15 },
    '12a': { lastFrostDateMonth: 2, lastFrostDateDay: 15, firstFrostDateMonth: 12, firstFrostDateDay: 20 },
    '12b': { lastFrostDateMonth: 2, lastFrostDateDay: 1, firstFrostDateMonth: 12, firstFrostDateDay: 25 },
  };
  return frostMap[zone];
}
