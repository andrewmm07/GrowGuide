import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const draft = JSON.parse(
  fs.readFileSync(path.join(root, 'data/drafts/planting-from-claude.json'), 'utf8')
)

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const keys = ['cold', 'cool', 'temperate', 'warm', 'tropical']

let out = `import type { MonthPlantingGuide, PlantingMonth } from './types'

export type PlantingClimateKey = 'cold' | 'cool' | 'temperate' | 'warm' | 'tropical'

/** Month sow/plant lists keyed by growing climate (canonical matrix). Source: data/drafts/planting-from-claude.json */
export const PLANTING_BY_CLIMATE: Record<
  PlantingClimateKey,
  Record<PlantingMonth, MonthPlantingGuide>
> = {
`

for (const climate of keys) {
  out += `  ${climate}: {\n`
  for (const m of months) {
    const cell = draft.baseMatrices[climate][m]
    out += `    ${m}: { sow: ${JSON.stringify(cell.sow)}, plant: ${JSON.stringify(cell.plant)} },\n`
  }
  out += `  },\n`
}
out += `}\n`

const outPath = path.join(root, 'lib/planting/plantingByClimate.ts')
fs.writeFileSync(outPath, out)
console.log('Wrote', outPath)

if (draft.profileOverrides) {
  console.log('Note: profileOverrides present in draft; update plantingProfileData.ts manually or extend script.')
}
