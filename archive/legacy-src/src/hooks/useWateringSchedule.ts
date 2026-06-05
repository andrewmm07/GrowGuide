import { useState, useEffect } from 'react'
import { WateringService } from '../services/wateringService'
import { WateringSchedule, WeatherData, WateringLog } from '../types/watering'

// Create a singleton instance of WateringService
const wateringService = new WateringService()

export function useWateringSchedule(
  schedule: WateringSchedule | null,
  weather: WeatherData | null
) {
  const [logs, setLogs] = useState<WateringLog[]>([])
  const [nextWatering, setNextWatering] = useState<{
    needsWater: boolean
    recommendedAmount: number
    nextWateringDate: Date
    message: string
  } | null>(null)

  useEffect(() => {
    if (schedule && weather) {
      const calculation = wateringService.calculateNextWatering(schedule, weather, logs)
      setNextWatering(calculation)
    }
  }, [schedule, weather, logs])

  const logWatering = (amount: number) => {
    if (schedule) {
      const newLog = wateringService.logWatering(schedule, amount)
      setLogs(prev => [...prev, newLog])
    }
  }

  return {
    nextWatering,
    logs,
    logWatering
  }
} 