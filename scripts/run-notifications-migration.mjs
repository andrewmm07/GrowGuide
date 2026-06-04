/**
 * Run notifications migration against remote Postgres.
 * Requires DATABASE_URL or SUPABASE_DB_PASSWORD in .env.local
 *
 * DATABASE_URL example (Supabase → Settings → Database → Connection string URI):
 *   postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadEnvLocal() {
  const path = resolve(root, '.env.local')
  if (!existsSync(path)) return {}
  const out = {}
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 1) continue
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return out
}

function buildDatabaseUrl(env) {
  if (env.DATABASE_URL) return env.DATABASE_URL
  const password = env.SUPABASE_DB_PASSWORD
  const ref =
    env.SUPABASE_PROJECT_REF ||
    (env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1] ?? '')
  if (!password || !ref) return null
  const host = env.SUPABASE_DB_HOST || `db.${ref}.supabase.co`
  const port = env.SUPABASE_DB_PORT || '5432'
  const user = env.SUPABASE_DB_USER || 'postgres'
  const db = env.SUPABASE_DB_NAME || 'postgres'
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${db}`
}

async function main() {
  const env = { ...process.env, ...loadEnvLocal() }
  const databaseUrl = buildDatabaseUrl(env)
  if (!databaseUrl) {
    console.error(
      'Missing DATABASE_URL or SUPABASE_DB_PASSWORD in .env.local.\n' +
        'Supabase Dashboard → Project Settings → Database → copy the URI or password.'
    )
    process.exit(1)
  }

  const sqlPath = resolve(root, 'supabase/migrations/20250531_notifications.sql')
  const sql = readFileSync(sqlPath, 'utf8')
  const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })

  try {
    await client.connect()
    await client.query(sql)
    const { rows } = await client.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'profiles' AND column_name = 'notifications_enabled'`
    )
    const { rows: tables } = await client.query(
      `SELECT to_regclass('public.notifications') AS notifications_table`
    )
    console.log('Migration OK.')
    console.log('profiles.notifications_enabled:', rows.length ? 'yes' : 'missing')
    console.log('notifications table:', tables[0]?.notifications_table ?? 'missing')
  } finally {
    await client.end().catch(() => {})
  }
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
