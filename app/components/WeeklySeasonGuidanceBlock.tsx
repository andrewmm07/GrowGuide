'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { UserLocation } from '@/lib/types/location'
import { weatherQueryFromUserLocation } from '@/lib/weatherService'
import { getRollingWeatherContext, getWeatherSignal } from '@/lib/weatherSignal'
import {
  applyWeatherToWeeklyOverview,
  buildWeeklySeasonGuidance,
  type WeeklySeasonGuidance,
} from '@/lib/weeklyGuidanceService'
import {
  weatherEnrichmentFootnote,
  type WeatherClauseTone,
} from '@/lib/weeklyGuidanceWeatherTone'

interface WeeklySeasonGuidanceBlockProps {
  location: UserLocation | null
  date?: Date
  /** Tailwind wrapper classes; omit for unstyled fragment */
  className?: string
}

export interface WeeklySeasonGuidanceState {
  guidance: WeeklySeasonGuidance | null
  /** True when recent/forecast weather changed the overview beyond the base week line. */
  weatherEnriched: boolean
  /** How observed vs forecast data shaped the overview, when enriched. */
  weatherClauseTone: WeatherClauseTone | null
}

export function useWeeklySeasonGuidance(
  location: UserLocation | null,
  date?: Date
): WeeklySeasonGuidanceState {
  const fallbackDateRef = useRef<Date>(new Date())
  const effectiveDate = date ?? fallbackDateRef.current
  const stableDate = useMemo(() => {
    const d = new Date(effectiveDate)
    d.setHours(12, 0, 0, 0)
    return d
  }, [effectiveDate.getFullYear(), effectiveDate.getMonth(), effectiveDate.getDate()])

  const weatherQuery = useMemo(
    () => (location ? weatherQueryFromUserLocation(location) : null),
    [location]
  )

  const microclimateTags = useMemo(
    () => location?.microclimateTags ?? [],
    [location?.microclimateTags]
  )

  const base = useMemo(
    () => (location ? buildWeeklySeasonGuidance(location, stableDate) : null),
    [location, stableDate]
  )

  const [guidance, setGuidance] = useState<WeeklySeasonGuidance | null>(base)
  const [weatherEnriched, setWeatherEnriched] = useState(false)
  const [weatherClauseTone, setWeatherClauseTone] = useState<WeatherClauseTone | null>(null)

  useEffect(() => {
    setGuidance(base)
    setWeatherEnriched(false)
    setWeatherClauseTone(null)
    if (!base) return

    if (!weatherQuery) return

    let cancelled = false

    Promise.all([
      getWeatherSignal(weatherQuery.lat, weatherQuery.lon, base.climate, base.month, stableDate),
      getRollingWeatherContext(weatherQuery.lat, weatherQuery.lon, base.climate, stableDate),
    ])
      .then(([detail, rolling]) => {
        if (cancelled || !base) return
        const signal = detail ?? rolling?.signal ?? null
        const enriched = applyWeatherToWeeklyOverview(
          base,
          signal,
          detail ?? rolling?.signal ?? null,
          rolling,
          microclimateTags
        )
        setGuidance(enriched)
        const enrichedOverview = enriched.overview.trim() !== base.overview.trim()
        setWeatherEnriched(enrichedOverview)
        setWeatherClauseTone(enrichedOverview ? (enriched.weatherClauseTone ?? null) : null)
      })
      .catch(() => {
        /* keep static paragraph */
      })

    return () => {
      cancelled = true
    }
  }, [base, weatherQuery, stableDate, microclimateTags])

  return { guidance, weatherEnriched, weatherClauseTone }
}

export default function WeeklySeasonGuidanceBlock({
  location,
  date,
  className,
}: WeeklySeasonGuidanceBlockProps) {
  const { guidance, weatherEnriched, weatherClauseTone } = useWeeklySeasonGuidance(location, date)

  if (!guidance) {
    return null
  }

  const content = (
    <>
      <p className="text-sm font-semibold text-gray-900">
        {guidance.season} (Week {guidance.weekInSeason})
      </p>
      {guidance.overview && (
        <p className="text-sm text-gray-700 leading-relaxed mt-2">{guidance.overview}</p>
      )}
      {weatherEnriched && weatherClauseTone && (
        <p className="text-[11px] text-gray-400 italic mt-2">
          {weatherEnrichmentFootnote(weatherClauseTone)}
        </p>
      )}
    </>
  )

  if (!className) {
    return content
  }

  return <div className={className}>{content}</div>
}
