export interface WeeklyPlantingGuide {
  week: number
  sow: string[]
  plant: string[]
  tasks: string[]
}

export interface MonthWeather {
  avgTemp: string
  rainfall: string
  humidity: string
  frostRisk: string
  daylight: string
  season: string
  [key: string]: string
}

export interface MonthNoNos {
  mistakes: string[]
  warnings: string[]
  commonErrors: string[]
}

export interface MonthDetail {
  name: string
  weeklyGuide: WeeklyPlantingGuide[]
  keyTasks: string[]
  weather: MonthWeather
  noNos: MonthNoNos
}

export const MONTH_DETAILS: Record<string, MonthDetail> = {
  january: {
    name: 'January',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Beetroot', 'Broccoli', 'Brussels sprouts', 'Winter Cabbage', 'Kale', 'Carrot', 'Kohlrabi'],
        plant: ['Broccoli', 'Brussels sprouts', 'Cabbage', 'Capsicums', 'Cauliflower', 'Celery', 'Leeks'],
        tasks: [
          'Monitor water needs daily',
          'Apply mulch to retain moisture',
          'Check for heat stress'
        ]
      }
    ],
    keyTasks: [
      'Water early morning or evening',
      'Monitor for pests',
      'Maintain mulch coverage'
    ],
    weather: {
      avgTemp: '23°C',
      rainfall: '45mm',
      humidity: '65%',
      frostRisk: 'None',
      daylight: '14.5 hours',
      season: 'Summer'
    },
    noNos: {
      mistakes: ['Planting frost-sensitive crops'],
      warnings: ['Watch for signs of heat stress'],
      commonErrors: ['Forgetting to mulch']
    }
  },
  february: {
    name: 'February',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Broccoli', 'Carrot', 'Cabbage', 'Cauliflower', 'Brussels sprouts', 'Leek', 'Turnip'],
        plant: ['Broccoli', 'Brussels sprouts', 'Winter Cabbage', 'Cauliflower', 'Celery', 'Leeks', 'Lettuce'],
        tasks: [
          'Continue summer harvesting',
          'Prepare beds for autumn',
          'Monitor water needs'
        ]
      }
    ],
    keyTasks: [
      'Harvest summer crops',
      'Plan autumn plantings',
      'Maintain watering schedule'
    ],
    weather: {
      avgTemp: '22°C',
      rainfall: '40mm',
      humidity: '60%',
      frostRisk: 'None',
      daylight: '13.5 hours',
      season: 'Summer'
    },
    noNos: {
      mistakes: ['Neglecting water needs'],
      warnings: ['Watch for late summer pests'],
      commonErrors: ['Poor autumn planning']
    }
  },
  march: {
    name: 'March',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Broad Beans', 'English Spinach', 'Onions', 'Peas', 'Turnip', 'Lettuce'],
        plant: ['Garlic', 'Shallots', 'Winter Lettuce'],
        tasks: [
          'Begin autumn preparations',
          'Clean up summer crops',
          'Check soil fertility'
        ]
      }
    ],
    keyTasks: [
      'Prepare for autumn planting',
      'Clean up garden beds',
      'Add compost to soil'
    ],
    weather: {
      avgTemp: '20°C',
      rainfall: '50mm',
      humidity: '65%',
      frostRisk: 'Low',
      daylight: '12 hours',
      season: 'Autumn'
    },
    noNos: {
      mistakes: ['Planting summer crops'],
      warnings: ['Watch for early frost'],
      commonErrors: ['Poor soil preparation']
    }
  },
  april: {
    name: 'April',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Broad Beans', 'Peas', 'English Spinach', 'Spring Onions'],
        plant: ['Garlic', 'Shallots'],
        tasks: [
          'Plant winter crops',
          'Add organic matter',
          'Check drainage'
        ]
      }
    ],
    keyTasks: [
      'Focus on winter crops',
      'Improve soil',
      'Prepare for frost'
    ],
    weather: {
      avgTemp: '18°C',
      rainfall: '55mm',
      humidity: '70%',
      frostRisk: 'Medium',
      daylight: '10 hours',
      season: 'Autumn'
    },
    noNos: {
      mistakes: ['Late summer plantings'],
      warnings: ['Frost damage risk'],
      commonErrors: ['Poor drainage prep']
    }
  },
  may: {
    name: 'May',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Broad Beans', 'Peas'],
        plant: ['Garlic', 'Jerusalem Artichokes', 'Shallots'],
        tasks: [
          'Protect from frost',
          'Maintain winter crops',
          'Check soil moisture'
        ]
      }
    ],
    keyTasks: [
      'Frost protection',
      'Winter maintenance',
      'Soil improvement'
    ],
    weather: {
      avgTemp: '15°C',
      rainfall: '60mm',
      humidity: '75%',
      frostRisk: 'High',
      daylight: '8 hours',
      season: 'Winter'
    },
    noNos: {
      mistakes: ['Neglecting frost protection'],
      warnings: ['Cold damage to plants'],
      commonErrors: ['Poor winter planning']
    }
  },
  june: {
    name: 'June',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Broad Beans', 'Peas'],
        plant: ['Garlic', 'Shallots'],
        tasks: [
          'Winter maintenance',
          'Check frost protection',
          'Monitor soil moisture'
        ]
      }
    ],
    keyTasks: [
      'Winter care',
      'Frost management',
      'Plan spring garden'
    ],
    weather: {
      avgTemp: '12°C',
      rainfall: '65mm',
      humidity: '80%',
      frostRisk: 'High',
      daylight: '6 hours',
      season: 'Winter'
    },
    noNos: {
      mistakes: ['Overwatering in winter'],
      warnings: ['Frost damage risk'],
      commonErrors: ['Poor planning']
    }
  },
  july: {
    name: 'July',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Peas', 'Broad Beans', 'Spring Onions'],
        plant: ['Garlic', 'Shallots', 'Asparagus Crowns'],
        tasks: [
          'Check frost protection',
          'Plan spring garden',
          'Maintain winter crops'
        ]
      }
    ],
    keyTasks: [
      'Protect from frost',
      'Winter pruning',
      'Soil preparation'
    ],
    weather: {
      avgTemp: '11°C',
      rainfall: '70mm',
      humidity: '80%',
      frostRisk: 'Very High',
      daylight: '7 hours',
      season: 'Winter'
    },
    noNos: {
      mistakes: ['Removing frost protection'],
      warnings: ['Severe frost damage'],
      commonErrors: ['Early spring planting']
    }
  },
  august: {
    name: 'August',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Peas', 'Spring Onions', 'Early Potatoes'],
        plant: ['Asparagus', 'Rhubarb', 'Strawberries'],
        tasks: [
          'Prepare for spring',
          'Last frost protection',
          'Start seedlings indoors'
        ]
      }
    ],
    keyTasks: [
      'Spring preparation',
      'Start seeds indoors',
      'Clean up winter debris'
    ],
    weather: {
      avgTemp: '13°C',
      rainfall: '65mm',
      humidity: '75%',
      frostRisk: 'High',
      daylight: '9 hours',
      season: 'Winter'
    },
    noNos: {
      mistakes: ['Early outdoor planting'],
      warnings: ['Late frost risk'],
      commonErrors: ['Poor spring planning']
    }
  },
  september: {
    name: 'September',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Tomatoes', 'Lettuce', 'Carrots', 'Beetroot'],
        plant: ['Potatoes', 'Asparagus', 'Early Tomatoes'],
        tasks: [
          'Begin spring planting',
          'Prepare garden beds',
          'Start fertilizing'
        ]
      }
    ],
    keyTasks: [
      'Spring planting begins',
      'Soil preparation',
      'Start feeding schedule'
    ],
    weather: {
      avgTemp: '15°C',
      rainfall: '60mm',
      humidity: '70%',
      frostRisk: 'Medium',
      daylight: '11 hours',
      season: 'Spring'
    },
    noNos: {
      mistakes: ['Ignoring late frosts'],
      warnings: ['Unpredictable weather'],
      commonErrors: ['Over-eager planting']
    }
  },
  october: {
    name: 'October',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Beans', 'Corn', 'Cucumbers', 'Pumpkins'],
        plant: ['Tomatoes', 'Capsicums', 'Eggplants'],
        tasks: [
          'Main spring planting',
          'Regular feeding',
          'Pest monitoring'
        ]
      }
    ],
    keyTasks: [
      'Main planting month',
      'Establish supports',
      'Monitor pests'
    ],
    weather: {
      avgTemp: '17°C',
      rainfall: '55mm',
      humidity: '65%',
      frostRisk: 'Low',
      daylight: '13 hours',
      season: 'Spring'
    },
    noNos: {
      mistakes: ['Forgetting pest control'],
      warnings: ['Irregular watering'],
      commonErrors: ['Poor spacing']
    }
  },
  november: {
    name: 'November',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Beans', 'Sweet Corn', 'Zucchini', 'Pumpkins'],
        plant: ['Tomatoes', 'Basil', 'Summer Herbs'],
        tasks: [
          'Regular watering',
          'Mulch gardens',
          'Support climbing plants'
        ]
      }
    ],
    keyTasks: [
      'Establish watering',
      'Apply summer mulch',
      'Plant heat-lovers'
    ],
    weather: {
      avgTemp: '19°C',
      rainfall: '50mm',
      humidity: '60%',
      frostRisk: 'Very Low',
      daylight: '14 hours',
      season: 'Spring'
    },
    noNos: {
      mistakes: ['Neglecting water'],
      warnings: ['Heat stress'],
      commonErrors: ['Poor mulching']
    }
  },
  december: {
    name: 'December',
    weeklyGuide: [
      {
        week: 1,
        sow: ['Beans', 'Sweet Corn', 'Lettuce', 'Carrots'],
        plant: ['Tomatoes', 'Capsicums', 'Basil'],
        tasks: [
          'Summer maintenance',
          'Regular harvesting',
          'Water management'
        ]
      }
    ],
    keyTasks: [
      'Heat protection',
      'Water management',
      'Regular harvesting'
    ],
    weather: {
      avgTemp: '21°C',
      rainfall: '45mm',
      humidity: '60%',
      frostRisk: 'None',
      daylight: '15 hours',
      season: 'Summer'
    },
    noNos: {
      mistakes: ['Overhead watering'],
      warnings: ['Heat damage'],
      commonErrors: ['Poor summer planning']
    }
  }
} 