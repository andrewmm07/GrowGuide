/**
 * Seed script: Load plant database from plants-definitions.json to Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const ZONE_MAPPING = {
  '8a': 'cool',
  '8b': 'temperate',
  '9a': 'temperate',
  '9b': 'warm',
  '10a': 'warm',
  '10b': 'warm',
  '11a': 'warm',
  '12b': 'warm',
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
  const plants = plantsJson.plants;

  console.log(`Found ${plants.length} plants to seed\n`);

  let successCount = 0;
  let errorCount = 0;

  // Process each plant
  for (const plant of plants) {
    console.log(`Processing: ${plant.name}`);

    // Create records for each zone
    for (const zone of ALL_ZONES) {
      const climateType = ZONE_MAPPING[zone];
      const climateData = plant[climateType];

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

seedPlants().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
