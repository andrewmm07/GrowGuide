import type { Climate } from '@/lib/types/location'
import { COLD_MONTH_GUIDANCE } from './month-guidance-cold'
import { COOL_MONTH_GUIDANCE } from './month-guidance-cool'
import { TEMPERATE_MONTH_GUIDANCE } from './month-guidance-temperate'
import { WARM_MONTH_GUIDANCE } from './month-guidance-warm'
import { TROPICAL_MONTH_GUIDANCE } from './month-guidance-tropical'
import type { GuidanceClimateKey, MonthGuidance } from './month-guidance-types'
import { resolveGuidanceClimate } from './month-guidance-types'
import { getLegacyCalendarMonthOverview } from './helpers-legacy-summaries'

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

/** @deprecated Legacy state prose; only used when climate is unknown. */
function legacyToStructured(state: string, month: string): MonthGuidance {
  const text = getLegacyCalendarMonthOverview(state, month)
  if (!text) {
    return GENERIC_FALLBACK
  }
  const cleaned = text.replace(/\s*[—–]\s*/g, ', ')
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter((s) => s.length > 8)
  const focus = (sentences[0] ?? cleaned).slice(0, 160)
  const tasks = sentences.slice(1, 5).map((s) => s.replace(/\s+/g, ' ').trim())
  return { focus, tasks }
}

export function getMonthGuidance(
  climate: Climate | undefined,
  state: string,
  month: string
): MonthGuidance {
  const cap = capitalizeMonth(month)
  const key = resolveGuidanceClimate(climate)
  if (key && BY_CLIMATE[key][cap]) {
    return BY_CLIMATE[key][cap]
  }
  if (key) {
    return GENERIC_FALLBACK
  }
  return legacyToStructured(state, cap)
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
