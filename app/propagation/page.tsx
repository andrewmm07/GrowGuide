'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'

interface PropagationMethod {
  name: string
  description: string
  difficulty: 'Easy' | 'Moderate' | 'Advanced'
  timeToRoot: string
  successRate: string
  bestSeasons: string[]
  steps: string[]
  tips: string[]
}

interface PlantPropagation {
  name: string
  methods: PropagationMethod[]
  image: string
  category: 'Herbs' | 'Vegetables' | 'Fruits' | 'Flowers' | 'Trees & Shrubs'
}

const PROPAGATION_DATA: PlantPropagation[] = [
  {
    name: 'Tomatoes',
    category: 'Vegetables',
    image: '/images/tomatoes.jpg',
    methods: [
      {
        name: 'Stem Cuttings',
        description: 'Take cuttings from healthy side shoots for new plants',
        difficulty: 'Easy',
        timeToRoot: '1-2 weeks',
        successRate: '80%',
        bestSeasons: ['Spring', 'Summer'],
        steps: [
          'Choose healthy side shoots 10-15cm long',
          'Remove lower leaves, keeping top 2-3 sets',
          'Place in water or moist potting mix',
          'Keep warm and in bright indirect light',
          'Roots should appear within 7-14 days'
        ],
        tips: [
          'Use clean, sharp scissors to prevent disease',
          'Change water every 2-3 days if water propagating',
          'Avoid full sun until roots are established'
        ]
      },
      {
        name: 'Seeds',
        description: 'Start from saved or purchased seeds',
        difficulty: 'Easy',
        timeToRoot: '5-10 days',
        successRate: '90%',
        bestSeasons: ['Spring'],
        steps: [
          'Plant seeds 6mm deep in seed raising mix',
          'Keep soil consistently moist',
          'Maintain temperature around 20-25°C',
          'Seedlings emerge in 5-10 days',
          'Transplant when 10-15cm tall'
        ],
        tips: [
          'Use fresh seeds for best results',
          'Provide good air circulation to prevent damping off',
          'Start indoors 6-8 weeks before last frost'
        ]
      }
    ]
  },
  {
    name: 'Basil',
    category: 'Herbs',
    image: '/images/basil.jpg',
    methods: [
      {
        name: 'Stem Cuttings in Water',
        description: 'One of the easiest herbs to propagate from cuttings',
        difficulty: 'Easy',
        timeToRoot: '1-2 weeks',
        successRate: '95%',
        bestSeasons: ['Spring', 'Summer'],
        steps: [
          'Cut 10-15cm stems just below a leaf node',
          'Remove lower leaves, keeping top 2-3 sets',
          'Place in clean water, changing every few days',
          'Keep in bright indirect light',
          'Plant in soil when roots are 5cm long'
        ],
        tips: [
          'Choose healthy, non-flowering stems',
          'Keep leaves above water level to prevent rot',
          'Add rooting hormone for faster results'
        ]
      }
    ]
  },
  {
    name: 'Monstera',
    category: 'Trees & Shrubs',
    image: '/images/monstera.jpg',
    methods: [
      {
        name: 'Node Cuttings',
        description: 'Propagate from stem sections with aerial roots',
        difficulty: 'Moderate',
        timeToRoot: '3-4 weeks',
        successRate: '85%',
        bestSeasons: ['Spring', 'Summer'],
        steps: [
          'Cut below an aerial root or node',
          'Ensure cutting has 1-2 leaves and a node',
          'Place in water or moist sphagnum moss',
          'Keep warm (20-25°C) with high humidity',
          'Transfer to soil when roots are well developed'
        ],
        tips: [
          'Use clean, sharp tools to prevent disease',
          'Mist leaves regularly if humidity is low',
          'Be patient - roots take time to develop'
        ]
      }
    ]
  },
  {
    name: 'Strawberries',
    category: 'Fruits',
    image: '/images/strawberries.jpg',
    methods: [
      {
        name: 'Runner Propagation',
        description: 'Use natural runners to create new plants',
        difficulty: 'Easy',
        timeToRoot: '2-3 weeks',
        successRate: '90%',
        bestSeasons: ['Spring', 'Summer'],
        steps: [
          'Select healthy runners with developing leaves',
          'Pin runner to soil while attached to parent',
          'Keep soil consistently moist',
          'Cut from parent plant when well rooted',
          'Transplant to final position'
        ],
        tips: [
          'Choose runners from productive plants',
          'Remove runners from parent to encourage fruiting',
          'Plant in well-draining soil'
        ]
      }
    ]
  },
  {
    name: 'Lavender',
    category: 'Herbs',
    image: '/images/lavender.jpg',
    methods: [
      {
        name: 'Semi-Ripe Cuttings',
        description: "Take cuttings from this year's growth",
        difficulty: 'Moderate',
        timeToRoot: '4-6 weeks',
        successRate: '70%',
        bestSeasons: ['Late Summer', 'Autumn'],
        steps: [
          'Take 10cm cuttings from non-flowering stems',
          'Remove lower leaves and strip bark from bottom',
          'Dip in rooting hormone',
          'Plant in gritty propagation mix',
          'Keep in humid environment but well-ventilated'
        ],
        tips: [
          'Morning is best time to take cuttings',
          'Avoid overwatering to prevent rot',
          'Remove flower buds if they appear'
        ]
      }
    ]
  },
  {
    name: 'Snake Plant',
    category: 'Trees & Shrubs',
    image: '/images/snake-plant.jpg',
    methods: [
      {
        name: 'Leaf Cuttings',
        description: 'Propagate from individual leaf sections',
        difficulty: 'Easy',
        timeToRoot: '4-8 weeks',
        successRate: '80%',
        bestSeasons: ['Spring', 'Summer'],
        steps: [
          'Cut leaf into 10cm sections',
          'Remember which end was bottom',
          'Let cuts callus for 24 hours',
          'Plant bottom end in well-draining mix',
          'Water sparingly until roots develop'
        ],
        tips: [
          'Maintain original leaf orientation',
          'Avoid overwatering to prevent rot',
          'Be patient - new growth takes time'
        ]
      },
      {
        name: 'Division',
        description: 'Split established plants into multiple sections',
        difficulty: 'Easy',
        timeToRoot: 'Immediate',
        successRate: '95%',
        bestSeasons: ['Spring'],
        steps: [
          'Remove plant from pot',
          'Gently separate roots and stems',
          'Ensure each section has healthy roots',
          'Replant in fresh potting mix',
          'Water thoroughly'
        ],
        tips: [
          'Use clean, sharp knife if needed',
          'Allow soil to dry slightly between waterings',
          'Keep divided plants in similar conditions'
        ]
      }
    ]
  }
]

export default function Propagation() {
  const [selectedPlant, setSelectedPlant] = useState<PlantPropagation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PlantPropagation['category'] | 'All'>('All')

  const categories = ['All', 'Herbs', 'Vegetables', 'Fruits', 'Flowers', 'Trees & Shrubs']
  
  const filteredPlants = PROPAGATION_DATA.filter(plant => 
    (selectedCategory === 'All' || plant.category === selectedCategory) &&
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Plant Propagation Guide</h1>
            <p className="text-gray-600">
              Learn how to multiply your plants using various propagation methods. 
              Select a plant to see detailed propagation instructions.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8 flex gap-4">
            <input
              type="text"
              placeholder="Search plants..."
              className="flex-1 p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PlantPropagation['category'] | 'All')}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {selectedPlant ? (
            // Plant Detail View
            <div className="bg-white rounded-xl shadow-sm p-6">
              <button
                onClick={() => setSelectedPlant(null)}
                className="mb-4 text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to plants
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedPlant.name}</h2>

              <div className="space-y-8">
                {selectedPlant.methods.map((method, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{method.name}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500">Difficulty</div>
                        <div className="font-medium text-gray-800">{method.difficulty}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Time to Root</div>
                        <div className="font-medium text-gray-800">{method.timeToRoot}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Success Rate</div>
                        <div className="font-medium text-gray-800">{method.successRate}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Best Seasons</div>
                        <div className="font-medium text-gray-800">{method.bestSeasons.join(', ')}</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Steps:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                          {method.steps.map((step, i) => (
                            <li key={i} className="text-gray-600">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-800 mb-2">Tips:</h4>
                        <ul className="list-disc list-inside space-y-2">
                          {method.tips.map((tip, i) => (
                            <li key={i} className="text-gray-600">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Plant Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlants.map((plant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPlant(plant)}
                  className="bg-white rounded-xl shadow-sm p-6 text-left hover:shadow-md transition-shadow"
                >
                  <div className="font-medium text-gray-800 mb-2">{plant.name}</div>
                  <div className="text-sm text-gray-500 mb-4">{plant.category}</div>
                  <div className="text-sm text-gray-600">
                    {plant.methods.length} propagation method{plant.methods.length !== 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 