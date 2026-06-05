import { NextRequest, NextResponse } from 'next/server'

const isStaticExportBuild =
  process.env.NODE_ENV === 'production' || process.env.EXPORT_STATIC === 'true'

/**
 * Dev-only WeatherAPI proxy (server-side key). Unavailable in static export / Capacitor builds.
 */
export async function GET(request: NextRequest) {
  if (isStaticExportBuild) {
    return NextResponse.json(
      {
        error: {
          message:
            'Weather API route is unavailable in static export builds. Use the Supabase weather Edge Function.',
        },
      },
      { status: 501 }
    )
  }

  const apiKey =
    process.env.WEATHER_API_KEY ??
    process.env.NEXT_PUBLIC_WEATHER_API_KEY ??
    process.env.NEXT_PUBLIC_WEATHERAPI_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: { message: 'WEATHER_API_KEY is not configured for local dev.' } },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const city = searchParams.get('city')
  const state = searchParams.get('state')

  let locationQuery: string | null = null
  if (lat && lon) {
    const latN = Number(lat)
    const lonN = Number(lon)
    if (Number.isFinite(latN) && Number.isFinite(lonN)) {
      locationQuery = `${latN},${lonN}`
    }
  }
  if (!locationQuery && city && state) {
    locationQuery = `${city}, ${state}, Australia`
  }

  if (!locationQuery) {
    return NextResponse.json(
      { error: { message: 'lat/lon or city and state are required' } },
      { status: 400 }
    )
  }

  const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(locationQuery)}&days=4&aqi=no`

  try {
    const weatherResponse = await fetch(apiUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    const bodyText = await weatherResponse.text()
    let body: unknown = null
    try {
      body = JSON.parse(bodyText)
    } catch {
      /* non-JSON */
    }

    if (!weatherResponse.ok) {
      const err = body as { error?: { message?: string } } | null
      const message = err?.error?.message ?? `Weather API error: ${weatherResponse.statusText}`
      return NextResponse.json({ error: { message } }, { status: weatherResponse.status })
    }

    return NextResponse.json(body)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: { message: `Failed to fetch weather: ${message}` } },
      { status: 500 }
    )
  }
}
