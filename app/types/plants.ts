export interface PlantInfo {
  name: string
  type: 'sow' | 'plant'
}

export interface PlantIssue {
  name: string
  symptoms: string
  solution: string
}

export interface PlantDetails {
  name: string
  growingInfo: string
  plantingTime: string
  careInstructions: string[]
  commonIssues: PlantIssue[]
  description: string
  seedSpacing: string
  rowSpacing: string
  matureHeight: string
  timeToHarvest: string
  frostTolerant: boolean
  soil: string
  watering: string
  sunlight: string
  maintenance: 'low' | 'medium' | 'high'
  maintenanceTasks: {
    stage: 'planting' | 'growing' | 'harvesting'
    tasks: string[]
  }[]
}

export interface GardenPlant {
  name: string
  datePlanted: string
  type: 'seed' | 'seedling'
  activityType: 'sow' | 'plant'
  location?: string
  notes?: string
}

export interface SeasonGuide {
  season: string
  currentMonth: string
  keyTasks: string[]
  quickTips: string[]
}

export const PLANT_DETAILS: { [key: string]: PlantDetails } = {
  'Beetroot': {
    name: 'Beetroot',
    growingInfo: 'Easy to grow root vegetable that prefers well-drained soil rich in organic matter.',
    plantingTime: 'Spring through autumn in most regions. Avoid extreme heat.',
    careInstructions: [
      'Keep soil consistently moist but not waterlogged',
      'Thin seedlings to 10cm apart',
      'Mulch to retain moisture and suppress weeds',
      'Harvest when roots are 5-10cm in diameter'
    ],
    commonIssues: [
      {
        name: 'Leaf spot diseases',
        symptoms: 'Brown spots on leaves in humid conditions',
        solution: 'Improve air circulation and avoid overhead watering'
      },
      {
        name: 'Root cracking',
        symptoms: 'Split or cracked roots from inconsistent growth',
        solution: 'Maintain even soil moisture and regular feeding'
      },
      {
        name: 'Bolting',
        symptoms: 'Premature flowering in hot weather',
        solution: 'Plant in cooler seasons and provide afternoon shade'
      }
    ],
    description: 'Hardy root vegetable, excellent for beginners',
    seedSpacing: '10cm',
    rowSpacing: '30cm',
    matureHeight: '30-40cm',
    timeToHarvest: '8-10 weeks',
    frostTolerant: true,
    soil: 'Well-drained, rich in organic matter',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil',
          'Sow seeds',
          'Water well'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Thin seedlings',
          'Keep moist',
          'Remove weeds'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pull when mature',
          'Store properly'
        ]
      }
    ]
  },
  'Brassicas': {
    name: 'Brassicas',
    growingInfo: 'Family including cabbage, broccoli, cauliflower. Need rich, well-drained soil.',
    plantingTime: 'Cool season crops, plant in autumn or early spring.',
    careInstructions: [
      'Regular deep watering',
      'Add lime if soil is acidic',
      'Protect from cabbage white butterflies',
      'Rotate crops annually'
    ],
    commonIssues: [
      {
        name: 'Club root',
        symptoms: 'Stunted growth and wilting in acidic soils',
        solution: 'Add lime to raise soil pH, practice crop rotation'
      },
      {
        name: 'Cabbage white butterfly',
        symptoms: 'Holes in leaves, presence of green caterpillars',
        solution: 'Use netting or row covers, handpick caterpillars'
      },
      {
        name: 'Black rot',
        symptoms: 'Yellow V-shaped lesions on leaf edges in wet conditions',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    description: 'Hardy vegetables that include cabbage, broccoli, and cauliflower',
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '30-60cm',
    timeToHarvest: '10-16 weeks',
    frostTolerant: true,
    soil: 'Rich, well-drained, slightly alkaline',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun',
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil with lime if needed',
          'Space correctly',
          'Water well'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Monitor for pests',
          'Keep well watered',
          'Add mulch'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Cut at base when mature',
          'Check for tight heads',
          'Store properly'
        ]
      }
    ]
  },
  'Leeks': {
    name: 'Leeks',
    growingInfo: 'Long-growing allium that needs deep, rich soil. Good winter crop.',
    plantingTime: 'Sow in spring for autumn/winter harvest.',
    careInstructions: [
      'Plant in deep trenches',
      'Gradually earth up stems to blanch',
      'Keep well watered',
      'Harvest when stems are 2-3cm thick'
    ],
    commonIssues: [
      {
        name: 'Rust',
        symptoms: 'Orange spots on leaves in wet conditions',
        solution: 'Improve air circulation and avoid overhead watering'
      },
      {
        name: 'Leek moth',
        symptoms: 'Tunneling damage in leaves and stems',
        solution: 'Use row covers, practice crop rotation'
      },
      {
        name: 'Split stems',
        symptoms: 'Stems splitting from irregular watering',
        solution: 'Maintain consistent soil moisture'
      }
    ],
    description: 'Hardy winter vegetable with mild onion flavor',
    seedSpacing: '15cm',
    rowSpacing: '30cm',
    matureHeight: '60-90cm',
    timeToHarvest: '16-20 weeks',
    frostTolerant: true,
    soil: 'Deep, rich, well-drained',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun',
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Dig deep trenches',
          'Space correctly',
          'Water well'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Earth up stems regularly',
          'Keep well watered',
          'Remove weeds'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Lift when stems reach desired thickness',
          'Clean thoroughly',
          'Store in cool conditions'
        ]
      }
    ]
  },
  'Celery': {
    name: 'Celery',
    growingInfo: 'Moisture-loving plant that needs rich soil and consistent care.',
    plantingTime: 'Plant in spring for summer/autumn harvest.',
    careInstructions: [
      'Keep soil consistently moist',
      'Mulch well to retain moisture',
      'Protect from strong winds',
      'Blanch stems if desired'
    ],
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Premature flowering in hot conditions',
        solution: 'Provide consistent moisture and temperature'
      },
      {
        name: 'Leaf blight',
        symptoms: 'Brown spots on leaves in wet conditions',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Stringy stems',
        symptoms: 'Tough, fibrous stems from stress',
        solution: 'Maintain consistent growing conditions and moisture'
      }
    ],
    description: 'Popular vegetable that requires consistent moisture and care',
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '40-60cm',
    timeToHarvest: '14-16 weeks',
    frostTolerant: false,
    soil: 'Rich, moisture-retentive, well-drained',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    maintenance: 'high',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare rich soil',
          'Space correctly',
          'Water thoroughly'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Keep consistently moist',
          'Add mulch',
          'Blanch stems if desired'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Cut at soil level',
          'Harvest outer stems as needed',
          'Store properly'
        ]
      }
    ]
  },
  'Spinach': {
    name: 'Spinach',
    growingInfo: 'Fast-growing leafy green that prefers cool weather and rich, well-drained soil.',
    plantingTime: 'Early spring and autumn. Will bolt in hot weather.',
    careInstructions: [
      'Keep soil consistently moist',
      'Thin seedlings to 10cm apart',
      'Harvest outer leaves regularly',
      'Provide afternoon shade in warm regions'
    ],
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Premature flowering in hot weather',
        solution: 'Plant in cooler seasons, provide shade'
      },
      {
        name: 'Leaf miners',
        symptoms: 'Tunnels appearing in leaves',
        solution: 'Remove affected leaves, use row covers'
      },
      {
        name: 'Downy mildew',
        symptoms: 'Yellow patches and gray mold in humid conditions',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    description: 'Quick-growing leafy green, rich in nutrients',
    seedSpacing: '5-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '6-8 weeks',
    frostTolerant: true,
    soil: 'Rich, well-drained, high in organic matter',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare rich soil',
          'Sow seeds thinly',
          'Water well'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Thin seedlings',
          'Keep soil moist',
          'Remove weeds'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick outer leaves',
          'Cut whole plant if desired',
          'Succession plant'
        ]
      }
    ]
  },
  'Asian Greens': {
    name: 'Asian Greens',
    growingInfo: 'Quick-growing vegetables including bok choy, tatsoi, and mizuna. Prefer fertile, moist soil.',
    plantingTime: 'Spring and autumn. Can grow year-round in cool climates.',
    careInstructions: [
      'Water regularly to maintain moisture',
      'Protect from strong winds',
      'Harvest outer leaves or whole plants',
      'Succession plant for continuous harvest'
    ],
    commonIssues: [
      {
        name: 'Flea beetle',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers, apply organic pest control'
      },
      {
        name: 'Cabbage white butterfly',
        symptoms: 'Caterpillars eating leaves, leaving holes',
        solution: 'Install butterfly netting, handpick caterpillars'
      },
      {
        name: 'Bolting',
        symptoms: 'Premature flowering in hot weather',
        solution: 'Plant in cooler seasons, provide afternoon shade'
      }
    ],
    description: 'Fast-growing Asian vegetables, perfect for stir-fries',
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '4-6 weeks',
    frostTolerant: false,
    soil: 'Rich, well-drained, moisture-retentive',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare fertile soil',
          'Sow seeds thinly',
          'Water well'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Keep soil moist',
          'Monitor for pests',
          'Remove weeds'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Cut at base or harvest leaves',
          'Succession plant',
          'Clean and store properly'
        ]
      }
    ]
  },
  'Spring Onions': {
    name: 'Spring Onions',
    growingInfo: 'Easy to grow alliums that can be harvested at any stage. Perfect for containers.',
    plantingTime: 'Sow every few weeks from early spring to autumn for continuous harvest.',
    careInstructions: [
      'Keep soil moist but not waterlogged',
      'Plant in shallow trenches',
      'No thinning required',
      'Harvest when stems reach pencil thickness'
    ],
    commonIssues: [
      {
        name: 'Onion rust',
        symptoms: 'Orange pustules on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Root rot',
        symptoms: 'Yellowing leaves, rotting base in wet soil',
        solution: 'Ensure good drainage, avoid overwatering'
      },
      {
        name: 'Thrips',
        symptoms: 'Silvery patches and distorted growth',
        solution: 'Use insecticidal soap, maintain good garden hygiene'
      }
    ],
    description: 'Versatile allium, great for continuous harvesting',
    seedSpacing: '2-3cm',
    rowSpacing: '15-20cm',
    matureHeight: '30-40cm',
    timeToHarvest: '8-10 weeks',
    frostTolerant: true,
    soil: 'Well-drained, fertile',
    watering: 'Regular, moderate moisture',
    sunlight: 'Full sun',
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil',
          'Sow seeds',
          'Water gently'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Keep weeded',
          'Water regularly',
          'Monitor for pests'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pull when ready',
          'Clean thoroughly',
          'Use fresh or store'
        ]
      }
    ]
  },
  'Early Peas': {
    name: 'Early Peas',
    growingInfo: 'Hardy, early-season crop that fixes nitrogen in soil. Needs support for climbing.',
    plantingTime: 'Late winter to early spring. Can handle light frosts.',
    careInstructions: [
      'Provide climbing support',
      'Keep soil moderately moist',
      'Mulch to keep roots cool',
      'Pick regularly to encourage production'
    ],
    commonIssues: [
      {
        name: 'Pea moth',
        symptoms: 'Caterpillars damaging pods from inside',
        solution: 'Use pheromone traps, time plantings to avoid peak moth activity'
      },
      {
        name: 'Powdery mildew',
        symptoms: 'White powdery coating on leaves in humid conditions',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Bird damage',
        symptoms: 'Young shoots and seedlings eaten',
        solution: 'Use netting or row covers until plants establish'
      }
    ],
    description: 'Early-season legume, great for nitrogen fixing',
    seedSpacing: '5-7cm',
    rowSpacing: '45-60cm',
    matureHeight: '1-2m',
    timeToHarvest: '10-12 weeks',
    frostTolerant: true,
    soil: 'Well-drained, fertile',
    watering: 'Moderate, consistent moisture',
    sunlight: 'Full sun',
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Install support structure',
          'Sow seeds directly',
          'Water well'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Train vines on supports',
          'Keep soil moist',
          'Add mulch'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick pods regularly',
          'Check for maturity',
          'Save some for seed'
        ]
      }
    ]
  },
  'Early Tomatoes': {
    name: 'Early Tomatoes',
    growingInfo: 'Early-maturing varieties that can be started under protection for earlier crops.',
    plantingTime: 'Start indoors 6-8 weeks before last frost. Plant out when soil warms.',
    careInstructions: [
      'Provide strong support',
      'Remove side shoots on indeterminate varieties',
      'Water consistently at base',
      'Feed regularly once flowering'
    ],
    commonIssues: [
      {
        name: 'Late frost damage',
        symptoms: 'Blackened leaves and stems from cold',
        solution: 'Use frost protection, wait until soil warms'
      },
      {
        name: 'Blight',
        symptoms: 'Brown spots on leaves spreading in wet conditions',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Blossom end rot',
        symptoms: 'Dark patches on fruit bottom from calcium deficiency',
        solution: 'Maintain consistent watering, add calcium if needed'
      }
    ],
    description: 'Early season tomatoes for extended harvest',
    seedSpacing: '45-60cm',
    rowSpacing: '90-120cm',
    matureHeight: '1.2-1.8m',
    timeToHarvest: '8-10 weeks from transplant',
    frostTolerant: false,
    soil: 'Rich, well-drained',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun',
    maintenance: 'high',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Start seeds indoors',
          'Harden off seedlings',
          'Plant deep in rich soil'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Support plants',
          'Remove suckers',
          'Feed regularly'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick when ripe',
          'Check daily',
          'Remove damaged fruit'
        ]
      }
    ]
  }
} 