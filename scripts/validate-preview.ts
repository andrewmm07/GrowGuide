import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

type MatrixLocation = {
  place: string
  state: string
}

type ParsedWeek = {
  weekId: string
  seasonWeekLine: string
  weatherLine: string
  rollingLine: string
  overview: string
}

type Finding = {
  file: string
  weekId: string
  rule: string
  details: string
}

const MATRIX: MatrixLocation[] = [
  { place: 'Blackmans Bay', state: 'TAS' },
  { place: 'Canberra', state: 'ACT' },
  { place: 'Melbourne', state: 'VIC' },
  { place: 'Adelaide', state: 'SA' },
  { place: 'Darwin', state: 'NT' },
  { place: 'Toowoomba', state: 'QLD' },
  { place: 'Perth', state: 'WA' },
  { place: 'Sydney', state: 'NSW' },
]

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseWeekBlocks(text: string): ParsedWeek[] {
  const chunks = text.split(/\n(?=### W\d{2}\b)/g).filter((c) => c.startsWith('### W'))
  return chunks
    .map((chunk) => {
      const lines = chunk.split('\n')
      if (lines.length < 6) return null
      return {
        weekId: lines[0].slice(4).split('·')[0].trim(),
        seasonWeekLine: lines[1] ?? '',
        weatherLine: lines[2] ?? '',
        rollingLine: lines[3] ?? '',
        overview: lines[5] ?? '',
      }
    })
    .filter((x): x is ParsedWeek => Boolean(x))
}

function parseRolling(rollingLine: string): { soil?: string; sustained?: string; mode?: string } {
  const soil = /soil=([a-z_]+)/i.exec(rollingLine)?.[1]
  const sustained = /sustained=([a-z]+)/i.exec(rollingLine)?.[1]
  const mode = /mode=([a-z]+)/i.exec(rollingLine)?.[1]
  return { soil, sustained, mode }
}

function parseClimate(text: string): string {
  return /Climate:\s*([a-z_]+)/i.exec(text)?.[1]?.toLowerCase() ?? 'unknown'
}

function parseTags(text: string): string[] {
  const m = /Tags:\s*([^\n]+)/i.exec(text)?.[1]
  if (!m) return []
  return m
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

function parseWeekInSeason(seasonWeekLine: string): number | null {
  const m = /Week\s+(\d+)/i.exec(seasonWeekLine)
  return m ? Number.parseInt(m[1], 10) : null
}

function validateFile(filePath: string): Finding[] {
  const findings: Finding[] = []
  if (!existsSync(filePath)) {
    findings.push({
      file: filePath,
      weekId: 'N/A',
      rule: 'file_exists',
      details: 'Preview output missing',
    })
    return findings
  }

  const text = readFileSync(filePath, 'utf8')
  const climate = parseClimate(text)
  const tags = parseTags(text)
  const weeks = parseWeekBlocks(text)
  const file = filePath.split(/[\\/]/).pop() ?? filePath

  for (let i = 0; i < weeks.length; i++) {
    const w = weeks[i]
    const rolling = parseRolling(w.rollingLine)
    const weekInSeason = parseWeekInSeason(w.seasonWeekLine)
    const seasonText = w.seasonWeekLine.toLowerCase()

    if (i > 0 && w.overview.trim() === weeks[i - 1].overview.trim()) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'no_consecutive_identical_overview',
        details: 'Overview matches previous week exactly',
      })
    }

    if (rolling.sustained === 'true' && rolling.mode === 'base') {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'sustained_not_base',
        details: 'sustained=true with mode=base',
      })
    }

    if (w.weatherLine.includes('FROST') && rolling.mode === 'base') {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'frost_not_silent',
        details: 'FROST week should append or replace, not base',
      })
    }

    if (/\b\d+(\.\d+)?\s?(°C|mm)\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'no_raw_units_in_overview',
        details: 'Found raw °C or mm in overview text',
      })
    }

    if (
      /\b(This week, prioritise|Keep momentum on|Before the next phase, shift effort to)\b/.test(
        w.overview
      )
    ) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'no_placeholder_phrasing',
        details: 'Found synthetic placeholder phrasing in user-facing output',
      })
    }

    if (!tags.includes('coastal') && /salt-laden wind/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'inland_no_salt_wind',
        details: 'Salt-laden wind phrasing appeared for non-coastal location',
      })
    }

    if (rolling.soil === 'dry' && /\b(avoid digging wet beds?|sodden soil|waterlogged soil)\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'dry_soil_wet_bed_conflict',
        details: 'Wet-bed wording appears while soil=dry',
      })
    }

    if (rolling.soil === 'dry' && /\b(ease back on watering|reduce watering|water less)\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'dry_soil_reduce_watering_conflict',
        details: 'Reduce-watering wording appears while soil=dry',
      })
    }

    if (seasonText.includes('winter') && weekInSeason != null && weekInSeason > 4 && /\bwater deeply\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'late_winter_no_deep_watering',
        details: 'Contains "water deeply" in later winter week',
      })
    }

    if (climate === 'cold' && /\b(mango|pawpaw|papaya|banana)\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'cold_climate_tropical_crop_mismatch',
        details: 'Tropical crop reference in cold climate output',
      })
    }

    if (tags.includes('mediterranean') && /\bon the coast\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'mediterranean_no_coastal_framing',
        details: 'Mediterranean site used cool-coastal "on the coast" framing',
      })
    }

    if (
      tags.includes('mediterranean') &&
      seasonText.includes('summer') &&
      i >= 2 &&
      /Dry summer soil—water fruiting/i.test(w.overview) &&
      /Dry summer soil—water fruiting/i.test(weeks[i - 1].overview) &&
      /Dry summer soil—water fruiting/i.test(weeks[i - 2].overview)
    ) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'no_repeated_generic_dry_replace',
        details: 'Same generic dry-summer replace line three weeks running',
      })
    }

    if (climate === 'tropical' && /\bfrost\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'tropical_no_frost_reference',
        details: 'Frost reference in tropical climate output',
      })
    }

    if (climate === 'tropical' && /\boverwintering brassicas?\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'tropical_no_overwintering_brassicas',
        details: 'Overwintering brassica phrasing in tropical output',
      })
    }

    if (climate === 'tropical' && /\b(potatoes?|peas?)\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'tropical_no_temperate_crop_refs',
        details: 'Temperate crop references (potatoes/peas) in tropical output',
      })
    }

    if (climate === 'tropical' && /\bcold snap\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'tropical_no_cold_snap',
        details: 'Cold-snap phrasing in tropical output',
      })
    }

    if (climate === 'tropical' && /\bwet winter week\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'tropical_no_winter_week_framing',
        details: 'Winter-week framing appeared in tropical output',
      })
    }

    if (climate === 'tropical' && /\bseedbeds?\s+are\s+still\s+cool\b/i.test(w.overview)) {
      findings.push({
        file,
        weekId: w.weekId,
        rule: 'tropical_no_cool_seedbed_framing',
        details: 'Cool-seedbed framing appeared in tropical output',
      })
    }
  }

  return findings
}

function main(): void {
  const files = MATRIX.map((loc) =>
    join(__dirname, `${slugify(loc.place)}-weekly-output.txt`)
  )
  const findings = files.flatMap(validateFile)

  if (findings.length === 0) {
    console.log('Preview validation passed: no issues found.')
    return
  }

  console.log(`Preview validation found ${findings.length} issue(s):`)
  for (const f of findings) {
    console.log(`- ${f.file} ${f.weekId} [${f.rule}] ${f.details}`)
  }
  process.exitCode = 1
}

main()
