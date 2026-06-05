/**
 * Weather forecast fetch + cache (WeatherAPI.com via Supabase Edge Function).
 * Location: prefer placeId → registry lat/lon; fallback city+state for legacy profiles.
 *
 * Dev-only: set NEXT_PUBLIC_WEATHER_API_KEY to call WeatherAPI directly (not for production APK).
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
const WEATHER_429_BACKOFF_MS = 60_000
let lastWeather429At = 0

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

function weatherEdgeFunctionUrl(params: URLSearchParams): string | null {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return null
  return `${base.replace(/\/$/, '')}/functions/v1/weather?${params}`
}

function hasClientWeatherApiKey(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_WEATHER_API_KEY ?? process.env.NEXT_PUBLIC_WEATHERAPI_KEY
  )
}

function isDevDirectWeatherEnabled(): boolean {
  if (process.env.NODE_ENV === 'production') return false
  return hasClientWeatherApiKey()
}

function isEdgeUnavailableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message.toLowerCase()
  return (
    msg.includes('weather request failed (404)') ||
    msg.includes('weather request failed (501)') ||
    msg.includes('not configured') ||
    msg.includes('edge function') ||
    msg.includes('failed to fetch')
  )
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
      'Weather is not configured. Deploy the Supabase weather function or set NEXT_PUBLIC_WEATHER_API_KEY for local dev only.'
    )
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(locationQuery)}&days=4&aqi=no`
  const res = await fetch(url, { signal, cache: 'no-store' })

  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON */
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

async function fetchWeatherFromApiRoute(
  params: URLSearchParams,
  signal?: AbortSignal
): Promise<WeatherForecastData> {
  const res = await fetch(`/api/weather?${params}`, { signal, cache: 'no-store' })

  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON */
  }

  if (!res.ok) {
    const err = body as { error?: { message?: string } | string } | null
    const msg =
      typeof err?.error === 'string'
        ? err.error
        : err?.error?.message ?? `Weather request failed (${res.status})`
    throw new Error(msg)
  }

  if (!isWeatherForecastData(body)) {
    throw new Error('Weather response was incomplete. Please try again shortly.')
  }

  return body
}

async function fetchWeatherFromEdge(
  params: URLSearchParams,
  signal?: AbortSignal
): Promise<WeatherForecastData> {
  if (Date.now() - lastWeather429At < WEATHER_429_BACKOFF_MS) {
    throw new Error('Weather is temporarily rate-limited. Please try again in a minute.')
  }

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const url = weatherEdgeFunctionUrl(params)
  if (!url || !anonKey) {
    throw new Error('Supabase URL and anon key are required for weather.')
  }

  const res = await fetch(url, {
    signal,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${anonKey}`,
      apikey: anonKey,
    },
  })

  let body: unknown = null
  try {
    body = await res.json()
  } catch {
    /* non-JSON */
  }

  if (res.status === 429) {
    lastWeather429At = Date.now()
    const err = body as { error?: { message?: string } } | null
    throw new Error(err?.error?.message ?? 'Weather rate limit exceeded. Try again shortly.')
  }

  if (!res.ok) {
    const err = body as { error?: { message?: string } | string } | null
    const msg =
      typeof err?.error === 'string'
        ? err.error
        : err?.error?.message ?? `Weather request failed (${res.status})`
    throw new Error(msg)
  }

  if (!isWeatherForecastData(body)) {
    throw new Error('Weather response was incomplete. Please try again shortly.')
  }

  return body
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

  const params = query ? buildFetchParams(query) : buildFetchParams(null, cityState!)
  const locationQuery = query
    ? `${query.lat},${query.lon}`
    : `${cityState!.city}, ${cityState!.state}, Australia`

  if (typeof window !== 'undefined' && isDevDirectWeatherEnabled()) {
    return fetchWeatherFromWeatherApiDirect(locationQuery, signal)
  }

  try {
    return await fetchWeatherFromEdge(params, signal)
  } catch (edgeErr) {
    if (typeof window === 'undefined') throw edgeErr

    if (process.env.NODE_ENV !== 'production') {
      try {
        return await fetchWeatherFromApiRoute(params, signal)
      } catch {
        /* fall through */
      }
    }

    if (
      process.env.NODE_ENV !== 'production' &&
      hasClientWeatherApiKey() &&
      isEdgeUnavailableError(edgeErr)
    ) {
      return fetchWeatherFromWeatherApiDirect(locationQuery, signal)
    }

    throw edgeErr
  }
}
