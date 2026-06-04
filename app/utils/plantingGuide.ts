// Planting guide data organized by climate zone and month
export const PLANTING_GUIDE: { [key: string]: { [key: string]: { name: string; type: 'sow' | 'plant' }[] } } = {
  'tropical': {
    'January': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Ceylon Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Luffa', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ],
    'February': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Ginger', type: 'sow' },
      { name: 'Turmeric', type: 'plant' },
      { name: 'Taro', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'March': [
      { name: 'Beans', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ],
    'April': [
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Eggplant', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Ginger', type: 'plant' }
    ],
    'May': [
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' }
    ],
    'June': [
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Brassicas', type: 'plant' }
    ],
    'July': [
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Eggplant', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'August': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'September': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ],
    'October': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Ceylon Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'November': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Taro', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'December': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Ceylon Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ]
  },
  'warm': {
    'January': [
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Heat-tolerant Lettuce', type: 'sow' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'February': [
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Heat-tolerant Lettuce', type: 'sow' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'March': [
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      { name: 'Leeks', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'April': [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'May': [
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Strawberries', type: 'plant' }
    ],
    'June': [
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'July': [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'August': [
      { name: 'Tomatoes (protected)', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Potatoes', type: 'plant' },
      { name: 'Asparagus', type: 'plant' }
    ],
    'September': [
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Potatoes', type: 'plant' },
      { name: 'Tomatoes', type: 'plant' }
    ],
    'October': [
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' }
    ],
    'November': [
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'December': [
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Heat-tolerant Lettuce', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ]
  },
  'cool': {
    'January': [
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Leeks', type: 'plant' },
      { name: 'Celery', type: 'plant' }
    ],
    'February': [
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Brassicas', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Leeks', type: 'plant' },
      { name: 'Brassicas', type: 'plant' },
      { name: 'Celery', type: 'plant' }
    ],
    'March': [
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Brassicas', type: 'plant' },
      { name: 'Leeks', type: 'plant' }
    ],
    'April': [
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'May': [
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'June': [
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'July': [
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'August': [
      { name: 'Early Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Early Potatoes', type: 'plant' },
      { name: 'Asparagus', type: 'plant' }
    ],
    'September': [
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Potatoes', type: 'plant' },
      { name: 'Early Tomatoes (protected)', type: 'plant' }
    ],
    'October': [
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Potatoes', type: 'plant' }
    ],
    'November': [
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' }
    ],
    'December': [
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Leeks', type: 'plant' }
    ]
  }
}

/**
 * @deprecated Use getPlantingRecommendationsForMonth from @/lib/plantingRecommendations.
 * Kept for legacy callers that only have a 3-key climate zone string.
 */
export function getOptimalPlantsForMonth(
  climateZone: string,
  month: string,
  plantedNames: Set<string>
): string[] {
  const zone = PLANTING_GUIDE[climateZone] || PLANTING_GUIDE['warm']
  const monthPlan = zone[month] || []
  const plantNames = Array.from(new Set(monthPlan.map((p) => p.name)))
  return plantNames.filter((name) => !plantedNames.has(name))
}

/** @deprecated Use getCurrentPlantingMonth from @/lib/plantingRecommendations */
export function getCurrentMonthName(): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  return months[new Date().getMonth()]
}
