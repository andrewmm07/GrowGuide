import { PlantDetails } from '../types/plants'

export interface PlantTimeline {
  sowToSeedling: number;
  seedlingToHarvest: number;
  harvestWindow: number;
  climateAdjustments: {
    [key in 'warm' | 'cool' | 'temperate']: {
      growthMultiplier: number;
      wateringFrequency: number;
      extraCare: string[];
    }
  };
  keyActivities: {
    timing: number;
    activity: string;
    category: 'planting' | 'fertilizing' | 'pruning' | 'pest' | 'harvest' | 'climate';
    climateSpecific?: boolean;
  }[];
}

export const PLANT_TIMELINES: { [key: string]: PlantTimeline } = {
  'Tomatoes': {
    sowToSeedling: 21,
    seedlingToHarvest: 60,
    harvestWindow: 45,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Provide afternoon shade', 'Monitor for blossom end rot']
      },
      cool: {
        growthMultiplier: 1.2,
        wateringFrequency: 4,
        extraCare: ['Use frost protection', 'Monitor night temperatures']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 7, activity: 'Monitor for seedling emergence', category: 'planting' },
      { timing: 21, activity: 'First true leaves - start fertilizing', category: 'fertilizing' },
      { timing: 28, activity: 'Begin pest monitoring', category: 'pest' },
      { timing: 35, activity: 'Install support/stakes', category: 'planting' },
      { timing: 45, activity: 'Start pruning side shoots', category: 'pruning' },
      { timing: 60, activity: 'Begin checking for ripe fruits', category: 'harvest' },
      { timing: 75, activity: 'Peak harvest period begins', category: 'harvest' }
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
      { timing: 7, activity: 'Check for germination', category: 'planting' },
      { timing: 14, activity: 'Install climbing support', category: 'planting' },
      { timing: 21, activity: 'Start fertilizing', category: 'fertilizing' },
      { timing: 30, activity: 'Monitor for bean beetles', category: 'pest' },
      { timing: 45, activity: 'Begin harvesting', category: 'harvest' },
      { timing: 60, activity: 'Peak production period', category: 'harvest' }
    ]
  },
  'Lettuce': {
    sowToSeedling: 7,
    seedlingToHarvest: 30,
    harvestWindow: 14,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1.1,
        wateringFrequency: 1,
        extraCare: ['Provide shade cloth', 'Prevent bolting']
      },
      cool: {
        growthMultiplier: 0.9,
        wateringFrequency: 3,
        extraCare: ['Protect from heavy frost']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 2,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 7, activity: 'Thin seedlings', category: 'planting' },
      { timing: 14, activity: 'Begin liquid feeding', category: 'fertilizing' },
      { timing: 21, activity: 'Check for slugs and snails', category: 'pest' },
      { timing: 30, activity: 'Start harvesting outer leaves', category: 'harvest' }
    ]
  },
  'Carrots': {
    sowToSeedling: 14,
    seedlingToHarvest: 70,
    harvestWindow: 21,
    climateAdjustments: {
      warm: {
        growthMultiplier: 1,
        wateringFrequency: 2,
        extraCare: ['Maintain consistent moisture', 'Mulch soil']
      },
      cool: {
        growthMultiplier: 1.2,
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
      { timing: 14, activity: 'Thin seedlings', category: 'planting' },
      { timing: 28, activity: 'Monitor for carrot fly', category: 'pest' },
      { timing: 42, activity: 'Begin fertilizing', category: 'fertilizing' },
      { timing: 70, activity: 'Check root size', category: 'harvest' },
      { timing: 84, activity: 'Complete harvest', category: 'harvest' }
    ]
  },
  'Peppers': {
    sowToSeedling: 28,
    seedlingToHarvest: 75,
    harvestWindow: 60,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 2,
        extraCare: ['Monitor for sunscald', 'Maintain humidity']
      },
      cool: {
        growthMultiplier: 1.3,
        wateringFrequency: 4,
        extraCare: ['Use frost protection', 'Provide extra warmth']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 3,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 21, activity: 'First true leaves appear', category: 'planting' },
      { timing: 28, activity: 'Begin fertilizing', category: 'fertilizing' },
      { timing: 42, activity: 'Transplant to final position', category: 'planting' },
      { timing: 56, activity: 'Install support stakes', category: 'planting' },
      { timing: 70, activity: 'Monitor for aphids', category: 'pest' },
      { timing: 75, activity: 'First harvest', category: 'harvest' },
      { timing: 90, activity: 'Peak production period', category: 'harvest' }
    ]
  },
  'Cucumbers': {
    sowToSeedling: 14,
    seedlingToHarvest: 55,
    harvestWindow: 45,
    climateAdjustments: {
      warm: {
        growthMultiplier: 0.9,
        wateringFrequency: 1,
        extraCare: ['Monitor for powdery mildew', 'Maintain high humidity']
      },
      cool: {
        growthMultiplier: 1.2,
        wateringFrequency: 3,
        extraCare: ['Provide warmth', 'Protect from cold winds']
      },
      temperate: {
        growthMultiplier: 1,
        wateringFrequency: 2,
        extraCare: []
      }
    },
    keyActivities: [
      { timing: 14, activity: 'Transplant seedlings', category: 'planting' },
      { timing: 21, activity: 'Install trellis', category: 'planting' },
      { timing: 28, activity: 'Start fertilizing', category: 'fertilizing' },
      { timing: 35, activity: 'Train vines', category: 'pruning' },
      { timing: 42, activity: 'Monitor for cucumber beetles', category: 'pest' },
      { timing: 55, activity: 'Begin harvesting', category: 'harvest' },
      { timing: 70, activity: 'Peak harvest period', category: 'harvest' }
    ]
  }
}

export const PLANT_DETAILS: { [key: string]: PlantDetails } = {
  // ... your plant details data ...
} 