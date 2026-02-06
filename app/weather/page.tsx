'use client'

import { useEffect, useState } from 'react'

interface HourlyForecast {
  time: string
  temp_c: number
  condition: string
  chance_of_rain: number
  wind_kph: number
  humidity: number
}

interface WeatherCondition {
  text: string
  icon: string
  code: number
}

interface DayForecast {
  date: string
  day: {
    maxtemp_c: number
    mintemp_c: number
    avgtemp_c: number
    totalrecip_mm: number
    condition: WeatherCondition
    daily_chance_of_rain: number
  }
  hour: HourlyForecast[]
}

interface WeatherData {
  current: {
    temp_c: number
    condition: WeatherCondition
    wind_kph: number
    precip_mm: number
    humidity: number
  }
  forecast: {
    forecastday: DayForecast[]
  }
}

interface GardeningAlert {
  type: 'warning' | 'favorable' | 'action'
  message: string
  priority: number // 1-3, with 1 being highest
  icon: string
}

interface PlantingWindow {
  start: number
  end: number
  duration: number
}

interface WeatherImpact {
  plant: string
  impact: string
  action: string
  priority: 'high' | 'medium' | 'low'
}

interface TimeSlot {
  start: number
  end: number
  conditions: {
    temp: number
    humidity: number
    wind: number
    uv: number
    rain: number
  }
  rating: 'ideal' | 'good' | 'caution' | 'avoid'
  activities: string[]
}

function getCurrentSeason(): 'Summer' | 'Autumn' | 'Winter' | 'Spring' {
  const month = new Date().getMonth()
  
  // Southern Hemisphere seasons
  if (month >= 11 || month <= 1) return 'Summer'    // December to February
  if (month >= 2 && month <= 4) return 'Autumn'     // March to May
  if (month >= 5 && month <= 7) return 'Winter'     // June to August
  return 'Spring'                                   // September to November
}

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(0)

  useEffect(() => {
    async function fetchWeather() {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=d1f2abacb7ae411699450237251902&q=Hobart&days=3&aqi=no`
        )
        const data = await response.json()
        setWeather(data)
      } catch (error) {
        console.error('Error fetching weather:', error)
      }
      setLoading(false)
    }
    fetchWeather()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex">
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!weather) return null

  const days = weather.forecast.forecastday

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800">Weather Forecast</h1>

          {/* Gardening Advisory */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Gardening Outlook</h2>
            <div className="space-y-4">
              {generateGardeningAdvice(weather.current, days).map((alert, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${
                    alert.type === 'warning' ? 'bg-amber-50 border border-amber-100' :
                    alert.type === 'favorable' ? 'bg-green-50 border border-green-100' :
                    'bg-blue-50 border border-blue-100'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl">{alert.icon}</span>
                    <p className="text-gray-700">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Weather */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg text-gray-600">Current Conditions</h2>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-4xl font-light text-gray-800">
                    {weather.current.temp_c}°C
                  </span>
                  <div className="text-gray-500">
                    {weather.current.condition.text}
                  </div>
                </div>
              </div>
              <img 
                src={weather.current.condition.icon} 
                alt={weather.current.condition.text}
                className="w-16 h-16"
              />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-6 border-t pt-6">
              <div>
                <div className="text-sm text-gray-500">Humidity</div>
                <div className="mt-1 text-xl font-medium text-gray-800">
                  {weather.current.humidity}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Wind</div>
                <div className="mt-1 text-xl font-medium text-gray-800">
                  {weather.current.wind_kph} km/h
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Rain</div>
                <div className="mt-1 text-xl font-medium text-gray-800">
                  {weather.current.precip_mm} mm
                </div>
              </div>
            </div>
          </div>

          {/* Day Selection */}
          <div className="grid grid-cols-3 gap-4">
            {days.map((day, index) => (
              <button
                key={day.date}
                onClick={() => setSelectedDay(index)}
                className={`p-4 rounded-xl transition-all ${
                  selectedDay === index
                    ? 'bg-blue-50 border-2 border-blue-200'
                    : 'bg-white border border-gray-100 hover:border-blue-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <img 
                    src={day.day.condition.icon} 
                    alt={day.day.condition.text}
                    className="w-12 h-12"
                  />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-light">{day.day.maxtemp_c}°</span>
                  <span className="text-gray-500">{day.day.mintemp_c}°</span>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {day.day.condition.text}
                </div>
              </button>
            ))}
          </div>

          {/* Hourly Forecast */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg text-gray-600 mb-4">Hourly Forecast</h2>
            <div className="overflow-x-auto">
              <div className="inline-flex gap-4 pb-4">
                {days[selectedDay].hour.map((hour) => {
                  const hourTime = new Date(hour.time)
                  const isCurrentHour = new Date().getHours() === hourTime.getHours() &&
                    new Date().getDate() === hourTime.getDate()
                  
                  return (
                    <div 
                      key={hour.time} 
                      className={`min-w-[100px] p-3 rounded-lg ${
                        isCurrentHour ? 'bg-blue-50 border border-blue-100' : ''
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-800">
                        {hourTime.getHours()}:00
                      </div>
                      <div className="mt-2 text-2xl font-light">
                        {hour.temp_c}°
                      </div>
                      <div className="mt-2 flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                          </svg>
                          <span className="text-sm text-gray-600">{hour.chance_of_rain}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-600">{hour.wind_kph} km/h</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function findPlantingWindows(day: DayForecast): PlantingWindow[] {
  const goodHours = day.hour.filter(hour => {
    const hourNum = new Date(hour.time).getHours()
    return hour.chance_of_rain < 30 && // Low chance of rain
           hour.temp_c >= 10 && hour.temp_c <= 25 && // Good temperature range
           hourNum >= 6 && hourNum <= 18 // Daylight hours
  })

  if (goodHours.length === 0) {
    return []
  }

  // Find continuous blocks of good weather
  const blocks: PlantingWindow[] = []
  let currentBlock = [goodHours[0]]

  for (let i = 1; i < goodHours.length; i++) {
    const prevHour = new Date(goodHours[i-1].time).getHours()
    const currHour = new Date(goodHours[i].time).getHours()
    
    if (currHour - prevHour === 1) {
      currentBlock.push(goodHours[i])
    } else {
      if (currentBlock.length >= 3) { // At least 3 hours of good weather
        blocks.push({
          start: new Date(currentBlock[0].time).getHours(),
          end: new Date(currentBlock[currentBlock.length-1].time).getHours(),
          duration: currentBlock.length
        })
      }
      currentBlock = [goodHours[i]]
    }
  }

  if (currentBlock.length >= 3) {
    blocks.push({
      start: new Date(currentBlock[0].time).getHours(),
      end: new Date(currentBlock[currentBlock.length-1].time).getHours(),
      duration: currentBlock.length
    })
  }

  return blocks
}

function generateGardeningAdvice(
  currentWeather: WeatherData['current'],
  forecast: DayForecast[],
  season: 'Summer' | 'Autumn' | 'Winter' | 'Spring' = getCurrentSeason()
): GardeningAlert[] {
  const alerts: GardeningAlert[] = []
  const today = forecast[0]

  // Generate main daily summary
  const isHotDay = today.day.maxtemp_c >= 28
  const isWindy = today.hour.some(h => h.wind_kph > 25)
  const isWet = today.day.daily_chance_of_rain > 60
  const isMildDay = today.day.maxtemp_c >= 15 && today.day.maxtemp_c <= 25

  // Find the best window if conditions are mixed
  const bestWindow = today.hour.reduce((best, hour) => {
    const hourNum = new Date(hour.time).getHours()
    if (hourNum >= 6 && hourNum <= 18 && // Daylight hours
        hour.wind_kph < 20 && 
        hour.chance_of_rain < 30 && 
        hour.temp_c >= 15 && 
        hour.temp_c <= 25) {
      return best ? best : `${hourNum}:00`
    }
    return best
  }, '')

  // Generate the main daily message
  if (isMildDay && !isWindy && !isWet) {
    alerts.push({
      type: 'favorable',
      priority: 1,
      message: "Perfect gardening day! All activities are suitable - planting, pruning, watering, and general maintenance. Take advantage of these ideal conditions.",
      icon: '🌟'
    })
  } else if (isHotDay) {
    alerts.push({
      type: 'warning',
      priority: 1,
      message: `Hot day ahead. Best to avoid gardening between 12:00-14:00. Water early morning, and consider providing shade for sensitive plants.${
        bestWindow ? ` Best gardening window is around ${bestWindow}.` : ''
      }`,
      icon: '☀️'
    })
  } else if (isWindy && isWet) {
    alerts.push({
      type: 'warning',
      priority: 1,
      message: `Windy and wet conditions today. ${
        bestWindow 
          ? `There's a calmer window around ${bestWindow} suitable for light maintenance.` 
          : 'Better to focus on indoor gardening tasks.'
      } Avoid planting or transplanting.`,
      icon: '🌧️'
    })
  }

  // Add critical seasonal advice if needed
  if (today.day.mintemp_c <= 2) {
    alerts.push({
      type: 'warning',
      priority: 2,
      message: 'Frost likely tonight - protect sensitive plants.',
      icon: '❄️'
    })
  }

  return alerts
}

function analyzeWeatherImpacts(
  weather: WeatherData['current'],
  forecast: DayForecast[],
  season: string
): WeatherImpact[] {
  const impacts: WeatherImpact[] = []
  const today = forecast[0]

  // Example impacts based on conditions
  if (today.day.maxtemp_c > 28) {
    impacts.push({
      plant: 'Leafy Greens',
      impact: 'Risk of bolting due to heat',
      action: 'Provide afternoon shade and maintain consistent moisture',
      priority: 'high'
    })
  }

  if (weather.humidity > 85) {
    impacts.push({
      plant: 'Tomatoes',
      impact: 'High humidity increases disease risk',
      action: 'Improve air circulation, monitor for leaf spots',
      priority: 'high'
    })
  }

  // Add more plant-specific impacts based on season and conditions
  return impacts
}

function analyzeDayTimeSlots(day: DayForecast): TimeSlot[] {
  return day.hour.reduce((slots: TimeSlot[], hour, index) => {
    const hourNum = new Date(hour.time).getHours()
    if (hourNum >= 6 && hourNum <= 20) { // Daylight hours only
      const conditions = {
        temp: hour.temp_c,
        humidity: hour.humidity,
        wind: hour.wind_kph,
        uv: 0, // Add if available in your API
        rain: hour.chance_of_rain
      }

      const rating = determineTimeSlotRating(conditions)
      const activities = suggestActivities(conditions, rating)

      slots.push({
        start: hourNum,
        end: hourNum + 1,
        conditions,
        rating,
        activities
      })
    }
    return slots
  }, [])
}

function determineTimeSlotRating(conditions: TimeSlot['conditions']): TimeSlot['rating'] {
  if (
    conditions.temp >= 15 && conditions.temp <= 25 &&
    conditions.wind < 15 &&
    conditions.rain < 20 &&
    conditions.humidity < 80
  ) return 'ideal'
  
  if (
    conditions.temp >= 10 && conditions.temp <= 28 &&
    conditions.wind < 20 &&
    conditions.rain < 40
  ) return 'good'
  
  if (
    conditions.temp < 5 || conditions.temp > 30 ||
    conditions.wind > 30 ||
    conditions.rain > 60
  ) return 'avoid'
  
  return 'caution'
}

function suggestActivities(conditions: TimeSlot['conditions'], rating: TimeSlot['rating']): string[] {
  if (rating === 'avoid') return ['Essential maintenance only']
  
  const activities = []
  
  if (rating === 'ideal') {
    if (conditions.temp >= 15 && conditions.temp <= 25) {
      activities.push('Transplanting')
      activities.push('Seeding')
    }
    if (conditions.wind < 10) activities.push('Spraying')
    if (conditions.humidity < 70) activities.push('Pruning')
  }
  
  if (rating === 'good') {
    if (conditions.rain < 30) activities.push('Weeding')
    if (conditions.temp < 25) activities.push('General maintenance')
  }
  
  if (rating === 'caution') {
    activities.push('Light maintenance')
    if (conditions.rain > 40) activities.push('Indoor tasks')
  }
  
  return activities
} 