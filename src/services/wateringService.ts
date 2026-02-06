import { WateringSchedule, WeatherData, WateringLog, SoilType, GrowthStage } from '../types/watering'

const SOIL_MOISTURE_RETENTION: Record<SoilType, number> = {
  'sandy': 0.6,
  'loamy': 1.0,
  'clay': 1.2,
  'silty': 0.9
}

const GROWTH_STAGE_FACTOR: Record<GrowthStage, number> = {
  'seedling': 0.7,
  'vegetative': 1.0,
  'flowering': 1.2,
  'fruiting': 1.3
}

export class WateringService {
  private calculateBaseNeed(schedule: WateringSchedule, weather: WeatherData): number {
    const soilFactor = SOIL_MOISTURE_RETENTION[schedule.soilType]
    const growthFactor = GROWTH_STAGE_FACTOR[schedule.growthStage]
    const temperatureFactor = Math.max(0.5, Math.min(1.5, weather.temperature / 20))
    
    let waterNeed = schedule.baseWaterAmount * soilFactor * growthFactor * temperatureFactor

    // Adjust for recent rainfall
    const recentRainfall = weather.rainfall
    if (recentRainfall > 0) {
      waterNeed = Math.max(0, waterNeed - (recentRainfall * 0.8))
    }

    return Math.round(waterNeed)
  }

  calculateNextWatering(
    schedule: WateringSchedule,
    weather: WeatherData,
    recentLogs: WateringLog[]
  ): {
    needsWater: boolean
    recommendedAmount: number
    nextWateringDate: Date
    message: string
  } {
    const today = new Date()
    
    // Get the most recent watering date from either schedule or logs
    let lastWatered: Date
    if (schedule.lastWatered) {
      lastWatered = new Date(schedule.lastWatered)
    } else if (recentLogs.length > 0) {
      lastWatered = new Date(Math.max(...recentLogs.map(log => log.date.getTime())))
    } else {
      lastWatered = new Date(0) // Never watered
    }

    const daysSinceWatering = Math.floor((today.getTime() - lastWatered.getTime()) / (1000 * 60 * 60 * 24))
    
    const waterNeed = this.calculateBaseNeed(schedule, weather)
    const forecastRain = weather.forecast
      .slice(0, 3)
      .reduce((sum, day) => sum + day.rainfall, 0)

    // Check if watering is needed
    const needsWater = daysSinceWatering >= schedule.frequencyDays && forecastRain < 10

    // Calculate next watering date
    const nextDate = new Date(lastWatered)
    nextDate.setDate(nextDate.getDate() + schedule.frequencyDays)
    if (forecastRain > 10) {
      nextDate.setDate(nextDate.getDate() + 1)
    }

    return {
      needsWater,
      recommendedAmount: waterNeed,
      nextWateringDate: nextDate,
      message: this.generateWateringMessage(needsWater, waterNeed, forecastRain, nextDate)
    }
  }

  private generateWateringMessage(
    needsWater: boolean,
    amount: number,
    forecastRain: number,
    nextDate: Date
  ): string {
    if (forecastRain > 10) {
      return `Rain expected (${Math.round(forecastRain)}mm). Check again ${nextDate.toLocaleDateString()}.`
    }
    
    if (needsWater) {
      return `Water needed: ${amount}ml. Best time: early morning or evening.`
    }
    
    return `Next watering scheduled for ${nextDate.toLocaleDateString()}`
  }

  logWatering(schedule: WateringSchedule, amount: number, notes?: string): WateringLog {
    const log: WateringLog = {
      id: crypto.randomUUID(),
      plantId: schedule.plantId,
      date: new Date(),
      amount,
      notes
    }
    
    return log
  }
} 