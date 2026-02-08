'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

interface PlantInfo {
  name: string
  type: 'sow' | 'plant' | 'harvest'
}

interface PlantIssue {
  name: string
  symptoms: string
  solution: string
}

interface PlantDetails {
  name: string
  seedSpacing: string
  rowSpacing: string
  matureHeight: string
  timeToHarvest: string
  frostTolerant: boolean
  soil: string
  watering: string
  sunlight: string
  description: string
  commonIssues: PlantIssue[]
  maintenance: 'low' | 'medium' | 'high'  // Add this line
}

interface SeasonGuide {
  season: 'Summer' | 'Autumn' | 'Winter' | 'Spring'
  currentMonth: string
  keyTasks: string[]
  quickTips: string[]
}

const MONTHS = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December'
]

const PLANTING_GUIDE: { [key: string]: { [month: string]: PlantInfo[] } } = {
  'warm': {
    'January': [
      { name: 'Beans', type: 'plant' },
      { name: 'Tomatoes', type: 'harvest' },
      { name: 'Cucumbers', type: 'harvest' }
    ],
    'February': [
      { name: 'Sweet Corn', type: 'harvest' },
      { name: 'Capsicum', type: 'plant' }
    ],
    // Add entries for all months...
    'November': [
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Cucumbers', type: 'plant' },
      { name: 'Eggplant', type: 'plant' }
    ],
    'December': [
      { name: 'Sweet Corn', type: 'plant' },
      { name: 'Beans', type: 'harvest' }
    ]
  },
  'cool': {
    'January': [
      // Sowing
      { name: 'Beetroot', type: 'sow' },
      { name: 'Broccoli', type: 'sow' },
      { name: 'Brussels sprouts', type: 'sow' },
      { name: 'Winter Cabbage', type: 'sow' },
      { name: 'Kale', type: 'sow' },
      { name: 'Carrot', type: 'sow' },
      { name: 'Kohlrabi', type: 'sow' },
      { name: 'Spring Onion', type: 'sow' },
      { name: 'Silverbeet', type: 'sow' },
      { name: 'Swede', type: 'sow' },
      { name: 'Turnip', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Brussels sprouts', type: 'plant' },
      { name: 'Cabbage', type: 'plant' },
      { name: 'Capsicums', type: 'plant' },
      { name: 'Cauliflower', type: 'plant' },
      { name: 'Celery', type: 'plant' },
      { name: 'Leeks', type: 'plant' },
      { name: 'Lettuce', type: 'plant' }
    ],
    'February': [
      // Sowing
      { name: 'Broccoli', type: 'sow' },
      { name: 'Carrot', type: 'sow' },
      { name: 'Cabbage', type: 'sow' },
      { name: 'Cauliflower', type: 'sow' },
      { name: 'Brussels sprouts', type: 'sow' },
      { name: 'Leek', type: 'sow' },
      { name: 'Turnip', type: 'sow' },
      { name: 'Swede', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Chinese Greens', type: 'sow' },
      { name: 'Asian Roots', type: 'sow' },
      { name: 'Parsnip', type: 'sow' },
      // Planting
      { name: 'Broccoli', type: 'plant' },
      { name: 'Brussels sprouts', type: 'plant' },
      { name: 'Winter Cabbage', type: 'plant' },
      { name: 'Cauliflower', type: 'plant' },
      { name: 'Celery', type: 'plant' },
      { name: 'Leeks', type: 'plant' },
      { name: 'Lettuce', type: 'plant' }
    ],
    'March': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Onions', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Turnip', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' },
      { name: 'Winter Lettuce', type: 'plant' }
    ],
    'April': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'English Spinach', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'May': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Jerusalem Artichokes', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'June': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      // Planting
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'July': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' },
      { name: 'Garlic', type: 'plant' },
      { name: 'Shallots', type: 'plant' }
    ],
    'August': [
      // Sowing
      { name: 'Broad Beans', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Early Potatoes', type: 'sow' },
      { name: 'Early Carrots', type: 'sow' },
      // Planting
      { name: 'Asparagus', type: 'plant' },
      { name: 'Rhubarb', type: 'plant' },
      { name: 'Early Potatoes', type: 'plant' }
    ],
    'September': [
      // Sowing
      { name: 'Beetroot', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Parsnips', type: 'sow' },
      { name: 'Peas', type: 'sow' },
      { name: 'Potatoes', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Turnips', type: 'sow' },
      // Planting
      { name: 'Early Tomatoes', type: 'plant' },
      { name: 'Lettuce', type: 'plant' },
      { name: 'Onions', type: 'plant' },
      { name: 'Potatoes', type: 'plant' }
    ],
    'October': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicums', type: 'plant' },
      { name: 'Chillies', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Lettuce', type: 'plant' },
      { name: 'Sweet Potatoes', type: 'plant' }
    ],
    'November': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Beetroot', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Pumpkin', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      { name: 'Zucchini', type: 'sow' },
      // Planting
      { name: 'Tomatoes', type: 'plant' },
      { name: 'Capsicums', type: 'plant' },
      { name: 'Chillies', type: 'plant' },
      { name: 'Eggplant', type: 'plant' },
      { name: 'Lettuce', type: 'plant' }
    ],
    'December': [
      // Sowing
      { name: 'Beans', type: 'sow' },
      { name: 'Sweet Corn', type: 'sow' },
      { name: 'Cucumber', type: 'sow' },
      { name: 'Lettuce', type: 'sow' },
      { name: 'Spring Onions', type: 'sow' },
      { name: 'Radish', type: 'sow' },
      // Planting
      { name: 'Leeks', type: 'plant' },
      { name: 'Lettuce', type: 'plant' }
    ]
  }
}

const PLANT_DETAILS: { [key: string]: PlantDetails } = {
  'Tomatoes': {
    name: 'Tomatoes',
    seedSpacing: '45-60cm',
    rowSpacing: '90-120cm',
    matureHeight: '1.2-1.8m',
    timeToHarvest: '60-80 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular deep watering, keep soil consistently moist',
    sunlight: 'Full sun (6-8 hours daily)',
    description: 'Tomatoes are warm-season plants that produce juicy fruits. They require support as they grow and are heavy feeders.',
    commonIssues: [
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark, sunken spots at the bottom of fruits',
        solution: 'Maintain consistent watering and ensure adequate calcium in soil'
      },
      {
        name: 'Early Blight',
        symptoms: 'Dark spots on leaves with concentric rings',
        solution: 'Remove affected leaves, improve air circulation, avoid wetting foliage'
      },
      {
        name: 'Leaf Curl',
        symptoms: 'Leaves curl upward and become thick and leathery',
        solution: 'Check for aphids, adjust watering, protect from extreme temperatures'
      }
    ],
    maintenance: 'high',  // Needs regular pruning, support, disease monitoring
  },
  'Lettuce': {
    name: 'Lettuce',
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '15-30cm',
    timeToHarvest: '45-65 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering, keep soil moist but not waterlogged',
    sunlight: 'Full sun to partial shade',
    description: "Lettuce is a cool-season crop that's perfect for beginners. It can be harvested as whole heads or individual leaves.",
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Rapid stem growth and bitter leaves',
        solution: 'Plant in cooler weather, provide shade in hot weather'
      },
      {
        name: 'Tip Burn',
        symptoms: 'Brown edges on inner leaves',
        solution: 'Maintain consistent moisture and adequate calcium levels'
      }
    ],
    maintenance: 'low',  // Easy to grow, minimal care needed
  },
  'Beans': {
    name: 'Beans',
    seedSpacing: '10-15cm',
    rowSpacing: '45-60cm',
    matureHeight: '30-200cm (depending on variety)',
    timeToHarvest: '50-65 days',
    frostTolerant: false,
    soil: 'Well-draining soil with pH 6.0-6.5',
    watering: 'Regular watering, especially when flowering',
    sunlight: 'Full sun',
    description: 'Beans are easy to grow and come in bush or climbing varieties. They fix nitrogen in the soil, making them great companion plants.',
    commonIssues: [
      {
        name: 'Bean Rust',
        symptoms: 'Reddish-brown spots on leaves and pods',
        solution: 'Improve air circulation, avoid watering foliage, remove infected plants'
      },
      {
        name: 'Bean Mosaic Virus',
        symptoms: 'Mottled yellow and green leaves, stunted growth',
        solution: 'Remove infected plants, control aphids, plant resistant varieties'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Cucumbers': {
    name: 'Cucumbers',
    seedSpacing: '30-45cm',
    rowSpacing: '120-150cm',
    matureHeight: '30cm (bush) or 180cm+ (vining)',
    timeToHarvest: '55-70 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture, water deeply',
    sunlight: 'Full sun',
    description: 'Cucumbers thrive in warm weather and need support if growing vining varieties. Regular harvesting encourages continued production.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves, yellowing foliage',
        solution: 'Improve air circulation, avoid overhead watering, use resistant varieties'
      },
      {
        name: 'Cucumber Beetles',
        symptoms: 'Holes in leaves, stunted growth, bacterial wilt',
        solution: 'Use row covers, handpick beetles, apply organic insecticides if needed'
      },
      {
        name: 'Angular Leaf Spot',
        symptoms: 'Angular brown spots on leaves, holes in leaves',
        solution: 'Rotate crops, avoid overhead watering, remove infected plants'
      }
    ],
    maintenance: 'medium',  // Needs trellising, regular harvesting
  },
  'Sweet Corn': {
    name: 'Sweet Corn',
    seedSpacing: '20-30cm',
    rowSpacing: '75-90cm',
    matureHeight: '180-240cm',
    timeToHarvest: '70-100 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering, especially during tasseling',
    sunlight: 'Full sun',
    description: 'Sweet corn needs to be planted in blocks for proper pollination. Each stalk typically produces 1-2 ears of corn.',
    commonIssues: [
      {
        name: 'Corn Earworm',
        symptoms: 'Damage to ear tips, feeding damage on kernels',
        solution: 'Apply mineral oil to silk tips, use resistant varieties'
      },
      {
        name: 'Smut',
        symptoms: 'Large gray/black galls on ears or stalks',
        solution: 'Remove and destroy infected parts, maintain plant vigor'
      },
      {
        name: 'Raccoon Damage',
        symptoms: 'Pulled down stalks, partially eaten ears',
        solution: 'Install electric fencing, harvest as soon as corn is ready'
      }
    ],
    maintenance: 'low',  // Low maintenance, easy to grow
  },
  'Capsicum': {
    name: 'Capsicum',
    seedSpacing: '30-45cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-75cm',
    timeToHarvest: '60-90 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture, avoid overwatering',
    sunlight: 'Full sun',
    description: "Capsicums (bell peppers) prefer warm conditions and can be harvested at any stage, though they're sweetest when fully colored.",
    commonIssues: [
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark, sunken spots at bottom of fruits',
        solution: 'Maintain consistent watering, ensure adequate calcium'
      },
      {
        name: 'Sunscald',
        symptoms: 'White or yellow patches on fruits',
        solution: 'Ensure adequate leaf cover, provide shade if necessary'
      }
    ],
    maintenance: 'medium',  // Needs support, regular feeding
  },
  'Eggplant': {
    name: 'Eggplant',
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '60-120cm',
    timeToHarvest: '65-80 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Eggplants are heat-loving plants that produce glossy fruits. They may need support as the fruits develop.',
    commonIssues: [
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves, stunted growth',
        solution: 'Use row covers, apply diatomaceous earth, keep garden clean'
      },
      {
        name: 'Verticillium Wilt',
        symptoms: 'Yellowing leaves, wilting despite watering',
        solution: 'Plant resistant varieties, rotate crops, improve drainage'
      },
      {
        name: 'Spider Mites',
        symptoms: 'Stippled leaves, fine webbing on undersides',
        solution: 'Increase humidity, spray with water, use insecticidal soap'
      }
    ],
    maintenance: 'low',  // Low maintenance, easy to grow
  },
  'Carrots': {
    name: 'Carrots',
    seedSpacing: '5-7cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '70-80 days',
    frostTolerant: true,
    soil: 'Deep, loose soil with pH 6.0-6.8, free of rocks',
    watering: 'Regular watering, keep soil moist',
    sunlight: 'Full sun to partial shade',
    description: "Carrots need deep, loose soil to develop straight roots. They're great for succession planting throughout the season.",
    commonIssues: [
      {
        name: 'Carrot Root Fly',
        symptoms: 'Tunnels in roots, wilting foliage',
        solution: 'Use physical barriers, companion plant with onions or leeks'
      },
      {
        name: 'Forking',
        symptoms: 'Split or forked roots',
        solution: 'Ensure loose soil free of stones, avoid fresh manure'
      }
    ],
    maintenance: 'low',  // Once planted, needs little attention
  },
  'Broccoli': {
    name: 'Broccoli',
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '60-90cm',
    timeToHarvest: '50-70 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering, keep soil moist',
    sunlight: 'Full sun',
    description: 'Broccoli is a cool-season crop that produces side shoots after the main head is harvested, extending the harvest period.',
    commonIssues: [
      {
        name: 'Club Root',
        symptoms: 'Swollen, distorted roots, stunted growth',
        solution: 'Improve drainage, add lime to raise pH, practice crop rotation'
      },
      {
        name: 'Cabbage White Butterfly',
        symptoms: 'Holes in leaves, presence of green caterpillars',
        solution: 'Use netting or row covers, handpick caterpillars, encourage beneficial insects'
      }
    ],
    maintenance: 'medium',  // Needs pest monitoring, regular feeding
  },
  'Cauliflower': {
    name: 'Cauliflower',
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '60-90cm',
    timeToHarvest: '55-100 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture',
    sunlight: 'Full sun',
    description: 'Cauliflower needs consistent temperatures and moisture to produce good heads. Leaves may need to be tied over the head to blanch it.',
    commonIssues: [
      {
        name: 'Buttoning',
        symptoms: 'Small heads form prematurely',
        solution: 'Maintain steady growth, avoid temperature stress'
      },
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Adjust soil pH to 7.0, improve drainage, practice crop rotation'
      },
      {
        name: 'Browning',
        symptoms: 'Brown spots on heads, discoloration',
        solution: 'Tie leaves over heads to blanch, harvest at proper time'
      }
    ],
    maintenance: 'medium',  // Needs regular pruning, support
  },
  'Peas': {
    name: 'Peas',
    seedSpacing: '5-7cm',
    rowSpacing: '45-60cm',
    matureHeight: '60-180cm',
    timeToHarvest: '60-70 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering, avoid overwatering',
    sunlight: 'Full sun to partial shade',
    description: 'Peas are cool-season crops that fix nitrogen in the soil. They need support for climbing and produce better with regular harvesting.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves',
        solution: 'Improve air circulation, avoid overhead watering, remove affected leaves'
      },
      {
        name: 'Pea Moth',
        symptoms: 'Small holes in pods, damaged peas',
        solution: 'Time planting to avoid moth season, use pheromone traps'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Potatoes': {
    name: 'Potatoes',
    seedSpacing: '30-40cm',
    rowSpacing: '75-90cm',
    matureHeight: '45-60cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Loose, well-draining soil with pH 5.0-6.0',
    watering: 'Regular watering, especially during tuber formation',
    sunlight: 'Full sun',
    description: "Potatoes need to be hilled as they grow to protect developing tubers from sunlight. They're ready to harvest when the plants die back.",
    commonIssues: [
      {
        name: 'Potato Blight',
        symptoms: 'Brown patches on leaves, rotting tubers',
        solution: 'Remove affected foliage, improve air flow, use resistant varieties'
      },
      {
        name: 'Scab',
        symptoms: 'Rough, corky patches on tubers',
        solution: 'Maintain consistent soil moisture, avoid adding lime'
      }
    ],
    maintenance: 'medium',  // Needs regular watering, disease monitoring
  },
  'Broad Beans': {
    name: 'Broad Beans',
    seedSpacing: '20-25cm',
    rowSpacing: '60-75cm',
    matureHeight: '90-120cm',
    timeToHarvest: '80-100 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering, especially when flowering',
    sunlight: 'Full sun',
    description: 'Broad beans are hardy plants that can withstand cold temperatures. They improve soil by fixing nitrogen.',
    commonIssues: [
      {
        name: 'Chocolate Spot',
        symptoms: 'Brown spots on leaves and stems',
        solution: 'Improve air circulation, avoid overcrowding, spray with fungicide if severe'
      },
      {
        name: 'Black Bean Aphid',
        symptoms: 'Black aphids clustering on growing tips',
        solution: 'Pinch out infected tips, encourage beneficial insects'
      },
      {
        name: 'Bean Rust',
        symptoms: 'Orange-brown pustules on leaves',
        solution: 'Remove infected leaves, improve spacing, use resistant varieties'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Brussels sprouts': {
    name: 'Brussels sprouts',
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '75-100cm',
    timeToHarvest: '100-120 days',
    frostTolerant: true,
    soil: 'Rich, firm soil with pH 6.0-6.8',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Brussels sprouts are slow-growing, cool-season vegetables that improve in flavor after light frosts.',
    commonIssues: [
      {
        name: 'Loose Sprouts',
        symptoms: 'Sprouts not forming tight heads',
        solution: 'Remove lower leaves as sprouts form, maintain steady growth'
      },
      {
        name: 'Cabbage Worms',
        symptoms: 'Holes in leaves, green caterpillars present',
        solution: 'Handpick caterpillars, use BT spray, cover with netting'
      },
      {
        name: 'Yellow Leaves',
        symptoms: 'Lower leaves turning yellow',
        solution: 'Check nitrogen levels, remove old leaves, ensure proper spacing'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Garlic': {
    name: 'Garlic',
    seedSpacing: '10-15cm',
    rowSpacing: '30-40cm',
    matureHeight: '45-60cm',
    timeToHarvest: '240-270 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering until bulb formation',
    sunlight: 'Full sun',
    description: 'Garlic is planted in autumn or winter for harvest the following summer. Each clove will produce a new bulb.',
    commonIssues: [
      {
        name: 'Rust',
        symptoms: 'Orange pustules on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'White Rot',
        symptoms: 'Yellowing leaves, rotting bulbs',
        solution: 'Long crop rotation, plant disease-free cloves'
      }
    ],
    maintenance: 'low',  // Plant and mostly leave alone
  },
  'Radish': {
    name: 'Radish',
    seedSpacing: '2-5cm',
    rowSpacing: '15-30cm',
    matureHeight: '15-20cm',
    timeToHarvest: '21-30 days',
    frostTolerant: true,
    soil: 'Light, well-draining soil with pH 6.0-7.0',
    watering: 'Consistent moisture',
    sunlight: 'Full sun to partial shade',
    description: "Radishes are quick-growing vegetables perfect for succession planting. They're ready to harvest in just a few weeks.",
    commonIssues: [
      {
        name: 'Root Maggots',
        symptoms: 'Tunnels in roots, wilting leaves',
        solution: 'Use row covers, practice crop rotation, maintain clean beds'
      },
      {
        name: 'Cracking',
        symptoms: 'Split or cracked roots',
        solution: 'Maintain consistent moisture, harvest promptly when mature'
      },
      {
        name: 'Woody Texture',
        symptoms: 'Tough, fibrous roots',
        solution: 'Harvest before overmaturity, avoid stress conditions'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Onions': {
    name: 'Onions',
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '45-60cm',
    timeToHarvest: '100-120 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering until bulb formation',
    sunlight: 'Full sun',
    description: 'Onions need long days and cool weather to develop properly. Stop watering when bulbs begin to mature.',
    commonIssues: [
      {
        name: 'White Rot',
        symptoms: 'Yellow leaves, rotting bulbs, white fungal growth',
        solution: 'Practice long crop rotation, avoid planting in infected soil'
      },
      {
        name: 'Neck Rot',
        symptoms: 'Soft, water-soaked tissue at neck',
        solution: 'Ensure proper drying before storage, cure properly'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Silverbeet': {
    name: 'Silverbeet',
    seedSpacing: '30cm',
    rowSpacing: '45-60cm',
    matureHeight: '40-60cm',
    timeToHarvest: '50-60 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Also known as Swiss Chard, Silverbeet is a hardy leafy green that can be harvested continuously.',
    commonIssues: [
      {
        name: 'Leaf Miners',
        symptoms: 'Serpentine tunnels in leaves',
        solution: 'Remove affected leaves, use row covers, encourage beneficial insects'
      },
      {
        name: 'Cercospora Leaf Spot',
        symptoms: 'Circular spots with purple margins',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Crown Rot',
        symptoms: 'Rotting at base of plant',
        solution: 'Improve drainage, avoid overwatering, maintain clean garden'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Zucchini': {
    name: 'Zucchini',
    seedSpacing: '60-90cm',
    rowSpacing: '90-120cm',
    matureHeight: '60-90cm',
    timeToHarvest: '50-70 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Zucchini plants are prolific producers. Regular harvesting encourages continued production.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powder on leaves, reduced vigor',
        solution: 'Space plants well, water at base, use resistant varieties'
      },
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark rot at blossom end of fruit',
        solution: 'Maintain even soil moisture, ensure adequate calcium'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Rhubarb': {
    name: 'Rhubarb',
    seedSpacing: '90-120cm',
    rowSpacing: '90-120cm',
    matureHeight: '60-90cm',
    timeToHarvest: '1-2 years',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Rhubarb is a perennial that produces edible stalks. Only harvest after the first year of growth.',
    maintenance: 'low',
    commonIssues: []
  },
  'Winter Cabbage': {
    name: 'Winter Cabbage',
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '40-60cm',
    timeToHarvest: '90-120 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Winter cabbage is frost hardy and develops better flavor after light frosts. Needs firm soil and consistent moisture.',
    commonIssues: [
      {
        name: 'Clubroot',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Adjust soil pH to 7.2, improve drainage, rotate crops'
      },
      {
        name: 'Diamond Back Moth',
        symptoms: 'Small holes in leaves, caterpillar presence',
        solution: 'Use row covers, encourage natural predators, apply organic sprays'
      },
      {
        name: 'Black Rot',
        symptoms: 'Yellow V-shaped lesions on leaf edges',
        solution: 'Use disease-free seeds, rotate crops, remove infected plants'
      }
    ],
    maintenance: 'medium',  // Needs regular watering, pest monitoring
  },
  'Kale': {
    name: 'Kale',
    seedSpacing: '30-45cm',
    rowSpacing: '45-60cm',
    matureHeight: '60-90cm',
    timeToHarvest: '50-65 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.2',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Kale is a hardy green that becomes sweeter after frost. Can be harvested continuously as needed.',
    commonIssues: [
      {
        name: 'Aphids',
        symptoms: 'Curled leaves, sticky residue, small insects',
        solution: 'Spray with strong water jet, encourage ladybugs, use insecticidal soap'
      },
      {
        name: 'Downy Mildew',
        symptoms: 'Yellow patches on leaves, grey fuzz underneath',
        solution: 'Improve air circulation, water at base, remove infected leaves'
      },
      {
        name: 'Cabbage Worms',
        symptoms: 'Holes in leaves, green caterpillars',
        solution: 'Handpick caterpillars, use BT spray, cover with netting'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Kohlrabi': {
    name: 'Kohlrabi',
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-40cm',
    timeToHarvest: '45-60 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.5',
    watering: 'Consistent moisture',
    sunlight: 'Full sun',
    description: 'Kohlrabi forms a swollen stem above ground. Harvest when the bulb reaches tennis ball size for best flavor.',
    commonIssues: [
      {
        name: 'Splitting',
        symptoms: 'Cracked or split bulbs',
        solution: 'Harvest at proper size, maintain consistent moisture'
      },
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Adjust soil pH, improve drainage, practice crop rotation'
      },
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers, apply diatomaceous earth'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Spring Onion': {
    name: 'Spring Onion',
    seedSpacing: '2-5cm',
    rowSpacing: '15-30cm',
    matureHeight: '30-45cm',
    timeToHarvest: '60-70 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Also known as scallions, spring onions can be harvested young for mild flavor or left to develop stronger taste.',
    commonIssues: [
      {
        name: 'Damping Off',
        symptoms: 'Seedlings collapse at soil level',
        solution: 'Improve drainage, avoid overcrowding, use sterile soil'
      },
      {
        name: 'Thrips',
        symptoms: 'Silvery streaks on leaves, distorted growth',
        solution: 'Use insecticidal soap, maintain garden cleanliness'
      },
      {
        name: 'Purple Blotch',
        symptoms: 'Purple lesions on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    maintenance: 'low',  // Generally trouble-free
  },
  'Swede': {
    name: 'Swede',
    seedSpacing: '15-20cm',
    rowSpacing: '45-60cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-100 days',
    frostTolerant: true,
    soil: 'Deep, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Swedes are root vegetables that improve in flavor after frost. They store well and are rich in nutrients.',
    commonIssues: [
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, swollen roots',
        solution: 'Adjust soil pH, improve drainage, rotate crops'
      },
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers early in season, maintain clean beds'
      },
      {
        name: 'Brown Heart',
        symptoms: 'Internal browning of roots',
        solution: 'Ensure adequate boron in soil, maintain consistent moisture'
      }
    ],
    maintenance: 'low'
  },
  'Turnip': {
    name: 'Turnip',
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '40-55 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Both turnip roots and greens are edible. Young turnips are tender and mild-flavored.',
    maintenance: 'low',
    commonIssues: []
  },
  'English Spinach': {
    name: 'English Spinach',
    seedSpacing: '7-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '40-50 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'English spinach prefers cool weather and will bolt in heat. Harvest outer leaves for continuous production.',
    maintenance: 'low',
    commonIssues: []
  },
  'Shallots': {
    name: 'Shallots',
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-120 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering',
    sunlight: 'Full sun',
    description: 'Shallots have a milder, more refined flavor than onions. Each bulb planted will multiply into a cluster.',
    maintenance: 'low',
    commonIssues: []
  },
  'Jerusalem Artichokes': {
    name: 'Jerusalem Artichokes',
    seedSpacing: '30-45cm',
    rowSpacing: '90-120cm',
    matureHeight: '150-300cm',
    timeToHarvest: '120-150 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Also known as sunchokes, these perennial plants produce edible tubers. Can spread vigorously once established.',
    maintenance: 'low',
    commonIssues: []
  },
  'Asparagus': {
    name: 'Asparagus',
    seedSpacing: '30-45cm',
    rowSpacing: '120-150cm',
    matureHeight: '120-150cm',
    timeToHarvest: '2-3 years',
    frostTolerant: true,
    soil: 'Deep, rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering during growing season',
    sunlight: 'Full sun',
    description: 'Asparagus is a long-lived perennial. Do not harvest for the first 2-3 years to allow strong root development.',
    maintenance: 'medium',
    commonIssues: []
  },
  'Early Potatoes': {
    name: 'Early Potatoes',
    seedSpacing: '30-40cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-60cm',
    timeToHarvest: '60-90 days',
    frostTolerant: false,
    soil: 'Light, well-draining soil with pH 5.0-6.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Early potatoes mature more quickly than main crop varieties. Plant certified disease-free seed potatoes.',
    maintenance: 'medium',
    commonIssues: []
  },
  'Early Carrots': {
    name: 'Early Carrots',
    seedSpacing: '5-7cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '55-65 days',
    frostTolerant: true,
    soil: 'Deep, loose soil with pH 6.0-6.8',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Early carrots are typically smaller but sweeter than main crop varieties. Ideal for succession planting.',
    maintenance: 'low',
    commonIssues: []
  },
  'Parsnips': {
    name: 'Parsnips',
    seedSpacing: '10-15cm',
    rowSpacing: '45-60cm',
    matureHeight: '45-60cm',
    timeToHarvest: '120-180 days',
    frostTolerant: true,
    soil: 'Deep, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Parsnips develop sweeter flavor after frost. Seeds can be slow to germinate, keep soil consistently moist.',
    maintenance: 'low',
    commonIssues: []
  },
  'Chillies': {
    name: 'Chillies',
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-90cm',
    timeToHarvest: '60-95 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering',
    sunlight: 'Full sun',
    description: 'Chillies prefer warm conditions and will produce more fruit in hot weather. Can be grown in containers.',
    maintenance: 'medium',
    commonIssues: []
  },
  'Sweet Potatoes': {
    name: 'Sweet Potatoes',
    seedSpacing: '30-45cm',
    rowSpacing: '90-120cm',
    matureHeight: '15-30cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Light, well-draining soil with pH 5.5-6.5',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Sweet potatoes need warm soil to develop well. Harvest when vines yellow or before first frost.',
    maintenance: 'medium',
    commonIssues: []
  },
  'Pumpkin': {
    name: 'Pumpkin',
    seedSpacing: '90-120cm',
    rowSpacing: '180-240cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Pumpkins need plenty of space to spread. Harvest when the skin is hard and the stem begins to dry.',
    maintenance: 'medium',
    commonIssues: []
  }
}

const SEASON_GUIDES: { [key: string]: SeasonGuide } = {
  'Summer': {
    season: 'Summer',
    currentMonth: 'February',
    keyTasks: [
      'Harvest tomatoes, corn, and summer crops at their peak',
      'Begin preparing beds for autumn plantings',
      'Collect seeds from summer vegetables',
      'Start sowing winter brassicas in seed trays'
    ],
    quickTips: [
      'Plant late summer lettuce in shaded areas',
      'Last chance to plant quick-growing summer crops',
      'Order autumn/winter vegetable seeds now'
    ]
  },
  'Autumn': {
    season: 'Autumn',
    currentMonth: 'April',
    keyTasks: [
      'Plant winter brassicas and root vegetables',
      'Add compost to depleted summer beds',
      'Sow broad beans and peas',
      'Plant garlic and onion sets'
    ],
    quickTips: [
      'Mulch beds before winter rains',
      'Protect young seedlings from early frosts',
      'Clean and store summer gardening tools'
    ]
  },
  'Winter': {
    season: 'Winter',
    currentMonth: 'July',
    keyTasks: [
      'Plant bare-root fruit trees and shrubs',
      'Continue harvesting winter vegetables',
      'Protect frost-sensitive plants',
      'Maintain winter crops like brassicas'
    ],
    quickTips: [
      'Check winter protection structures',
      'Plan your spring garden layout',
      'Order seeds for spring planting'
    ]
  },
  'Spring': {
    season: 'Spring',
    currentMonth: 'October',
    keyTasks: [
      'Direct sow root vegetables',
      'Plant out summer seedlings',
      'Prepare supports for climbing plants',
      'Begin regular feeding schedule'
    ],
    quickTips: [
      'Watch for late frosts',
      'Harden off seedlings gradually',
      'Start succession planting leafy greens'
    ]
  }
}

// Simplified getCurrentSeason function
const getCurrentSeason = (): SeasonGuide => {
  const month = new Date().getMonth()
  
  if (month >= 11 || month <= 1) return SEASON_GUIDES['Summer']
  if (month >= 2 && month <= 4) return SEASON_GUIDES['Autumn']
  if (month >= 5 && month <= 7) return SEASON_GUIDES['Winter']
  return SEASON_GUIDES['Spring']
}

function getClimateZone(state: string, city: string): 'warm' | 'cool' {
  const northernCities = [
    'Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns', 'Darwin',
    'Townsville', 'Broome', 'Port Hedland'
  ]
  const warmStates = ['Queensland', 'Northern Territory']
  
  if (warmStates.includes(state) || northernCities.includes(city)) {
    return 'warm'
  }
  return 'cool'
}

function getMonthSeason(month: string): string {
  const seasons = {
    'Summer': ['December', 'January', 'February'],
    'Autumn': ['March', 'April', 'May'],
    'Winter': ['June', 'July', 'August'],
    'Spring': ['September', 'October', 'November']
  }

  for (const [season, months] of Object.entries(seasons)) {
    if (months.includes(month)) {
      return season
    }
  }
  return ''
}

function FullListModal({ 
  isOpen, 
  onClose, 
  title, 
  items, 
  type,
  onItemClick 
}: { 
  isOpen: boolean
  onClose: () => void
  title: string
  items: PlantInfo[]
  type: 'sow' | 'plant'
  onItemClick: (name: string) => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-md w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <ul className="space-y-2">
            {items.map(item => (
              <li 
                key={item.name}
                className={`cursor-pointer flex items-center gap-2 p-2 rounded-lg hover:bg-${type === 'sow' ? 'blue' : 'green'}-50`}
                onClick={() => {
                  onItemClick(item.name)
                  onClose()
                }}
              >
                <span className={`w-2 h-2 rounded-full bg-${type === 'sow' ? 'blue' : 'green'}-400`}></span>
                {item.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function MonthCard({ month, activities }: { month: string; activities: PlantInfo[] }) {
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null)
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false)
  const [showFullList, setShowFullList] = useState<'sow' | 'plant' | null>(null)

  const handlePlantClick = (plantName: string) => {
    const plantDetails = PLANT_DETAILS[plantName]
    if (plantDetails) {
      setSelectedPlant(plantDetails)
      setIsPlantModalOpen(true)
    }
  }

  const sowActivities = activities.filter(a => a.type === 'sow')
  const plantActivities = activities.filter(a => a.type === 'plant')

  const MAX_ITEMS = 7

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col h-[420px]">
          {/* Month Header - updated with more distinct colors */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4">
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold text-white">
                {month}
              </h3>
              <span className="text-sm font-medium text-slate-200">{getMonthSeason(month)}</span>
            </div>
          </div>

          {/* Content Container */}
          <div className="flex-grow grid grid-cols-2 gap-6 p-6">
            {/* Sowing Section */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                <h4 className="font-medium text-blue-800 text-lg">SOW</h4>
              </div>
              <ul className="space-y-2 text-base text-gray-600">
                {sowActivities.length > 0 ? (
                  <>
                    {sowActivities.slice(0, MAX_ITEMS).map(a => (
                      <li 
                        key={a.name} 
                        className="cursor-pointer hover:text-blue-600 flex items-center gap-2"
                        onClick={() => handlePlantClick(a.name)}
                      >
                        <span className="w-2 h-2 rounded-full bg-blue-200"></span>
                        {a.name}
                      </li>
                    ))}
                    {sowActivities.length > MAX_ITEMS && (
                      <li 
                        className="cursor-pointer text-blue-600 hover:text-blue-700 mt-3 flex items-center gap-1"
                        onClick={() => setShowFullList('sow')}
                      >
                        <span className="text-sm">Show {sowActivities.length - MAX_ITEMS} more...</span>
                      </li>
                    )}
                  </>
                ) : (
                  <li className="text-gray-400 italic">Nothing to sow</li>
                )}
              </ul>
            </div>

            {/* Planting Section */}
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <h4 className="font-medium text-green-800 text-lg">PLANT</h4>
              </div>
              <ul className="space-y-2 text-base text-gray-600">
                {plantActivities.length > 0 ? (
                  <>
                    {plantActivities.slice(0, MAX_ITEMS).map(a => (
                      <li 
                        key={a.name} 
                        className="cursor-pointer hover:text-green-600 flex items-center gap-2"
                        onClick={() => handlePlantClick(a.name)}
                      >
                        <span className="w-2 h-2 rounded-full bg-green-200"></span>
                        {a.name}
                      </li>
                    ))}
                    {plantActivities.length > MAX_ITEMS && (
                      <li 
                        className="cursor-pointer text-green-600 hover:text-green-700 mt-3 flex items-center gap-1"
                        onClick={() => setShowFullList('plant')}
                      >
                        <span className="text-sm">Show {plantActivities.length - MAX_ITEMS} more...</span>
                      </li>
                    )}
                  </>
                ) : (
                  <li className="text-gray-400 italic">Nothing to plant</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <PlantModal 
        plant={selectedPlant}
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
      />

      <FullListModal
        isOpen={showFullList !== null}
        onClose={() => setShowFullList(null)}
        title={`${month} - ${showFullList === 'sow' ? 'Sow' : 'Plant'}`}
        items={showFullList === 'sow' ? sowActivities : plantActivities}
        type={showFullList || 'sow'}
        onItemClick={handlePlantClick}
      />
    </>
  )
}

function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-80 bg-white shadow-lg z-10">
      {/* App Name */}
      <div className="p-8 border-b">
        <h1 className="text-2xl font-bold text-green-800 flex items-center gap-3">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          GrowGuide
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="p-6">
        <ul className="space-y-3">
          <li>
            <Link 
              href="/planting-calendar"
              className="flex items-center gap-4 px-5 py-4 text-lg text-green-800 bg-green-50 rounded-lg font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Planting Calendar
            </Link>
          </li>
          <li>
            <Link 
              href="/my-garden"
              className="flex items-center gap-4 px-5 py-4 text-lg text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
              My Garden
            </Link>
          </li>
          <li>
            <Link 
              href="/resources"
              className="flex items-center gap-4 px-5 py-4 text-lg text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Resources
            </Link>
          </li>
          <li>
            <Link 
              href="/common-issues"
              className="flex items-center gap-4 px-5 py-4 text-lg text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Common Issues
            </Link>
          </li>
          <li>
            <Link 
              href="/settings"
              className="flex items-center gap-4 px-5 py-4 text-lg text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </li>
          <li>
            <Link 
              href="/bed-buddies"
              className="flex items-center gap-4 px-5 py-4 text-lg text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Bed Buddies
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

function PlantModal({ plant, isOpen, onClose }: { plant: PlantDetails | null; isOpen: boolean; onClose: () => void }) {
  if (!isOpen || !plant) return null

  const [isIssuesExpanded, setIsIssuesExpanded] = useState(false)

  const getMaintenanceColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-100 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-green-800">{plant.name}</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2 italic">{plant.description}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Growing Requirements */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-green-800 text-lg mb-4">
                Growing Requirements
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <div>
                    <span className="font-medium block text-green-700">Spacing</span>
                    <span className="text-green-600">Seeds: {plant.seedSpacing}, Rows: {plant.rowSpacing}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-green-700">Mature Height</span>
                    <span className="text-green-600">{plant.matureHeight}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-green-700">Time to Harvest</span>
                    <span className="text-green-600">{plant.timeToHarvest}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-green-700">Frost Tolerance</span>
                    <span className="text-green-600">{plant.frostTolerant ? 'Frost Tolerant' : 'Not Frost Tolerant'}</span>
                  </div>
                </li>
                {/* Add Maintenance Level */}
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-green-700">Maintenance Level</span>
                    <span className={`${getMaintenanceColor(plant.maintenance)} capitalize`}>
                      {plant.maintenance} Maintenance
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-800 text-lg mb-4">
                Care Instructions
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-blue-700">Soil Requirements</span>
                    <span className="text-blue-600">{plant.soil}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-blue-700">Watering Needs</span>
                    <span className="text-blue-600">{plant.watering}</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div>
                    <span className="font-medium block text-blue-700">Sunlight</span>
                    <span className="text-blue-600">{plant.sunlight}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Common Issues Collapsible Section */}
          {plant.commonIssues && plant.commonIssues.length > 0 && (
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={() => setIsIssuesExpanded(!isIssuesExpanded)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="font-semibold text-red-800 text-lg">
                    Common Issues
                  </h3>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${isIssuesExpanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expandable Content */}
              <div className={`mt-4 space-y-4 transition-all duration-200 ${isIssuesExpanded ? 'block' : 'hidden'}`}>
                <div className="bg-red-50 rounded-lg p-6">
                  {plant.commonIssues.map((issue, index) => (
                    <div key={index} className="border-b border-red-100 last:border-0 pb-4 last:pb-0 mt-4 first:mt-0">
                      <h4 className="font-medium text-red-700 mb-2">{issue.name}</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 font-medium">Symptoms:</span>
                          <span className="text-red-600">{issue.symptoms}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 font-medium">Solution:</span>
                          <span className="text-red-600">{issue.solution}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Add this new component for the search functionality
function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 0) {
      const results = Object.keys(PLANT_DETAILS).filter(plantName =>
        plantName.toLowerCase().includes(term.toLowerCase())
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handlePlantSelect = (plantName: string) => {
    const plant = PLANT_DETAILS[plantName]
    if (plant) {
      setSelectedPlant(plant)
      setIsModalOpen(true)
      setSearchTerm('')
      setSearchResults([])
    }
  }

  return (
    <div className="relative">
      <div className="w-full">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a plant..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent pl-10"
          />
          <svg 
            className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Search Results Dropdown - Simplified */}
      {searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <ul className="py-2">
            {searchResults.map((plantName) => (
              <li 
                key={plantName}
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                onClick={() => handlePlantSelect(plantName)}
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="font-medium text-gray-800">{plantName}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <PlantModal
        plant={selectedPlant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default function PlantingCalendar() {
  const searchParams = useSearchParams()
  
  if (!searchParams) {
    return <div>Loading...</div>
  }
  
  const state = searchParams.get('state')
  const city = searchParams.get('city')

  if (!state || !city) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl text-red-600 mb-4">Location Not Selected</h1>
            <Link href="/" className="text-green-600 hover:text-green-700 underline">
              Return to location selection
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const climateZone = getClimateZone(state, city)
  const plantingGuide = PLANTING_GUIDE[climateZone]

  // Create rows of months (4 rows, 3 months each) instead of columns
  const monthRows = [
    MONTHS.slice(0, 3),    // First row: Jan, Feb, Mar
    MONTHS.slice(3, 6),    // Second row: Apr, May, Jun
    MONTHS.slice(6, 9),    // Third row: Jul, Aug, Sep
    MONTHS.slice(9, 12),   // Fourth row: Oct, Nov, Dec
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-80 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
              <Link 
                href="/"
                className="inline-flex items-center text-green-600 hover:text-green-700 mb-6 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to location selection
              </Link>
              
              {/* Title and Search Bar Container */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-green-800">
                  Planting Calendar
                </h1>
                {/* Search Bar */}
                <div className="w-96">
                  <PlantSearch />
                </div>
              </div>

              {/* Location Info */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{city}, {state}</span>
                <span className="mx-2">•</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">
                  {climateZone === 'warm' ? '🌞 Warm Climate' : '❄️ Cool Climate'}
                </span>
              </div>
            </div>

            {/* Streamlined Season Guide */}
            <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Season Guide
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {getCurrentSeason().season}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {getCurrentSeason().currentMonth}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  className="text-green-600 hover:text-green-700 flex items-center gap-2"
                  onClick={() => {/* Add navigation to detailed season page */}}
                >
                  More about {getCurrentSeason().season.toLowerCase()}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Key Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Key Tasks
                  </h3>
                  <ul className="space-y-2">
                    {getCurrentSeason().keyTasks.map((task, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Tips */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Quick Tips
                  </h3>
                  <ul className="space-y-2">
                    {getCurrentSeason().quickTips.map((tip, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Calendar Grid - updated to rows */}
            <div className="space-y-6">
              {monthRows.map((months, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-6">
                  {months.map(month => (
                    <MonthCard
                      key={month}
                      month={month}
                      activities={plantingGuide[month] || []}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 