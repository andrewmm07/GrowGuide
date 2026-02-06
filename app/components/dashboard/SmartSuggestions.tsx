'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { supabase } from '@/app/lib/supabase'

interface Suggestion {
  id: string
  type: 'plant' | 'companion' | 'maintenance'
  title: string
  description: string
}

export default function SmartSuggestions() {
  const { user, userLocation } = useAuth()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user || !userLocation) return

      try {
        const currentMonth = new Date().toLocaleString('default', { month: 'long' })
        const currentSeason = getCurrentSeason()

        // Fetch location and season-specific suggestions
        const { data } = await supabase
          .from('planting_suggestions')
          .select('*')
          .eq('state', userLocation.state)
          .eq('season', currentSeason)
          .limit(3)

        setSuggestions(data || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [user, userLocation])

  const getCurrentSeason = () => {
    const month = new Date().getMonth()
    // Adjust seasons based on hemisphere
    if (userLocation?.state === 'NT' || userLocation?.state === 'WA') {
      // Northern regions have wet/dry seasons
      return month >= 10 || month <= 3 ? 'wet' : 'dry'
    }
    // Southern regions have traditional seasons
    if (month >= 2 && month <= 4) return 'autumn'
    if (month >= 5 && month <= 7) return 'winter'
    if (month >= 8 && month <= 10) return 'spring'
    return 'summer'
  }

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Smart Suggestions</h2>
      <div className="space-y-3">
        {suggestions.map(suggestion => (
          <div 
            key={suggestion.id}
            className="p-4 bg-green-50 rounded-lg border border-green-100"
          >
            <h3 className="font-medium text-green-800 mb-1">
              {suggestion.title}
            </h3>
            <p className="text-sm text-green-700">
              {suggestion.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
} 