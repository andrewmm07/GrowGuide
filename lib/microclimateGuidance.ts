/**
 * @deprecated Import from @/lib/microclimate/guidanceModifiers and resolveLocationContext.
 * Kept for gradual migration of imports.
 */
import type { UserLocation } from '@/lib/types/location'
import { resolveLocationContext } from '@/lib/microclimate/resolve'
import {
  applyGuidanceModifiers,
  type GuidanceFragments,
  type ModifierContext,
} from '@/lib/microclimate/guidanceModifiers'

export type { GuidanceFragments } from '@/lib/microclimate/guidanceModifiers'

export function resolveMicroclimateTags(
  location: Pick<UserLocation, 'city' | 'state' | 'microclimateTags' | 'microclimate' | 'placeId'>
): UserLocation['microclimateTags'] {
  return resolveLocationContext(location)?.microclimateTags ?? []
}

/** @deprecated Use applyGuidanceModifiers */
export function adjustGuidanceForMicroclimate(
  fragments: GuidanceFragments,
  ctx: ModifierContext & { microclimate?: string }
): GuidanceFragments {
  const tags =
    ctx.tags ??
    (ctx.microclimate === 'coastal' ? ['coastal' as const] : ctx.microclimate === 'inland' ? ['inland' as const] : [])
  return applyGuidanceModifiers(fragments, { ...ctx, tags })
}
