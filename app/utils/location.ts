import { GardenLocation, StateCode, ClimateZone } from '../types/location';
import { getClimateZone, isValidStateCity } from './climate';

// Re-export for consumers
export type { GardenLocation } from '../types/location';

export function getNormalizedLocation(_location?: string): GardenLocation | null {
  // Guard against server-side execution where localStorage is unavailable
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const savedLocation = localStorage.getItem('userLocation');
    if (!savedLocation) {
      return null;
    }

    const location = JSON.parse(savedLocation);
    
    // Validate the state/city combination
    if (!isValidStateCity(location.state, location.city)) {
      console.warn('Invalid state/city combination:', location);
      return null;
    }

    // Get climate zone for the location
    const climateZone = getClimateZone(location.state, location.city) as ClimateZone;

    return {
      state: location.state as StateCode,
      city: location.city,
      climateZone: climateZone
    };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
} 