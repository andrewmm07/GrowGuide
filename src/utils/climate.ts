type ClimateZone = 'warm' | 'cool'

// Map of states to their predominant climate zones
const STATE_CLIMATE_ZONES: { [key: string]: ClimateZone } = {
  'NSW': 'warm',
  'QLD': 'warm',
  'NT': 'warm',
  'WA': 'warm',
  'SA': 'warm',
  'VIC': 'cool',
  'TAS': 'cool',
  'ACT': 'cool'
}

// Map of cities to their specific climate zones (overrides state default)
const CITY_CLIMATE_ZONES: { [key: string]: ClimateZone } = {
  'Hobart': 'cool',
  'Melbourne': 'cool',
  'Brisbane': 'warm',
  'Darwin': 'warm',
  'Perth': 'warm',
  'Adelaide': 'warm',
  'Sydney': 'warm',
  'Canberra': 'cool',
  // Add more cities as needed
}

export function getClimateZone(state: string, city: string): ClimateZone {
  // First check if we have specific climate data for the city
  if (city && CITY_CLIMATE_ZONES[city]) {
    return CITY_CLIMATE_ZONES[city]
  }
  
  // Fall back to state-based climate zone
  if (state && STATE_CLIMATE_ZONES[state]) {
    return STATE_CLIMATE_ZONES[state]
  }
  
  // Default to warm if no match found
  return 'warm'
} 