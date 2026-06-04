/**
 * Weather forecast fetch + cache (WeatherAPI.com via /api/weather proxy).
 * Location: prefer placeId → registry lat/lon; fallback city+state for legacy profiles.
 */

import { findPlaceById } from '@/lib/places'
import type { UserLocation } from '@/lib/types/location'

export interface WeatherForecastDay {
  date: string
  day: {
    maxtemp_c: number
    mintemp_c: number
    maxwind_kph?: number
    condition: { code: number; text: string }
  }
  alerts?: { headline: string; desc: string }[]
}

export interface WeatherForecastData {
  current: {
    temp_c: number
    feelslike_c?: number
    humidity?: number
    wind_kph?: number
    condition: { code: number; text: string }
  }
  forecast: {
    forecastday: WeatherForecastDay[]
  }
}

/** Resolved coordinates for WeatherAPI `q=lat,lon`. */
export interface WeatherQuery {
  lat: number
  lon: number
  placeId?: string
  /** Display label (suburb name) for UI only. */
  label?: string
}

export type WeatherLocationInput = UserLocation | WeatherQuery

const CACHE_PREFIX = 'weather_forecast_'
const CACHE_TTL_MS = 30 * 60 * 1000

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isWeatherForecastData(value: unknown): value is WeatherForecastData {
  if (!value || typeof value !== 'object') return false

  const payload = value as WeatherForecastData
  const current = payload.current
  const forecastDays = payload.forecast?.forecastday

  if (!current || typeof current !== 'object') return false
  if (!isFiniteNumber(current.temp_c)) return false
  if (!current.condition || typeof current.condition !== 'object') return false
  if (!isFiniteNumber(current.condition.code)) return false
  if (typeof current.condition.text !== 'string') return false

  if (!Array.isArray(forecastDays)) return false
  return forecastDays.every(day => {
    if (!day || typeof day !== 'object') return false
    if (typeof day.date !== 'string') return false
    if (!day.day || typeof day.day !== 'object') return false
    if (!isFiniteNumber(day.day.maxtemp_c) || !isFiniteNumber(day.day.mintemp_c)) return false
    if (!day.day.condition || typeof day.day.condition !== 'object') return false
    if (!isFiniteNumber(day.day.condition.code)) return false
    return typeof day.day.condition.text === 'string'
  })
}

function roundCoord(n: number): string {
  return n.toFixed(3)
}

/** Canonical cache key: placeId when set, else rounded lat/lon. */
export function weatherCacheKey(query: WeatherQuery): string {
  if (query.placeId) {
    return `${CACHE_PREFIX}place_${query.placeId}`
  }
  return `${CACHE_PREFIX}${roundCoord(query.lat)}_${roundCoord(query.lon)}`
}

/** @deprecated Use weatherCacheKey(WeatherQuery). Kept for legacy cache reads. */
export function weatherCacheKeyCityState(city: string, state: string): string {
  return `${CACHE_PREFIX}city_${city.trim().toLowerCase()}_${state.trim().toUpperCase()}`
}

export function resolveWeatherQuery(
  input: WeatherLocationInput | null | undefined
): WeatherQuery | null {
  if (!input) return null

  if ('lat' in input && 'lon' in input && Number.isFinite(input.lat) && Number.isFinite(input.lon)) {
    const q = input as WeatherQuery
    return {
      lat: q.lat,
      lon: q.lon,
      placeId: q.placeId,
      label: q.label,
    }
  }

  const loc = input as UserLocation

  if (loc.placeId) {
    const place = findPlaceById(loc.placeId)
    if (place) {
      return {
        lat: place.lat,
        lon: place.lon,
        placeId: place.id,
        label: `${place.name}, ${place.state}`,
      }
    }
  }

  if (Number.isFinite(loc.lat) && Number.isFinite(loc.lon)) {
    return {
      lat: loc.lat,
      lon: loc.lon,
      placeId: loc.placeId,
      label: loc.city && loc.state ? `${loc.city}, ${loc.state}` : undefined,
    }
  }

  return null
}

export function weatherQueryFromUserLocation(
  location: UserLocation | null | undefined
): WeatherQuery | null {
  return resolveWeatherQuery(location)
}

export function readWeatherCache(query: WeatherQuery): WeatherForecastData | null {
  if (typeof window === 'undefined') return null
  const key = weatherCacheKey(query)
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { data, timestamp } = JSON.parse(raw) as {
      data: unknown
      timestamp: number
    }

    if (!isFiniteNumber(timestamp) || Date.now() - timestamp >= CACHE_TTL_MS) {
      localStorage.removeItem(key)
      return null
    }

    if (isWeatherForecastData(data)) {
      return data
    }

    localStorage.removeItem(key)
  } catch {
    /* stale or corrupt cache */
    localStorage.removeItem(key)
  }
  return null
}

export function writeWeatherCache(query: WeatherQuery, data: WeatherForecastData): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(
      weatherCacheKey(query),
      JSON.stringify({ data, timestamp: Date.now() })
    )
  } catch {
    /* quota or private mode */
  }
}

function buildWeatherApiLocationQuery(
  query: WeatherQuery | null,
  cityState: { city: string; state: string } | null
): string {
  if (query) return `${query.lat},${query.lon}`
  if (cityState) return `${cityState.city}, ${cityState.state}, Australia`
  throw new Error('Location coordinates or city and state are required for weather')
}

async function fetchWeatherFromWeatherApiDirect(
  locationQuery: string,
  signal?: AbortSignal
): Promise<WeatherForecastData> {
  const apiKey =
    process.env.NEXT_PUBLIC_WEATHER_API_KEY ??
    process.env.NEXT_PUBLIC_WEATHERAPI_KEY
  if (!apiKey) {
    throw new Error(
      'Weather is not configured for this build. Add NEXT_PUBLIC_WEATHER_API_KEY to .env.local and rebuild.'
    )
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(locationQuery)}&days=4&aqi=no`
  const res = await fetch(url, { signal, cache: 'no-store' })

  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const err = body as { error?: { message?: string } } | null
    throw new Error(err?.error?.message ?? `Weather request failed (${res.status})`)
  }

  if (!isWeatherForecastData(body)) {
    throw new Error('Weather response was incomplete. Please try again shortly.')
  }

  return body
}

function buildFetchParams(
  query: WeatherQuery | null,
  cityState?: { city: string; state: string }
): URLSearchParams {
  const params = new URLSearchParams()
  if (query) {
    params.set('lat', String(query.lat))
    params.set('lon', String(query.lon))
    if (query.placeId) params.set('placeId', query.placeId)
    return params
  }
  if (cityState) {
    params.set('city', cityState.city)
    params.set('state', cityState.state)
    return params
  }
  return params
}

export async function fetchWeatherForecast(
  input: WeatherLocationInput,
  signal?: AbortSignal
): Promise<WeatherForecastData> {
  const query = resolveWeatherQuery(input)

  let cityState: { city: string; state: string } | null = null
  if (
    !query &&
    'city' in input &&
    (input as UserLocation).city &&
    (input as UserLocation).state
  ) {
    const loc = input as UserLocation
    cityState = { city: loc.city, state: loc.state }
  }

  if (!query && !cityState) {
    throw new Error('Location coordinates or city and state are required for weather')
  }

  const locationQuery = buildWeatherApiLocationQuery(query, cityState)

  // Static export / Capacitor: `/api/weather` is a stub — call WeatherAPI from the client.
  if (
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_WEATHER_API_KEY ??
      process.env.NEXT_PUBLIC_WEATHERAPI_KEY)
  ) {
    return fetchWeatherFromWeatherApiDirect(locationQuery, signal)
  }

  const params = query
    ? buildFetchParams(query)
    : buildFetchParams(null, cityState!)

  const res = await fetch(`/api/weather?${params}`, { signal, cache: 'no-store' })

  let body: { error?: { message?: string } | string } & WeatherForecastData =
    {} as WeatherForecastData
  try {
    body = await res.json()
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const msg =
      typeof body.error === 'string'
        ? body.error
        : body.error?.message ?? `Weather request failed (${res.status})`
    throw new Error(msg)
  }

  if (body && typeof body === 'object' && 'error' in body && body.error) {
    const msg =
      typeof body.error === 'string'
        ? body.error
        : (body.error as { message?: string }).message ?? 'Weather API error'
    throw new Error(msg)
  }

  if (!isWeatherForecastData(body)) {
    throw new Error('Weather response was incomplete. Please try again shortly.')
  }

  return body
}
