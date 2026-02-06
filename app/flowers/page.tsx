'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar'

interface FlowerInfo {
  name: string
  type: 'Annual' | 'Perennial' | 'Biennial'
  bloomingSeason: string[]
  height: string
  spacing: string
  sunlight: string
  soil: string
  watering: string
  maintenance: 'Low' | 'Medium' | 'High'
  commonIssues: {
    problem: string
    solution: string
  }[]
  companionPlants: string[]
  tips: string[]
  description: string
}

const FLOWER_DATA: FlowerInfo[] = [
  {
    name: 'Lavender',
    type: 'Perennial',
    bloomingSeason: ['Summer', 'Fall'],
    height: '60-90cm',
    spacing: '30-45cm',
    sunlight: 'Full sun',
    soil: 'Well-draining, alkaline soil',
    watering: 'Low water needs once established',
    maintenance: 'Low',
    commonIssues: [
      {
        problem: 'Root rot',
        solution: 'Ensure good drainage and avoid overwatering'
      },
      {
        problem: 'Leggy growth',
        solution: 'Prune regularly and ensure adequate sunlight'
      }
    ],
    companionPlants: ['Roses', 'Sage', 'Thyme'],
    tips: [
      'Prune in early spring',
      'Avoid fertilizing heavily',
      'Plant in raised beds for better drainage'
    ],
    description: 'Fragrant herb with purple blooms, excellent for borders and drought-tolerant gardens.'
  },
  {
    name: 'Marigold',
    type: 'Annual',
    bloomingSeason: ['Spring', 'Summer', 'Fall'],
    height: '20-30cm',
    spacing: '15-30cm',
    sunlight: 'Full sun',
    soil: 'Well-draining, average soil',
    watering: 'Moderate, keep soil moist',
    maintenance: 'Low',
    commonIssues: [
      {
        problem: 'Powdery mildew',
        solution: 'Improve air circulation and avoid overhead watering'
      },
      {
        problem: 'Spider mites',
        solution: 'Spray with neem oil or insecticidal soap'
      }
    ],
    companionPlants: ['Tomatoes', 'Peppers', 'Cucumbers'],
    tips: [
      'Deadhead regularly to promote blooming',
      'Great for pest control in vegetable gardens',
      'Can be started from seed directly in garden'
    ],
    description: 'Easy-to-grow flowers with bright orange or yellow blooms, excellent for pest control.'
  },
  // Add more flowers...
]

export default function Flowers() {
  const [selectedFlower, setSelectedFlower] = useState<FlowerInfo | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'All' | 'Annual' | 'Perennial' | 'Biennial'>('All')

  const filteredFlowers = FLOWER_DATA.filter(flower => {
    const matchesSearch = flower.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'All' || flower.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <Sidebar />
      
      <div className="ml-80 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-3">
              Flower Guide
            </h1>
            <p className="text-gray-600 text-lg">
              Discover and learn about different flowers for your garden
            </p>
          </div>

          {/* Search and Filter */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search flowers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 border-2 border-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
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
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="px-4 py-3 rounded-xl bg-white/80 border-2 border-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200"
            >
              <option value="All">All Types</option>
              <option value="Annual">Annuals</option>
              <option value="Perennial">Perennials</option>
              <option value="Biennial">Biennials</option>
            </select>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Flower List */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Flower</h2>
              <div className="space-y-2">
                {filteredFlowers.map(flower => (
                  <button
                    key={flower.name}
                    onClick={() => setSelectedFlower(flower)}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                      selectedFlower?.name === flower.name
                        ? 'bg-gray-100 text-gray-900'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{flower.name}</span>
                      <span className="text-sm text-gray-500">{flower.type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Flower Details */}
            {selectedFlower ? (
              <div className="md:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedFlower.name}</h2>
                  <p className="text-gray-600 mb-6">{selectedFlower.description}</p>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Growing Requirements</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Type:</span> {selectedFlower.type}</p>
                        <p><span className="font-medium">Height:</span> {selectedFlower.height}</p>
                        <p><span className="font-medium">Spacing:</span> {selectedFlower.spacing}</p>
                        <p><span className="font-medium">Sunlight:</span> {selectedFlower.sunlight}</p>
                        <p><span className="font-medium">Soil:</span> {selectedFlower.soil}</p>
                        <p><span className="font-medium">Watering:</span> {selectedFlower.watering}</p>
                        <p><span className="font-medium">Maintenance:</span> {selectedFlower.maintenance}</p>
                      </div>
                    </div>

                    {/* Blooming Season */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800">Blooming Season</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFlower.bloomingSeason.map(season => (
                          <span 
                            key={season}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {season}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Common Issues */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Issues</h3>
                    <div className="space-y-4">
                      {selectedFlower.commonIssues.map((issue, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-4">
                          <p className="font-medium text-red-800">{issue.problem}</p>
                          <p className="text-red-600 mt-1">{issue.solution}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Growing Tips</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {selectedFlower.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Companion Plants */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Companion Plants</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFlower.companionPlants.map(plant => (
                        <span 
                          key={plant}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {plant}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-xl">Select a flower to see details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 