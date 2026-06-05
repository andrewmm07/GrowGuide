export type SoilType = 'sandy' | 'loamy' | 'clay' | 'silty'
export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting'

export interface WateringSchedule {
  plantId: string
  baseWaterAmount: number // in milliliters
  frequencyDays: number
  lastWatered?: Date
  soilType: SoilType
  growthStage: GrowthStage
  containerSize?: number // in liters
  notes?: string
}

export interface WateringLog {
  id: string
  plantId: string
  date: Date
  amount: number // in milliliters
  notes?: string
}

export interface WeatherData {
  rainfall: number // in millimeters
  temperature: number // in celsius
  humidity: number
  forecast: {
    date: Date
    rainfall: number
    temperature: number
  }[]
} 