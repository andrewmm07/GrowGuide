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

/** Visual accents for garden list sections (no extra assets). */
export const LIFESPAN_SECTION_STYLES: Record<
  PlantLifespanGroup,
  { icon: string; headerBg: string; headerBorder: string; rowAccent: string }
> = {
  annual: {
    icon: '🌱',
    headerBg: 'bg-emerald-50',
    headerBorder: 'border-emerald-200',
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
