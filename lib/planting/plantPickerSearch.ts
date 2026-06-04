import { plantNamesMatch } from '@/lib/planting/fortnightTiming'

/**
 * Calendar / colloquial names → garden planner (plant_timelines) names.
 * Used for search only — display names stay as stored in the DB.
 */
const PICKER_SEARCH_ALIASES: Record<string, string[]> = {
  'asian greens': ['Asian Greens', 'Rocket', 'Spinach', 'Warrigal Greens', 'Silverbeet', 'Swiss Chard'],
  'mizuna': ['Asian Greens', 'Rocket'],
  'bok choy': ['Asian Greens'],
  'pak choi': ['Asian Greens'],
  'english spinach': ['Spinach'],
  'spring onions': ['Spring Onion', 'Onion', 'Onions', 'Shallot'],
  'spring onion': ['Spring Onion', 'Onion', 'Onions', 'Shallot'],
  'potato': ['Potatoes'],
  'potatoes': ['Potatoes'],
  'early potatoes': ['Potatoes'],
  'jerusalem artichoke': ['Jerusalem Artichokes'],
  'jerusalem artichokes': ['Jerusalem Artichokes'],
  'sunchokes': ['Jerusalem Artichokes'],
  'swede': ['Swede'],
  'swedes': ['Swede'],
  'strawberries': ['Strawberry'],
  'capsicum': ['Capsicum', 'Peppers', 'Chilli'],
  'pepper': ['Capsicum', 'Peppers', 'Chilli'],
  'corn': ['Sweet Corn', 'Corn'],
  'broad bean': ['Broad Beans', 'Beans'],
  'green bean': ['Green Beans', 'Beans'],
  'artichoke': ['Artichoke', 'Globe Artichoke'],
  'silverbeet': ['Silverbeet', 'Swiss Chard'],
  'chard': ['Swiss Chard', 'Silverbeet'],
  'snow pea': ['Snow Peas', 'Sugar Snap Peas', 'Peas'],
  'snap pea': ['Sugar Snap Peas', 'Snow Peas', 'Peas'],
  'tomato': ['Tomatoes'],
  'cucumber': ['Cucumber'],
  'cucumbers': ['Cucumber'],
}

function knownGapMessage(_query: string): string | null {
  return null
}

function queryMatchesAlias(query: string, alias: string): boolean {
  const q = query.trim().toLowerCase()
  const a = alias.toLowerCase()
  if (q === a) return true
  if (q.length >= 3 && a.includes(q)) return true
  if (a.length >= 3 && q.includes(a)) return true
  return false
}

function plantMatchesAliasTargets(plantName: string, query: string): boolean {
  for (const [alias, targets] of Object.entries(PICKER_SEARCH_ALIASES)) {
    if (!queryMatchesAlias(query, alias)) continue
    if (targets.some((target) => plantNamesMatch(plantName, target))) return true
  }
  return false
}

export function plantMatchesPickerQuery(plantName: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  if (plantName.toLowerCase().includes(q)) return true
  return plantMatchesAliasTargets(plantName, q)
}

export function pickerSearchGapHint(query: string): string | null {
  return knownGapMessage(query)
}
