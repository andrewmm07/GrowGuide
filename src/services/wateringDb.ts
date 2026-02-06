import { WateringLog, WateringSchedule } from '@/types/watering'

// This could be replaced with your actual database
const PLANT_WATERING_SCHEDULES: { [key: string]: WateringSchedule } = {
  'Tomatoes': {
    plantId: 'tomatoes',
    baseWaterAmount: 500,
    frequencyDays: 2,
    soilType: 'loamy',
    growthStage: 'flowering',
    containerSize: 20
  },
  'Lettuce': {
    plantId: 'lettuce',
    baseWaterAmount: 300,
    frequencyDays: 1,
    soilType: 'loamy',
    growthStage: 'vegetative',
    containerSize: 10
  },
  // Add more plants...
}

// In-memory storage (replace with database)
let wateringLogs: WateringLog[] = []

export const WateringDb = {
  getScheduleForPlant(plantName: string): WateringSchedule | null {
    return PLANT_WATERING_SCHEDULES[plantName] || null
  },

  async saveWateringLog(log: WateringLog) {
    wateringLogs.push(log)
    // Save to local storage for persistence
    localStorage.setItem('wateringLogs', JSON.stringify(wateringLogs))
    return log
  },

  async getWateringLogs(plantId: string): Promise<WateringLog[]> {
    // Load from local storage
    const storedLogs = localStorage.getItem('wateringLogs')
    if (storedLogs) {
      wateringLogs = JSON.parse(storedLogs)
    }
    return wateringLogs.filter(log => log.plantId === plantId)
  }
} 