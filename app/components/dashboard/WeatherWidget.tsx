'use client'
import { useState, useEffect } from 'react'
import { UserLocation } from '@/app/types/user'

interface WeatherWidgetProps {
  location: UserLocation | null
}

interface WeatherData {
  current: {
    temp: number
    feels_like: number
    humidity: number
    wind_speed: number
    weather: [{
      main: string
      description: string
      icon: string
    }]
  }
  daily: Array<{
    dt: number
    temp: {
      day: number
      min: number
      max: number
    }
    weather: [{
      main: string
      description: string
      icon: string
    }]
  }>
}

// Weather Icon Component
function WeatherIcon({ condition, className = "w-12 h-12" }: { condition: string, className?: string }) {
  const iconMap: { [key: string]: JSX.Element } = {
    'Clear': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'Clouds': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    'Rain': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 19v-2m4 2v-4m4 4v-2" />
      </svg>
    ),
    'Thunderstorm': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V7L7 17h4v3l6-10h-4z" />
      </svg>
    ),
    'Snow': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    'Mist': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l-4-4m0 0l4-4m-4 4h16" opacity="0.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 16l4-4m0 0l-4-4m4 4H4" opacity="0.5" />
      </svg>
    ),
  }

  return iconMap[condition] || iconMap['Clear']
}

export default function WeatherWidget({ location }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null
    let safetyTimeout: NodeJS.Timeout | null = null
    
    const fetchWeather = async () => {
      // Safety timeout - always set loading to false after 12 seconds
      safetyTimeout = setTimeout(() => {
        if (isMounted) {
          setLoading(false)
          setError('Request timed out. Please refresh the page.')
        }
      }, 12000)
      
      try {
        if (!location?.city || !location?.state) {
          if (safetyTimeout) clearTimeout(safetyTimeout)
          if (isMounted) {
            setLoading(false)
          }
          return
        }
        
        // Check cache first (5 minute cache)
        const cacheKey = `weather_${location.city}_${location.state}`
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached)
            const now = Date.now()
            const cacheAge = now - timestamp
            const cacheMaxAge = 5 * 60 * 1000 // 5 minutes
            
            if (cacheAge < cacheMaxAge && data) {
              if (safetyTimeout) clearTimeout(safetyTimeout)
              if (isMounted) {
                setWeather(data)
                setLoading(false)
              }
              return
            }
          } catch (e) {
            // Invalid cache, continue to fetch
          }
        }
        
        // Set a timeout to abort the request
        timeoutId = setTimeout(() => {
          controller.abort()
        }, 8000) // 8 second timeout
        
        const response = await fetch(
          `/api/weather?city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(location.state)}`,
          { 
            signal: controller.signal,
            cache: 'no-store'
          }
        )
        
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        
        if (!response.ok) {
          let apiError = `Weather request failed (${response.status})`
          try {
            const maybeJson = await response.json()
            if (maybeJson?.error) apiError = maybeJson.error
          } catch {
            // ignore parse errors
          }
          throw new Error(apiError)
        }
        
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        
        // Cache the data
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            data,
            timestamp: Date.now()
          }))
        } catch (e) {
          // Ignore cache errors
        }
        
        if (safetyTimeout) {
          clearTimeout(safetyTimeout)
          safetyTimeout = null
        }
        
        if (isMounted) {
          setWeather(data)
        }
      } catch (err) {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        if (safetyTimeout) {
          clearTimeout(safetyTimeout)
        }
        
        if (isMounted) {
          if (err instanceof Error && err.name === 'AbortError') {
            setError('Request timed out. Please try again.')
          } else {
            const message = err instanceof Error ? err.message : 'Failed to load weather data'
            setError(message)
          }
          console.error('Weather fetch error:', err)
        }
      } finally {
        if (safetyTimeout) {
          clearTimeout(safetyTimeout)
        }
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchWeather()
    
    return () => {
      isMounted = false
      controller.abort()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (safetyTimeout) {
        clearTimeout(safetyTimeout)
      }
    }
  }, [location])

  if (!location) {
    return (
      <div className="text-gray-700 text-base p-4">Please set your location to see weather information</div>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-48 bg-gray-100 rounded-2xl"></div>
        <div className="h-32 bg-gray-100 rounded-2xl"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-700 p-4 bg-red-50 rounded-2xl border border-red-200 shadow-sm flex items-center justify-between">
        <span className="text-base">{error}</span>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!weather?.current) return null

  const currentCondition = weather.current.weather[0].main

  return (
    <div className="space-y-6">
      {/* Hero Section - Temperature + Condition */}
      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Left: Primary Weather Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="text-blue-600">
              <WeatherIcon condition={currentCondition} className="w-16 h-16" />
            </div>
            <div>
              <div className="text-6xl font-light text-gray-900 leading-none mb-1">
                {Math.round(weather.current.temp)}°
              </div>
              <p className="text-base font-medium text-gray-700 capitalize">
                {weather.current.weather[0].description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Location + Meta */}
        <div className="text-right space-y-2">
          <div>
            <p className="text-base font-medium text-gray-900 mb-1">
              {location.city}, {location.state}
            </p>
            <p className="text-sm text-gray-600">
              Feels like {Math.round(weather.current.feels_like)}°
            </p>
          </div>
        </div>
      </div>

      {/* Compact Metric Tiles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Humidity</span>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-2xl font-semibold text-gray-900">{weather.current.humidity}%</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Wind</span>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-2xl font-semibold text-gray-900">
            {Math.round(weather.current.wind_speed * 3.6)} km/h
          </p>
        </div>
      </div>

      {/* Forecast List */}
      {weather.daily && weather.daily.length > 1 && (
        <div>
          {(() => {
            const forecastDays = weather.daily.slice(1, 4)
            const dayCount = forecastDays.length
            return (
              <>
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  {dayCount}-Day Forecast
                </h3>
                <div className="space-y-1.5">
                  {forecastDays.map((day) => {
                    const dayCondition = day.weather[0].main
                    return (
                      <button
                        key={day.dt}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 text-left"
                        style={{ backgroundColor: 'rgb(247, 247, 247)' }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-gray-400">
                            <WeatherIcon condition={dayCondition} className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}
                            </p>
                            <p className="text-xs text-gray-600 capitalize">
                              {day.weather[0].description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 bg-gray-100 text-gray-900 rounded-full text-xs font-medium">
                            {Math.round(day.temp.max)}°
                          </span>
                          <span className="px-2.5 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">
                            {Math.round(day.temp.min)}°
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Rain Alert */}
      {currentCondition === 'Rain' && (
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-xl shadow-sm">
          <p className="text-sm font-medium text-blue-900">
            Rain expected—skip watering your garden today
          </p>
        </div>
      )}
    </div>
  )
}
