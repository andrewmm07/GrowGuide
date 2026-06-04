#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[ERROR] Missing Supabase env vars');
  console.error('Need: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let insideQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function readCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]);
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    if (Object.values(record).some(v => v.length > 0)) {
      records.push(record);
    }
  }
  return records;
}

async function loadPlantData() {
  try {
    console.log('[START] Loading plant data\n');
    const csvPath = path.join(process.cwd(), 'plant_timelines_corrected.csv');
    console.log('CSV: ' + csvPath);
    if (!fs.existsSync(csvPath)) {
      throw new Error('CSV not found: ' + csvPath);
    }
    const records = readCSV(csvPath);
    console.log('Loaded ' + records.length + ' records\n');

    const plantTimelineInserts = [];
    const plantActivityInserts = [];
    let activityCount = 0;

    for (const row of records) {
      let activities = [];
      try {
        activities = JSON.parse(row.key_activities || '[]');
      } catch (e) {
        console.warn('Parse error: ' + row.plant_name);
      }

      const plantTimelineRow = {
        id: row.id,
        plant_name: row.plant_name,
        au_hardiness_zone: row.au_hardiness_zone,
        sow_to_seedling: parseInt(row.sow_to_seedling) || 0,
        seedling_to_harvest: parseInt(row.seedling_to_harvest) || 0,
        harvest_window: parseInt(row.harvest_window) || 0,
        watering_frequency: parseInt(row.watering_frequency) || 0,
        growth_multiplier: parseFloat(row.growth_multiplier) || 1.0,
        extra_care: row.extra_care ? [row.extra_care] : [],
        plant_category: row.plant_category || null,
        climate_note: row.climate_note || null,
        unsuitable_zone: row.unsuitable_zone === 'True',
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.updated_at || new Date().toISOString(),
      };

      plantTimelineInserts.push(plantTimelineRow);

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

    console.log('Data prepared:');
    console.log('  Timelines: ' + plantTimelineInserts.length);
    console.log('  Activities: ' + activityCount + '\n');

    console.log('[INSERTING] Timelines...');
    const { error: timelineError } = await supabase
      .from('plant_timelines')
      .upsert(plantTimelineInserts, {
        onConflict: 'plant_name,au_hardiness_zone',
      });

    if (timelineError) {
      throw new Error('Insert timeline error: ' + timelineError.message);
    }
    console.log('[OK] Timelines inserted\n');

    console.log('[INSERTING] Activities...');
    const { error: activityError } = await supabase
      .from('plant_activities')
      .insert(plantActivityInserts);

    if (activityError) {
      throw new Error('Insert activity error: ' + activityError.message);
    }
    console.log('[OK] Activities inserted\n');

    console.log('[VERIFYING] Data...');
    const { count: timelineCount } = await supabase
      .from('plant_timelines')
      .select('*', { count: 'exact', head: true });

    const { count: actCount } = await supabase
      .from('plant_activities')
      .select('*', { count: 'exact', head: true });

    console.log('  Timelines in DB: ' + timelineCount);
    console.log('  Activities in DB: ' + actCount + '\n');

    console.log('[SUCCESS] Load complete!\n');

  } catch (error) {
    console.error('[FAILED] ' + error.message);
    process.exit(1);
  }
}

loadPlantData();
