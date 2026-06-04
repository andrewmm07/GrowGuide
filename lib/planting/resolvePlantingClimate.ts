import type { Climate, UserLocation } from '@/lib/types/location'
import { mapZoneToClimate } from '@/lib/types/location'
import type { PlantingClimateKey } from '@/lib/planting/plantingByClimate'

const STATE_DEFAULT_CLIMATE: Record<string, PlantingClimateKey> = {
  NSW: 'temperate',
  ACT: 'temperate',
  VIC: 'cool',
  TAS: 'cool',
  SA: 'cool',
  QLD: 'warm',
  NT: 'warm',
  WA: 'temperate',
}

function normalizeStateCode(state: string): string {
  return state.toUpperCase().slice(0, 3)
}

export function climateToPlantingKey(climate: Climate): PlantingClimateKey {
  if (climate === 'cold') return 'cold'
  if (climate === 'temperate') return 'temperate'
  if (climate === 'warm') return 'warm'
  if (climate === 'tropical') return 'tropical'
  return 'cool'
}

/** Resolve which planting matrix row to use for a location. */
export function resolvePlantingClimate(
  location: Partial<Pick<UserLocation, 'climate' | 'auHardinessZone' | 'state'>> | null | undefined
): PlantingClimateKey {
  if (location?.climate) {
    return climateToPlantingKey(location.climate)
  }
  if (location?.auHardinessZone) {
    return climateToPlantingKey(mapZoneToClimate(location.auHardinessZone))
  }
  if (location?.state) {
    const code = normalizeStateCode(location.state)
    return STATE_DEFAULT_CLIMATE[code] ?? 'temperate'
  }
  return 'temperate'
}

export function plantingClimateLabel(key: PlantingClimateKey): string {
  const labels: Record<PlantingClimateKey, string> = {
    cold: 'Cold',
    cool: 'Cool',
    temperate: 'Temperate',
    warm: 'Warm',
    tropical: 'Tropical',
  }
  return labels[key]
}
