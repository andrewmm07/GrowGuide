# GrowGuide Plant Database Schema

## Overview
Comprehensive Australian gardening database supporting 100+ plant varieties across 9 categories with zone-specific climate adjustments.

## Plant Data Structure

```typescript
interface PlantEntry {
  // Identity
  name: string;              // Primary plant name (e.g., "Tomato")
  commonNames: string[];     // Variants (e.g., ["Cherry Tomato", "Roma Tomato"])
  category: PlantCategory;   // fruiting | leafy | root | legume | herb_soft | herb_woody | herb_perennial | fruit_perennial | perennial_veg | edge_crop | indigenous
  
  // Timing (in days from sowing/planting)
  sowToSeedling: number;     // Days to first true leaves
  seedlingToHarvest: number; // Days from transplant to harvest start
  harvestWindow: number;     // Days of active harvest period
  
  // Growth characteristics
  hardinessInfo: {
    minTemp: number;         // Minimum viable soil temp (°F)
    maxTemp: number;         // Upper heat stress threshold (°F)
    daysToMaturity: number;  // Standard days to mature
    isPerennial: boolean;    // Lifetime expectancy
    yearsProductive: number; // For perennials: productive years (5-20)
  };
  
  // Climate zone multipliers (Australian zones 8a-12b)
  zones: {
    [zone: string]: {
      multiplier: number;     // Growth speed adjustment (0.8-1.3)
      frequency: number;      // Watering frequency (days between)
      care: string[];        // Zone-specific warnings/tips
      bestPlantMonth: number; // 1-12, optimal planting window start
      daysToMaturityAdjusted: number; // Calculated at query time
    };
  };
  
  // Timeline activities
  keyActivities: Activity[];
  
  // Companion/conflict info (optional expansion)
  companionPlants?: string[];
  conflictPlants?: string[];
}

interface Activity {
  timing: number;            // Days since sow/plant
  activity: string;         // Action name
  details: string;          // Practical, specific guidance (300-500 chars)
  category: 'planting' | 'fertilizing' | 'pest' | 'pruning' | 'harvest' | 'watering' | 'thinning' | 'training';
  
  // Optional: frequency for recurring activities
  frequency?: {
    startDay: number;
    repeatEveryDays: number;
    endDay: number;
  };
}

type PlantCategory = 
  | 'fruiting'        // Fruiting vegetables
  | 'leafy'           // Leafy greens
  | 'root'            // Root vegetables
  | 'legume'          // Beans, peas, lentils
  | 'herb_soft'       // Basil, parsley, dill (seasonal)
  | 'herb_woody'      // Rosemary, thyme, sage (perennial)
  | 'herb_perennial'  // Mint, lemon balm, tarragon
  | 'fruit'           // Fruit trees/perennials
  | 'perennial_veg'   // Asparagus, rhubarb, artichoke
  | 'edge_crop'       // Fennel, celery, kohlrabi
  | 'indigenous'      // Warrigal greens, finger lime, etc.
```

## Climate Behavior Rules

### Growth Multiplier Logic
```
adjustedDays = baseDays * zoneMultiplier

Warm zones (9b-12b, <300m altitude):
  - Tomato/Pepper: 0.85-0.95 (faster, more pest pressure)
  - Cool-season crops: 1.1-1.3 (struggle, need shade)
  - Perennials: 0.9-1.0 (extended season)

Temperate zones (8b-9a, 300-600m):
  - Most crops: 1.0 (baseline)
  - Optimal for most varieties

Cool zones (8a, >600m):
  - Heat-lovers: 1.2-1.4 (slower establishment)
  - Cold-tolerant crops: 0.9-1.0 (thrive)
  - Frost risk extends season
```

### Watering Frequency Strategy
```
Frequency values represent "water every N days" in that climate:
  1-2: Frequent (daily/every 2 days) - seedlings, leafy greens, fruiting at peak
  3-4: Regular (every 3-4 days) - established plants, temperate season
  5-7: Moderate (weekly) - established perennials, drought-tolerant, winter
  
Adjusted per zone:
  - Warm/dry: Lower frequency (3→2, 4→3)
  - Cool/wet: Higher frequency (2→3, 3→4)
  - Mulch reduces by 1 day consistently
```

### Pest/Disease Pressure by Zone
```
Warm zones (>25°C average):
  - Increased: Whitefly, spider mites, powdery mildew, bacterial wilt
  - Decreased: Frost damage, slugs (if dry)
  
Cool zones (<15°C average):
  - Increased: Slugs, snails, fungal diseases (dampness), frost damage
  - Decreased: Insect pests (slower reproduction)
  
Temperate:
  - Moderate pressure across all categories
  - Seasonal variation is primary driver
```

## Data Organization

### File Structure
```
/data/
  plants-definitions.json    # Master plant database (this file)
  schema.md                  # This schema (reference)
  climate-zones.json         # AU hardiness zones, climate data
  planting-calendar.json     # Month-to-zone-to-plants mapping
```

### JSON Organization Pattern
```json
{
  "plants": [
    {
      "name": "Tomato",
      "commonNames": ["Cherry Tomato", "Roma Tomato", "Heirloom Tomato"],
      "category": "fruiting",
      "sowToSeedling": 21,
      "seedlingToHarvest": 60,
      "harvestWindow": 45,
      "hardinessInfo": {
        "minTemp": 70,
        "maxTemp": 95,
        "daysToMaturity": 81,
        "isPerennial": false
      },
      "zones": {
        "9a": {
          "multiplier": 1.0,
          "frequency": 3,
          "care": ["..."],
          "bestPlantMonth": 9
        },
        ...
      },
      "keyActivities": [...]
    },
    ...
  ]
}
```

## Expansion Roadmap

### Phase 1: Foundation (Current)
- 30 core plants with detailed activities
- 2-3 zones tested (9a temperate, 10a warm, 8a cool)

### Phase 2: Comprehensive Coverage
- Expand to 100+ plant varieties (12 per category minimum)
- Complete all 8 Australian hardiness zones (8a through 12b)
- Add companion/conflict data

### Phase 3: Intelligence Layer
- Seasonal planting calendar generation
- Intercropping recommendations
- Succession planting automation
- Pest/disease warnings by zone

### Phase 4: User Customization
- Custom varieties (user-submitted timelines)
- Microclimate adjustments (aspect, shade, wind)
- Soil amendment tracking
- Yield predictions

## Activity Detail Standards

Every activity must include:
1. **Specific measurements** (inches, tablespoons, degrees, etc.)
2. **Timing context** (morning vs afternoon, frequency, duration)
3. **Step-by-step technique** (how to actually do it)
4. **Why it matters** (what goes wrong if skipped)
5. **Alternatives** (other approaches if first unavailable)
6. **Warnings** (what to avoid, red flags)

### Example Standard
```
BAD: "Monitor for growth"
GOOD: "When seedlings have 2-3 true leaves, thin to 3-4 inches apart. 
       Cut seedlings at soil level—pulling disturbs roots of remaining plants. 
       Proper spacing ensures bulb development and prevents crowding, which 
       produces tiny onions. Water after thinning. This step cannot be skipped."
```

## Validation Rules

- Every plant: 6+ activities minimum (short crops), 8+ (long crops)
- Every activity: 150+ characters of detail
- Every zone: Multiplier between 0.75-1.5
- Every harvest activity: Specific size/ripeness indicators
- Every pest activity: Identification method + 2+ control options

---

Last updated: 2026-05-20
Current coverage: 30 plants | Target: 100+ plants across 8 zones
