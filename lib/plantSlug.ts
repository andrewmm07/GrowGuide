/** URL slug for a plant display name (e.g. "Cherry Tomatoes" → "cherry-tomatoes"). */
export function plantNameToSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Resolve slug to canonical plant name from a known list. */
export function slugToPlantName(slug: string, knownNames: readonly string[]): string | null {
  const normalized = slug.trim().toLowerCase()
  for (const name of knownNames) {
    if (plantNameToSlug(name) === normalized) return name
  }
  return null
}
