import { resolveLocationContext, type LocationContext } from '@/lib/microclimate/resolve'
import type { MicroclimateTag } from '@/lib/types/location'
import type { UserLocation } from '@/lib/types/location'
import { climateToPlantingKey, resolvePlantingClimate } from '@/lib/planting/resolvePlantingClimate'
import type { PlantingProfileKey } from '@/lib/planting/plantingProfiles'
import { plantingProfileBaseKey } from '@/lib/planting/plantingProfiles'

function hasTag(tags: MicroclimateTag[], tag: MicroclimateTag): boolean {
  return tags.includes(tag)
}

function profileFromContext(ctx: LocationContext): PlantingProfileKey {
  const base = climateToPlantingKey(ctx.climate)
  const tags = ctx.microclimateTags

  if (base === 'cold' || base === 'cool') {
    if (hasTag(tags, 'alpine_highland')) {
      return base === 'cold' ? 'cold:highland' : 'cool:highland'
    }
    if (hasTag(tags, 'coastal')) {
      return 'cool:coastal'
    }
  }

  if (base === 'temperate' && hasTag(tags, 'arid_inland')) {
    return 'temperate:inland'
  }

  if (base === 'tropical' && hasTag(tags, 'tropical_wet_dry')) {
    return 'tropical:wet_dry'
  }

  return base
}

/**
 * Canonical resolver for which planting matrix profile applies.
 * Prefer full UserLocation (placeId + tags); falls back to zone/state only.
 */
export function resolvePlantingProfile(
  location: Partial<UserLocation> | null | undefined
): PlantingProfileKey {
  const ctx = resolveLocationContext(location as UserLocation)
  if (ctx) {
    return profileFromContext(ctx)
  }
  return resolvePlantingClimate(location)
}

export function resolvePlantingProfileWithContext(
  location: Partial<UserLocation> | null | undefined
): { profile: PlantingProfileKey; context: LocationContext | null } {
  const ctx = resolveLocationContext(location as UserLocation)
  return {
    profile: ctx ? profileFromContext(ctx) : resolvePlantingClimate(location),
    context: ctx,
  }
}

/** @deprecated Use resolvePlantingProfile — returns base band only. */
export function resolvePlantingBaseClimate(
  location: Partial<UserLocation> | null | undefined
): PlantingProfileKey {
  return plantingProfileBaseKey(resolvePlantingProfile(location))
}
