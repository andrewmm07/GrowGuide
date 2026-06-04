/** Rich month overview prose — restored from legacy planting calendar. */
import type { Climate } from '@/lib/types/location'
import { STATE_ALIASES, type StateAlias, type StateName } from './constants'
import { getMonthGuidance, monthGuidanceToRichOverview } from './month-guidance'

export const DEFAULT_RICH_MONTH_SUMMARIES: { [key: string]: string } = {
  'January': 'The heat is intense, and dry conditions necessitate deep watering. Mulch heavily to conserve moisture. Check for pests, as they thrive in warm weather. Provide extra water and shade as needed during heatwaves.',
  'February': 'Plants are still growing well, but the heat persists. Water deeply, especially on hotter days, and keep an eye out for pests and fungal diseases like powdery mildew. It\'s time to start planning autumn plantings and clearing out any struggling summer crops.',
  'March': 'The days are cooling, but the soil remains warm—perfect for planting garlic, onions, and leafy greens. Remove any remaining summer crops and tidy up garden beds. Start mulching for moisture retention and weed control.',
  'April': 'Shorter days and cooler temperatures signal the start of autumn. Plant brassicas, broad beans, and peas. Collect fallen leaves for composting and watch for slugs, as damp conditions encourage them. Prepare for early frosts in colder areas.',
  'May': 'The first frosts are approaching. Protect tender plants, mulch heavily, and prune dormant fruit trees. Cover young seedlings to shield them from the cold. This is a good time to fertilize citrus trees before winter dormancy.',
  'June': 'A quieter period in the garden. Focus on soil improvement, structural projects, and winter pruning. Keep composting, and start planning for spring plantings. If space allows, consider a greenhouse or cold frame for winter crops.',
  'July': 'Minimal active growth, but pruning and composting remain key tasks. Plan spring plantings and order seeds early to secure the best varieties. Check for overwintering pests hiding in garden beds or under bark.',
  'August': 'As temperatures slowly rise, prepare for spring by starting seeds indoors. Plant bare-root trees and shrubs. Finish pruning fruit trees before new growth starts. Monitor for early pest activity as the season shifts.',
  'September': 'Growth picks up as the soil warms. Harden off seedlings before transplanting outdoors. Keep an eye out for late frosts and protect young plants as needed. Start preparing garden beds for the busy season ahead.',
  'October': 'The main planting month for summer crops. Get tomatoes, zucchinis, and beans in the ground. Ensure proper staking for climbing plants and mulch well to retain moisture. Regularly check for early signs of pests.',
  'November': 'Warmer, drier conditions mean watering is critical. Stay on top of weeding and pest control. If summer vegetables aren\'t in yet, plant them now. Keep feeding fruiting plants to support strong yields.',
  'December': 'Peak growing and harvesting season. Water deeply, watch for fungal diseases, and stay ahead of weeds. Enjoy the rewards of your hard work and keep harvesting to encourage continued production.'
}

// Add new state-specific summaries
// Tasmania-specific summaries for cool temperate climate
export const TASMANIA_RICH_MONTH_SUMMARIES: { [key: string]: string } = {
  'January': 'Mild summer conditions perfect for growing. Focus on leafy greens, root vegetables, and peas. Water early morning. Protect from strong winds. Harvest summer crops regularly.',
  'February': 'Late summer harvesting continues. Plant autumn crops like brassicas and root vegetables. Monitor water needs. Start preparing winter beds. Good time for green manure crops.',
  'March': 'Autumn planting season begins. Soil still warm enough for good growth. Plant winter vegetables like kale, broccoli, and carrots. Ideal time for green manure crops.',
  'April': 'Main autumn planting month. Soil preparation for winter crops essential. Last chance for warm season vegetables. Plant broad beans and peas. Add compost to beds.',
  'May': 'Early winter preparations. Focus on frost-hardy vegetables like Brussels sprouts and leeks. Add protection for tender plants. Good time for soil improvement.',
  'June': 'Winter dormancy begins. Maintain winter crops with protection. Focus on soil improvement and planning. Limited outdoor growing. Good time for greenhouse crops.',
  'July': 'Peak winter season. Limited outdoor growing. Good time for planning, maintenance, and indoor seed starting. Maintain winter crops. Check for frost damage.',
  'August': 'Late winter preparation for spring. Start seedlings indoors or in greenhouse. Clean and prepare beds. Last chance for bare-root plantings. Monitor for early pests.',
  'September': 'Early spring plantings begin. Soil warming up slowly. Plant peas, broad beans, and early brassicas. Watch for late frosts. Protect young seedlings.',
  'October': 'Main spring planting month. Soil temperature rising. Good growth conditions for most vegetables. Plant potatoes, onions, and leafy greens. Regular feeding begins.',
  'November': 'Late spring plantings continue. Increasing temperatures support good growth. Regular watering needed. Plant summer crops like tomatoes and beans. Monitor for pests.',
  'December': 'Early summer season. Peak growing conditions for cool climate vegetables. Regular maintenance important. Harvest regularly. Watch for pest activity.'
};

export const RICH_STATE_MONTH_SUMMARIES: { [key: string]: Record<string, string> } = {
  // Tasmania
  Tasmania: TASMANIA_RICH_MONTH_SUMMARIES,
  TAS: TASMANIA_RICH_MONTH_SUMMARIES,
  
  // Victoria
  'VIC': {
    // Copy all Victoria summaries here
    'January': 'Hot and dry conditions require vigilant watering. Focus on harvesting tomatoes, beans, and summer crops. Protect plants from scorching with shade cloth. Best time to sow carrots, beetroot, and plant brassica seedlings for autumn.',
    // ... copy all other months
  },
  
  // New South Wales
  'New South Wales': {
    'January': 'Hot summer conditions require morning watering and afternoon shade. Monitor moisture levels and maintain mulch. Watch for fruit fly infestations in stone fruit. Bushfrire risk is high, so clear dry vegetation.',
    'February': 'Late summer brings continued warmth. Humidity can cause mildew and rust - so be watchful. Start planning autumn garden. Plant leafy greens in partial shade. Keep up deep watering schedule.',
    'March': 'Autumn approaches with milder temperatures. Perfect for planting brassicas and root vegetables. Harvest the last of summer crops and prepare for colder nights. Begin preparing winter beds.',
    'April': 'Cooler autumn weather is ideal for leafy greens. Plant peas, broad beans, and brassicas. Watch for early frosts in inland areas. Add compost to beds.',
    'May': 'Cool season growing begins. Plant garlic, onions, and winter greens. Protect tender plants from frost. Good time for soil improvement.',
    'June': 'Winter arrives. Focus on frost-hardy vegetables. Plant bare-root trees and shrubs. Maintain winter crops and add protection where needed.',
    'July': 'Coldest month. Plan spring garden and order seeds. Continue winter harvests. Prune deciduous trees. Check frost protection.',
    'August': 'Late winter preparation for spring. Start seeds indoors. Plant potatoes and asparagus. Last chance for bare-root plantings.',
    'September': 'Spring begins. Plant peas and early vegetables. Prepare beds for summer crops. Watch for late frosts. Start succession planting.',
    'October': 'Warming weather perfect for planting. Get summer crops in the ground. Regular feeding starts. Monitor for pests as they become active.',
    'November': 'Early summer plantings continue. Succession sow heat-loving crops. Increase watering as temperatures rise. Start mulching heavily.',
    'December': 'Peak growing season. Regular harvesting essential. Water deeply in early morning. Watch for pests and diseases. Plant for autumn crops.'
  },
  'NSW': {
    'January': 'Hot summer conditions require morning watering and afternoon shade. Focus on heat-loving crops like tomatoes, capsicums, and eggplants. Monitor moisture levels and maintain mulch. Watch for pests in the heat.',
    'February': 'Late summer brings continued warmth. Harvest summer crops regularly. Start planning autumn garden. Plant leafy greens in partial shade. Keep up deep watering schedule.',
    'March': 'Autumn approaches with milder temperatures. Perfect for planting brassicas and root vegetables. Last chance for warm season crops. Begin preparing winter beds.',
    'April': 'Cooler autumn weather ideal for leafy greens. Plant peas, broad beans, and brassicas. Watch for early frosts in inland areas. Add compost to beds.',
    'May': 'Cool season growing begins. Plant garlic, onions, and winter greens. Protect tender plants from frost. Good time for soil improvement.',
    'June': 'Winter arrives. Focus on frost-hardy vegetables. Plant bare-root trees and shrubs. Maintain winter crops and add protection where needed.',
    'July': 'Coldest month. Plan spring garden and order seeds. Continue winter harvests. Prune deciduous trees. Check frost protection.',
    'August': 'Late winter preparation for spring. Start seeds indoors. Plant potatoes and asparagus. Last chance for bare-root plantings.',
    'September': 'Spring begins. Plant peas and early vegetables. Prepare beds for summer crops. Watch for late frosts. Start succession planting.',
    'October': 'Warming weather perfect for planting. Get summer crops in the ground. Regular feeding starts. Monitor for pests as they become active.',
    'November': 'Early summer plantings continue. Succession sow heat-loving crops. Increase watering as temperatures rise. Start mulching heavily.',
    'December': 'Peak growing season. Regular harvesting essential. Water deeply in early morning. Watch for pests and diseases. Plant for autumn crops.'
  },
  
  // South Australia
  'South Australia': {
    'January': 'Hot Mediterranean summer requires careful water management. Focus on heat-tolerant varieties. Early morning watering essential. Protect plants from afternoon sun and hot winds.',
    'February': 'Peak summer heat continues. Maintain regular deep watering. Harvest summer crops early morning. Heavy mulching crucial. Watch for heat stress in plants.',
    'March': 'Early autumn brings relief from heat. Perfect time for Mediterranean vegetables. Plant root crops and leafy greens. Prepare for cooler nights.',
    'April': 'Mild autumn conditions ideal for planting. Focus on brassicas and root vegetables. Add compost to beds. Watch for irregular rainfall patterns.',
    'May': 'Late autumn cooling begins. Plant garlic and onions. Good time for leafy greens. Prepare for first frosts in inland areas.',
    'June': 'Winter arrives with increased rainfall. Focus on frost-hardy vegetables. Plant bare-root trees. Watch for fungal issues in wet conditions.',
    'July': 'Peak winter season. Limited planting options. Maintain winter crops. Plan for spring. Protect sensitive plants from frost.',
    'August': 'Late winter brings warming soil. Start seeds indoors. Plant potatoes and onions. Last chance for bare-root plantings.',
    'September': 'Spring arrives with variable weather. Plant warm season crops. Watch for late frosts. Begin regular feeding program.',
    'October': 'Mid-spring ideal for planting. Soil warming up nicely. Monitor soil moisture as temperatures rise. Watch for pest activity.',
    'November': 'Early summer approaches. Plant heat-tolerant varieties. Increase watering schedule. Start heavy mulching. Monitor for pests.',
    'December': 'Summer begins in earnest. Focus on water management. Early morning care essential. Watch for heat stress. Plan autumn crops.'
  },
  'SA': {
    // Copy exact same entries as South Australia
    'January': 'Hot Mediterranean summer requires careful water management. Focus on heat-tolerant varieties. Early morning watering essential. Protect plants from afternoon sun and hot winds.',
    'February': 'Peak summer heat continues. Maintain regular deep watering. Harvest summer crops early morning. Heavy mulching crucial. Watch for heat stress in plants.',
    'March': 'Early autumn brings relief from heat. Perfect time for Mediterranean vegetables. Plant root crops and leafy greens. Prepare for cooler nights.',
    'April': 'Mild autumn conditions ideal for planting. Focus on brassicas and root vegetables. Add compost to beds. Watch for irregular rainfall patterns.',
    'May': 'Late autumn cooling begins. Plant garlic and onions. Good time for leafy greens. Prepare for first frosts in inland areas.',
    'June': 'Winter arrives with increased rainfall. Focus on frost-hardy vegetables. Plant bare-root trees. Watch for fungal issues in wet conditions.',
    'July': 'Peak winter season. Limited planting options. Maintain winter crops. Plan for spring. Protect sensitive plants from frost.',
    'August': 'Late winter brings warming soil. Start seeds indoors. Plant potatoes and onions. Last chance for bare-root plantings.',
    'September': 'Spring arrives with variable weather. Plant warm season crops. Watch for late frosts. Begin regular feeding program.',
    'October': 'Mid-spring ideal for planting. Soil warming up nicely. Monitor soil moisture as temperatures rise. Watch for pest activity.',
    'November': 'Early summer approaches. Plant heat-tolerant varieties. Increase watering schedule. Start heavy mulching. Monitor for pests.',
    'December': 'Summer begins in earnest. Focus on water management. Early morning care essential. Watch for heat stress. Plan autumn crops.'
  },
  
  // Western Australia
  
  // Northern Territory
  'Western Australia': {
    'January': 'Mediterranean climate at its peak. Early morning watering essential. Focus on heat-tolerant varieties and sun protection. Maintain heavy mulch. Monitor coastal winds.',
    'February': 'Still hot and dry. Continue summer crop care. Start planning autumn garden. Deep watering crucial. Watch for pests seeking moisture.',
    'March': 'Temperatures begin moderating. Good time for autumn plantings. Add compost to beds. Plant root vegetables and leafy greens.',
    'April': 'Ideal autumn growing conditions. Plant peas and brassicas. Watch for irregular rainfall. Good time for soil improvement.',
    'May': 'Cooler weather and winter rains begin. Plant root crops and winter vegetables. Add organic matter to soil. Check drainage.',
    'June': 'Winter rains continue. Focus on Mediterranean herbs and vegetables. Plant bare-root trees. Watch for fungal issues.',
    'July': 'Peak winter season. Maintain winter crops. Plan for spring. Consider frost protection in inland areas. Check plant supports.',
    'August': 'Late winter plantings continue. Start spring preparations. Plant potatoes and onions. Watch for late frosts inland.',
    'September': 'Spring arrives with wildflowers. Plant warm season crops. Watch for variable weather. Start regular feeding.',
    'October': 'Warming up quickly. Plant heat-tolerant varieties. Increase watering. Monitor for spring pests. Add shade protection.',
    'November': 'Early summer begins. Focus on water management. Plant drought-tolerant varieties. Mulch heavily. Watch for heat stress.',
    'December': 'Hot, dry conditions dominate. Morning watering crucial. Harvest regularly. Protect plants from harsh sun. Monitor moisture levels.'
  },
  'WA': {
    'January': 'Mediterranean climate at its peak. Early morning watering essential. Focus on heat-tolerant varieties and sun protection. Maintain heavy mulch. Monitor coastal winds.',
    'February': 'Still hot and dry. Continue summer crop care. Start planning autumn garden. Deep watering crucial. Watch for pests seeking moisture.',
    'March': 'Temperatures begin moderating. Good time for autumn plantings. Add compost to beds. Plant root vegetables and leafy greens.',
    'April': 'Ideal autumn growing conditions. Plant peas and brassicas. Watch for irregular rainfall. Good time for soil improvement.',
    'May': 'Cooler weather and winter rains begin. Plant root crops and winter vegetables. Add organic matter to soil. Check drainage.',
    'June': 'Winter rains continue. Focus on Mediterranean herbs and vegetables. Plant bare-root trees. Watch for fungal issues.',
    'July': 'Peak winter season. Maintain winter crops. Plan for spring. Consider frost protection in inland areas. Check plant supports.',
    'August': 'Late winter plantings continue. Start spring preparations. Plant potatoes and onions. Watch for late frosts inland.',
    'September': 'Spring arrives with wildflowers. Plant warm season crops. Watch for variable weather. Start regular feeding.',
    'October': 'Warming up quickly. Plant heat-tolerant varieties. Increase watering. Monitor for spring pests. Add shade protection.',
    'November': 'Early summer begins. Focus on water management. Plant drought-tolerant varieties. Mulch heavily. Watch for heat stress.',
    'December': 'Hot, dry conditions dominate. Morning watering crucial. Harvest regularly. Protect plants from harsh sun. Monitor moisture levels.'
  },
  
  'Northern Territory': {
    'January': 'Peak wet season. Focus on tropical vegetables. Monitor drainage. Watch for fungal diseases. Plant above-ground crops.',
    'February': 'Heavy rains continue. Plant tropical varieties. Ensure good air circulation. Check supports in strong winds.',
    'March': 'Late wet season. Begin dry season preparation. Plant root crops. Monitor soil moisture. Check irrigation systems.',
    'April': 'Transition to dry season. Perfect growing conditions. Plant herbs and vegetables. Regular watering important.',
    'May': 'Early dry season. Excellent growing weather. Plant most vegetables. Watch for pest insects. Maintain mulch.',
    'June': 'Dry season peak. Focus on regular watering. Plant European vegetables. Monitor for water stress. Check soil moisture.',
    'July': 'Cool, dry conditions ideal for growing. Plant root crops and greens. Maintain steady watering. Watch for insect pests.',
    'August': 'Last month of cool weather. Prepare for build-up. Plant heat-tolerant varieties. Increase mulching.',
    'September': 'Build-up begins. Focus on quick-growing crops. Monitor water needs. Prepare for wet season.',
    'October': 'Hot and humid build-up. Plant tropical varieties. Watch for early storms. Ensure good drainage.',
    'November': 'Early wet season. Plant wet-tolerant varieties. Monitor drainage. Watch for fungal issues.',
    'December': 'Wet season intensifies. Focus on above-ground crops. Watch for storm damage. Maintain good air flow.'
  },
  'Queensland': {
    'January': 'Tropical wet season in full swing. Focus on heat-tolerant crops like snake beans, okra, and sweet potatoes. Watch for fungal issues in high humidity. Mulch heavily to retain moisture and suppress weeds.',
    'February': 'Continue wet season plantings. Good time for tropical fruits and Asian greens. Monitor drainage in heavy rains. Plant sweet corn, pumpkins, and melons.',
    'March': 'Last chance for wet season crops. Begin preparing for dry season vegetables. Plant root crops and leafy greens. Check irrigation systems before dry season.',
    'April': 'Transitioning to dry season. Perfect time for herbs and Mediterranean vegetables. Plant tomatoes, capsicums, and eggplants. Monitor soil moisture as rains decrease.',
    'May': 'Dry season begins. Excellent growing conditions for most vegetables. Plant brassicas, root crops, and salad greens. Regular watering becomes crucial.',
    'June': 'Cool, dry conditions ideal for European vegetables. Plant peas, broad beans, and root crops. Watch for pest insects seeking water sources.',
    'July': 'Peak dry season. Focus on drought-tolerant herbs and vegetables. Maintain steady watering. Good time for radishes, carrots, and beetroot.',
    'August': 'Temperatures begin to rise. Start preparing for wet season crops. Plant heat-tolerant varieties. Increase mulching to retain moisture.',
    'September': 'Build-up to wet season begins. Plant tropical vegetables like cucumber and beans. Watch for early storms. Prepare garden beds.',
    'October': 'Hot and humid conditions return. Focus on quick-growing crops. Plant sweet potatoes and tropical greens. Monitor for pest outbreaks.',
    'November': 'Early wet season. Plant heat and moisture tolerant varieties. Watch for fungal diseases. Ensure good drainage in garden beds.',
    'December': 'Wet season intensifies. Focus on above-ground crops. Plant okra, snake beans, and Asian greens. Monitor plant health in high humidity.'
  },
  'QLD': {
    // Copy exact same entries as Queensland
    'January': 'Tropical wet season in full swing. Focus on heat-tolerant crops like snake beans, okra, and sweet potatoes. Watch for fungal issues in high humidity. Mulch heavily to retain moisture and suppress weeds.',
    'February': 'Continue wet season plantings. Good time for tropical fruits and Asian greens. Monitor drainage in heavy rains. Plant sweet corn, pumpkins, and melons.',
    'March': 'Last chance for wet season crops. Begin preparing for dry season vegetables. Plant root crops and leafy greens. Check irrigation systems before dry season.',
    'April': 'Transitioning to dry season. Perfect time for herbs and Mediterranean vegetables. Plant tomatoes, capsicums, and eggplants. Monitor soil moisture as rains decrease.',
    'May': 'Dry season begins. Excellent growing conditions for most vegetables. Plant brassicas, root crops, and salad greens. Regular watering becomes crucial.',
    'June': 'Cool, dry conditions ideal for European vegetables. Plant peas, broad beans, and root crops. Watch for pest insects seeking water sources.',
    'July': 'Peak dry season. Focus on drought-tolerant herbs and vegetables. Maintain steady watering. Good time for radishes, carrots, and beetroot.',
    'August': 'Temperatures begin to rise. Start preparing for wet season crops. Plant heat-tolerant varieties. Increase mulching to retain moisture.',
    'September': 'Build-up to wet season begins. Plant tropical vegetables like cucumber and beans. Watch for early storms. Prepare garden beds.',
    'October': 'Hot and humid conditions return. Focus on quick-growing crops. Plant sweet potatoes and tropical greens. Monitor for pest outbreaks.',
    'November': 'Early wet season. Plant heat and moisture tolerant varieties. Watch for fungal diseases. Ensure good drainage in garden beds.',
    'December': 'Wet season intensifies. Focus on above-ground crops. Plant okra, snake beans, and Asian greens. Monitor plant health in high humidity.'
  },

  'Australian Capital Territory': {
    'January': 'Hot summer conditions require regular watering. Focus on heat-tolerant vegetables. Protect plants from afternoon sun. Maintain mulch layers. Monitor for pests.',
    'February': 'Late summer heat continues. Harvest summer crops regularly. Begin autumn preparations. Plant leafy greens in partial shade. Deep watering essential.',
    'March': 'Mild autumn conditions begin. Excellent time for planting brassicas and root vegetables. Last chance for warm season crops. Prepare winter beds.',
    'April': 'Cool autumn weather ideal for planting. Focus on peas, broad beans, and brassicas. Watch for early frosts. Add compost to beds.',
    'May': 'Late autumn preparation for winter. Plant garlic and onions. Protect tender plants from frost. Good time for soil improvement.',
    'June': 'Cold winter begins. Focus on frost-hardy vegetables. Plant bare-root trees. Maintain winter crops. Use frost protection.',
    'July': 'Peak winter month. Plan spring garden. Continue winter harvests. Prune deciduous trees. Check frost protection systems.',
    'August': 'Late winter activities. Start seeds indoors. Plant potatoes and asparagus. Last chance for bare-root plantings.',
    'September': 'Early spring arrives. Plant peas and early vegetables. Prepare for warm season crops. Watch for late frosts.',
    'October': 'Spring planting season peaks. Direct sow warm season crops. Regular feeding begins. Monitor for pests.',
    'November': 'Early summer approaches. Plant heat-loving crops. Increase watering schedule. Start mulching heavily.',
    'December': 'Summer gardening begins. Regular harvesting essential. Water deeply in morning. Watch for pests and diseases.'
  },
  'ACT': {
    // Copy exact same entries as Australian Capital Territory
    'January': 'Hot summer conditions require regular watering. Focus on heat-tolerant vegetables. Protect plants from afternoon sun. Maintain mulch layers. Monitor for pests.',
    'February': 'Late summer heat continues. Harvest summer crops regularly. Begin autumn preparations. Plant leafy greens in partial shade. Deep watering essential.',
    'March': 'Mild autumn conditions begin. Excellent time for planting brassicas and root vegetables. Last chance for warm season crops. Prepare winter beds.',
    'April': 'Cool autumn weather ideal for planting. Focus on peas, broad beans, and brassicas. Watch for early frosts. Add compost to beds.',
    'May': 'Late autumn preparation for winter. Plant garlic and onions. Protect tender plants from frost. Good time for soil improvement.',
    'June': 'Cold winter begins. Focus on frost-hardy vegetables. Plant bare-root trees. Maintain winter crops. Use frost protection.',
    'July': 'Peak winter month. Plan spring garden. Continue winter harvests. Prune deciduous trees. Check frost protection systems.',
    'August': 'Late winter activities. Start seeds indoors. Plant potatoes and asparagus. Last chance for bare-root plantings.',
    'September': 'Early spring arrives. Plant peas and early vegetables. Prepare for warm season crops. Watch for late frosts.',
    'October': 'Spring planting season peaks. Direct sow warm season crops. Regular feeding begins. Monitor for pests.',
    'November': 'Early summer approaches. Plant heat-loving crops. Increase watering schedule. Start mulching heavily.',
    'December': 'Summer gardening begins. Regular harvesting essential. Water deeply in morning. Watch for pests and diseases.'
  },
  
  'Victoria': {
    'January': 'Hot summer conditions require careful water management. Focus on heat-tolerant vegetables. Morning watering essential. Watch for sun damage and pests. Maintain thick mulch.',
    'February': 'Late summer heat continues. Monitor water needs closely. Harvest summer crops regularly. Begin planning autumn garden. Plant leafy greens in partial shade.',
    'March': 'Autumn brings milder temperatures. Perfect time for planting brassicas and root vegetables. Last chance for warm season crops. Prepare winter beds with compost.',
    'April': 'Cool autumn weather ideal for leafy greens. Plant peas, broad beans, and brassicas. Watch for early frosts in elevated areas. Add organic matter to soil.',
    'May': 'Late autumn preparation for winter. Plant garlic and onions. Protect tender plants from frost. Good time for soil improvement and composting.',
    'June': 'Winter arrives with frequent frosts. Focus on frost-hardy vegetables. Plant bare-root trees. Maintain winter crops with protection where needed.',
    'July': 'Coldest month requires careful plant protection. Plan spring garden. Continue winter harvests. Prune deciduous trees. Check frost protection.',
    'August': 'Late winter brings early signs of spring. Start seeds indoors. Plant potatoes and asparagus. Last chance for bare-root plantings.',
    'September': 'Spring begins but watch for late frosts. Plant early vegetables. Prepare beds for summer crops. Begin regular feeding program.',
    'October': 'Spring planting season in full swing. Direct sow warm season crops. Regular feeding important. Monitor for increasing pest activity.',
    'November': 'Early summer approaches. Plant heat-loving crops. Increase watering schedule. Start mulching heavily. Watch for pest outbreaks.',
    'December': 'Summer gardening begins. Regular harvesting essential. Water deeply in early morning. Watch for pests and diseases. Plan autumn crops.'
  }
}

function capitalizeMonth(month: string): string {
  const lower = month.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

function resolveStateKeys(state: string): string[] {
  const canonicalName = (
    state in STATE_ALIASES ? STATE_ALIASES[state as StateAlias] : state
  ) as StateName
  return [canonicalName, state, state.toUpperCase()]
}

/** Full paragraph overview — climate-first when climate is known, else state legacy prose. */
export function getRichMonthOverview(state: string, month: string, climate?: Climate): string {
  const cap = capitalizeMonth(month)
  if (climate) {
    const rich = monthGuidanceToRichOverview(getMonthGuidance(climate, state, cap))
    if (rich) return rich
  }
  for (const key of resolveStateKeys(state)) {
    const summaries = RICH_STATE_MONTH_SUMMARIES[key]
    if (summaries?.[cap]) return summaries[cap]
  }
  return DEFAULT_RICH_MONTH_SUMMARIES[cap] ?? ''
}
