import definitions from '@/data/plants-definitions.json'
import { plantNameToSlug } from '@/lib/plantSlug'

interface PlantDefinition {
  name: string
}

/** Seed catalog plant names (not runtime DB truth). */
export function getSeedPlantNames(): string[] {
  const plants = (definitions as { plants: PlantDefinition[] }).plants ?? []
  return plants.map((p) => p.name)
}

export function getSeedPlantStaticParams(): { id: string }[] {
  return getSeedPlantNames().map((name) => ({ id: plantNameToSlug(name) }))
}
