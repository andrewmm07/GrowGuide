'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'

interface GardenPlant {
  name: string;
  datePlanted: string;
  type: 'seed' | 'seedling';
  location?: string;
  notes?: string;
  estimatedHarvest: string;
  schedule: any[];
  isHarvested?: boolean;
  harvestedDate?: string;
}

interface Harvest {
  id: string
  plantName: string
  harvestDate: Date
  daysUntil: number
}

export default function UpcomingHarvests() {
  const { user } = useAuth()
  const [harvests, setHarvests] = useState<Harvest[]>([])
  const [loading, setLoading] = useState(true)
  const [hasPlants, setHasPlants] = useState(false)

  useEffect(() => {
    const fetchHarvests = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const allHarvests: Harvest[] = []
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Check database first
        try {
          const { data: dbPlants } = await supabase
            .from('garden_plants')
            .select('*')
            .eq('user_id', user.id)

          if (dbPlants && dbPlants.length > 0) {
            const activePlants = dbPlants.filter((plant: any) => !plant.isHarvested)
            setHasPlants(activePlants.length > 0)

            activePlants.forEach((plant: any) => {
              if (plant.estimated_harvest || plant.estimatedHarvest) {
                const harvestDateStr = plant.estimated_harvest || plant.estimatedHarvest
                const harvestDate = new Date(harvestDateStr)
                harvestDate.setHours(0, 0, 0, 0)
                
                if (harvestDate >= today) {
                  const daysUntil = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  allHarvests.push({
                    id: `db-${plant.id}`,
                    plantName: plant.name || plant.plant_name || 'Unknown',
                    harvestDate,
                    daysUntil
                  })
                }
              }
            })
          }
        } catch (dbError) {
          console.error('Error checking database plants:', dbError)
        }

        // Also check localStorage (primary source for this app)
        try {
          const savedGarden = localStorage.getItem('myGarden')
          if (savedGarden) {
            const localPlants: GardenPlant[] = JSON.parse(savedGarden)
            const activePlants = localPlants.filter((plant: GardenPlant) => !plant.isHarvested)
            
            if (activePlants.length > 0) {
              setHasPlants(true)
            }

            activePlants.forEach((plant) => {
              if (plant.estimatedHarvest) {
                const harvestDate = new Date(plant.estimatedHarvest)
                harvestDate.setHours(0, 0, 0, 0)
                
                if (harvestDate >= today) {
                  const daysUntil = Math.ceil((harvestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  
                  // Check if we already have this plant from database
                  const existingIndex = allHarvests.findIndex(h => h.plantName === plant.name)
                  if (existingIndex === -1) {
                    allHarvests.push({
                      id: `local-${plant.name}-${plant.datePlanted}`,
                      plantName: plant.name,
                      harvestDate,
                      daysUntil
                    })
                  }
                }
              }
            })
          }
        } catch (localError) {
          console.error('Error checking localStorage plants:', localError)
        }

        // Sort by harvest date (soonest first) and limit to 5
        allHarvests.sort((a, b) => a.daysUntil - b.daysUntil)
        setHarvests(allHarvests.slice(0, 5))
        
        if (allHarvests.length === 0 && !hasPlants) {
          setHasPlants(false)
        }
      } catch (error) {
        console.error('Error fetching harvests:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHarvests()
  }, [user])

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
  }

  if (!hasPlants) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Harvests</h2>
          <Link 
            href="/my-garden"
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View My Garden
          </Link>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Start planting to see your upcoming harvests</p>
        </div>
      </div>
    )
  }

  if (harvests.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Harvests</h2>
          <Link 
            href="/my-garden"
            className="text-green-600 hover:text-green-700 text-sm font-medium"
          >
            View My Garden
          </Link>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No upcoming harvests scheduled</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Upcoming Harvests</h2>
        <Link 
          href="/my-garden"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          View My Garden
        </Link>
      </div>
      <div className="space-y-3">
        {harvests.map(harvest => {
          const isReady = harvest.daysUntil <= 0
          const isSoon = harvest.daysUntil <= 7 && harvest.daysUntil > 0
          
          return (
            <div 
              key={harvest.id}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                isReady 
                  ? 'bg-green-100 border border-green-300' 
                  : isSoon 
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-gray-50'
              }`}
            >
              <div className="text-xl">🌾</div>
              <div className="flex-1">
                <p className={`font-medium ${isReady ? 'text-green-800' : 'text-gray-700'}`}>
                  {harvest.plantName}
                </p>
                <p className={`text-sm ${
                  isReady 
                    ? 'text-green-700 font-medium' 
                    : isSoon 
                    ? 'text-yellow-700'
                    : 'text-gray-500'
                }`}>
                  {isReady 
                    ? 'Ready to harvest!' 
                    : isSoon
                    ? `Ready in ${harvest.daysUntil} day${harvest.daysUntil !== 1 ? 's' : ''}`
                    : `Ready in ${harvest.daysUntil} day${harvest.daysUntil !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
