'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { UserLocation } from '@/lib/types/location'
import { weatherQueryFromUserLocation } from '@/lib/weatherService'
import {
  getWeeklyWeatherBundle,
  readWeeklyWeatherBundleFromCache,
  type RollingWeatherContext,
} from '@/lib/weatherSignal'
import type { WeatherSignalDetail } from '@/lib/types/weatherGuidance'
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
  /** Seasonal base line before weather enrichment. */
  baseOverview: string | null
  /** True while weather clause is still loading for the current week. */
  weatherPending: boolean
  /** True when recent/forecast weather changed the overview beyond the base week line. */
  weatherEnriched: boolean
  /** How observed vs forecast data shaped the overview, when enriched. */
  weatherClauseTone: WeatherClauseTone | null
}

function enrichGuidanceFromBundle(
  base: WeeklySeasonGuidance,
  bundle: { signal: WeatherSignalDetail; rolling: RollingWeatherContext },
  tags: string[]
): WeeklySeasonGuidance {
  return applyWeatherToWeeklyOverview(
    base,
    bundle.signal,
    bundle.signal,
    bundle.rolling,
    tags
  )
}

function isWeatherEnriched(base: WeeklySeasonGuidance, enriched: WeeklySeasonGuidance): boolean {
  if (enriched.replacedBaseLine) return true
  if (enriched.weatherClause) return true
  return enriched.overview.trim() !== base.overview.trim()
}

function isNearCurrentWeek(date: Date): boolean {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const target = new Date(date)
  target.setHours(12, 0, 0, 0)
  return Math.abs(target.getTime() - today.getTime()) <= 2 * 24 * 60 * 60 * 1000
}

export function WeeklyOverviewText({
  guidance,
  baseOverview,
  weatherPending = false,
  className = 'text-sm text-gray-700 leading-relaxed mt-2',
}: {
  guidance: WeeklySeasonGuidance
  baseOverview?: string | null
  weatherPending?: boolean
  className?: string
}) {
  if (guidance.replacedBaseLine) {
    return <p className={className}>{guidance.overview}</p>
  }

  const base = (baseOverview ?? guidance.overview).trim()
  const clause = guidance.weatherClause?.trim()

  return (
    <p className={className}>
      {base}
      {clause ? (
        <>
          {' '}
          {clause}
        </>
      ) : weatherPending ? (
        <span
          className="inline-block ml-1 w-28 max-w-[40%] h-[0.9em] bg-gray-100 rounded animate-pulse align-baseline"
          aria-hidden
        />
      ) : null}
    </p>
  )
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

  const weatherRelevant = isNearCurrentWeek(stableDate)

  const syncEnriched = useMemo(() => {
    if (!base || !weatherQuery || !weatherRelevant) return base
    const cached = readWeeklyWeatherBundleFromCache(
      weatherQuery.lat,
      weatherQuery.lon,
      stableDate
    )
    if (!cached) return base
    return enrichGuidanceFromBundle(base, cached, microclimateTags)
  }, [base, weatherQuery, stableDate, microclimateTags, weatherRelevant])

  const [guidance, setGuidance] = useState<WeeklySeasonGuidance | null>(syncEnriched)
  const [weatherPending, setWeatherPending] = useState(() => {
    if (!base || !weatherQuery || !weatherRelevant) return false
    return !readWeeklyWeatherBundleFromCache(weatherQuery.lat, weatherQuery.lon, stableDate)
  })
  const [weatherEnriched, setWeatherEnriched] = useState(() =>
    base && syncEnriched ? isWeatherEnriched(base, syncEnriched) : false
  )
  const [weatherClauseTone, setWeatherClauseTone] = useState<WeatherClauseTone | null>(() =>
    base && syncEnriched && isWeatherEnriched(base, syncEnriched)
      ? (syncEnriched.weatherClauseTone ?? null)
      : null
  )

  useEffect(() => {
    setGuidance(syncEnriched)
    if (!base) {
      setWeatherPending(false)
      setWeatherEnriched(false)
      setWeatherClauseTone(null)
      return
    }

    const enrichedFromSync = syncEnriched ?? base
    setWeatherEnriched(isWeatherEnriched(base, enrichedFromSync))
    setWeatherClauseTone(
      isWeatherEnriched(base, enrichedFromSync)
        ? (enrichedFromSync.weatherClauseTone ?? null)
        : null
    )

    if (!weatherQuery || !weatherRelevant) {
      setWeatherPending(false)
      return
    }

    const hasCache = Boolean(
      readWeeklyWeatherBundleFromCache(weatherQuery.lat, weatherQuery.lon, stableDate)
    )
    if (hasCache) {
      setWeatherPending(false)
      return
    }

    setWeatherPending(true)
    let cancelled = false

    getWeeklyWeatherBundle(
      weatherQuery.lat,
      weatherQuery.lon,
      base.climate,
      base.month,
      stableDate
    )
      .then((bundle) => {
        if (cancelled || !base) return
        if (!bundle) {
          setWeatherPending(false)
          return
        }
        const enriched = enrichGuidanceFromBundle(base, bundle, microclimateTags)
        setGuidance(enriched)
        const enrichedOverview = isWeatherEnriched(base, enriched)
        setWeatherEnriched(enrichedOverview)
        setWeatherClauseTone(enrichedOverview ? (enriched.weatherClauseTone ?? null) : null)
        setWeatherPending(false)
      })
      .catch(() => {
        if (!cancelled) setWeatherPending(false)
      })

    return () => {
      cancelled = true
    }
  }, [base, syncEnriched, weatherQuery, stableDate, microclimateTags, weatherRelevant])

  return {
    guidance,
    baseOverview: base?.overview ?? null,
    weatherPending,
    weatherEnriched,
    weatherClauseTone,
  }
}

export default function WeeklySeasonGuidanceBlock({
  location,
  date,
  className,
}: WeeklySeasonGuidanceBlockProps) {
  const { guidance, baseOverview, weatherPending, weatherEnriched, weatherClauseTone } =
    useWeeklySeasonGuidance(location, date)

  if (!guidance) {
    return null
  }

  const content = (
    <>
      <p className="text-sm font-semibold text-gray-900">
        {guidance.season} (Week {guidance.weekInSeason})
      </p>
      {guidance.overview && (
        <WeeklyOverviewText
          guidance={guidance}
          baseOverview={baseOverview}
          weatherPending={weatherPending}
        />
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
