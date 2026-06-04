import type { Climate, MicroclimateTag } from '@/lib/types/location'
import type { SouthernSeason } from '@/lib/seasonDisplay'
import { BAND_TEMPLATES } from '@/lib/weeklyGuidanceBands'
import { COLD_WEEK_LINES } from './cold'
import { COOL_WEEK_LINES } from './cool'
import { MEDITERRANEAN_WEEK_LINES } from './mediterranean'
import { TEMPERATE_WEEK_LINES } from './temperate'
import { WARM_WEEK_LINES } from './warm'

const AUTHORED: Partial<
  Record<Climate, Record<SouthernSeason, readonly string[]>>
> = {
  cold: COLD_WEEK_LINES,
  cool: COOL_WEEK_LINES,
  temperate: TEMPERATE_WEEK_LINES,
  warm: WARM_WEEK_LINES,
}

/** Fallback: one distinct sentence per week from band templates (no repeated core line). */
function synthesizeFromBands(climate: Climate, season: SouthernSeason): string[] {
  const bands = BAND_TEMPLATES[climate][season]
  const cores = [bands.early.line, bands.mid.line, bands.late.line]
  const focuses = [
    ...bands.early.focus,
    ...bands.mid.focus,
    ...bands.late.focus,
  ]
  const lines: string[] = []
  for (let w = 0; w < 14; w++) {
    const bandIdx = w < 4 ? 0 : w < 9 ? 1 : 2
    const weekInBand = w < 4 ? w + 1 : w < 9 ? w - 3 : w - 8
    const core = cores[bandIdx].replace(/[.!?]+\s*$/, '')
    const focus = focuses[w % focuses.length]
    if (weekInBand === 1) {
      lines.push(`${core}.`)
    } else if (weekInBand === 2) {
      lines.push(`${focus} is the key focus this week; ${core.charAt(0).toLowerCase()}${core.slice(1)}.`)
    } else if (weekInBand === 3) {
      lines.push(`Keep conditions steady and ${core.charAt(0).toLowerCase()}${core.slice(1)}.`)
    } else if (weekInBand === 4) {
      lines.push(`As conditions evolve, ${core.charAt(0).toLowerCase()}${core.slice(1)}.`)
    } else {
      lines.push(`${focus} remains important as you transition into the next phase; ${core.charAt(0).toLowerCase()}${core.slice(1)}.`)
    }
  }
  return lines
}

function tropicalWeekLines(season: SouthernSeason): string[] {
  return synthesizeFromBands('tropical', season)
}

const TROPICAL_WEEK_LINES: Record<SouthernSeason, string[]> = {
  Summer: tropicalWeekLines('Summer'),
  Autumn: tropicalWeekLines('Autumn'),
  Winter: tropicalWeekLines('Winter'),
  Spring: tropicalWeekLines('Spring'),
}

export function getWeekLinesForClimateSeason(
  climate: Climate,
  season: SouthernSeason,
  tags: MicroclimateTag[] = []
): string[] {
  if (tags.includes('mediterranean')) {
    return [...MEDITERRANEAN_WEEK_LINES[season]]
  }
  const authored = AUTHORED[climate]?.[season]
  if (authored) return [...authored]
  if (climate === 'tropical') return [...TROPICAL_WEEK_LINES[season]]
  return synthesizeFromBands(climate, season)
}
