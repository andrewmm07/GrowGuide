import type { Climate } from '@/lib/types/location'

/** Structured month guidance — climate-keyed, scannable on mobile. */
export interface MonthGuidance {
  /** One-line priority for the month (≤ ~140 chars). */
  focus: string
  /** Ordered actions; first items are highest priority. */
  tasks: string[]
  /** Watch-outs (pests, frost, heat, rain). */
  risks?: string[]
  /** What not to do this month (optional). */
  avoid?: string[]
}

export type MonthName =
  | 'January' | 'February' | 'March' | 'April' | 'May' | 'June'
  | 'July' | 'August' | 'September' | 'October' | 'November' | 'December'

export type GuidanceClimateKey = 'cold' | 'cool' | 'temperate' | 'warm' | 'tropical'

/** Climates with structured month data (canonical). */
export const STRUCTURED_GUIDANCE_CLIMATES: GuidanceClimateKey[] = [
  'cold',
  'cool',
  'temperate',
  'warm',
  'tropical',
]

export function resolveGuidanceClimate(climate: Climate | undefined): GuidanceClimateKey | null {
  if (!climate) return null
  if (climate === 'cold') return 'cold'
  if (climate === 'cool') return 'cool'
  if (climate === 'temperate') return 'temperate'
  if (climate === 'warm') return 'warm'
  if (climate === 'tropical') return 'tropical'
  return null
}
