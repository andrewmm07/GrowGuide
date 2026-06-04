/**
 * Run plant-picker matrix audit for all preview-matrix locations.
 * npx tsx scripts/audit-plant-picker-matrix-runner.ts [--year 2026] [--detail]
 */

import { execSync } from 'node:child_process'

function parseYearArg(): string {
  const idx = process.argv.indexOf('--year')
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1]
  return String(new Date().getFullYear())
}

function main(): void {
  const year = parseYearArg()
  const extra = process.argv.includes('--detail') ? ' --detail' : ''
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const command = `${npm} exec tsx scripts/audit-plant-picker-matrix.ts -- --year ${year}${extra}`
  execSync(command, { stdio: 'inherit' })
}

main()
