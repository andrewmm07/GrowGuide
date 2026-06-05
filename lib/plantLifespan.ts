/** plant_timelines.plant_category values */
export type PlantCategory =
  | 'annual_vegetable'
  | 'annual_herb'
  | 'perennial_vegetable'
  | 'perennial_tree'
  | 'perennial_shrub'
  | 'perennial_vine'
  | string;

export type PlantLifespanGroup = 'annual' | 'perennial';

export const LIFESPAN_SECTION_ORDER: PlantLifespanGroup[] = ['annual', 'perennial'];

export const LIFESPAN_SECTION_LABELS: Record<PlantLifespanGroup, string> = {
  annual: 'Annual plants',
  perennial: 'Perennial plants',
};

/** Short copy under annual / perennial headers in My Garden and the plant picker. */
export const LIFESPAN_SECTION_SUMMARIES: Record<PlantLifespanGroup, string> = {
  annual:
    'Complete their life cycle in one season. Sow or plant within the calendar window for your zone so they mature before cold or extreme heat.',
  perennial:
    'Plant once. Harvest for years. Autumn or early spring are ideal for planting for most shrubs/trees.',
};

/** Visual accents for garden list sections (no extra assets). */
export const LIFESPAN_SECTION_STYLES: Record<
  PlantLifespanGroup,
  { icon: string; headerBg: string; headerBorder: string; rowAccent: string }
> = {
  annual: {
    icon: '🌱',
    headerBg: 'bg-slate-50',
    headerBorder: 'border-slate-200',
    rowAccent: 'border-l-emerald-400',
  },
  perennial: {
    icon: '🌳',
    headerBg: 'bg-slate-50',
    headerBorder: 'border-slate-200',
    rowAccent: 'border-l-slate-400',
  },
};

export function plantLifespanFromCategory(
  category: string | null | undefined
): PlantLifespanGroup | null {
  if (!category) return null;
  if (category.startsWith('annual_')) return 'annual';
  if (category.startsWith('perennial_')) return 'perennial';
  return null;
}
