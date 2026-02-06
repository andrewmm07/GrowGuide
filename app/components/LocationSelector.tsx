'use client'

import { useState } from 'react'
import { STATES, CITIES, State } from '../data/locations'

interface LocationSelectorProps {
  onLocationSelect: (state: string, city: string) => Promise<void>
  submitLabel?: string
  className?: string
  isLoading?: boolean
  showCancelButton?: boolean
  onCancel?: () => void
}

export default function LocationSelector({ 
  onLocationSelect, 
  submitLabel = "Save Location",
  className = "",
  isLoading = false,
  showCancelButton = false,
  onCancel
}: LocationSelectorProps) {
  const [state, setState] = useState<State | ''>('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLocalLoading(true)

    if (!state || !city) {
      setError('Please select both state and city')
      setLocalLoading(false)
      return
    }

    try {
      await onLocationSelect(state, city)
    } catch (error) {
      console.error('Error in LocationSelector:', error)
      setError('Failed to save location. Please try again.')
    } finally {
      setLocalLoading(false)
    }
  }

  const showLoading = isLoading || localLoading

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => {
            setState(e.target.value as State)
            setCity('')
          }}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          required
        >
          <option value="">Select a state</option>
          {STATES.map(state => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City
        </label>
        <select
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-50 disabled:text-gray-500"
          required
          disabled={!state}
        >
          <option value="">Select a city</option>
          {state === 'TAS' && (
            <>
              <option value="Hobart">Hobart</option>
              <option value="Launceston">Launceston</option>
            </>
          )}
          {state && CITIES[state]?.map(city => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={showLoading || !state || !city}
          className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
            showLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {showLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            submitLabel
          )}
        </button>
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
} 