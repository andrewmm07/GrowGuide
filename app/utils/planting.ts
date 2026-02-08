import { ClimateZone, RegionInfo } from '../types/climate'
import { PlantInfo } from '../types/plants'
import { REGION_DATA } from '../data/regions'
import { CLIMATE_PLANTING_GUIDES } from '../data/planting-guides'
import { PLANT_DETAILS } from '../types/plants'

export function getPlantingGuide(region: string, month: string): PlantInfo[] {
  const regionInfo = REGION_DATA[region]
  if (!regionInfo) return []

  // Adjust planting times based on climate zone
  const adjustedGuide = CLIMATE_PLANTING_GUIDES[regionInfo.climateZone]?.[month] || []

  // Apply regional adjustments
  return adjustedGuide.map(plant => {
    const adjustedPlant = { ...plant }

    // Adjust for frost risk
    if (regionInfo.frostRisk === 'severe' && PLANT_DETAILS[plant.name] && !PLANT_DETAILS[plant.name].frostTolerant) {
      // Delay planting in frost-prone areas
      if (['May', 'June', 'July', 'August'].includes(month)) {
        return null as any
      }
    }

    // Adjust for rainfall
    if (regionInfo.rainfall === 'low' && PLANT_DETAILS[plant.name] && PLANT_DETAILS[plant.name].watering === 'high') {
      adjustedPlant.notes = 'Requires additional watering in this region'
    }

    // Adjust for temperature
    if (regionInfo.summerTemp === 'very-hot' && month in ['December', 'January', 'February']) {
      adjustedPlant.notes = 'Provide afternoon shade in summer'
    }

    return adjustedPlant
  }).filter((plant): plant is PlantInfo => plant !== null) // Remove null entries
} 