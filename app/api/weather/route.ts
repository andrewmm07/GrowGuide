import { NextResponse } from 'next/server'

const WEATHER_API_KEY = 'd1f2abacb7ae411699450237251902'
const BASE_URL = 'https://api.weatherapi.com/v1'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const state = searchParams.get('state')

  if (!city || !state) {
    return NextResponse.json(
      { error: 'City and state are required' },
      { status: 400 }
    )
  }

  try {
    // Use WeatherAPI.com with city and state
    const locationQuery = `${city}, ${state}, Australia`
    const apiUrl = `${BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(locationQuery)}&days=4&aqi=no`
    
    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
    
    let weatherResponse
    try {
      weatherResponse = await fetch(apiUrl, { 
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Weather service request timed out. Please try again.' },
          { status: 504 }
        )
      }
      console.error('Network error fetching weather:', fetchError)
      return NextResponse.json(
        { error: 'Network error: Unable to reach weather service. Please check your internet connection.' },
        { status: 503 }
      )
    }
    
    if (!weatherResponse.ok) {
      let errorMessage = `Weather API error: ${weatherResponse.statusText}`
      try {
        const errorText = await weatherResponse.text()
        const errorJson = JSON.parse(errorText)
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message
        } else if (errorText) {
          errorMessage = errorText
        }
      } catch {
        // If we can't parse the error, use the status text
      }
      console.error('Weather API error:', weatherResponse.status, errorMessage)
      return NextResponse.json(
        { error: errorMessage },
        { status: weatherResponse.status }
      )
    }

    let weatherData
    try {
      weatherData = await weatherResponse.json()
    } catch (parseError) {
      console.error('Error parsing weather response:', parseError)
      return NextResponse.json(
        { error: 'Invalid response from weather service' },
        { status: 502 }
      )
    }
    
    // Transform WeatherAPI.com response to match OpenWeatherMap format expected by WeatherWidget
    const transformedData = {
      current: {
        temp: weatherData.current.temp_c,
        feels_like: weatherData.current.feelslike_c,
        humidity: weatherData.current.humidity,
        wind_speed: weatherData.current.wind_kph / 3.6, // Convert km/h to m/s
        weather: [{
          main: getMainCondition(weatherData.current.condition.code),
          description: weatherData.current.condition.text,
          icon: getOpenWeatherIconCode(weatherData.current.condition.code, weatherData.current.is_day)
        }]
      },
      daily: weatherData.forecast.forecastday.map((day: any) => ({
        dt: new Date(day.date).getTime() / 1000, // Convert to Unix timestamp
        temp: {
          day: day.day.avgtemp_c,
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c
        },
        weather: [{
          main: getMainCondition(day.day.condition.code),
          description: day.day.condition.text,
          icon: getOpenWeatherIconCode(day.day.condition.code, 1) // Assume day time for forecast
        }]
      }))
    }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Weather API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to fetch weather data: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// Helper function to extract main condition type from WeatherAPI.com condition code
function getMainCondition(conditionCode: number): string {
  // Map WeatherAPI.com condition codes to OpenWeatherMap main condition types
  if (conditionCode >= 1000 && conditionCode <= 1003) return 'Clear'
  if (conditionCode >= 1006 && conditionCode <= 1009) return 'Clouds'
  if (conditionCode >= 1030 && conditionCode <= 1032) return 'Mist'
  if (conditionCode >= 1063 && conditionCode <= 1201) return 'Rain'
  if (conditionCode >= 1204 && conditionCode <= 1264) return 'Snow'
  if (conditionCode >= 1273 && conditionCode <= 1282) return 'Thunderstorm'
  return 'Clear'
}

// Helper function to map WeatherAPI.com condition codes to OpenWeatherMap icon codes
function getOpenWeatherIconCode(conditionCode: number, isDay: number): string {
  // WeatherAPI.com condition codes mapped to OpenWeatherMap icon codes
  // This is a simplified mapping - you may want to expand this
  const iconMap: { [key: number]: string } = {
    1000: isDay ? '01d' : '01n', // Sunny/Clear
    1003: isDay ? '02d' : '02n', // Partly cloudy
    1006: '04', // Cloudy
    1009: '04', // Overcast
    1030: '50', // Mist
    1063: isDay ? '09d' : '09n', // Patchy rain
    1066: isDay ? '13d' : '13n', // Patchy snow
    1069: '13', // Patchy sleet
    1072: '09', // Freezing drizzle
    1087: '11', // Thundery outbreaks
    1114: '13', // Blowing snow
    1117: '13', // Blizzard
    1135: '50', // Fog
    1147: '50', // Freezing fog
    1150: '09', // Patchy light drizzle
    1153: '09', // Light drizzle
    1168: '09', // Freezing drizzle
    1171: '09', // Heavy freezing drizzle
    1180: isDay ? '09d' : '09n', // Patchy light rain
    1183: isDay ? '09d' : '09n', // Light rain
    1186: isDay ? '09d' : '09n', // Moderate rain
    1189: isDay ? '09d' : '09n', // Moderate rain
    1192: isDay ? '09d' : '09n', // Heavy rain
    1195: isDay ? '09d' : '09n', // Heavy rain
    1198: '09', // Light freezing rain
    1201: '09', // Moderate/heavy freezing rain
    1204: '13', // Light sleet
    1207: '13', // Moderate/heavy sleet
    1210: isDay ? '13d' : '13n', // Patchy light snow
    1213: isDay ? '13d' : '13n', // Light snow
    1216: isDay ? '13d' : '13n', // Patchy moderate snow
    1219: isDay ? '13d' : '13n', // Moderate snow
    1222: isDay ? '13d' : '13n', // Patchy heavy snow
    1225: isDay ? '13d' : '13n', // Heavy snow
    1237: '13', // Ice pellets
    1240: isDay ? '09d' : '09n', // Light rain shower
    1243: isDay ? '09d' : '09n', // Moderate/heavy rain shower
    1246: isDay ? '09d' : '09n', // Torrential rain shower
    1249: '13', // Light sleet showers
    1252: '13', // Moderate/heavy sleet showers
    1255: isDay ? '13d' : '13n', // Light snow showers
    1258: isDay ? '13d' : '13n', // Moderate/heavy snow showers
    1261: '13', // Light showers of ice pellets
    1264: '13', // Moderate/heavy showers of ice pellets
    1273: isDay ? '11d' : '11n', // Patchy light rain with thunder
    1276: isDay ? '11d' : '11n', // Moderate/heavy rain with thunder
    1279: isDay ? '11d' : '11n', // Patchy light snow with thunder
    1282: isDay ? '11d' : '11n', // Moderate/heavy snow with thunder
  }

  return iconMap[conditionCode] || (isDay ? '01d' : '01n')
} 