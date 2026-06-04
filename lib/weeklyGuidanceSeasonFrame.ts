/**
 * Location + season-transition framing for late weeks (sparse base lines → richer context).
 */

import type { Climate, MicroclimateTag } from '@/lib/types/location'
import type { SouthernSeason } from '@/lib/seasonDisplay'
import type { WeekBand } from '@/lib/microclimate/guidanceModifiers.types'

type ClimateGroup = 'cold_cool' | 'temperate_warm' | 'tropical'

type LateFrameFn = (place: string, seasonLabel: string) => string

const LATE_WEEK_FRAMES: Record<
  ClimateGroup,
  Partial<Record<SouthernSeason, Partial<Record<12 | 13 | 14, LateFrameFn>>>>
> = {
  cold_cool: {
    Summer: {
      12: (p) =>
        `Late summer in ${p}—harvest at peak and clear spent crops before autumn planting fills the calendar.`,
      13: (p) =>
        `Summer lingers on the calendar in ${p}, but evenings are cooling. Finish tender harvests, refresh mulch, and line up autumn beds without rushing brassicas into tired soil.`,
      14: (p) =>
        `Summer's last beat in ${p}. Clear debris, note what thrived in your microclimate, and prepare garlic and green-manure beds as nights cool.`,
    },
    Autumn: {
      12: (p) =>
        `Late autumn in ${p} is narrowing fast. Finish only frost-hardy plant-outs and shift attention to mulch, drainage, and covers.`,
      13: (p, label) =>
        `The last stretch of ${label.toLowerCase()} in ${p} is practically winter. Serious transition week. Keep covers handy for surprise cold or frost. If you haven't already, it's time to switch focus to garden maintenance and infrastructure, over planting.`,
      14: (p, label) =>
        `${label} ends in ${p}—treat this as the hand-off to winter. Clear spent summer crops, firm up drainage, and treat new plant-outs as frost-hardy only.`,
    },
    Winter: {
      12: (p) =>
        `Deep winter in ${p}—growth is minimal. Focus on covers, drainage, and seed planning rather than rushing outdoor sowing.`,
      13: (p) =>
        `Late winter in ${p} still feels cold, but days are lengthening. Maintain overwintered crops, avoid digging until soil is workable, and stage spring work without forcing tender sowings outdoors.`,
      14: (p) =>
        `Winter's last beat in ${p} before spring. Sharpen tools, check stored seed, and hold tender crops under cover until nights consistently ease.`,
    },
    Spring: {
      12: (p) =>
        `Late spring in ${p} is brief—frost can still surprise on clear nights. Harden off in stages and keep covers within reach.`,
      13: (p) =>
        `The last stretch of spring in ${p} is the summer hand-off. Plant protected tomatoes and beans where your site allows, but watch for late frost after warm afternoons.`,
      14: (p) =>
        `Spring ends in ${p}—expand summer planting where frost risk has dropped, scout soft growth for pests, and store frost cloth dry for next season.`,
    },
  },
  temperate_warm: {
    Summer: {
      12: (p) =>
        `Late summer in ${p}—keep harvesting and easing off heavy feeding as growth slows on tired crops.`,
      13: (p) =>
        `Summer runs long in ${p} but heat is easing. Water fruiting crops steadily, clear spent plants, and make space for autumn sowing.`,
      14: (p) =>
        `Summer closes in ${p}. Harvest at peak, refresh mulch, and reset beds before cooler planting windows arrive.`,
    },
    Autumn: {
      12: (p) =>
        `Late autumn in ${p} is cooling steadily. Wind back tender planting and protect remaining warmth-loving crops on cold nights.`,
      13: (p, label) =>
        `The last stretch of ${label.toLowerCase()} in ${p} is a transition week—nights are cooling and growth is slow. Keep frost protection ready and favour maintenance and harvest over new plant-outs.`,
      14: (p, label) =>
        `${label} closes in ${p}. Finish hardy greens and alliums if soil is still workable; otherwise prioritise clearing beds and planning winter crops.`,
    },
    Winter: {
      12: (p) =>
        `Mid-winter in ${p}—a maintenance window. Improve drainage on wet pockets and plan spring beds while growth is slow.`,
      13: (p) =>
        `Late winter in ${p}: days are lengthening but soil may stay cool. Protected sowing beats rushing tender crops outdoors.`,
      14: (p) =>
        `Winter ends in ${p}. Prepare spring beds when workable and harden off early seedlings as nights ease.`,
    },
    Spring: {
      12: (p) =>
        `Late spring in ${p}—plant summer crops in protected spots until frost risk drops on your site.`,
      13: (p) =>
        `The last stretch of spring in ${p} opens the core planting window. Transplant hardy crops and keep cover ready for surprise cold snaps.`,
      14: (p) =>
        `Spring finishes in ${p}—expand summer plantings, ease frost protection after settled mild nights, and feed actively growing crops lightly.`,
    },
  },
  tropical: {
    Summer: {
      12: (p) =>
        `Late wet season in ${p}—manage humidity and drainage; harvest often before heavy rain damages ripe fruit.`,
      13: (p, label) =>
        `The last stretch of ${label.toLowerCase()} in ${p} is still humid. Stay on top of harvests and improve airflow around dense foliage.`,
      14: (p, label) =>
        `${label} winds down in ${p}. Clear spent crops, check drainage, and plan what to establish as conditions shift.`,
    },
    Autumn: {
      12: (p) =>
        `Conditions in ${p} are shifting—ease off wet-season crops and watch for pest pressure as humidity changes.`,
      13: (p, label) =>
        `The last stretch of ${label.toLowerCase()} in ${p} is a transition week. Favour hardy staples and infrastructure over risky new plant-outs.`,
      14: (p, label) =>
        `${label} ends in ${p}. Reset beds, improve drainage, and align sowing with the coming dry or build-up pattern.`,
    },
    Winter: {
      12: (p) =>
        `Dry season in ${p} is established—prioritise water efficiency and harvest timing on heat-stressed crops.`,
      13: (p, label) =>
        `Late ${label.toLowerCase()} in ${p}—heat and water stress limit what establishes well. Maintain mulch and shade where young plants remain.`,
      14: (p, label) =>
        `${label} closes in ${p}. Deep water fruiting crops early, clear spent plants, and plan for build-up humidity.`,
    },
    Spring: {
      12: (p) =>
        `Build-up in ${p} brings rising humidity—scout for fungal issues and harvest before storms.`,
      13: (p, label) =>
        `The last stretch of ${label.toLowerCase()} in ${p} is volatile. Secure stakes, improve drainage, and avoid heavy planting until the wet settles.`,
      14: (p, label) =>
        `${label} ends in ${p}. Finish urgent plant-outs, tidy beds, and prepare for wet-season sowing as rain returns.`,
    },
  },
}

const MID_LATE_OPENERS: Record<
  ClimateGroup,
  Partial<Record<SouthernSeason, Partial<Record<9 | 10 | 11, LateFrameFn>>>>
> = {
  cold_cool: {
    Autumn: {
      9: (p) =>
        `Autumn is well underway in ${p}—growth is slowing and planting windows are narrowing.`,
      10: (p) => `Mid-late autumn in ${p} favours finishing hardy work before winter sets in.`,
      11: (p) =>
        `Late autumn in ${p}—frosts may arrive any time on exposed sites; keep covers ready.`,
    },
    Winter: {
      9: (p) => `Winter is settled in ${p}—focus on maintenance and slow crops rather than new plant-outs.`,
      10: (p) => `Mid-winter in ${p}: protect overwintered greens and avoid working waterlogged beds.`,
      11: (p) =>
        `Late winter in ${p}—soil stays cold; plan spring beds and hold tender sowings under cover.`,
    },
    Spring: {
      9: (p) => `Spring is opening in ${p}, but nights can still bite—harden off in stages.`,
      10: (p) => `Mid-spring in ${p}—core hardy planting continues; tender crops stay protected.`,
      11: (p) =>
        `Late spring in ${p} is short—watch for frost after warm days before planting out tomatoes.`,
    },
    Summer: {
      9: (p) => `Late summer in ${p}—start clearing tired crops and refreshing mulch before autumn.`,
      10: (p) => `Summer is easing in ${p}; plan autumn beds as evenings cool.`,
      11: (p) =>
        `Final summer stretch in ${p}—harvest at peak and avoid leaving pest habitat in spent plants.`,
    },
  },
  temperate_warm: {
    Autumn: {
      9: (p) => `Autumn in ${p} is cooling—complete planting plans and ease back on summer watering.`,
      10: (p) => `Mid-autumn in ${p}—prune only when trees are fully dormant.`,
      11: (p) => `Late autumn in ${p}—protect tender crops when forecasts dip.`,
    },
    Winter: {
      9: (p) => `Winter in ${p}—steady harvests on greens and calm pruning weather for dormant fruit.`,
      10: (p) => `Mid-winter in ${p}: order seed and improve soil on empty beds.`,
      11: (p) => `Late winter in ${p}—prepare spring beds when soil is workable.`,
    },
    Spring: {
      9: (p) => `Spring in ${p} is building—transplant hardy crops and stake climbers.`,
      10: (p) => `Mid-spring in ${p}—increase watering as growth accelerates.`,
      11: (p) => `Late spring in ${p}—plant summer crops under cover until frost risk drops.`,
    },
    Summer: {
      9: (p) => `Late summer in ${p}—succession sow quick greens where space opens.`,
      10: (p) => `Summer in ${p} is shifting—plan autumn beds and order garlic if needed.`,
      11: (p) => `Final summer harvests in ${p} before resetting beds for autumn.`,
    },
  },
  tropical: {
    Autumn: {
      9: (p) => `Seasonal shift in ${p}—adjust watering as humidity and rain patterns change.`,
      10: (p) => `Mid-season in ${p}—stay on harvest timing and bed hygiene.`,
      11: (p) => `Late season in ${p}—favour crops that suit the coming dry or wet pattern.`,
    },
    Winter: {
      9: (p) => `Dry season in ${p}—water deeply on young plants and mulch to hold moisture.`,
      10: (p) => `Mid dry season in ${p}—shade and mulch matter for establishing crops.`,
      11: (p) => `Late dry season in ${p}—prioritise water on fruiting crops.`,
    },
    Spring: {
      9: (p) => `Build-up in ${p}—rising humidity; improve airflow around dense beds.`,
      10: (p) => `Mid build-up in ${p}—secure stakes before storms.`,
      11: (p) => `Late build-up in ${p}—finish urgent planting before the wet returns.`,
    },
    Summer: {
      9: (p) => `Wet season in ${p}—harvest often and manage drainage in saturated beds.`,
      10: (p) => `Mid wet season in ${p}—scout for fungal issues on soft growth.`,
      11: (p) => `Late wet season in ${p}—clear spent crops and plan the dry-season switch.`,
    },
  },
}

function climateGroup(climate: Climate): ClimateGroup {
  if (climate === 'tropical') return 'tropical'
  if (climate === 'cold' || climate === 'cool') return 'cold_cool'
  return 'temperate_warm'
}

function lineWeek(weekInSeason: number, guidanceLineWeek?: number): number {
  return Math.min(14, Math.max(1, Math.round(guidanceLineWeek ?? weekInSeason)))
}

function appendBase(opener: string, baseLine: string): string {
  const trimmed = baseLine.trim()
  if (!trimmed) return opener
  const base = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
  return `${opener.replace(/[.!?]+\s*$/, '')}. ${base}`
}

export interface SeasonWeekFrameInput {
  place: string
  seasonLabel: string
  bandSeason: SouthernSeason
  weekInSeason: number
  guidanceLineWeek?: number
  weekBand: WeekBand
  climate: Climate
  tags: MicroclimateTag[]
  baseLine: string
}

/**
 * Enrich sparse week lines with place + season-transition context (late weeks replace base).
 */
export function applySeasonWeekFrame(input: SeasonWeekFrameInput): string {
  const week = lineWeek(input.weekInSeason, input.guidanceLineWeek)
  const group = climateGroup(input.climate)
  const { place, seasonLabel, bandSeason, baseLine } = input

  const lateFrame = LATE_WEEK_FRAMES[group]?.[bandSeason]?.[week as 12 | 13 | 14]
  if (lateFrame) {
    return lateFrame(place, seasonLabel)
  }

  if (input.weekBand === 'late' && week >= 9 && week <= 11) {
    const opener = MID_LATE_OPENERS[group]?.[bandSeason]?.[week as 9 | 10 | 11]
    if (opener) {
      return appendBase(opener(place, seasonLabel), baseLine)
    }
  }

  return baseLine
}
