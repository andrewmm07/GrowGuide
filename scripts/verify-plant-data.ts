/**
 * Read-only check: plant_timelines and plant_activities row counts in Supabase.
 * Usage: npx tsx scripts/verify-plant-data.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

function loadEnvFile(filename: string) {
  const filePath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Doc still says 769 / 3500+; current CSV has 818 timelines and 2737 activities. */
const EXPECTED = { plant_timelines: 818, plant_activities: 2737 };

async function main() {
  console.log('Supabase plant data verification\n');

  for (const table of ['plant_timelines', 'plant_activities'] as const) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });

    if (error) {
      const missing =
        error.message.includes('does not exist') ||
        error.code === '42P01' ||
        error.message.includes('schema cache');
      console.log(`${table}: ${missing ? 'TABLE MISSING or not exposed' : 'ERROR'}`);
      console.log(`  ${error.message}\n`);
      continue;
    }

    const n = count ?? 0;
    console.log(`${table}: ${n} rows`);
  }

  const { data: activitySample, error: sampleErr } = await supabase
    .from('plant_activities')
    .select('plant_name, au_hardiness_zone, activity_name')
    .limit(3);

  if (sampleErr) {
    console.log(`\nSample read: failed — ${sampleErr.message}`);
  } else if (!activitySample?.length) {
    console.log('\nSample read: plant_activities is empty (schedules will not generate)');
  } else {
    console.log('\nSample activities:', activitySample);
  }

  const { count: tl } = await supabase
    .from('plant_timelines')
    .select('*', { count: 'exact', head: true });
  const { count: act } = await supabase
    .from('plant_activities')
    .select('*', { count: 'exact', head: true });

  const { data: tomatoesActs } = await supabase
    .from('plant_activities')
    .select('id')
    .eq('plant_name', 'Tomatoes')
    .eq('au_hardiness_zone', '9b');
  console.log(`\nTomatoes (9b) activities: ${tomatoesActs?.length ?? 0}`);

  const timelinesOk = (tl ?? 0) === EXPECTED.plant_timelines;
  const activitiesOk = (act ?? 0) === EXPECTED.plant_activities;

  console.log('\n--- Summary ---');
  if (timelinesOk && activitiesOk) {
    console.log(
      'OK: Supabase matches current CSV (818 timelines, 2737 activities).'
    );
    console.log('Migration 001 + load-plant-data appear complete.');
    process.exit(0);
  }
  if ((tl ?? 0) > 0 && (act ?? 0) > 0 && (!timelinesOk || !activitiesOk)) {
    console.log('OUT OF SYNC: DB counts differ from plant_timelines_corrected.csv.');
    console.log(`  Expected: ${EXPECTED.plant_timelines} timelines, ${EXPECTED.plant_activities} activities`);
    console.log('  → Re-run: npx tsx scripts/load-plant-data.ts');
  } else if ((tl ?? 0) > 0 && (act ?? 0) === 0) {
    console.log('PARTIAL: timelines exist but plant_activities empty.');
    console.log('  → Apply 001_normalize_activities.sql if table missing.');
    console.log('  → Run: npx tsx scripts/load-plant-data.ts');
  } else if ((tl ?? 0) === 0) {
    console.log('NOT LOADED: plant_timelines empty.');
    console.log('  → Run: npx tsx scripts/load-plant-data.ts');
  } else {
    console.log('INCOMPLETE: check Supabase credentials and migrations.');
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
