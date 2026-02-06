'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import LocationSelector from '@/components/LocationSelector'

export default function SetupLocation() {
  const { userLocation, updateLocation } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (userLocation?.state && userLocation?.city) {
      router.push('/my-garden')
    }
  }, [userLocation, router])

  const handleLocationSelect = async (state: string, city: string) => {
    try {
      await updateLocation(state, city)
      router.push('/my-garden')
    } catch (error) {
      console.error('Error setting location:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Set Your Garden Location
          </h1>
          <p className="text-gray-600 mb-6">
            Please select your location to get personalized gardening recommendations
          </p>
          <LocationSelector 
            onLocationSelect={handleLocationSelect}
            submitLabel="Continue to Garden"
          />
        </div>
      </div>
    </div>
  )
} 