/**
 * Manual run: npx tsx scripts/run-notification-digest.ts
 * Requires .env.local: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WEATHER_API_KEY, optional FIREBASE_*
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { runScheduledNotificationDigest } from '../lib/notifications/digestRunner'

function loadEnvLocal() {
  const path = join(process.cwd(), '.env.local')
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/)
    if (!m) continue
    let v = m[2].trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (!process.env[m[1]]) process.env[m[1]] = v
  }
}

loadEnvLocal()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const weatherApiKey =
  process.env.WEATHER_API_KEY ??
  process.env.NEXT_PUBLIC_WEATHER_API_KEY ??
  process.env.NEXT_PUBLIC_WEATHERAPI_KEY

if (!supabaseUrl || !serviceRoleKey || !weatherApiKey) {
  console.error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, WEATHER_API_KEY in .env.local')
  process.exit(1)
}

const firebase =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
    ? {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }
    : undefined

const testNow = process.env.DIGEST_TEST_NOW ? new Date(process.env.DIGEST_TEST_NOW) : undefined

runScheduledNotificationDigest({
  supabaseUrl,
  serviceRoleKey,
  weatherApiKey,
  firebase,
  now: testNow,
}).then((r) => {
  console.log(JSON.stringify(r, null, 2))
  process.exit(r.errors.length ? 1 : 0)
})
