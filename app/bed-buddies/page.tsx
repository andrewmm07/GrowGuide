'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CompanionInfo {
  goodCompanions: string[]
  badCompanions: string[]
  reasons: string[]
}

const COMPANION_DATA: { [key: string]: CompanionInfo } = {
  'Tomatoes': {
    goodCompanions: ['Basil', 'Carrots', 'Onions', 'Parsley', 'Marigolds'],
    badCompanions: ['Potatoes', 'Brassicas', 'Fennel'],
    reasons: [
      'Basil improves flavor and repels pests',
      'Carrots break up soil and improve tomato growth',
      'Marigolds deter nematodes',
      'Keep away from potatoes as they can spread blight between them',
      'Brassicas and tomatoes compete for same nutrients'
    ]
  },
  'Carrots': {
    goodCompanions: ['Tomatoes', 'Onions', 'Leeks', 'Rosemary', 'Sage'],
    badCompanions: ['Dill', 'Parsnips', "Queen Anne's Lace"],
    reasons: [
      'Tomatoes provide shade and secrete chemicals that help carrots',
      'Onions and leeks repel carrot fly',
      'Avoid planting with dill as it can cross-pollinate',
      'Keep away from related plants that may share pests'
    ]
  },
  'Beans': {
    goodCompanions: ['Corn', 'Potatoes', 'Cucumbers', 'Strawberries'],
    badCompanions: ['Onions', 'Garlic', 'Leeks'],
    reasons: [
      'Corn provides support for climbing beans',
      'Beans fix nitrogen in soil which benefits heavy feeders',
      'Alliums (onions, garlic) can stunt bean growth'
    ]
  },
  'Cucumbers': {
    goodCompanions: ['Beans', 'Corn', 'Peas', 'Radishes', 'Sunflowers'],
    badCompanions: ['Potatoes', 'Aromatic Herbs'],
    reasons: [
      'Beans and peas fix nitrogen that cucumbers need',
      'Radishes deter cucumber beetles',
      'Sunflowers provide support and shade',
      'Potatoes can inhibit growth'
    ]
  },
  'Onions': {
    goodCompanions: ['Carrots', 'Beets', 'Lettuce', 'Cabbage', 'Tomatoes'],
    badCompanions: ['Beans', 'Peas', 'Sage'],
    reasons: [
      'Helps deter pests from many vegetables',
      'Improves growth of nearby plants',
      'Beans and peas are stunted by alliums'
    ]
  },
  'Peas': {
    goodCompanions: ['Carrots', 'Turnips', 'Radishes', 'Cucumber', 'Corn'],
    badCompanions: ['Onions', 'Garlic', 'Potatoes'],
    reasons: [
      'Fixes nitrogen in soil for heavy feeders',
      'Corn provides support for climbing',
      'Alliums (onions, garlic) stunt growth'
    ]
  },
  'Potatoes': {
    goodCompanions: ['Beans', 'Corn', 'Cabbage', 'Horseradish'],
    badCompanions: ['Tomatoes', 'Cucumbers', 'Sunflowers'],
    reasons: [
      'Horseradish improves disease resistance',
      'Beans help fix nitrogen',
      'Tomatoes and potatoes are in same family and share diseases'
    ]
  },
  'Lettuce': {
    goodCompanions: ['Carrots', 'Radishes', 'Strawberries', 'Cucumbers'],
    badCompanions: ['Celery', 'Parsley', 'Broccoli'],
    reasons: [
      'Tall plants provide shade in summer',
      'Radishes mark rows and break soil',
      'Some brassicas can stunt growth'
    ]
  }
}

export default function PlantLibraryPage() {
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPlants = Object.keys(COMPANION_DATA)
    .filter(plant => plant.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-3">
              Bed Buddies
            </h1>
            <p className="text-gray-600 text-lg">
              Discover the perfect plant companions for your garden
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plant Selection Panel */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl">
              <div className="p-6 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-100 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
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
              <div className="p-4 max-h-[600px] overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {filteredPlants.map(plant => (
                    <button
                      key={plant}
                      onClick={() => setSelectedPlant(plant)}
                      className={`w-full px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                        selectedPlant === plant
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${selectedPlant === plant ? 'bg-gray-500' : 'bg-gray-300'}`} />
                        <span>{plant}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Companion Details Panel */}
            {selectedPlant ? (
              <div className="md:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">{selectedPlant}</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Good Companions */}
                    <div className="bg-green-500/5 backdrop-blur-sm rounded-xl p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Good Companions
                      </h3>
                      <div className="space-y-2">
                        {COMPANION_DATA[selectedPlant].goodCompanions.map(companion => (
                          <div 
                            key={companion} 
                            className="flex items-center gap-3 py-2 px-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-green-800 font-medium">{companion}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bad Companions */}
                    <div className="bg-red-500/5 backdrop-blur-sm rounded-xl p-6">
                      <h3 className="flex items-center gap-2 text-lg font-semibold text-red-800 mb-4">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Keep Apart
                      </h3>
                      <div className="space-y-2">
                        {COMPANION_DATA[selectedPlant].badCompanions.map(companion => (
                          <div 
                            key={companion} 
                            className="flex items-center gap-3 py-2 px-1"
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-red-800 font-medium">{companion}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="mt-8 bg-blue-500/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-800 mb-4">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Why These Combinations?
                    </h3>
                    <div className="space-y-3">
                      {COMPANION_DATA[selectedPlant].reasons.map((reason, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 py-2 px-1"
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                          <span className="text-blue-900">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-2 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xl">Select a plant to see its companions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 