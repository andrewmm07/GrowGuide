'use client'

import { useCheckLocation } from '@/middleware/checkLocation'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { getPlantingData, getStateSeason } from '@/lib/plantingData'
import { getStateName } from '@/utils/stateUtils'

export default function MonthlyCalendarPage() {
  const { hasLocation, loading } = useCheckLocation()
  const { userLocation } = useAuth()
  const router = useRouter()

  const handleChangeLocation = () => {
    router.push('/setup-location')
  }

  const getCurrentMonth = () => {
    return new Date().toLocaleString('default', { month: 'long' })
  }

  const getCalendarData = () => {
    if (!userLocation?.state) return null
    const month = getCurrentMonth()
    const data = getPlantingData(userLocation.state, month)
    
    if (!data) {
      console.error(`No planting data available for ${userLocation.state} in ${month}`)
      return null
    }
    
    return {
      ...data,
      season: getStateSeason(userLocation.state, month)
    }
  }

  const calendarData = getCalendarData()

  if (loading || !hasLocation) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-green-800">
              Monthly Planting Calendar
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="inline-flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {userLocation ? `${userLocation.city}, ${getStateName(userLocation.state)}` : 'Location not set'}
              </span>
              <button
                onClick={handleChangeLocation}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Change Location
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {calendarData ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-gray-600">{calendarData.overview}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-blue-600">SOW</h3>
                  <ul className="space-y-2">
                    {calendarData.sow.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-600">PLANT</h3>
                  <ul className="space-y-2">
                    {calendarData.plant.map((item, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No planting data available for this location</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 