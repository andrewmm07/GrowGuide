'use client'

import { useState, useEffect } from 'react'
import { PlantInfo, PlantDetails, PLANT_DETAILS } from '../types/plants'
import { PlantModal } from './PlantModal'
import { STATE_MONTH_SUMMARIES, normalizeState } from '../utils/climate'
import { getStateSummaries, type GardenLocation, DEFAULT_LOCATION } from '../utils/location'

interface MonthCardProps {
  month: string
  activities: PlantInfo[]
  location: GardenLocation
}

export function MonthCard({ month, activities, location }: MonthCardProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantDetails | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Debug initial props
  console.log('MonthCard render:', { month, activities })

  // Add this at the top of the MonthCard component
  console.log('Available plants in PLANT_DETAILS:', Object.keys(PLANT_DETAILS))
  console.log('Activities for this month:', activities)

  const handlePlantClick = (plantName: string) => {
    // Add detailed debug logging
    console.log('========= PLANT CLICK DEBUG =========')
    console.log('1. Plant clicked:', plantName)
    console.log('2. Plant name type:', typeof plantName)
    console.log('3. Plant name length:', plantName.length)
    console.log('4. Plant name characters:', Array.from(plantName).map(c => `'${c}'(${c.charCodeAt(0)})`))
    console.log('5. PLANT_DETAILS keys:', Object.keys(PLANT_DETAILS))
    console.log('6. Plant details found:', PLANT_DETAILS[plantName])
    console.log('7. Current modal state:', { isModalOpen, selectedPlant })

    const plantDetails = PLANT_DETAILS[plantName]
    if (plantDetails) {
      console.log('8. Setting plant details:', plantDetails)
      setSelectedPlant(plantDetails)
      setIsModalOpen(true)
      console.log('9. Modal should now be open')
    } else {
      console.warn('❌ Plant details not found for:', plantName)
      console.log('10. Available plants:', Object.keys(PLANT_DETAILS).join(', '))
    }
  }

  // Debug state changes
  useEffect(() => {
    console.log('State changed:', { selectedPlant, isModalOpen })
  }, [selectedPlant, isModalOpen])

  // Add at the top of the MonthCard component
  useEffect(() => {
    console.log('MonthCard activities:', activities.map(a => ({
      name: a.name,
      type: a.type,
      nameLength: a.name.length,
      chars: Array.from(a.name).map(c => c.charCodeAt(0))
    })))
  }, [activities])

  // Add state change debugging
  useEffect(() => {
    console.log('Modal state changed:', { isModalOpen, selectedPlant })
  }, [isModalOpen, selectedPlant])

  const summaries = getStateSummaries(location.state)
  const monthSummary = summaries[month.toLowerCase()]

  console.log('MonthCard:', {
    month,
    location,
    climateZone: location.climateZone,
    hasSummary: !!monthSummary,
    activityCount: activities.length
  })

  // Helper to determine if activity is PlantInfo
  const isPlantInfo = (activity: PlantInfo | string): activity is PlantInfo => {
    return typeof activity === 'object' && 'name' in activity && 'type' in activity;
  };

  const sowActivities = activities.filter(a => a.type === 'sow');
  const plantActivities = activities.filter(a => a.type === 'plant');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex flex-col h-[460px]">
        <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-5 py-3.5">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xl font-bold text-white">{month}</h3>
            <span className="text-sm font-medium text-slate-200">
              {getMonthSeason(month)}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 px-5 py-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-1.5">Overview</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {monthSummary}
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
              <ul className="space-y-1.5">
                {sowActivities.length > 0 ? (
                  sowActivities.map(activity => (
                    <li 
                      key={`sow-${activity.name}`}
                      onClick={() => handlePlantClick(activity.name)}
                      className="cursor-pointer hover:text-green-600 transition-colors"
                      role="button"
                      tabIndex={0}
                    >
                      {activity.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic text-sm pl-1">Nothing to sow</li>
                )}
              </ul>
            </div>

            {/* PLANT column */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                <h4 className="font-medium text-green-900 text-sm">PLANT</h4>
              </div>
              <ul className="space-y-1.5">
                {plantActivities.length > 0 ? (
                  plantActivities.map(activity => (
                    <li 
                      key={`plant-${activity.name}`}
                      onClick={() => handlePlantClick(activity.name)}
                      className="cursor-pointer hover:text-green-600 transition-colors"
                      role="button"
                      tabIndex={0}
                    >
                      {activity.name}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic text-sm pl-1">Nothing to plant</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <PlantModal 
        plant={selectedPlant}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
} 