const API_KEY = 'd1f2abacb7ae411699450237251902'
const BASE_URL = 'https://api.weatherapi.com/v1'

export async function getWeatherData(city: string = 'Hobart') {
  try {
    // Get current weather and 3-day forecast
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=3&aqi=no`
    )
    const data = await response.json()

    return {
      rainfall: data.current.precip_mm,
      temperature: data.current.temp_c,
      humidity: data.current.humidity,
      forecast: data.forecast.forecastday.map((day: any) => ({
        date: new Date(day.date),
        rainfall: day.day.totalprecip_mm,
        temperature: day.day.avgtemp_c
      }))
    }
  } catch (error) {
    console.error('Weather API Error:', error)
    return null
  }
} 