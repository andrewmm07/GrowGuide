/**
 * Cross-platform mobile static export (Capacitor). Sets EXPORT_STATIC for next.config.js.
 */
import { execSync } from 'node:child_process'

process.env.EXPORT_STATIC = 'true'
if (!process.env.NEXT_PUBLIC_UI_REV) {
  process.env.NEXT_PUBLIC_UI_REV = '4'
}

execSync('next build', { stdio: 'inherit', env: process.env })
