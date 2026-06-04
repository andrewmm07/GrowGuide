export const PLANTING_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

export type PlantingMonth = (typeof PLANTING_MONTHS)[number]

export interface MonthPlantingGuide {
  sow: string[]
  plant: string[]
}
