import type { MonthPlantingGuide, PlantingMonth } from '@/lib/planting/types'
import { PLANTING_BY_CLIMATE, type PlantingClimateKey } from '@/lib/planting/plantingByClimate'
import type { PlantingProfileKey } from '@/lib/planting/plantingProfiles'
import { plantingProfileBaseKey } from '@/lib/planting/plantingProfiles'

/**
 * Per-profile overrides (only months that differ from the base climate matrix).
 *
 * Merge semantics (per column, not per month):
 * - `sow: []` or `plant: []` in an override → keep that column from the base matrix.
 * - Non-empty `sow` or `plant` → replace that column entirely (not append, not delta/remove).
 * To change only plant, set `sow: []` in the override. To clear a column you must list the full
 * intended column in the override (non-empty); empty means "no change".
 */
export const PLANTING_PROFILE_OVERRIDES: Partial<
  Record<PlantingProfileKey, Partial<Record<PlantingMonth, MonthPlantingGuide>>>
> = {
  'cool:coastal': {
    September: {
      sow: [
        'Peas',
        'Early Carrots',
        'Beetroot',
        'Lettuce',
        'Spring Onions',
        'Parsnips',
        'Broccoli',
        'Cauliflower',
        'Brussels Sprouts',
        'Tomatoes (indoors)',
        'Beans',
      ],
      plant: ['Early Potatoes', 'Onions', 'Potatoes', 'Tomatoes (protected)'],
    },
    October: {
      sow: [
        'Beans',
        'Carrots',
        'Beetroot',
        'Lettuce',
        'Peas',
        'Zucchini',
        'Pumpkin',
        'Kohlrabi',
        'Kale',
        'Sweet Corn',
      ],
      plant: [
        'Tomatoes',
        'Potatoes',
        'Broccoli',
        'Cauliflower',
        'Brussels Sprouts',
        'Celery',
        'Capsicum (protected)',
        'Sweet Potato',
      ],
    },
    November: {
      sow: ['Basil', 'Okra'],
      plant: [
        'Tomatoes',
        'Zucchini',
        'Pumpkin',
        'Capsicum (protected)',
        'Leeks',
        'Brussels Sprouts',
        'Cucumbers',
        'Basil',
        'Okra',
      ],
    },
    March: {
      sow: [
        'Peas',
        'Sugar Snap Peas',
        'Snow Peas',
        'Broad Beans',
        'English Spinach',
        'Asian Greens',
        'Spring Onions',
        'Swede',
        'Turnip',
        'Carrots',
        'Beetroot',
        'Lettuce',
        'Broccoli',
        'Cauliflower',
      ],
      plant: ['Broccoli', 'Cauliflower', 'Kale'],
    },
    April: {
      sow: [
        'Broad Beans',
        'Peas',
        'Sugar Snap Peas',
        'Snow Peas',
        'English Spinach',
        'Asian Greens',
        'Radish',
        'Lettuce',
        'Carrots',
        'Beetroot',
        'Spring Onions',
      ],
      plant: ['Garlic', 'Shallots', 'Onions', 'Broccoli', 'Cauliflower', 'Kale'],
    },
    May: {
      sow: ['Broad Beans', 'English Spinach', 'Asian Greens'],
      plant: ['Garlic', 'Shallots', 'Kale', 'Leeks'],
    },
    June: {
      sow: ['Broad Beans', 'Peas'],
      plant: ['Garlic', 'Rhubarb'],
    },
  },
  'cool:highland': {
    September: {
      sow: ['Peas', 'Early Carrots', 'Beetroot', 'Lettuce', 'Spring Onions', 'Parsnips'],
      plant: ['Early Potatoes', 'Onions'],
    },
    October: {
      sow: [
        'Carrots',
        'Beetroot',
        'Lettuce',
        'Peas',
        'Kohlrabi',
        'Kale',
        'Broccoli',
        'Cauliflower',
        'Tomatoes (indoors)',
      ],
      plant: ['Early Potatoes', 'Potatoes'],
    },
    November: {
      sow: ['Beans', 'Carrots', 'Beetroot', 'Lettuce', 'Zucchini', 'Radish', 'Basil'],
      plant: [
        'Tomatoes (protected)',
        'Broccoli',
        'Cauliflower',
        'Brussels Sprouts',
        'Leeks',
        'Capsicum (protected)',
        'Basil',
      ],
    },
    December: {
      sow: ['Beans', 'Carrots', 'Lettuce', 'Beetroot', 'Spring Onions', 'Radish', 'Zucchini', 'Basil'],
      plant: ['Tomatoes (protected)', 'Zucchini', 'Leeks', 'Celery', 'Basil'],
    },
    March: {
      sow: ['Peas', 'Broad Beans', 'English Spinach', 'Asian Greens', 'Spring Onions'],
      plant: ['Cabbage', 'Winter Cabbage', 'Brassicas'],
    },
    April: {
      sow: ['English Spinach', 'Spring Onions'],
      plant: ['Garlic', 'Shallots', 'Onions'],
    },
  },
  'cold:highland': {
    September: {
      sow: ['Peas', 'Early Carrots', 'Lettuce', 'Spring Onions', 'Parsnips', 'Broccoli', 'Cauliflower'],
      plant: ['Early Potatoes', 'Onions'],
    },
    October: {
      sow: [
        'Carrots',
        'Beetroot',
        'Lettuce',
        'Peas',
        'Kohlrabi',
        'Kale',
        'Broccoli',
        'Cauliflower',
        'Tomatoes (indoors)',
      ],
      plant: ['Early Potatoes', 'Potatoes'],
    },
    November: {
      sow: ['Beans', 'Carrots', 'Beetroot', 'Lettuce', 'Radish', 'Basil'],
      plant: [
        'Tomatoes (protected)',
        'Broccoli',
        'Cauliflower',
        'Leeks',
        'Capsicum (protected)',
        'Basil',
      ],
    },
    December: {
      sow: ['Beans', 'Carrots', 'Lettuce', 'Beetroot', 'Spring Onions', 'Radish', 'Basil'],
      plant: ['Tomatoes (protected)', 'Leeks', 'Basil'],
    },
    March: {
      sow: ['Broad Beans', 'English Spinach', 'Asian Greens', 'Spring Onions', 'Peas'],
      plant: ['Cabbage', 'Winter Cabbage'],
    },
    April: {
      sow: ['English Spinach', 'Spring Onions'],
      plant: ['Garlic', 'Shallots', 'Onions'],
    },
  },
  'temperate:inland': {
    August: {
      sow: ['Tomatoes (indoors)', 'Peas', 'Lettuce', 'Carrots', 'Spring Onions', 'Parsnips', 'Onions', 'Beans'],
      plant: ['Potatoes', 'Asparagus', 'Rhubarb'],
    },
    September: {
      sow: [
        'Tomatoes',
        'Beans',
        'Carrots',
        'Beetroot',
        'Lettuce',
        'Peas',
        'Zucchini',
        'Sweet Corn',
        'Cucumbers',
        'Broccoli',
        'Cauliflower',
      ],
      plant: ['Tomatoes', 'Potatoes', 'Onions', 'Broccoli', 'Cauliflower'],
    },
    October: {
      sow: ['Beans', 'Sweet Corn', 'Cucumbers', 'Zucchini', 'Pumpkin', 'Carrots', 'Beetroot', 'Lettuce'],
      plant: ['Tomatoes', 'Capsicum', 'Eggplant', 'Zucchini', 'Cucumbers', 'Potatoes'],
    },
    November: {
      sow: ['Beans', 'Sweet Corn', 'Cucumbers', 'Zucchini', 'Pumpkin', 'Lettuce', 'Beetroot'],
      plant: ['Tomatoes', 'Capsicum', 'Eggplant', 'Zucchini', 'Cucumbers', 'Sweet Corn'],
    },
    January: {
      sow: ['Beans', 'Sweet Corn', 'Cucumbers', 'Zucchini', 'Lettuce', 'Spring Onions'],
      plant: ['Tomatoes', 'Capsicum', 'Eggplant', 'Cucumbers', 'Sweet Corn', 'Zucchini'],
    },
    February: {
      sow: ['Beans', 'Carrots', 'Beetroot', 'Asian Greens', 'Lettuce', 'Spring Onions', 'Pumpkin'],
      plant: ['Capsicum', 'Eggplant', 'Silverbeet'],
    },
  },
  'tropical:wet_dry': {
    November: {
      sow: ['Beans', 'Asian Greens', 'Sweet Corn', 'Spring Onions', 'Cucumbers', 'Basil', 'Okra'],
      plant: ['Sweet Potato', 'Silverbeet', 'Basil', 'Okra'],
    },
    December: {
      sow: ['Beans', 'Asian Greens', 'Spring Onions', 'Sweet Corn', 'Basil', 'Okra'],
      plant: ['Sweet Potato', 'Silverbeet', 'Basil', 'Okra'],
    },
    January: {
      sow: ['Beans', 'Asian Greens', 'Silverbeet', 'Sweet Corn', 'Spring Onions', 'Basil'],
      plant: ['Sweet Potato', 'Silverbeet', 'Basil'],
    },
    February: {
      sow: ['Beans', 'Asian Greens', 'Spring Onions', 'Sweet Corn', 'Basil'],
      plant: ['Sweet Potato', 'Silverbeet', 'Basil'],
    },
    March: {
      sow: ['Beans', 'Asian Greens', 'Lettuce', 'Tomatoes', 'Capsicum', 'Basil', 'Okra', 'Spring Onions'],
      plant: ['Eggplant', 'Sweet Potato', 'Basil', 'Okra'],
    },
    April: {
      sow: ['Tomatoes', 'Capsicum', 'Eggplant', 'Asian Greens', 'Lettuce', 'Carrots', 'Beans', 'Basil', 'Okra'],
      plant: ['Eggplant', 'Sweet Potato', 'Tomatoes', 'Basil', 'Okra'],
    },
    May: {
      sow: [
        'Carrots',
        'Beetroot',
        'Asian Greens',
        'Lettuce',
        'Beans',
        'Radish',
        'Spring Onions',
        'Tomatoes',
        'Basil',
        'Okra',
      ],
      plant: ['Tomatoes', 'Capsicum', 'Eggplant', 'Basil', 'Okra'],
    },
    June: {
      sow: ['Carrots', 'Beetroot', 'Peas', 'Asian Greens', 'Lettuce', 'Beans', 'Sweet Corn', 'Cucumbers'],
      plant: ['Tomatoes', 'Capsicum', 'Brassicas'],
    },
    July: {
      sow: ['Carrots', 'Beetroot', 'Beans', 'Sweet Corn', 'Asian Greens', 'Lettuce', 'Pumpkin', 'Cucumbers'],
      plant: ['Tomatoes', 'Capsicum', 'Sweet Potato', 'Eggplant'],
    },
    August: {
      sow: ['Beans', 'Sweet Corn', 'Asian Greens', 'Lettuce', 'Pumpkin', 'Cucumbers', 'Spring Onions'],
      plant: ['Sweet Potato', 'Tomatoes', 'Capsicum'],
    },
    September: {
      sow: ['Beans', 'Sweet Corn', 'Cucumbers', 'Pumpkin', 'Asian Greens', 'Lettuce'],
      plant: ['Sweet Potato', 'Eggplant', 'Cucumbers'],
    },
    October: {
      sow: ['Beans', 'Asian Greens', 'Sweet Corn', 'Cucumbers', 'Pumpkin', 'Spring Onions', 'Basil', 'Okra'],
      plant: ['Sweet Potato', 'Silverbeet', 'Capsicum', 'Basil', 'Okra'],
    },
  },
}

function mergeMonthGuide(
  base: MonthPlantingGuide,
  override?: MonthPlantingGuide
): MonthPlantingGuide {
  if (!override) return { sow: [...base.sow], plant: [...base.plant] }
  return {
    sow: override.sow.length > 0 ? [...override.sow] : [...base.sow],
    plant: override.plant.length > 0 ? [...override.plant] : [...base.plant],
  }
}

/** Month sow/plant for a planting profile (base matrix + optional variant override). */
export function getPlantingGuideForProfile(
  profile: PlantingProfileKey,
  month: PlantingMonth
): MonthPlantingGuide {
  const baseKey = plantingProfileBaseKey(profile) as PlantingClimateKey
  const baseMonth = PLANTING_BY_CLIMATE[baseKey][month] ?? { sow: [], plant: [] }
  const override = PLANTING_PROFILE_OVERRIDES[profile]?.[month]
  return mergeMonthGuide(baseMonth, override)
}
