'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
// Remove the MonthCard import since it's defined in this file
// import { MonthCard } from '../components/MonthCard'

// Move these interfaces to types/plants.ts
import { PlantInfo, PlantDetails, PlantIssue, SeasonGuide } from '../types/plants'
import { useProfile } from '../context/ProfileContext'
import { Profile } from '../types/profile'
import { getNormalizedLocation, type GardenLocation } from '../utils/location'
import { getClimateZone } from '../utils/climate'

const MONTHS = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December'
] as const

// Define monthRows right after MONTHS
const monthRows = [
  MONTHS.slice(0, 3),    // First row: Jan, Feb, Mar
  MONTHS.slice(3, 6),    // Second row: Apr, May, Jun
  MONTHS.slice(6, 9),    // Third row: Jul, Aug, Sep
  MONTHS.slice(9, 12),   // Fourth row: Oct, Nov, Dec
]

const PLANTING_GUIDE: { [key: string]: { [key: string]: PlantInfo[] } } = {
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

const PLANT_DETAILS: { [key: string]: PlantDetails } = {
  'Tomatoes': {
    name: 'Tomatoes',
    growingInfo: 'Warm season crop that needs full sun and rich, well-drained soil.',
    plantingTime: 'Plant after all danger of frost has passed. Start seeds indoors 6-8 weeks before last frost.',
    careInstructions: [
      'Provide strong support for climbing',
      'Remove side shoots regularly',
      'Water deeply and consistently',
      'Feed every 2-3 weeks once flowering'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '90-120cm',
    matureHeight: '1.5-2m',
    timeToHarvest: '60-80 days',
    frostTolerant: false,
    soil: 'Rich, well-drained soil with added compost',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun',
    description: 'Popular summer crop with variety of sizes and flavors',
    commonIssues: [
      {
        name: 'Blight',
        symptoms: 'Brown spots on leaves spreading quickly',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Blossom end rot',
        symptoms: 'Dark patches on bottom of fruits',
        solution: 'Maintain consistent watering and calcium levels'
      },
      {
        name: 'Caterpillars',
        symptoms: 'Holes in leaves and damaged fruit',
        solution: 'Use organic pest control, handpick caterpillars'
      }
    ],
    maintenance: 'high',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare rich soil',
          'Install support structure',
          'Plant deeply'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove side shoots',
          'Tie to supports',
          'Feed regularly'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick when fully colored',
          'Check daily',
          'Remove any diseased fruit'
        ]
      }
    ]
  },
  'Lettuce': {
    name: 'Lettuce',
    growingInfo: 'Fast-growing leafy vegetable that prefers cool weather.',
    plantingTime: 'Spring and autumn. Can be grown year-round in cool climates.',
    careInstructions: [
      'Keep soil consistently moist',
      'Thin seedlings to proper spacing',
      'Protect from extreme heat',
      'Harvest outer leaves as needed'
    ],
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '45-65 days',
    frostTolerant: true,
    soil: 'Rich, well-drained soil',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    description: 'Easy to grow leafy vegetable with many varieties',
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Premature flowering in hot weather',
        solution: 'Plant in cooler seasons, provide shade'
      },
      {
        name: 'Slugs and snails',
        symptoms: 'Holes in leaves, especially on young plants',
        solution: 'Use organic slug control methods, copper tape'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil',
          'Sow seeds thinly',
          'Water gently'
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
          'Cut whole head if desired',
          'Succession plant'
        ]
      }
    ]
  },
  'Beans': {
    name: 'Beans',
    growingInfo: 'Fast-growing climbing vegetable that needs support',
    plantingTime: 'Plant in spring after frost risk has passed',
    careInstructions: [
      'Provide climbing support',
      'Water regularly at base',
      'Pick beans frequently to encourage production',
      'Monitor for pests'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature pods',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Cucumbers': {
    name: 'Cucumbers',
    growingInfo: 'Vining plant that produces abundantly in warm weather',
    plantingTime: 'Plant when soil has warmed in late spring',
    careInstructions: [
      'Provide trellis or support',
      'Keep soil consistently moist',
      'Harvest regularly to encourage production',
      'Monitor for powdery mildew'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature cucumbers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Sweet Corn': {
    name: 'Sweet Corn',
    growingInfo: 'Tall growing crop that needs block planting for pollination',
    plantingTime: 'Plant in spring when soil has warmed',
    careInstructions: [
      'Plant in blocks for better pollination',
      'Water deeply and regularly',
      'Side-dress with nitrogen when knee-high',
      'Support stalks if needed'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature ears',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Capsicum': {
    name: 'Capsicum',
    growingInfo: 'Warm-season crop that produces over a long period',
    plantingTime: 'Start indoors 8-10 weeks before last frost',
    careInstructions: [
      'Stake plants when fruiting',
      'Keep soil evenly moist',
      'Feed regularly during fruiting',
      'Protect from extreme heat'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature peppers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Eggplant': {
    name: 'Eggplant',
    growingInfo: 'Heat-loving plant that needs warm soil to thrive',
    plantingTime: 'Plant after all frost danger has passed',
    careInstructions: [
      'Support plants when fruiting',
      'Maintain consistent moisture',
      'Feed every 4-6 weeks',
      'Monitor for pests regularly'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature eggplants',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Carrots': {
    name: 'Carrots',
    growingInfo: 'Root vegetable that needs loose, stone-free soil',
    plantingTime: 'Sow directly from early spring to late summer',
    careInstructions: [
      'Thin seedlings to 5cm apart',
      'Keep soil consistently moist',
      'Avoid high nitrogen fertilizers',
      'Protect young plants from pests'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature carrots',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Broccoli': {
    name: 'Broccoli',
    growingInfo: 'Cool-season crop that forms large central head',
    plantingTime: 'Plant in early spring or late summer',
    careInstructions: [
      'Space plants properly',
      'Keep soil consistently moist',
      'Feed regularly with nitrogen',
      'Watch for cabbage butterflies'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature broccoli',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Cauliflower': {
    name: 'Cauliflower',
    growingInfo: 'Cool-season brassica that needs consistent care',
    plantingTime: 'Plant in early spring or late summer',
    careInstructions: [
      'Blanch heads when they form',
      'Keep soil evenly moist',
      'Feed every 3-4 weeks',
      'Protect from heat stress'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature cauliflowers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Peas': {
    name: 'Peas',
    growingInfo: 'Cool-season legume that fixes nitrogen in soil',
    plantingTime: 'Plant in early spring or autumn',
    careInstructions: [
      'Provide climbing support',
      'Keep soil moderately moist',
      'Pick regularly when ready',
      'Protect from strong winds'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature peas',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Potatoes': {
    name: 'Potatoes',
    growingInfo: 'Root crop that needs hilling as it grows',
    plantingTime: 'Plant in early spring after frost danger',
    careInstructions: [
      'Hill soil around plants',
      'Keep soil consistently moist',
      'Watch for potato beetles',
      'Stop watering before harvest'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature tubers',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Broad Beans': {
    name: 'Broad Beans',
    growingInfo: 'Cold-hardy legume that grows tall',
    plantingTime: 'Plant in autumn or early spring',
    careInstructions: [
      'Support tall plants',
      'Pinch out tops when flowering',
      'Water regularly when pods forming',
      'Monitor for chocolate spot'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature beans',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Brussels sprouts': {
    name: 'Brussels sprouts',
    growingInfo: 'Long-season brassica that needs cool weather',
    plantingTime: 'Plant in late spring for winter harvest',
    careInstructions: [
      'Space well for good air flow',
      'Remove yellowing leaves',
      'Keep soil consistently moist',
      'Feed regularly with nitrogen'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature sprouts',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Garlic': {
    name: 'Garlic',
    growingInfo: 'Long-season crop planted in individual cloves',
    plantingTime: 'Plant in autumn for summer harvest',
    careInstructions: [
      'Plant cloves pointy end up',
      'Mulch well after planting',
      'Remove flower stalks',
      'Stop watering when leaves yellow'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature bulbs',
          'Stop watering when leaves begin yellowing',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Radish': {
    name: 'Radish',
    growingInfo: 'Fast-growing root crop, perfect for beginners',
    plantingTime: 'Sow every 2 weeks for continuous harvest',
    careInstructions: [
      'Thin seedlings promptly',
      'Keep soil evenly moist',
      'Harvest before oversized',
      'Protect from root maggots'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature radishes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Onions': {
    name: 'Onions',
    growingInfo: 'Long-season crop grown from sets or seedlings',
    plantingTime: 'Plant in early spring or autumn',
    careInstructions: [
      'Plant at correct depth',
      'Keep weed-free',
      'Stop watering when tops fall',
      'Cure properly after harvest'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature onions',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Silverbeet': {
    name: 'Silverbeet',
    growingInfo: 'Hardy leafy green that produces for months',
    plantingTime: 'Plant spring through autumn',
    careInstructions: [
      'Thin seedlings well',
      'Keep soil consistently moist',
      'Harvest outer leaves',
      'Remove flower stalks'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature silverbeet',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Zucchini': {
    name: 'Zucchini',
    growingInfo: 'Productive summer squash that needs space',
    plantingTime: 'Plant after soil has warmed in spring',
    careInstructions: [
      'Give plenty of space',
      'Water at base of plant',
      'Harvest regularly when small',
      'Monitor for powdery mildew'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature zucchini',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Rhubarb': {
    name: 'Rhubarb',
    growingInfo: 'Perennial crop that produces for years',
    plantingTime: 'Plant crowns in early spring',
    careInstructions: [
      'Prepare soil well before planting',
      'Remove flower stalks',
      'Never harvest first year',
      'Mulch heavily in winter'
    ],
    seedSpacing: '90-120cm',
    rowSpacing: '90-120cm',
    matureHeight: '60-90cm',
    timeToHarvest: '1-2 years',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'Rhubarb is a perennial that produces edible stalks. Only harvest after the first year of growth.',
    commonIssues: [
      {
        name: 'Crown Rot',
        symptoms: 'Rotting at base of plant',
        solution: 'Improve drainage, avoid overwatering'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature rhubarb',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Winter Cabbage': {
    name: 'Winter Cabbage',
    growingInfo: 'Hardy brassica that develops better flavor after frost',
    plantingTime: 'Plant in summer for winter harvest',
    careInstructions: [
      'Space well for head development',
      'Keep soil consistently moist',
      'Feed with nitrogen monthly',
      'Watch for cabbage butterflies'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature cabbage',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Kale': {
    name: 'Kale',
    growingInfo: 'Cold-hardy leafy green that improves with frost',
    plantingTime: 'Plant in late summer for winter/spring harvest',
    careInstructions: [
      'Space plants adequately',
      'Keep soil consistently moist',
      'Harvest outer leaves regularly',
      'Protect from cabbage whites'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature kale',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Kohlrabi': {
    name: 'Kohlrabi',
    growingInfo: 'Quick-growing brassica with swollen stem',
    plantingTime: 'Plant in spring or late summer',
    careInstructions: [
      'Thin seedlings early',
      'Keep soil evenly moist',
      'Harvest when bulb is tennis ball size',
      'Watch for cabbage moths'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature kohlrabi',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Spring Onion': {
    name: 'Spring Onion',
    growingInfo: 'Fast-growing allium for fresh green stems',
    plantingTime: 'Sow every 3-4 weeks for continuous harvest',
    careInstructions: [
      'Sow seeds thinly',
      'Keep weeded',
      'Water regularly',
      'Harvest when stems reach desired size'
    ],
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
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature spring onions',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Swede': {
    name: 'Swede',
    growingInfo: 'Root vegetable that sweetens after frost',
    plantingTime: 'Plant in late spring for autumn/winter harvest',
    careInstructions: [
      'Thin to final spacing',
      'Keep soil consistently moist',
      'Protect from root fly',
      'Harvest after frost for best flavor'
    ],
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
    maintenance: 'low',  // Generally trouble-free
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature swedes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Turnip': {
    name: 'Turnip',
    growingInfo: 'Fast-growing root vegetable for spring or fall',
    plantingTime: 'Plant in early spring or late summer',
    careInstructions: [
      'Thin seedlings to 10cm apart',
      'Keep soil evenly moist',
      'Harvest when roots are young',
      'Watch for flea beetles'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '40-55 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Both turnip roots and greens are edible. Young turnips are tender and mild-flavored.',
    commonIssues: [
      {
        name: 'Club Root',
        symptoms: 'Swollen, distorted roots',
        solution: 'Improve soil pH, rotate crops'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature turnips',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'English Spinach': {
    name: 'English Spinach',
    growingInfo: 'Quick-growing leafy green that prefers cool weather',
    plantingTime: 'Plant in early spring or autumn',
    careInstructions: [
      'Thin to proper spacing',
      'Keep soil consistently moist',
      'Harvest outer leaves regularly',
      'Protect from leaf miners'
    ],
    seedSpacing: '7-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '40-50 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun to partial shade',
    description: 'English spinach prefers cool weather and will bolt in heat. Harvest outer leaves for continuous production.',
    commonIssues: [
      {
        name: 'Leaf Miners',
        symptoms: 'Serpentine tunnels in leaves',
        solution: 'Remove affected leaves, use row covers'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature spinach',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Shallots': {
    name: 'Shallots',
    growingInfo: 'Mild-flavored allium grown from sets or seeds',
    plantingTime: 'Plant sets in early spring or autumn',
    careInstructions: [
      'Plant sets with tips just showing',
      'Keep weed-free',
      'Water regularly until tops die down',
      'Cure properly after harvest'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-120 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering',
    sunlight: 'Full sun',
    description: 'Shallots have a milder, more refined flavor than onions. Each bulb planted will multiply into a cluster.',
    commonIssues: [
      {
        name: 'White Rot',
        symptoms: 'Yellowing leaves, rotting bulbs',
        solution: 'Practice crop rotation, improve drainage'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature shallots',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Jerusalem Artichokes': {
    name: 'Jerusalem Artichokes',
    growingInfo: 'Tall perennial with edible tubers',
    plantingTime: 'Plant tubers in early spring',
    careInstructions: [
      'Plant tubers 10-15cm deep',
      'Support tall stems if needed',
      'Harvest after frost kills tops',
      'Leave some tubers for next year'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '90-120cm',
    matureHeight: '150-300cm',
    timeToHarvest: '120-150 days',
    frostTolerant: true,
    soil: 'Well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Also known as sunchokes, these perennial plants produce edible tubers. Can spread vigorously once established.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powder on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature artichokes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Asparagus': {
    name: 'Asparagus',
    growingInfo: 'Long-lived perennial crop that produces for years',
    plantingTime: 'Plant crowns in spring',
    careInstructions: [
      'Prepare deep, rich trenches',
      'Gradually fill as plants grow',
      'Don\'t harvest first year',
      'Remove old ferns in winter'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '120-150cm',
    matureHeight: '120-150cm',
    timeToHarvest: '2-3 years',
    frostTolerant: true,
    soil: 'Deep, rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering during growing season',
    sunlight: 'Full sun',
    description: 'Asparagus is a long-lived perennial. Do not harvest for the first 2-3 years to allow strong root development.',
    commonIssues: [
      {
        name: 'Asparagus Beetle',
        symptoms: 'Chewed foliage, reduced vigor',
        solution: 'Handpick beetles, maintain clean beds'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature asparagus',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Early Potatoes': {
    name: 'Early Potatoes',
    growingInfo: 'Fast-maturing potato variety for spring planting',
    plantingTime: 'Plant when soil warms in early spring',
    careInstructions: [
      'Chit seed potatoes before planting',
      'Hill soil around stems',
      'Keep soil consistently moist',
      'Harvest when flowers fade'
    ],
    seedSpacing: '30-40cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-60cm',
    timeToHarvest: '60-90 days',
    frostTolerant: false,
    soil: 'Light, well-draining soil with pH 5.0-6.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Early potatoes mature more quickly than main crop varieties. Plant certified disease-free seed potatoes.',
    commonIssues: [
      {
        name: 'Early Blight',
        symptoms: 'Dark spots on leaves',
        solution: 'Improve air flow, avoid wet foliage'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature potatoes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Early Carrots': {
    name: 'Early Carrots',
    growingInfo: 'Quick-maturing carrot variety for spring harvest',
    plantingTime: 'Sow as soon as soil can be worked',
    careInstructions: [
      'Sow thinly in rows',
      'Thin carefully when young',
      'Keep soil consistently moist',
      'Protect from carrot fly'
    ],
    seedSpacing: '5-7cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '55-65 days',
    frostTolerant: true,
    soil: 'Deep, loose soil with pH 6.0-6.8',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'Early carrots are typically smaller but sweeter than main crop varieties. Ideal for succession planting.',
    commonIssues: [
      {
        name: 'Carrot Fly',
        symptoms: 'Tunnels in roots',
        solution: 'Use protective barriers, companion plant with onions'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature carrots',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Parsnips': {
    name: 'Parsnips',
    growingInfo: 'Long-season root crop that sweetens after frost',
    plantingTime: 'Sow in early spring for winter harvest',
    careInstructions: [
      'Sow fresh seed only',
      'Keep soil consistently moist',
      'Be patient - slow to germinate',
      'Leave in ground until needed'
    ],
    seedSpacing: '10-15cm',
    rowSpacing: '45-60cm',
    matureHeight: '45-60cm',
    timeToHarvest: '120-180 days',
    frostTolerant: true,
    soil: 'Deep, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Parsnips develop sweeter flavor after frost. Seeds can be slow to germinate, keep soil consistently moist.',
    commonIssues: [
      {
        name: 'Canker',
        symptoms: 'Brown patches on roots',
        solution: 'Improve drainage, rotate crops'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature parsnips',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Chillies': {
    name: 'Chillies',
    growingInfo: 'Heat-loving crop that produces abundantly',
    plantingTime: 'Start indoors 8-10 weeks before last frost',
    careInstructions: [
      'Provide warmth for germination',
      'Harden off carefully',
      'Support plants when fruiting',
      'Harvest regularly'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-75cm',
    matureHeight: '45-90cm',
    timeToHarvest: '60-95 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Moderate watering',
    sunlight: 'Full sun',
    description: 'Chillies prefer warm conditions and will produce more fruit in hot weather. Can be grown in containers.',
    commonIssues: [
      {
        name: 'Blossom End Rot',
        symptoms: 'Dark spots on fruit ends',
        solution: 'Maintain consistent watering, ensure adequate calcium'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature chillies',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Sweet Potatoes': {
    name: 'Sweet Potatoes',
    growingInfo: 'Tropical vine that produces edible tubers',
    plantingTime: 'Plant slips after all frost danger',
    careInstructions: [
      'Plant in warm soil',
      'Water regularly until established',
      'Control vine growth if needed',
      'Harvest before frost'
    ],
    seedSpacing: '30-45cm',
    rowSpacing: '90-120cm',
    matureHeight: '15-30cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Light, well-draining soil with pH 5.5-6.5',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Sweet potatoes need warm soil to develop well. Harvest when vines yellow or before first frost.',
    commonIssues: [
      {
        name: 'Scurf',
        symptoms: 'Dark patches on tubers',
        solution: 'Use clean planting material, rotate crops'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature sweet potatoes',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Pumpkin': {
    name: 'Pumpkin',
    growingInfo: 'Sprawling vine that needs lots of space',
    plantingTime: 'Plant after soil has warmed in spring',
    careInstructions: [
      'Give plenty of room to spread',
      'Water deeply at base',
      'Support developing fruit',
      'Harvest before heavy frost'
    ],
    seedSpacing: '90-120cm',
    rowSpacing: '180-240cm',
    matureHeight: '30-45cm',
    timeToHarvest: '90-120 days',
    frostTolerant: false,
    soil: 'Rich, well-draining soil with pH 6.0-6.8',
    watering: 'Regular deep watering',
    sunlight: 'Full sun',
    description: 'Pumpkins need plenty of space to spread. Harvest when the skin is hard and the stem begins to dry.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powder on leaves',
        solution: 'Space plants well, improve air circulation'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature pumpkins',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Beetroot': {
    name: 'Beetroot',
    growingInfo: 'Easy to grow root vegetable that prefers cool weather',
    plantingTime: 'Plant in early spring or late summer for autumn/winter harvest',
    careInstructions: [
      'Thin seedlings to 10cm apart',
      'Keep soil consistently moist',
      'Mulch to retain moisture and suppress weeds',
      'Harvest when roots reach desired size'
    ],
    seedSpacing: '5-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '50-70 days',
    frostTolerant: true,
    soil: 'Well-drained, rich soil',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to part shade',
    description: 'Versatile root vegetable with edible leaves',
    commonIssues: [
      // ... existing issues ...
    ],
    maintenance: 'low',
    maintenanceTasks: [
      // ... existing tasks ...
    ]
  },
  'Leeks': {
    name: 'Leeks',
    growingInfo: 'Long-season allium that needs blanching for white stems',
    plantingTime: 'Sow in spring for autumn/winter harvest',
    careInstructions: [
      'Plant deeply in trenches',
      'Hill soil around stems',
      'Keep well watered',
      'Watch for leek moth'
    ],
    seedSpacing: '15-20cm',
    rowSpacing: '30-45cm',
    matureHeight: '30-45cm',
    timeToHarvest: '60-70 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Leeks are a long-season allium vegetable that need blanching for white stems. They are harvested when the plants are young and tender.',
    commonIssues: [
      {
        name: 'Leek Moth',
        symptoms: 'Yellowing leaves, wilting, and stunted growth',
        solution: 'Remove affected leaves, use row covers, and apply organic insecticides'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil',
          'Sow seeds thinly',
          'Water gently'
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
          'Cut whole head if desired',
          'Succession plant'
        ]
      }
    ]
  },
  'Celery': {
    name: 'Celery',
    growingInfo: 'Moisture-loving crop that needs rich soil',
    plantingTime: 'Plant in spring after frost risk has passed',
    careInstructions: [
      'Keep consistently moist',
      'Mulch to retain moisture',
      'Feed every 2-3 weeks',
      'Blanch stems if desired'
    ],
    seedSpacing: '20-30cm',
    rowSpacing: '45-60cm',
    matureHeight: '60-90cm',
    timeToHarvest: '70-80 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular watering',
    sunlight: 'Full sun',
    description: 'Celery is a moisture-loving crop that needs rich soil. Regular watering and mulching help maintain moisture and prevent disease.',
    commonIssues: [
      {
        name: 'Powdery Mildew',
        symptoms: 'White powdery coating on leaves',
        solution: 'Improve air circulation, avoid overhead watering'
      },
      {
        name: 'Downy Mildew',
        symptoms: 'Yellow patches on leaves, grey fuzz underneath',
        solution: 'Improve air circulation, water at base, remove infected leaves'
      },
      {
        name: 'Crown Rot',
        symptoms: 'Rotting at base of plant',
        solution: 'Improve drainage, avoid overwatering, maintain clean garden'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Check for emergence and mulch',
          'Monitor soil moisture',
          'Remove any weeds',
          'Check for pest damage'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Remove flower stalks (scapes)',
          'Continue weeding',
          'Maintain consistent moisture',
          'Watch for yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Check for mature celery',
          'Harvest when tops fall over',
          'Cure in dry, well-ventilated area'
        ]
      }
    ]
  },
  'Brassicas': {
    name: 'Brassicas',
    growingInfo: 'Family of cool-season vegetables including cabbage, broccoli, and cauliflower',
    plantingTime: 'Plant in early spring or late summer/autumn',
    careInstructions: [
      'Space plants according to variety',
      'Keep soil consistently moist',
      'Feed regularly with nitrogen',
      'Watch for cabbage white butterflies'
    ],
    seedSpacing: '45-60cm',
    rowSpacing: '60-90cm',
    matureHeight: '30-90cm',
    timeToHarvest: '60-120 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.0-7.0',
    watering: 'Regular consistent watering',
    sunlight: 'Full sun',
    description: 'The brassica family includes many nutritious vegetables that grow best in cooler weather.',
    commonIssues: [
      {
        name: 'Cabbage White Butterfly',
        symptoms: 'Holes in leaves, presence of green caterpillars',
        solution: 'Use row covers, hand pick caterpillars, spray with BT'
      },
      {
        name: 'Club Root',
        symptoms: 'Stunted growth, wilting, swollen roots',
        solution: 'Improve soil pH, rotate crops, improve drainage'
      }
    ],
    maintenance: 'medium',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare soil well',
          'Space correctly',
          'Water in gently',
          'Protect from pests'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Monitor for pests',
          'Feed regularly',
          'Keep well watered',
          'Remove yellowing leaves'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Harvest at peak maturity',
          'Cut cleanly at base',
          'Process promptly'
        ]
      }
    ]
  },
  'Asian Greens': {
    name: 'Asian Greens',
    growingInfo: 'Quick-growing leafy vegetables including bok choy, tatsoi, and mizuna',
    plantingTime: 'Plant spring through autumn, avoid peak summer heat',
    careInstructions: [
      'Space according to variety',
      'Keep soil consistently moist',
      'Harvest regularly',
      'Watch for flea beetles'
    ],
    seedSpacing: '15-30cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-40cm',
    timeToHarvest: '30-50 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil',
    watering: 'Regular watering',
    sunlight: 'Full sun to part shade',
    description: 'Fast-growing greens that add variety to salads and stir-fries. Many can be harvested multiple times.',
    commonIssues: [
      {
        name: 'Flea Beetles',
        symptoms: 'Small holes in leaves',
        solution: 'Use row covers, apply diatomaceous earth'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare fertile soil',
          'Sow seeds thinly',
          'Keep soil moist',
          'Protect from pests'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Water regularly',
          'Monitor for pests',
          'Remove weeds',
          'Feed if needed'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Cut outer leaves',
          'Harvest whole plants',
          'Succession plant'
        ]
      }
    ]
  },
  'Spring Onions': {
    name: 'Spring Onions',
    growingInfo: 'Quick-growing allium for fresh green stems',
    plantingTime: 'Sow every 3-4 weeks for continuous harvest',
    careInstructions: [
      'Sow seeds thinly',
      'Keep soil consistently moist',
      'Thin to 2-3cm apart',
      'Harvest when stems reach desired size'
    ],
    seedSpacing: '2-3cm',
    rowSpacing: '15-20cm',
    matureHeight: '30-40cm',
    timeToHarvest: '30-40 days',
    frostTolerant: true,
    soil: 'Well-draining, fertile soil',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to partial shade',
    description: 'Fast-growing onions harvested for their tender stems and mild flavor. Perfect for succession planting.',
    commonIssues: [
      {
        name: 'Onion Fly',
        symptoms: 'Wilting, yellowing leaves',
        solution: 'Rotate crops, use row covers'
      },
      {
        name: 'White Rot',
        symptoms: 'Yellowing, rotting base',
        solution: 'Improve drainage, practice crop rotation'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare fine seedbed',
          'Sow seeds thinly',
          'Water gently',
          'Cover lightly with soil'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Keep well watered',
          'Remove weeds carefully',
          'Thin as needed',
          'Watch for pests'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pull when stems reach size',
          'Use fresh or store briefly',
          'Succession sow for continuous crop'
        ]
      }
    ]
  },
  'Spinach': {
    name: 'Spinach',
    growingInfo: 'Fast-growing leafy green that bolts in warm weather',
    plantingTime: 'Plant in early spring or autumn for best results',
    careInstructions: [
      'Sow in rich, cool soil',
      'Keep consistently moist',
      'Thin to 10cm apart',
      'Harvest outer leaves regularly'
    ],
    seedSpacing: '5-10cm',
    rowSpacing: '30-45cm',
    matureHeight: '20-30cm',
    timeToHarvest: '35-45 days',
    frostTolerant: true,
    soil: 'Rich, well-draining soil with pH 6.5-7.5',
    watering: 'Regular, consistent moisture',
    sunlight: 'Full sun to partial shade',
    description: 'True spinach (Spinacia oleracea) is more heat-sensitive than English spinach. Best grown in cool weather to prevent bolting.',
    commonIssues: [
      {
        name: 'Bolting',
        symptoms: 'Rapid stem growth, bitter leaves',
        solution: 'Plant in cooler weather, use bolt-resistant varieties'
      },
      {
        name: 'Downy Mildew',
        symptoms: 'Yellow patches with grey undersides',
        solution: 'Improve air circulation, avoid overhead watering'
      }
    ],
    maintenance: 'low',
    maintenanceTasks: [
      {
        stage: 'planting',
        tasks: [
          'Prepare rich soil',
          'Sow seeds thinly',
          'Keep soil cool',
          'Water gently'
        ]
      },
      {
        stage: 'growing',
        tasks: [
          'Thin seedlings',
          'Keep well watered',
          'Remove weeds',
          'Watch for bolting'
        ]
      },
      {
        stage: 'harvesting',
        tasks: [
          'Pick outer leaves',
          'Cut whole plant if needed',
          'Succession plant'
        ]
      }
    ]
  }
}

const SEASON_GUIDES: { [key: string]: SeasonGuide } = {
  'Summer': {
    season: 'Summer',
    currentMonth: MONTHS[new Date().getMonth()], // Use actual current month
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
    currentMonth: MONTHS[new Date().getMonth()], // Use actual current month
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
    currentMonth: MONTHS[new Date().getMonth()], // Use actual current month
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
    currentMonth: MONTHS[new Date().getMonth()], // Use actual current month
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
  const month = new Date().getMonth() // Returns 0-11 (Jan-Dec)
  
  // Southern Hemisphere seasons
  if (month === 11 || month === 0 || month === 1) return SEASON_GUIDES['Summer']     // Dec, Jan, Feb
  if (month >= 2 && month <= 4) return SEASON_GUIDES['Autumn']    // Mar, Apr, May
  if (month >= 5 && month <= 7) return SEASON_GUIDES['Winter']    // Jun, Jul, Aug
  return SEASON_GUIDES['Spring']                                  // Sep, Oct, Nov
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

// First, update the GardenPlant interface to include the activity type
interface GardenPlant {
  name: string;
  datePlanted: string;
  type: 'seed' | 'seedling';
  activityType: 'sow' | 'plant';  // Add this to track whether it was sown or planted
  location?: string;
  notes?: string;
}

// Update the addToMyGarden function
function addToMyGarden(plantName: string, activityType: 'sow' | 'plant') {
  const existingGarden = localStorage.getItem('myGarden')
  const myGarden: GardenPlant[] = existingGarden ? JSON.parse(existingGarden) : []
  
  // Check if plant is already in garden with the same activity type
  if (!myGarden.some(plant => plant.name === plantName && plant.activityType === activityType)) {
    const newPlant: GardenPlant = {
      name: plantName,
      datePlanted: new Date().toISOString(),
      type: activityType === 'sow' ? 'seed' : 'seedling',  // Set type based on activity
      activityType: activityType
    }
    myGarden.push(newPlant)
    localStorage.setItem('myGarden', JSON.stringify(myGarden))
    return true
  }
  return false
}

// Update the removeFromMyGarden function
function removeFromMyGarden(plantName: string, activityType: 'sow' | 'plant') {
  const existingGarden = localStorage.getItem('myGarden')
  if (existingGarden) {
    const myGarden: GardenPlant[] = JSON.parse(existingGarden)
    const updatedGarden = myGarden.filter(
      plant => !(plant.name === plantName && plant.activityType === activityType)
    )
    localStorage.setItem('myGarden', JSON.stringify(updatedGarden))
    return true
  }
  return false
}

// First, create a type for the month summaries
type MonthSummaries = {
  [key: string]: string;
}

// Create an object to hold all state-specific summaries
const monthSummaries: { [key: string]: string } = {
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
const tasmaniaSummaries: { [key: string]: string } = {
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

const STATE_MONTH_SUMMARIES: { [key: string]: typeof monthSummaries } = {
  // Tasmania
  'Tasmania': tasmaniaSummaries,
  'TAS': tasmaniaSummaries,
  
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

// In the MonthCard component, modify how we access the summaries
function MonthCard({ month, activities, location }: { month: string; activities: PlantInfo[]; location: GardenLocation }) {
  // Helper function inside component
  const getStateSummaries = (state: string) => {
    const canonicalName = (state in stateAliases ? stateAliases[state as StateAlias] : state) as StateName;
    return STATE_MONTH_SUMMARIES[canonicalName] || STATE_MONTH_SUMMARIES['Tasmania'];
  };
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [showFullList, setShowFullList] = useState<'sow' | 'plant' | null>(null);
  const [gardenPlants, setGardenPlants] = useState<Array<{name: string, activityType: 'sow' | 'plant'}>>([]);  // Update the gardenPlants state to store both name and type

  const sowActivities = activities.filter(a => a.type === 'sow');
  const plantActivities = activities.filter(a => a.type === 'plant');

  const handlePlantClick = (plantName: string) => {
    setSelectedPlant(plantName);
    setIsPlantModalOpen(true);
  };

  const handleQuickAdd = (plantName: string, activityType: 'sow' | 'plant' | 'harvest', e: React.MouseEvent) => {
    e.stopPropagation();
    const isInGarden = gardenPlants.some(
      p => p.name === plantName && p.activityType === activityType
    );
    
    if (isInGarden && (activityType === 'sow' || activityType === 'plant')) {
      removeFromMyGarden(plantName, activityType as 'sow' | 'plant');
      setGardenPlants(gardenPlants.filter(
        p => !(p.name === plantName && p.activityType === activityType)
      ));
    } else if (activityType === 'sow' || activityType === 'plant') {
      addToMyGarden(plantName, activityType);
      setGardenPlants([...gardenPlants, { name: plantName, activityType }]);
    }
  };

  const renderPlantItem = (activity: PlantInfo) => {
    const isInGarden = gardenPlants.some(
      p => p.name === activity.name && p.activityType === activity.type
    );
    
    return (
      <li 
        key={`${activity.name}-${activity.type}`}  // Updated key to be unique per activity type
        className="group cursor-pointer flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-gray-50"
      >
        <div 
          className="flex items-center gap-2 min-w-0 flex-1"
          onClick={() => handlePlantClick(activity.name)}
        >
          <span className={`w-1.5 h-1.5 rounded-full bg-${activity.type === 'sow' ? 'blue' : 'green'}-400`}></span>
          <span className="text-gray-700 text-sm truncate">{activity.name}</span>
        </div>
        <button
          onClick={(e) => {
            if (activity.type === 'harvest') return; // Skip harvest activities
            handleQuickAdd(activity.name, activity.type as 'sow' | 'plant', e);
          }}
          className={`flex items-center justify-center transition-all ml-2 ${
            isInGarden 
              ? 'text-green-500 hover:text-green-600' 
              : 'opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600'
          }`}
          title={isInGarden ? 'Remove from Garden' : 'Add to My Garden'}
        >
          {isInGarden ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          )}
        </button>
      </li>
    );
  };

  // Add this near the top of the component where you need to access the summaries
  const summaries = getStateSummaries(location.state);

  // Debug logging (can be removed in production)
  if (process.env.NODE_ENV === 'development') {
    const canonicalName = (location.state in stateAliases ? stateAliases[location.state as StateAlias] : location.state) as StateName;
    const isStateSpecific = STATE_MONTH_SUMMARIES[canonicalName] || STATE_MONTH_SUMMARIES[location.state];
    console.log('MonthCard Debug:', {
      state: location.state,
      canonicalName,
      climateZone: getClimateZone(location.state),
      usingSummaries: isStateSpecific ? `${canonicalName || location.state}-specific` : 'Default',
      month,
      hasSummary: Boolean(summaries[month]),
      activitiesCount: activities.length
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col h-[460px]">
        <a href={`/planting-calendar/${month.toLowerCase()}`} className="block">
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3.5 cursor-pointer hover:from-slate-600 hover:to-slate-500 transition-all duration-200">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-bold text-white">{month}</h3>
              <span className="text-sm font-medium text-slate-200">{getMonthSeason(month)}</span>
            </div>
          </div>
        </a>

        <div className="bg-gray-50 px-5 py-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-1.5">Overview</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {summaries[month]}
          </p>
        </div>

        <div className="px-5 pt-3 pb-6">
          <div className="grid grid-cols-2 gap-5">
            {/* SOW column */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <h4 className="font-medium text-blue-900 text-sm">SOW</h4>
              </div>
              <div className="scrollbar-custom">
                <ul className="space-y-1.5">
                  {sowActivities.length > 0 ? (
                    <>
                      {sowActivities.map(a => renderPlantItem(a))}
                    </>
                  ) : (
                    <li className="text-gray-400 italic text-sm pl-1">Nothing to sow</li>
                  )}
                </ul>
              </div>
            </div>

            {/* PLANT column */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <h4 className="font-medium text-green-900 text-sm">PLANT</h4>
              </div>
              <div className="scrollbar-custom">
                <ul className="space-y-1.5">
                  {plantActivities.length > 0 ? (
                    <>
                      {plantActivities.map(a => renderPlantItem(a))}
                    </>
                  ) : (
                    <li className="text-gray-400 italic text-sm pl-1">Nothing to plant</li>
                  )}
                </ul>
              </div>
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
    </div>
  );
}

// Update the PlantModal component props type
function PlantModal({ 
  plant, 
  isOpen, 
  onClose 
}: { 
  plant: string | null;
  isOpen: boolean; 
  onClose: () => void 
}) {
  if (!isOpen || !plant) return null
  
  const plantDetails = PLANT_DETAILS[plant]
  if (!plantDetails) return null

  const [activeTab, setActiveTab] = useState<'issues' | 'maintenance' | null>(null)
  const [isInGarden, setIsInGarden] = useState(() => {
    const garden = localStorage.getItem('myGarden')
    return garden ? JSON.parse(garden).some((p: GardenPlant) => p.name === plant) : false
  })

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const modal = document.getElementById('plant-modal')
      if (modal && !modal.contains(e.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleAddToGarden = () => {
    if (isInGarden) {
      const removed = removeFromMyGarden(plant, 'sow')
      if (removed) {
        setIsInGarden(false)
      }
    } else {
      const added = addToMyGarden(plant, 'sow')
      if (added) {
        setIsInGarden(true)
      }
    }
  }

  const getMaintenanceColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return createPortal(
    <div className="fixed inset-0 isolate bg-black/50 backdrop-blur-sm" style={{ zIndex: 9999 }}>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            id="plant-modal"
            className="relative bg-white rounded-xl w-full max-w-4xl shadow-2xl transform transition-all duration-300 ease-out"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-100 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-green-800">{plantDetails.name}</h2>
                <div className="flex items-center gap-3">
                  {/* Add to Garden Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddToGarden()
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isInGarden 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {isInGarden ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Remove from Garden
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add to Garden
                      </>
                    )}
                  </button>
                  {/* Close Button */}
                <button 
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                </div>
              </div>
              <p className="text-gray-600 mt-2 italic">{plantDetails.description}</p>
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
                        <span className="text-green-600">Seeds: {plantDetails.seedSpacing}, Rows: {plantDetails.rowSpacing}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      <div>
                        <span className="font-medium block text-green-700">Mature Height</span>
                        <span className="text-green-600">{plantDetails.matureHeight}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block text-green-700">Time to Harvest</span>
                        <span className="text-green-600">{plantDetails.timeToHarvest}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block text-green-700">Frost Tolerance</span>
                        <span className="text-green-600">{plantDetails.frostTolerant ? 'Frost Tolerant' : 'Not Frost Tolerant'}</span>
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
                        <span className={`${getMaintenanceColor(plantDetails.maintenance)} capitalize`}>
                          {plantDetails.maintenance} Maintenance
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
                        <span className="text-blue-600">{plantDetails.soil}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <div>
                        <span className="font-medium block text-blue-700">Watering Needs</span>
                        <span className="text-blue-600">{plantDetails.watering}</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <div>
                        <span className="font-medium block text-blue-700">Sunlight</span>
                        <span className="text-blue-600">{plantDetails.sunlight}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enhanced Collapsible Sections */}
              <div className="border-t border-gray-100 mt-6">
                {/* Section Tabs */}
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setActiveTab(activeTab === 'issues' ? null : 'issues')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all duration-200 ${
                      activeTab === 'issues' 
                        ? 'border-b-2 border-gray-900 text-gray-900 bg-gray-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </span>
                    Common Issues
                    <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {plantDetails.commonIssues.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab(activeTab === 'maintenance' ? null : 'maintenance')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all duration-200 ${
                      activeTab === 'maintenance'
                        ? 'border-b-2 border-gray-900 text-gray-900 bg-gray-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    </span>
                    Maintenance Guide
                    <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {plantDetails.maintenanceTasks.length} stages
                    </span>
                  </button>
                </div>

                {/* Common Issues Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeTab === 'issues' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-6">
                    <div className="grid gap-4">
                      {plantDetails.commonIssues.map((issue, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </span>
                            {issue.name}
                          </h4>
                          <div className="space-y-3 text-sm pl-10">
                            <div className="space-y-1">
                              <span className="text-gray-500 text-xs uppercase tracking-wider">Symptoms</span>
                              <p className="text-gray-700 leading-relaxed">{issue.symptoms}</p>
                            </div>
                            <div className="pt-2 space-y-1">
                              <span className="text-gray-500 text-xs uppercase tracking-wider">Solution</span>
                              <p className="text-gray-700 leading-relaxed">{issue.solution}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Maintenance Guide Content */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  activeTab === 'maintenance' ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-6">
                    <div className="grid gap-4">
                      {plantDetails.maintenanceTasks.map((stage, index) => (
                        <div 
                          key={index} 
                          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
                        >
                          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2 text-lg">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                            {stage.stage.charAt(0).toUpperCase() + stage.stage.slice(1)} Stage
                          </h4>
                          <ul className="space-y-2 pl-10">
                            {stage.tasks.map((task, taskIndex) => (
                              <li 
                                key={taskIndex} 
                                className="group flex items-start gap-3 py-2 border-b border-gray-50 last:border-0"
                              >
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors duration-200">
                                  <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </span>
                                <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-200">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// Add this new component for the search functionality
function PlantSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
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
    setSelectedPlant(plantName)
    setIsModalOpen(true)
    setSearchTerm('')
    setSearchResults([])
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

// Add type definitions at the top
type StateAlias = 'WA' | 'NT' | 'VIC' | 'NSW' | 'QLD' | 'SA' | 'TAS' | 'ACT';
type StateName = 'Western Australia' | 'Northern Territory' | 'Victoria' | 'New South Wales' | 'Queensland' | 'South Australia' | 'Tasmania' | 'Australian Capital Territory';

// Update state aliases mapping
const stateAliases: Record<StateAlias, StateName> = {
  'WA': 'Western Australia',
  'NT': 'Northern Territory',
  'VIC': 'Victoria',
  'NSW': 'New South Wales',
  'QLD': 'Queensland',
  'SA': 'South Australia',
  'TAS': 'Tasmania',
  'ACT': 'Australian Capital Territory'
} as const;

// Update the getStateCalendar function
const getStateCalendar = (state: string) => {
  const canonicalName = (state in stateAliases ? stateAliases[state as StateAlias] : state) as StateName;
  // This function may not be needed if PLANTING_GUIDES is used instead
  return PLANTING_GUIDES;
};

// Update the PLANTING_GUIDES type
interface PlantingGuide {
  name: string;
  type: 'sow' | 'plant';
}

const PLANTING_GUIDES: Record<string, Record<string, PlantingGuide[]>> = {
  'cool temperate': {
    // Tasmania's existing data remains unchanged
    'January': [
      { name: 'Lettuce', type: 'sow' },
      { name: 'Carrots', type: 'sow' },
      // ... existing Tasmania data
    ],
    // ... other months
  },
  'subtropical': {
    'January': [
      { name: 'Snake Beans', type: 'sow' },
      { name: 'Okra', type: 'sow' },
      // ... Queensland-specific data
    ],
    // ... other months
  },
  'mediterranean': {
    'January': [
      { name: 'Tomatoes', type: 'sow' },
      { name: 'Basil', type: 'plant' },
      // ... WA/SA specific data
    ],
    // ... other months
  },
  // ... add other climate zones
};

export default function PlantingCalendarPage() {
  const { data: profile } = useProfile()
  const [locationState, setLocationState] = useState<GardenLocation | null>(null);
  const [plantingGuide, setPlantingGuide] = useState<Record<string, PlantInfo[]>>({});

  // Load location client-side to avoid SSR/localStorage issues
  useEffect(() => {
    const location = getNormalizedLocation();
    setLocationState(location);
  }, []);

  useEffect(() => {
    if (locationState) {
      try {
        // Map detailed climate zones to planting guide keys
        const climateZoneMap: Record<string, string> = {
          'cool temperate': 'cool',
          'temperate': 'warm',
          'warm temperate': 'warm',
          'subtropical': 'tropical',
          'tropical': 'tropical',
          'mediterranean': 'warm',
          'arid': 'warm'
        };

        const mappedZone = climateZoneMap[locationState.climateZone] || 'cool';
        const guide = PLANTING_GUIDE[mappedZone] || {};
        setPlantingGuide(guide);
      } catch (error) {
        console.error('Error setting planting guide:', error);
        setPlantingGuide({});
      }
    }
  }, [locationState]);

  // If no location is set, show location selector
  if (!locationState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-center mb-8">
            Select Your Location
          </h1>
          <Link 
            href="/location-select"
            className="block w-full text-center py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Set Location
          </Link>
          </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-4xl font-bold text-green-800">
                  Planting Calendar
                </h1>
                <Link 
                  href="/location-select"
                  className="text-sm text-green-600 hover:text-green-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Change Location
                </Link>
              </div>
              
              {/* Location Info */}
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{locationState.city}, {locationState.state}</span>
                <span className="mx-2">•</span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">
                  {locationState.climateZone}
                </span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-6">
              {monthRows.map((months, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-6">
                  {months.map((month) => (
                    <MonthCard
                      key={month}
                      month={month}
                      activities={plantingGuide[month] || []}
                      location={locationState}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 