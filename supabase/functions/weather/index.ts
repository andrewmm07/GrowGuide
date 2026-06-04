import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const city = url.searchParams.get('city')
    const state = url.searchParams.get('state')

    if (!city || !state) {
      return new Response(
        JSON.stringify({ error: 'city and state are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('WEATHER_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Weather API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const locationQuery = `${city}, ${state}, Australia`
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(locationQuery)}&days=4&aqi=no`

    const weatherResponse = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    })

    if (!weatherResponse.ok) {
      const errorText = await weatherResponse.text()
      let errorMessage = `Weather API error: ${weatherResponse.statusText}`
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.error?.message) errorMessage = errorJson.error.message
      } catch { /* ignore */ }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: weatherResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const weatherData = await weatherResponse.json()

    // Transform to the shape WeatherWidget expects (matching original Next.js route)
    const transformed = {
      current: {
        temp: weatherData.current.temp_c,
        feels_like: weatherData.current.feelslike_c,
        humidity: weatherData.current.humidity,
        wind_speed: weatherData.current.wind_kph / 3.6,
        weather: [{
          main: getMainCondition(weatherData.current.condition.code),
          description: weatherData.current.condition.text,
          icon: getIconCode(weatherData.current.condition.code, weatherData.current.is_day),
        }],
      },
      daily: weatherData.forecast.forecastday.map((day: any) => ({
        dt: new Date(day.date).getTime() / 1000,
        temp: { day: day.day.avgtemp_c, min: day.day.mintemp_c, max: day.day.maxtemp_c },
        weather: [{
          main: getMainCondition(day.day.condition.code),
          description: day.day.condition.text,
          icon: getIconCode(day.day.condition.code, 1),
        }],
      })),
    }

    return new Response(JSON.stringify(transformed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: `Failed to fetch weather: ${message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getMainCondition(code: number): string {
  if (code >= 1000 && code <= 1003) return 'Clear'
  if (code >= 1006 && code <= 1009) return 'Clouds'
  if (code >= 1030 && code <= 1032) return 'Mist'
  if (code >= 1063 && code <= 1201) return 'Rain'
  if (code >= 1204 && code <= 1264) return 'Snow'
  if (code >= 1273 && code <= 1282) return 'Thunderstorm'
  return 'Clear'
}

function getIconCode(code: number, isDay: number): string {
  const map: Record<number, string> = {
    1000: isDay ? '01d' : '01n', 1003: isDay ? '02d' : '02n',
    1006: '04', 1009: '04', 1030: '50', 1063: isDay ? '09d' : '09n',
    1066: isDay ? '13d' : '13n', 1087: '11', 1135: '50', 1147: '50',
    1150: '09', 1153: '09', 1180: isDay ? '09d' : '09n',
    1183: isDay ? '09d' : '09n', 1186: isDay ? '09d' : '09n',
    1189: isDay ? '09d' : '09n', 1192: isDay ? '09d' : '09n',
    1195: isDay ? '09d' : '09n', 1210: isDay ? '13d' : '13n',
    1213: isDay ? '13d' : '13n', 1219: isDay ? '13d' : '13n',
    1225: isDay ? '13d' : '13n', 1240: isDay ? '09d' : '09n',
    1243: isDay ? '09d' : '09n', 1255: isDay ? '13d' : '13n',
    1273: isDay ? '11d' : '11n', 1276: isDay ? '11d' : '11n',
  }
  return map[code] ?? (isDay ? '01d' : '01n')
}
