import type { MonthGuidance } from './month-guidance-types'

/** Cold AU climates (alpine, high country, frost-prone inland). */
export const COLD_MONTH_GUIDANCE: Record<string, MonthGuidance> = {
  January: {
    focus:
      'Mid-summer growth is short-lived in cold areas; harvest often and protect tender crops from heat spikes.',
    tasks: ['Harvest roots and greens before they bolt', 'Water deeply on warm days', 'Sow only quick greens for late pickings'],
    risks: ['Heat waves after cool nights', 'Pests on stressed plants'],
    avoid: ['Planting frost-tender crops outdoors without cover'],
  },
  February: {
    focus: 'Late summer is the pivot to autumn; clear tired beds and plan for a narrow frost-free window.',
    tasks: ['Sow brassicas and hardy greens for autumn', 'Remove spent summer crops', 'Mulch to keep soil moisture stable'],
    risks: ['Bolting in brief heat', 'Dry windy sites'],
    avoid: ['Leaving tender crops exposed when nights cool quickly'],
  },
  March: {
    focus: 'Autumn planting must establish before cold returns; prioritise hardy crops and frost protection.',
    tasks: ['Sow peas, broad beans, and leafy greens', 'Plant garlic and overwintering onions where suited', 'Cover seedlings on frosty nights'],
    risks: ['Early frosts', 'Slugs in damp weather'],
    avoid: ['Outdoor tomatoes and capsicum without protection'],
  },
  April: {
    focus: 'Main autumn planting month; many warm-season crops are finished outdoors in cold regions.',
    tasks: ['Plant broad beans, peas, and spinach', 'Mulch beds before repeated frosts', 'Harvest remaining protected summer crops'],
    risks: ['Hard frosts', 'Slow germination in cold soil'],
    avoid: ['Bare-rooting tender seedlings into open ground'],
  },
  May: {
    focus: 'Winter approaches fast; focus on frost-hardy crops and bed protection.',
    tasks: ['Plant garlic, leeks, and hardy brassicas', 'Fleece or cloche tender rows', 'Improve soil on empty beds'],
    risks: ['Repeated frosts', 'Waterlogging in wet pockets'],
    avoid: ['Outdoor capsicum, eggplant, and unprotected tomatoes'],
  },
  June: {
    focus: 'Outdoor growth slows; maintain overwintering crops and plan spring under cover.',
    tasks: ['Check frost covers and winter greens', 'Order seeds for spring', 'Prune dormant fruit where appropriate'],
    risks: ['Severe frosts', 'Rodents in mulch'],
    avoid: ['Major transplanting of heat-loving crops'],
  },
  July: {
    focus: 'Midwinter is for maintenance, protected starts, and rotation planning.',
    tasks: ['Start slow crops indoors or in a greenhouse', 'Inspect overwintering plants', 'Prepare beds for late-winter sowing'],
    risks: ['Extended frost periods', 'Damping-off on crowded seedlings'],
    avoid: ['Overwatering frozen or saturated beds'],
  },
  August: {
    focus: 'Late winter prep; soil may stay cold, so protected sowing beats rushing outdoors.',
    tasks: ['Start peas and brassicas under cover', 'Prepare spring beds when workable', 'Last bare-root tree plantings'],
    risks: ['Late frosts after mild spells', 'Cold soil delaying germination'],
    avoid: ['Planting tomatoes outdoors before frost risk drops'],
  },
  September: {
    focus: 'Spring begins cautiously; late frosts can still damage new growth in cold areas.',
    tasks: ['Direct sow peas, broad beans, and hardy greens', 'Harden off seedlings gradually', 'Keep frost cloth ready every night'],
    risks: ['Late frosts', 'Slow soil warming'],
    avoid: ['Planting frost-tender crops outdoors without protection'],
  },
  October: {
    focus: 'Core spring planting window; potatoes and hardy greens lead, with tender crops only under cover.',
    tasks: ['Plant potatoes and onions', 'Sow carrots, beetroot, and leafy greens', 'Move tomatoes to protected beds only when safe'],
    risks: ['Snails on new growth', 'Frost on clear calm nights'],
    avoid: ['Removing frost protection too early'],
  },
  November: {
    focus: 'Late spring is brief; plant summer crops under cover and watch for surprise frosts.',
    tasks: ['Plant tomatoes and beans in protected spots', 'Increase watering as growth picks up', 'Scout for early aphids'],
    risks: ['Late frosts after warm days', 'Wind on exposed sites'],
    avoid: ['Bare planting of frost-tender crops'],
  },
  December: {
    focus: 'Early summer harvests are precious; stay ahead of pests and protect from heat and frost swings.',
    tasks: ['Harvest regularly to keep plants productive', 'Mulch and water before hot spells', 'Maintain covers on tender crops'],
    risks: ['Heat spikes', 'Unexpected cold nights in valleys'],
    avoid: ['Letting soil dry out on windy sites'],
  },
}
