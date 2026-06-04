'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { isCompleteUserLocation } from '@/lib/locationService'
import PlacePicker from '@/app/components/PlacePicker'

export default function SetupLocation() {
  const { userLocation, updateLocation } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isCompleteUserLocation(userLocation)) {
      router.push('/dashboard')
    }
  }, [userLocation, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Set your garden location</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Search for your suburb or town (e.g. Blackmans Bay). Coastal and climate tags
            are applied automatically.
          </p>
          <PlacePicker
            submitLabel="Save location"
            onSelect={async (location) => {
              await updateLocation(location)
              router.push('/dashboard')
            }}
          />
        </div>
      </div>
    </div>
  )
}
