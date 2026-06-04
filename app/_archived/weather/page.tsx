'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import {
  fetchWeatherForecast,
  readWeatherCache,
  writeWeatherCache,
  weatherQueryFromUserLocation,
} from '@/lib/weatherService'
import { resolveLocationContext } from '@/lib/microclimate/resolve'
import { computeSeasonDisplay } from '@/lib/seasonDisplay'
import type { WeatherSeasonContext } from '@/lib/weatherGardeningSynthesis'

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

interface GardeningAlert {
  type: 'warning' | 'favorable' | 'action'
  message: string
  icon: string
}

function seasonContextFromAuth(
  userLocation: import('@/lib/types/location').UserLocation | null
): WeatherSeasonContext | undefined {
  const ctx = resolveLocationContext(userLocation)
  if (!ctx) return undefined
  const display = computeSeasonDisplay(new Date(), ctx.seasonCalendar)
  return { seasonLabel: display.label, seasonCalendar: ctx.seasonCalendar }
}

function getSeasonLabel(season?: WeatherSeasonContext): string {
  if (season?.seasonLabel) return season.seasonLabel
  const month = new Date().getMonth()
  if (month >= 11 || month <= 1) return 'Summer'
  if (month >= 2 && month <= 4) return 'Autumn'
  if (month >= 5 && month <= 7) return 'Winter'
  return 'Spring'
}

function generateGardeningAdvice(
  weather: WeatherData,
  season?: WeatherSeasonContext
): GardeningAlert[] {
  const alerts: GardeningAlert[] = []
  const today = weather.daily[0]
  const condition = weather.current.weather[0].main
  const temp = weather.current.temp
  const humidity = weather.current.humidity
  const windKph = Math.round(weather.current.wind_speed * 3.6)
  const seasonLabel = getSeasonLabel(season)

  const maxTemp = today?.temp.max ?? temp
  const minTemp = today?.temp.min ?? temp

  if (maxTemp >= 15 && maxTemp <= 25 && windKph < 20 && condition !== 'Rain') {
    alerts.push({
      type: 'favorable',
      message: 'Great gardening conditions today — ideal for planting, transplanting, and general maintenance.',
      icon: '🌟'
    })
  } else if (maxTemp >= 28) {
    alerts.push({
      type: 'warning',
      message: `Hot day ahead (${Math.round(maxTemp)}°C). Water early morning, avoid gardening 11am–3pm, and shade sensitive plants.`,
      icon: '☀️'
    })
  } else if (condition === 'Rain') {
    alerts.push({
      type: 'action',
      message: 'Rain expected — skip watering today. Good time for indoor tasks like seed preparation or potting.',
      icon: '🌧️'
    })
  } else if (windKph > 30) {
    alerts.push({
      type: 'warning',
      message: `Windy conditions (${windKph} km/h). Avoid spraying and hold off on transplanting delicate seedlings.`,
      icon: '💨'
    })
  }

  if (minTemp <= 2) {
    alerts.push({
      type: 'warning',
      message: `Frost likely tonight (${Math.round(minTemp)}°C minimum). Move frost-sensitive plants under cover.`,
      icon: '❄️'
    })
  }

  if (humidity > 85) {
    alerts.push({
      type: 'warning',
      message: 'High humidity increases fungal disease risk. Ensure good airflow around plants and check for early signs of mould.',
      icon: '💧'
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      type: 'action',
      message: `Mild ${seasonLabel.toLowerCase()} conditions. Good for general maintenance, weeding, and mulching.`,
      icon: '🌱',
    })
  }

  return alerts
}

function mapConditionCode(code: number): string {
  if (code === 1000) return 'Clear'
  if ([1003, 1006, 1009].includes(code)) return 'Clouds'
  if ([1030, 1135, 1147].includes(code)) return 'Mist'
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'Thunderstorm'
  if ([1066, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225,
       1237, 1249, 1252, 1255, 1258, 1261, 1264].includes(code)) return 'Snow'
  return 'Rain'
}

function transformWeatherApi(raw: any): WeatherData {
  const c = raw.current
  return {
    current: {
      temp: c.temp_c,
      feels_like: c.feelslike_c,
      humidity: c.humidity,
      wind_speed: c.wind_kph / 3.6,
      weather: [{
        main: mapConditionCode(c.condition.code),
        description: c.condition.text.toLowerCase(),
        icon: c.condition.icon,
      }],
    },
    daily: (raw.forecast?.forecastday ?? []).map((day: any) => ({
      dt: day.date_epoch,
      temp: {
        day: day.day.avgtemp_c,
        min: day.day.mintemp_c,
        max: day.day.maxtemp_c,
      },
      weather: [{
        main: mapConditionCode(day.day.condition.code),
        description: day.day.condition.text.toLowerCase(),
        icon: day.day.condition.icon,
      }],
    })),
  }
}

function WeatherIcon({ condition, className = 'w-10 h-10' }: { condition: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    Clear: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    Clouds: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    Rain: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 19v-2m4 2v-4m4 4v-2" />
      </svg>
    ),
    Thunderstorm: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V7L7 17h4v3l6-10h-4z" />
      </svg>
    ),
    Snow: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    Mist: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 12h14M5 16h6" />
      </svg>
    ),
  }
  return icons[condition] ?? icons.Clear
}

export default function WeatherPage() {
  const { userLocation, locationLoading } = useAuth()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const seasonContext = seasonContextFromAuth(userLocation)

  useEffect(() => {
    if (locationLoading) return
    if (!userLocation?.city && !userLocation?.state && !weatherQueryFromUserLocation(userLocation)) {
      setLoading(false)
      return
    }

    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    async function load() {
      try {
        const query = weatherQueryFromUserLocation(userLocation)
        if (query) {
          const cached = readWeatherCache(query)
          if (cached) {
            if (!cancelled) {
              setWeather(transformWeatherApi(cached))
              setLoading(false)
            }
            clearTimeout(timeout)
            return
          }
        }

        const raw = await fetchWeatherForecast(userLocation!, controller.signal)
        clearTimeout(timeout)

        const data = transformWeatherApi(raw)
        if (query) writeWeatherCache(query, raw)

        if (!cancelled) setWeather(data)
      } catch (err) {
        clearTimeout(timeout)
        if (!cancelled) {
          setError(
            err instanceof Error && err.name !== 'AbortError'
              ? err.message
              : 'Request timed out. Please refresh.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
      controller.abort()
      clearTimeout(timeout)
    }
  }, [userLocation, locationLoading])

  if (locationLoading || (loading && !userLocation)) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <p className="text-gray-500">Loading location…</p>
      </div>
    )
  }

  if (!userLocation?.city && !userLocation?.state && !weatherQueryFromUserLocation(userLocation) && !loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-600">Please set your location in settings to see weather information.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-48 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 rounded-2xl"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center justify-between">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => { setError(''); setLoading(true); setWeather(null) }}
            className="text-sm bg-red-100 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!weather?.current) return null

  const currentCondition = weather.current.weather[0].main
  const advice = generateGardeningAdvice(weather, seasonContext)
  const forecastDays = weather.daily.slice(1, 4)

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Weather</h1>
        {userLocation?.city && (
          <p className="text-sm text-gray-500 mt-0.5">
            {userLocation.city}, {userLocation.state}
          </p>
        )}
      </div>

      {/* Current conditions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-blue-600">
              <WeatherIcon condition={currentCondition} className="w-16 h-16" />
            </div>
            <div>
              <div className="text-5xl font-light text-gray-900 leading-none">
                {Math.round(weather.current.temp)}°C
              </div>
              <p className="text-sm text-gray-600 capitalize mt-1">
                {weather.current.weather[0].description}
              </p>
              <p className="text-sm text-gray-500">
                Feels like {Math.round(weather.current.feels_like)}°C
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Humidity</p>
            <p className="text-xl font-semibold text-gray-900">{weather.current.humidity}%</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 font-medium mb-1">Wind</p>
            <p className="text-xl font-semibold text-gray-900">{Math.round(weather.current.wind_speed * 3.6)} km/h</p>
          </div>
        </div>
      </div>

      {/* Gardening advice */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">Gardening Outlook</h2>
        <div className="space-y-3">
          {advice.map((alert, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl flex items-start gap-3 ${
                alert.type === 'warning'
                  ? 'bg-amber-50 border border-amber-100'
                  : alert.type === 'favorable'
                  ? 'bg-green-50 border border-green-100'
                  : 'bg-blue-50 border border-blue-100'
              }`}
            >
              <span className="text-xl flex-shrink-0">{alert.icon}</span>
              <p className="text-sm text-gray-700">{alert.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3-day forecast */}
      {forecastDays.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-3">{forecastDays.length}-Day Forecast</h2>
          <div className="space-y-2">
            {forecastDays.map((day) => {
              const dayCondition = day.weather[0].main
              return (
                <div
                  key={day.dt}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-gray-500">
                      <WeatherIcon condition={dayCondition} className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(day.dt * 1000).toLocaleDateString('en-AU', { weekday: 'long' })}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{day.weather[0].description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{Math.round(day.temp.max)}°</span>
                    <span className="text-sm text-gray-400">{Math.round(day.temp.min)}°</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
