import type { Climate } from '@/lib/types/location'

type Season = 'Summer' | 'Autumn' | 'Winter' | 'Spring'
type WeekBand = 'early' | 'mid' | 'late'

export interface BandTemplate {
  line: string
  focus: string[]
}

/** Week-of-season sentences (second paragraph chunk). No em dashes. */
export const BAND_TEMPLATES: Record<
  Climate,
  Record<Season, Record<WeekBand, BandTemplate>>
> = {
  cold: {
    Spring: {
      early: {
        line: 'Soil is still slow to warm, so start seeds under cover and delay tender transplants.',
        focus: ['Indoor seeds', 'Frost watch', 'Bed prep'],
      },
      mid: {
        line: 'Harden off cool-season seedlings and direct sow peas and broad beans where soil allows.',
        focus: ['Hardening off', 'Direct sowing', 'Pruning'],
      },
      late: {
        line: 'Growth is picking up, so transplant hardy crops and stake early climbers.',
        focus: ['Transplanting', 'Staking', 'Feeding'],
      },
    },
    Summer: {
      early: {
        line: 'Keep up with harvests and maintain steady watering on warm days.',
        focus: ['Harvesting', 'Watering', 'Mulch'],
      },
      mid: {
        line: 'Maintain leafy greens and roots, and watch for wind damage on exposed sites.',
        focus: ['Wind protection', 'Pest watch', 'Succession sowing'],
      },
      late: {
        line: 'Plan autumn beds by sowing brassicas and clearing spent summer crops.',
        focus: ['Autumn prep', 'Brassicas', 'Cleanup'],
      },
    },
    Autumn: {
      early: {
        line: 'Cooling is quick, so prioritise garlic, onions, and frost-hardy greens.',
        focus: ['Garlic & onions', 'Green manure', 'Mulch'],
      },
      mid: {
        line: 'Harvest tender crops at peak ripeness before frosts become more frequent.',
        focus: ['Frost protection', 'Harvest', 'Mulch'],
      },
      late: {
        line: 'Finish remaining planting, prune dormant trees, and reduce watering as growth slows.',
        focus: ['Winter crops', 'Pruning', 'Drainage'],
      },
    },
    Winter: {
      early: {
        line: 'This is a quieter season, so maintain covers, plan spring, and improve soil when workable.',
        focus: ['Planning', 'Soil care', 'Protection'],
      },
      mid: {
        line: 'In the coldest weeks, prune deciduous fruit and check overwintering crops.',
        focus: ['Dormant pruning', 'Minimal watering', 'Greenhouse'],
      },
      late: {
        line: 'As days lengthen, clean beds and start seeds indoors for spring.',
        focus: ['Seed starting', 'Bed prep', 'Tool maintenance'],
      },
    },
  },
  cool: {
    Spring: {
      early: {
        line: 'Keep frost cloth handy because late frosts are still possible for tender seedlings.',
        focus: ['Frost protection', 'Seed starting', 'Weeding'],
      },
      mid: {
        line: 'As soil warms, sow peas and potatoes and transplant hardy brassicas.',
        focus: ['Potatoes', 'Transplanting', 'Feeding'],
      },
      late: {
        line: 'Plant tomatoes under cover until frost risk drops further.',
        focus: ['Tomatoes', 'Mulch', 'Pest scouting'],
      },
    },
    Summer: {
      early: {
        line: 'Water deeply in the morning and mulch to hold moisture through warm days.',
        focus: ['Deep watering', 'Mulch', 'Harvesting'],
      },
      mid: {
        line: 'Stay on top of harvests and keep good airflow around fruiting crops.',
        focus: ['Harvest rhythm', 'Air flow', 'Feeding'],
      },
      late: {
        line: 'Begin autumn planning by sowing leafy greens and clearing struggling plants.',
        focus: ['Autumn sowing', 'Cleanup', 'Compost'],
      },
    },
    Autumn: {
      early: {
        line: 'Cool-season crops still establish well while soil holds some warmth.',
        focus: ['Brassicas', 'Legumes', 'Bed prep'],
      },
      mid: {
        line: 'Cover tender plants and harvest at peak ripeness as frosts increase.',
        focus: ['Frost cloth', 'Harvest', 'Slug watch'],
      },
      late: {
        line: 'Finish remaining planting, prune dormant trees, and reduce watering as growth slows.',
        focus: ['Mulch', 'Garlic', 'Garden tidy'],
      },
    },
    Winter: {
      early: {
        line: 'Use this low-growth period for structure, compost, and crop planning.',
        focus: ['Planning', 'Compost', 'Protection'],
      },
      mid: {
        line: 'Prune dormant fruit trees and maintain winter greens under cover.',
        focus: ['Pruning', 'Winter greens', 'Pest checks'],
      },
      late: {
        line: 'Order seeds and start slow crops indoors as spring approaches.',
        focus: ['Seed orders', 'Indoor starts', 'Bed repair'],
      },
    },
  },
  temperate: {
    Spring: {
      early: {
        line: 'Watch overnight lows and stagger warm-season planting until soil is ready.',
        focus: ['Soil temp', 'Seed starting', 'Weeding'],
      },
      mid: {
        line: 'Sow beans, plant potatoes, and transplant seedlings in this strong growth window.',
        focus: ['Beans', 'Potatoes', 'Transplanting'],
      },
      late: {
        line: 'Plant summer staples with supports ready for tomatoes, capsicum, and cucumbers.',
        focus: ['Summer crops', 'Staking', 'Mulch'],
      },
    },
    Summer: {
      early: {
        line: 'Water early and shade sensitive crops during heat spikes.',
        focus: ['Heat care', 'Watering', 'Harvest'],
      },
      mid: {
        line: 'Pick regularly and monitor for mildew in humid spells.',
        focus: ['Harvest', 'Disease watch', 'Feeding'],
      },
      late: {
        line: 'Refresh beds and sow quick greens as you plan cooler-season crops.',
        focus: ['Bed refresh', 'Quick greens', 'Pest control'],
      },
    },
    Autumn: {
      early: {
        line: 'Sow brassicas and collect fallen leaves for compost as the season transitions.',
        focus: ['Brassicas', 'Compost', 'Cleanup'],
      },
      mid: {
        line: 'Adjust watering and protect late tender crops as nights cool.',
        focus: ['Watering', 'Cover crops', 'Harvest'],
      },
      late: {
        line: 'Finish autumn sowing, plant garlic, and improve soil for winter.',
        focus: ['Garlic', 'Soil improvement', 'Mulch'],
      },
    },
    Winter: {
      early: {
        line: 'Maintain citrus and winter veg with lighter feeding while growth is slower.',
        focus: ['Citrus care', 'Light feeding', 'Planning'],
      },
      mid: {
        line: 'Prune, repair structures, and order spring seed during the mid-winter lull.',
        focus: ['Pruning', 'Maintenance', 'Seed planning'],
      },
      late: {
        line: 'Prep beds and start early seeds indoors as soil begins to warm.',
        focus: ['Bed prep', 'Indoor seeds', 'Tool check'],
      },
    },
  },
  warm: {
    Spring: {
      early: {
        line: 'Sow heat-lovers early in warm soil, but still watch for brief cool snaps.',
        focus: ['Warm-season sowing', 'Mulch', 'Watering'],
      },
      mid: {
        line: 'Transplant tomatoes, capsicum, and beans with a strong mulch layer.',
        focus: ['Transplanting', 'Mulch', 'Pest watch'],
      },
      late: {
        line: 'Build shade and airflow before peak heat and stake climbers now.',
        focus: ['Shade', 'Staking', 'Feeding'],
      },
    },
    Summer: {
      early: {
        line: 'Water deeply and harvest in the cooler part of the day to reduce heat stress.',
        focus: ['Heat management', 'Watering', 'Harvest'],
      },
      mid: {
        line: 'Maintain mulch and watch for fruit fly and mildew through peak summer.',
        focus: ['Mulch', 'Pest control', 'Harvest'],
      },
      late: {
        line: 'Plan wet-season or autumn crops according to your local rainfall pattern.',
        focus: ['Succession sowing', 'Bed recovery', 'Feeding'],
      },
    },
    Autumn: {
      early: {
        line: 'Sow quick greens and refresh tired summer beds while conditions stay productive.',
        focus: ['Quick greens', 'Bed refresh', 'Compost'],
      },
      mid: {
        line: 'Improve airflow and harvest before storms if humidity rises.',
        focus: ['Air flow', 'Storm prep', 'Harvest'],
      },
      late: {
        line: 'Shift toward dry-season favourites and reduce water on dormant summer crops.',
        focus: ['Crop rotation', 'Water adjust', 'Soil cover'],
      },
    },
    Winter: {
      early: {
        line: 'Mild winter suits peas, greens, and citrus maintenance.',
        focus: ['Winter greens', 'Citrus', 'Weeding'],
      },
      mid: {
        line: 'Light feeding can support steady growth on leafy crops.',
        focus: ['Light feeding', 'Harvest', 'Pest watch'],
      },
      late: {
        line: 'Begin spring prep by sowing tomatoes and beans as soil warms.',
        focus: ['Early sowing', 'Bed prep', 'Mulch'],
      },
    },
  },
  tropical: {
    Spring: {
      early: {
        line: 'In build-up season, increase watering and sow heat-tolerant staples.',
        focus: ['Heat-tolerant crops', 'Watering', 'Mulch'],
      },
      mid: {
        line: 'Improve drainage and scout for fungal issues as humidity rises.',
        focus: ['Drainage', 'Fungal watch', 'Feeding'],
      },
      late: {
        line: 'Secure stakes and harvest before heavy rain as storm season approaches.',
        focus: ['Storm prep', 'Harvest', 'Staking'],
      },
    },
    Summer: {
      early: {
        line: 'In wet season, favour raised beds and fast-maturing varieties.',
        focus: ['Raised beds', 'Fast crops', 'Drainage'],
      },
      mid: {
        line: 'Protect soil and pause garden work after downpours when heavy rain is likely.',
        focus: ['Soil cover', 'Rain pause', 'Pest watch'],
      },
      late: {
        line: 'Clear waterlogged beds and refresh compost as you plan dry-season crops.',
        focus: ['Dry-season prep', 'Cleanup', 'Compost'],
      },
    },
    Autumn: {
      early: {
        line: 'As weather dries, sow Asian greens and legumes.',
        focus: ['Greens', 'Legumes', 'Mulch'],
      },
      mid: {
        line: 'Lower humidity suits tomatoes and capsicum in many tropical areas.',
        focus: ['Tomatoes', 'Capsicum', 'Watering'],
      },
      late: {
        line: 'Prioritise irrigation and shade for seedlings in peak dry-season planting.',
        focus: ['Irrigation', 'Shade', 'Transplanting'],
      },
    },
    Winter: {
      early: {
        line: 'In dry season peak, irrigate consistently and mulch to reduce evaporation.',
        focus: ['Irrigation', 'Mulch', 'Harvest'],
      },
      mid: {
        line: 'Succession sow quick crops while growing conditions stay excellent.',
        focus: ['Succession sowing', 'Feeding', 'Harvest'],
      },
      late: {
        line: 'Refresh beds before humidity returns in the build-up.',
        focus: ['Bed refresh', 'Compost', 'Planning'],
      },
    },
  },
}
