import { ClimateZone, RegionInfo } from '../types/climate'
import { PlantInfo } from '../types/plants'
import { REGION_DATA } from '../data/regions'

export function getPlantingGuide(region: string, month: string): PlantInfo[] {
  const regionInfo = REGION_DATA[region]
  if (!regionInfo) return []

  // Adjust planting times based on climate zone
  const adjustedGuide = PLANTING_GUIDE[regionInfo.climateZone][month] || []

  // Apply regional adjustments
  return adjustedGuide.map(plant => {
    const adjustedPlant = { ...plant }

    // Adjust for frost risk
    if (regionInfo.frostRisk === 'severe' && !PLANT_DETAILS[plant.name].frostTolerant) {
      // Delay planting in frost-prone areas
      if (['May', 'June', 'July', 'August'].includes(month)) {
        return null
      }
    }

    // Adjust for rainfall
    if (regionInfo.rainfall === 'low' && PLANT_DETAILS[plant.name].watering === 'high') {
      adjustedPlant.notes = 'Requires additional watering in this region'
    }

    // Adjust for temperature
    if (regionInfo.summerTemp === 'very-hot' && month in ['December', 'January', 'February']) {
      adjustedPlant.notes = 'Provide afternoon shade in summer'
    }

    return adjustedPlant
  }).filter(Boolean) // Remove null entries
} 