'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'

interface Activity {
  id: string
  type: 'planted' | 'harvested' | 'watered' | 'fertilized'
  plantName: string
  timestamp: Date
}

export default function ActivityFeed() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [hasActivity, setHasActivity] = useState(false)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const allActivities: Activity[] = []

        // First, try to get activities from database
        try {
          const { data: dbActivities } = await supabase
            .from('garden_activities')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10)

          if (dbActivities && dbActivities.length > 0) {
            dbActivities.forEach((activity: any) => {
              allActivities.push({
                id: activity.id,
                type: activity.type,
                plantName: activity.plant_name || activity.plantName || '',
                timestamp: new Date(activity.created_at || activity.timestamp)
              })
            })
          }
        } catch (dbError) {
          console.error('Error fetching database activities:', dbError)
        }

        // Also check localStorage for planted plants
        try {
          const savedGarden = localStorage.getItem('myGarden')
          if (savedGarden) {
            const localPlants = JSON.parse(savedGarden)
            // Filter out harvested plants and create activities
            const activePlants = localPlants.filter((plant: any) => !plant.isHarvested)
            
            activePlants.forEach((plant: any) => {
              if (plant.datePlanted) {
                allActivities.push({
                  id: `local-${plant.name}-${plant.datePlanted}`,
                  type: 'planted',
                  plantName: plant.name || '',
                  timestamp: new Date(plant.datePlanted)
                })
              }
            })
          }
        } catch (localError) {
          console.error('Error fetching localStorage activities:', localError)
        }

        // Sort all activities by timestamp (most recent first) and limit to 5
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        const recentActivities = allActivities.slice(0, 5)

        setHasActivity(recentActivities.length > 0)
        setActivities(recentActivities)
      } catch (error) {
        console.error('Error fetching activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user])

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
  }

  if (!hasActivity) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">NA - good time to get planting!</p>
        </div>
      </div>
    )
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  // Plant icon mapping
  const getPlantIcon = (plantName: string) => {
    const plantIcons: { [key: string]: string } = {
      'Tomatoes': '🍅', 'Tomato': '🍅',
      'Peppers': '🫑', 'Pepper': '🫑',
      'Carrots': '🥕', 'Carrot': '🥕',
      'Beans': '🫘', 'Bean': '🫘',
      'Lettuce': '🥬',
      'Cucumber': '🥒',
      'Sweet Corn': '🌽', 'Corn': '🌽',
      'Garlic': '🧄',
      'Onions': '🧅', 'Onion': '🧅',
      'Eggplant': '🍆',
      'Sweet Potato': '🍠',
      'Broccoli': '🥦',
      'Cabbage': '🥬',
      'Peas': '🥕',
      'Spinach': '🥬',
      'Zucchini': '🥒',
      'Kale': '🥬',
      'Leeks': '🧅', 'Leek': '🧅',
    }
    
    if (plantIcons[plantName]) return plantIcons[plantName]
    const lowerName = plantName.toLowerCase()
    const match = Object.entries(plantIcons).find(([key]) => 
      key.toLowerCase() === lowerName || lowerName.includes(key.toLowerCase())
    )
    return match ? match[1] : '🌱' // Fallback to generic plant icon
  }

  const getActivityIcon = (activity: Activity) => {
    if (activity.type === 'planted') {
      return getPlantIcon(activity.plantName)
    } else if (activity.type === 'harvested') {
      return '🌾'
    } else if (activity.type === 'watered') {
      return '💧'
    } else if (activity.type === 'fertilized') {
      return '🌿'
    }
    return '🌱'
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {activities.map(activity => (
          <div 
            key={activity.id}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="text-xl">
              {getActivityIcon(activity)}
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                {activity.type === 'planted' && `Planted ${activity.plantName}`}
                {activity.type === 'harvested' && `Harvested ${activity.plantName}`}
                {activity.type === 'watered' && `Watered ${activity.plantName}`}
                {activity.type === 'fertilized' && `Fertilized ${activity.plantName}`}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 