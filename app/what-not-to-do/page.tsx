'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getClimateZone } from '../../src/utils/climate'

type ClimateZone = 'warm' | 'cool'
type StateCode = 'NSW' | string // Add other state codes as needed

interface PlantWarning {
  name: string
  reason: string
  alternatives: string[]
  image?: string
}

interface InvasivePlant {
  name: string
  scientificName: string
  description: string
  impact: string
  alternatives: string[]
  image?: string
}

const CLIMATE_WARNINGS: { [key: string]: PlantWarning[] } = {
  'warm': [
    {
      name: 'Brussels Sprouts',
      reason: 'Requires cool temperatures to develop properly. In warm climates, they become bitter and fail to form tight heads.',
      alternatives: ['Cabbage', 'Kale', 'Collard Greens']
    },
    {
      name: 'Peas',
      reason: 'Struggle in hot weather and high humidity, leading to poor pod development and increased disease susceptibility.',
      alternatives: ['Bush Beans', 'Winged Beans', 'Yard Long Beans']
    },
    {
      name: 'Cauliflower',
      reason: 'Needs cool weather to form heads properly. Heat causes loose, discolored heads.',
      alternatives: ['Broccoli', 'Chinese Cabbage', 'Kohlrabi']
    },
    {
      name: 'Spinach',
      reason: 'Bolts quickly in warm weather, becoming bitter and unusable.',
      alternatives: ['Malabar Spinach', 'Brazilian Spinach', 'Sweet Potato Leaves']
    }
  ],
  'cool': [
    {
      name: 'Sweet Potato',
      reason: 'Requires long, hot growing season. Cool climates have insufficient heat for proper tuber development.',
      alternatives: ['Regular Potatoes', 'Parsnips', 'Carrots']
    },
    {
      name: 'Okra',
      reason: 'Needs consistent warm temperatures to produce pods. Cool weather stunts growth.',
      alternatives: ['Green Beans', 'Snap Peas', 'Asparagus']
    },
    {
      name: 'Watermelon',
      reason: 'Requires long, hot season to develop sweetness. Cool climates produce bland fruit.',
      alternatives: ['Cantaloupe', 'Honeydew', 'Sugar Baby Watermelon']
    },
    {
      name: 'Eggplant',
      reason: 'Needs warm nights and hot days. Cool weather results in poor fruit set.',
      alternatives: ['Zucchini', 'Peppers', 'Tomatoes']
    }
  ]
}

const INVASIVE_PLANTS: { [key: string]: InvasivePlant[] } = {
  'NSW': [
    {
      name: 'English Ivy',
      scientificName: 'Hedera helix',
      description: 'Common ornamental vine that quickly becomes invasive',
      impact: 'Smothers native vegetation and can damage building structures',
      alternatives: ['Native Violet', 'Snake Vine', 'Native Jasmine']
    },
    {
      name: 'Morning Glory',
      scientificName: 'Ipomoea indica',
      description: 'Fast-growing climbing vine with purple-blue flowers',
      impact: 'Rapidly covers and kills native plants, difficult to control',
      alternatives: ['Native Wisteria', 'Purple Coral Pea', 'Native Sarsaparilla']
    },
    {
      name: 'Lantana',
      scientificName: 'Lantana camara',
      description: 'Heavily branched shrub with colorful flowers',
      impact: 'Toxic to livestock, forms dense thickets that exclude native species',
      alternatives: ['Native Verbena', 'Cut-leaf Daisy', 'Native Lantana']
    },
    {
      name: 'Privet',
      scientificName: 'Ligustrum species',
      description: 'Dense evergreen shrub or small tree',
      impact: 'Invades bushland, outcompetes native species, berries spread by birds',
      alternatives: ['Lilly Pilly', 'Native Laurel', 'Sweet Pittosporum']
    }
  ],
  // Add more states...
}

function WhatNotToDoContent() {
  const [openSection, setOpenSection] = useState<string | null>('climate')
  const searchParams = useSearchParams()
  if (!searchParams) {
    return <div>Loading...</div>
  }
  const state = searchParams.get('state')
  const climateZone = getClimateZone(state || '', searchParams.get('city') || '')

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">What Not To Do</h1>

        {/* Climate-Unsuitable Plants */}
        <div className="mb-8">
          <button
            onClick={() => setOpenSection(openSection === 'climate' ? null : 'climate')}
            className="w-full flex items-center justify-between p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold">Plants Unsuitable for Your Climate</h2>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${openSection === 'climate' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'climate' && (
            <div className="mt-4 grid gap-6 p-6 bg-white rounded-xl shadow-md">
              {CLIMATE_WARNINGS[climateZone]?.map((plant, index) => (
                <PlantWarningCard key={index} plant={plant} />
              ))}
            </div>
          )}
        </div>

        {/* Invasive Plants */}
        <div className="mb-8">
          <button
            onClick={() => setOpenSection(openSection === 'invasive' ? null : 'invasive')}
            className="w-full flex items-center justify-between p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold">Invasive Plants to Avoid</h2>
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${openSection === 'invasive' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {openSection === 'invasive' && (
            <div className="mt-4 grid gap-6 p-6 bg-white rounded-xl shadow-md">
              {INVASIVE_PLANTS[state || '']?.map((plant, index) => (
                <InvasivePlantCard key={index} plant={plant} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WhatNotToDo() {
  return (
    <Suspense fallback={<div className="py-12 px-4"><div className="max-w-4xl mx-auto">Loading...</div></div>}>
      <WhatNotToDoContent />
    </Suspense>
  )
}

function PlantWarningCard({ plant }: { plant: PlantWarning }) {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{plant.name}</h3>
        <p className="text-gray-600 mb-3">{plant.reason}</p>
        <div>
          <span className="font-medium text-gray-700">Try instead: </span>
          {plant.alternatives.join(', ')}
        </div>
      </div>
    </div>
  )
}

function InvasivePlantCard({ plant }: { plant: InvasivePlant }) {
  return (
    <div className="p-4 bg-orange-50 rounded-lg">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{plant.name}</h3>
        <p className="text-sm text-gray-500 italic mb-2">{plant.scientificName}</p>
        <p className="text-gray-600 mb-2">{plant.description}</p>
        <p className="text-red-600 mb-3">{plant.impact}</p>
        <div>
          <span className="font-medium text-gray-700">Native alternatives: </span>
          {plant.alternatives.join(', ')}
        </div>
      </div>
    </div>
  )
} 