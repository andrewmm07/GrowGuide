import type { PlantingClimateKey } from '@/lib/planting/plantingByClimate'

/** Base growing band (zone-derived). */
export type PlantingBaseClimateKey = PlantingClimateKey

/**
 * Finer planting band: base climate and/or microclimate shape.
 * Variant keys fall back to their base climate matrix when no override exists.
 */
export type PlantingProfileKey =
  | PlantingBaseClimateKey
  | 'cold:highland'
  | 'cool:highland'
  | 'cool:coastal'
  | 'temperate:inland'
  | 'tropical:wet_dry'

export function plantingProfileBaseKey(profile: PlantingProfileKey): PlantingBaseClimateKey {
  if (profile === 'cold:highland') return 'cold'
  if (profile === 'cool:highland' || profile === 'cool:coastal') return 'cool'
  if (profile === 'temperate:inland') return 'temperate'
  if (profile === 'tropical:wet_dry') return 'tropical'
  return profile
}

export function plantingProfileLabel(profile: PlantingProfileKey): string {
  const labels: Record<PlantingProfileKey, string> = {
    cold: 'Cold',
    cool: 'Cool',
    temperate: 'Temperate',
    warm: 'Warm',
    tropical: 'Tropical',
    'cold:highland': 'Cold highland',
    'cool:highland': 'Cool highland',
    'cool:coastal': 'Cool coastal',
    'temperate:inland': 'Temperate inland',
    'tropical:wet_dry': 'Tropical wet/dry',
  }
  return labels[profile]
}
