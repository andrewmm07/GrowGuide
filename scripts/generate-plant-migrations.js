#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ZONES = ['8a', '8b', '9a', '9b', '10a', '10b', '11a', '11b', '12a', '12b'];

const ZONE_CLIMATE_MAP = {
  '8a': 'cold', '8b': 'cold', '9a': 'cool', '9b': 'cool',
  '10a': 'temperate', '10b': 'temperate', '11a': 'warm', '11b': 'warm',
  '12a': 'tropical', '12b': 'tropical',
};

function getAdjustmentKeyForClimate(climate) {
  if (climate === 'cold') return 'cool';
  if (climate === 'tropical') return 'warm';
  return climate;
}

function escapeSql(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

function toSqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return `'${escapeSql(value)}'`;
  
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object') {
      return `'${escapeSql(JSON.stringify(value))}'::jsonb`;
    } else {
      const elements = value.map(v => (typeof v === 'string') ? `'${escapeSql(v)}'` : v);
      return `ARRAY[${elements.join(', ')}]::TEXT[]`;
    }
  }
  
  if (typeof value === 'object') {
    return `'${escapeSql(JSON.stringify(value))}'::jsonb`;
  }
  return 'NULL';
}

function generateInsert(plantName, zone, plantData) {
  const climate = ZONE_CLIMATE_MAP[zone];
  const adjustmentKey = getAdjustmentKeyForClimate(climate);
  const adjustment = plantData[adjustmentKey] || plantData.temperate;

  const multiplier = adjustment?.multiplier || 1;
  const frequency = adjustment?.frequency || 3;
  const care = adjustment?.care || [];

  return `('${escapeSql(plantName)}', '${zone}', ${plantData.sowToSeedling}, ${plantData.seedlingToHarvest}, ${plantData.harvestWindow}, ${multiplier}, ${frequency}, ${toSqlLiteral(care)}, ${toSqlLiteral(plantData.keyActivities)})`;
}

function main() {
  const definitionsPath = path.join(__dirname, '../data/plants-definitions.json');

  if (!fs.existsSync(definitionsPath)) {
    console.error('Error: plants-definitions.json not found');
    process.exit(1);
  }

  const definitions = JSON.parse(fs.readFileSync(definitionsPath, 'utf-8'));
  const plants = definitions.plants;

  console.log('Generating SQL INSERT statements...');
  console.log(`Found ${plants.length} plants to migrate`);

  const lines = [
    '-- Auto-generated plant_timelines seed data',
    '-- Generated from data/plants-definitions.json',
    `-- Covers ${plants.length} plants x ${ZONES.length} zones = ${plants.length * ZONES.length} total rows`,
    '',
    'BEGIN;',
    '',
    'INSERT INTO plant_timelines (plant_name, au_hardiness_zone, sow_to_seedling, seedling_to_harvest, harvest_window, growth_multiplier, watering_frequency, extra_care, key_activities)',
    'VALUES'
  ];

  const values = [];
  for (const plant of plants) {
    for (const zone of ZONES) {
      values.push(generateInsert(plant.name, zone, plant));
    }
  }

  lines.push(values.join(',\n'));
  lines.push('ON CONFLICT (plant_name, au_hardiness_zone) DO UPDATE SET');
  lines.push('  growth_multiplier = EXCLUDED.growth_multiplier,');
  lines.push('  watering_frequency = EXCLUDED.watering_frequency,');
  lines.push('  extra_care = EXCLUDED.extra_care,');
  lines.push('  updated_at = NOW();');
  lines.push('');
  lines.push('COMMIT;');

  const sql = lines.join('\n');
  const outputPath = path.join(__dirname, '../supabase/seeds/plant_timelines_complete.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log(`Generated ${plants.length * ZONES.length} INSERT statements`);
  console.log(`Output written to: ${outputPath}`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

module.exports = { generateInsert, toSqlLiteral };
