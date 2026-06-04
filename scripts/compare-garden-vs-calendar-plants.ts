/**
 * Compare My Garden plant_timelines (zone) vs planting calendar plant names.
 */
import * as fs from 'fs'
import * as path from 'path'

function loadEnvFile(filename: string) {
  const filePath = path.join(process.cwd(), filename)
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile('.env.local')
loadEnvFile('.env')

async function main() {
  const { getPlantZoneMetaForZone } = await import('../lib/plantTimelineService')
  const { buildClimatePlantingGuideForLocation } = await import(
    '../app/data/planting-calendar/helpers'
  )
  const { findPlaceByName, userLocationFromPlace } = await import('../lib/places')

  const place = findPlaceByName('Blackmans Bay', 'TAS')
  if (!place) throw new Error('Blackmans Bay not found')
  const loc = userLocationFromPlace(place)

  const meta = await getPlantZoneMetaForZone(loc.auHardinessZone)
  const dbNames = new Set(meta.map((m) => m.plantName))

  const guide = buildClimatePlantingGuideForLocation(loc)
  const calNames = new Set<string>()
  for (const month of Object.keys(guide)) {
    for (const p of guide[month] ?? []) {
      calNames.add(p.name)
    }
  }

  const inCalNotDb = [...calNames].filter((n) => !dbNames.has(n)).sort()
  const inDbNotCal = [...dbNames].filter((n) => !calNames.has(n)).sort()

  console.log(`Location: ${loc.city}, ${loc.state} | Zone ${loc.auHardinessZone} | ${loc.climate}`)
  console.log(`DB plants (My Garden picker): ${dbNames.size}`)
  console.log(`Calendar unique plants: ${calNames.size}`)
  console.log(`In calendar but NOT in My Garden DB: ${inCalNotDb.length}`)
  if (inCalNotDb.length) console.log(inCalNotDb.join(', '))
  console.log(`In DB but not in calendar matrix: ${inDbNotCal.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
