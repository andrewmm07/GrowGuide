import type { SouthernSeason } from '@/lib/seasonDisplay'
import type { SignalMagnitude } from '@/lib/types/weatherGuidance'
import type { Climate } from '@/lib/types/location'

type WeekBand = 'early' | 'mid' | 'late'

function pick<T>(items: readonly T[], weekInSeason: number, salt = 0): T {
  return items[(weekInSeason - 1 + salt) % items.length]
}

function coastal(_tags: string[]): string {
  return ''
}

function magnitudeWord(m: SignalMagnitude | null, strong: string, moderate: string, marginal: string): string {
  if (m === 'strong') return strong
  if (m === 'moderate') return moderate
  if (m === 'marginal') return marginal
  return moderate
}

/** Present-state clause for append mode (one sentence). */
export function appendClause(
  season: SouthernSeason,
  weekInSeason: number,
  weekBand: WeekBand,
  tags: string[],
  climate: Climate,
  kind:
    | 'wet'
    | 'wet_settling'
    | 'dry'
    | 'warm'
    | 'cool'
    | 'frost'
    | 'transition_wet_after_dry'
    | 'transition_dry_after_wet',
  warmMagnitude: SignalMagnitude | null,
  wetMagnitude: SignalMagnitude | null,
  baseWeekLine?: string
): string {
  const c = coastal(tags)
  const isIndoorFocused = /\b(indoors?|under cover|propagation|seed trays?)\b/i.test(baseWeekLine ?? '')

  if (kind === 'transition_wet_after_dry') {
    if (isIndoorFocused) {
      return 'Beds are recovering from a dry spell, and this week brought useful rain; keep propagation work moving under cover while outdoor bed prep waits until beds drain fully.'
    }
    return 'Beds are recovering from a dry spell, and this week brought useful rain; pause heavy watering and reassess soil condition before direct sowing or digging.'
  }
  if (kind === 'transition_dry_after_wet') {
    return `${c}Soil is drying after recent wet weather—ventilate covered greens and finish any urgent planting while beds are workable.`
  }
  if (kind === 'frost') {
    if (climate === 'tropical') {
      return 'Humidity and storm shifts can still stress tender growth; protect young plants from sudden weather swings and waterlogging.'
    }
    const frostBySeason: Record<SouthernSeason, readonly string[]> = {
      Summer: [
        `${c}Tender crops are at risk after recent cold nights—keep cover ready and delay outdoor plant-outs until mornings warm.`,
        `${c}Cold mornings can still set back seedlings—use covers overnight and uncover promptly once air warms.`,
      ],
      Autumn: [
        `${c}Tender crops are at risk after recent cold nights—keep cover ready and delay outdoor plant-outs until mornings warm.`,
        `${c}Protect young growth through cold starts; favor hardy plant-outs until overnight lows settle.`,
      ],
      Winter: [
        `${c}Frost pressure remains high—cover tender crops and avoid exposing new growth on clear nights.`,
        `${c}Use frost cloth and sheltered spots for vulnerable plants; wait for warmer mornings before transplanting.`,
        `${c}Repeated cold nights can stall seedlings—hold plant-outs and keep protection ready each evening.`,
      ],
      Spring: [
        `${c}Tender crops are at risk after recent cold nights—keep cover ready and delay outdoor plant-outs until mornings warm.`,
        `${c}Late frosts can still bite in spring—harden off slowly and plant out only after mild nights.`,
      ],
    }
    return pick(frostBySeason[season], weekInSeason, weekBand === 'late' ? 1 : 0)
  }

  if (kind === 'wet_settling') {
    if (climate === 'tropical') {
      const tropicalSettling = [
        'Rain is easing but humidity remains high; keep airflow open and avoid pushing new sowings into sticky beds.',
        'Wet-season pressure is easing; focus on harvest timing, drainage checks, and fungal prevention before restarting major planting.',
        'Conditions are beginning to settle; prioritize cleanup, pruning for airflow, and staged planting only in workable ground.',
      ] as const
      return pick(tropicalSettling, weekInSeason, weekBand === 'late' ? 1 : 0)
    }
    const bySeason: Record<SouthernSeason, string> = {
      Summer:
        'Recent wet conditions are easing, but root zones remain damp; prioritize airflow and harvesting over extra irrigation.',
      Autumn:
        'Conditions are settling after recent wet weeks; keep off soft beds and focus on drainage and soil structure rather than watering changes.',
      Winter:
        'Recent rain is easing, but soil stays soft in winter; keep foot traffic light and use dry windows for small maintenance jobs.',
      Spring:
        'The wet spell is easing, but seedbeds are still cool and tacky; stage transplants first and wait for crumbly texture before direct sowing.',
    }
    return bySeason[season]
  }

  if (kind === 'wet') {
    if (climate === 'tropical') {
      const tropicalWet = [
        'High humidity and persistent moisture are driving disease pressure; keep crops open, harvest promptly, and avoid unnecessary handling of wet plants.',
        'Beds are saturated in tropical heat; prioritize drainage and airflow, and pause major planting until root zones are workable again.',
        'Warm wet conditions favour rapid fungal spread; thin crowded growth and water at the root only when needed.',
        'Monsoonal moisture is dominating this week; focus on crop survival, clean pathways, and staged planting in the best-drained pockets.',
      ] as const
      if (wetMagnitude === 'strong') {
        return pick(
          [
            'Rainfall is extreme for tropical conditions; treat this as a flood-response week with drainage, crop rescue, and disease containment first.',
            'This wet pulse is severe even for the tropics; protect roots from waterlogging, clear outlets, and delay new plantings.',
            'Exceptionally heavy tropical rain needs immediate drainage triage; secure crops already in ground before adding more.',
          ] as const,
          weekInSeason,
          weekBand === 'late' ? 1 : 0
        )
      }
      return pick(tropicalWet, weekInSeason, weekBand === 'mid' ? 1 : weekBand === 'late' ? 2 : 0)
    }
    const bySeason: Record<SouthernSeason, readonly string[]> = {
      Summer: [
        'Beds are holding moisture; pick fruit promptly to reduce splitting and watch tomatoes and beans for mildew in humid air.',
        'Soil is damp; mulch paths, avoid compacting wet beds, and harvest at peak before quality drops.',
        'Humidity is running high after recent rain; prioritize airflow around fruiting crops and avoid overhead watering late in the day.',
        ...(tags.includes('coastal')
          ? [`${c}Salt-laden wind plus damp foliage raises disease risk; thin crowded growth and keep leaves dry where possible.`]
          : ['Damp foliage after rain raises disease risk; thin crowded growth and keep leaves dry where possible.']),
      ],
      Autumn: [
        'Soil is damp; finish garlic and onion planting in workable spots and keep brassica rows ventilated.',
        'Beds are wetter than usual; delay digging and favor container work until soil firms.',
        'Use the moisture while avoiding compaction; plant into friable pockets and keep organic matter on the surface.',
        `${c}Wind-driven showers can keep topsoil tacky; work from paths and avoid repeated passes over beds.`,
      ],
      Winter: [
        'Beds are wet underfoot; stay off sodden soil, check drainage, and ventilate covered greens.',
        'Persistent damp favors mildew and slugs; inspect overwintering brassicas and clear hiding spots.',
        'Use drier windows for light maintenance only; postpone bed turning until structure improves.',
        `${c}Exposed winter beds can stay slick for days; keep traffic off root zones and protect soil surface.`,
      ],
      Spring: [
        'Soil is slow to dry; harden off seedlings on mild days and delay direct sowing into cold, wet seedbeds.',
        'Beds are damp; potatoes and peas can go in where workable, while tender crops stay under cover.',
        'Use brief dry windows for transplanting into crumbly ground and keep seedling airflow high.',
        ...(tags.includes('coastal')
          ? [`${c}Spring sea breeze can mask damp root zones; test soil structure by hand before planting.`]
          : []),
        'Keep summer planting moving by using the best-drained pockets first and leaving heavier beds for later passes.',
      ],
    }
    if (wetMagnitude === 'strong') {
      const strongWetBySeason: Record<SouthernSeason, string> = {
        Summer:
          'Rainfall has been exceptionally heavy; treat this like a short flood cycle—prioritize drainage, root-zone oxygen, and crop rescue over new planting.',
        Autumn:
          'Rainfall is well above normal for autumn; avoid traffic on beds, reopen drainage paths, and recheck recently planted rows once water recedes.',
        Winter:
          'This is more than a wet winter week; focus on drainage recovery and plant survival before routine maintenance.',
        Spring:
          'Spring rain is exceptionally heavy; keep planting moving only in raised, well-drained zones and protect seedlings already in ground.',
      }
      return strongWetBySeason[season]
    }
    return pick(bySeason[season], weekInSeason, weekBand === 'late' ? 1 : weekBand === 'mid' ? 2 : 0)
  }

  if (kind === 'dry') {
    if (climate === 'tropical') {
      const tropicalDryAppend = [
        'Dry-season moisture is dropping quickly; maintain scheduled irrigation on active crops and keep mulch topped up.',
        'Low humidity is pulling moisture from raised beds; water early and prioritize crops already in production.',
        'Dry conditions are building; protect shallow-rooted crops with mulch and avoid opening new beds without irrigation support.',
      ] as const
      return pick(tropicalDryAppend, weekInSeason, weekBand === 'late' ? 1 : 0)
    }
    if (tags.includes('mediterranean')) {
      const medDry: Record<SouthernSeason, readonly string[]> = {
        Summer: [
          'Dry summer week—deep water fruiting crops at the root; hold new plantings until moisture can be kept steady.',
          'Long dry spell—refresh mulch and check irrigation before heat builds; containers need daily attention.',
          'Soil is parched—prioritise crops already fruiting over bare beds that will not stay moist.',
          'Heat and low rain—water at dawn and avoid opening beds that will bake by afternoon.',
        ],
        Autumn: [
          'A dry break after rain—water in establishing alliums and brassicas while soil still holds warmth.',
          'Topsoil is drying between showers—mulch new rows after watering in.',
        ],
        Winter: [
          'A dry winter week is unusual—check establishing crops and pots; open beds often need little extra water.',
          'Surface soil is dry but roots may still be moist—water pots and active rows, not dormant beds.',
        ],
        Spring: [
          'Dry spring patch—keep seedlings and new transplants watered on calm mornings before summer heat.',
          'Rain is easing early—mulch warm beds and confirm irrigation before the dry summer stretch.',
        ],
      }
      return pick(medDry[season], weekInSeason, weekBand === 'late' ? 2 : weekBand === 'mid' ? 1 : 0)
    }
    const bySeason: Record<SouthernSeason, readonly string[]> = {
      Summer: [
        `${c}Soil is drying fast—water fruiting crops and new seedlings in the morning before sea breeze and heat.`,
        `${c}Dry conditions—mulch exposed beds and prioritise water for shallow-rooted greens and containers.`,
      ],
      Autumn: [
        `${c}Soil is drying—water in new garlic, onions, and brassicas while they establish in still-warm soil.`,
        `${c}Beds are drier than usual—check establishing alliums and leafy greens rather than assuming recent rain was enough.`,
      ],
      Winter: [
        `${c}Dry air and little rain—check potted plants and overwintering greens; most open beds need little or no watering.`,
        `${c}Soil is dry on the surface—avoid walking wet-dry cycles on empty beds; focus on pots and covered greens.`,
      ],
      Spring: [
        `${c}Soil is drying—water seedlings under cover and newly transplanted hardy crops on calm mornings.`,
        `${c}Dry spell—keep seed trays moist and mulch spring beds as nights still cool.`,
      ],
    }
    return pick(bySeason[season], weekInSeason, weekBand === 'late' ? 1 : 0)
  }

  if (kind === 'warm') {
    const level = magnitudeWord(
      warmMagnitude,
      'Heat is clearly above normal',
      'Days are running warmer than usual',
      'Temperatures are slightly above normal'
    )
    const bySeason: Record<SouthernSeason, readonly string[]> = {
      Summer: [
        `${c}${level}—harvest and water in the cooler part of the day; shade young seedlings on hot walls.`,
        `${c}${level}—watch containers and shallow beds drying faster than usual.`,
      ],
      Autumn: [
        `${c}${level}—soil may dry faster than expected; check establishing winter crops after warm afternoons.`,
        `${c}${level}—growth is still active; keep mulch up without over-watering tender autumn plant-outs.`,
      ],
      Winter: [
        `${c}${level} for winter—ventilate covers on warm days and avoid over-watering dormant beds.`,
        `${c}${level}—use mild days for quick checks on pots and covered seedlings only.`,
      ],
      Spring: [
        `${c}${level}—harden off gradually and keep tender transplants shaded on bright afternoons.`,
        `${c}${level}—soil can dry on the surface while roots stay cold; water seedlings, not the whole bed blindly.`,
      ],
    }
    return pick(bySeason[season], weekInSeason, weekBand === 'mid' ? 1 : 0)
  }

  const bySeason: Record<SouthernSeason, string> = {
    Summer: `${c}Growth may be slower in unseasonal cool—delay heat-loving sowings until soil warms.`,
    Autumn: `${c}Cooler than usual—protect tender crops and favour hardy greens over rushed plant-outs.`,
    Winter: `${c}Cold conditions—keep covers ready and limit work on frozen or waterlogged soil.`,
    Spring: `${c}Cool spell—hold tender crops under cover and sow hardy peas and greens first.`,
  }
  return bySeason[season]
}

/** Two-sentence replaced paragraph for sustained anomalies. */
export function replacedParagraph(
  season: SouthernSeason,
  weekInSeason: number,
  weekBand: WeekBand,
  tags: string[],
  climate: Climate,
  profile:
    | 'dry'
    | 'dry_warm'
    | 'wet'
    | 'saturated'
    | 'warm'
    | 'cool'
    | 'frost_dry'
    | 'transition_dry_then_wet',
  magnitudes: {
    dry: SignalMagnitude | null
    wet: SignalMagnitude | null
    warm: SignalMagnitude | null
  },
  forecast: { rain: 'drying' | 'stable' | 'wetting'; temp: 'cooling' | 'stable' | 'warming' }
): string {
  const c = coastal(tags)
  const w = weekInSeason

  if (climate === 'tropical') {
    if (profile === 'dry' || profile === 'dry_warm') {
      const tropicalDry = [
        'Dry-season conditions are dominant; prioritize deep, scheduled irrigation on active crops and hold new plantings until moisture can be maintained consistently.',
        'Low humidity suits tomatoes, capsicum, and herbs; irrigate on a steady schedule and mulch to limit evaporation from raised beds.',
        'Succession sow quick greens while dry weather holds; shallow roots need morning watering before heat builds.',
        'Excellent dry-season growing weather continues; check drip lines and focus water on beds with active harvests.',
        'Consolidate irrigation on fruiting crops before opening new rows; corners that dry out first are poor spots for tender seedlings.',
        'Dry air favours European-style vegetables; keep mulch topped up and avoid midday watering that steams roots.',
        'Peak dry-season productivity—feed actively growing crops and harvest regularly to keep plants productive.',
        'Reliable dry-season weather continues; maintain deep irrigation intervals and avoid stretching water across low-priority beds.',
      ] as const
      const profileSalt =
        profile === 'dry_warm' ? 3 : profile === 'dry' ? 0 : 1
      return pick(tropicalDry, w, (weekBand === 'late' ? 2 : 0) + profileSalt)
    }
    if (profile === 'saturated' || profile === 'wet') {
      const tropicalWet = [
        'Monsoonal moisture is dominating beds; prioritize drainage, airflow, and crop survival steps before pushing new sowings.',
        'Heavy wet-season rain needs open drains and lifted pathways; harvest what is ripe before the next downpour.',
        'Humidity and saturated soil raise fungal pressure; thin crowded growth and pause digging until beds firm.',
      ] as const
      return pick(tropicalWet, w)
    }
    if (profile === 'frost_dry') {
      return 'Dry tropical conditions need irrigation discipline on active crops and containers; keep mulch and shade balanced to reduce rapid stress swings.'
    }
  }

  if (profile === 'transition_dry_then_wet') {
    return [
      `${c}Soil has been dry for several weeks but this week brought relief—hold off heavy watering until you see whether beds firm or stay soggy.`,
      forecast.rain === 'wetting'
        ? 'More rain ahead favours drainage checks and patience before sowing.'
        : 'Use the break to finish urgent planting in spots that are actually workable.',
    ].join(' ')
  }

  if (profile === 'frost_dry') {
    const frostLead = `${c}Cold nights are the main risk—cover tender crops and bring pots under shelter when frost is forecast.`
    const drySecond =
      weekBand === 'late' && season === 'Winter'
        ? 'Soil is also dry—check potted plants, not dormant open beds.'
        : 'Dry air follows—water only containers and actively growing protected crops.'
    return `${frostLead} ${drySecond}`
  }

  if (profile === 'saturated' || profile === 'wet') {
    const saturatedSummerLate = [
      'Soil is waterlogged after repeated rain; this is peak summer planting time, so use containers and raised spots for tomatoes and beans rather than waiting for every bed to dry.',
      'Drainage and airflow matter more than another week of delay—protect what is already in the ground from mildew and slugs.',
    ]
    const saturatedSpringLate = [
      'Beds are saturated after a wet run; use raised rows or containers for urgent summer crops and harden off only on dry afternoons.',
      'Each wet week narrows the spring window—prioritise potatoes and hardy greens in the best-drained ground you have.',
      'Repeated rain has saturated spring beds; work from paths, clear drains, and plant only where soil crumbles rather than smears.',
      'Slugs and root rot are the immediate risks; protect seedlings already in the ground before pushing more tender crops out.',
    ]
    const saturatedAutumn = [
      'Soil is heavy and wet; finish garlic in raised or sloped ground and keep brassica rows ventilated.',
      'Avoid digging until structure improves; slugs and root rot are the immediate risks.',
    ]
    const saturatedWinter = [
      `${c}beds are saturated—stay off soil, clear blocked drains, and ventilate covered greens only when air is dry.`,
      'Winter planting is limited; focus on structure and overwintering crops, not new sowings.',
    ]

    if (profile === 'saturated') {
      if (season === 'Summer' && weekInSeason <= 4) {
        return pick(
          [
            'Early summer beds are still waterlogged after a wet lead-in; plant tomatoes and beans into the best-drained ground or containers now.',
            'Delaying every sowing risks missing the window; clear drainage and protect crops already in the ground.',
          ],
          w
        )
      }
      if (season === 'Summer' && weekBand === 'late') return pick(saturatedSummerLate, w)
      if (season === 'Spring' && weekBand === 'late') return pick(saturatedSpringLate, w)
      if (season === 'Autumn') return pick(saturatedAutumn, w)
      if (season === 'Winter') return pick(saturatedWinter, w)
      return pick(
        [
          ...saturatedAutumn,
          ...saturatedSpringLate,
          ...saturatedSummerLate,
        ],
        w
      )
    }

    const wetBySeason: Record<SouthernSeason, readonly string[]> = {
      Summer: [
        'Soil is staying heavily damp after repeated rain; protect root zones and keep airflow high around fruiting crops.',
        'Persistent wet conditions are limiting bed access; prioritize drainage and harvest quality over extra planting.',
      ],
      Autumn: [
        'Autumn beds are remaining wetter than normal; keep traffic light and plant only into friable pockets.',
        'Moisture remains high this week; focus on drainage checks and staged planting in workable rows.',
      ],
      Winter: [
        'Winter soil remains persistently wet; protect structure and use drier windows for light maintenance only.',
        'Rain-soaked winter beds need airflow and drainage attention before routine planting tasks.',
      ],
      Spring: [
        'Spring beds are staying wet; harden off seedlings and stage planting through the best-drained sections first.',
        'Repeated spring rain is slowing bed preparation; prioritize drainage and protect seedlings already in the ground.',
      ],
    }
    return pick(wetBySeason[season], w, weekBand === 'late' ? 1 : 0)
  }

  if (profile === 'dry' && tags.includes('mediterranean')) {
    const medSummerDry: readonly string[] = [
      'Dry summer is dominant—deep water at dawn, mulch heavily, and focus on crops already fruiting.',
      'Irrigation matters more than new sowings—consolidate water on your best beds through the heat.',
      'Heat and drought stress—shade young plants and harvest at peak before quality drops.',
    ]
    const medWinterDry: readonly string[] = [
      'Unusually dry for winter—check establishing brassicas and pots; main-season crops may need a deep drink.',
      'Dry winter week—mulch after watering active rows; most dormant beds need little extra water.',
    ]
    if (season === 'Summer') return pick(medSummerDry, w, weekBand === 'late' ? 1 : 0)
    if (season === 'Winter') return pick(medWinterDry, w)
  }

  if (profile === 'dry') {
    const winterDry: readonly string[] = [
      `${c}Midwinter dryness mostly affects pots and covered greens—open beds are largely dormant, so avoid blanket deep watering.`,
      
      'Check potted plants and overwintering brassicas; improve mulch on empty beds if wind is desiccating soil.',
      'Dry winter weeks mainly affect sheltered containers and covered greens; avoid treating open dormant beds as active crops.',
      'Soil structure on empty beds matters more than watering now; clear drainage channels and tidy bed edges while winter access is easy.',
    ]
    const autumnDry: readonly string[] = [
      'Dry autumn soil means watering in garlic, onions, and establishing brassicas while soil still has warmth.',
      'Prioritise new allium and brassica rows over general bed watering; mulch after watering to hold moisture.',
        'Prioritise garlic rows and young brassicas over general bed watering; mulch after watering to hold moisture.',
        'Establishment water is critical now; dry weeks can stall garlic and leafy greens before winter.',
    ]
    const summerDry: readonly string[] = [
      `${c}Dry summer soil—water fruiting crops and shallow roots in the morning; mulch before hot, windy afternoons.`,
      'Harvest at peak and protect young seedlings; containers dry out first on coastal sites.',
    ]
    const springDry: readonly string[] = [
      `${c}Dry spring soil—keep seed trays and new transplants watered; hardy peas and potatoes still need even moisture to establish.`,
      'Tender crops stay under cover until rain or irrigation catches up with dry topsoil.',
    ]

    if (season === 'Winter') return pick(winterDry, w)
    if (season === 'Autumn') return pick(autumnDry, w)
    if (season === 'Summer') return pick(summerDry, w)
    return pick(springDry, w)
  }

  if (profile === 'dry_warm') {
    const lateWinterWarmDry = [
      'Late-winter warmth on dry soil can wake growth early; check pots and protected greens for moisture before the next cold snap.',
      'A warm, dry late-winter week favors quick growth in sheltered spots; water active containers and monitor fruit tree bud movement before frost risk fully clears.',
    ]
    if (season === 'Winter' && weekBand === 'late') return pick(lateWinterWarmDry, w)
    return [
      'Dry soil plus above-normal warmth can stress active roots faster than expected; prioritize targeted watering on establishing and container crops.',
      'Use warm, dry windows for light maintenance, then reset moisture where growth is actively moving.',
    ][(w - 1) % 2]
  }

  if (profile === 'warm') {
    const intensity = magnitudeWord(
      magnitudes.warm,
      'well above normal',
      'above normal',
      'slightly above normal'
    )
    return [
      `${c}temperatures are ${intensity} for ${season.toLowerCase()}—adjust timing, not panic: harvest and work in cooler hours.`,
      forecast.temp === 'warming'
        ? 'Warmth continues—shade tender seedlings and avoid transplanting in the hottest part of the day.'
        : 'Conditions should ease—keep steady moisture on establishing plants without over-watering.',
    ].join(' ')
  }

  return [
    `${c}Conditions are cooler than usual—protect tender growth and favour hardy crops until nights settle.`,
    'Growth is slow; use covered space for tender sowings and avoid forcing summer crops outdoors.',
  ].join(' ')
}
