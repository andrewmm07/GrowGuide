'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import PlacePicker from '@/app/components/PlacePicker'
import {
  detectLocationOnce,
  isCompleteUserLocation,
  LocationError,
} from '@/lib/locationService'
import toast from 'react-hot-toast'

export default function SetupLocation() {
  const { userLocation, updateLocation } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [showManualPicker, setShowManualPicker] = useState(false)

  useEffect(() => {
    if (isCompleteUserLocation(userLocation)) {
      router.push('/dashboard')
    }
  }, [userLocation, router])

  async function handleDetectLocation() {
    setIsDetecting(true)
    setError('')
    try {
      const location = await detectLocationOnce()
      await updateLocation(location)
      toast.success(`Location set to ${location.city}, ${location.state}`)
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof LocationError) {
        setError(`Could not detect location: ${err.message}`)
      } else {
        setError('Failed to detect location. Please pick your suburb manually.')
      }
      setShowManualPicker(true)
    } finally {
      setIsDetecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-green-100 shadow-sm text-2xl mb-4"
            aria-hidden
          >
            🌱
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Set your garden location
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
            We tailor planting advice, climate zones, and seasonal reminders to your area.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {!showManualPicker ? (
            <div className="py-4 text-center">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
              >
                {isDetecting ? 'Detecting location…' : 'Use my location'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowManualPicker(true)
                  setError('')
                }}
                className="mt-4 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Pick manually
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  setShowManualPicker(false)
                  setError('')
                }}
                className="text-sm text-green-700 hover:text-green-800 font-medium transition-colors"
              >
                ← Use my location instead
              </button>

              {error && (
                <div className="text-red-700 text-sm bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
                  {error}
                </div>
              )}

              <PlacePicker
                submitLabel="Save location"
                onSelect={async (location) => {
                  await updateLocation(location)
                  router.push('/dashboard')
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
