/**
 * Send a test push for the first user with notifications enabled (server-side).
 * Usage: npx tsx scripts/send-test-push.ts [user-id]
 */
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

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
const userIdArg = process.argv[2]

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const admin = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  let userId = userIdArg
  if (!userId) {
    const { data: profiles } = await admin
      .from('profiles')
      .select('id')
      .eq('notifications_enabled', true)
      .limit(1)
    userId = profiles?.[0]?.id
  }
  if (!userId) {
    console.error('No user id. Pass one: npx tsx scripts/send-test-push.ts <uuid>')
    process.exit(1)
  }

  const now = Date.now()
  const { data: row, error } = await admin
    .from('notifications')
    .insert({
      user_id: userId,
      type: 'weather',
      title: 'GrowGuide test notification',
      body: `Server test at ${new Date().toISOString()}`,
      dedupe_key: `test:${now}`,
      data: { deepLink: '/notifications' },
    })
    .select('id')
    .single()

  if (error) {
    console.error(error.message)
    process.exit(1)
  }

  const { data: tokens } = await admin.from('push_device_tokens').select('token').eq('user_id', userId)
  console.log('Notification id:', row.id)
  console.log('Device tokens:', tokens?.length ?? 0)
  if (!tokens?.length) {
    console.log('No push tokens — open the app, enable notifications, and allow permission first.')
    process.exit(0)
  }

  console.log('Invoke send-push from the app or call the edge function with this notification id.')
  console.log('For FCM from CLI, deploy send-push and use Supabase dashboard to test the function with body:')
  console.log(JSON.stringify({ notificationId: row.id }))
}

main()
