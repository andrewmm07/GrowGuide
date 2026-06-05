import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

interface Plant {
  id: string
  name: string
  planting_windows: {
    [key: string]: number[]
  }
  // Add other plant properties as needed
}

export function Calendar() {
  const { user } = useAuth()
  const [userZone, setUserZone] = useState<string | null>(null)
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserZoneAndPlants() {
      try {
        if (!user) throw new Error('Not authenticated')

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('zone')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        setUserZone(userData.zone)

        if (!userData.zone) {
          toast.error('Please set your location in your profile')
          return
        }

        const { data: plantsData, error: plantsError } = await supabase
          .from('plants')
          .select('*') as { data: Plant[] | null, error: any }

        if (plantsError) throw plantsError
        if (!plantsData) return

        const currentMonth = new Date().getMonth()
        const filteredPlants = plantsData.filter(plant => 
          plant.planting_windows?.[userData.zone]?.includes(currentMonth)
        )

        setPlants(filteredPlants)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load calendar data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserZoneAndPlants()
  }, [user])

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>
  }

  if (!userZone) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please set your location in your profile to see personalized planting times.</p>
        <Link 
          href="/profile"
          className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Update Profile
        </Link>
      </div>
    )
  }

  return (
    <div>
      {plants.map((plant) => (
        <div key={plant.id}>
          {/* Add your plant rendering logic here */}
          <h3>{plant.name}</h3>
          {/* Add more plant details as needed */}
        </div>
      ))}
    </div>
  )
} 