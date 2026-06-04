'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { getAllSuburbs, lookupSuburbByName, detectLocationOnce, LocationError } from '@/lib/locationService'
import toast from 'react-hot-toast'

export default function LocationSelect() {
  const router = useRouter()
  const { user, updateLocation } = useAuth()
  const [selectedSuburb, setSelectedSuburb] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDetecting, setIsDetecting] = useState(false)

  const suburbs = getAllSuburbs()

  async function handleDetectLocation() {
    setIsDetecting(true)
    setError('')
    try {
      const location = await detectLocationOnce()
      await updateLocation(location)
      toast.success(`Location set to ${location.city}, ${location.state}`)
      router.push('/dashboard')
    } catch (error) {
      if (error instanceof LocationError) {
        setError(`Could not detect location: ${error.message}. Please select manually below.`)
      } else {
        setError('Failed to detect location. Please select manually below.')
      }
    } finally {
      setIsDetecting(false)
    }
  }

  async function handleSelectSuburb(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSuburb) {
      setError('Please select a suburb')
      return
    }

    setLoading(true)
    setError('')

    try {
      const location = lookupSuburbByName(selectedSuburb)
      await updateLocation(location)
      toast.success(`Location set to ${location.city}, ${location.state}`)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error saving location:', err)
      setError(err.message || 'Failed to save location. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Where Are You Gardening?
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          We'll use your location to give you gardening advice for your climate zone
        </p>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Auto-detect button */}
          <button
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 mb-6 font-semibold"
          >
            {isDetecting ? 'Detecting Location...' : '📍 Use My Location'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Manual selection */}
          <form onSubmit={handleSelectSuburb} className="space-y-4">
            <div>
              <label htmlFor="suburb" className="block text-sm font-medium text-gray-700">
                Select Your Suburb
              </label>
              <select
                id="suburb"
                value={selectedSuburb}
                onChange={(e) => {
                  setSelectedSuburb(e.target.value)
                  setError('')
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                required
              >
                <option value="">-- Select a suburb --</option>
                {suburbs.map((s) => (
                  <option key={`${s.state}-${s.name}`} value={s.name}>
                    {s.name}, {s.state} (Zone {s.zone})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedSuburb}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting Location...' : 'Set Location'}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          You can change your location anytime from settings
        </p>
      </div>
    </div>
  )
}
