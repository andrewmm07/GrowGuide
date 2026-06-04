# Implementation Roadmap: GrowGuide to Weekly Operations Assistant

**Thesis:** Transform from "gardening encyclopedia" to "weekly task guide"

---

## Core Principle

Users need **one clear action per opening**, not a menu of choices.

Current UX:
1. Open app → Dashboard
2. Scroll through sections
3. Click "My Garden" → Expand plant card → Scroll tasks
4. Find today's task (if it exists)
5. Don't see why, don't see what's coming

Better UX:
1. Open app → See this week's top 3 actions
2. Tap any action → See details, mark complete
3. Done

---

## Phase 1: Fix Trust (Weeks 1-2)

This blocks everything else. Users won't engage if advice is wrong.

### 1.1: Location Detection & Zone Mapping

**Current state:**  
- Weather API hardcoded to Hobart
- Zone mapping only knows NSW/VIC
- Climate is always 'temperate'

**New state:**

**File:** `lib/locationService.ts` (create new)
```typescript
import { Geolocation } from '@capacitor/geolocation';

interface UserLocation {
  lat: number;
  lon: number;
  city: string;
  state: string;
  auHardinessZone: string; // e.g., "9a", "10b"
  climate: 'tropical' | 'warm' | 'temperate' | 'cool' | 'cold';
}

// AU Hardiness Zone Map (use proper DB, this is pseudocode)
const AU_HARDINESS_ZONES = {
  'Sydney': { zone: '10a', climate: 'warm' },
  'Brisbane': { zone: '11a', climate: 'tropical' },
  'Hobart': { zone: '9a', climate: 'cool' },
  'Melbourne': { zone: '9b', climate: 'cool' },
  'Adelaide': { zone: '10a', climate: 'warm' },
  'Perth': { zone: '10b', climate: 'warm' },
  'Darwin': { zone: '12a', climate: 'tropical' },
  // ... extend with suburb/postcode accuracy
}

export async function getUserLocation(): Promise<UserLocation> {
  // Try device location first
  try {
    const coords = await Geolocation.getCurrentPosition();
    const { city, state, zone } = await reverseGeocode(coords.lat, coords.lon);
    return {
      lat: coords.lat,
      lon: coords.lon,
      city,
      state,
      auHardinessZone: zone,
      climate: mapZoneToClimate(zone)
    };
  } catch (e) {
    // Fall back to user preference stored in profile
    return getUserStoredLocation();
  }
}

function mapZoneToClimate(zone: string): string {
  // 9a-9b → cool, 10a-10b → warm, 11a+ → tropical, etc.
  const zoneNum = parseInt(zone);
  if (zoneNum <= 9) return 'cool';
  if (zoneNum <= 11) return 'warm';
  return 'tropical';
}
```

**File:** Update `services/weatherApi.ts`
```typescript
export async function getWeatherData(userLocation: UserLocation) {
  const response = await fetch(
    `${BASE_URL}/forecast.json?key=${API_KEY}&q=${userLocation.city}&days=7&aqi=no`
  );
  // ... rest stays same
}
```

**File:** Update `ProfileForm.tsx`
```typescript
export function ProfileForm() {
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState('');
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    // Auto-detect on first load
    getUserLocation().then(loc => {
      setLocation(`${loc.city}, ${loc.state}`);
      setZone(loc.auHardinessZone);
      setAutoDetected(true);
    });
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Location</label>
        <input value={location} onChange={...} />
        <small>Auto-detected: {autoDetected ? 'Yes' : 'No'}</small>
      </div>
      <div>
        <label>Hardiness Zone (optional)</label>
        <select value={zone} onChange={...}>
          {/* List all AU zones */}
        </select>
        <small>Not sure? Leave blank, we'll auto-detect.</small>
      </div>
      <button>Save</button>
    </form>
  );
}
```

**Effort:** 1-2 weeks (includes building/licensing zone database)

---

### 1.2: Location-Aware Plant Data

**Current state:**  
Plant timelines are hardcoded in `my-garden/page.tsx`

**New state:**  
Plant timelines live in Supabase, keyed by AU zone

**File:** Database schema (Supabase)
```sql
CREATE TABLE plant_timelines (
  id UUID PRIMARY KEY,
  plant_name VARCHAR(100),
  zone_range VARCHAR(20), -- "9a-9b", "10a+", etc.
  sow_to_seedling INT, -- days
  seedling_to_harvest INT,
  harvest_window INT,
  soil_moisture_type VARCHAR(50),
  water_frequency INT, -- days between watering
  frost_sensitive BOOLEAN,
  first_frost_date DATE, -- e.g., "2024-05-15"
  last_frost_date DATE,
  key_activities JSONB, -- array of {timing, activity, instruction, ...}
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Populate with:**
```typescript
export const PLANT_DATA_BY_ZONE = {
  '9a-9b': { // Cool zones (Hobart, Melbourne)
    'Tomatoes': {
      sowToSeedling: 21,
      seedlingToHarvest: 75, // Longer in cool zone
      waterFrequency: 4,
      firstFrostDate: '2024-05-15',
      lastFrostDate: '2024-10-15',
      keyActivities: [
        {
          timing: 35,
          activity: 'Install supports',
          instruction: 'Place cage or 6-foot stakes. For cool zones, ensure south-facing if possible for extra sun.',
          whenDue: '5 weeks after planting'
        },
        // ... adjusted for zone
      ]
    }
  },
  '10a-10b': { // Warm zones (Sydney, Adelaide)
    'Tomatoes': {
      sowToSeedling: 21,
      seedlingToHarvest: 60, // Faster in warm zone
      waterFrequency: 3,
      firstFrostDate: '2024-04-15',
      lastFrostDate: '2024-11-15',
      keyActivities: [
        {
          timing: 35,
          activity: 'Install supports + provide shade',
          instruction: 'Place cage/stakes. In warm zones, afternoon shade (30-40%) prevents sunscald.',
          whenDue: '5 weeks after planting'
        },
        // ... adjusted for zone
      ]
    }
  },
  // ... etc.
}
```

**File:** Update `my-garden/page.tsx`
```typescript
async function generatePlantSchedule(
  plantName: string,
  plantingDate: string,
  type: 'seed' | 'seedling',
  userLocation: UserLocation // NEW
): Promise<{ schedule: PlantSchedule[], estimatedHarvest: string }> {
  // Fetch from DB instead of hardcoded
  const timeline = await supabase
    .from('plant_timelines')
    .select('*')
    .eq('plant_name', plantName)
    .overlaps('zone_range', [userLocation.auHardinessZone])
    .single();

  if (!timeline.data) {
    // Fall back to default, but warn user
    console.warn(`No data for ${plantName} in zone ${userLocation.auHardinessZone}`);
    return generateDefaultSchedule(...);
  }

  // Generate schedule from zone-specific data
  // ... rest of logic stays same, but uses actual data
}
```

**Effort:** 2-3 weeks (data entry + schema design + migration)

---

## Phase 2: Simplify Core Flow (Weeks 3-4)

Reduce friction, increase clarity.

### 2.1: Simplify Plant Addition

**Current state:**  
5+ fields, optional details, date picker, type selector

**New state:**
1. Choose plant (from 10-15 most common, search bar for others)
2. Tap "Add"
3. Done

**File:** New component `components/QuickAddPlant.tsx`
```typescript
export function QuickAddPlant() {
  const COMMON_PLANTS = [
    'Tomatoes', 'Lettuce', 'Capsicum', 'Beans', 'Cucumber',
    'Zucchini', 'Broccoli', 'Carrot', 'Spinach', 'Peas',
    'Basil', 'Kale', 'Radish', 'Beet', 'Pumpkin'
  ];

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filtered = COMMON_PLANTS.filter(p => 
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selected) return;
    
    setIsAdding(true);
    const { schedule, estimatedHarvest } = await generatePlantSchedule(
      selected,
      new Date().toISOString(), // Always today
      'seedling', // Default to seedling
      userLocation // Auto-detected
    );

    await contextAddPlant({
      name: selected,
      datePlanted: new Date().toISOString(),
      type: 'seedling',
      schedule,
      estimatedHarvest,
      // No location, no notes
    });

    setSelected(null);
    setSearch('');
  };

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-lg font-semibold">What did you plant?</h2>
      
      <input
        type="text"
        placeholder="Search for a plant..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg"
      />

      <div className="grid grid-cols-2 gap-2">
        {filtered.map(plant => (
          <button
            key={plant}
            onClick={() => setSelected(plant)}
            className={`p-3 rounded-lg text-sm font-medium ${
              selected === plant
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {plant}
          </button>
        ))}
      </div>

      {selected && (
        <>
          <p className="text-sm text-gray-600">
            🌱 {selected} will be ready to harvest around{' '}
            <strong>{new Date(estimatedHarvest).toLocaleDateString()}</strong>
          </p>

          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold"
          >
            {isAdding ? 'Adding...' : 'Add to Garden'}
          </button>
        </>
      )}
    </div>
  );
}
```

**Effort:** 1 week

---

### 2.2: Weekly Task Synthesis (NOT Daily)

**Current state:**  
"Today's Tasks" shows up to 6 tasks (3 custom, 3 suggested), per-plant

**New state:**  
"This Week" shows max 5 prioritized actions, batched

**File:** New component `components/ThisWeeksTasks.tsx`
```typescript
interface WeeklyTask {
  priority: 'high' | 'medium' | 'low';
  action: string; // "Water tomatoes & beans"
  plants: string[];
  whenDue: string; // "Tomorrow morning"
  timeToComplete: string; // "15 min"
  instruction: string;
  weatherContext?: string; // "Heavy rain tomorrow, skip watering"
}

export function ThisWeeksTasks({ plants, weather }: Props) {
  const [tasks, setTasks] = useState<WeeklyTask[]>([]);

  useEffect(() => {
    // Synthesize weekly tasks
    const weeklyTasks = synthesizeTasks(plants, weather);
    // Prioritize by urgency
    setTasks(sortByPriority(weeklyTasks).slice(0, 5));
  }, [plants, weather]);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">This Week's Tasks</h2>
      
      {tasks.length === 0 ? (
        <p className="text-gray-500">Nothing urgent this week. Enjoy the garden!</p>
      ) : (
        tasks.map((task, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border-l-4" style={{
            borderColor: task.priority === 'high' ? '#ef4444' : '#94a3b8'
          }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{task.action}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.plants.join(', ')}</p>
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                {task.whenDue}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mt-3">{task.instruction}</p>
            
            {task.weatherContext && (
              <p className="text-xs text-blue-600 mt-2">🌤️ {task.weatherContext}</p>
            )}
            
            <p className="text-xs text-gray-500 mt-2">~{task.timeToComplete}</p>
          </div>
        ))
      )}
    </div>
  );
}

// Synthesis function
function synthesizeTasks(plants, weather): WeeklyTask[] {
  const tasks: WeeklyTask[] = [];

  // Group by action type
  const toWater = plants.filter(p => needsWatering(p, weather));
  if (toWater.length > 0) {
    tasks.push({
      priority: 'high',
      action: 'Water',
      plants: toWater.map(p => p.name),
      whenDue: 'Tomorrow morning (before 9am)',
      timeToComplete: `${toWater.length * 5} min`,
      instruction: `Deep water at soil level. Avoid wetting leaves. ${
        weather.forecast[0].rainfall > 5 ? 'Skip—rain expected.' : ''
      }`,
      weatherContext: weather.forecast[0].rainfall > 5 
        ? 'Heavy rain expected tomorrow. Check soil before watering.'
        : undefined
    });
  }

  const toFertilize = plants.filter(p => isDueFertilizing(p));
  if (toFertilize.length > 0) {
    tasks.push({
      priority: toFertilize.some(p => p.growthStage === 'fruiting') ? 'high' : 'medium',
      action: 'Fertilize',
      plants: toFertilize.map(p => p.name),
      whenDue: 'This week',
      timeToComplete: '10 min',
      instruction: 'Apply balanced organic fertilizer in a ring around each plant. Water thoroughly.'
    });
  }

  const toStake = plants.filter(p => needsStaking(p));
  if (toStake.length > 0) {
    tasks.push({
      priority: 'medium',
      action: 'Support & stake',
      plants: toStake.map(p => p.name),
      whenDue: 'This week',
      timeToComplete: '20 min',
      instruction: 'Install cages or stakes now, before wind damage. Tie loosely to stem.'
    });
  }

  const toPrune = plants.filter(p => isDuePruning(p));
  if (toPrune.length > 0) {
    tasks.push({
      priority: 'low',
      action: 'Prune',
      plants: toPrune.map(p => p.name),
      whenDue: 'This week',
      timeToComplete: '15 min',
      instruction: 'Remove yellowing/diseased leaves. Open canopy for airflow.'
    });
  }

  return tasks.sort((a, b) => 
    priority[b.priority] - priority[a.priority]
  );
}
```

**Effort:** 1.5 weeks

---

## Phase 3: Reduce Cognitive Load (Weeks 5-6)

### 3.1: Prune Pages

**Current:** 26 pages  
**Target:** 5 pages

| Keep | Remove | Reason |
|------|--------|--------|
| Dashboard | bed-buddies | Too niche, adds distraction |
| My Garden | calendar/* | Covered by dashboard harvest timeline |
| Plant Details | common-issues | Belongs in plant detail, not separate page |
| Settings | what-not-to-do | Negative framing, low value |
| Profile | propagation | Advanced topic, 5% of users |
| | flowers | Low priority |
| | edible-plants | Redundant with plant types |
| | planting-calendar | Replaced by "This Week" |
| | resources | Links to external sites, not value-add |

**File:** `app/layout.tsx` (navigation)
```typescript
const NAV_ITEMS = [
  { label: 'Garden', href: '/dashboard', icon: '🏡' },
  { label: 'My Plants', href: '/my-garden', icon: '🌱' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-white border-t">
      {NAV_ITEMS.map(item => (
        <Link key={item.href} href={item.href} className="flex-1 p-3 text-center">
          <span className="text-xl">{item.icon}</span>
          <p className="text-xs">{item.label}</p>
        </Link>
      ))}
    </nav>
  );
}
```

**Effort:** 1 week (mostly deletions)

---

### 3.2: Make Tasks Actionable

**Current:**  
- "Install supports" ← What kind? How?
- "Monitor for pests" ← What am I looking for?

**New:**  
Each task includes:
- Specific instruction (not vague)
- Expected time
- Visual reference (photo or diagram)
- What success looks like

**File:** Update plant timeline schema
```typescript
interface PlantActivity {
  timing: number; // days after planting
  activity: string; // "Install supports"
  instruction: string; // Detailed step-by-step
  materials?: string[]; // ["bamboo stake, 6 ft", "garden twine"]
  timeToComplete: string; // "15 minutes"
  successLooks: string; // "Plant is upright, stem unbent"
  photo?: string; // URL to reference image
  difficulty: 'easy' | 'medium' | 'hard';
}
```

**Example:**
```typescript
{
  timing: 35,
  activity: 'Install tomato supports',
  instruction: `
    1. Drive a 6-foot bamboo stake 12 inches into soil, 3 inches from stem base
    2. Use garden twine to tie plant to stake loosely (not too tight)
    3. Knot twine to stake, not to plant
    4. Leave 2-3 inches of slack for stem expansion
    5. Check weekly as plant grows
  `,
  materials: ['6-ft bamboo stake', 'garden twine or soft ties'],
  timeToComplete: '5 minutes',
  successLooks: 'Plant stem is upright and unbent. Twine is loose, not cutting into stem.',
  difficulty: 'easy'
}
```

**Effort:** 2 weeks (rewrite + photo sourcing)

---

## Phase 4: Smart Notifications (Week 7)

### 4.1: Daily Digest, Not Hourly Spam

**File:** New service `services/notificationService.ts`
```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

export class DailyDigestService {
  async scheduleDigest(userLocation: UserLocation) {
    const userTime = getUserPreference('notification_time') || '07:00';
    const [hour, min] = userTime.split(':').map(Number);

    await LocalNotifications.schedule({
      notifications: [{
        title: 'Garden Check-In',
        body: '', // Populated below
        id: 1,
        schedule: {
          on: {
            hour,
            minute: min
          }
        }
      }]
    });
  }

  async generateDailyDigest(plants, weather): Promise<string> {
    const tasks = synthesizeTasks(plants, weather);
    const topTasks = tasks.slice(0, 3);

    if (topTasks.length === 0) {
      return 'Relax! Nothing urgent in the garden today.';
    }

    const summary = topTasks
      .map(t => `${t.action} ${t.plants.slice(0, 2).join(', ')}`)
      .join(' • ');

    return `${summary}. Tap to see details.`;
  }
}

// Usage
scheduleDigest(userLocation);
// Result: Single notification at 7am, e.g. "Water tomatoes, beans • Stake peppers"
```

**Effort:** 3 days

---

## Implementation Checklist

### Phase 1 (Weeks 1-2): Fix Trust
- [ ] Create `locationService.ts` with geolocation
- [ ] Build AU hardiness zone database (Supabase)
- [ ] Migrate plant timelines to database (zone-keyed)
- [ ] Update weather API to use user location (not hardcoded Hobart)
- [ ] Update plant schedule generation to use zone-specific data
- [ ] Test with 3+ locations (different zones)

### Phase 2 (Weeks 3-4): Simplify
- [ ] Create `QuickAddPlant` component (10-15 common plants only)
- [ ] Remove optional fields from plant form
- [ ] Create `ThisWeeksTasks` component with synthesis logic
- [ ] Replace "Today's Tasks" with "This Week" on dashboard
- [ ] Remove task list from plant card (replaced by weekly synthesis)
- [ ] Test add plant flow end-to-end

### Phase 3 (Weeks 5-6): Reduce Complexity
- [ ] Delete 21 pages (keep 5)
- [ ] Update plant timeline schema with actionable instructions
- [ ] Rewrite all plant activities with specific, step-by-step instructions
- [ ] Source/create reference photos for key tasks
- [ ] Update My Garden page to show tasks from synthesized weekly list only

### Phase 4 (Week 7): Smart Notifications
- [ ] Create daily digest service
- [ ] Schedule notification at user's preferred time
- [ ] Batch-generate digest from synthesized tasks
- [ ] Test on Android (Capacitor local notifications)
- [ ] Remove hourly polling logic

### Testing & Polish
- [ ] Manual test with 3+ users in different zones
- [ ] QA: Verify plant timings per zone
- [ ] QA: Verify notifications arrive once per day
- [ ] QA: Verify tasks are actionable (user can do without external lookup)
- [ ] Performance: Reduce bundle size (deleted 21 pages)

---

## Expected Impact

### Before (Current State)
- **Onboarding time:** 8-10 minutes (form + explanations)
- **Action clarity:** Low ("Which task is due today?")
- **Trust level:** Medium-Low (wrong location = wrong advice)
- **Retention:** Week 1 → Week 4 = ~30% (guessing, users revert to paper)

### After (Proposed)
- **Onboarding time:** 2 minutes (pick plant, done)
- **Action clarity:** Very high (one sentence per week)
- **Trust level:** High (accurate location, proven advice)
- **Retention:** Week 1 → Week 4 = 60%+ (achievable with accurate timings)

---

## Data Requirements

### Supabase Tables Needed

1. **plant_timelines** (500+ rows)
   - Plant name, AU hardiness zone, timelines, activities

2. **user_locations** (extended)
   - lat, lon, hardiness zone, auto-detected timestamp

3. **user_preferences**
   - notification_time, quiet_hours_start, quiet_hours_end

### External Data
- AU Hardiness Zone Map (CSV): Australian Native Plant Society or similar
- Plant reference photos (CC-licensed from Unsplash, etc.)

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Zone data is inaccurate | Crowd-source corrections; test with real gardeners in each zone |
| Rewrite takes longer | Parallel: remove pages while building new components |
| Users have old habits | Onboarding flow explains "This is different—just check once a week" |
| Performance regression | Monitor bundle size; lazy-load plant details |

---

## Success Metrics (Post-Implementation)

Track these in Supabase analytics:

1. **Onboarding completion:** % of users who add a plant in first session
   - Target: 70% (current likely 40%)

2. **Weekly engagement:** % opening app within 2 days
   - Target: 50% (current likely 20%)

3. **Task completion:** % of users marking tasks as done
   - Target: 40% (current likely 10%, they don't see tasks)

4. **Harvest success:** % of plants reaching harvest
   - Target: 60% (current likely 40%, wrong advice)

5. **Notification feedback:** % with notifications enabled
   - Target: 70% (current likely 10%, fatigue)

6. **Retention:** Day 1 → Day 30 cohort
   - Target: 40% (current likely 15%)

---

## Conclusion

This roadmap converts GrowGuide from a planner into an assistant.

**The shift:**
- From "Here are 5 possible tasks this week; pick one" → "Water your tomatoes tomorrow morning"
- From "Set up your garden system" → "Add a plant, we'll tell you what to do"
- From "Generic advice for Australia" → "Zone-specific guidance for your location"

**Effort:** 7 weeks focused work, 2-3 full-time devs  
**Expected result:** 2.5x retention, word-of-mouth potential, defensible market position (location-aware beats generic competitors)
