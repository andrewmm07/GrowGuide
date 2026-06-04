/**
 * Load plant_timelines_corrected.csv into Supabase
 * Populates both plant_timelines and plant_activities tables
 *
 * Usage (PowerShell — use .cmd if scripts are disabled):
 *   npx.cmd tsx scripts/load-plant-data.ts
 *
 * Prerequisites:
 *   - plant_timelines_corrected.csv in project root
 *   - Supabase migrations applied (001_normalize_activities.sql)
 *   - Environment variables:
 *       NEXT_PUBLIC_SUPABASE_URL
 *       SUPABASE_SERVICE_ROLE_KEY  (required for insert/delete — anon key is read-only)
 *       NEXT_PUBLIC_SUPABASE_ANON_KEY (optional fallback; will fail RLS on plant_activities)
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
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseKey = serviceRoleKey || anonKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local'
  );
}

if (!serviceRoleKey) {
  console.warn(
    '⚠ SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Inserts will fail if RLS blocks writes.\n'
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

interface PlantTimelineRow {
  id: string;
  plant_name: string;
  au_hardiness_zone: string;
  sow_to_seedling: string;
  seedling_to_harvest: string;
  harvest_window: string;
  watering_frequency: string;
  key_activities: string; // JSON string
  created_at: string;
  growth_multiplier: string;
  extra_care: string;
  updated_at: string;
  plant_category: string;
  climate_note: string;
  unsuitable_zone: string;
}

interface KeyActivity {
  timing: number;
  activity: string;
  details: string;
  category: 'planting' | 'pest' | 'pruning' | 'harvest' | 'watering' | 'fertilizing';
}

/** RFC-style CSV line parser (handles quoted fields with commas). */
function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let field = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++;
          break;
        } else {
          field += line[i++];
        }
      }
      fields.push(field);
      if (line[i] === ',') i++;
    } else {
      let field = '';
      while (i < line.length && line[i] !== ',') field += line[i++];
      fields.push(field);
      if (line[i] === ',') i++;
    }
  }
  return fields;
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const record: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = (values[j] ?? '').trim();
    }
    if (Object.values(record).some((v) => v.length > 0)) {
      records.push(record);
    }
  }

  return records;
}

function parseKeyActivities(raw: string): KeyActivity[] {
  const trimmed = (raw || '').trim();
  if (!trimmed) return [];
  return JSON.parse(trimmed);
}

async function loadPlantData() {
  try {
    console.log('🌱 Starting plant data load...\n');

    // Read CSV file
    const csvPath = path.join(process.cwd(), 'plant_timelines_corrected.csv');
    console.log(`📖 Reading: ${csvPath}`);

    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found: ${csvPath}`);
    }

    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    const records = parseCSV(fileContent) as unknown as PlantTimelineRow[];

    console.log(`✓ Loaded ${records.length} plant records from CSV\n`);

    // Separate data for two tables
    const plantTimelineInserts: any[] = [];
    const plantActivityInserts: any[] = [];
    let activityCount = 0;

    // Process each row
    for (const row of records) {
      // Parse key_activities JSON
      let activities: KeyActivity[] = [];
      try {
        activities = parseKeyActivities(row.key_activities);
      } catch (e) {
        console.warn(
          `⚠ Failed to parse activities for ${row.plant_name} (${row.au_hardiness_zone}):`,
          e
        );
        continue;
      }

      // Build plant_timelines insert
      const plantTimelineRow = {
        id: row.id,
        plant_name: row.plant_name,
        au_hardiness_zone: row.au_hardiness_zone,
        sow_to_seedling: parseInt(row.sow_to_seedling) || 0,
        seedling_to_harvest: parseInt(row.seedling_to_harvest) || 0,
        harvest_window: parseInt(row.harvest_window) || 0,
        watering_frequency: parseInt(row.watering_frequency) || 0,
        growth_multiplier: parseFloat(row.growth_multiplier) || 1.0,
        extra_care: row.extra_care ? [row.extra_care] : [], // CSV has as text, convert to array
        plant_category: row.plant_category || null,
        climate_note: row.climate_note || null,
        unsuitable_zone: row.unsuitable_zone === 'True' || row.unsuitable_zone === 'true',
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString(),
      };

      plantTimelineInserts.push(plantTimelineRow);

      // Build plant_activities inserts
      for (const activity of activities) {
        plantActivityInserts.push({
          plant_name: row.plant_name,
          au_hardiness_zone: row.au_hardiness_zone,
          timing_days: activity.timing,
          activity_name: activity.activity,
          details: activity.details,
          activity_category: activity.category,
        });
        activityCount++;
      }
    }

    console.log(`📊 Prepared data:`);
    console.log(`   - Plant timelines: ${plantTimelineInserts.length}`);
    console.log(`   - Activities: ${activityCount}\n`);

    console.log('🗑  Clearing existing plant_activities...');
    const { error: deleteError } = await supabase
      .from('plant_activities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      throw new Error(`Failed to clear plant_activities: ${deleteError.message}`);
    }

    const BATCH = 500;

    console.log('💾 Inserting plant timelines...');
    for (let i = 0; i < plantTimelineInserts.length; i += BATCH) {
      const batch = plantTimelineInserts.slice(i, i + BATCH);
      const { error: timelineError } = await supabase
        .from('plant_timelines')
        .upsert(batch, {
          onConflict: 'plant_name,au_hardiness_zone',
          ignoreDuplicates: false,
        });

      if (timelineError) {
        throw new Error(`Failed to insert plant_timelines: ${timelineError.message}`);
      }
    }

    console.log(`✓ Inserted/updated ${plantTimelineInserts.length} plant timelines\n`);

    console.log('💾 Inserting activities...');
    for (let i = 0; i < plantActivityInserts.length; i += BATCH) {
      const batch = plantActivityInserts.slice(i, i + BATCH);
      const { error: activityError } = await supabase.from('plant_activities').insert(batch);

      if (activityError) {
        throw new Error(`Failed to insert plant_activities: ${activityError.message}`);
      }
    }

    console.log(`✓ Inserted ${activityCount} activities\n`);

    // Verification
    console.log('🔍 Verifying data...');

    const { count: timelineCount, error: countError1 } = await supabase
      .from('plant_timelines')
      .select('*', { count: 'exact', head: true });

    const { count: verifyActivityCount, error: countError2 } = await supabase
      .from('plant_activities')
      .select('*', { count: 'exact', head: true });

    console.log(`   - plant_timelines: ${timelineCount} rows`);
    console.log(`   - plant_activities: ${verifyActivityCount} rows\n`);

    console.log('✅ Plant data load complete!\n');
    console.log('Restart the app (npm run dev) to pick up new task data in the UI.');

  } catch (error) {
    console.error('❌ Load failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  loadPlantData();
}

export { loadPlantData };
