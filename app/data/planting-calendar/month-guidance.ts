import type { Climate } from '@/lib/types/location'
import { COLD_MONTH_GUIDANCE } from './month-guidance-cold'
import { COOL_MONTH_GUIDANCE } from './month-guidance-cool'
import { TEMPERATE_MONTH_GUIDANCE } from './month-guidance-temperate'
import { WARM_MONTH_GUIDANCE } from './month-guidance-warm'
import { TROPICAL_MONTH_GUIDANCE } from './month-guidance-tropical'
import type { GuidanceClimateKey, MonthGuidance } from './month-guidance-types'
import { resolveGuidanceClimate } from './month-guidance-types'
import { resolvePlantingClimate } from '@/lib/planting/resolvePlantingClimate'

const BY_CLIMATE: Record<GuidanceClimateKey, Record<string, MonthGuidance>> = {
  cold: COLD_MONTH_GUIDANCE,
  cool: COOL_MONTH_GUIDANCE,
  temperate: TEMPERATE_MONTH_GUIDANCE,
  warm: WARM_MONTH_GUIDANCE,
  tropical: TROPICAL_MONTH_GUIDANCE,
}

const GENERIC_FALLBACK: MonthGuidance = {
  focus: 'Use the sow and plant lists below for this month in your area.',
  tasks: [],
}

function capitalizeMonth(month: string): string {
  const lower = month.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function resolveGuidanceKey(
  climate: Climate | undefined,
  state: string
): GuidanceClimateKey | null {
  const fromClimate = resolveGuidanceClimate(climate)
  if (fromClimate) return fromClimate
  if (!state?.trim()) return null
  return resolvePlantingClimate({ state }) as GuidanceClimateKey
}

export function getMonthGuidance(
  climate: Climate | undefined,
  state: string,
  month: string
): MonthGuidance {
  const cap = capitalizeMonth(month)
  const key = resolveGuidanceKey(climate, state)
  if (key && BY_CLIMATE[key][cap]) {
    return BY_CLIMATE[key][cap]
  }
  return GENERIC_FALLBACK
}

/** Flat string for callers not yet migrated to MonthGuidance. */
export function monthGuidanceToOverview(g: MonthGuidance): string {
  return g.focus
}

function lowerFirst(text: string): string {
  if (!text) return text
  return text.charAt(0).toLowerCase() + text.slice(1)
}

function joinPhrases(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return lowerFirst(items[0])
  const last = lowerFirst(items[items.length - 1])
  const rest = items.slice(0, -1).map(lowerFirst)
  return `${rest.join(', ')}, and ${last}`
}

/** Multi-sentence overview for year-view cards and detail pages. */
export function monthGuidanceToRichOverview(g: MonthGuidance): string {
  const parts: string[] = []

  const focus = g.focus.trim()
  if (focus) {
    parts.push(focus.endsWith('.') ? focus : `${focus}.`)
  }

  if (g.tasks.length > 0) {
    const tasks = joinPhrases(g.tasks.slice(0, 3))
    parts.push(`${tasks.charAt(0).toUpperCase()}${tasks.slice(1)}.`)
  }

  if (g.risks && g.risks.length > 0) {
    parts.push(`Watch for ${joinPhrases(g.risks.slice(0, 2))}.`)
  }

  return parts.join(' ')
}
