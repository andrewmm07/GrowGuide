/**
 * Audit: planting calendar matrix vs garden planner (plant_timelines CSV).
 * Reports crops with no DB match after alias resolution.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

/** Matrix label → acceptable DB plant_name(s). */
const CALENDAR_TO_DB = {
  'Asian Greens': ['Asian Greens'],
  'English Spinach': ['Spinach'],
  'Spring Onions': ['Spring Onion', 'Onion', 'Onions', 'Shallot'],
  'Spring Onion': ['Spring Onion', 'Onion', 'Onions', 'Shallot'],
  'Cucumbers': ['Cucumber'],
  'Sweet Corn': ['Sweet Corn', 'Corn'],
  'Sweet Potatoes': ['Sweet Potato'],
  'Tomatoes (indoors)': ['Tomatoes'],
  'Tomatoes (start indoors)': ['Tomatoes'],
  'Tomatoes (protected)': ['Tomatoes'],
  'Capsicum (protected)': ['Capsicum', 'Peppers', 'Chilli'],
  'Early Carrots': ['Carrots', 'Carrot'],
  'Early Peas': ['Peas', 'Snow Peas', 'Sugar Snap Peas'],
  'Early Potatoes': ['Potatoes'],
  'Potatoes': ['Potatoes'],
  'Jerusalem Artichokes': ['Jerusalem Artichokes'],
  'Strawberries': ['Strawberry'],
  'Swede': ['Swede'],
  'Asian Greens': ['Asian Greens'],
  'Spring Onions': ['Spring Onion', 'Onion', 'Onions', 'Shallot'],
  'Brassicas': ['Broccoli', 'Cauliflower', 'Cabbage', 'Kale', 'Brussels Sprouts'],
  'Winter Cabbage': ['Cabbage'],
}

function stripQualifiers(name) {
  return name.replace(/\s*\([^)]*\)\s*$/g, '').trim()
}

function normalize(name) {
  return stripQualifiers(name).toLowerCase()
}

function namesMatch(a, b) {
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return true
  if (na.endsWith('s') && na.slice(0, -1) === nb) return true
  if (nb.endsWith('s') && nb.slice(0, -1) === na) return true
  return false
}

function parseCsvNames(csv) {
  const lines = csv.split(/\r?\n/).slice(1).filter(Boolean)
  const byZone = new Map()
  for (const line of lines) {
    const m = line.match(/^[^,]+,([^,]+),([^,]+),/)
    if (!m) continue
    const [, plant, zone] = m
    if (!byZone.has(zone)) byZone.set(zone, new Set())
    byZone.get(zone).add(plant)
  }
  return byZone
}

function matrixNames() {
  const src = fs.readFileSync(path.join(root, 'lib/planting/plantingByClimate.ts'), 'utf8')
  const names = new Set()
  const re = /"(.*?)"/g
  let match
  while ((match = re.exec(src))) {
    const val = match[1]
    if (val.includes(' ') || /^[A-Z]/.test(val)) names.add(val)
  }
  return [...names].sort()
}

function dbHasMatch(dbNames, matrixLabel) {
  const aliases = CALENDAR_TO_DB[matrixLabel] ?? CALENDAR_TO_DB[stripQualifiers(matrixLabel)]
  const targets = aliases ?? [stripQualifiers(matrixLabel)]
  return targets.some((t) => [...dbNames].some((db) => namesMatch(db, t)))
}

function main() {
  const csv = fs.readFileSync(path.join(root, 'plant_timelines_corrected.csv'), 'utf8')
  const byZone = parseCsvNames(csv)
  const db8b = byZone.get('8b') ?? new Set()
  const matrix = matrixNames()

  const missing = []
  const covered = []

  for (const label of matrix) {
    if (dbHasMatch(db8b, label)) covered.push(label)
    else missing.push(label)
  }

  const dbOnly = [...db8b].filter(
    (name) => !matrix.some((m) => dbHasMatch(new Set([name]), m) || namesMatch(m, name))
  )

  console.log('=== Garden planner gap audit (zone 8b / Blackmans Bay) ===\n')
  console.log(`DB plants: ${db8b.size}`)
  console.log(`Calendar matrix labels: ${matrix.length}`)
  console.log(`Covered by DB: ${covered.length}`)
  console.log(`Missing from DB: ${missing.length}\n`)

  if (missing.length) {
    console.log('MISSING (need plant_timelines rows):')
    for (const m of missing) console.log(`  - ${m}`)
  }

  console.log('\nDB-only (in planner but not calendar matrix labels):', dbOnly.length)
}

main()
