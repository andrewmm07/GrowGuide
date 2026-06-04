/**
 * Seed script: Load plant database from plants-definitions.json to Supabase
 *
 * Transforms the local JSON format (warm/cool/temperate) into zone-specific records
 * for Australian hardiness zones 8a through 12b
 *
 * Usage: npx ts-node scripts/seed-plants-to-supabase.ts
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface PlantDefinition {
  name: string;
  sowToSeedling: number;
  seedlingToHarvest: number;
  harvestWindow: number;
  warm: { multiplier: number; frequency: number; care: string[] };
  cool: { multiplier: number; frequency: number; care: string[] };
  temperate: { multiplier: number; frequency: number; care: string[] };
  keyActivities: Array<{
    timing: number;
    activity: string;
    details: string;
    category: string;
  }>;
}

// Zone mapping: zone -> { climateType, multiplierFallback }
const ZONE_MAPPING: Record<string, { climateType: 'cool' | 'temperate' | 'warm'; fallbackMultiplier?: number }> = {
  '8a': { climateType: 'cool' },        // Coldest, cool-season
  '8b': { climateType: 'temperate' },   // Temperate/cool boundary
  '9a': { climateType: 'temperate' },   // Temperate core
  '9b': { climateType: 'warm' },        // Temperate/warm boundary
  '10a': { climateType: 'warm' },       // Warm
  '10b': { climateType: 'warm' },       // Warm
  '11a': { climateType: 'warm' },       // Very warm
  '12b': { climateType: 'warm' },       // Tropical
};

const ALL_ZONES = ['8a', '8b', '9a', '9b', '10a', '10b', '11a', '12b'];

async function seedPlants() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('ERROR: Missing Supabase environment variables');
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read plant definitions
  const plantsPath = path.join(process.cwd(), 'data', 'plants-definitions.json');
  console.log(`Reading plants from: ${plantsPath}`);

  if (!fs.existsSync(plantsPath)) {
    console.error(`ERROR: Plants file not found at ${plantsPath}`);
    process.exit(1);
  }

  const plantsJson = JSON.parse(fs.readFileSync(plantsPath, 'utf-8'));
  const plants: PlantDefinition[] = plantsJson.plants;

  console.log(`Found ${plants.length} plants to seed\n`);

  let successCount = 0;
  let errorCount = 0;

  // Process each plant
  for (const plant of plants) {
    console.log(`Processing: ${plant.name}`);

    // Create records for each zone
    for (const zone of ALL_ZONES) {
      const zoneMapping = ZONE_MAPPING[zone];
      const climateData = plant[zoneMapping.climateType];

      const record = {
        plant_name: plant.name,
        au_hardiness_zone: zone,
        sow_to_seedling: plant.sowToSeedling,
        seedling_to_harvest: plant.seedlingToHarvest,
        harvest_window: plant.harvestWindow,
        growth_multiplier: climateData.multiplier,
        watering_frequency: climateData.frequency,
        extra_care: climateData.care,
        key_activities: plant.keyActivities,
      };

      try {
        const { error } = await supabase
          .from('plant_timelines')
          .insert([record]);

        if (error) {
          // If record exists, update instead
          if (error.code === '23505') { // Unique constraint violation
            const { error: updateError } = await supabase
              .from('plant_timelines')
              .update(record)
              .eq('plant_name', plant.name)
              .eq('au_hardiness_zone', zone);

            if (updateError) {
              console.error(`  [${zone}] UPDATE ERROR:`, updateError.message);
              errorCount++;
            } else {
              console.log(`  [${zone}] ✓ Updated`);
              successCount++;
            }
          } else {
            console.error(`  [${zone}] INSERT ERROR:`, error.message);
            errorCount++;
          }
        } else {
          console.log(`  [${zone}] ✓ Inserted`);
          successCount++;
        }
      } catch (err) {
        console.error(`  [${zone}] EXCEPTION:`, err);
        errorCount++;
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SEED COMPLETE`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total records processed: ${plants.length * ALL_ZONES.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`${'='.repeat(60)}\n`);

  if (errorCount > 0) {
    process.exit(1);
  }
}

// Run the seed
seedPlants().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
