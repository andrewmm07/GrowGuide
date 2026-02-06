'use client'

import { useState, useEffect } from 'react'

interface PlantSchedule {
  week: number;
  activity: string;
  details: string;
  completed: boolean;
  dueDate: string;
  category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate';
}

interface ClimateZone {
  type: 'warm' | 'cool' | 'temperate';
  avgFrostDate: string;
  avgLastFrostDate: string;
  rainySeason: string[];
  avgRainfall: number;
}

interface PlantGrowthFactors {
  idealTemp: {
    min: number;
    max: number;
  };
  frostTolerant: boolean;
  waterNeeds: 'low' | 'medium' | 'high';
  fertilizeFrequency: number; // days between fertilizing
  commonPests: string[];
  pruningNeeded: boolean;
}

interface PlantTimeline {
  sowToSeedling: number;
  seedlingToHarvest: number;
  harvestWindow: number; // days the plant can be harvested
  climateAdjustments: {
    [key in 'warm' | 'cool' | 'temperate']: {
      growthMultiplier: number;
      wateringFrequency: number; // days between watering
      extraCare: string[];
    }
  };
  keyActivities: {
    timing: number;
    activity: string;
    details: string;
    category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate';
    climateSpecific?: boolean;
  }[];
}

interface GardenPlant {
  name: string;
  datePlanted: string;
  type: 'seed' | 'seedling';
  location?: string;
  notes?: string;
  estimatedHarvest: string;
  schedule: PlantSchedule[];
  isHarvested?: boolean;
  harvestedDate?: string;
}

// Plant timeline data and constants (outside component)
const PLANT_TIMELINES: { [key: string]: PlantTimeline } = {
  'Tomatoes': {
    sowToSeedling: 21,
    seedlingToHarvest: 60,
    harvestWindow: 45,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9, // Grows slightly faster in warm climates
        wateringFrequency: 2,
        extraCare: ['Provide afternoon shade', 'Monitor for blossom end rot']
      },
      cool: {
        growthMultiplier: 1.2, // Grows slower in cool climates
        wateringFrequency: 4,
        extraCare: ['Use frost protection when needed', 'Monitor night temperatures']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 21, 
        activity: 'Fertilise', 
        details: 'Use balanced 5-5-5 organic fertilizer, apply 2 tablespoons per plant in a ring around the stem',
        category: 'fertilizing' 
      },
      { 
        timing: 28, 
        activity: 'Monitor for pests', 
        details: 'Check undersides of leaves for hornworms and aphids. Look for holes or spotted damage',
        category: 'pest' 
      },
      { 
        timing: 35, 
        activity: 'Install supports', 
        details: 'Place cage or 6-foot stakes 4 inches from stem base. Ensure stakes are sturdy and well-anchored',
        category: 'planting' 
      },
      { timing: 45, activity: 'Remove suckers and lower leaves', details: 'Maintain plant health', category: 'pruning' },
      { timing: 60, activity: 'Check first fruits for ripeness', details: 'Monitor for maturity', category: 'harvest' },
    ]
  },
  'Beans': {
    sowToSeedling: 7,
    seedlingToHarvest: 45,
    harvestWindow: 30,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.95,
        wateringFrequency: 2,
        extraCare: ['Mulch to retain moisture']
      },
      cool: {
        growthMultiplier: 1.1,
        wateringFrequency: 4,
        extraCare: ['Protect from late frosts']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 7, 
        activity: 'Check for germination and thin to 4 inches', 
        details: 'Remove weaker seedlings, leaving strongest plants 4-6 inches apart. Water around roots, not leaves, to prevent disease. Look for healthy first true leaves.',
        category: 'planting' 
      },
      { 
        timing: 14, 
        activity: 'Install trellis for climbing varieties', 
        details: 'Set up 6-8 foot trellis or poles. For pole beans, install supports at 45-degree angle. Ensure supports are sturdy and well-anchored.',
        category: 'planting' 
      },
      { 
        timing: 21, 
        activity: 'Apply nitrogen-rich fertilizer', 
        details: 'Use low-nitrogen organic fertilizer (5-10-10) as beans fix their own nitrogen. Apply 2-3 inches from stem base, water thoroughly after application.',
        category: 'fertilizing' 
      },
      { 
        timing: 30, 
        activity: 'Check for bean beetles and rust', 
        details: 'Look for yellow-brown spots on leaves (rust) and chewed holes (beetles). Check leaf undersides for clusters of yellow eggs. Remove affected leaves.',
        category: 'pest' 
      },
      { 
        timing: 45, 
        activity: 'Begin harvesting young pods', 
        details: 'Harvest when pods are firm, crisp, and before seeds bulge. Pick regularly to encourage production. Pods should snap easily when bent.',
        category: 'harvest' 
      },
      { 
        timing: 60, 
        activity: 'Regular pod harvesting', 
        details: 'Continue harvesting every 2-3 days. Pick all mature pods to prevent tough beans and maintain plant production. Keep plants well-watered during harvest.',
        category: 'harvest' 
      }
    ]
  },
  'Broccoli': {
    sowToSeedling: 14,
    seedlingToHarvest: 70,
    harvestWindow: 14,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.1,
        wateringFrequency: 2,
        extraCare: ['Provide afternoon shade', 'Monitor for bolting']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: ['Check for cabbage worms']
      },
      temperate: {
        growthMultiplier: 1.05,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 0, 
        activity: 'Sow seeds 1/2 inch deep', 
        details: 'Plant in rich, well-draining soil with pH 6.0-6.8. Space seeds 3 inches apart in rows 24 inches apart. Keep soil consistently moist until germination.',
        category: 'planting' 
      },
      { 
        timing: 14, 
        activity: 'Thin seedlings to 18 inches apart', 
        details: 'Select strongest seedlings with dark green leaves. Cut unwanted seedlings at soil level to avoid disturbing roots. Water deeply after thinning.',
        category: 'planting' 
      },
      { 
        timing: 28, 
        activity: 'Apply calcium-rich fertilizer', 
        details: 'Use balanced fertilizer with added calcium (5-5-5 + Ca). Apply 2 tablespoons per plant in a ring 4 inches from stem. Water thoroughly after application.',
        category: 'fertilizing' 
      },
      { 
        timing: 35, 
        activity: 'Check for cabbage white butterflies', 
        details: 'Inspect leaf undersides for yellow eggs and green caterpillars. Look for holes in leaves. Consider using row covers or organic BT spray if needed.',
        category: 'pest' 
      },
      { 
        timing: 50, 
        activity: 'Remove yellowing lower leaves', 
        details: 'Cut off any yellowing or damaged leaves at the stem. Improve air circulation. Keep area around plant clear of debris to prevent disease.',
        category: 'pruning' 
      },
      { 
        timing: 65, 
        activity: 'Monitor head development', 
        details: 'Check central head size - should be 4-7 inches wide. Look for tight, compact buds. Heads should be dark green with no yellowing or flowering.',
        category: 'harvest' 
      },
      { 
        timing: 70, 
        activity: 'Harvest before florets separate', 
        details: 'Cut stem 6 inches below head when buds are tight and compact. Harvest in morning for best flavor. Leave plant for potential side shoot development.',
        category: 'harvest' 
      }
    ]
  },
  'Carrots': {
    sowToSeedling: 14,
    seedlingToHarvest: 75,
    harvestWindow: 21,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Keep soil consistently moist']
      },
      cool: {
        growthMultiplier: 1.1,
        wateringFrequency: 4,
        extraCare: ['Protect tops from frost']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 0, 
        activity: 'Sow seeds 1/4 inch deep in loose soil', 
        details: 'Prepare soil 12 inches deep, removing rocks. Space seeds 1/2 inch apart in rows 12-18 inches apart. Soil must be loose and fine. Water gently with fine spray.',
        category: 'planting' 
      },
      { 
        timing: 14, 
        activity: 'Thin seedlings to 2 inches apart', 
        details: 'When seedlings are 2 inches tall, thin to 2 inches apart. Cut tops rather than pulling to avoid disturbing neighboring roots. Water after thinning.',
        category: 'planting' 
      },
      { 
        timing: 21, 
        activity: 'Apply light balanced fertilizer', 
        details: 'Use low-nitrogen fertilizer (5-10-10). Apply 1 tablespoon per 10 feet of row, 3 inches from plants. Too much nitrogen causes forking.',
        category: 'fertilizing' 
      },
      { 
        timing: 30, 
        activity: 'Monitor for carrot rust flies', 
        details: 'Look for wilting, reddish-purple leaves and tunnels in roots. Consider row covers. Remove affected plants immediately to prevent spread.',
        category: 'pest' 
      },
      { 
        timing: 45, 
        activity: 'Check root size by brushing away soil', 
        details: 'Gently brush soil from crown to check width. Ideal diameter is 1/2 to 3/4 inch at shoulder. Keep shoulders covered to prevent greening.',
        category: 'harvest' 
      },
      { 
        timing: 60, 
        activity: 'Begin harvesting baby carrots', 
        details: 'Harvest when roots are 1/2 inch in diameter. Loosen soil before pulling. Best harvested after morning dew has dried. Water before harvesting if soil is dry.',
        category: 'harvest' 
      },
      { 
        timing: 75, 
        activity: 'Harvest full-sized carrots', 
        details: 'Pull when tops of roots are 1-1.5 inches in diameter. Twist and pull gently while holding greens close to crown. Harvest before soil freezes.',
        category: 'harvest' 
      }
    ]
  },
  'Cabbage': {
    sowToSeedling: 14,
    seedlingToHarvest: 85,
    harvestWindow: 14,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.1,
        wateringFrequency: 2,
        extraCare: ['Monitor for splitting heads']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: ['Check for frost damage']
      },
      temperate: {
        growthMultiplier: 1.05,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 0, 
        activity: 'Sow seeds 1/2 inch deep', 
        details: 'Plant in fertile soil with pH 6.0-6.8. Space seeds 2 inches apart in rows 24 inches apart. Keep soil consistently moist. Ideal soil temperature 65-75°F.',
        category: 'planting' 
      },
      { 
        timing: 14, 
        activity: 'Thin to strongest seedling per spot', 
        details: 'Select seedlings with sturdy stems and dark green leaves. Space final plants 18-24 inches apart. Cut rather than pull unwanted seedlings. Water deeply after thinning.',
        category: 'planting' 
      },
      { 
        timing: 28, 
        activity: 'Apply nitrogen-rich fertilizer', 
        details: 'Use balanced organic fertilizer (10-5-5). Apply 2 tablespoons per plant in a ring 4 inches from stem. Water thoroughly. Avoid getting fertilizer on leaves.',
        category: 'fertilizing' 
      },
      { 
        timing: 42, 
        activity: 'Check for cabbage loopers', 
        details: 'Look for small green caterpillars and holes in leaves. Check leaf undersides daily. Remove by hand or use Bt spray. Monitor for cabbage white butterflies.',
        category: 'pest' 
      },
      { 
        timing: 60, 
        activity: 'Remove yellowing outer leaves', 
        details: 'Remove any yellowed, damaged, or diseased leaves at the base. Keep area around plant clear of debris. Ensure good air circulation to prevent disease.',
        category: 'pruning' 
      },
      { 
        timing: 75, 
        activity: 'Test head firmness', 
        details: 'Gently squeeze head - should be firm and compact. Check size (6-8 inches diameter typical). Look for tight, dense head formation. Monitor daily as harvest approaches.',
        category: 'harvest' 
      },
      { 
        timing: 85, 
        activity: 'Harvest when head is firm and full-sized', 
        details: 'Cut stem at base with sharp knife. Harvest early morning for best flavor. Leave a few outer leaves attached. Store in cool place. Check remaining plants for maturity.',
        category: 'harvest' 
      }
    ]
  },
  'Lettuce': {
    sowToSeedling: 7,
    seedlingToHarvest: 45,
    harvestWindow: 14,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.2,
        wateringFrequency: 2,
        extraCare: ['Provide shade cloth', 'Monitor for bolting']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: ['Protect from hard frost']
      },
      temperate: {
        growthMultiplier: 1.1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 0, 
        activity: 'Sow seeds 1/8 inch deep', 
        details: 'Scatter seeds lightly on prepared soil, barely cover with fine soil. Space rows 12-18 inches apart. Keep soil consistently moist but not waterlogged.',
        category: 'planting' 
      },
      { 
        timing: 7, 
        activity: 'Thin seedlings to 6 inches apart', 
        details: 'Select strongest seedlings. For leaf lettuce, space 6 inches apart; for head lettuce, space 10-12 inches. Remove thinned seedlings at soil level to avoid disturbing roots.',
        category: 'planting' 
      },
      { 
        timing: 14, 
        activity: 'Fertilise', 
        details: 'Apply nitrogen-rich fertilizer (NPK 8-0-0) in a shallow furrow 3 inches from plant base. Use 1 tablespoon per 10 feet of row. Water in thoroughly.',
        category: 'fertilizing' 
      },
      { 
        timing: 21, 
        activity: 'Check for slugs and snails', 
        details: 'Inspect plants early morning or evening. Look for irregular holes in leaves and silvery slime trails. Remove debris where pests hide. Consider organic slug deterrents.',
        category: 'pest' 
      },
      { 
        timing: 30, 
        activity: 'Begin harvesting outer leaves', 
        details: 'Harvest outer leaves when 4-6 inches long. Cut leaves 1 inch above soil level to allow regrowth. Keep harvesting to prevent bolting.',
        category: 'harvest' 
      },
      { 
        timing: 40, 
        activity: 'Monitor for signs of bolting', 
        details: 'Watch for center stem elongation and bitter taste. Harvest entire plant if bolting begins. Note: Warm temperatures and long days trigger bolting.',
        category: 'pest' 
      }
    ]
  },
  'Peas': {
    sowToSeedling: 10,
    seedlingToHarvest: 60,
    harvestWindow: 21,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.2,
        wateringFrequency: 2,
        extraCare: ['Mulch roots', 'Provide afternoon shade']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: ['Check for frost damage']
      },
      temperate: {
        growthMultiplier: 1.1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 10, activity: 'Install pea supports/trellis', details: 'Support plant', category: 'planting' },
      { timing: 21, activity: 'Check for pea moths', details: 'Monitor for pests', category: 'pest' },
      { timing: 35, activity: 'Guide vines to supports', details: 'Monitor for growth', category: 'pruning' },
      { timing: 50, activity: 'Watch for first flower formation', details: 'Monitor for growth', category: 'harvest' },
      { timing: 60, activity: 'Begin harvesting pods when plump', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Peppers': {
    sowToSeedling: 21,
    seedlingToHarvest: 80,
    harvestWindow: 45,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Monitor for sunscald', 'Check moisture levels']
      },
      cool: {
        growthMultiplier: 1.3,
        wateringFrequency: 4,
        extraCare: ['Use row covers', 'Protect from cold winds']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 21, activity: 'Transplant when 4-6 leaves appear', details: 'Monitor for growth', category: 'planting' },
      { 
        timing: 28, 
        activity: 'Fertilise\nApply calcium-rich fertilizer with NPK 3-4-5', 
        details: 'Provide essential nutrients', 
        category: 'fertilizing' 
      },
      { timing: 42, activity: 'Check for aphids and mites', details: 'Monitor for pests', category: 'pest' },
      { timing: 60, activity: 'Remove early flower buds', details: 'Maintain plant health', category: 'pruning' },
      { timing: 75, activity: 'Begin harvesting when full-sized', details: 'Monitor for maturity', category: 'harvest' },
      { timing: 90, activity: 'Regular harvesting for continued production', details: 'Monitor for growth', category: 'harvest' }
    ]
  },
  'Spinach': {
    sowToSeedling: 7,
    seedlingToHarvest: 40,
    harvestWindow: 21,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.3,
        wateringFrequency: 2,
        extraCare: ['Provide shade', 'Watch for early bolting']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: ['Protect from severe frost']
      },
      temperate: {
        growthMultiplier: 1.1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 7, activity: 'Thin to 3-4 inches apart', details: 'Monitor spacing', category: 'planting' },
      { timing: 14, activity: 'Apply nitrogen-rich fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 21, activity: 'Check for leaf miners', details: 'Monitor for pests', category: 'pest' },
      { timing: 30, activity: 'Begin harvesting outer leaves', details: 'Monitor for maturity', category: 'harvest' },
      { timing: 35, activity: 'Monitor for flowering stems', details: 'Monitor for growth', category: 'pruning' }
    ]
  },
  'Zucchini': {
    sowToSeedling: 7,
    seedlingToHarvest: 50,
    harvestWindow: 60,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Monitor for powdery mildew', 'Mulch soil']
      },
      cool: {
        growthMultiplier: 1.2,
        wateringFrequency: 4,
        extraCare: ['Use row covers until flowering']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 14, activity: 'Thin to strongest 2-3 plants per mound', details: 'Monitor spacing', category: 'planting' },
      { timing: 21, activity: 'Apply balanced organic fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 35, activity: 'Monitor for squash bugs and beetles', details: 'Monitor for pests', category: 'pest' },
      { timing: 45, activity: 'Remove any yellowing leaves', details: 'Maintain plant health', category: 'pruning' },
      { timing: 50, activity: 'Begin harvesting when 6-8 inches long', details: 'Monitor for maturity', category: 'harvest' },
      { timing: 60, activity: 'Harvest regularly to encourage production', details: 'Monitor for growth', category: 'harvest' }
    ]
  },
  'Cucumber': {
    sowToSeedling: 7,
    seedlingToHarvest: 55,
    harvestWindow: 45,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Provide afternoon shade', 'Monitor for powdery mildew']
      },
      cool: {
        growthMultiplier: 1.2,
        wateringFrequency: 4,
        extraCare: ['Use row covers until warm']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 14, activity: 'Thin to 2-3 strongest plants per mound', details: 'Monitor spacing', category: 'planting' },
      { timing: 21, activity: 'Install trellis or support', details: 'Support plant', category: 'planting' },
      { timing: 28, activity: 'Guide vines to supports', details: 'Monitor for growth', category: 'pruning' },
      { timing: 35, activity: 'Monitor for cucumber beetles', details: 'Monitor for pests', category: 'pest' },
      { timing: 50, activity: 'Begin harvesting when 6-8 inches', details: 'Monitor for maturity', category: 'harvest' },
      { timing: 60, activity: 'Harvest regularly to encourage production', details: 'Monitor for growth', category: 'harvest' }
    ]
  },
  'Onions': {
    sowToSeedling: 14,
    seedlingToHarvest: 100,
    harvestWindow: 21,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.1,
        wateringFrequency: 3,
        extraCare: ['Mulch to retain moisture']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 5,
        extraCare: ['Protect from late frosts']
      },
      temperate: {
        growthMultiplier: 1.05,
        wateringFrequency: 4,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 30, activity: 'Begin nitrogen-rich fertilizer regime', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 45, activity: 'Check for onion fly damage', details: 'Monitor for pests', category: 'pest' },
      { timing: 60, activity: 'Stop fertilizing when bulbs start forming', details: 'Monitor for growth', category: 'fertilizing' },
      { timing: 90, activity: 'Check for bulb maturity', details: 'Monitor for growth', category: 'harvest' },
      { timing: 100, activity: 'Harvest when tops begin falling over', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Garlic': {
    sowToSeedling: 30,
    seedlingToHarvest: 240,
    harvestWindow: 21,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.1,
        wateringFrequency: 4,
        extraCare: ['Mulch heavily', 'Monitor soil moisture']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 7,
        extraCare: ['Protect from severe frost']
      },
      temperate: {
        growthMultiplier: 1.05,
        wateringFrequency: 5,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 30, activity: 'Check for emergence and mulch', details: 'Monitor for growth', category: 'planting' },
      { timing: 150, activity: 'Remove any flower stalks (scapes)', details: 'Maintain plant health', category: 'pruning' },
      { timing: 180, activity: 'Reduce watering as maturity approaches', details: 'Monitor for growth', category: 'pruning' },
      { timing: 210, activity: 'Monitor leaf yellowing', details: 'Monitor for health', category: 'harvest' },
      { timing: 240, activity: 'Harvest when 50% of leaves are yellow', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Radish': {
    sowToSeedling: 5,
    seedlingToHarvest: 25,
    harvestWindow: 10,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Provide partial shade', 'Keep soil cool']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: ['Monitor soil temperature']
      },
      temperate: {
        growthMultiplier: 0.95,
        wateringFrequency: 2,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 7, activity: 'Thin to 2 inches apart', details: 'Monitor spacing', category: 'planting' },
      { timing: 14, activity: 'Check for flea beetles', details: 'Monitor for pests', category: 'pest' },
      { timing: 21, activity: 'Test size by brushing soil away', details: 'Monitor for growth', category: 'harvest' },
      { timing: 25, activity: 'Harvest before becoming woody', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Kale': {
    sowToSeedling: 10,
    seedlingToHarvest: 50,
    harvestWindow: 90,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.2,
        wateringFrequency: 2,
        extraCare: ['Provide afternoon shade', 'Monitor for bolting']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: ['Protect from extreme frost']
      },
      temperate: {
        growthMultiplier: 1.1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 14, activity: 'Thin to 18 inches apart', details: 'Monitor spacing', category: 'planting' },
      { timing: 21, activity: 'Apply balanced organic fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 35, activity: 'Check for cabbage white butterflies', details: 'Monitor for pests', category: 'pest' },
      { timing: 45, activity: 'Begin harvesting outer leaves', details: 'Monitor for maturity', category: 'harvest' },
      { timing: 60, activity: 'Remove any yellowing leaves', details: 'Maintain plant health', category: 'pruning' }
    ]
  },
  'Sweet Corn': {
    sowToSeedling: 7,
    seedlingToHarvest: 75,
    harvestWindow: 14,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Monitor for corn earworm', 'Ensure good air circulation']
      },
      cool: {
        growthMultiplier: 1.2,
        wateringFrequency: 4,
        extraCare: ['Wait for soil to warm', 'Protect from late frost']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 14, activity: 'Thin to strongest plants', details: 'Monitor spacing', category: 'planting' },
      { timing: 30, activity: 'Side-dress with nitrogen fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 45, activity: 'Watch for corn borers', details: 'Monitor for pests', category: 'pest' },
      { timing: 60, activity: 'Check silk development', details: 'Monitor for growth', category: 'harvest' },
      { timing: 75, activity: 'Test kernels for milk stage', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Eggplant': {
    sowToSeedling: 21,
    seedlingToHarvest: 70,
    harvestWindow: 45,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Monitor for spider mites', 'Provide support for heavy fruits']
      },
      cool: {
        growthMultiplier: 1.3,
        wateringFrequency: 4,
        extraCare: ['Use black plastic mulch', 'Protect from cold']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 21, activity: 'Transplant when soil is warm', details: 'Monitor for growth', category: 'planting' },
      { timing: 35, activity: 'Apply calcium-rich fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 45, activity: 'Check for flea beetles', details: 'Monitor for pests', category: 'pest' },
      { timing: 60, activity: 'Support heavy branches', details: 'Support plant', category: 'pruning' },
      { timing: 70, activity: 'Harvest when skin is glossy', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Brussels Sprouts': {
    sowToSeedling: 14,
    seedlingToHarvest: 100,
    harvestWindow: 30,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.2,
        wateringFrequency: 2,
        extraCare: ['Provide afternoon shade', 'Watch for bolting']
      },
      cool: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: ['Mulch roots', 'Protect from strong winds']
      },
      temperate: {
        growthMultiplier: 1.1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 14, activity: 'Thin to 2 feet apart', details: 'Monitor spacing', category: 'planting' },
      { timing: 45, activity: 'Remove yellowing bottom leaves', details: 'Maintain plant health', category: 'pruning' },
      { timing: 60, activity: 'Top plants to focus growth', details: 'Monitor for growth', category: 'pruning' },
      { timing: 80, activity: 'Check sprout development', details: 'Monitor for growth', category: 'harvest' },
      { timing: 100, activity: 'Harvest from bottom up when firm', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Sweet Potato': {
    sowToSeedling: 21,
    seedlingToHarvest: 100,
    harvestWindow: 30,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 3,
        extraCare: ['Mulch soil', 'Monitor for vine borers']
      },
      cool: {
        growthMultiplier: 1.3,
        wateringFrequency: 5,
        extraCare: ['Use black plastic mulch', 'Protect vines from wind']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 4,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 21, activity: 'Train vines in rows', details: 'Monitor for growth', category: 'pruning' },
      { timing: 40, activity: 'Add phosphorus-rich fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
      { timing: 60, activity: 'Check for sweet potato weevils', details: 'Monitor for pests', category: 'pest' },
      { timing: 90, activity: 'Test tuber size', details: 'Monitor for growth', category: 'harvest' },
      { timing: 100, activity: 'Harvest before soil cools', details: 'Monitor for maturity', category: 'harvest' }
    ]
  },
  'Radish Sprouts': {
    sowToSeedling: 3,
    seedlingToHarvest: 10,
    harvestWindow: 5,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 1,
        extraCare: ['Keep soil consistently moist', 'Ensure good air circulation']
      },
      cool: {
        growthMultiplier: 1.1,
        wateringFrequency: 2,
        extraCare: ['Maintain room temperature']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 1,
        extraCare: []
      }
    },
    keyActivities: [
      { 
        timing: 3, 
        activity: 'Check germination\nEnsure even moisture and remove dome when sprouted', 
        details: 'Monitor for growth', 
        category: 'planting' 
      },
      { 
        timing: 5, 
        activity: 'Monitor growth\nCheck moisture twice daily, ensure good airflow to prevent mold', 
        details: 'Monitor for health', 
        category: 'pest' 
      },
      { 
        timing: 10, 
        activity: 'Begin harvest\nCut just above soil level when stems reach 2-3 inches', 
        details: 'Monitor for maturity', 
        category: 'harvest' 
      },
      { 
        timing: 13, 
        activity: 'Complete harvest\nHarvest any remaining sprouts before they become too mature', 
        details: 'Monitor for maturity', 
        category: 'harvest' 
      }
    ]
  }
}

const DEFAULT_PLANT_TIMELINE: PlantTimeline = {
  sowToSeedling: 14,
  seedlingToHarvest: 60,
  harvestWindow: 30,
  climateAdjustments: {
    warm: {
      growthMultiplier: 1,
      wateringFrequency: 2,
      extraCare: ['Monitor moisture levels']
    },
    cool: {
      growthMultiplier: 1.2,
      wateringFrequency: 4,
      extraCare: ['Protect from frost']
    },
    temperate: {
      growthMultiplier: 1,
      wateringFrequency: 3,
      extraCare: []
    }
  },
  keyActivities: [
    { timing: 14, activity: 'Check seedling spacing and thin if needed', details: 'Monitor spacing', category: 'planting' },
    { timing: 21, activity: 'Apply balanced organic fertilizer', details: 'Provide essential nutrients', category: 'fertilizing' },
    { timing: 30, activity: 'Inspect leaves for pest damage', details: 'Monitor for health', category: 'pest' },
    { timing: 45, activity: 'Remove damaged or diseased foliage', details: 'Maintain plant health', category: 'pruning' },
    { timing: 60, activity: 'Begin checking for harvest readiness', details: 'Monitor for maturity', category: 'harvest' }
  ]
}

// Get sorted plant options
const PLANT_OPTIONS = Object.keys(PLANT_TIMELINES).sort()

// Helper function (outside component)
function generatePlantSchedule(
  plantName: string, 
  plantingDate: string, 
  type: 'seed' | 'seedling',
  climate: 'warm' | 'cool' | 'temperate' = 'temperate'
): {
  schedule: PlantSchedule[];
  estimatedHarvest: string;
} {
  const timeline = PLANT_TIMELINES[plantName] || DEFAULT_PLANT_TIMELINE
  const climateData = timeline.climateAdjustments[climate]
  const startDate = new Date(plantingDate)
  
  // Adjust growing time based on climate
  const adjustedDaysToHarvest = Math.round(
    (type === 'seed' 
      ? timeline.sowToSeedling + timeline.seedlingToHarvest
      : timeline.seedlingToHarvest) * climateData.growthMultiplier
  )

  const estimatedHarvest = new Date(startDate)
  estimatedHarvest.setDate(estimatedHarvest.getDate() + adjustedDaysToHarvest)

  // Generate base schedule from key activities
  let schedule = timeline.keyActivities
    .filter(activity => {
      // Filter out early activities for seedlings
      if (type === 'seedling' && activity.timing < timeline.sowToSeedling) {
        return false;
      }
      // Remove initial planting tasks AND water-related tasks
      if (
        // Initial planting tasks
        activity.activity.toLowerCase().includes('sow seed') ||
        activity.activity.toLowerCase().includes('plant seed') ||
        activity.activity.toLowerCase().includes('seed packet') ||
        activity.activity.toLowerCase().includes('plant according') ||
        // Water-related tasks
        activity.activity === 'Water plant' ||
        activity.activity.toLowerCase().includes('water') ||
        activity.activity.toLowerCase().includes('moisture') ||
        activity.activity.toLowerCase().includes('irrigation')
      ) {
        return false;
      }
      return true;
    })
    .map(activity => {
      const adjustedTiming = Math.round(activity.timing * climateData.growthMultiplier)
      const dueDate = new Date(startDate)
      dueDate.setDate(dueDate.getDate() + adjustedTiming)
      
      return {
        week: Math.ceil(adjustedTiming / 7),
        activity: activity.activity,
        details: activity.details,
        completed: false,
        dueDate: dueDate.toISOString(),
        category: activity.category
      }
    })

  // Filter out water-related tasks from climate adjustments too
  const filteredExtraCare = climateData.extraCare.filter(care => 
    !care.toLowerCase().includes('water') && 
    !care.toLowerCase().includes('moisture') &&
    !care.toLowerCase().includes('irrigation')
  )

  // Add remaining climate-specific care tasks
  filteredExtraCare.forEach((care, index) => {
    schedule.push({
      week: Math.ceil((adjustedDaysToHarvest * 0.3 * (index + 1)) / 7),
      activity: care,
      details: `Climate-specific care for ${climate} conditions`,
      completed: false,
      dueDate: new Date(startDate.getTime() + (adjustedDaysToHarvest * 0.3 * (index + 1) * 24 * 60 * 60 * 1000)).toISOString(),
      category: 'climate'
    })
  })

  return {
    schedule,
    estimatedHarvest: estimatedHarvest.toISOString()
  }
}

// Add this helper function outside the component
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Get the Monday of the week
  const monday = new Date(date);
  monday.setDate(date.getDate() - date.getDay() + 1);
  
  return `Week of ${monday.toLocaleDateString('en-US', { 
    month: 'short',
    day: 'numeric'
  })}`;
}

// Add this helper function to get month names
function getMonthName(date: Date): string {
  return date.toLocaleString('default', { month: 'short' })
}

// First, add this new component at the top of the file
function VerticalTimeline({ plants }: { plants: GardenPlant[] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filter, setFilter] = useState<'all' | 'soon' | 'coming' | 'waiting'>('all')

  // Restore the fun stage names
  const stages = {
    soon: { name: 'So Close You Can Taste It! 😋', days: 15 },
    coming: { name: 'Coming Along Nicely 🌱', days: 60 },
    waiting: { name: 'Worth the Wait 🌿', days: Infinity }
  }

  // Sort plants by harvest date
  const sortedPlants = [...plants].sort((a, b) => 
    new Date(a.estimatedHarvest).getTime() - new Date(b.estimatedHarvest).getTime()
  )

  // Filter plants based on days until harvest
  const filteredPlants = sortedPlants.filter(plant => {
    if (filter === 'all') return true;
    
    const daysUntilHarvest = Math.ceil(
      (new Date(plant.estimatedHarvest).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    if (filter === 'soon') return daysUntilHarvest <= stages.soon.days;
    if (filter === 'coming') return daysUntilHarvest <= stages.coming.days && daysUntilHarvest > stages.soon.days;
    return daysUntilHarvest > stages.coming.days;
  });

  // Plant-specific icons mapping
  const plantIcons: { [key: string]: string } = {
    // Exact matches for your plant timeline data
    'Tomatoes': '🍅',
    'Peppers': '🫑',
    'Carrots': '🥕',
    'Beans': '🫘',
    'Lettuce': '🥬',
    'Cucumber': '🥒',
    'Sweet Corn': '🌽',
    'Garlic': '🧄',
    'Onions': '🧅',
    'Eggplant': '🍆',
    'Sweet Potato': '🍠',
    'Broccoli': '🥦',
    'Cabbage': '🥬',
    'Winter Cabbage': '🥬',
    'Peas': '🥕',
    'Spinach': '🥬',
    'English Spinach': '🥬',
    'Zucchini': '🥒',
    'Radish': '🥬',
    'Kale': '🥬',
    'Brussels Sprouts': '🥬',
    'Leeks': '🧅',
    
    // Common variations and misspellings
    'Tomato': '🍅',
    'Pepper': '🫑',
    'Carrot': '🥕',
    'Bean': '🫘',
    'Corn': '🌽',
    'Onion': '🧅',
    'Leek': '🧅',
    'Brocoli': '🥦',
    'Brocolli': '🥦',
    'Broccolli': '🥦',
    'Spring Cabbage': '🥬',
    'Summer Cabbage': '🥬',
    'Chinese Cabbage': '🥬',
    'Iceberg Lettuce': '🥬',
    'Romaine Lettuce': '🥬',
    'Butter Lettuce': '🥬',
    'Baby Spinach': '🥬'
  }

  const getPlantIcon = (plantName: string) => {
    // Try exact match first
    if (plantIcons[plantName]) {
      return plantIcons[plantName]
    }
    
    // Try case-insensitive match
    const lowerName = plantName.toLowerCase()
    const match = Object.entries(plantIcons).find(([key]) => 
      key.toLowerCase() === lowerName ||
      lowerName.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(lowerName)
    )
    
    if (match) {
      return match[1]
    }

    // Log missing icon for debugging
    console.log(`No icon found for: ${plantName}`)
    return '🌱' // Fallback icon
  }

  // Add handler for filter clicks that also expands the panel
  const handleFilterClick = (newFilter: typeof filter) => {
    setFilter(newFilter);
    setIsExpanded(true); // Expand panel when filter is clicked
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Harvest Timeline</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-green-600 hover:text-green-700"
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Expand</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
        
        {/* Instructional text under header */}
        <p className="text-sm text-gray-600">
          Click <span className="font-bold">expand</span> to see a visual timeframe of your harvests. Click the timeline buttons to filter your list.
        </p>

        {/* Update filter buttons to use new handler */}
        <div className="flex flex-wrap gap-2 text-sm">
          {['all', 'soon', 'coming', 'waiting'].map((stage) => (
            <button
              key={stage}
              onClick={() => handleFilterClick(stage as typeof filter)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                filter === stage && stage !== 'all'
                  ? 'bg-emerald-50 text-emerald-700 font-medium ring-1 ring-emerald-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {stage === 'all' ? 'All Plants 🌾' : stages[stage as keyof typeof stages].name}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {(isExpanded ? filteredPlants : filteredPlants.slice(0, 2)).map((plant, index) => {
          const daysUntilHarvest = Math.ceil(
            (new Date(plant.estimatedHarvest).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );
          
          return (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-none w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                {getPlantIcon(plant.name)}
              </div>
              <div className="flex-grow">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-medium text-gray-800">{plant.name}</h3>
                  <span className="text-sm text-gray-500">
                    {daysUntilHarvest} days until harvest
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ 
                        width: `${Math.max(0, Math.min(100, (1 - daysUntilHarvest / 90) * 100))}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {!isExpanded && filteredPlants.length > 2 && (
          <p className="text-sm text-gray-500 text-center italic">
            ... and {filteredPlants.length - 2} more plant{filteredPlants.length - 2 !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}

export default function MyGarden() {
  const [gardenPlants, setGardenPlants] = useState<GardenPlant[]>([])
  const [editingPlant, setEditingPlant] = useState<number | null>(null)
  const [inputMode, setInputMode] = useState<'manual' | 'select'>('select')
  const [newPlant, setNewPlant] = useState<Omit<GardenPlant, 'datePlanted' | 'estimatedHarvest' | 'schedule'>>({
    name: '',
    type: 'seedling', // Default to seedling
    location: '',
    notes: '',
  })

  // Add state for collapsed individual cards - initialize all as collapsed
  const [collapsedCards, setCollapsedCards] = useState<Set<number>>(new Set());
  
  // Initialize all cards as collapsed when plants are loaded
  useEffect(() => {
    if (gardenPlants.length > 0) {
      const allIndices = new Set(gardenPlants.map((_, index) => index));
      setCollapsedCards(allIndices);
    }
  }, [gardenPlants.length]);

  // Check for harvested plants
  useEffect(() => {
    const today = new Date()
    const updatedPlants = gardenPlants.map(plant => {
      const harvestDate = new Date(plant.estimatedHarvest)
      if (!plant.isHarvested && harvestDate <= today) {
        return {
          ...plant,
          isHarvested: true,
          harvestedDate: today.toISOString()
        }
      }
      return plant
    })

    if (JSON.stringify(updatedPlants) !== JSON.stringify(gardenPlants)) {
      setGardenPlants(updatedPlants)
      localStorage.setItem('myGarden', JSON.stringify(updatedPlants))
    }
  }, [gardenPlants])

  // Separate active and harvested plants
  const activePlants = gardenPlants.filter(plant => !plant.isHarvested)
  const harvestedPlants = gardenPlants.filter(plant => plant.isHarvested)

  useEffect(() => {
    const savedGarden = localStorage.getItem('myGarden')
    if (savedGarden) {
      let plants = JSON.parse(savedGarden)
      
      // Migrate existing plants to include schedules
      plants = plants.map((plant: GardenPlant) => {
        if (!plant.schedule || !plant.estimatedHarvest) {
          const { schedule, estimatedHarvest } = generatePlantSchedule(
            plant.name,
            plant.datePlanted,
            plant.type
          )
          return {
            ...plant,
            schedule,
            estimatedHarvest
          }
        }
        return plant
      })
      
      setGardenPlants(plants)
      localStorage.setItem('myGarden', JSON.stringify(plants))
    }
  }, [])

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault()
    const plantingDate = new Date().toISOString()
    // You can get the climate from user's location or a selection
    const climate: 'warm' | 'cool' | 'temperate' = 'temperate' 
    
    const { schedule, estimatedHarvest } = generatePlantSchedule(
      newPlant.name, 
      plantingDate, 
      newPlant.type,
      climate
    )
    
    const plant: GardenPlant = {
      ...newPlant,
      datePlanted: plantingDate,
      estimatedHarvest,
      schedule
    }
    
    const updatedGarden = [...gardenPlants, plant]
    setGardenPlants(updatedGarden)
    localStorage.setItem('myGarden', JSON.stringify(updatedGarden))
    
    setNewPlant({
      name: '',
      type: 'seedling',
      location: '',
      notes: '',
    })
  }

  const handleUpdatePlant = (plantToUpdate: GardenPlant, updates: Partial<GardenPlant>) => {
    const updatedGarden = gardenPlants.map((plant) => {
      if (plant.name === plantToUpdate.name && plant.datePlanted === plantToUpdate.datePlanted) {
        const updatedPlant = { ...plant, ...updates }
        
        // If planting date was updated, regenerate schedule
        if (updates.datePlanted) {
          const { schedule, estimatedHarvest } = generatePlantSchedule(
            plant.name,
            updates.datePlanted,
            plant.type
          )
          updatedPlant.schedule = schedule
          updatedPlant.estimatedHarvest = estimatedHarvest
        }
        
        return updatedPlant
      }
      return plant
    })
    
    setGardenPlants(updatedGarden)
    localStorage.setItem('myGarden', JSON.stringify(updatedGarden))
    setEditingPlant(null)
  }

  const handleRemovePlant = (plantToRemove: GardenPlant) => {
    const updatedGarden = gardenPlants.filter(
      plant => !(plant.name === plantToRemove.name && plant.datePlanted === plantToRemove.datePlanted)
    )
    setGardenPlants(updatedGarden)
    localStorage.setItem('myGarden', JSON.stringify(updatedGarden))
  }


  const handleReplant = (harvestedIndex: number) => {
    const plantToReplant = harvestedPlants[harvestedIndex]
    const newPlant: GardenPlant = {
      ...plantToReplant,
      datePlanted: new Date().toISOString(),
      isHarvested: false,
      harvestedDate: undefined,
      // Regenerate schedule and estimated harvest
      ...generatePlantSchedule(
        plantToReplant.name,
        new Date().toISOString(),
        plantToReplant.type
      )
    }

    const updatedGarden = [
      ...gardenPlants.filter((_, i) => {
        const plant = gardenPlants[i]
        return !(plant.name === plantToReplant.name && 
                 plant.datePlanted === plantToReplant.datePlanted &&
                 plant.isHarvested)
      }),
      newPlant
    ]
    
    setGardenPlants(updatedGarden)
    localStorage.setItem('myGarden', JSON.stringify(updatedGarden))
  }

  const handleTaskComplete = (plantIndex: number, taskIndex: number) => {
    // Find the actual plant using name and planting date as unique identifier
    const plant = gardenPlants.find(p => 
      p.name === sortedPlantsByHarvest[plantIndex].name && 
      p.datePlanted === sortedPlantsByHarvest[plantIndex].datePlanted
    );
    
    // Find the actual index in the original array
    const actualIndex = gardenPlants.findIndex(p => 
      p.name === sortedPlantsByHarvest[plantIndex].name && 
      p.datePlanted === sortedPlantsByHarvest[plantIndex].datePlanted
    );

    if (actualIndex !== -1 && plant?.schedule) {
      const updatedGarden = [...gardenPlants];
      const updatedSchedule = [...plant.schedule];
      updatedSchedule[taskIndex] = {
        ...updatedSchedule[taskIndex],
        completed: !updatedSchedule[taskIndex].completed
      };

      updatedGarden[actualIndex] = {
        ...plant,
        schedule: updatedSchedule
      };

      setGardenPlants(updatedGarden);
      localStorage.setItem('myGarden', JSON.stringify(updatedGarden));
    }
  };

  // Inside the MyGarden component
  const sortedPlantsByHarvest = [...gardenPlants].sort((a, b) => 
    new Date(a.estimatedHarvest).getTime() - new Date(b.estimatedHarvest).getTime()
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-green-800 mb-8">My Garden</h1>
        
        {/* Add New Planting Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add New Planting</h2>
          <form onSubmit={handleAddPlant} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Plant Name Input/Select */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-sm text-gray-600">Plant Name</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setInputMode('select')}
                      className={`px-2 py-1 text-xs rounded ${
                        inputMode === 'select' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Select
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('manual')}
                      className={`px-2 py-1 text-xs rounded ${
                        inputMode === 'manual' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>
                {inputMode === 'select' ? (
                  <select
                    value={newPlant.name}
                    onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border-gray-200"
                    required
                  >
                    <option value="">Select a plant...</option>
                    {PLANT_OPTIONS.map(plant => (
                      <option key={plant} value={plant}>{plant}</option>
                    ))}
                  </select>
                ) : (
              <input
                type="text"
                    placeholder="Enter plant name"
                value={newPlant.name}
                onChange={(e) => setNewPlant(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border-gray-200"
                required
              />
                )}
              </div>

              {/* Date Input */}
              <input
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="rounded-lg border-gray-200"
                required
              />

              {/* Plant Type Select */}
              <select
                value={newPlant.type}
                onChange={(e) => setNewPlant(prev => ({ ...prev, type: e.target.value as 'seed' | 'seedling' }))}
                className="rounded-lg border-gray-200"
                required
              >
                <option value="seedling">Seedling</option>
                <option value="seed">Seed</option>
              </select>

              {/* Add Button */}
              <button
                type="submit"
                className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
              >
                Add Planting
              </button>
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Location (optional)"
                value={newPlant.location}
                onChange={(e) => setNewPlant(prev => ({ ...prev, location: e.target.value }))}
                className="rounded-lg border-gray-200"
              />
              <input
                type="text"
                placeholder="Notes (optional)"
                value={newPlant.notes}
                onChange={(e) => setNewPlant(prev => ({ ...prev, notes: e.target.value }))}
                className="rounded-lg border-gray-200"
              />
            </div>
          </form>
        </div>

        {/* Harvest Timeline */}
        {gardenPlants.length > 0 && (
          <VerticalTimeline plants={gardenPlants} />
        )}

        {/* Current Plantings */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Current Plantings</h2>
            {/* Expand/Collapse All Cards Button */}
            {gardenPlants.length > 0 && (
              <button
                onClick={() => {
                  // Check if all cards are currently collapsed
                  const allCollapsed = collapsedCards.size === sortedPlantsByHarvest.length && sortedPlantsByHarvest.length > 0
                  
                  if (allCollapsed) {
                    // Expand all - clear the collapsed set
                    setCollapsedCards(new Set())
                  } else {
                    // Collapse all - add all indices to the collapsed set
                    const allIndices = new Set(sortedPlantsByHarvest.map((_, index) => index))
                    setCollapsedCards(allIndices)
                  }
                }}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                {collapsedCards.size === sortedPlantsByHarvest.length && sortedPlantsByHarvest.length > 0 ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Expand All
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Collapse All
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Summary text under heading */}
          <p className="text-sm text-gray-600 mb-6">
            Expand your plant cards for a detailed growing schedule and important tasks.
          </p>

          {/* Content - always visible */}
          <div>
            {gardenPlants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPlantsByHarvest.map((plant, plantIndex) => {
                    const isCardCollapsed = collapsedCards.has(plantIndex);
                    return (
                <div 
                      key={plantIndex}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative group hover:border-gray-300 transition-colors"
                >
                      {editingPlant === plantIndex ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">{plant.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          plant.type === 'seed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {plant.type}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="date"
                          defaultValue={new Date(plant.datePlanted).toISOString().split('T')[0]}
                          onChange={(e) => handleUpdatePlant(plant, { datePlanted: new Date(e.target.value).toISOString() })}
                          className="w-full rounded-md border-gray-200 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Location"
                          defaultValue={plant.location}
                          onChange={(e) => handleUpdatePlant(plant, { location: e.target.value })}
                          className="w-full rounded-md border-gray-200 text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Notes"
                          defaultValue={plant.notes}
                          onChange={(e) => handleUpdatePlant(plant, { notes: e.target.value })}
                          className="w-full rounded-md border-gray-200 text-sm"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingPlant(null)}
                          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1">
                          <button
                            onClick={() => {
                              const newCollapsed = new Set(collapsedCards);
                              if (isCardCollapsed) {
                                newCollapsed.delete(plantIndex);
                              } else {
                                newCollapsed.add(plantIndex);
                              }
                              setCollapsedCards(newCollapsed);
                            }}
                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                            title={isCardCollapsed ? 'Expand card' : 'Collapse card'}
                          >
                            {isCardCollapsed ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            )}
                          </button>
                          <h3 className="text-lg font-medium text-gray-800">{plant.name}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Action buttons */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                  onClick={() => setEditingPlant(plantIndex)}
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleRemovePlant(plant)}
                              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                          {/* Plant type badge */}
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            plant.type === 'seed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {plant.type}
                          </span>
                        </div>
                      </div>
                      {isCardCollapsed ? (
                        // Collapsed view - show only key dates
                        <div className="text-sm text-gray-600 space-y-1 mt-2">
                          <p>Planted: {new Date(plant.datePlanted).toLocaleDateString()}</p>
                          <p className="text-green-700">
                            Expected Harvest: {new Date(plant.estimatedHarvest).toLocaleDateString()}
                          </p>
                        </div>
                      ) : (
                        // Expanded view - show all details
                        <div className="text-sm text-gray-600 space-y-3">
                          <div className="space-y-1">
                            <p>Planted: {new Date(plant.datePlanted).toLocaleDateString()}</p>
                            <p className="text-green-700">
                              Expected Harvest: {new Date(plant.estimatedHarvest).toLocaleDateString()}
                            </p>
                            {plant.location && <p>Location: {plant.location}</p>}
                            {plant.notes && <p>Notes: {plant.notes}</p>}
                          </div>

                          {/* Growing Schedule */}
                          <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">Growing Schedule:</h4>
                            {plant.schedule.map((task, taskIndex) => (
                              <div 
                                key={`${plant.name}-${plant.datePlanted}-${taskIndex}`}
                                className="flex items-start gap-2 text-sm"
                              >
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => handleTaskComplete(plantIndex, taskIndex)}
                                  className="mt-1"
                                />
                                <div>
                                  <div className="flex flex-col">
                                    <p className={task.completed ? 'text-gray-400 line-through' : 'text-gray-600'}>
                                      {task.activity}
                                    </p>
                                    <span className="text-xs text-amber-600 font-medium">
                                      Around {formatDate(task.dueDate)}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {task.details}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                )})}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No plants in your garden yet. Add some using the form above.
              </p>
            )}
          </div>
        </div>

        {/* Hall of Fame Harvest */}
        {harvestedPlants.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-amber-800 mb-6">
              Hall of Fame Harvest
            </h2>
            <div className="grid gap-6">
              {harvestedPlants.map((plant, index) => (
                <div 
                  key={`${plant.name}-${plant.datePlanted}`}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {plant.name}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Planted: {new Date(plant.datePlanted).toLocaleDateString()}</p>
                        <p>Harvested: {new Date(plant.harvestedDate!).toLocaleDateString()}</p>
                        {plant.location && <p>Location: {plant.location}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                        Harvested
                      </span>
                      {/* Optional: Add button to replant */}
                      <button
                        onClick={() => handleReplant(index)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Replant"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {plant.notes && (
                    <p className="text-sm text-gray-500 mt-2">
                      Notes: {plant.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 