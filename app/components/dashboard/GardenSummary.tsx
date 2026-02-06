'use client'
import { useState } from 'react'
import Link from 'next/link'

interface GardenPlant {
  id: string
  name: string
  plantedDate: Date
  daysUntilHarvest: number
  stage: 'seedling' | 'growing' | 'flowering' | 'fruiting' | 'ready'
}

export default function GardenSummary() {
  const [plants] = useState<GardenPlant[]>([
    {
      id: '1',
      name: 'Tomatoes',
      plantedDate: new Date('2024-02-01'),
      daysUntilHarvest: 45,
      stage: 'growing'
    },
    {
      id: '2',
      name: 'Lettuce',
      plantedDate: new Date('2024-02-15'),
      daysUntilHarvest: 15,
      stage: 'ready'
    },
    {
      id: '3',
      name: 'Carrots',
      plantedDate: new Date('2024-02-10'),
      daysUntilHarvest: 30,
      stage: 'growing'
    }
  ])

  const getStageIcon = (stage: GardenPlant['stage']) => {
    switch (stage) {
      case 'seedling':
        return '🌱'
      case 'growing':
        return '🌿'
      case 'flowering':
        return '🌸'
      case 'fruiting':
        return '🍅'
      case 'ready':
        return '✨'
      default:
        return '🌱'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">My Garden</h2>
        <Link 
          href="/my-garden"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          View All Plants
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {plants.map(plant => (
          <div
            key={plant.id}
            className="flex-none w-64 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" role="img" aria-label={plant.stage}>
                {getStageIcon(plant.stage)}
              </span>
              <h3 className="font-medium text-gray-800">{plant.name}</h3>
            </div>
            <div className="text-sm text-gray-600">
              <p>Planted: {plant.plantedDate.toLocaleDateString()}</p>
              <p>Days until harvest: {plant.daysUntilHarvest}</p>
              <p className="capitalize">Stage: {plant.stage}</p>
            </div>
          </div>
        ))}

        <Link
          href="/my-garden/add"
          className="flex-none w-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <div className="text-center">
            <span className="block text-2xl mb-1">➕</span>
            <span className="text-gray-600">Add a Plant</span>
          </div>
        </Link>
      </div>
    </div>
  )
} 