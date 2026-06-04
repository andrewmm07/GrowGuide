import { execSync } from 'node:child_process'

type MatrixLocation = {
  place: string
  state: string
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

function parseYearArg(): string {
  const idx = process.argv.indexOf('--year')
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return String(new Date().getFullYear())
}

function runPreview(place: string, state: string, year: string): void {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const command =
    `${npm} exec tsx scripts/preview-blackmans-bay-weekly.ts -- ` +
    `--place "${place}" --state ${state} --year ${year}`
  execSync(command, { stdio: 'inherit' })
}

function main(): void {
  const year = parseYearArg()
  for (const loc of MATRIX) {
    console.log(`\n== Generating ${loc.place}, ${loc.state} (${year}) ==`)
    runPreview(loc.place, loc.state, year)
    // Brief pause between locations to avoid archive API bursts when batch fetch fails.
    if (process.platform === 'win32') {
      execSync('powershell -Command "Start-Sleep -Seconds 2"', { stdio: 'ignore' })
    } else {
      execSync('sleep 2', { stdio: 'ignore' })
    }
  }
}

main()
