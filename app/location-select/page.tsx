'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import PlacePicker from '@/app/components/PlacePicker'
import {
  detectLocationOnce,
  LocationError,
  getLocationSelectReturnToFromSearch,
} from '@/lib/locationService'
import toast from 'react-hot-toast'

export default function LocationSelect() {
  const router = useRouter()
  const { updateLocation } = useAuth()
  const [returnTo, setReturnTo] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)

  useEffect(() => {
    setReturnTo(getLocationSelectReturnToFromSearch(window.location.search))
  }, [])

  const isChangingLocation = returnTo !== null

  function afterSavePath() {
    return (
      getLocationSelectReturnToFromSearch(
        typeof window !== 'undefined' ? window.location.search : ''
      ) ?? '/dashboard'
    )
  }

  async function handleDetectLocation() {
    setIsDetecting(true)
    setError('')
    try {
      const location = await detectLocationOnce()
      await updateLocation(location)
      toast.success(`Location set to ${location.city}, ${location.state}`)
      router.push(afterSavePath())
    } catch (err) {
      if (err instanceof LocationError) {
        setError(`Could not detect location: ${err.message}`)
      } else {
        setError('Failed to detect location. Please search for your suburb below.')
      }
    } finally {
      setIsDetecting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 sm:py-12 px-4">
      <div className="max-w-lg mx-auto">
        {returnTo && (
          <div className="mb-6">
            <Link
              href={returnTo}
              className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>
        )}

        <div className="text-center mb-8">
          <span
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-green-100 shadow-sm text-2xl mb-4"
            aria-hidden
          >
            🌱
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {isChangingLocation ? 'Change your garden location' : 'Where do you garden?'}
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
            We tailor planting advice, climate zones, and seasonal reminders to your area.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">
          <div>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-sm font-semibold hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
            >
              {isDetecting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Detecting location…
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Use my current location
                </>
              )}
            </button>
            <p className="mt-2 text-xs text-center text-gray-500">
              Works best outdoors with location services enabled
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs font-medium text-gray-400 uppercase tracking-wider">
                or search
              </span>
            </div>
          </div>

          {error && (
            <div className="text-red-700 text-sm bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <PlacePicker
            submitLabel={isChangingLocation ? 'Update location' : 'Set location'}
            onSelect={async (location) => {
              await updateLocation(location)
              toast.success(`Location set to ${location.city}, ${location.state}`)
              router.push(afterSavePath())
            }}
          />
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          You can change this anytime from your profile settings
        </p>
      </div>
    </div>
  )
}
