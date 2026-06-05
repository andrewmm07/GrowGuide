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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-green-100 shadow-sm text-2xl mb-4"
            aria-hidden
          >
            📍
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Set your garden location
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
            Search for your suburb or town. Coastal and climate tags are applied automatically.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
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
