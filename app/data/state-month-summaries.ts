import { ClimateZone } from '../types/location';

// Define types for our summaries
interface MonthSummaries {
  [month: string]: string;
}

interface StateSummaries {
  [state: string]: MonthSummaries;
}

// Create the state-specific summaries
export const STATE_MONTH_SUMMARIES: StateSummaries = {
  'TAS': {
    'january': 'Cool climate gardening. Focus on leafy greens and root vegetables. Water early morning. Protect from strong winds.',
    'february': 'Late summer harvesting. Plant autumn crops. Monitor water needs. Start preparing winter beds.',
    'march': 'Autumn planting season begins. Soil still warm enough for good growth. Plant winter vegetables and green manure crops.',
    'april': 'Main autumn planting month. Soil preparation for winter crops. Last chance for warm season vegetables.',
    'may': 'Early winter preparations. Focus on frost-hardy vegetables. Add protection for tender plants.',
    'june': 'Winter dormancy begins. Maintain winter crops. Focus on soil improvement and planning.',
    'july': 'Peak winter season. Limited outdoor growing. Good time for planning and maintenance.',
    'august': 'Late winter preparation for spring. Start seedlings indoors. Clean and prepare beds.',
    'september': 'Early spring plantings begin. Soil warming up. Watch for late frosts.',
    'october': 'Main spring planting month. Soil temperature rising. Good growth conditions.',
    'november': 'Late spring plantings. Increasing temperatures. Regular watering needed.',
    'december': 'Early summer season. Peak growing conditions. Regular maintenance important.'
  },
  'VIC': {
    'january': 'Hot summer conditions. Focus on heat-tolerant vegetables. Morning watering essential. Watch for sun damage.',
    'february': 'Late summer heat continues. Monitor water needs. Harvest summer crops. Plan autumn garden.',
    // ... add other months
  },
  'NSW': {
    'january': 'Warm summer conditions. Focus on water management and heat protection. Early morning gardening recommended.',
    'february': 'Peak summer growing season. Maintain regular watering. Start planning autumn crops.',
    // ... add other months
  },
  'QLD': {
    'january': 'Tropical summer conditions. Heavy rainfall period. Focus on drainage and disease prevention.',
    'february': 'Wet season continues. Monitor plant health. Good time for tropical vegetables.',
    // ... add other months
  },
  'WA': {
    'january': 'Mediterranean climate peak. Early morning watering essential. Focus on heat-tolerant varieties.',
    'february': 'Hot and dry conditions continue. Deep watering important. Plan for autumn.',
    // ... add other months
  },
  'SA': {
    'january': 'Hot, dry conditions dominate. Water management crucial. Focus on heat-hardy varieties.',
    'february': 'Late summer heat persists. Monitor water needs. Begin autumn preparations.',
    // ... add other months
  },
  'NT': {
    'january': 'Wet season peak. Focus on tropical vegetables. Monitor drainage and fungal issues.',
    'february': 'Heavy rains continue. Plant tropical varieties. Watch for waterlogging.',
    // ... add other months
  },
  'ACT': {
    'january': 'Warm summer conditions. Focus on water conservation. Morning watering recommended.',
    'february': 'Late summer gardening. Monitor moisture levels. Begin autumn planning.',
    // ... add other months
  }
};

// Export default summaries for fallback
export const DEFAULT_MONTH_SUMMARIES: MonthSummaries = {
  'january': 'General summer gardening. Regular watering needed. Monitor for pests.',
  'february': 'Late summer activities. Harvest mature crops. Prepare for autumn.',
  'march': 'Transition to autumn. Good planting conditions.',
  'april': 'Mid-autumn activities. Prepare for cooler weather.',
  'may': 'Late autumn tasks. Winter preparation important.',
  'june': 'Early winter activities. Focus on hardy vegetables.',
  'july': 'Mid-winter gardening. Maintenance and planning.',
  'august': 'Late winter tasks. Prepare for spring.',
  'september': 'Early spring activities. Soil preparation.',
  'october': 'Mid-spring planting season. Active growth.',
  'november': 'Late spring tasks. Summer preparation.',
  'december': 'Early summer activities. Regular maintenance.'
}; 