/**
 * Append missing garden planner crops to plant_timelines_corrected.csv (all zones).
 * Run: node scripts/add-missing-plants.mjs
 * Then: npx tsx scripts/load-plant-data.ts
 */
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const csvPath = path.join(root, 'plant_timelines_corrected.csv')

const ALL_ZONES = ['8a', '8b', '9a', '9b', '10a', '10b', '11a', '11b', '12a', '12b']

const ZONE_PROFILE = {
  '8a': { mult: 1.1, unsuitable: false },
  '8b': { mult: 1.05, unsuitable: false },
  '9a': { mult: 1.05, unsuitable: false },
  '9b': { mult: 1.0, unsuitable: false },
  '10a': { mult: 0.95, unsuitable: false },
  '10b': { mult: 0.95, unsuitable: false },
  '11a': { mult: 0.9, unsuitable: false },
  '11b': { mult: 0.85, unsuitable: false },
  '12a': { mult: 0.8, unsuitable: false },
  '12b': { mult: 0.75, unsuitable: false },
}

function esc(s) {
  return String(s).replace(/"/g, '""')
}

function activitiesJson(acts) {
  return JSON.stringify(acts)
}

function row({
  plant,
  zone,
  sow,
  seedling,
  harvest,
  water,
  acts,
  mult,
  extra,
  category,
  note,
  unsuitable,
}) {
  const now = new Date().toISOString().replace('T', ' ').slice(0, 26)
  const id = randomUUID()
  const actsField = `"${esc(activitiesJson(acts))}"`
  return [
    id,
    plant,
    zone,
    sow,
    seedling,
    harvest,
    water,
    actsField,
    now,
    mult,
    extra,
    `${now}+00`,
    category,
    note,
    unsuitable ? 'True' : 'False',
  ].join(',')
}

const PLANT_DEFS = [
  {
    name: 'Potatoes',
    category: 'annual_vegetable',
    sow: 0,
    seedling: 90,
    harvest: 21,
    water: 3,
    extraByZone: {
      cold: 'Chit seed potatoes; plant after last frost; hill as shoots grow',
      warm: 'Plant in cooler months; avoid wet-season tuber rot',
    },
    note: 'Grown from seed tubers — not true seed. Hill soil around stems to protect tubers from light. Harvest when tops die back.',
    activities: [
      {
        timing: 0,
        activity: 'Plant seed potatoes 10–15cm deep',
        details:
          'Use certified seed potatoes. Space 30–40cm in rows 75cm apart. In cool zones plant August–October (early) or October–November (main). Eyes facing up.',
        category: 'planting',
      },
      {
        timing: 21,
        activity: 'Hill soil when shoots reach 15cm',
        details:
          'Mound loose soil around stems leaving top foliage exposed. Protects developing tubers from greening and frost. Repeat hilling every 2–3 weeks.',
        category: 'planting',
      },
      {
        timing: 45,
        activity: 'Monitor for potato beetles and blight',
        details:
          'Check leaf undersides for orange beetle eggs and larvae. Remove by hand or use Bt. Watch for brown leaf patches (blight) — remove affected foliage immediately.',
        category: 'pest',
      },
      {
        timing: 70,
        activity: 'Maintain moisture through tuber bulking',
        details:
          'Consistent soil moisture drives yield. Irregular watering causes hollow or cracked tubers. Reduce watering as tops begin to yellow.',
        category: 'watering',
      },
      {
        timing: 90,
        activity: 'Harvest when tops die back',
        details:
          'Wait until foliage has fully yellowed and died. Dig carefully with a fork from the side to avoid spearing tubers. Cure in a dark, dry place for 1–2 weeks before storage.',
        category: 'harvest',
      },
    ],
    zoneExtra: (zone) => {
      const z = parseInt(zone)
      if (z <= 9) return 'Excellent cool-season crop — chit before planting'
      if (z <= 10) return 'Plant autumn–winter; harvest before peak heat'
      return 'Dry-season crop only — harvest before wet season'
    },
  },
  {
    name: 'Jerusalem Artichokes',
    category: 'perennial_vegetable',
    sow: 0,
    seedling: 150,
    harvest: 60,
    water: 3,
    extraByZone: { cold: 'Plant tubers in winter–spring; spreads — contain if needed' },
    note: 'Perennial sunchoke — planted from tubers, not seed. Harvest after frost kills tops. Can spread; plant where permanence is welcome.',
    activities: [
      {
        timing: 0,
        activity: 'Plant tubers 10–15cm deep',
        details:
          'Plant whole small tubers or large pieces with 2–3 eyes, 30–45cm apart in rows 90cm apart. In cool zones plant July–September for spring harvest next year.',
        category: 'planting',
      },
      {
        timing: 30,
        activity: 'Mulch and support tall stems',
        details:
          'Plants reach 2–3m. Stake in windy sites. Mulch to retain moisture and suppress weeds. Very drought-tolerant once established.',
        category: 'planting',
      },
      {
        timing: 90,
        activity: 'Remove competing weeds',
        details:
          'Jerusalem artichokes shade out most weeds once established. Keep base clear in the first season while tubers establish.',
        category: 'planting',
      },
      {
        timing: 150,
        activity: 'Harvest after tops die from frost',
        details:
          'Cut stems to 30cm after frost kills foliage. Dig tubers with a fork — they store well in ground through winter. Leave some tubers for next season.',
        category: 'harvest',
      },
    ],
    zoneExtra: () => 'Perennial — leave tubers in ground for next season',
  },
  {
    name: 'Swede',
    category: 'annual_vegetable',
    sow: 14,
    seedling: 90,
    harvest: 30,
    water: 3,
    note: 'Root crop related to turnip but larger and sweeter after frost. Direct sow — do not transplant.',
    activities: [
      {
        timing: 14,
        activity: 'Thin to 20–25cm spacing',
        details:
          'Thin when seedlings have 2–3 true leaves. Crowded swedes produce small, forked roots. Thinnings can be used as greens.',
        category: 'planting',
      },
      {
        timing: 60,
        activity: 'Check root size at shoulder',
        details:
          'Brush soil from the crown — swedes are ready at 10–15cm diameter. Smaller roots are more tender; oversized roots become woody.',
        category: 'harvest',
      },
      {
        timing: 90,
        activity: 'Harvest after frost for best flavour',
        details:
          'Cold converts starch to sugar — autumn/winter swedes in cool zones are sweetest. Pull or fork carefully. Stores 2–3 months in cool conditions.',
        category: 'harvest',
      },
    ],
    zoneExtra: (zone) => {
      const z = parseInt(zone)
      if (z <= 9) return 'Excellent autumn/winter root crop — frost improves flavour'
      if (z <= 10) return 'Sow autumn; harvest in cool months'
      return 'Dry-season only — harvest young before wet season'
    },
  },
  {
    name: 'Asian Greens',
    category: 'annual_vegetable',
    sow: 7,
    seedling: 35,
    harvest: 21,
    water: 3,
    note: 'Fast leafy greens (bok choy, tatsoi, mizuna types). Cut-and-come-again harvest. Bolts quickly in heat.',
    activities: [
      {
        timing: 7,
        activity: 'Thin or transplant to final spacing',
        details:
          'Space 15–30cm depending on variety. Keep soil consistently moist for rapid, tender growth. Use row covers against flea beetles in spring.',
        category: 'planting',
      },
      {
        timing: 21,
        activity: 'Begin cut-and-come-again harvest',
        details:
          'Harvest outer leaves or cut whole heads at 15–20cm. Regrows once or twice before bolting. Succession sow every 2–3 weeks.',
        category: 'harvest',
      },
      {
        timing: 35,
        activity: 'Remove at first sign of bolting',
        details:
          'Flower stalks make leaves bitter. Pull and resow in a shadier spot during warm spells.',
        category: 'pruning',
      },
    ],
    zoneExtra: (zone) => {
      const z = parseInt(zone)
      if (z <= 9) return 'Year-round with succession sowing in cool zones'
      return 'Best in cooler months — provide afternoon shade in warm zones'
    },
  },
  {
    name: 'Spring Onion',
    category: 'annual_vegetable',
    sow: 10,
    seedling: 60,
    harvest: 30,
    water: 3,
    note: 'Pull as needed when stems reach pencil thickness. Faster crop than bulbing onions — succession sow for continuous supply.',
    activities: [
      {
        timing: 10,
        activity: 'Thin to 3–5cm or broadcast in bands',
        details:
          'Can be sown thickly in 10cm bands and pulled young. For larger spring onions, thin to 5cm between plants.',
        category: 'planting',
      },
      {
        timing: 45,
        activity: 'Pull as needed when stems are pencil-thick',
        details:
          'Harvest by pulling gently or cutting at soil level. Leave remaining plants to size up. Regular picking extends the harvest window.',
        category: 'harvest',
      },
      {
        timing: 60,
        activity: 'Succession sow next batch',
        details:
          'Sow a new row every 3–4 weeks for continuous supply through the growing season.',
        category: 'planting',
      },
    ],
    zoneExtra: () => 'Succession sow every 3–4 weeks for continuous supply',
  },
]

function existingPairs(csv) {
  const set = new Set()
  for (const line of csv.split(/\r?\n/).slice(1)) {
    const m = line.match(/^[^,]+,([^,]+),([^,]+),/)
    if (m) set.add(`${m[1]}|${m[2]}`)
  }
  return set
}

function main() {
  const csv = fs.readFileSync(csvPath, 'utf8')
  const existing = existingPairs(csv)
  const newRows = []

  for (const def of PLANT_DEFS) {
    for (const zone of ALL_ZONES) {
      const key = `${def.name}|${zone}`
      if (existing.has(key)) {
        console.log(`Skip (exists): ${key}`)
        continue
      }
      const profile = ZONE_PROFILE[zone]
      const zNum = parseInt(zone)
      const mult = profile.mult * (def.name === 'Jerusalem Artichokes' && zNum >= 11 ? 0.9 : 1)
      const unsuitable =
        def.name === 'Swede' && zNum >= 12
          ? true
          : def.name === 'Jerusalem Artichokes' && zNum >= 12
            ? false
          : profile.unsuitable && def.name === 'Potatoes' && zNum >= 12

      newRows.push(
        row({
          plant: def.name,
          zone,
          sow: def.sow,
          seedling: def.seedling,
          harvest: def.harvest,
          water: def.water,
          acts: def.activities,
          mult: Number(mult.toFixed(2)),
          extra: def.zoneExtra(zone),
          category: def.category,
          note: def.note,
          unsuitable:
            def.name === 'Asian Greens' && zNum >= 12
              ? false
              : def.name === 'Potatoes' && zNum >= 12
                ? true
                : unsuitable,
        })
      )
    }
  }

  if (newRows.length === 0) {
    console.log('No new rows to add.')
    return
  }

  const out = csv.trimEnd() + '\n' + newRows.join('\n') + '\n'
  fs.writeFileSync(csvPath, out, 'utf8')
  console.log(`Added ${newRows.length} rows (${PLANT_DEFS.map((p) => p.name).join(', ')})`)
  console.log('Run: npx tsx scripts/load-plant-data.ts')
}

main()
