/**
 * Comprehensive plant database with all possible tasks
 * Maps plants to their activities throughout the growing season
 */

export interface PlantTask {
  id: string
  name: string
  description: string
  daysAfterPlanting: number
  priority: 'critical' | 'recommended' | 'optional'
  duration?: number // how many days this task spans
}

export interface Plant {
  id: string
  name: string
  commonNames: string[]
  minZone: number
  maxZone: number
  sowingMonth: number[] // 1-12
  harvestMonth: number[] // 1-12
  daysToMaturity: number
  tasks: PlantTask[]
}

export const PLANT_DATABASE: Plant[] = [
  {
    id: 'tomato',
    name: 'Tomatoes',
    commonNames: ['Tomato', 'Solanum lycopersicum'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [2, 3, 4],
    harvestMonth: [7, 8, 9, 10],
    daysToMaturity: 60,
    tasks: [
      {
        id: 'tomato-water',
        name: 'Water at soil level',
        description: 'Water deeply and consistently, avoiding foliage',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 150
      },
      {
        id: 'tomato-stake',
        name: 'Stake or support',
        description: 'Install stakes or cages for support as plant grows',
        daysAfterPlanting: 7,
        priority: 'critical'
      },
      {
        id: 'tomato-fertilise',
        name: 'Apply balanced fertiliser',
        description: 'Feed with balanced 10-10-10 fertiliser every 2 weeks',
        daysAfterPlanting: 14,
        priority: 'recommended',
        duration: 120
      },
      {
        id: 'tomato-prune',
        name: 'Prune suckers for air circulation',
        description: 'Remove lower leaves and side shoots for disease prevention',
        daysAfterPlanting: 21,
        priority: 'recommended',
        duration: 90
      },
      {
        id: 'tomato-pest',
        name: 'Monitor for hornworms and aphids',
        description: 'Check for pests and apply neem oil if needed',
        daysAfterPlanting: 14,
        priority: 'critical',
        duration: 120
      },
      {
        id: 'tomato-disease',
        name: 'Watch for early blight and powdery mildew',
        description: 'Monitor for disease symptoms, improve airflow',
        daysAfterPlanting: 28,
        priority: 'critical',
        duration: 100
      },
      {
        id: 'tomato-harvest',
        name: 'Harvest when ripe',
        description: 'Pick tomatoes when fully colored and slightly soft',
        daysAfterPlanting: 60,
        priority: 'critical',
        duration: 60
      }
    ]
  },
  {
    id: 'basil',
    name: 'Basil',
    commonNames: ['Sweet Basil', 'Ocimum basilicum'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [3, 4, 5],
    harvestMonth: [6, 7, 8, 9],
    daysToMaturity: 30,
    tasks: [
      {
        id: 'basil-water',
        name: 'Keep soil consistently moist',
        description: 'Water regularly but avoid waterlogging',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 90
      },
      {
        id: 'basil-pinch',
        name: 'Pinch off flower buds',
        description: 'Remove flower buds to encourage leaf growth',
        daysAfterPlanting: 21,
        priority: 'recommended',
        duration: 60
      },
      {
        id: 'basil-fertilise',
        name: 'Feed with nitrogen-rich fertiliser',
        description: 'Apply every 3-4 weeks for bushy growth',
        daysAfterPlanting: 21,
        priority: 'optional',
        duration: 60
      },
      {
        id: 'basil-harvest',
        name: 'Harvest leaves regularly',
        description: 'Pick leaves from top to encourage bushiness',
        daysAfterPlanting: 30,
        priority: 'critical',
        duration: 60
      }
    ]
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    commonNames: ['Brassica oleracea'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [2, 3, 7, 8],
    harvestMonth: [5, 6, 9, 10],
    daysToMaturity: 55,
    tasks: [
      {
        id: 'broccoli-water',
        name: 'Water consistently',
        description: 'Keep soil evenly moist throughout growing season',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 120
      },
      {
        id: 'broccoli-fertilise',
        name: 'Apply balanced fertiliser',
        description: 'Feed every 3 weeks with balanced fertiliser',
        daysAfterPlanting: 14,
        priority: 'recommended',
        duration: 100
      },
      {
        id: 'broccoli-pest',
        name: 'Check for cabbage moths and beetles',
        description: 'Monitor and apply organic pest control if needed',
        daysAfterPlanting: 14,
        priority: 'critical',
        duration: 100
      },
      {
        id: 'broccoli-harvest',
        name: 'Harvest when heads are firm',
        description: 'Pick before florets start to yellow',
        daysAfterPlanting: 55,
        priority: 'critical'
      }
    ]
  },
  {
    id: 'cabbage',
    name: 'Cabbage',
    commonNames: ['Brassica oleracea var. capitata'],
    minZone: 1,
    maxZone: 11,
    sowingMonth: [2, 3, 7, 8],
    harvestMonth: [5, 6, 10, 11],
    daysToMaturity: 70,
    tasks: [
      {
        id: 'cabbage-water',
        name: 'Water consistently',
        description: 'Keep soil moist but not waterlogged',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 140
      },
      {
        id: 'cabbage-fertilise',
        name: 'Apply nitrogen-rich fertiliser',
        description: 'Feed every 2-3 weeks for strong growth',
        daysAfterPlanting: 14,
        priority: 'recommended',
        duration: 120
      },
      {
        id: 'cabbage-pest',
        name: 'Monitor for cabbage worms and loopers',
        description: 'Check undersides of leaves regularly',
        daysAfterPlanting: 21,
        priority: 'critical',
        duration: 110
      },
      {
        id: 'cabbage-harvest',
        name: 'Harvest when heads feel firm',
        description: 'Cut heads when solid to touch',
        daysAfterPlanting: 70,
        priority: 'critical'
      }
    ]
  },
  {
    id: 'brussels-sprouts',
    name: 'Brussel Sprouts',
    commonNames: ['Brussels Sprout', 'Brassica oleracea var. gemmifera'],
    minZone: 2,
    maxZone: 10,
    sowingMonth: [4, 5],
    harvestMonth: [9, 10, 11, 12],
    daysToMaturity: 90,
    tasks: [
      {
        id: 'bs-water',
        name: 'Water deeply and consistently',
        description: 'Provide steady moisture throughout season',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 180
      },
      {
        id: 'bs-fertilise',
        name: 'Apply balanced fertiliser',
        description: 'Feed every 3 weeks for robust growth',
        daysAfterPlanting: 21,
        priority: 'recommended',
        duration: 150
      },
      {
        id: 'bs-pinch',
        name: 'Pinch off growing tip',
        description: 'Remove top leaves 3 weeks before harvest to encourage sprouting',
        daysAfterPlanting: 75,
        priority: 'recommended'
      },
      {
        id: 'bs-pest',
        name: 'Check for aphids and cabbage moths',
        description: 'Monitor closely and treat if necessary',
        daysAfterPlanting: 28,
        priority: 'critical',
        duration: 140
      },
      {
        id: 'bs-harvest',
        name: 'Harvest sprouts from bottom up',
        description: 'Pick when 1-2 inches diameter and firm',
        daysAfterPlanting: 90,
        priority: 'critical',
        duration: 60
      }
    ]
  },
  {
    id: 'lettuce',
    name: 'Lettuce',
    commonNames: ['Lactuca sativa'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [2, 3, 4, 8, 9],
    harvestMonth: [4, 5, 6, 10, 11],
    daysToMaturity: 30,
    tasks: [
      {
        id: 'lettuce-water',
        name: 'Keep soil moist',
        description: 'Water regularly, especially in warm weather',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 60
      },
      {
        id: 'lettuce-thinning',
        name: 'Thin seedlings',
        description: 'Space plants 6-12 inches apart depending on variety',
        daysAfterPlanting: 7,
        priority: 'recommended'
      },
      {
        id: 'lettuce-harvest',
        name: 'Harvest outer leaves or whole heads',
        description: 'Pick when tender, before bolting',
        daysAfterPlanting: 30,
        priority: 'critical',
        duration: 30
      }
    ]
  },
  {
    id: 'beans',
    name: 'Beans',
    commonNames: ['Green Beans', 'Phaseolus vulgaris'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [4, 5, 6],
    harvestMonth: [7, 8, 9],
    daysToMaturity: 50,
    tasks: [
      {
        id: 'beans-water',
        name: 'Water at soil level',
        description: 'Keep soil consistently moist, avoid wetting foliage',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 100
      },
      {
        id: 'beans-stake',
        name: 'Provide trellis or support (pole varieties)',
        description: 'Install support structures early',
        daysAfterPlanting: 7,
        priority: 'recommended'
      },
      {
        id: 'beans-pest',
        name: 'Monitor for bean beetles',
        description: 'Check undersides of leaves daily if possible',
        daysAfterPlanting: 14,
        priority: 'critical',
        duration: 80
      },
      {
        id: 'beans-harvest',
        name: 'Harvest regularly when young and tender',
        description: 'Pick every 2-3 days for continuous production',
        daysAfterPlanting: 50,
        priority: 'critical',
        duration: 60
      }
    ]
  },
  {
    id: 'carrot',
    name: 'Carrots',
    commonNames: ['Daucus carota'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [2, 3, 4, 7, 8],
    harvestMonth: [5, 6, 10, 11],
    daysToMaturity: 60,
    tasks: [
      {
        id: 'carrot-water',
        name: 'Water consistently for even growth',
        description: 'Avoid drought stress to prevent cracking',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 120
      },
      {
        id: 'carrot-thin',
        name: 'Thin seedlings',
        description: 'Space 2-3 inches apart for proper root development',
        daysAfterPlanting: 14,
        priority: 'recommended'
      },
      {
        id: 'carrot-mulch',
        name: 'Apply mulch to prevent greening',
        description: 'Keep roots covered to prevent exposure to light',
        daysAfterPlanting: 21,
        priority: 'optional'
      },
      {
        id: 'carrot-harvest',
        name: 'Harvest when roots are tender',
        description: 'Pull when 0.5-1 inch diameter or larger depending on preference',
        daysAfterPlanting: 60,
        priority: 'critical'
      }
    ]
  },
  {
    id: 'spinach',
    name: 'Spinach',
    commonNames: ['Spinacia oleracea'],
    minZone: 2,
    maxZone: 11,
    sowingMonth: [2, 3, 4, 8, 9, 10],
    harvestMonth: [4, 5, 6, 10, 11, 12],
    daysToMaturity: 40,
    tasks: [
      {
        id: 'spinach-water',
        name: 'Keep soil moist',
        description: 'Water regularly for tender leaves',
        daysAfterPlanting: 0,
        priority: 'critical',
        duration: 80
      },
      {
        id: 'spinach-thin',
        name: 'Thin seedlings',
        description: 'Space 3-6 inches apart',
        daysAfterPlanting: 7,
        priority: 'recommended'
      },
      {
        id: 'spinach-harvest',
        name: 'Harvest outer leaves or whole plant',
        description: 'Pick when leaves are young and tender, before bolting',
        daysAfterPlanting: 35,
        priority: 'critical',
        duration: 40
      }
    ]
  }
]

/**
 * Get all tasks for a specific plant
 */
export function getPlantTasks(plantId: string): PlantTask[] {
  const plant = PLANT_DATABASE.find(p => p.id === plantId)
  return plant?.tasks || []
}

/**
 * Get plant by name
 */
export function getPlantByName(name: string): Plant | undefined {
  return PLANT_DATABASE.find(
    p => p.name.toLowerCase() === name.toLowerCase() ||
         p.commonNames.some(cn => cn.toLowerCase() === name.toLowerCase())
  )
}

/**
 * Get all plants suitable for a zone
 */
export function getPlantsForZone(zone: number): Plant[] {
  return PLANT_DATABASE.filter(p => p.minZone <= zone && zone <= p.maxZone)
}

/**
 * Get plants that can be sown this month
 */
export function getPlantsForMonth(month: number): Plant[] {
  return PLANT_DATABASE.filter(p => p.sowingMonth.includes(month))
}

/**
 * Task severity and action mappings
 */
export const TASK_CATEGORIES = {
  watering: 'Watering',
  fertilising: 'Fertilising',
  harvesting: 'Harvesting',
  pruning: 'Pruning',
  pest_management: 'Pest Management',
  disease_control: 'Disease Control',
  staking: 'Staking',
  thinning: 'Thinning',
  pinching: 'Pinching',
  mulching: 'Mulching',
  other: 'Other'
} as const
