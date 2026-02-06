'use client'

import { useEffect, useState } from 'react'
import { useWateringSchedule } from '../hooks/useWateringSchedule'
import { WateringSchedule as WateringScheduleType, WeatherData } from '../types/watering'
import { getWeatherData } from '../services/weatherApi'
import { WateringDb } from '../services/wateringDb'
import { NotificationService } from '../services/notifications'

interface Props {
  plantName: string
  onWateringLogged: () => void
}

export function WateringSchedule({ plantName, onWateringLogged }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [schedule, setSchedule] = useState<WateringScheduleType | null>(null)
  const notificationService = NotificationService.getInstance()

  // Get weather data and plant schedule
  useEffect(() => {
    async function fetchData() {
      const weatherData = await getWeatherData()
      if (weatherData) setWeather(weatherData)

      const plantSchedule = WateringDb.getScheduleForPlant(plantName)
      if (plantSchedule) setSchedule(plantSchedule)
    }
    fetchData()
  }, [plantName])

  // Set up watering schedule
  const { nextWatering, logWatering } = useWateringSchedule(schedule, weather)

  // Set up notifications
  useEffect(() => {
    if (!schedule || !weather || !nextWatering) return

    const checkWatering = () => {
      if (nextWatering.needsWater) {
        notificationService.sendWateringReminder(plantName, nextWatering.recommendedAmount)
      }
    }

    const interval = setInterval(checkWatering, 3600000) // 1 hour
    return () => clearInterval(interval)
  }, [schedule, weather, nextWatering, plantName])

  if (!nextWatering || !schedule) return null

  const handleWateringLogged = async () => {
    if (nextWatering) {
      await WateringDb.saveWateringLog({
        id: crypto.randomUUID(),
        plantId: schedule.plantId,
        date: new Date(),
        amount: nextWatering.recommendedAmount
      })
      logWatering(nextWatering.recommendedAmount)
      onWateringLogged()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Watering Schedule</h3>
        {nextWatering.needsWater && (
          <button
            onClick={handleWateringLogged}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Log Watering
          </button>
        )}
      </div>
      
      <p className="text-gray-600">{nextWatering.message}</p>
      
      <div className="mt-4 text-sm text-gray-500">
        Next scheduled: {nextWatering.nextWateringDate.toLocaleDateString()}
      </div>
    </div>
  )
} 