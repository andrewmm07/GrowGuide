import { RegionInfo } from '../types/climate'

export const REGION_DATA: { [key: string]: RegionInfo } = {
  // Victoria
  'Melbourne': {
    state: 'Victoria',
    region: 'Port Phillip',
    climateZone: 'warm-temperate',
    frostRisk: 'light',
    rainfall: 'moderate',
    summerTemp: 'warm',
    winterTemp: 'cool'
  },
  'Swan Hill': {
    state: 'Victoria',
    region: 'Mallee',
    climateZone: 'semi-arid',
    frostRisk: 'moderate',
    rainfall: 'low',
    summerTemp: 'very-hot',
    winterTemp: 'cool'
  },
  'Ballarat': {
    state: 'Victoria',
    region: 'Central Highlands',
    climateZone: 'cool-temperate',
    frostRisk: 'severe',
    rainfall: 'moderate',
    summerTemp: 'mild',
    winterTemp: 'cold'
  },

  // New South Wales
  'Sydney': {
    state: 'New South Wales',
    region: 'Metropolitan',
    climateZone: 'warm-temperate',
    frostRisk: 'none',
    rainfall: 'high',
    summerTemp: 'warm',
    winterTemp: 'mild'
  },
  'Dubbo': {
    state: 'New South Wales',
    region: 'Central West',
    climateZone: 'semi-arid',
    frostRisk: 'moderate',
    rainfall: 'low',
    summerTemp: 'hot',
    winterTemp: 'cool'
  },

  // Queensland
  'Brisbane': {
    state: 'Queensland',
    region: 'South East',
    climateZone: 'subtropical',
    frostRisk: 'none',
    rainfall: 'high',
    summerTemp: 'hot',
    winterTemp: 'mild'
  },
  'Cairns': {
    state: 'Queensland',
    region: 'Far North',
    climateZone: 'tropical',
    frostRisk: 'none',
    rainfall: 'high',
    summerTemp: 'hot',
    winterTemp: 'mild'
  },

  // Western Australia
  'Perth': {
    state: 'Western Australia',
    region: 'Metropolitan',
    climateZone: 'mediterranean',
    frostRisk: 'light',
    rainfall: 'moderate',
    summerTemp: 'hot',
    winterTemp: 'mild'
  },

  // South Australia
  'Adelaide': {
    state: 'South Australia',
    region: 'Metropolitan',
    climateZone: 'mediterranean',
    frostRisk: 'light',
    rainfall: 'low',
    summerTemp: 'hot',
    winterTemp: 'mild'
  },

  // Northern Territory
  'Darwin': {
    state: 'Northern Territory',
    region: 'Top End',
    climateZone: 'tropical',
    frostRisk: 'none',
    rainfall: 'high',
    summerTemp: 'very-hot',
    winterTemp: 'mild'
  },

  // Tasmania
  'Hobart': {
    state: 'Tasmania',
    region: 'South',
    climateZone: 'cool-temperate',
    frostRisk: 'moderate',
    rainfall: 'moderate',
    summerTemp: 'mild',
    winterTemp: 'cold'
  }
} 