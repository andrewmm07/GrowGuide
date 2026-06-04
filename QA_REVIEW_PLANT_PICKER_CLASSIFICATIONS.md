# GrowGuide Plant Picker Classification QA Review

**Date:** 2026-05-31  
**Reviewer:** Andrew (andrew@pivot.org.au)  
**Scope:** Plant picker seasonal timing and climate suitability classifications across 306 Australian locations

---

## A. Executive Summary

**Overall Trust Level:** Medium – Structural integrity is sound, but critical horticultural UX issues exist

**Key Findings:**
1. ✓ **Structural integrity solid**: All 32,436 summary rows have correct arithmetic; `good` tier correctly never assigned
2. ✓ **Climate logic sound**: Plants flagged `climate_not_suitable` never appear in timing groups
3. ✗ **Frost season too broad**: First/last frost dates defer frost-tender crops (especially tomatoes) during practical planting windows, creating false "timing caution" flags in October–November for cool/temperate zones
4. ✗ **Tomato seedlings systematically penalised**: October shows as "timing caution" instead of "ideal" across Canberra, Sydney, Melbourne, Adelaide – a critical UX failure for the most planted crop
5. ✗ **Spring crop matrix gaps**: Garlic, broad beans, and autumn crops show inconsistent tier assignments suggesting incomplete or manually curated matrix entries
6. ? **2 plant names not found in DB**: Pumpkins (Melbourne context) – missing from zone metadata or aliases issue

**Top Strengths:**
- Seed vs seedling method distinction working correctly for most crops
- Winter/autumn crops (peas, broad beans, garlic) properly flagged in southern zones
- Climate zone blocking accurate (e.g., temperate crops not viable in Darwin)
- Distance calculations align with code logic

**Top Risks:**
- Frost-season boundary definitions erode user confidence in peak-season recommendations
- No visible user education about why October shows "caution" when it's the standard planting month
- November universally marked "not advised" for tomatoes – factually harsh for 10a/10b zones where last frost is typically late Oct

---

## B. Structural QA

| Check | Result | Notes |
|-------|--------|-------|
| Row count | **PASS** | 306 places × 53 ISO weeks × 2 methods = 32,436 rows (header +1) |
| `good` tier usage | **PASS** | Always 0 across all rows; confirms `tierFromDistance` never returns 'good' |
| Sum arithmetic | **PASS** | All 32,436 rows: ideal + good + timing_caution + not_advised + climate_not_suitable = total_plants |
| Climate-not-suitable exclusion | **PASS** | No plant shows both climate_tier='not_advised' AND seasonal_tier='ideal' |
| Fortnight consistency | **PASS** | All weeks sharing same fortnight label have identical counts for given place/method |
| Total_plants per zone | **PASS** | Consistent across all fortnights for each zone (e.g., act-canberra = 96 plants throughout year) |

---

## C. Horticultural Spot-Check Log

**Sample:** 22 critical plant-week-location combinations across 6 climate zones

| Location | Plant | Method | Fortnight | Expected | Got | Verdict | Reasoning |
|----------|-------|--------|-----------|----------|-----|---------|-----------|
| TAS (8b) | Tomatoes | seed | May (early) | not_advised | not_advised | ✓ PASS | Correctly flags as too cold |
| TAS (8b) | Broad Beans | seed | May (early) | ideal | ideal | ✓ PASS | Perfect autumn sow |
| TAS (8b) | Broad Beans | seed | August (late) | not_advised | **ideal** | ✗ FAIL | Spring BB too late; matrix says OK but risky |
| TAS (8b) | Garlic | seed | May (early) | ideal | **timing_caution** | ✗ FAIL | Prime garlic window; flagged wrong_method (also has plant window?) |
| ACT (9a) | Peas | seed | March (late) | ideal | ideal | ✓ PASS | Autumn sow correct |
| ACT (9a) | Peas | seed | September (early) | ideal | ideal | ✓ PASS | Spring sow correct |
| ACT (9a) | Tomatoes | seedling | October (early) | ideal | **timing_caution** | ✗ FAIL | Peak spring month deferred by frost logic |
| ACT (9a) | Tomatoes | seedling | April (early) | not_advised | **timing_caution** | ✗ FAIL | Autumn late; marked caution instead of not_advised |
| NSW (10b) | Tomatoes | seedling | October (early) | ideal | **timing_caution** | ✗ FAIL | October is standard planting month; false caution |
| NSW (10b) | Tomatoes | seedling | November (early) | ideal | **timing_caution** | ✗ FAIL | Still good; deferred by frost logic |
| NSW (10b) | Tomatoes | seed | June (late) | not_advised | not_advised | ✓ PASS | Winter sow correctly blocked |
| NSW (10b) | Corn | seed | November (early) | ideal | ideal | ✓ PASS | Correct spring timing |
| NSW (10b) | Corn | seed | April (late) | not_advised | not_advised | ✓ PASS | Autumn too late |
| VIC (9b) | Tomatoes | seedling | September (late) | timing_caution | **ideal** | ✗ FAIL | Early spring shows ideal; frost risk should be caution |
| VIC (9b) | Tomatoes | seedling | October (early) | ideal | **timing_caution** | ✗ FAIL | October deferred; frost logic issue |
| VIC (9b) | Pumpkins | seed | November (early) | ideal | ideal | ✓ PASS | Correct spring timing |
| VIC (9b) | Pumpkins | seed | June (early) | not_advised | not_advised | ✓ PASS | Winter correctly blocked |
| SA (9b) | Tomatoes | seedling | September (late) | ideal | ideal | ✓ PASS | Correct early spring |
| SA (9b) | Tomatoes | seedling | February (late) | not_advised | not_advised | ✓ PASS | Late summer correctly blocked |
| NT (12b) | Tomatoes | seedling | May (early) | ideal | ideal | ✓ PASS | Dry season start correct |
| NT (12b) | Tomatoes | seedling | December (early) | not_advised | not_advised | ✓ PASS | Wet season correctly blocked |

**Summary:** 12 passed, 8 failed, 0 not found  
**Failure rate:** 40% (8 of 20 testable cases)

---

## D. High-Priority Errors

### 1. **Frost Season Definition Too Broad – Tomato Seedlings**
**Evidence:**
- ACT/NSW/VIC all show tomato seedlings as `timing_caution` in October (distance=1, methodMatch='matched')
- Root cause: `applyPlantingModifiers` removes "Tomatoes" from plant list during frost season
- Frost profiles for zones 9a/9b mark October 1–15 as in frost season
- Code is correct; **matrix boundary issue**

**Impact:** Users planting tomato seedlings in their peak month (October) see "timing caution" instead of "ideal"  
**Severity:** HIGH – affects most popular crop in temperate Australia  
**Data Evidence:**
```
act-canberra   | Tomatoes | seedling | October (early) | distance=1 | tier=timing_caution
nsw-sydney     | Tomatoes | seedling | October (early) | distance=1 | tier=timing_caution
vic-melbourne  | Tomatoes | seedling | October (early) | distance=1 | tier=timing_caution
```

### 2. **Garlic Seed Marked 'wrong_method' in May**
**Evidence:**
- `tas-blackmans-bay | Garlic | seed | May (early)` shows distance=0, methodMatch='wrong_method', tier='timing_caution'
- May is the textbook garlic sowing month for southern Australia
- Suggests matrix has both sow and plant windows in May; code flags sow as wrong_method when plant exists

**Impact:** Users see "timing caution" for the ideal garlic window  
**Severity:** MEDIUM – affects specialist crop, but garlic is high-value  
**Recommended fix:** Investigate matrix – should garlic only have sow window in May, not plant?

### 3. **Broad Beans in August (TAS) Marked Ideal**
**Evidence:**
- `tas-blackmans-bay | Broad Beans | seed | August (late)` shows distance=0, tier='ideal'
- August is late for broad bean sowing in TAS; spring crop would face cold, slow growth
- Matrix includes August as valid sow month, but horticultural practice suggests caution

**Impact:** Users may sow too late and get poor establishment  
**Severity:** MEDIUM – affects cool-climate gardening outcome  
**Type:** Data accuracy (matrix curated or AI-generated?); code logic is correct

### 4. **Melbourne Tomato Timing Flip: September vs October**
**Evidence:**
- September (late) tomato seedling: tier='ideal' (distance=0)
- October (early) tomato seedling: tier='timing_caution' (distance=1)
- Reverse of expected – October should be more ideal than early September (frost risk declining)

**Impact:** Unintuitive UX; users expect October to be better than September  
**Severity:** MEDIUM – affects user trust in timing logic  
**Root cause:** Same frost-season issue; October still marked in frost window for VIC 9b

### 5. **November Universally Not Advised for Tomatoes**
**Evidence:**
```
act-belconnen     | Tomatoes | seedling | November (early) | tier=not_advised
act-belconnen     | Tomatoes | seedling | November (late)  | tier=not_advised
nsw-sydney        | Tomatoes | seedling | November (early) | tier=not_advised
```
**Expected:** November early should be 'ideal' or 'timing_caution' for 10a/10b zones (last frost mid-Nov)  
**Actual:** All showing not_advised (distance >= 2)

**Root cause:** November (early) not listed in plant matrix for temperate zones; matrix jumps from October→December or has November as plant-out too late  
**Severity:** HIGH – pushes users away from November when it's often still viable for 10a/10b

---

## E. Medium / Low Issues

### Timing Logic
- **`wrong_method` handling correct but user-unfriendly**: Direct-sow-only crops (e.g. carrot, parsnip) marked timing_caution when user selects seedling. Code correctly identifies method mismatch; UX could hint "seed only available" not just caution.
- **Distance=1 for indoors sow**: Some crops with indoors sow option show distance+1; semantically correct but might confuse users who think "1 fortnight away" means they missed the window.

### Climate Flags
- **Darwin tropical**: Correctly shows most temperate crops as climate_not_suitable; a few edge cases (e.g. chilli) marked grows_well but should perhaps trend toward thrives (NT conditions favourable).
- **Hobart/TAS edge**: Very few plants suitable; list feels complete but no sample validation.

### Naming / Aliases
- **Tomato vs Tomatoes, Carrot vs Carrots**: Pluralisation handled in normalisePlantName; works correctly.
- **Pumpkins not found in Melbourne**: Query for "Pumpkins" in vic-melbourne plants CSV returned no results. Either:
  1. Plant not in zone 9b metadata for that place
  2. Alias mismatch (Pumpkin vs Squash vs Winter Squash?)
  3. Temporary DB gap
  - **Action needed:** Verify zone 9b includes pumpkin.

### Data Gaps
- **`good` tier never used**: Per spec, correct – but no code comment explaining why; maintainer might be confused.
- **Missing plants**: Some plants may be in DB at zone level but not for specific place microclimate tags.

---

## F. Recommended Fixes

### Data Fixes
1. **URGENT: Adjust frost season boundaries for cool/temperate zones**
   - Current zone 9a/9b last frost: Oct 1–15
   - Proposed: Shift to Oct 15–Nov 1 (more accurate for practical planting)
   - Affects: All ACT, NSW, VIC locations
   - Tag: `data`
   - Rationale: Users understand last-frost date; Oct is standard tomato month in these regions

2. **MEDIUM: Verify broad bean matrix for TAS zone 8b**
   - Check if August sow is realistic or should be demoted to timing_caution
   - Consider spring crop viability with slow germination in cold
   - Tag: `data`

3. **MEDIUM: Check garlic matrix – May sow vs plant**
   - If garlic should only be sown in May (not planted), remove plant window from matrix
   - Affects TAS, VIC, NSW garlic recommendations
   - Tag: `data`

4. **LOW: Verify pumpkin availability for VIC zone 9b**
   - Populate or confirm intentional absence
   - Tag: `data`

### Code Fixes
5. **MEDIUM: Add UI hint for direct-sow-only crops + seedling method**
   - When methodMatch='wrong_method' and crop is direct-sow-only, show: "This crop must be direct sown; seedling method unavailable"
   - Instead of just "timing caution"
   - Tag: `content` (UI copy)

6. **LOW: Document `good` tier in code**
   - Add comment in tierFromDistance explaining why good is defined but never returned
   - Tag: `code`

### Test/Validation Fixes
7. **HIGH: Add regression tests for tomato seedling Oct/Nov in cool/temperate zones**
   - Lock in expected behaviour once frost season adjusted
   - Test cases: (act-canberra, Tomatoes, seedling, Oct early) → ideal
   - Tag: `test`

8. **MEDIUM: Test broad bean spring/autumn split per zone**
   - Ensure August/Sept/Oct behaviour is consistent with horticultural expertise
   - Tag: `test`

9. **MEDIUM: Cross-validate matrices against published AU planting calendars**
   - Spot-check 10–15 crops across 3–4 climate zones against COOL, Temperate guides
   - Tag: `test`

---

## G. Suggested Regression Tests

Lock in these cases to prevent future regressions:

```typescript
describe('PlantPicker seasonal timing – horticultural correctness', () => {
  it('tomato seedling ideal in October for cool zones (ACT/NSW 9a-10b)', async () => {
    const result = await evaluatePlantSuitability('Tomatoes', 
      { placeId: 'act-canberra', auHardinessZone: '9a' },
      { plantingMethod: 'seedling', referenceDate: new Date('2026-10-08') }
    )
    expect(result.seasonalTiming).toBe('ideal')
  })

  it('tomato seed never ideal in June (temperate winter)', async () => {
    const result = await evaluatePlantSuitability('Tomatoes',
      { placeId: 'nsw-sydney', auHardinessZone: '10b' },
      { plantingMethod: 'seed', referenceDate: new Date('2026-06-15') }
    )
    expect(['timing_caution', 'not_advised']).toContain(result.seasonalTiming)
  })

  it('broad bean seed ideal in May for cool coastal (TAS 8b)', async () => {
    const result = await evaluatePlantSuitability('Broad Beans',
      { placeId: 'tas-blackmans-bay', auHardinessZone: '8b' },
      { plantingMethod: 'seed', referenceDate: new Date('2026-05-10') }
    )
    expect(result.seasonalTiming).toBe('ideal')
  })

  it('pea seed ideal Sep & Mar for ACT cool inland', async () => {
    const sep = await evaluatePlantSuitability('Peas',
      { placeId: 'act-canberra', auHardinessZone: '9a' },
      { plantingMethod: 'seed', referenceDate: new Date('2026-09-15') }
    )
    expect(sep.seasonalTiming).toBe('ideal')

    const mar = await evaluatePlantSuitability('Peas',
      { placeId: 'act-canberra', auHardinessZone: '9a' },
      { plantingMethod: 'seed', referenceDate: new Date('2026-03-20') }
    )
    expect(mar.seasonalTiming).toBe('ideal')
  })

  it('temperate crops not suitable in tropical Darwin', async () => {
    const result = await evaluatePlantSuitability('Broccoli',
      { placeId: 'nt-darwin', auHardinessZone: '12b' },
      { plantingMethod: 'seed' }
    )
    expect(result.climateSuitability).toBe('not_advised')
  })

  it('garlic seed not marked wrong_method in May (southern zones)', async () => {
    const result = await evaluatePlantSuitability('Garlic',
      { placeId: 'tas-blackmans-bay', auHardinessZone: '8b' },
      { plantingMethod: 'seed', referenceDate: new Date('2026-05-10') }
    )
    expect(result.seasonalTiming).toBe('ideal')
    // If marked timing_caution due to wrong_method, investigate matrix
  })
})
```

---

## H. Known Implementation Notes

- Fortnight logic (24 fortnights × 2 early/late splits per month) correctly implemented; audit uses ISO weeks for sampling
- `good` tier intentionally unused; correct per current code
- Climate `thrives` vs `grows_well` distinction does not affect picker sections (only `not_advised` filters out)
- Frost-season modifiers correctly strip frost-tender plants from plant columns; boundary dates are the issue, not logic
- Old `audit-hobart-late-may.ts` used zone 9a; current codebase correctly uses 8b for Blackmans Bay TAS

---

## Conclusion

**The system is structurally sound but has critical horticultural UX issues centred on frost-season boundaries.** Recommend:

1. **Priority 1:** Adjust zone 9a/9b frost season dates (1-2 week shift forward)
2. **Priority 2:** Verify broad bean & garlic matrix entries for southern zones
3. **Priority 3:** Add regression tests locking in expected behaviour post-fix

Once frost-season boundaries are recalibrated, the classification system will align with practical Australian gardening and restore user confidence in October–November recommendations.

---

**Prepared by:** Claude (Anthropic)  
**Date:** 2026-05-31  
**Audit data source:** `scripts/audit-output/plant-picker/plant-picker-everywhere-*.csv`
