import {
  LIFESPAN_SECTION_SUMMARIES,
  plantLifespanFromCategory,
} from '@/lib/plantLifespan'

/** Summary text shown below the perennial section title in My Garden (list + picker). */
export const PERENNIAL_SECTION_SUMMARY = LIFESPAN_SECTION_SUMMARIES.perennial

/** Summary text shown below the annual section title in My Garden (list + picker). */
export const ANNUAL_SECTION_SUMMARY = LIFESPAN_SECTION_SUMMARIES.annual

/** @deprecated Use PERENNIAL_SECTION_SUMMARY */
export const PERENNIAL_SECTION_HEADER = PERENNIAL_SECTION_SUMMARY

/** @deprecated Use LIFESPAN_SECTION_LABELS.perennial */
export const PERENNIAL_PICKER_SECTION_TITLE = PERENNIAL_SECTION_SUMMARY

export const PERENNIAL_PICKER_SECTION_SUBTITLE = ''

/** Row / badge tooltip — clarifies that "not advised" is not "do not plant". */
export const PERENNIAL_PLANTING_TOOLTIP =
  'Perennial — plant once, harvest for years. There are better and quieter windows (often autumn or early spring for trees); this calendar tracks annual sow/plant cycles, not every perennial planting date.'

export const PERENNIAL_TIMING_INSIGHT =
  'No single fortnight applies like annual veg. Choose a variety suited to your climate and plant when the soil is workable and frost risk is low — often autumn or early spring.'

export const PERENNIAL_TIMING_WARNING =
  'Perennial crop — timing is flexible. Autumn and early spring are common planting windows; avoid extreme heat or hard frost when establishing new stock.'

export function isPerennialPlantCategory(
  plantCategory: string | null | undefined
): boolean {
  return plantLifespanFromCategory(plantCategory) === 'perennial'
}
