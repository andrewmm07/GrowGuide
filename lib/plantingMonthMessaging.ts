/**
 * Headline + short honesty copy for dashboard "what to plant this month".
 */

import { resolveLocationContext } from '@/lib/microclimate/resolve'
import type { PlantingMonth } from '@/lib/planting/types'
import type { PlantingRecommendationsResult } from '@/lib/plantingRecommendations'
import type { UserLocation } from '@/lib/types/location'

export const PLANTING_CARD_PREVIEW_LIMIT = 3

export type PlantingMonthTier = 'quiet' | 'moderate' | 'peak'

function uniqueCount(sow: string[], plant: string[]): number {
  return new Set([...sow, ...plant].map((n) => n.trim().toLowerCase())).size
}

export function plantingMonthTier(sow: string[], plant: string[]): PlantingMonthTier {
  const n = uniqueCount(sow, plant)
  if (n <= 5) return 'quiet'
  if (n <= 11) return 'moderate'
  return 'peak'
}

function gardenPlace(ctx: NonNullable<ReturnType<typeof resolveLocationContext>>): string {
  return ctx.city || ctx.state || 'your garden'
}

function monthIndex(month: PlantingMonth): number {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return names.indexOf(month)
}

const LISTS_CLOSER = 'The lists below are your main options for the month.'

/** Short seasonal framing for moderate-tier months — one plain sentence, no climate labels. */
function moderateHonestyCopy(
  ctx: NonNullable<ReturnType<typeof resolveLocationContext>>,
  month: PlantingMonth
): string {
  const idx = monthIndex(month)
  const { climate, seasonCalendar } = ctx

  if (seasonCalendar === 'tropical_wet_dry') {
    if (idx >= 10 || idx <= 3) {
      return `Wet-season rain and humidity narrow what establishes well outdoors. ${LISTS_CLOSER}`
    }
    return `Dry-season heat and water stress limit what establishes well. ${LISTS_CLOSER}`
  }

  if (climate === 'cold' || climate === 'cool') {
    if (idx >= 2 && idx <= 5) {
      return `Increasing cold constrains what can be planted successfully, especially as the month progresses. ${LISTS_CLOSER}`
    }
    if (idx >= 6 && idx <= 7) {
      return `Winter cold keeps the planting window narrow. ${LISTS_CLOSER}`
    }
    if (idx >= 8 && idx <= 10) {
      return `Warming days open more choices, though cold snaps can still set back tender plant-outs. ${LISTS_CLOSER}`
    }
    return `Summer brings more choice, though heat and dry spells can stress young plants. ${LISTS_CLOSER}`
  }

  if (climate === 'temperate' || climate === 'warm') {
    if (idx >= 2 && idx <= 4) {
      return `Cooling weather gradually narrows what establishes well outdoors, especially later in the month. ${LISTS_CLOSER}`
    }
    if (idx >= 5 && idx <= 7) {
      return `Cooler soil and shorter days narrow what establishes well outdoors. ${LISTS_CLOSER}`
    }
    if (idx >= 8 && idx <= 10) {
      return `Spring warmth opens more options, though late frosts can still catch tender plant-outs. ${LISTS_CLOSER}`
    }
    return `Summer heat and water demand limit what establishes well, especially for tender seedlings. ${LISTS_CLOSER}`
  }

  return `Seasonal conditions narrow what establishes well this month. ${LISTS_CLOSER}`
}

function quietHonestyCopy(
  ctx: NonNullable<ReturnType<typeof resolveLocationContext>>,
  month: PlantingMonth
): string {
  const idx = monthIndex(month)
  const { climate, seasonCalendar } = ctx

  if (seasonCalendar === 'tropical_wet_dry') {
    return 'Seasonal conditions rule out most outdoor planting right now. What still fits is in the lists below.'
  }

  if ((climate === 'cold' || climate === 'cool') && idx >= 2 && idx <= 7) {
    return 'Increasing cold rules out most outdoor planting, especially toward the end of the month. What still fits is in the lists below.'
  }

  if ((climate === 'temperate' || climate === 'warm') && idx >= 5 && idx <= 7) {
    return 'Winter conditions rule out most outdoor planting. What still fits is in the lists below.'
  }

  return 'Weather this month tends to rule out most outdoor planting. What still fits locally is in the lists below.'
}

export interface PlantingMonthMessaging {
  monthHeadline: string
  honestyCopy: string
  tier: PlantingMonthTier
  totalUnique: number
  hiddenCount: number
  calendarHref: string
}

export function buildPlantingMonthMessaging(
  location: UserLocation | null | undefined,
  month: PlantingMonth,
  recommendations: Pick<PlantingRecommendationsResult, 'sow' | 'plant'>
): PlantingMonthMessaging | null {
  const ctx = resolveLocationContext(location)
  if (!ctx) return null

  const place = gardenPlace(ctx)
  const monthHeadline = `${month} in ${place}`
  const tier = plantingMonthTier(recommendations.sow, recommendations.plant)
  const totalUnique = uniqueCount(recommendations.sow, recommendations.plant)
  const shown =
    Math.min(recommendations.sow.length, PLANTING_CARD_PREVIEW_LIMIT) +
    Math.min(recommendations.plant.length, PLANTING_CARD_PREVIEW_LIMIT)
  const hiddenCount = Math.max(0, totalUnique - shown)

  let honestyCopy: string
  if (tier === 'quiet') {
    honestyCopy = quietHonestyCopy(ctx, month)
  } else if (tier === 'peak') {
    honestyCopy =
      'Several crops suit planting this month. Highlights below — open the full planting calendar for the complete list.'
  } else {
    honestyCopy = moderateHonestyCopy(ctx, month)
  }

  return {
    monthHeadline,
    honestyCopy,
    tier,
    totalUnique,
    hiddenCount,
    calendarHref: `/planting-calendar/${month.toLowerCase()}`,
  }
}
