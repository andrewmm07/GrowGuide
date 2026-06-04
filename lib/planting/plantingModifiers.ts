import { isInRegionalFrostSeason } from '@/lib/microclimate/frostSeason'
import type { LocationContext } from '@/lib/microclimate/resolve'
import type { MonthPlantingGuide, PlantingMonth } from '@/lib/planting/types'

const PLANTING_MONTH_NUMBER: Record<PlantingMonth, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

/** Frost-sensitive crops: plant-out deferred while regional frost season applies. */
const FROST_TENDER_PLANT_PATTERNS = [
  /^tomato/i,
  /^capsicum/i,
  /^eggplant/i,
  /^chilli/i,
  /^chili/i,
  /^cucumber/i,
  /^zucchini/i,
  /^pumpkin/i,
  /^melon/i,
  /^sweet corn/i,
  /^basil/i,
]

function isFrostTenderPlant(name: string): boolean {
  return FROST_TENDER_PLANT_PATTERNS.some((re) => re.test(name.trim()))
}

function midMonthDate(month: PlantingMonth, year = 2024): Date {
  return new Date(year, PLANTING_MONTH_NUMBER[month] - 1, 15)
}

export interface PlantingModifierResult extends MonthPlantingGuide {
  /** Names removed from plant because of frost timing (may still appear under sow). */
  frostDeferredPlant?: string[]
}

/**
 * Adjust base month lists using location frost profile and tags.
 * Does not change the canonical matrices on disk; applied at read time.
 */
export function applyPlantingModifiers(
  ctx: LocationContext | null,
  month: PlantingMonth,
  guide: MonthPlantingGuide
): PlantingModifierResult {
  if (!ctx) {
    return { sow: [...guide.sow], plant: [...guide.plant] }
  }

  const inFrostSeason = isInRegionalFrostSeason(ctx.frostProfile, midMonthDate(month))
  if (!inFrostSeason) {
    return { sow: [...guide.sow], plant: [...guide.plant] }
  }

  const frostDeferredPlant: string[] = []
  const plant = guide.plant.filter((name) => {
    if (!isFrostTenderPlant(name)) return true
    frostDeferredPlant.push(name)
    return false
  })

  const sow = [...guide.sow]
  for (const name of frostDeferredPlant) {
    if (sow.some((s) => s.toLowerCase().includes(name.toLowerCase().split(' ')[0]))) {
      continue
    }
    if (month === 'August' || month === 'September' || month === 'October') {
      sow.push(`${name} (start indoors)`)
    }
  }

  return {
    sow: Array.from(new Set(sow)),
    plant,
    frostDeferredPlant: frostDeferredPlant.length > 0 ? frostDeferredPlant : undefined,
  }
}
