export type ClimateZone = 
  | 'cool-temperate'    // Tasmania, Victorian Alps
  | 'warm-temperate'    // Sydney, Melbourne, Adelaide coastal
  | 'mediterranean'     // Perth, Adelaide Hills
  | 'semi-arid'        // Swan Hill, Mildura, inland NSW
  | 'subtropical'       // Brisbane, Northern NSW
  | 'tropical'         // Far North QLD, Darwin
  | 'arid'            // Central Australia

export interface RegionInfo {
  state: string
  region: string
  climateZone: ClimateZone
  frostRisk: 'none' | 'light' | 'moderate' | 'severe'
  rainfall: 'low' | 'moderate' | 'high'
  summerTemp: 'mild' | 'warm' | 'hot' | 'very-hot'
  winterTemp: 'mild' | 'cool' | 'cold' | 'very-cold'
} 