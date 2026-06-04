import type { PlantDetails, PlantIssue } from '@/app/types/plants'

const PEST_KEYWORDS =
  /\b(aphid|beetle|caterpillar|worm|mite|slug|snail|fly|raccoon|flea|thrip|weevil|borer|moth)\b/i

const DISEASE_KEYWORDS =
  /\b(blight|rot|mildew|rust|wilt|spot|virus|smut|mold|fungus|scab|mosaic|damping)\b/i

const CULTURAL_KEYWORDS =
  /\b(bolting|forking|split|sunscald|premature|heads?|tunnels?|damage|yellowing|stunted)\b/i

function inferCategory(issue: PlantIssue): 'pest' | 'disease' | 'cultural' | 'other' {
  const haystack = `${issue.name} ${issue.symptoms} ${issue.solution}`
  if (PEST_KEYWORDS.test(haystack)) return 'pest'
  if (DISEASE_KEYWORDS.test(haystack)) return 'disease'
  if (CULTURAL_KEYWORDS.test(haystack)) return 'cultural'
  return 'other'
}

export interface EnrichedPlantIssue extends PlantIssue {
  category: 'pest' | 'disease' | 'cultural' | 'other'
}

export interface PlantIssuesGuide {
  issues: EnrichedPlantIssue[]
}

export function issueCategoryLabel(category: EnrichedPlantIssue['category']): string {
  switch (category) {
    case 'pest':
      return 'Pest'
    case 'disease':
      return 'Disease'
    case 'cultural':
      return 'Growing'
    default:
      return 'Other'
  }
}

export function issueCategoryStyles(category: EnrichedPlantIssue['category']): {
  badge: string
  accent: string
  card: string
  title: string
  label: string
  value: string
} {
  const base = {
    card: 'bg-white border border-gray-200 shadow-sm',
    title: 'text-gray-900',
    label: 'text-gray-500',
    value: 'text-gray-700',
  }
  switch (category) {
    case 'pest':
      return {
        ...base,
        badge: 'bg-orange-50 text-orange-800 ring-1 ring-orange-200/80',
        accent: 'border-l-[3px] border-l-orange-400',
      }
    case 'disease':
      return {
        ...base,
        badge: 'bg-red-50 text-red-800 ring-1 ring-red-200/80',
        accent: 'border-l-[3px] border-l-red-400',
      }
    case 'cultural':
      return {
        ...base,
        badge: 'bg-amber-50 text-amber-900 ring-1 ring-amber-200/80',
        accent: 'border-l-[3px] border-l-amber-400',
      }
    default:
      return {
        ...base,
        badge: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
        accent: 'border-l-[3px] border-l-gray-300',
      }
  }
}

export function buildPlantIssuesGuide(details: PlantDetails): PlantIssuesGuide {
  return {
    issues: details.commonIssues.map((issue) => ({
      ...issue,
      category: inferCategory(issue),
    })),
  }
}
