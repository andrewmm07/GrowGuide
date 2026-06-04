export const PLANTING_CALENDAR_MONTHS = [
  'January', 'February', 'March',
  'April', 'May', 'June',
  'July', 'August', 'September',
  'October', 'November', 'December',
] as const

export const PLANTING_CALENDAR_MONTH_ROWS = [
  PLANTING_CALENDAR_MONTHS.slice(0, 3),
  PLANTING_CALENDAR_MONTHS.slice(3, 6),
  PLANTING_CALENDAR_MONTHS.slice(6, 9),
  PLANTING_CALENDAR_MONTHS.slice(9, 12),
]

export type StateAlias = 'WA' | 'NT' | 'VIC' | 'NSW' | 'QLD' | 'SA' | 'TAS' | 'ACT'
export type StateName =
  | 'Western Australia'
  | 'Northern Territory'
  | 'Victoria'
  | 'New South Wales'
  | 'Queensland'
  | 'South Australia'
  | 'Tasmania'
  | 'Australian Capital Territory'

export const STATE_ALIASES: Record<StateAlias, StateName> = {
  WA: 'Western Australia',
  NT: 'Northern Territory',
  VIC: 'Victoria',
  NSW: 'New South Wales',
  QLD: 'Queensland',
  SA: 'South Australia',
  TAS: 'Tasmania',
  ACT: 'Australian Capital Territory',
}
