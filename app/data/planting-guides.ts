import { PlantInfo } from '../types/plants'
import { REGION_DATA } from '../data/regions'

// Keep the existing Tasmania-specific guide
const TASMANIA_GUIDE = {
  // ... existing Tasmania planting guide data ...
}

export const CLIMATE_PLANTING_GUIDES: { [key: string]: { [month: string]: PlantInfo[] } } = {
  'warm-temperate': {
    'March': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Cabbage', type: 'plant' },
      { name: 'Cauliflower', type: 'plant' },
      { name: 'Kale', type: 'plant' },
      { name: 'Garlic', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Turnips', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' },
      { name: 'Jerusalem Artichokes', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Early Potatoes', type: 'sow' },
      { name: 'Early Carrots', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' },
      { name: 'Early Potatoes', type: 'plant' }
    ],
    'September': [
      // Sowing
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Eggplant', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Potatoes', type: 'plant' },
      { name: 'Early Tomatoes', type: 'plant' }
    ],
    'October': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'December': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Lettuce', type: 'sow', notes: 'Plant in partial shade' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'January': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow', notes: 'Last chance for season' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      // Planting
      { name: 'Leeks', type: 'plant' },
      { name: 'Late Tomatoes', type: 'plant' }
    ],
    'February': [
      // Sowing
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      // Planting
      { name: 'Brassicas', type: 'plant' },
      { name: 'Leeks', type: 'plant' }
    ]
  },

  'mediterranean': {
    'March': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Cabbage', type: 'plant' },
      { name: 'Cauliflower', type: 'plant' },
      { name: 'Garlic', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Jerusalem Artichokes', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Early Carrots', type: 'sow' },
      { name: 'Early Potatoes', type: 'sow' },
      // Planting
      { name: 'Early Potatoes', type: 'plant' },
      { name: 'Asparagus', type: 'plant' }
    ],
    'September': [
      // Sowing
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      // Planting
      { name: 'Early Tomatoes', type: 'plant' },
      { name: 'Potatoes', type: 'plant' }
    ],
    'October': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'December': [
      // Sowing
      { name: 'Beans', type: 'sow', notes: 'Provide afternoon shade' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Basil', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'January': [
      // Sowing
      { name: 'Beans', type: 'sow', notes: 'Plant in partial shade' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow', notes: 'Provide shade' },
      // Planting
      { name: 'Late Tomatoes', type: 'plant', notes: 'Protect from extreme heat' }
    ],
    'February': [
      // Sowing
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Brassicas', type: 'plant' }
    ]
  },

  'subtropical': {
    'March': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Cabbage', type: 'plant' },
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Cabbage', type: 'plant' },
      { name: 'Garlic', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Potatoes', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Eggplant', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'September': [
      // Sowing
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Beans', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'October': [
      // Sowing
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      // Planting
      { name: 'Ginger', type: 'plant' },
      { name: 'Turmeric', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'December': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'January': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Asian Greens', type: 'sow', notes: 'Provide shade' },
      // Planting
      { name: 'Ginger', type: 'plant' },
      { name: 'Turmeric', type: 'plant' }
    ],
    'February': [
      // Sowing
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow', notes: 'Plant in shade' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Ginger', type: 'plant' }
    ]
  },

  'tropical': {
    'March': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' },
      { name: 'Ginger', type: 'plant' },
      { name: 'Turmeric', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Chinese Cabbage', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Chinese Cabbage', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Taro', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Capsicum', type: 'sow' },
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'September': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'October': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      { name: 'Bitter Gourd', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Taro', type: 'plant' },
      { name: 'Ginger', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      { name: 'Bitter Gourd', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' },
      { name: 'Turmeric', type: 'plant' }
    ],
    'December': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      { name: 'Bitter Gourd', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ],
    'January': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      { name: 'Asian Greens', type: 'sow', notes: 'Plant in shade' },
      // Planting
      { name: 'Taro', type: 'plant' },
      { name: 'Ginger', type: 'plant' },
      { name: 'Turmeric', type: 'plant' }
    ],
    'February': [
      // Sowing
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Cassava', type: 'plant' }
    ]
  },

  'semi-arid': {
    'March': [
      // Sowing
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Turnips', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Asian Greens', type: 'sow' },
      { name: 'Lettuce', type: 'sow', notes: 'Provide afternoon shade' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Cabbage', type: 'plant' },
      { name: 'Cauliflower', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Onions', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      // Planting
      { name: 'Onions', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Peas', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Lettuce', type: 'sow', notes: 'Provide frost protection' },
      // Planting
      { name: 'Potatoes', type: 'plant', notes: 'Watch for late frosts' }
    ],
    'September': [
      // Sowing
      { name: 'Tomatoes', type: 'sow', notes: 'Protect from late frosts' },
      { name: 'Beans', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Potatoes', type: 'plant' },
      { name: 'Early Tomatoes', type: 'plant', notes: 'Use frost protection if needed' }
    ],
    'October': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicum', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Sweet Corn', type: 'sow', notes: 'Provide adequate water' },
      { name: 'Cucumber', type: 'sow', notes: 'Use mulch to retain moisture' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Watermelon', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant' },
      { name: 'Eggplant', type: 'plant', notes: 'Provide afternoon shade' }
    ],
    'December': [
      // Sowing
      { name: 'Sweet Corn', type: 'sow', notes: 'Water deeply' },
      { name: 'Cucumber', type: 'sow', notes: 'Provide afternoon shade' },
      { name: 'Watermelon', type: 'sow' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant', notes: 'Mulch well' }
    ],
    'January': [
      // Sowing
      { name: 'Beans', type: 'sow', notes: 'Provide shade' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Lettuce', type: 'sow', notes: 'Plant in full shade' },
      // Planting
      { name: 'Sweet Potatoes', type: 'plant', notes: 'Water regularly' }
    ],
    'February': [
      // Sowing
      { name: 'Carrots', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Asian Greens', type: 'sow', notes: 'Provide shade' },
      // Planting
      { name: 'Late Season Tomatoes', type: 'plant', notes: 'Protect from heat' }
    ]
  },

  'arid': {
    'March': [
      // Sowing
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Desert Pea', type: 'sow' },
      // Planting
      { name: 'Bush Tomatoes', type: 'plant', notes: 'Provide shade cloth protection' },
      { name: 'Native Herbs', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Desert Pea', type: 'sow' },
      // Planting
      { name: 'Bush Tucker Plants', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Native Spinach', type: 'sow' },
      // Planting
      { name: 'Desert Lime', type: 'plant' },
      { name: 'Bush Tucker Plants', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Native Spinach', type: 'sow' },
      // Planting
      { name: 'Bush Tucker Plants', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Desert Pea', type: 'sow' },
      // Planting
      { name: 'Bush Tucker Plants', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Desert Pea', type: 'sow' },
      // Planting
      { name: 'Bush Tomatoes', type: 'plant', notes: 'Provide frost protection' }
    ],
    'September': [
      // Sowing
      { name: 'Bush Beans', type: 'sow' },
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Desert Pea', type: 'sow' },
      { name: 'Bush Tomatoes', type: 'sow', notes: 'Start in protected area' },
      // Planting
      { name: 'Native Herbs', type: 'plant' }
    ],
    'October': [
      // Sowing
      { name: 'Bush Beans', type: 'sow', notes: 'Provide shade cloth protection' },
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Desert Pea', type: 'sow' },
      // Planting
      { name: 'Bush Tomatoes', type: 'plant', notes: 'Use drought-tolerant varieties' },
      { name: 'Native Food Plants', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Native Spinach', type: 'sow', notes: 'Provide afternoon shade' },
      { name: 'Bush Beans', type: 'sow', notes: 'Use mulch to retain moisture' },
      // Planting
      { name: 'Desert Lime', type: 'plant' },
      { name: 'Bush Tucker Plants', type: 'plant', notes: 'Water deeply at planting' }
    ],
    'December': [
      // Sowing
      { name: 'Native Spinach', type: 'sow', notes: 'Provide shade' },
      { name: 'Bush Beans', type: 'sow', notes: 'Heavy mulching required' },
      // Planting
      { name: 'Bush Tucker Plants', type: 'plant', notes: 'Water deeply at planting' }
    ],
    'January': [
      // Sowing
      { name: 'Native Spinach', type: 'sow', notes: 'Plant in shade' },
      // Planting
      { name: 'Desert Lime', type: 'plant', notes: 'Protect from extreme heat' },
      { name: 'Bush Tucker Plants', type: 'plant', notes: 'Evening watering only' }
    ],
    'February': [
      // Sowing
      { name: 'Native Spinach', type: 'sow' },
      { name: 'Bush Beans', type: 'sow', notes: 'Plant in partial shade' },
      // Planting
      { name: 'Bush Tucker Plants', type: 'plant' }
    ]
  }
}

// Helper function to get the appropriate guide
export function getRegionGuide(region: string) {
  if (region === 'Tasmania') {
    return TASMANIA_GUIDE
  }
  const regionInfo = REGION_DATA[region]
  return regionInfo ? CLIMATE_PLANTING_GUIDES[regionInfo.climateZone] : null
} 