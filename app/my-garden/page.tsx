'use client'

import { useAuth } from '@/app/context/AuthContext'
import { GardenPlannerView } from '@/app/components/GardenPlannerView'

export default function MyGardenPage() {
  const { user, userLocation, locationLoading } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">My Garden</h1>
            <p className="text-gray-600">Please sign in to access your garden.</p>
          </div>
        </div>
      </div>
    )
  }

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center">
        <p className="text-gray-500">Loading your garden...</p>
      </div>
    )
  }

  if (!userLocation?.auHardinessZone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">My Garden</h1>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                Please set your location in your profile to get started with zone-specific plant recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-6 px-3 sm:py-12 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">My Garden</h1>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-600 rounded-full shrink-0"></div>
            <p className="text-sm sm:text-base text-gray-700">
              Zone {userLocation.auHardinessZone} ({userLocation.climate})
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 overflow-x-hidden">
          <GardenPlannerView />
        </div>
      </div>
    </div>
  )
}
