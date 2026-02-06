export const STATES = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT'
] as const

export const CITIES: { [key: string]: string[] } = {
  'NSW': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
  'VIC': ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'],
  'QLD': ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Townsville'],
  'WA': ['Perth', 'Fremantle', 'Mandurah', 'Bunbury'],
  'SA': ['Adelaide', 'Mount Gambier', 'Whyalla', 'Port Augusta'],
  'TAS': ['Hobart', 'Launceston', 'Devonport', 'Burnie'],
  'NT': ['Darwin', 'Alice Springs', 'Katherine', 'Palmerston'],
  'ACT': ['Canberra', 'Belconnen', 'Tuggeranong', 'Gungahlin']
}

export type State = typeof STATES[number]
export type City = string

export const isValidState = (state: string): state is State => {
  return STATES.includes(state as State)
}

export const isValidCity = (state: State, city: string): boolean => {
  return CITIES[state]?.includes(city) ?? false
} 