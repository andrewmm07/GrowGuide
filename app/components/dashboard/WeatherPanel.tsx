'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { UserLocation } from '@/lib/types/location'
import {
  fetchWeatherForecast,
  readWeatherCache,
  writeWeatherCache,
  weatherQueryFromUserLocation,
  type WeatherForecastData,
} from '@/lib/weatherService'
import { getFrostGuidanceConfig } from '@/lib/microclimate/frostSeason'
import { resolveLocationContext } from '@/lib/microclimate/resolve'
import { computeSeasonDisplay } from '@/lib/seasonDisplay'
import {
  buildForecastGardenTips,
  pickDayIcon,
  shortWeekdayLabel,
  type ForecastDaySnapshot,
  type WeatherSeasonContext,
} from '@/lib/weatherGardeningSynthesis'

interface WeatherPanelProps {
  location: UserLocation | null
  locationLoading?: boolean
}

function WindIcon({ className = 'w-3 h-3' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.59 4.59A2 2 0 1011 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2"
      />
    </svg>
  )
}

function DayColumn({
  label,
  icon,
  minC,
  maxC,
  windKph,
}: {
  label: string
  icon: string
  minC: number
  maxC: number
  windKph: number
}) {
  return (
    <div className="flex-1 min-w-0 text-center px-0.5">
      <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wide">
        {label}
      </p>
      <p className="text-2xl leading-none my-1.5" aria-hidden>
        {icon}
      </p>
      <div className="flex flex-col items-center tabular-nums leading-none">
        <span className="text-sm font-bold text-gray-900">{Math.round(maxC)}°</span>
        <span className="text-[11px] text-gray-400 mt-0.5">{Math.round(minC)}°</span>
      </div>
      <div
        className="flex items-center justify-center gap-0.5 text-[11px] text-gray-500 mt-1.5"
        title="Max wind speed"
      >
        <WindIcon className="w-3 h-3 text-gray-400" />
        <span>{Math.round(windKph)}</span>
        <span className="text-[9px] text-gray-400">km/h</span>
      </div>
    </div>
  )
}

function toSnapshots(data: WeatherForecastData): ForecastDaySnapshot[] {
  const forecastDays = data?.forecast?.forecastday
  if (!Array.isArray(forecastDays)) return []

  return forecastDays.slice(0, 3).map(day => ({
    date: day.date,
    shortLabel: shortWeekdayLabel(day.date),
    minC: day.day.mintemp_c,
    maxC: day.day.maxtemp_c,
    maxWindKph: day.day.maxwind_kph ?? 0,
    conditionCode: day.day.condition.code,
  }))
}

export default function WeatherPanel({ location, locationLoading }: WeatherPanelProps) {
  const [data, setData] = useState<WeatherForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const loadWeather = useCallback(
    async (loc: UserLocation, signal: AbortSignal) => {
      const query = weatherQueryFromUserLocation(loc)
      if (query) {
        const cached = readWeatherCache(query)
        if (cached) {
          setData(cached)
          setErrorMessage(null)
          setLoading(false)
          return
        }
      }

      const forecast = await fetchWeatherForecast(loc, signal)
      setData(forecast)
      setErrorMessage(null)
      if (query) writeWeatherCache(query, forecast)
    },
    []
  )

  useEffect(() => {
    if (locationLoading) return

    if (!location?.city && !location?.state && !weatherQueryFromUserLocation(location)) {
      setLoading(false)
      setData(null)
      setErrorMessage(null)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    setLoading(true)
    setErrorMessage(null)

    loadWeather(location!, controller.signal)
      .catch(err => {
        if (err instanceof Error && err.name === 'AbortError') return
        setData(null)
        setErrorMessage(
          err instanceof Error ? err.message : 'Weather data unavailable'
        )
      })
      .finally(() => {
        clearTimeout(timeout)
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [location, locationLoading, loadWeather, retryCount])

  const seasonContext = useMemo((): WeatherSeasonContext | undefined => {
    const ctx = resolveLocationContext(location)
    if (!ctx) return undefined
    const display = computeSeasonDisplay(new Date(), ctx.seasonCalendar)
    return { seasonLabel: display.label, seasonCalendar: ctx.seasonCalendar }
  }, [location])

  const snapshots = useMemo(
    () => (data ? toSnapshots(data) : []),
    [data]
  )

  const frostConfig = useMemo(
    () => getFrostGuidanceConfig(resolveLocationContext(location)),
    [location]
  )

  const gardenTips = useMemo(
    () => buildForecastGardenTips(snapshots, frostConfig, seasonContext),
    [snapshots, frostConfig, seasonContext]
  )

  if (locationLoading) {
    return <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
  }

  if (!location?.city && !location?.state && !weatherQueryFromUserLocation(location)) {
    return null
  }

  if (loading) {
    return <div className="h-28 bg-gray-100 rounded-xl animate-pulse" />
  }

  if (errorMessage) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2">
        <p className="text-xs text-red-600">{errorMessage}</p>
        <button
          type="button"
          onClick={() => setRetryCount(c => c + 1)}
          className="mt-1 text-[11px] font-medium text-green-700"
        >
          Try again
        </button>
      </div>
    )
  }

  if (snapshots.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-2.5">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Your weather
        {location?.city ? (
          <span className="normal-case font-normal text-gray-400">
            {' '}
            · {location.city}
          </span>
        ) : null}
      </p>

      <div className="flex divide-x divide-gray-100">
        {snapshots.map(day => (
          <DayColumn
            key={day.date}
            label={day.shortLabel}
            icon={pickDayIcon(day.conditionCode, day.maxWindKph)}
            minC={day.minC}
            maxC={day.maxC}
            windKph={day.maxWindKph}
          />
        ))}
      </div>

      {gardenTips.length > 0 && (
        <ul className="mt-2 pt-2 border-t border-gray-100 space-y-1">
          {gardenTips.map((tip, i) => (
            <li
              key={i}
              className="text-[11px] text-gray-600 leading-snug flex gap-1.5"
            >
              <span className="text-gray-300 shrink-0">·</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
