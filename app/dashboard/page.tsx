'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import TodaysTasks from '../components/dashboard/TodaysTasks'
import UpcomingHarvests from '../components/dashboard/UpcomingHarvests'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import PestAlerts from '../components/dashboard/PestAlerts'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, userLocation } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasPlants, setHasPlants] = useState(false)
  const [checkingPlants, setCheckingPlants] = useState(true)
  const [plants, setPlants] = useState<any[]>([])
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    if (!userLocation?.state) {
      router.push('/location-select')
      return
    }

    // Fetch user name from profile
    const fetchUserName = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single()

        if (!error && data?.name) {
          setUserName(data.name)
        } else {
          // Fallback to email or "User"
          setUserName(user.email?.split('@')[0] || 'User')
        }
      } catch (error) {
        console.error('Error fetching user name:', error)
        setUserName(user.email?.split('@')[0] || 'User')
      }
    }

    fetchUserName()
    setLoading(false)
  }, [user, userLocation, router])

  useEffect(() => {
    const fetchPlants = async () => {
      if (!user) {
        setCheckingPlants(false)
        return
      }

      try {
        // Check database first
        const { data: dbPlants } = await supabase
          .from('garden_plants')
          .select('*')
          .eq('user_id', user.id)

        if (dbPlants && dbPlants.length > 0) {
          // Filter out harvested plants
          const activePlants = dbPlants.filter((plant: any) => !plant.isHarvested)
          setPlants(activePlants)
          setHasPlants(activePlants.length > 0)
          setCheckingPlants(false)
          return
        }

        // Fallback to localStorage
        const savedGarden = localStorage.getItem('myGarden')
        if (savedGarden) {
          try {
            const localPlants = JSON.parse(savedGarden)
            // Filter out harvested plants
            const activePlants = localPlants.filter((plant: any) => !plant.isHarvested)
            if (activePlants && activePlants.length > 0) {
              setPlants(activePlants)
              setHasPlants(true)
            } else {
              setPlants([])
              setHasPlants(false)
            }
          } catch (error) {
            setPlants([])
            setHasPlants(false)
          }
        } else {
          setPlants([])
          setHasPlants(false)
        }
      } catch (error) {
        console.error('Error fetching plants:', error)
        // Fallback to localStorage on error
        const savedGarden = localStorage.getItem('myGarden')
        if (savedGarden) {
          try {
            const localPlants = JSON.parse(savedGarden)
            const activePlants = localPlants.filter((plant: any) => !plant.isHarvested)
            if (activePlants && activePlants.length > 0) {
              setPlants(activePlants)
              setHasPlants(true)
            } else {
              setPlants([])
              setHasPlants(false)
            }
          } catch (err) {
            setPlants([])
            setHasPlants(false)
          }
        } else {
          setPlants([])
          setHasPlants(false)
        }
      } finally {
        setCheckingPlants(false)
      }
    }

    if (user && !loading) {
      fetchPlants()
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            {/* Loading skeleton */}
            <div className="h-48 bg-white rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-white rounded-lg"></div>
              <div className="h-64 bg-white rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            {userName ? `${userName}'s Dashboard` : 'Dashboard'}
          </h1>
        </div>

        {/* Garden Summary Section */}
        {!checkingPlants && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            {hasPlants && plants.length > 0 ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-gray-800">My Garden</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => {
                    const plant = plants[index]
                    if (plant) {
                      const plantName = plant.name || plant.plant_name || ''
                      // Plant icon mapping
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
                      const getPlantIcon = (name: string) => {
                        if (plantIcons[name]) return plantIcons[name]
                        const lowerName = name.toLowerCase()
                        const match = Object.entries(plantIcons).find(([key]) => 
                          key.toLowerCase() === lowerName || lowerName.includes(key.toLowerCase())
                        )
                        return match ? match[1] : '🌱'
                      }
                      // Format dates
                      const formatDate = (dateString: string) => {
                        try {
                          const date = new Date(dateString)
                          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        } catch {
                          return ''
                        }
                      }
                      
                      const plantedDate = plant.datePlanted ? formatDate(plant.datePlanted) : ''
                      const harvestDate = plant.estimatedHarvest ? formatDate(plant.estimatedHarvest) : ''
                      
                      return (
                        <div
                          key={plant.id || index}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow text-center"
                        >
                          <div className="flex flex-col items-center gap-1.5">
                            <span className="text-3xl">{getPlantIcon(plantName)}</span>
                            <h3 className="font-medium text-gray-800 text-sm leading-tight">{plantName}</h3>
                            <div className="space-y-0.5 mt-1">
                              {plantedDate && (
                                <p className="text-xs text-gray-600 leading-tight">
                                  Planted: {plantedDate}
                                </p>
                              )}
                              {harvestDate && (
                                <p className="text-xs text-gray-600 leading-tight">
                                  Harvest: {harvestDate}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    } else {
                      // Empty slot with question mark
                      return (
                        <div
                          key={`empty-${index}`}
                          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center opacity-60"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      )
                    }
                  })}
                </div>
                <div className="mt-4 text-center">
                  <Link
                    href="/my-garden"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    Plant more →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Start Growing</h2>
                <p className="text-gray-600 mb-6">Add plants to your garden and get personalized care instructions</p>
                <Link
                  href="/my-garden/add"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span className="text-xl">🌱</span>
                  Add Your First Plant
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <TodaysTasks />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <ActivityFeed />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <UpcomingHarvests />
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <PestAlerts location={userLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 