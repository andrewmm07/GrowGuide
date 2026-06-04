import type { PlantInfo } from '@/app/types/plants'

/**
 * @deprecated Use buildClimatePlantingGuideForLocation (helpers.ts) + PLANTING_BY_CLIMATE.
 * Legacy 3-key grid (cool / warm / tropical).
 */

/** Climate-zone monthly sow/plant lists for the planting calendar grid. */

export const CLIMATE_ZONE_PLANTING_GUIDE: { [key: string]: { [key: string]: PlantInfo[] } } = {
  'tropical': {  // Queensland
    'January': [
      // Wet season - focus on above-ground tropical vegetables
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Ceylon Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Luffa', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ],
    'February': [
      // Still wet season
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Ginger', type: 'sow' },
      // Planting
      { name: 'Turmeric', type: 'plant' },
      { name: 'Taro', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'March': [
      // Transitioning to dry season
      { name: 'Beans', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ],
    'April': [
      // Dry season transition
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Eggplant', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Ginger', type: 'plant' }
    ],
    'May': [
      // Early dry season
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' }
    ],
    'June': [
      // Dry season
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Brassicas', type: 'plant' }
    ],
    'July': [
      // Peak dry season
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Eggplant', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'August': [
      // Late dry season
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'September': [
      // Build-up season
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ],
    'October': [
      // Early wet season
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Ceylon Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'November': [
      // Wet season begins
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Taro', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'December': [
      // Wet season
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Ceylon Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ]
  },

  'warm': {  // NSW, SA, WA (coastal)
    'January': [
      // Hot summer - heat tolerant varieties
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Heat-tolerant Lettuce', type: 'sow' },
      // Planting
      { name: 'Eggplant', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'February': [
      // Late summer - still hot
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Heat-tolerant Lettuce', type: 'sow' },
      // Planting
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'March': [
      // Autumn transition
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      // Planting
      { name: 'Leeks', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'April': [
      // Mid-autumn
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'May': [
      // Late autumn
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Strawberries', type: 'plant' }
    ],
    'June': [
      // Early winter
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'July': [
      // Mid-winter
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'August': [
      // Late winter
      { name: 'Tomatoes (protected)', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      // Planting
      { name: 'Potatoes', type: 'plant' },
      { name: 'Asparagus', type: 'plant' }
    ],
    'September': [
      // Early spring
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Potatoes', type: 'plant' },
      { name: 'Tomatoes', type: 'plant' }
    ],
    'October': [
      // Mid-spring
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' }
    ],
    'November': [
      // Late spring
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      // Planting
      { name: 'Eggplant', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'December': [
      // Early summer
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Heat-tolerant Lettuce', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ]
  },

  'cool': {  // Tasmania, ACT, Victorian highlands
    'January': [
      // Mild summer - good growing conditions
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Leeks', type: 'plant' },
      { name: 'Celery', type: 'plant' }
    ],
    'February': [
      // Late summer - mild conditions
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Leeks', type: 'plant' },
      { name: 'Brassicas', type: 'plant' },
      { name: 'Celery', type: 'plant' }
    ],
    'March': [
      // Early autumn - good growing conditions
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Brassicas', type: 'plant' },
      { name: 'Leeks', type: 'plant' }
    ],
    'April': [
      // Mid-autumn - prepare for winter
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'May': [
      // Late autumn - frost hardy varieties
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'June': [
      // Early winter - limited planting
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'July': [
      // Mid-winter - very limited planting
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'August': [
      // Late winter - start seeds indoors
      { name: 'Early Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Early Potatoes', type: 'plant' },
      { name: 'Asparagus', type: 'plant' }
    ],
    'September': [
      // Early spring - soil warming
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Potatoes', type: 'plant' },
      { name: 'Early Tomatoes (protected)', type: 'plant' }
    ],
    'October': [
      // Mid-spring - main planting time
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Potatoes', type: 'plant' }
    ],
    'November': [
      // Late spring - watch for late frosts
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' }
    ],
    'December': [
      // Early summer - main growing season
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Leeks', type: 'plant' }
    ]
  }
}

