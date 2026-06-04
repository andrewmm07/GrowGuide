# GrowGuide MVP Release Audit
**Date:** June 1, 2026  
**Auditor Role:** Expert in MVP viability & App Store readiness  
**Focus:** Android App Store release feasibility  

---

## EXECUTIVE SUMMARY

**VERDICT: NOT READY FOR RELEASE**

GrowGuide has solid technical foundations (Next.js/Capacitor, Supabase auth, geolocation, weather API) but **cannot ship to Android App Store without resolving critical data integrity and UX issues.** Attempting launch now will result in low app ratings, user abandonment, and potential App Store rejection.

**Estimated work before launch: 10-14 days**  
**Risk level: MEDIUM (solvable, not architectural)**

---

## WHAT'S STRONG

### Technical Stack
✅ **Framework:** Next.js 14 (modern, stable)  
✅ **Mobile:** Capacitor 8.3.4 (production-ready)  
✅ **Auth:** Supabase with email verification (works)  
✅ **Database:** Supabase PostgreSQL with migrations ready  
✅ **Location:** Geolocation + suburb database (500+ suburbs mapped to zones)  
✅ **Weather:** API integration working (WeatherAPI)  
✅ **Android build:** Gradle configured, AndroidManifest set up  

### Architecture & Code
✅ **Location service:** Well-structured, error handling present  
✅ **Plant data:** 768 plant records in database with zone mapping  
✅ **Auth flow:** Login → location selection → dashboard routing works  
✅ **Component structure:** Modular (BottomNav, GardenPlannerView, PlantPicker)  
✅ **Error boundaries:** Present in page structure  
✅ **Tests:** 6 test files exist (plant timing, schedules, weather)  

---

## CRITICAL BLOCKERS (Must fix before launch)

### 1. **DATA INTEGRITY: 6 Common Crops Missing from Matrices**
**Severity: CRITICAL**  
**Scope:** ~200K records affected  
**Time to fix: 3-5 hours**

**Problem:**  
These crops exist in the database but have NO timing windows in the planting matrices:
- Cabbage (32,436 records) → Database expects "Cabbage", matrix has only "Winter Cabbage"
- Peppers (32,436 records) → Database has "Peppers", matrix has "Capsicum"
- Chilli (30,316 records) → Not in matrix at all
- Basil (30,316 records) → Not in matrix at all
- Okra (30,316 records) → Not in matrix at all
- Sweet Potato (singular vs plural mismatch)

**User impact:**  
Users cannot plant these crops. System marks them "not_advised" year-round. For Australian gardeners, this means **no peppers, no basil, no chilli** — core vegetables for 60%+ of garden planters.

**Evidence:**  
- Verified across 2,963,336 plant records (May 31 QA report)
- 100% of records for these crops show `methodMatch='no_window'`
- Name mismatches traced in plantingByClimate.ts

**Fix required:**
```sql
-- Add Cabbage, Peppers/Capsicum, Chilli, Basil, Okra to planting matrices
-- Standardize Sweet Potato naming (singular throughout)
-- Re-run plant timeline generation
-- Estimate: 3-5 hours matrix creation + testing
```

**App Store rejection risk: HIGH**  
First review: "Why can't I plant peppers?" → App Store notes quality issues.

---

### 2. **FROST SEASON BOUNDARY: October Tomato Issue**
**Severity: HIGH**  
**Scope:** 428/612 October seedling records (70% of cool/temperate zones)  
**Time to fix: 1-2 hours**

**Problem:**  
Tomatoes show "Timing Caution" warning in October for zones 9a-10b because the frost boundary (Oct 1-15) removes tomatoes from the planting list. But October is peak tomato planting month in Australia.

**User impact:**  
User in Tasmania/Victoria: "October is the BEST month to plant tomatoes. Why is your app warning me?"  
Trust failure on core use case.

**Root cause:**  
Frost date boundary too early. Should be Oct 15-20 for these zones, not Oct 1.

**Fix:**
```sql
-- Update frost_season_start for zones 9a/9b from Oct 1 to Oct 15-20
-- Re-audit plant_timelines for affected zones
-- Estimate: 1-2 hours
```

---

### 3. **CRITICAL: Plant Data Load Status Unknown**
**Severity: CRITICAL**  
**Scope:** 769 plants, 3500+ activities  
**Time to fix: 30 mins to verify + hours if not done**

**Problem:**  
Documentation shows plant data needs to be loaded via migration script. **Status unclear: Has this been executed?**

Deployment steps (DEPLOYMENT_STEPS.md) say:
1. Apply schema migration (001_normalize_activities.sql)
2. Run load-plant-data.ts script
3. Verify data in Supabase

**Current state:**  
- plant_timelines table exists (code references it)
- plant_activities table mentioned in schemas
- **No confirmation data has been loaded**

**If NOT done:**  
Plant system will fail at runtime. Users add plants, no schedules generate.

**Fix:**
```bash
# 1. Verify in Supabase Dashboard
SELECT COUNT(*) FROM plant_timelines; -- Should be 769
SELECT COUNT(*) FROM plant_activities; -- Should be 3500+

# 2. If empty, execute:
npm run build:month-overviews  # Pre-build data
npx ts-node scripts/load-plant-data.ts  # Load into database

# Estimate: 30 mins verification, 1-2 hours if not done
```

---

## HIGH-PRIORITY ISSUES (Affects MVP viability)

### 4. **Form Complexity: "My Garden" Setup Friction**
**Severity: HIGH**  
**Scope:** First-time user flow (onboarding → plant addition)  
**Time to fix: 2-3 days**

**Problem:**  
Adding a plant requires:
1. Select plant from dropdown (20+ options)
2. Choose seed vs seedling type
3. Pick planting date (why not assume today?)
4. Enter location again (already set in profile)
5. Optional notes (makes form feel incomplete if empty)
6. Auto-generates 7-12 week timeline
7. Cards expand/collapse (hidden complexity)

**User impact:**  
Form abandonment on step 2-3. Users revert to notes or spreadsheets. Churn happens here.

**What should happen:**
- Simplified form: **Plant name + Date (optional, default=today)**
- Show only 10-15 most common plants initially (not 20+)
- Auto-use location from profile
- Generate weekly view, not 12-week timeline
- Show actions for THIS WEEK, not the next quarter

**Status:**  
GardenPlannerView.tsx (12,602 bytes), PlantPicker.tsx (18,345 bytes) — code is bloated relative to feature.

**Fix:**
- Create `QuickAddPlant.tsx` component (200-300 lines)
- Reduce form to 2-3 fields
- Filter plant list to 10 most common
- Change view from "growing schedule" to "this week's tasks"
- Estimate: **2-3 days**

---

### 5. **Notification Strategy: Hourly Polling → Fatigue**
**Severity: HIGH**  
**Scope:** Every user, every day  
**Time to fix: 2-3 days**

**Problem:**  
- WateringSchedule.tsx polls every **3,600,000ms (1 hour)**
- No batching: 3 plants needing water = 3 notifications
- No quiet hours or smart timing
- No prioritization

**User impact:**  
- Hour 1: First notification arrives
- Hour 2: Second reminder (same plant)
- Day 2: User disables all notifications
- Week 2: App deleted (user stops opening it)

**What should happen:**
- Daily digest at **7am** (single notification)
- Batch related plants: "Water tomatoes & beans today"
- Smart timing: "You have 3 tasks due this week"
- Only notify if action is actually due TODAY, not "might be due soon"

**Fix:**
- Replace hourly polling with **once-daily cron trigger**
- Create synthesizeTasks() function to batch by action type
- Update NotificationService for scheduling
- Estimate: **2-3 days**

---

### 6. **Page/Feature Bloat: 21 Unnecessary Pages**
**Severity: MEDIUM**  
**Scope:** Navigation + codebase maintenance  
**Time to fix: 1 day**

**Problem:**  
Archived/unused pages in `/app` reduce focus:
- Bed-buddies, calendars (multiple), resources, common-issues, flowers, edible-plants, debug pages

**Impact:**  
- User confusion (too many nav options)
- Code maintenance burden (testing, bundling)
- Signals app is incomplete

**MVP should have:**
- Dashboard (main view)
- My Garden (plant management)
- Settings (location, logout)
- That's it.

**Fix:**
- Move unused pages to `/app/_archived` (already done partially)
- Remove from navigation
- Delete from BottomNav.tsx
- Estimate: **1 day**

---

## MEDIUM-PRIORITY ISSUES (Polish, not blockers)

### 7. **Plant Data Gaps: 11 Other Vegetables**
**Severity: MEDIUM**  
**Scope:** Artichoke, Celeriac, Chicory, Endive, etc. (count unknown)  
**Time to fix: 2 hours**

**Problem:**  
These vegetables exist in database but status unclear:
- Are they in the planting matrices?
- If not, should they be added or removed?

**Impact:**  
Users can't plant them. Less critical than cabbage/peppers, but still a completeness issue.

**Fix:**
- Audit remaining 11 crops against matrices
- Add missing entries or document why excluded
- Estimate: **2 hours**

---

### 8. **Perennial Crops UX: Not Labeled**
**Severity: LOW**  
**Scope:** 28 plants (apple, lemon, mint, etc.)  
**Time to fix: 30 mins**

**Problem:**  
Perennials show "not_advised" all year (correct botanically). But UI doesn't explain why.

**User thinks:** "Why can't I plant an apple tree?"

**What should show:** "Perennial — plant once, harvest for years. Choose variety in spring."

**Fix:**
- Add label/badge to perennial crops
- Explain in tooltip
- Estimate: **30 mins**

---

## MOBILE & APP STORE READINESS

### Android Build Configuration: ✅ READY
- ✅ Gradle configured (build.gradle present)
- ✅ AndroidManifest.xml has correct permissions (INTERNET, GEOLOCATION)
- ✅ App ID set: `au.org.pivot.growguide`
- ✅ Capacitor configured to serve from `out/` (static export)
- ✅ Minimum SDK: Safe default in variables.gradle

### Release Configuration: ⚠️ NEEDS VERIFICATION
- `versionCode` set to 1 (correct for first release)
- `versionName` set to "1.0" (correct)
- `minifyEnabled` set to false in release builds (OK for MVP, but consider enabling for production)
- No signing configuration visible (needed for Play Store upload)

**Action:** 
```bash
# Before uploading to Play Store:
# 1. Generate signing key
keytool -genkey -v -keystore growguide-release.keystore -keyalg RSA -keysize 2048 -validity 10000

# 2. Configure signing in android/app/build.gradle
# 3. Test release build locally
./gradlew clean assembleRelease

# 4. Upload to Play Store Console
```

---

### App Store Listing: ❌ NOT STARTED
**Required before upload:**
- [ ] App name & description (160 char limit)
- [ ] Screenshots (2-8, 1080x1920 or 1440x2560)
- [ ] Feature graphic (1024x500)
- [ ] Privacy policy URL
- [ ] Category (Lifestyle? Gardening isn't a standard Google Play category)
- [ ] Content rating questionnaire
- [ ] Launch country

**Estimate: 2-3 hours** (mostly asset creation)

---

## TESTING STATUS

### Automated Tests: ⚠️ SPARSE
Found tests:
- `plantTimingAliases.test.ts` ✅
- `plantCareSchedule.test.ts` ✅
- `plantActivityCopy.test.ts` ✅
- `rollingWeatherCondition.test.ts` ✅
- `weeklyGuidanceInference.test.ts` ✅

**Coverage:** Unclear. Unit tests exist but no integration tests for:
- Auth flow (signup → location selection → dashboard)
- Plant addition (add plant → schedule generates → view in calendar)
- Notifications (trigger → display → dismiss)
- Location switching

**Recommendation:**  
Add integration tests covering critical paths before launch.

**Estimate: 2-3 days** (if building from scratch)

---

## CRITICAL PATH TO LAUNCH

### Phase 1: DATA FIXES (Days 1-2)
1. **Add missing crop matrices** (Cabbage, Peppers, Chilli, Basil, Okra) — 3 hours
2. **Verify plant data loaded into Supabase** — 30 mins
3. **Fix frost season boundaries** — 1 hour
4. **Re-audit plant_timelines** (run full validation suite) — 1 hour

**Subtotal: 5.5 hours**

### Phase 2: UX SIMPLIFICATION (Days 2-3)
5. **Simplify plant addition form** (QuickAddPlant component) — 1.5 days
6. **Reduce to 10-15 common plants** initially — 2 hours
7. **Change view from 12-week timeline to weekly tasks** — 1 day

**Subtotal: 2.5 days**

### Phase 3: NOTIFICATIONS (Days 4-5)
8. **Replace hourly polling with daily digest** — 1 day
9. **Implement task batching** — 1 day
10. **Test notification scheduling** — 4 hours

**Subtotal: 2 days**

### Phase 4: CLEANUP & TESTING (Days 6)
11. **Remove unused pages from navigation** — 2 hours
12. **Fix perennial crop labels** — 30 mins
13. **Run regression tests** — 4 hours
14. **Test auth flow end-to-end** — 2 hours

**Subtotal: 1 day**

### Phase 5: APP STORE SETUP (Days 7)
15. **Create Play Store listing assets** (screenshots, description, privacy policy) — 2 hours
16. **Generate signing key** — 30 mins
17. **Build release APK/AAB** — 1 hour
18. **Test release build on device** — 2 hours
19. **Upload to Play Store Console** — 30 mins

**Subtotal: 1 day**

---

## DETAILED RECOMMENDATIONS

### DO NOT SHIP IF:
- ❌ Plant data not loaded into Supabase (verify with SELECT COUNT query)
- ❌ Cabbage/Peppers/Chilli/Basil plant selection still shows "not_advised"
- ❌ Plant form still requires seed/seedling type selection
- ❌ Notifications still poll hourly
- ❌ No privacy policy or terms of service

### SHIP ONLY WHEN:
- ✅ All 6 missing crops have timing windows in matrices
- ✅ Frost boundary verified (October tomatoes work)
- ✅ Plant form reduced to 3 fields max
- ✅ Daily digest notifications working
- ✅ All unused pages removed from nav
- ✅ Auth flow tested end-to-end
- ✅ App Store listing complete & reviewed

---

## WHAT CAN WAIT (Post-Launch)

These are nice-to-have, not blockers:

- **Advanced features:** Companion planting, pest identification, soil pH tracking
- **UI polish:** Dark mode, animations, advanced filtering
- **Analytics:** Detailed usage tracking
- **Localization:** Other languages (start with AU English)
- **Perennial planting tools:** Spacing guides, multi-year planners
- **Integration:** Calendar sync, weather alerts, plant sales alerts
- **Social:** Share gardens, compare harvests

**Why wait?**  
You'll get user feedback post-launch to inform prioritization. Building these now delays market entry and may miss actual user needs.

---

## DEVELOPER NOTES

### Key Files to Change
| Issue | File | Lines | Priority |
|-------|------|-------|----------|
| Plant data validation | `lib/plantTimelineService.ts` | ~50 | P0 |
| Crop matrices | `lib/planting/plantingByClimate.ts` | ~1000 | P0 |
| Frost boundaries | Database queries (plant_timelines) | Various | P0 |
| Form simplification | `components/GardenPlannerView.tsx` | 12,602 | P1 |
| Notification polling | `components/WateringSchedule.tsx` | ~100 | P1 |
| Page cleanup | `app/*/page.tsx` | Various | P1 |
| App Store config | `android/app/build.gradle` | ~50 | P2 |

### Environment Variables: ✅ PRESENT
```
NEXT_PUBLIC_SUPABASE_URL=✅ Set
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅ Set
WEATHER_API_KEY=✅ Set
SUPABASE_SERVICE_ROLE_KEY=✅ Set (server-only, don't expose)
```

**Action:** Verify these in Play Store build environment before releasing.

### Capacitor Sync: ⚠️ BEFORE EACH BUILD
```bash
npm run build:mobile        # Build static export
npx cap sync android        # Sync to Android project
npx cap open android        # Open Android Studio
./gradlew clean assembleRelease  # Build APK
```

---

## APP STORE SUBMISSION CHECKLIST

- [ ] App name set (under 50 chars)
- [ ] Description written (80-4000 chars)
- [ ] Short description (80 chars)
- [ ] Privacy policy URL (required for any app)
- [ ] Screenshots uploaded (2-8 images)
- [ ] Feature graphic uploaded
- [ ] Content rating questionnaire completed
- [ ] Targeted content maturity (Everyone)
- [ ] App category selected (Lifestyle)
- [ ] Category (Secondary) optional
- [ ] Email for support provided
- [ ] Pricing set (free or paid)
- [ ] APK/AAB uploaded & signed
- [ ] Build tested on device
- [ ] Version code incremented
- [ ] Release notes written
- [ ] No hardcoded credentials in app
- [ ] No suspicious permissions requested (you're good here)
- [ ] All URLs redirect to valid HTTPS (verify)

---

## RISK SUMMARY

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Play Store rejects for quality | MEDIUM | HIGH | Fix data issues now, don't skip Phase 1 |
| Low ratings from missing crops | HIGH | MEDIUM | Phase 1 must be done before launch |
| Users disable notifications | HIGH | MEDIUM | Phase 3 (notification batching) critical |
| Churn on plant setup | MEDIUM | HIGH | Phase 2 (form simplification) essential |
| Geolocation fails silently | LOW | HIGH | Error handling present, but test on device |
| Supabase quota exceeded | LOW | MEDIUM | Monitor after launch |

---

## TIMELINE ESTIMATE

| Phase | Work | Est. Days | Cumulative |
|-------|------|----------|-----------|
| Data fixes | Crops, frost boundary, validation | 0.5 | 0.5 |
| UX simplification | Form redesign, plant list filtering | 2.5 | 3 |
| Notifications | Daily digest, batching | 2 | 5 |
| Cleanup & testing | Page removal, regression tests | 1 | 6 |
| App Store prep | Assets, signing, submission | 1 | 7 |

**Total: 7 days of focused work (assuming 6-8 hour dev days)**

**Buffer: Add 3 days for unexpected issues, testing cycles**

**Realistic launch: 10-14 days**

---

## FINAL VERDICT

**GrowGuide is NOT ready for Android App Store launch today.**

The app has **solid technical foundations** but **critical data integrity issues** (6 crops unavailable) and **UX problems** (setup friction, notification fatigue) that will drive abandonment within days of launch.

**However:** These are **solvable in 10-14 days** without architectural rework. The tech stack, auth, and backend are good. You're fixing data completeness and UX, not redesigning the platform.

**Recommendation:**  
1. Fix Phase 1 (data) immediately — this is non-negotiable
2. Implement Phase 2-3 in parallel (split team or rapid iteration)
3. Skip post-launch features until you have 100+ active users
4. Monitor App Store reviews obsessively for first 2 weeks
5. Have a rapid patch plan ready (v1.0.1, v1.0.2) for quick fixes

**Go/No-Go:** Fix the issues above, and you have a viable MVP. Ship these issues, and you'll get 2-3 star reviews and deletion requests.

---

## Questions to Answer Before Launch

1. **Is plant data actually loaded in Supabase?** (Check count of plant_timelines table)
2. **Have you tested the plant picker with Cabbage, Peppers, Chilli?** (Should show timing windows)
3. **Does the app work offline?** (Capacitor caches the web view, but API calls will fail)
4. **Have you stress-tested geolocation on a real Android device?** (Permissions, slow GPS)
5. **Privacy policy — where will it live?** (Need URL for Play Store submission)
6. **Who's monitoring App Store reviews first week?** (Assign someone)

---

**End of Audit Report**
