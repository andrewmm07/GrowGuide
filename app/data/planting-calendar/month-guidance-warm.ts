import type { MonthGuidance } from './month-guidance-types'

/** Warm / subtropical AU (Brisbane, Gold Coast, northern NSW coast). */
export const WARM_MONTH_GUIDANCE: Record<string, MonthGuidance> = {
  January: {
    focus:
      'Humid midsummer favours fast growth; keep harvesting and manage pests after storm rain.',
    tasks: [
      'Water deeply in the morning before heat builds',
      'Harvest beans, cucumber, and zucchini regularly',
      'Improve airflow around dense foliage',
    ],
    risks: ['Fruit fly', 'Powdery mildew after wet spells', 'Heat stress on exposed pots'],
    avoid: ['Overhead watering in still, humid evenings'],
  },
  February: {
    focus:
      'Late summer heat and humidity continue; refresh beds for autumn plantings.',
    tasks: [
      'Sow quick greens and Asian vegetables',
      'Mulch to retain moisture between downpours',
      'Remove spent summer crops promptly',
    ],
    risks: ['Fungal spots on leaves', 'Storm damage to tall plants'],
    avoid: ['Leaving diseased foliage on the ground'],
  },
  March: {
    focus:
      'Autumn arrives but soil stays warm; ideal for tomatoes, capsicum, and leafy greens.',
    tasks: [
      'Plant tomatoes and capsicum while nights are still mild',
      'Sow beans, cucumber, and zucchini for quick crops',
      'Top up compost on tired beds',
    ],
    risks: ['Pests shifting to new seedlings', 'Dry gaps between rain'],
    avoid: ['Assuming frost risk when nights remain warm'],
  },
  April: {
    focus:
      'Mild autumn supports steady sowing; shift toward crops that handle cooler nights.',
    tasks: [
      'Sow lettuce, spinach, and Asian greens',
      'Plant root crops and legumes',
      'Reduce feeding on slowing summer plants',
    ],
    risks: ['Snails on tender seedlings', 'Bolting in unseasonal heat'],
    avoid: ['Pulling out productive warm-season crops too early'],
  },
  May: {
    focus:
      'Cooler, drier weather begins; excellent for brassicas, roots, and salad greens.',
    tasks: [
      'Plant broccoli, cabbage, and cauliflower',
      'Sow carrots, beetroot, and radish',
      'Increase watering if rain becomes less reliable',
    ],
    risks: ['Caterpillars on brassicas', 'Slow germination if soil cools quickly'],
    avoid: ['Planting true heat lovers without protection'],
  },
  June: {
    focus:
      'Mild winter is a prime growing season; many vegetables thrive in cool, dry days.',
    tasks: [
      'Plant peas, broad beans, and leafy greens',
      'Sow carrots and beetroot for winter harvest',
      'Light feed on actively growing crops',
    ],
    risks: ['Occasional cold nights on elevated sites', 'Aphids in sheltered spots'],
    avoid: ['Treating winter as a dormant shutdown'],
  },
  July: {
    focus:
      'Dry, mild winter continues; focus on consistent moisture and steady harvests.',
    tasks: [
      'Maintain brassicas and root crops',
      'Sow quick greens every few weeks',
      'Plan spring heat-lover planting',
    ],
    risks: ['Dry soil between rain', 'Whitefly in warm microclimates'],
    avoid: ['Heavy feeding on slow winter growers'],
  },
  August: {
    focus:
      'Late winter warms quickly; start tomatoes and capsicum under cover for spring.',
    tasks: [
      'Sow tomatoes and capsicum in protected trays',
      'Plant potatoes and sweet potato slips',
      'Refresh beds with compost before spring rush',
    ],
    risks: ['Late cool snaps on exposed seedlings', 'Pest build-up in greenhouse trays'],
    avoid: ['Planting tender crops outdoors before nights stabilise'],
  },
  September: {
    focus:
      'Spring build-up brings humidity; sow warm-season crops and watch for storms.',
    tasks: [
      'Transplant tomatoes, capsicum, and eggplant',
      'Sow beans, cucumber, and squash',
      'Stake climbers before wind events',
    ],
    risks: ['Early storms', 'Snails on new growth', 'Fungal issues in humid beds'],
    avoid: ['Crowding seedlings without airflow'],
  },
  October: {
    focus:
      'Strong spring growth; establish summer staples before peak heat.',
    tasks: [
      'Plant sweet potato, corn, and climbing beans',
      'Mulch heavily before dry spells',
      'Begin regular fruit fly monitoring',
    ],
    risks: ['Fruit fly on young fruit', 'Heat spikes late month'],
    avoid: ['Letting beds dry out during hot weekends'],
  },
  November: {
    focus:
      'Pre-summer season; keep sowing quick crops and prepare for storm humidity.',
    tasks: [
      'Succession sow beans and greens',
      'Harvest spring plantings regularly',
      'Check drainage before storm season intensifies',
    ],
    risks: ['Storm damage', 'Rapid pest cycles in warmth'],
    avoid: ['Ignoring fruit fly traps on stone fruit and tomatoes'],
  },
  December: {
    focus:
      'Early wet-season humidity builds; prioritise drainage and fast-maturing crops.',
    tasks: [
      'Harvest often to reduce pest pressure',
      'Sow snake beans, okra, and heat-tolerant greens',
      'Secure stakes and covers before storms',
    ],
    risks: ['Heavy rain', 'Fungal disease', 'Fruit fly'],
    avoid: ['Working waterlogged beds after downpours'],
  },
}
