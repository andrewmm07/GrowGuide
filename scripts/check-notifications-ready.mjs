/**
 * Operator checklist: what's missing before push notifications work.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const checks = []

function ok(label) {
  checks.push({ label, status: 'ok' })
}

function missing(label, fix) {
  checks.push({ label, status: 'missing', fix })
}

const googleServices = resolve(root, 'android/app/google-services.json')
if (existsSync(googleServices)) {
  ok('android/app/google-services.json')
} else {
  missing(
    'android/app/google-services.json',
    'Firebase Console → Android app au.org.pivot.growguide → download JSON → android/app/'
  )
}

const envLocal = resolve(root, '.env.local')
if (existsSync(envLocal)) {
  const text = readFileSync(envLocal, 'utf8')
  if (/NEXT_PUBLIC_FCM_CONFIGURED\s*=\s*true/i.test(text)) {
    ok('NEXT_PUBLIC_FCM_CONFIGURED=true in .env.local')
  } else if (existsSync(googleServices)) {
    missing(
      'NEXT_PUBLIC_FCM_CONFIGURED=true',
      'Add to .env.local after google-services.json, then npm run build:mobile'
    )
  }
} else if (existsSync(googleServices)) {
  missing('NEXT_PUBLIC_FCM_CONFIGURED=true', 'Create .env.local with NEXT_PUBLIC_FCM_CONFIGURED=true')
}

const digestFn = resolve(root, 'supabase/functions/notification-digest/index.ts')
const sendPushFn = resolve(root, 'supabase/functions/send-push/index.ts')
if (existsSync(digestFn)) ok('notification-digest edge function (source)')
else missing('notification-digest', 'Missing supabase/functions/notification-digest')

if (existsSync(sendPushFn)) ok('send-push edge function (source)')
else missing('send-push', 'Missing supabase/functions/send-push')

console.log('\nGrowGuide push notification readiness\n')
for (const c of checks) {
  const icon = c.status === 'ok' ? '[ok]' : '[!!]'
  console.log(`${icon} ${c.label}`)
  if (c.fix) console.log(`     → ${c.fix}`)
}

const blockers = checks.filter((c) => c.status === 'missing')
console.log(
  blockers.length === 0
    ? '\nRepo-side checks passed. Complete Supabase secrets + cron in docs/NOTIFICATIONS_SETUP_STEPS.md\n'
    : `\n${blockers.length} repo item(s) to fix. Supabase secrets/cron: docs/NOTIFICATIONS_SETUP_STEPS.md\n`
)

process.exit(blockers.length > 0 ? 1 : 0)
