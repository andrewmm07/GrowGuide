'use client'
import { useState, useEffect } from 'react'
import { UserLocation } from '@/app/types/user'

interface PestAlert {
  id: string
  pest: string
  risk: 'low' | 'medium' | 'high'
  affectedPlants: string[]
  advice: string
}

interface PestAlertsProps {
  location: UserLocation | null
}

export default function PestAlerts({ location }: PestAlertsProps) {
  const [alerts, setAlerts] = useState<PestAlert[]>([
    {
      id: '1',
      pest: 'Aphids',
      risk: 'high',
      affectedPlants: ['Leafy Greens', 'Tomatoes'],
      advice: 'Monitor leaves daily, use neem oil if spotted'
    },
    {
      id: '2',
      pest: 'Cabbage Moths',
      risk: 'medium',
      affectedPlants: ['Cabbage', 'Broccoli'],
      advice: 'Install butterfly nets or use organic deterrents'
    }
  ])

  const getRiskColor = (risk: PestAlert['risk']) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-50'
      case 'medium':
        return 'text-orange-600 bg-orange-50'
      case 'low':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Pest & Disease Alerts</h2>
      {location && alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 rounded-lg ${getRiskColor(alert.risk)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{alert.pest}</h3>
                <span className="capitalize text-sm">{alert.risk} risk</span>
              </div>
              <p className="text-sm mb-2">
                Affects: {alert.affectedPlants.join(', ')}
              </p>
              <p className="text-sm">{alert.advice}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No current pest alerts for your area</p>
      )}
    </div>
  )
} 