import type { MonthGuidance } from './month-guidance-types'

/** Cool / cold AU climates (Tasmania, southern VIC, highlands). */
export const COOL_MONTH_GUIDANCE: Record<string, MonthGuidance> = {
  January: {
    focus:
      'Summer is mild in cool climates, so keep harvests steady and maintain moisture on warm days.',
    tasks: ['Harvest leafy greens and roots regularly', 'Water early morning on hot spells', 'Sow quick greens for late summer pickings'],
    risks: ['Wind damage on exposed sites', 'Bolting in heat waves'],
    avoid: ['Letting soil dry out on windy days'],
  },
  February: {
    focus: 'Late summer is a good time to shift beds toward autumn crops and refresh tired plantings.',
    tasks: ['Plant brassicas and root veg for autumn', 'Clear struggling summer crops', 'Add compost before autumn sowing'],
    risks: ['Pests on stressed plants', 'Dry soil under mulch'],
    avoid: ['Heavy feeding on plants you are about to remove'],
  },
  March: {
    focus: 'Autumn planting is underway while soil is still warm enough for winter crops to establish well.',
    tasks: ['Sow kale, broccoli, carrots, and peas', 'Plant green manure on empty beds', 'Mulch to hold moisture'],
    risks: ['Cutworms on new seedlings', 'Weeds competing with young plants'],
    avoid: ['Leaving spent summer crops to harbour pests'],
  },
  April: {
    focus: 'This is the main autumn planting month and often the last chance for many warm-season crops.',
    tasks: ['Plant broad beans and peas', 'Prepare beds with compost', 'Harvest remaining summer fruit'],
    risks: ['Early frosts in cold valleys', 'Slugs in damp weather'],
    avoid: ['Planting frost-tender crops without protection'],
  },
  May: {
    focus:
      'Winter is approaching, so prioritise frost-hardy vegetables and protect garden beds.',
    tasks: ['Plant garlic, leeks, and hardy brassicas', 'Mulch heavily before cold nights', 'Improve soil on empty beds'],
    risks: ['Frosts damaging tender growth', 'Waterlogging in wet pockets'],
    avoid: ['Leaving tender seedlings unprotected outdoors'],
  },
  June: {
    focus: 'Winter quietens the garden, so focus on maintaining crops, improving soil, and planning spring.',
    tasks: ['Check frost covers and winter greens', 'Prune dormant fruit trees', 'Order seeds for spring'],
    risks: ['Frost burn on exposed leaves', 'Compost slowing in cold soil'],
    avoid: ['Major transplanting of heat-loving crops'],
  },
  July: {
    focus: 'Midwinter brings limited outdoor growth, so maintenance, planning, and protected crops matter most.',
    tasks: ['Plan spring layout and crop rotation', 'Maintain greenhouse or indoor starts', 'Inspect overwintering plants for damage'],
    risks: ['Repeated frosts', 'Rodents in mulch and compost'],
    avoid: ['Overwatering dormant beds'],
  },
  August: {
    focus: 'Late winter is for bed prep and starting slow crops indoors before the spring rush.',
    tasks: ['Start seedlings indoors or under cover', 'Clean and prepare spring beds', 'Last bare-root tree plantings'],
    risks: ['Late frosts after warm snaps', 'Damping-off on crowded seedlings'],
    avoid: ['Planting tomatoes outdoors before frost risk drops'],
  },
  September: {
    focus: 'Early spring sowing can begin, but late frosts are still possible in cool areas.',
    tasks: ['Direct sow peas, broad beans, and early brassicas', 'Harden off seedlings gradually', 'Protect young plants on cold nights'],
    risks: ['Late frosts', 'Slow soil warming'],
    avoid: ['Rushing tender summer crops outdoors'],
  },
  October: {
    focus: 'Spring planting peaks as soil warms, with potatoes, onions, and leafy greens leading the way.',
    tasks: ['Plant potatoes, onions, and leafy greens', 'Begin light feeding on active crops', 'Stake climbers early'],
    risks: ['Snails on new growth', 'Nutrient lock-up in cold wet soil'],
    avoid: ['Deep cultivation when soil is waterlogged'],
  },
  November: {
    focus: 'Late spring is the time to plant summer crops, keeping frost cover ready just in case.',
    tasks: ['Plant tomatoes and beans (under cover if needed)', 'Increase watering as growth speeds up', 'Scout for early aphids'],
    risks: ['Late frosts on warm nights followed by cold', 'Wind on tall seedlings'],
    avoid: ['Removing frost protection too early'],
  },
  December: {
    focus: 'Early summer brings strong cool-climate growth, so harvest often and stay ahead of pests.',
    tasks: ['Harvest often to keep plants productive', 'Mulch and water before hot days', 'Monitor pests on fruiting crops'],
    risks: ['Heat spikes on young plantings', 'Powdery mildew in humid spells'],
    avoid: ['Letting plants go to seed without replanting'],
  },
}
