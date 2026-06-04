import { GUIDANCE_MODIFIER_RULES } from './guidanceModifierRules'
import type {
  GuidanceFragments,
  ModifierContext,
  ModifierRule,
} from './guidanceModifiers.types'

export type {
  WeekBand,
  ModifierContext,
  GuidanceFragments,
  ModifierRule,
} from './guidanceModifiers.types'

function hasTag(tags: import('@/lib/types/location').MicroclimateTag[], required: import('@/lib/types/location').MicroclimateTag): boolean {
  return tags.includes(required)
}

function matches(rule: ModifierRule, ctx: ModifierContext): boolean {
  if (rule.tags && !rule.tags.some((t) => hasTag(ctx.tags, t))) return false
  if (rule.excludeTags?.some((t) => hasTag(ctx.tags, t))) return false
  if (
    rule.tags?.includes('coastal') &&
    rule.set.weekLine !== undefined &&
    hasTag(ctx.tags, 'mediterranean')
  ) {
    return false
  }
  if (rule.climates && !rule.climates.includes(ctx.climate)) return false
  if (rule.season && rule.season !== ctx.season) return false
  if (rule.month && rule.month !== ctx.month) return false
  if (rule.weekBand) {
    const bands = Array.isArray(rule.weekBand) ? rule.weekBand : [rule.weekBand]
    if (!bands.includes(ctx.weekBand)) return false
  }
  if (rule.weekInSeason !== undefined) {
    const weeks = Array.isArray(rule.weekInSeason) ? rule.weekInSeason : [rule.weekInSeason]
    if (!weeks.includes(ctx.weekInSeason)) return false
  }
  return true
}

export function applyGuidanceModifiers(
  base: GuidanceFragments,
  ctx: ModifierContext
): GuidanceFragments {
  let result = { ...base }
  for (const rule of GUIDANCE_MODIFIER_RULES) {
    if (!matches(rule, ctx)) continue
    result = { ...result, ...rule.set }
  }
  return result
}
