/**
 * Post-plant task rules — days since user added seed/seedling.
 * Keep in sync with lib/plantActivityCopy.ts (patterns mirrored there).
 */

/** Map variant titles → one canonical actionable title. */
export const CANONICAL_TITLES = {
  'Water consistently at silking — critical': 'Water at silking',
  'Water consistently at silking': 'Water at silking',
  'Water consistently at pod fill': 'Water at pod fill',
  'Water at pod fill — critical': 'Water at pod fill',
  'Water every 2 days in dry conditions': 'Water at pod fill',
  'Harvest promptly — sweetness fades within hours': 'Harvest at peak sweetness',
  'Harvest — sweetness fades within hours': 'Harvest at peak sweetness',
  'Harvest promptly — do not delay': 'Harvest when ready',
  'Harvest — do not delay': 'Harvest when ready',
  'Harvest promptly — brown rot risk is high': 'Harvest before brown rot develops',
  'Harvest — brown rot risk is high': 'Harvest before brown rot develops',
  'Harvest promptly — store in warm dry conditions': 'Harvest and store in warm dry conditions',
  'Harvest — store in warm dry conditions': 'Harvest and store in warm dry conditions',
  'Harvest early and promptly': 'Harvest early at 4–5cm',
  'Harvest early and quickly': 'Harvest early at 4–5cm',
  'Harvest early and': 'Harvest early at 4–5cm',
  'Harvest promptly at 4-5cm': 'Harvest at 4–5cm',
  'Harvest promptly at ripeness': 'Harvest when ripe',
  'Harvest at ripeness': 'Harvest when ripe',
  'Harvest promptly when tops yellow': 'Harvest when tops yellow',
  'Harvest promptly in warm season': 'Harvest in warm season',
  'Harvest promptly before heat returns': 'Harvest before heat returns',
  'Harvest promptly': 'Harvest when ready',
  'Harvest': 'Harvest when mature',
  'Thin to 5cm — promptly': 'Thin to 5cm spacing',
  'Thin to 5cm —': 'Thin to 5cm spacing',
  'Thin to 5cm — partial shade preferred': 'Thin to 5cm spacing',
  'Thin': 'Thin seedlings to final spacing',
  'Thin and water consistently': 'Thin to final spacing',
  'Check for fruit fly — manage promptly': 'Check for fruit fly',
  'Check for fruit fly — manage': 'Check for fruit fly',
  'Install support immediately': 'Install plant supports',
  'Install support': 'Install plant supports',
  'Erect trellis immediately': 'Erect trellis',
  'Erect trellis and train immediately': 'Erect trellis and train shoots',
  'Erect trellis and train': 'Erect trellis and train shoots',
  'Net immediately at petal fall': 'Net trees at petal fall',
  'Net immediately for caterpillar control': 'Net for caterpillar control',
  'Net immediately for insect control': 'Net for insect control',
  'Net immediately when colour begins': 'Net when fruit begins to colour',
  'Net for insect control': 'Net for insect control',
  'Remove flower stalks immediately': 'Remove flower stalks',
  'Remove flower stalks promptly': 'Remove flower stalks',
  'Remove any yellowing leaves promptly': 'Remove yellowing leaves',
  'Pinch tips immediately when pods appear': 'Pinch tips when pods appear',
  'Pinch tips immediately': 'Pinch tips when needed',
  'Vertical trellis essential for airflow': 'Install vertical trellis',
  'Apply azalea/camellia fertiliser only': 'Apply azalea/camellia fertiliser',
  'Harvest very young tips only': 'Begin harvesting young tips',
  'Harvest young — every 1-2 days': 'Begin harvesting young pods every 1–2 days',
  'Rinse and drain twice daily': 'Begin rinsing and draining twice daily for 7 days',
  'Rinse 3 times daily in warm climates': 'Begin rinsing and draining 3 times daily for 7 days',
  'Harvest can be staged': 'Begin partial harvest from one end of row',
  'Replace every 4-5 years from cuttings': 'Replace plant from cuttings',
  'Replace plant-5 years from cuttings': 'Replace plant from cuttings',
  'Begin harvesting (from year 3)': 'Begin harvesting',
  'Begin harvesting spears (from year 3)': 'Begin harvesting spears',
  'Begin harvesting (from year 2) — pull, do not cut': 'Begin harvesting — pull, do not cut',
  'Do a winter renovation prune (year 3+)': 'Do a winter renovation prune',
  'Prune in winter (year 3+)': 'Prune in winter',
  'Thin fruitlets in spring (year 2+)': 'Thin fruitlets in spring',
  'Remove in second year when flowering begins': 'Remove plant when flowering begins',
  'Remove when flowering begins': 'Remove plant when flowering begins',
  'Replace when bolting in second year': 'Replace plant at bolting',
  'Replace when bolting': 'Replace plant at bolting',
  'Install frost protection every winter': 'Install winter frost protection',
  'Train first-year canes': 'Train new canes',
  'Train first-year canes to trellis wires': 'Train new canes to trellis wires',
  'Potassium at first flower': 'Apply potassium at first flower',
  'Potassium at bulbing': 'Apply potassium at bulbing',
  'Potassium at flowering': 'Apply potassium at flowering',
  'Potassium at flowering and fruiting': 'Apply potassium at flowering',
  'Nitrogen at thinning': 'Apply nitrogen when thinning',
  'Side dress with complete fertiliser': 'Apply complete fertiliser as side dressing',
  'Complete fertiliser + potassium at fruit set': 'Apply complete fertiliser and potassium at fruit set',
  'Complete fertiliser then potassium': 'Apply potassium after complete fertiliser',
  'Complete fertiliser then switch to potassium': 'Switch to potassium fertiliser',
  'Fertilise with potassium': 'Apply potassium fertiliser',
  'Fertilise with native plant fertiliser': 'Apply native plant fertiliser',
  'Fertilise with avocado-specific mix': 'Apply avocado fertiliser',
  'Fertilise with seaweed and trace elements': 'Apply seaweed fertiliser with trace elements',
  'Fertilise after harvest and before flowering': 'Apply fertiliser after harvest',
  'Citrus fertiliser in spring only': 'Apply citrus fertiliser',
  'Apply citrus-specific fertiliser in spring': 'Apply citrus fertiliser',
  'Spring citrus fertiliser — trace elements critical': 'Apply citrus fertiliser with trace elements',
  'Spring citrus fertiliser with trace elements': 'Apply citrus fertiliser with trace elements',
  'Cut-and-come-again from outer leaves': 'Begin harvesting outer leaves — cut-and-come-again',
  'Harvest continuously': 'Begin harvesting regularly',
  'Harvest continuously — fruit fly management critical': 'Begin harvesting regularly — check for fruit fly',
  'Harvest continuously — fruit fly monitoring': 'Begin harvesting regularly — check for fruit fly',
  'Harvest continuously — monitor for fruit fly': 'Begin harvesting regularly — check for fruit fly',
  'Harvest continuously from 15cm height': 'Begin harvesting from 15cm height',
  'Harvest continuously to maintain production': 'Begin harvesting regularly',
  'Harvest outer leaves consistently': 'Begin harvesting outer leaves regularly',
  'Harvest outer stems regularly': 'Begin harvesting outer stems regularly',
  'Harvest shoot tips continuously': 'Begin harvesting shoot tips regularly',
  'Harvest young leaves frequently': 'Begin harvesting young leaves regularly',
  'Harvest young and frequently': 'Begin harvesting young leaves regularly',
  'Harvest young and often': 'Begin harvesting young leaves regularly',
  'Harvest small and frequently': 'Begin harvesting small leaves regularly',
  'Harvest frequently — cut-and-come-again': 'Begin harvesting — cut-and-come-again',
  'Harvest frequently to delay bolting': 'Begin harvesting leaves to delay bolting',
  'Harvest whenever fruit ripens': 'Begin harvesting fruit when ripe',
  'Harvest in dry season only': 'Begin harvesting in dry season',
  'Harvest in the cooler months only': 'Begin harvesting in cooler months',
  'Harvest minimally in winter only': 'Begin light harvest in winter',
  'Year-round cut-and-come-again harvest': 'Begin harvesting — cut-and-come-again',
  'Year-round harvest': 'Begin harvesting',
  'Year-round harvest of young tips': 'Begin harvesting young tips',
  'Year-round production — harvest as needed': 'Begin harvesting as needed',
  'Harvest year-round — Eureka and Lisbon are ever-bearing': 'Begin harvesting when fruit is ripe',
  'Harvest year-round — peak at pre-flowering stage': 'Begin harvesting at pre-flowering stage',
  'Harvest ripe fruit — year-round in tropical zones': 'Begin harvesting ripe fruit',
  'Harvest green or yellow — year-round': 'Begin harvesting leaves or stems',
  'Allow breba crop to develop': 'Leave breba fruit on plant',
  'Allow ratoons to develop': 'Select ratoon shoots for next crop',
  'Check plant health after establishment': 'Check plant for pests and disease',
  'Train canes and manage water carefully': 'Train canes onto trellis',
  'Improve drainage for wet season': 'Improve bed drainage before wet season',
  'Drip irrigation and mulch': 'Install drip irrigation and apply mulch',
  'Mulch and water in dry periods': 'Apply mulch',
  'Deep watering in dry periods': 'Water deeply during dry spell',
  'Deep watering through dry months': 'Water deeply during dry spell',
  'Summer mulch and watering': 'Apply summer mulch',
  'Thin and apply liquid fertiliser': 'Thin seedlings and apply liquid fertiliser',
};

const REMOVE_TITLE_PATTERNS = [
  /^Not (recommended|suitable)\b/i,
  /^Withhold harvest\b/i,
  /^Plan for\b/i,
  /^Review (alternative|heat-tolerant)/i,
  /^Assess local climate\b/i,
  /^Grow (in|as|primarily)\b/i,
  /^Plant\b/i,
  /^Sow\b/i,
  /^Direct sow\b/i,
  /^Start indoors\b/i,
  /^Raise seedlings\b/i,
  /^Soak seed\b/i,
  /^Select and plant\b/i,
  /^Year-round planting\b/i,
  /^Harden off\b/i,
  /^Cool (dry )?season\b/i,
  /^Dry season (—|sowing|planting|crop)/i,
  /^Adjust watering\b/i,
  /^Avoid overwatering/i,
  /^Do not (disturb|leave|fertilise)/i,
  /^No fertiliser needed$/i,
  /^Use (wild rocket|ericaceous fertiliser only|fresh rather than storing)/i,
  /^Low-chill (Japanese )?varieties only\b/i,
  /^Ultra[- ]?low chill\b/i,
  /^Table grape varieties only$/i,
  /^Specialty tropical\b/i,
  /^Valencia type performs best$/i,
  /^Tropical varieties in dry season only$/i,
  /^Short-day varieties only\b/i,
  /^June planting only\b/i,
  /^Elevated, cool position only$/i,
  /^Partial shade essential$/i,
  /^Permanent shade and constant water essential$/i,
  /^Exclusion netting recommended$/i,
  /^Shade cloth.*recommended$/i,
  /^Install cool running water\b/i,
  /\(for how long\?\)/i,
  /^Apply .+ monthly through growing season$/i,
  /^Apply heavy monthly feeding through growing season$/i,
  /^Apply liquid fertiliser fortnightly for 8 weeks$/i,
  /^Apply liquid fertiliser every 2 weeks for 8 weeks$/i,
  /^Apply light liquid fertiliser fortnightly for 8 weeks$/i,
  /^Apply liquid nitrogen fortnightly for 8 weeks$/i,
  /^Apply complete fertiliser and potassium fortnightly for 8 weeks$/i,
  /^before planting$/i,
  /^Pollinate if growing under cover$/i,
  /^Hand pollinate if bees are (absent|few)$/i,
  /^Improve drainage before planting$/i,
  /^Test soil pH before planting$/i,
  /^Position plants for maximum airflow$/i,
  /^Improve airflow in humid conditions$/i,
  /^Provide maximum warmth\b/i,
  /^Keep in cool environment$/i,
  /^Native plant fertiliser (2-3 times yearly|twice yearly)$/i,
  /^Low-phosphorus (native fertiliser 3x yearly|fertiliser — native-sensitive)$/i,
  /^Three (annual fertiliser applications|fertiliser applications per year)$/i,
  /^Quarterly fertiliser (applications|program)$/i,
  /^Year-round fertiliser program\b/i,
  /^Apply fertiliser monthly through growing season$/i,
  /^Apply fertiliser monthly from spring through autumn$/i,
  /^Apply complete fertiliser monthly through growing season$/i,
  /^Apply heavy monthly feeding through growing season$/i,
  /^Apply nitrogen at establishment, then liquid feed monthly for 12 weeks$/i,
  /^Apply (balanced fertiliser|nitrogen fertiliser)$/i,
  /^Apply fertiliser consistently through growing season$/i,
  /^Apply nitrogen monthly through growing season$/i,
  /^Apply complete fertiliser and potassium monthly through growing season$/i,
  /^Apply complete fertiliser then potassium$/i,
  /^Apply fertiliser with micronutrients$/i,
  /^Apply fertiliser and potassium at fruit set$/i,
  /^Potassium and phosphorus only$/i,
  /^Calcium \+ monthly potassium$/i,
  /^Light (feeding|fertiliser) only$/i,
  /^Feed heavily at establishment$/i,
  /^Check plant health after establishment$/i,
  /^Water (daily|regularly|fortnightly|lightly|minimally|sparingly|shallowly|steadily)/i,
  /^Water deeply\b/i,
  /^Water every \d+ days in dry/i,
  /^Water in dry season — manage/i,
  /^Water at (root zone|soil level)/i,
  /^Deep (watering|mulch and)/i,
  /^Daily watering/i,
  /^Daily water change/i,
  /^Steady irrigation/i,
  /^Irrigation through dry season$/i,
  /^Irrigate (sparingly|with pH)/i,
  /^Supplement water through winter/i,
  /^Mulch and (water|summer)/i,
  /^Summer mulch and watering$/i,
  /^Consistent /i,
  /^Establish /i,
  /^Thin and water consistently$/i,
];

const KEEP_TITLE_PATTERNS = [
  /^Begin harvesting/i,
  /^Begin (cut-and-come-again|harvest|outer-leaf|harvesting spears)/i,
  /^Water at (silking|pod fill)$/i,
  /^Stop (water|watering|nitrogen)/i,
  /^Reduce (water|watering)/i,
  /^Withhold water/i,
  /^Change water regularly/i,
  /^Rinse \d times daily/i,
  /^Check for/i,
  /^Check (blanching|bulb|chill|fruit|head|laterals|plant|pollination|progress|ripeness|root|shaft|silk|swollen)/i,
  /^Harvest /i,
  /^Harvest$/i,
  /^Thin /i,
  /^Remove /i,
  /^Apply /i,
  /^Install /i,
  /^Net /i,
  /^Blanch /i,
  /^Prune /i,
  /^Do a /i,
  /^Do winter /i,
  /^Do not protect from frost/i,
  /^Do minimal /i,
  /^Divide plant$/i,
  /^Collect seed/i,
  /^Succession sow/i,
  /^Sow next succession$/i,
  /^Pinch /i,
  /^Top /i,
  /^Train /i,
  /^Stake /i,
  /^Earth up/i,
  /^Hill up/i,
  /^Cut /i,
  /^Bag and harvest/i,
  /^Clear plants/i,
  /^Cure for sweetness$/i,
  /^Undertake aggressive summer pruning$/i,
  /^Summer prune/i,
  /^Hard prune/i,
  /^Tip-prune/i,
  /^Switch to potassium/i,
  /^Side(-| )dress/i,
  /^Complete (harvest|fertiliser)/i,
  /^Cover with fine mesh$/i,
  /^Protect from/i,
  /^Provide (afternoon shade|shade and water)/i,
  /^Move (outdoors|to light|to shade)/i,
  /^Leave (some plants|in ground|breba)/i,
  /^Select (hermaphrodite|ratoons|Southern Highbush|variety carefully)/i,
  /^Identify and thin/i,
  /^Refresh plant/i,
  /^Replace /i,
  /^Resume watering/i,
  /^Pick /i,
  /^Overwinter/i,
  /^Bring container plants indoors/i,
  /^Use low-nitrogen fertiliser only$/i,
  /^Transplant (firmly|deeply)/i,
  /^Erect /i,
  /^Fruit fly exclusion bagging$/i,
  /^Preventive sulfur spray/i,
  /^Potassium emphasis/i,
  /^Pull before spring heat$/i,
  /^Trellis and shade cloth$/i,
  /^Trim to manage spread$/i,
  /^Straw mulch in winter$/i,
  /^Support /i,
  /^Winter prune and apply fertiliser$/i,
];

export function canonicalizeTitle(title) {
  const t = title.trim();
  return CANONICAL_TITLES[t] ?? t;
}

export function shouldRemoveActivity(title, _category = '', timing = 0) {
  const t = canonicalizeTitle(title.trim());
  if (!t) return true;

  for (const pat of REMOVE_TITLE_PATTERNS) {
    if (pat.test(t)) return true;
  }

  for (const keep of KEEP_TITLE_PATTERNS) {
    if (keep.test(t)) return false;
  }

  if (/^Establish /i.test(t) && !/^Establish a single permanent trunk$/i.test(t)) return true;

  if (/^Transplant\b/i.test(t) && !/^Transplant (firmly|deeply)/i.test(t)) return true;

  if (/\bevery \d+[-–]?\d* (years|months|weeks)\b/i.test(t)) return true;

  // Truncated / broken titles
  if (/\band$|\bwhen$|\b—\s*$/i.test(t)) return true;
  if (/^Harvest\s*—\s*$/i.test(t)) return true;

  return false;
}

const TITLE_REWRITES = [
  [/^Control pests — (.+)$/i, 'Check for $1'],
  [/^Complete by October$/i, 'Complete harvest by October'],
  [/^Vertical trellis essential for airflow$/i, 'Install vertical trellis'],
  [/^Allow 3-5m run or train vertically$/i, 'Train vertically or provide 3–5m run space'],
  [/^Divide every \d+[-–]?\d* years$/i, 'Divide plant'],
  [/^Divide and refresh annually$/i, 'Divide plant'],
  [/^Replace (plants )?every \d+/i, 'Replace plant'],
  [/^Replace from cuttings every \d+/i, 'Replace plant from cuttings'],
  [/^Refresh with (cuttings|new divisions) every \d+/i, 'Refresh plant from cuttings'],
  [/^Hard prune at wet season (onset|start)$/i, 'Hard prune'],
  [/^Cut back hard in (the )?wet season$/i, 'Cut back hard'],
  [/^Guide onto trellis promptly$/i, 'Train shoots onto trellis'],
  [/^Train single trunk promptly$/i, 'Train single trunk'],
  [/^Install support early$/i, 'Install plant supports'],
  [/^Stake and support plants early$/i, 'Stake and support plants'],
  [/^Mulch and (stake or support if needed|protect)$/i, 'Apply mulch'],
  [/^Exclusion netting from transplant$/i, 'Install exclusion netting'],
  [/^Exclusion netting for caterpillar control$/i, 'Install exclusion netting for caterpillars'],
];

const DAYS_PER_YEAR = 365;

/**
 * Move year references from title into timing (days since planting).
 * e.g. "(from year 3)" at day 730 → title "Begin harvesting", day 1095.
 */
export function normalizeYearFraming(act) {
  let { activity, timing, details } = act;
  const t = activity.trim();
  let day = typeof timing === 'number' ? timing : 0;

  const fromYear = t.match(/\(from year (\d+)\)/i);
  if (fromYear) {
    const years = parseInt(fromYear[1], 10);
    day = Math.max(day, years * DAYS_PER_YEAR);
    activity = t
      .replace(/\s*\(from year \d+\)/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  const yearPlus = t.match(/\(year (\d+)\+\)/i);
  if (yearPlus) {
    const years = parseInt(yearPlus[1], 10);
    day = Math.max(day, years * DAYS_PER_YEAR);
    activity = t.replace(/\s*\(year \d+\+\)/i, '').trim();
  }

  const yearRange = t.match(/\(year (\d+)-(\d+)\+\)/i);
  if (yearRange) {
    const years = parseInt(yearRange[1], 10);
    day = Math.max(day, years * DAYS_PER_YEAR);
    activity = t.replace(/\s*\(year \d+-\d+\+\)/i, '').trim();
  }

  const secondYear = t.match(/\s+in second year\b/i);
  if (secondYear) {
    day = Math.max(day, 2 * DAYS_PER_YEAR);
    activity = t.replace(/\s+in second year\b/i, '').trim();
  }

  if (fromYear || yearPlus || yearRange || secondYear) {
    details = mergeDetails(
      details,
      `Scheduled from approximately year ${fromYear?.[1] || yearPlus?.[1] || yearRange?.[1]} after planting.`
    );
  }

  return { ...act, activity, timing: day, details };
}

export function rewriteActivityTitle(title) {
  let t = title.trim();
  if (!t) return '';

  for (const [pat, repl] of TITLE_REWRITES) {
    if (pat.test(t)) {
      t = t.replace(pat, repl);
      break;
    }
  }

  t = canonicalizeTitle(t);

  // Only strip trailing filler adverbs, not mid-phrase grammar
  t = t
    .replace(/\s+immediately\s*$/i, '')
    .replace(/\s+promptly\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return canonicalizeTitle(t);
}

/**
 * Expand one timeline row into multiple dated tasks where needed.
 * Returns array of activities (may be empty if removed).
 */
export function expandActivity(act) {
  const title = act.activity.trim();
  const day = act.timing ?? 0;

  if (/^Year-round fertiliser program — 3-4 applications$/i.test(title)) {
    return [0, 1, 2, 3].map((i) => ({
      ...act,
      timing: day + i * 91,
      activity: `Apply complete fertiliser (${i + 1} of 4)`,
      details: mergeDetails(
        act.details,
        `Quarterly application ${i + 1} of 4 through the growing year.`
      ),
    }));
  }

  if (/^Native plant fertiliser 2-3 times yearly$/i.test(title)) {
    return [0, 1, 2].map((i) => ({
      ...act,
      timing: day + i * 120,
      activity: `Apply native plant fertiliser (${i + 1} of 3)`,
    }));
  }

  if (/^Three annual fertiliser applications$/i.test(title)) {
    return [0, 1, 2].map((i) => ({
      ...act,
      timing: day + i * 120,
      activity: `Apply complete fertiliser (${i + 1} of 3)`,
    }));
  }

  if (/^Apply nitrogen at establishment, then liquid feed monthly for 12 weeks$/i.test(title)) {
    const feeds = [
      { timing: Math.max(2, day), activity: 'Apply nitrogen fertiliser', category: 'fertilizing' },
      ...[4, 8, 12].map((w, i) => ({
        timing: day + w * 7,
        activity: `Apply liquid fertiliser (${i + 1} of 3)`,
        category: 'fertilizing',
        details: act.details,
      })),
    ];
    return feeds.map((f) => ({ ...act, ...f }));
  }

  const monthlyGrowing = title.match(
    /^Apply (.+?) (?:and potassium )?monthly through growing season$/i
  );
  if (monthlyGrowing) {
    const product = monthlyGrowing[1];
    return [0, 1, 2, 3].map((i) => ({
      ...act,
      timing: day + i * 30,
      activity: `Apply ${product}${/potassium/i.test(title) ? ' and potassium' : ''} (${i + 1} of 4)`,
    }));
  }

  if (/^Apply heavy monthly feeding through growing season$/i.test(title)) {
    return [0, 1, 2, 3].map((i) => ({
      ...act,
      timing: day + i * 30,
      activity: `Apply complete fertiliser (${i + 1} of 4)`,
    }));
  }

  const fortnight8 = title.match(/^Apply (.+?) (?:fortnightly for 8 weeks|every 2 weeks for 8 weeks)$/i);
  if (fortnight8) {
    const product = fortnight8[1];
    return [0, 1, 2, 3].map((i) => ({
      ...act,
      timing: day + i * 14,
      activity: `Apply ${product} (${i + 1} of 4)`,
    }));
  }

  const firstNYears = title.match(/^(.+?)\s+(?:in|for) first (\d+) years$/i);
  if (firstNYears) {
    const baseTitle = firstNYears[1].trim();
    const n = parseInt(firstNYears[2], 10);
    return Array.from({ length: n }, (_, i) => ({
      ...act,
      timing: Math.max(day, (i + 1) * DAYS_PER_YEAR),
      activity: baseTitle,
      details: mergeDetails(
        act.details,
        `Establishment year ${i + 1} of ${n} after planting.`
      ),
    }));
  }

  return [act];
}

function mergeDetails(existing, addition) {
  const e = (existing || '').trim();
  const a = (addition || '').trim();
  if (!a) return e;
  if (!e) return a;
  if (e.toLowerCase().includes(a.toLowerCase().slice(0, 20))) return e;
  return `${e} ${a}`;
}

export function adjustActivityTiming(title, timing, category) {
  let day = typeof timing === 'number' ? timing : 0;
  const t = title.trim();

  const setupAtPlanting =
    /^(Apply mulch|Install|Stake|Erect|Net|Cover with|Apply fertiliser|Apply light|Transplant firmly|Provide afternoon|Apply shade|Train|Pinch|Thin to strongest)/i.test(
      t
    ) || (category === 'planting' && /support|trellis|mulch|stake|net/i.test(t));

  if (day === 0 && setupAtPlanting) {
    day = /^Apply (fertiliser|light|nitrogen)/i.test(t) ? 2 : 1;
  }

  if (day === 0 && /^(Begin harvesting|Check|Harvest|Thin |Remove |Prune |Stop )/i.test(t)) {
    day = Math.max(1, day);
  }

  return day;
}
