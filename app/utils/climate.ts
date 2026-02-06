import { STATE_MONTH_SUMMARIES, DEFAULT_MONTH_SUMMARIES } from '../data/state-month-summaries';
import { CITIES } from '../data/locations';

// First, let's define our types properly
type StateCode = 'TAS' | 'VIC' | 'NSW' | 'QLD' | 'WA' | 'SA' | 'NT' | 'ACT';
type ClimateZone = 'cool temperate' | 'temperate' | 'subtropical' | 'tropical' | 'mediterranean' | 'arid';

// Map of states to their predominant climate zones
const STATE_CLIMATE_ZONES: { [key: string]: ClimateZone } = {
  'NSW': 'temperate',
  'QLD': 'subtropical',
  'NT': 'tropical',
  'WA': 'mediterranean',
  'SA': 'mediterranean',
  'VIC': 'cool temperate',
  'TAS': 'cool temperate',
  'ACT': 'cool temperate'
}

// Map of cities to their specific climate zones (overrides state default)
const CITY_CLIMATE_ZONES: { [key: string]: ClimateZone } = {
  'Hobart': 'cool temperate',
  'Melbourne': 'cool temperate',
  'Brisbane': 'subtropical',
  'Darwin': 'tropical',
  'Perth': 'mediterranean',
  'Adelaide': 'mediterranean',
  'Sydney': 'temperate',
  'Canberra': 'cool temperate',
  // Add more cities as needed
}

// Define the state summaries type
interface MonthSummaries {
  [month: string]: string;
}

interface StateSummaries {
  [state: string]: MonthSummaries;
}

// Define state aliases and canonical names
const STATE_ALIASES = {
  'TAS': 'Tasmania',
  'NSW': 'New South Wales',
  'VIC': 'Victoria',
  'QLD': 'Queensland',
  'WA': 'Western Australia',
  'SA': 'South Australia',
  'NT': 'Northern Territory',
  'ACT': 'Australian Capital Territory'
} as const;

// Define valid state and city mappings with proper types
const STATE_CITIES = {
  'Tasmania': ['Hobart', 'Launceston', 'Devonport'],
  'Victoria': ['Melbourne', 'Geelong', 'Ballarat'],
  'Queensland': ['Brisbane', 'Gold Coast', 'Cairns'],
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong'],
  'Western Australia': ['Perth', 'Fremantle', 'Bunbury'],
  'South Australia': ['Adelaide', 'Port Augusta', 'Mount Gambier'],
  'Northern Territory': ['Darwin', 'Alice Springs', 'Katherine'],
  'Australian Capital Territory': ['Canberra']
} as const;

// Define the mapping structure
export const CLIMATE_ZONES: Record<StateCode, {
  name: string;
  defaultZone: ClimateZone;
  cities: Record<string, ClimateZone>;
}> = {
  'TAS': {
    name: 'Tasmania',
    defaultZone: 'cool temperate',
    cities: {
      'Hobart': 'cool temperate',
      'Launceston': 'cool temperate',
      'Devonport': 'cool temperate'
    }
  },
  'VIC': {
    name: 'Victoria',
    defaultZone: 'cool temperate',
    cities: {
      'Melbourne': 'cool temperate',
      'Geelong': 'cool temperate',
      'Ballarat': 'cool temperate'
    }
  },
  'NSW': {
    name: 'New South Wales',
    defaultZone: 'temperate',
    cities: {
      'Sydney': 'temperate',
      'Newcastle': 'temperate',
      'Wollongong': 'temperate'
    }
  },
  'QLD': {
    name: 'Queensland',
    defaultZone: 'subtropical',
    cities: {
      'Brisbane': 'subtropical',
      'Gold Coast': 'subtropical',
      'Cairns': 'tropical'
    }
  },
  'WA': {
    name: 'Western Australia',
    defaultZone: 'mediterranean',
    cities: {
      'Perth': 'mediterranean',
      'Fremantle': 'mediterranean',
      'Broome': 'tropical'
    }
  },
  'SA': {
    name: 'South Australia',
    defaultZone: 'mediterranean',
    cities: {
      'Adelaide': 'mediterranean',
      'Port Augusta': 'arid',
      'Mount Gambier': 'mediterranean'
    }
  },
  'NT': {
    name: 'Northern Territory',
    defaultZone: 'tropical',
    cities: {
      'Darwin': 'tropical',
      'Alice Springs': 'arid',
      'Katherine': 'tropical'
    }
  },
  'ACT': {
    name: 'Australian Capital Territory',
    defaultZone: 'cool temperate',
    cities: {
      'Canberra': 'cool temperate'
    }
  }
} as const;

export function normalizeState(state: string): string {
  // Convert state to standard format (e.g., 'TAS' or 'Tasmania' -> 'TAS')
  const upperState = state.toUpperCase();
  if (STATE_ALIASES[upperState as keyof typeof STATE_ALIASES]) {
    return upperState;
  }
  // Try to find the state code from the full name
  const stateCode = Object.entries(STATE_ALIASES).find(
    ([_, fullName]) => fullName.toUpperCase() === upperState
  )?.[0];
  return stateCode || upperState;
}

export function getClimateZone(state: string, city?: string): string {
  const zoneMap: Record<string, string> = {
    'Tasmania': 'cool temperate',
    'Victoria': 'mediterranean',
    'New South Wales': 'warm temperate',
    'Queensland': 'subtropical',
    'Western Australia': 'mediterranean',
    'South Australia': 'mediterranean',
    'Northern Territory': 'tropical',
    'Australian Capital Territory': 'cool temperate'
  };

  return zoneMap[state] || 'cool temperate';
}

export function getStateSummaries(state: string) {
  const normalizedState = normalizeState(state);
  const stateSummaries = STATE_MONTH_SUMMARIES[normalizedState];
  
  if (stateSummaries) {
    return stateSummaries;
  }

  return DEFAULT_MONTH_SUMMARIES;
}

export function getMonthActivities(state: string, month: string): string[] {
  const normalizedState = normalizeState(state);
  const normalizedMonth = month.toLowerCase();
  const summaries = getStateSummaries(normalizedState);

  return summaries[normalizedMonth] ? [summaries[normalizedMonth]] : [];
}

export function isValidStateCity(state: string, city: string): boolean {
  const normalizedState = normalizeState(state) as StateCode;
  const stateData = CLIMATE_ZONES[normalizedState];

  if (!stateData || !city) {
    return false;
  }

  const climateCities = Object.keys(stateData.cities);
  const allowedCities =
    CITIES[normalizedState as keyof typeof CITIES] ||
    CITIES[state as keyof typeof CITIES] ||
    [];

  return climateCities.includes(city) || allowedCities.includes(city);
}

// Export the state summaries
export { STATE_MONTH_SUMMARIES } from '../data/state-month-summaries'; 