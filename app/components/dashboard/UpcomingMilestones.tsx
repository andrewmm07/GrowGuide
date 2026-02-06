'use client'
import { useState } from 'react'

interface Milestone {
  id: string
  plantName: string
  type: 'harvest' | 'fertilize' | 'support' | 'prune'
  daysUntil: number
}

export default function UpcomingMilestones() {
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      plantName: 'Tomatoes',
      type: 'harvest',
      daysUntil: 6
    },
    {
      id: '2',
      plantName: 'Peas',
      type: 'support',
      daysUntil: 3
    },
    {
      id: '3',
      plantName: 'Lettuce',
      type: 'fertilize',
      daysUntil: 2
    }
  ])

  const getMilestoneIcon = (type: Milestone['type']) => {
    switch (type) {
      case 'harvest':
        return '🌾'
      case 'fertilize':
        return '🌿'
      case 'support':
        return '📏'
      case 'prune':
        return '✂️'
      default:
        return '📅'
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Milestones</h2>
      <div className="space-y-3">
        {milestones
          .sort((a, b) => a.daysUntil - b.daysUntil)
          .map(milestone => (
            <div 
              key={milestone.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="text-xl">
                {getMilestoneIcon(milestone.type)}
              </div>
              <div>
                <p className="text-gray-700">
                  {milestone.plantName} - {milestone.type}
                </p>
                <p className="text-sm text-gray-500">
                  In {milestone.daysUntil} days
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
} 