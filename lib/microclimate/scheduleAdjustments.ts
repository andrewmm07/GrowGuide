/**
 * Microclimate adjustments for zone-based plant schedules.
 * DB timelines stay keyed by au_hardiness_zone; runtime applies location context on top.
 */

import type { LocationContext } from '@/lib/microclimate/resolve'
import { formatGrowingContextLabel } from '@/lib/microclimate/resolve'
import type { MicroclimateTag } from '@/lib/types/location'

type ScheduleActivityInput = {
  daysSincePlanting: number
  activity: string
  details: string
  category: 'fertilizing' | 'pest' | 'planting' | 'pruning' | 'harvest'
}

export interface ScheduleAdjustments {
  /** Multiplied with zone growth_multiplier from plant_timelines. */
  growthFactor: number
  /** Added to base watering_frequency (days between waterings). */
  wateringDayDelta: number
  /** Extra days added to early outdoor planting activities (frost alignment). */
  plantingDayOffset: number
  /** Appended to schedule extraCare (deduped). */
  extraCare: string[]
  contextLabel: string
}

function hasTag(tags: MicroclimateTag[], tag: MicroclimateTag): boolean {
  return tags.includes(tag)
}

/** Derive runtime schedule modifiers from canonical LocationContext. */
export function deriveScheduleAdjustments(ctx: LocationContext): ScheduleAdjustments {
  const tags = ctx.microclimateTags
  let growthFactor = 1
  let wateringDayDelta = 0
  let plantingDayOffset = 0
  const extraCare: string[] = []

  if (hasTag(tags, 'urban_heat')) {
    growthFactor *= 0.95
    extraCare.push('Urban heat islands warm beds faster; check soil moisture daily in summer.')
  }

  if (hasTag(tags, 'alpine_highland')) {
    growthFactor *= 1.1
    wateringDayDelta += 1
    extraCare.push('Highland sites cool quickly; protect seedlings from late frosts and wind.')
  }

  if (hasTag(tags, 'coastal')) {
    wateringDayDelta += 1
    if (ctx.climate === 'cool' || ctx.climate === 'cold') {
      growthFactor *= 1.05
      extraCare.push('Coastal cool sites warm slowly in spring; delay planting out tender crops until nights stabilise.')
    } else {
      extraCare.push('Salt spray and wind can stress exposed leaves; choose sheltered spots where possible.')
    }
  }

  if (hasTag(tags, 'arid_inland')) {
    wateringDayDelta -= 1
    growthFactor *= 1.03
    extraCare.push('Arid inland beds dry out fast; mulch well and water deeply on hot days.')
  }

  if (hasTag(tags, 'subtropical_humid')) {
    wateringDayDelta += 1
    extraCare.push('Humid summers increase fungal risk; improve airflow and avoid evening watering on foliage.')
  }

  if (hasTag(tags, 'tropical_wet_dry')) {
    extraCare.push('Match watering to wet/dry season rainfall; improve drainage before the wet builds up.')
  }

  if (hasTag(tags, 'mediterranean')) {
    extraCare.push('Dry summers need consistent irrigation; save moisture with mulch around roots.')
  }

  if (
    ctx.seasonCalendar === 'southern_four_seasons' &&
    (ctx.climate === 'cold' || ctx.climate === 'cool' || ctx.climate === 'temperate')
  ) {
    plantingDayOffset = ctx.frostProfile.lastFrostWeekOffset * 7
  }

  return {
    growthFactor,
    wateringDayDelta,
    plantingDayOffset,
    extraCare,
    contextLabel: formatGrowingContextLabel(ctx),
  }
}

const PLANTING_OFFSET_MAX_DAYS = 120

/** Apply microclimate timing and care adjustments to generated activities. */
export function applyActivityAdjustments<T extends ScheduleActivityInput>(
  activities: T[],
  adjustments: ScheduleAdjustments
): T[] {
  const offset = adjustments.plantingDayOffset
  if (offset === 0) return activities

  return activities.map((activity) => {
    if (activity.category !== 'planting') return activity
    if (activity.daysSincePlanting > PLANTING_OFFSET_MAX_DAYS) return activity

    const shifted = activity.daysSincePlanting + offset
    if (shifted === activity.daysSincePlanting) return activity

    const frostNote =
      offset > 0
        ? ' Shifted later for your frost profile.'
        : ' Brought forward for your milder microclimate.'

    return {
      ...activity,
      daysSincePlanting: Math.max(0, shifted),
      details: activity.details?.trim()
        ? `${activity.details.trim()}${frostNote}`
        : frostNote.trim(),
    }
  })
}

export function mergeExtraCare(base: string[], additions: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const line of [...base, ...additions]) {
    const trimmed = line?.trim()
    if (!trimmed || seen.has(trimmed)) continue
    seen.add(trimmed)
    out.push(trimmed)
  }
  return out
}

export function adjustedWateringFrequency(baseDays: number, wateringDayDelta: number): number {
  return Math.max(1, baseDays + wateringDayDelta)
}
