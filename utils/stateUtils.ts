export const STATE_CODES = {
  'SA': 'South Australia',
  'NSW': 'New South Wales',
  'VIC': 'Victoria',
  'QLD': 'Queensland',
  'WA': 'Western Australia',
  'TAS': 'Tasmania',
  'NT': 'Northern Territory',
  'ACT': 'Australian Capital Territory'
} as const

export function getStateCode(fullName: string): string {
  const entry = Object.entries(STATE_CODES).find(([_, name]) => name === fullName)
  return entry ? entry[0] : fullName
}

export function getStateName(code: string): string {
  return STATE_CODES[code as keyof typeof STATE_CODES] || code
} 