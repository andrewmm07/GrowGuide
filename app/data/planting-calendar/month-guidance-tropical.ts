import type { MonthGuidance } from './month-guidance-types'

/** Tropical wet/dry AU (Darwin, Cairns, north QLD). Calendar uses wet/dry framing. */
export const TROPICAL_MONTH_GUIDANCE: Record<string, MonthGuidance> = {
  January: {
    focus:
      'Peak wet season: heat, humidity, and heavy rain favour fast growers with good drainage.',
    tasks: [
      'Sow beans, Asian greens, and fast wet-season crops',
      'Harvest regularly before storms',
      'Clear drainage paths and raise beds if needed',
    ],
    risks: ['Flooding in low beds', 'Fungal disease', 'Cyclone debris'],
    avoid: ['Sowing in waterlogged soil'],
  },
  February: {
    focus:
      'Wet season continues; focus on airflow, pest control, and storm recovery.',
    tasks: [
      'Plant sweet potato and yams',
      'Remove damaged foliage after rain',
      'Mulch to reduce splash-borne disease',
    ],
    risks: ['Root rot', 'Fruit fly', 'Strong winds'],
    avoid: ['Dense planting without airflow'],
  },
  March: {
    focus:
      'Late wet season; last chance for wet-tolerant crops before the dry spell strengthens.',
    tasks: [
      'Sow quick greens and legumes',
      'Harvest wet-season crops at peak quality',
      'Check irrigation before dry months',
    ],
    risks: ['Late storms', 'Pest outbreaks in humidity'],
    avoid: ['Starting long-season crops that hate dry heat ahead'],
  },
  April: {
    focus:
      'Transition month; rain eases and planting shifts toward dry-season favourites.',
    tasks: [
      'Plant tomatoes, capsicum, and eggplant',
      'Sow Asian greens and herbs',
      'Repair beds after wet season',
    ],
    risks: ['Uneven moisture as rain tapers', 'Remaining fungal carry-over'],
    avoid: ['Overwatering as natural rain declines'],
  },
  May: {
    focus:
      'Dry season begins with reliable sun; prime time for tomatoes, capsicum, and greens.',
    tasks: [
      'Transplant tomatoes and capsicum with strong mulch',
      'Sow beans, cucumber, and zucchini',
      'Set irrigation schedule for coming dry months',
    ],
    risks: ['Rapid drying on bare soil', 'Pest insects seeking water'],
    avoid: ['Leaving new seedlings without mulch'],
  },
  June: {
    focus:
      'Dry season peak offers excellent growing weather with low humidity.',
    tasks: [
      'Plant European vegetables and herbs',
      'Sow carrots, beetroot, and lettuce',
      'Irrigate consistently at root level',
    ],
    risks: ['Dry soil stress', 'Cool nights on elevated inland sites'],
    avoid: ['Skipping irrigation on windy days'],
  },
  July: {
    focus:
      'Cool, dry conditions suit tomatoes, capsicum, and leafy greens across the tropics.',
    tasks: [
      'Maintain even watering on fruiting crops',
      'Succession sow quick greens',
      'Light feed on active beds',
    ],
    risks: ['Cool snaps on open sites', 'Aphids on soft growth'],
    avoid: ['Assuming frost risk in lowland coastal gardens'],
  },
  August: {
    focus:
      'Dry season continues; prepare for rising heat and the build-up toward wet season.',
    tasks: [
      'Harvest dry-season crops at peak',
      'Sow heat-tolerant beans and greens',
      'Refresh mulch before temperatures climb',
    ],
    risks: ['Increasing evaporation', 'Pest pressure as humidity rises'],
    avoid: ['Letting soil bake bare between crops'],
  },
  September: {
    focus:
      'Build-up season starts: heat and humidity return; sow quick crops and storm-proof beds.',
    tasks: [
      'Plant fast-maturing vegetables',
      'Secure stakes and netting',
      'Increase watering as evaporation rises',
    ],
    risks: ['Early storms', 'Heat stress on exposed seedlings'],
    avoid: ['Large slow crops that will face wet season stress'],
  },
  October: {
    focus:
      'Hot and humid; favour storm-tolerant varieties and improve drainage.',
    tasks: [
      'Sow beans, pumpkin, and sweet potato cuttings',
      'Harvest before damaging storms',
      'Scout for fungal issues daily in humid weather',
    ],
    risks: ['Heavy rain', 'Strong wind', 'Fruit fly'],
    avoid: ['Working compacted wet soil'],
  },
  November: {
    focus:
      'Early wet season; plant wet-tolerant crops and ensure beds drain freely.',
    tasks: [
      'Sow Asian greens and beans',
      'Mulch to reduce splash disease',
      'Clear gutters and bed edges before downpours',
    ],
    risks: ['Flooding', 'Fungal outbreaks', 'Cyclone preparation needs'],
    avoid: ['Sowing in saucers of standing water'],
  },
  December: {
    focus:
      'Wet season intensifies; focus on drainage, fast harvests, and storm-ready supports.',
    tasks: [
      'Harvest ripe produce before storms',
      'Sow quick greens between rain events',
      'Improve airflow around dense crops',
    ],
    risks: ['Waterlogging', 'Disease', 'Wind damage'],
    avoid: ['Leaving ripe fruit to attract fruit fly'],
  },
}
