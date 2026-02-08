'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { CLIMATE_ZONES, getClimateZone, isValidStateCity } from '../utils/climate'
import { StateCode } from '../types/location'

export default function LocationSelect() {
  const router = useRouter()
  const { updateLocation } = useAuth()
  const [selectedState, setSelectedState] = useState<StateCode | ''>('')
  const [selectedCity, setSelectedCity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Validate the combination
      if (!isValidStateCity(selectedState, selectedCity)) {
        setError('Please select a valid state and city combination')
        setLoading(false)
        return
      }

      // Get the climate zone to verify
      const climateZone = getClimateZone(selectedState, selectedCity)
      
      console.log('Saving location:', {
        state: selectedState,
        city: selectedCity,
        climateZone
      })

      // Save to both localStorage and database using updateLocation
      await updateLocation(selectedState, selectedCity)

      router.push('/planting-calendar')
    } catch (error) {
      console.error('Error saving location:', error)
      setError(error instanceof Error ? error.message : 'Failed to save location. Please try again.')
      setLoading(false)
    }
  }

  // Get cities for selected state
  const availableCities = selectedState && selectedState in CLIMATE_ZONES
    ? Object.keys(CLIMATE_ZONES[selectedState as StateCode].cities)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Select Your Location
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* State Selection */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value as StateCode | '')
                setSelectedCity('')  // Reset city when state changes
                setError('')
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Select a state</option>
              {Object.keys(CLIMATE_ZONES).map(state => (
                <option key={state} value={state}>
                  {CLIMATE_ZONES[state as keyof typeof CLIMATE_ZONES].name}
                </option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value)
                setError('')
              }}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              required
              disabled={!selectedState}
            >
              <option value="">Select a city</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Set Location'}
          </button>
        </form>
      </div>
    </div>
  )
} 