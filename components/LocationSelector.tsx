'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'

// Reverse mapping to display full state names
const STATE_DISPLAY_NAMES: Record<string, string> = {
  'SA': 'South Australia',
  'NSW': 'New South Wales',
  'VIC': 'Victoria',
  'QLD': 'Queensland',
  'WA': 'Western Australia',
  'TAS': 'Tasmania',
  'NT': 'Northern Territory',
  'ACT': 'Australian Capital Territory'
}

interface LocationSelectorProps {
  onLocationSelect: (state: string, city: string) => Promise<void>
  submitLabel?: string
  isLoading?: boolean
  showCancelButton?: boolean
  onCancel?: () => void
}

export default function LocationSelector({ 
  onLocationSelect, 
  submitLabel = "Save Location",
  isLoading = false,
  showCancelButton = false,
  onCancel
}: LocationSelectorProps) {
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const { userLocation } = useAuth()

  useEffect(() => {
    if (userLocation) {
      console.log('Setting form values from userLocation:', userLocation)
      setState(userLocation.state)
      setCity(userLocation.city)
    }
  }, [userLocation])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!state || !city) {
      setError('Please select both state and city')
      return
    }

    try {
      console.log('Submitting location:', { state, city })
      await onLocationSelect(state, city)
    } catch (error) {
      setError('Failed to save location. Please try again.')
      console.error('Location save error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <select
          id="state"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-white"
          required
          disabled={isLoading}
        >
          <option value="">Select a state</option>
          <option value="SA">South Australia</option>
          <option value="NSW">New South Wales</option>
          <option value="VIC">Victoria</option>
          <option value="QLD">Queensland</option>
          <option value="WA">Western Australia</option>
          <option value="TAS">Tasmania</option>
          <option value="NT">Northern Territory</option>
          <option value="ACT">ACT</option>
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 
            transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Saving...' : submitLabel}
        </button>
        
        {showCancelButton && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
} 