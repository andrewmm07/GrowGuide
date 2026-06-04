/**
 * @deprecated Use app/context/GardenContext.tsx — schema does not match garden_plants migrations.
 * Do not import. See ARCHITECTURE_CANON.md §2.2.
 */

import { createClient } from '@supabase/supabase-js';
import { GardenPlant } from '@/app/components/GardenPlannerView';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface StoredGardenPlant {
  id: string;
  user_id: string;
  plant_name: string;
  sow_date: string | null;
  planting_method: 'seed' | 'seedling';
  harvested: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Load all garden plants for current user
 * @returns Array of garden plants
 */
export async function loadGardenPlants(userId: string): Promise<GardenPlant[]> {
  try {
    const { data, error } = await supabase
      .from('garden_plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to load garden plants: ${error.message}`);
    }

    return (data || []).map((plant: StoredGardenPlant) => ({
      id: plant.id,
      name: plant.plant_name,
      sowDate: plant.sow_date ? new Date(plant.sow_date) : undefined,
      plantingMethod: plant.planting_method,
      harvested: plant.harvested,
    }));
  } catch (error) {
    console.error('Load garden plants error:', error);
    throw error;
  }
}

/**
 * Add a new plant to user's garden
 * @param userId - Current user ID
 * @param plant - Garden plant to save
 */
export async function addGardenPlant(
  userId: string,
  plant: Omit<GardenPlant, 'schedule'>
): Promise<GardenPlant> {
  try {
    const { data, error } = await supabase
      .from('garden_plants')
      .insert([
        {
          id: plant.id,
          user_id: userId,
          plant_name: plant.name,
          sow_date: plant.sowDate?.toISOString() || null,
          planting_method: plant.plantingMethod,
          harvested: plant.harvested || false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add plant: ${error.message}`);
    }

    return {
      id: data.id,
      name: data.plant_name,
      sowDate: data.sow_date ? new Date(data.sow_date) : undefined,
      plantingMethod: data.planting_method,
      harvested: data.harvested,
    };
  } catch (error) {
    console.error('Add garden plant error:', error);
    throw error;
  }
}

/**
 * Update an existing garden plant
 * @param plantId - ID of plant to update
 * @param updates - Fields to update
 */
export async function updateGardenPlant(
  plantId: string,
  updates: Partial<{
    sow_date: Date | null;
    planting_method: 'seed' | 'seedling';
    harvested: boolean;
  }>
): Promise<void> {
  try {
    const updateData: any = {};
    if (updates.sow_date !== undefined) {
      updateData.sow_date = updates.sow_date?.toISOString() || null;
    }
    if (updates.planting_method !== undefined) {
      updateData.planting_method = updates.planting_method;
    }
    if (updates.harvested !== undefined) {
      updateData.harvested = updates.harvested;
    }

    const { error } = await supabase
      .from('garden_plants')
      .update(updateData)
      .eq('id', plantId);

    if (error) {
      throw new Error(`Failed to update plant: ${error.message}`);
    }
  } catch (error) {
    console.error('Update garden plant error:', error);
    throw error;
  }
}

/**
 * Remove a plant from user's garden
 * @param plantId - ID of plant to delete
 */
export async function removeGardenPlant(plantId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('garden_plants')
      .delete()
      .eq('id', plantId);

    if (error) {
      throw new Error(`Failed to remove plant: ${error.message}`);
    }
  } catch (error) {
    console.error('Remove garden plant error:', error);
    throw error;
  }
}
