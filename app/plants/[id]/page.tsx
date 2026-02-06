'use client'

import { useParams } from 'next/navigation'
import Sidebar from '../../components/Sidebar'

interface PlantDetail {
  id: string
  name: string
  scientificName: string
  category: string
  description: string
  growingInfo: {
    sunlight: string
    water: string
    soil: string
    spacing: string
    companions: string[]
    avoid: string[]
  }
  seasonalCare: {
    spring: string[]
    summer: string[]
    autumn: string[]
    winter: string[]
  }
  commonIssues: {
    pests: string[]
    diseases: string[]
    solutions: string[]
  }
  propagation: {
    methods: string[]
    bestTime: string
    difficulty: string
  }
}

// Mock data - replace with actual database/API
const PLANT_DATABASE: Record<string, PlantDetail> = {
  'tomatoes': {
    id: 'tomatoes',
    name: 'Tomatoes',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    description: 'Versatile fruit commonly grown as a vegetable...',
    growingInfo: {
      sunlight: 'Full sun (6-8 hours daily)',
      water: 'Regular, consistent watering',
      soil: 'Rich, well-draining soil',
      spacing: '45-60cm apart',
      companions: ['Basil', 'Marigolds', 'Carrots'],
      avoid: ['Potatoes', 'Corn', 'Brassicas']
    },
    seasonalCare: {
      spring: ['Start seeds indoors', 'Prepare soil', 'Plant out after frost'],
      summer: ['Regular pruning', 'Support heavy branches', 'Monitor water needs'],
      autumn: ['Harvest remaining fruit', 'Remove spent plants'],
      winter: ['Plan next season', 'Order seeds']
    },
    commonIssues: {
      pests: ['Aphids', 'Tomato hornworm', 'Whiteflies'],
      diseases: ['Blight', 'Leaf spot', 'Powdery mildew'],
      solutions: ['Proper spacing', 'Good air circulation', 'Regular inspection']
    },
    propagation: {
      methods: ['Seeds', 'Stem cuttings'],
      bestTime: 'Early spring',
      difficulty: 'Easy'
    }
  },
  // Add more plants...
}

export default function PlantDetail() {
  const params = useParams()
  const plantId = params.id as string
  const plant = PLANT_DATABASE[plantId]

  if (!plant) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-2xl text-red-600">Plant Not Found</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{plant.name}</h1>
            <p className="text-gray-600 italic mb-6">{plant.scientificName}</p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Growing Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Growing Information</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Sunlight:</span> {plant.growingInfo.sunlight}
                  </div>
                  <div>
                    <span className="font-medium">Water:</span> {plant.growingInfo.water}
                  </div>
                  <div>
                    <span className="font-medium">Soil:</span> {plant.growingInfo.soil}
                  </div>
                  <div>
                    <span className="font-medium">Spacing:</span> {plant.growingInfo.spacing}
                  </div>
                </div>
              </div>

              {/* Companion Planting */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Companion Planting</h2>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Good Companions:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {plant.growingInfo.companions.map(companion => (
                        <span key={companion} className="px-2 py-1 bg-green-50 text-green-700 rounded">
                          {companion}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Avoid Planting Near:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {plant.growingInfo.avoid.map(plant => (
                        <span key={plant} className="px-2 py-1 bg-red-50 text-red-700 rounded">
                          {plant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seasonal Care */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Seasonal Care</h2>
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(plant.seasonalCare).map(([season, tasks]) => (
                  <div key={season} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 capitalize mb-2">{season}</h3>
                    <ul className="space-y-2">
                      {tasks.map((task, index) => (
                        <li key={index} className="text-gray-600 text-sm">• {task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Issues */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Common Issues</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Common Pests</h3>
                  <ul className="space-y-1">
                    {plant.commonIssues.pests.map((pest, index) => (
                      <li key={index} className="text-gray-600">• {pest}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Common Diseases</h3>
                  <ul className="space-y-1">
                    {plant.commonIssues.diseases.map((disease, index) => (
                      <li key={index} className="text-gray-600">• {disease}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Prevention & Solutions</h3>
                  <ul className="space-y-1">
                    {plant.commonIssues.solutions.map((solution, index) => (
                      <li key={index} className="text-gray-600">• {solution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Propagation */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Propagation</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <span className="font-medium">Methods:</span>
                    <ul className="mt-2 space-y-1">
                      {plant.propagation.methods.map((method, index) => (
                        <li key={index} className="text-gray-600">• {method}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium">Best Time:</span>
                    <p className="mt-2 text-gray-600">{plant.propagation.bestTime}</p>
                  </div>
                  <div>
                    <span className="font-medium">Difficulty:</span>
                    <p className="mt-2 text-gray-600">{plant.propagation.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 