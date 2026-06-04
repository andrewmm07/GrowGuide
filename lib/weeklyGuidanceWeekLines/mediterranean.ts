import type { SouthernSeason } from '@/lib/seasonDisplay'

/**
 * Fourteen unique dashboard week lines for Mediterranean climates
 * (dry summer, rainy winter — Adelaide, Perth, much of southern WA/SA).
 */
export const MEDITERRANEAN_WEEK_LINES: Record<
  SouthernSeason,
  readonly [
    string, string, string, string, string, string, string, string,
    string, string, string, string, string, string,
  ]
> = {
  Summer: [
    'Dry summer opens: deep water at dawn, thick mulch, and protect fruiting crops from heat stress.',
    'Harvest tomatoes, capsicum, and beans at peak; containers and shallow beds dry out first.',
    'Shade young seedlings on hot afternoons; pause new plant-outs until a cool spell or reliable irrigation.',
    'Focus water on crops already setting fruit; bare soil loses moisture quickly in the long dry.',
    'Check drip lines and mulch depth; avoid midday watering that steams roots in hot soil.',
    'Succession sow quick greens only where you can shade and water consistently through heat.',
    'Clear spent summer crops and compost; hold major bed prep until autumn rain returns.',
    'Reduce feeding on woody plants; keep steady moisture on citrus and established fruit trees.',
    'Late dry summer: prioritise harvest and mulch over new sowings in exposed beds.',
    'Plan autumn planting lists while growth slows; store seed in a cool, dry place.',
    'Protect remaining fruit from sun scald after heat spikes; pick before quality drops.',
    'Note pest patterns and irrigation weak spots before the winter growing window opens.',
    'Extended dry spell: consolidate water on your best beds and let marginal corners rest.',
    'Last dry-summer beat: deep water fruiting crops, refresh mulch, and queue garlic for when rain returns.',
  ],
  Autumn: [
    'Autumn rain returns: refresh beds and sow leafy greens before winter planting peaks.',
    'Plant garlic and shallots while soil still holds warmth from summer.',
    'Sow peas and broad beans; mulch rows after watering in.',
    'First reliable rains: improve drainage on heavy soil and clear spent summer crops.',
    'Harvest remaining heat lovers before cooler, wetter weeks slow ripening.',
    'Green-manure empty beds you will rest and keep heavy foot traffic off recently soaked soil.',
    'Establish brassicas and alliums while moisture is dependable.',
    'Watch for snails in damp beds; keep airflow around new seedlings.',
    'Growth is slowing: finish planting plans and ease back on nitrogen on woody plants.',
    'Prune deciduous fruit once leaves fall and the tree is dormant.',
    'Protect late tender crops if a cold snap follows rain.',
    'Close autumn with beds mulched and drainage paths clear.',
    'Extended autumn: tuck in last alliums and use mild days for bed recovery between showers.',
    'Last autumn beat: favour hardy greens over tender plant-outs as nights cool.',
  ],
  Winter: [
    'Main growing season: winter rain supports brassicas, peas, garlic, and leafy greens.',
    'Sow and transplant hardy crops while soil moisture is reliable; growth is strong in mild winters.',
    'Keep brassica rows weed-free and ventilated; snails thrive in damp conditions.',
    'Plant potatoes and broad beans in well-drained rows; avoid waterlogging on heavy soil.',
    'Harvest winter greens steadily to encourage continued leaf production.',
    'Start tomatoes and capsicum under cover for spring transplanting before the dry heat.',
    'Light feeding supports leafy crops; citrus benefits from a balanced winter feed.',
    'Improve wet beds with compost between showers; stay off sodden soil.',
    'Late winter: prepare summer crop beds and check irrigation before the dry spell.',
    'Harden off seedlings on mild afternoons; frost risk is often lower than inland frost zones.',
    'Mulch after watering in new rows to hold moisture through dry spring previews.',
    'Finalise spring layout while cool-season crops are still productive.',
    'Winter lingers wet: clear drains, ventilate covered greens on dry afternoons, and order seed.',
    'Late winter beat: transplant hardy crops first; hold tender summer crops under cover until soil warms.',
  ],
  Spring: [
    'Spring warmth returns: transplant summer crops and increase feeding as growth accelerates.',
    'Soil is warming fast; establish tomatoes, capsicum, and beans before the long dry ahead.',
    'Finish summer plantings and mulch deeply; irrigation rhythm matters as rain becomes less reliable.',
    'Build shade structures and check drip lines before the first sustained heat.',
    'Sow corn, beans, and cucurbits where frost risk has passed and water is assured.',
    'Harden off seedlings gradually; keep cover ready for late cold nights.',
    'Harvest winter greens before they bolt; refresh beds for summer crops.',
    'Increase watering as temperatures climb; mulch warm beds heavily.',
    'Scout for aphids and fruit fly as soft growth accelerates.',
    'Expand summer plantings in the best-drained beds; leave heavy wet corners for later.',
    'Feed fruiting crops lightly; avoid lush nitrogen on heat-loving crops before dry weather.',
    'Remove frost covers in stages as nights settle; stake climbers early.',
    'Long spring: stagger tender plant-out and top up mulch before summer dryness sets in.',
    'Final spring beat: secure irrigation, harvest peas and broad beans, and prepare for dry summer care.',
  ],
}
