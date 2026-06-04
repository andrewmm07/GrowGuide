'use client'

import { useEffect, useMemo, useState } from 'react'
import type { UserLocation } from '@/lib/types/location'
import {
  buildPlantingWeatherCallout,
  type PlantingWeatherCallout,
} from '@/lib/plantingWeatherGuidance'
import { getCurrentPlantingMonth } from '@/lib/plantingRecommendations'
import { weatherQueryFromUserLocation } from '@/lib/weatherService'
import { getRollingWeatherContext, getWeatherSignal } from '@/lib/weatherSignal'

export type { PlantingWeatherCallout }

/** Weather-aware planting callout for dashboard / weekly brief planting cards. */
export function usePlantingWeatherNote(location: UserLocation | null): PlantingWeatherCallout | null {
  const [callout, setCallout] = useState<PlantingWeatherCallout | null>(null)

  const weatherQuery = useMemo(
    () => (location ? weatherQueryFromUserLocation(location) : null),
    [location]
  )

  const climate = location?.climate ?? 'cool'
  const month = getCurrentPlantingMonth()

  useEffect(() => {
    setCallout(null)
    if (!weatherQuery) return

    let cancelled = false

    Promise.all([
      getWeatherSignal(weatherQuery.lat, weatherQuery.lon, climate, month),
      getRollingWeatherContext(weatherQuery.lat, weatherQuery.lon, climate),
    ])
      .then(([signal, rolling]) => {
        if (cancelled) return
        setCallout(buildPlantingWeatherCallout(signal, rolling))
      })
      .catch(() => {
        /* static lists only */
      })

    return () => {
      cancelled = true
    }
  }, [weatherQuery, climate, month])

  return callout
}
