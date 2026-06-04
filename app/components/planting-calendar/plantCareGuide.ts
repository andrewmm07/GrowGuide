import type { PlantDetails } from '@/app/types/plants'

/** Generic copy-paste tasks that add no plant-specific value. */
const BOILERPLATE_TASKS = new Set([
  'Prepare soil',
  'Prepare rich soil',
  'Sow seeds thinly',
  'Water gently',
  'Check for emergence and mulch',
  'Monitor soil moisture',
  'Remove any weeds',
  'Check for pest damage',
  'Remove flower stalks (scapes)',
  'Continue weeding',
  'Maintain consistent moisture',
  'Watch for yellowing leaves',
  'Thin seedlings',
  'Keep soil moist',
  'Remove weeds',
  'Harvest when ready',
  'Check for mature pods',
  'Harvest when tops fall over',
  'Cure in dry, well-ventilated area',
  'Check for mature cucumbers',
  'Check for mature ears',
  'Check for mature peppers',
  'Check for mature eggplants',
  'Check for mature carrots',
  'Check for mature beans',
  'Pick when fully colored',
  'Check daily',
  'Remove any diseased fruit',
  'Install support structure',
  'Plant deeply',
  'Tie to supports',
  'Feed regularly',
  'Remove side shoots',
])

const STAGE_META: Record<
  'planting' | 'growing' | 'harvesting',
  { title: string; subtitle: string }
> = {
  planting: {
    title: 'Getting started',
    subtitle: 'Establishment — first few weeks after sowing or planting out',
  },
  growing: {
    title: 'While growing',
    subtitle: 'Active growth — keep plants healthy through the season',
  },
  harvesting: {
    title: 'Harvest',
    subtitle: 'Pick at the right stage for best flavour and continued production',
  },
}

function normalise(text: string) {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

function isDistinctTask(task: string, careInstructions: string[]): boolean {
  if (BOILERPLATE_TASKS.has(task)) return false
  const n = normalise(task)
  return !careInstructions.some((c) => {
    const cn = normalise(c)
    return cn.includes(n) || n.includes(cn)
  })
}

export interface PlantCareGuide {
  plantingTime: string
  growingInfo: string
  careInstructions: string[]
  timeToHarvest: string
  maintenanceLevel: PlantDetails['maintenance']
  stages: {
    stage: 'planting' | 'growing' | 'harvesting'
    title: string
    subtitle: string
    tasks: string[]
  }[]
}

export function buildPlantCareGuide(details: PlantDetails): PlantCareGuide {
  const stages = details.maintenanceTasks
    .map((entry) => {
      const meta = STAGE_META[entry.stage]
      const tasks = entry.tasks.filter((t) => isDistinctTask(t, details.careInstructions))
      return {
        stage: entry.stage,
        title: meta.title,
        subtitle: meta.subtitle,
        tasks,
      }
    })
    .filter((s) => s.tasks.length > 0)

  return {
    plantingTime: details.plantingTime,
    growingInfo: details.growingInfo,
    careInstructions: details.careInstructions,
    timeToHarvest: details.timeToHarvest,
    maintenanceLevel: details.maintenance,
    stages,
  }
}

export function maintenanceLevelLabel(level: PlantDetails['maintenance']): string {
  switch (level) {
    case 'low':
      return 'Low effort — good for beginners'
    case 'medium':
      return 'Moderate — regular checks through the season'
    case 'high':
      return 'Hands-on — needs consistent attention'
    default:
      return level
  }
}
