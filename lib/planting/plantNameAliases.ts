/**
 * Maps planting-matrix names to CALENDAR_PLANT_DETAILS keys (case- and spelling-sensitive).
 */
const PLANT_NAME_ALIASES: Record<string, string> = {
  Cucumber: 'Cucumbers',
  'Spring onions': 'Spring Onion',
  'Spring Onions': 'Spring Onion',
  'Sweet Potatoes': 'Sweet Potato',
  Cabbage: 'Winter Cabbage',
  Peppers: 'Capsicum',
  Chilli: 'Chillies',
  Chillies: 'Chillies',
  'Sweet Corn': 'Sweet Corn',
  'Broad beans': 'Broad Beans',
  'Bush Beans': 'Beans',
  'Brussels Sprouts': 'Brussels sprouts',
  'Early Peas': 'Peas',
  Spinach: 'English Spinach',
  Strawberry: 'Strawberries',
}

/** Strip trailing parenthetical qualifiers for registry lookup (display name unchanged). */
function stripNameQualifiers(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, '').trim()
}

/** Resolve matrix label to CALENDAR_PLANT_DETAILS key (exact key match after aliases). */
export function resolveCalendarPlantName(name: string): string {
  const trimmed = name.trim()
  const base = stripNameQualifiers(trimmed)
  return PLANT_NAME_ALIASES[trimmed] ?? PLANT_NAME_ALIASES[base] ?? base
}

export function hasCalendarPlantDetails(
  plantDetails: Record<string, unknown>,
  name: string
): boolean {
  return Boolean(plantDetails[resolveCalendarPlantName(name)])
}
