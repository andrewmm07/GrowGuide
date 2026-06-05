import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')
    const city = url.searchParams.get('city')
    const state = url.searchParams.get('state')

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
      return new Response(
        JSON.stringify({ error: { message: 'lat/lon or city and state are required' } }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('WEATHER_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: { message: 'Weather API key not configured' } }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(locationQuery)}&days=4&aqi=no`

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
      const status = weatherResponse.status === 429 ? 429 : weatherResponse.status
      return new Response(
        JSON.stringify({ error: { message } }),
        { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(JSON.stringify(body), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: { message: `Failed to fetch weather: ${message}` } }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
