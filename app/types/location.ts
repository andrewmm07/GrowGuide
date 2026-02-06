export type StateCode = 'TAS' | 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'NT' | 'ACT';

export type ClimateZone = 
  | 'cool temperate' 
  | 'temperate' 
  | 'subtropical' 
  | 'tropical' 
  | 'mediterranean' 
  | 'arid';

export interface GardenLocation {
  state: StateCode;
  city: string;
  climateZone: ClimateZone;
}

// State mapping object
export const STATE_MAPPING = {
  // Full names
  'tasmania': 'TAS',
  'victoria': 'VIC',
  'queensland': 'QLD',
  'western australia': 'WA',
  'south australia': 'SA',
  'new south wales': 'NSW',
  'northern territory': 'NT',
  'australian capital territory': 'ACT',
  
  // Common abbreviations
  'tas': 'TAS',
  'vic': 'VIC',
  'qld': 'QLD',
  'wa': 'WA',
  'sa': 'SA',
  'nsw': 'NSW',
  'nt': 'NT',
  'act': 'ACT'
} as const; 