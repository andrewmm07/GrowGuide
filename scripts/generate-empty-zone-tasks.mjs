/**
 * Populate empty key_activities for marginal/unsuitable zone rows.
 * Uses nearest same-plant timeline as donor, or category fallback templates.
 *
 * Run: node scripts/generate-empty-zone-tasks.mjs --in-place
 * Then: node scripts/extract-plant-tasks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  shouldRemoveActivity,
  rewriteActivityTitle,
  adjustActivityTiming,
  expandActivity,
} from './plant-activity-rules.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csvPath = path.join(root, 'plant_timelines_corrected.csv');

const ZONE_RANK = {
  '8a': 8, '8b': 9, '9a': 10, '9b': 11, '10a': 12, '10b': 13,
  '11a': 14, '11b': 15, '12a': 16, '12b': 17,
};

function zoneRank(z) {
  return ZONE_RANK[z] ?? 99;
}

function parseCsvLine(line) {
  const fields = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let field = '';
      i++;
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"';
          i += 2;
        } else if (line[i] === '"') {
          i++;
          break;
        } else {
          field += line[i++];
        }
      }
      fields.push(field);
      if (line[i] === ',') i++;
    } else {
      let field = '';
      while (i < line.length && line[i] !== ',') field += line[i++];
      fields.push(field);
      if (line[i] === ',') i++;
    }
  }
  return fields;
}

function escapeCsvField(value) {
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function parseKeyActivities(raw) {
  return JSON.parse(raw.replace(/""/g, '"'));
}

function formatKeyActivities(activities) {
  return JSON.stringify(activities).replace(/"/g, '""');
}

function polishActivities(activities) {
  const next = [];
  const seen = new Set();

  for (const act of activities) {
    if (shouldRemoveActivity(act.activity, act.category, act.timing)) continue;

    const newTitle = rewriteActivityTitle(act.activity);
    if (!newTitle || shouldRemoveActivity(newTitle, act.category, act.timing)) continue;

    for (const candidate of expandActivity({ ...act, activity: newTitle })) {
      const title = rewriteActivityTitle(candidate.activity);
      if (!title || shouldRemoveActivity(title, candidate.category, candidate.timing)) continue;

      const timing = adjustActivityTiming(title, candidate.timing, candidate.category);
      const key = `${timing}|${title}|${candidate.category}`;
      if (seen.has(key)) continue;
      seen.add(key);

      next.push({ ...candidate, activity: title, timing });
    }
  }

  return next.sort((a, b) => a.timing - b.timing);
}

/** Fallback when no donor exists — post-plant care for marginal attempts. */
function fallbackTasks(row) {
  const { plant, zone, category, unsuitable, note, extra } = row;
  const caveat = `Zone ${zone}: ${extra || 'marginal for this climate'}. ${note || ''}`.trim();

  if (/pea|bean/i.test(plant) && category === 'annual_vegetable') {
    return polishActivities([
      { timing: 1, activity: 'Erect trellis', category: 'planting', details: caveat },
      { timing: 14, activity: 'Apply shade cloth', category: 'planting', details: 'Essential in warm zones during flowering.' },
      { timing: 28, activity: 'Apply potassium at first flower', category: 'fertilizing', details: 'Do not add nitrogen — peas fix their own.' },
      { timing: 45, activity: 'Check for aphids', category: 'pest', details: 'Aphids cluster on new growth in warm dry weather.' },
      { timing: 50, activity: 'Begin harvesting young pods every 1–2 days', category: 'harvest', details: 'Harvest very young before heat damages pod quality.' },
      { timing: 65, activity: 'Clear plants at end of season and compost', category: 'planting', details: 'Remove before wet season or extreme heat returns.' },
    ]);
  }

  if (/parsnip|cardoon/i.test(plant)) {
    return polishActivities([
      { timing: 1, activity: 'Apply mulch', category: 'planting', details: caveat },
      { timing: 21, activity: 'Thin to final spacing', category: 'planting', details: 'Thin promptly — warmth accelerates bolting in marginal zones.' },
      { timing: 35, activity: 'Check root size from 35 days', category: 'harvest', details: 'Harvest small before heat makes roots pithy.' },
      { timing: 45, activity: 'Check for premature bolting', category: 'pest', details: 'Bolt ends the crop in warm zones.' },
    ]);
  }

  if (category === 'perennial_vine' && /kiwi/i.test(plant)) {
    return polishActivities([
      { timing: 1, activity: 'Install vertical trellis', category: 'planting', details: caveat },
      { timing: 60, activity: 'Train shoots onto trellis', category: 'planting', details: 'Kiwifruit needs a strong pergola — 200kg when mature.' },
      { timing: 180, activity: 'Check for pests and disease', category: 'pest', details: '' },
      { timing: 365, activity: 'Summer prune — remove excess growth', category: 'pruning', details: 'Cut laterals back to 5 leaves beyond last fruit.' },
      { timing: 730, activity: 'Do a winter dormant prune', category: 'pruning', details: 'Annual structural prune while dormant.' },
    ]);
  }

  if (category === 'perennial_tree' || category === 'perennial_shrub') {
    const tasks = [
      { timing: 1, activity: 'Apply mulch', category: 'planting', details: caveat },
      { timing: 30, activity: 'Check for pests and disease', category: 'pest', details: '' },
    ];

    if (/cherry|peach|nectarine|apricot|plum/i.test(plant)) {
      tasks.push(
        { timing: 60, activity: 'Apply dormant copper spray', category: 'pest', details: 'Apply while leafless if plant is dormant.' },
        { timing: 365, activity: 'Thin fruit when marble size', category: 'harvest', details: 'Only if fruit sets — chill may be insufficient in this zone.' }
      );
    }

    if (/apple|pear/i.test(plant)) {
      tasks.push(
        { timing: 60, activity: 'Apply dormant spray', category: 'pest', details: 'Lime sulfur or copper while leafless.' },
        { timing: 365, activity: 'Do a winter structural prune', category: 'pruning', details: 'Shape for airflow; expect reduced yield in low-chill zones.' }
      );
    }

    if (/blackberry|raspberry/i.test(plant)) {
      tasks.push(
        { timing: 14, activity: 'Install plant supports', category: 'planting', details: 'Post-and-wire trellis for cane fruits.' },
        { timing: 365, activity: 'Remove old canes after harvest', category: 'pruning', details: 'Remove fruited floricanes; train new canes.' }
      );
    }

    if (/blueberry|strawberry/i.test(plant)) {
      tasks.push(
        { timing: 14, activity: 'Apply acidic fertiliser', category: 'fertilizing', details: 'Blueberries need pH 4.5–5.5 — test soil first.' },
        { timing: 90, activity: 'Net for bird protection', category: 'pest', details: 'Net before fruit colours.' }
      );
      if (/strawberry/i.test(plant)) {
        tasks.push({ timing: 120, activity: 'Begin harvesting when fruit is fully coloured', category: 'harvest', details: 'Replace plants every 2–3 years in warm zones.' });
      }
    }

    if (/rhubarb/i.test(plant)) {
      tasks.push(
        { timing: 180, activity: 'Remove flower stalks', category: 'pruning', details: 'Remove at ground level — leaves are toxic if ingested.' },
        { timing: 365, activity: 'Begin light harvest in cooler months only', category: 'harvest', details: 'From year 2 — pull stalks, never cut. Expect poor regrowth without cold winters.' }
      );
    }

    if (unsuitable === 'True' && !tasks.some((t) => t.activity.includes('harvest'))) {
      tasks.push({
        timing: 90,
        activity: 'Check plant vigour — replace if struggling',
        category: 'planting',
        details: 'This variety is unlikely to thrive in zone ' + zone + '. Consider a low-chill or tropical alternative.',
      });
    }

    return polishActivities(tasks);
  }

  if (/broad bean/i.test(plant)) {
    return polishActivities([
      { timing: 1, activity: 'Erect plant supports', category: 'planting', details: caveat },
      { timing: 21, activity: 'Check for aphids', category: 'pest', details: 'Black aphid is common in warm zones.' },
      { timing: 45, activity: 'Pinch tips when pods appear', category: 'pruning', details: 'Encourages branching; reduces black aphid pressure.' },
      { timing: 60, activity: 'Begin harvesting young pods', category: 'harvest', details: 'Harvest before temperatures exceed 21°C at flowering.' },
    ]);
  }

  return polishActivities([
    { timing: 1, activity: 'Apply mulch', category: 'planting', details: caveat },
    { timing: 30, activity: 'Check for pests and disease', category: 'pest', details: '' },
    { timing: 90, activity: 'Check plant vigour', category: 'planting', details: extra || note || '' },
  ]);
}

function findDonor(target, allRows) {
  const candidates = allRows.filter(
    (r) => r.plant === target.plant && r.activities.length > 0 && r.id !== target.id
  );
  if (candidates.length === 0) return null;

  const targetRank = zoneRank(target.zone);
  candidates.sort((a, b) => {
    const da = Math.abs(zoneRank(a.zone) - targetRank);
    const db = Math.abs(zoneRank(b.zone) - targetRank);
    if (da !== db) return da - db;
    return zoneRank(b.zone) - zoneRank(a.zone);
  });

  return candidates[0];
}

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split(/\r?\n/);
const header = parseCsvLine(lines[0]);
const idx = {
  id: header.indexOf('id'),
  plant: header.indexOf('plant_name'),
  zone: header.indexOf('au_hardiness_zone'),
  key: header.indexOf('key_activities'),
  note: header.indexOf('climate_note'),
  unsuitable: header.indexOf('unsuitable_zone'),
  extra: header.indexOf('extra_care'),
  category: header.indexOf('plant_category'),
};

const allRows = [];
for (let li = 1; li < lines.length; li++) {
  if (!lines[li].trim()) continue;
  const f = parseCsvLine(lines[li]);
  let activities = [];
  try {
    activities = parseKeyActivities(f[idx.key]);
  } catch {
    activities = [];
  }
  allRows.push({
    lineIndex: li,
    fields: f,
    id: f[idx.id],
    plant: f[idx.plant],
    zone: f[idx.zone],
    category: f[idx.category],
    unsuitable: f[idx.unsuitable],
    note: f[idx.note],
    extra: f[idx.extra],
    activities,
  });
}

let filled = 0;
const outLines = [lines[0]];

for (let li = 1; li < lines.length; li++) {
  const row = allRows.find((r) => r.lineIndex === li);
  if (!row) {
    outLines.push(lines[li]);
    continue;
  }

  if (row.activities.length > 0) {
    outLines.push(lines[li]);
    continue;
  }

  const donor = findDonor(row, allRows);
  let activities;

  if (donor) {
    const zoneNote = `Adapted for zone ${row.zone} (${row.extra || 'marginal'}).`;
    activities = polishActivities(
      donor.activities.map((a) => ({
        ...a,
        details: `${zoneNote} ${a.details || ''}`.trim(),
      }))
    );
    console.log(`  ${row.plant} ${row.zone}: copied ${activities.length} tasks from ${donor.zone}`);
  }

  if (!activities || activities.length === 0) {
    activities = fallbackTasks(row);
    console.log(`  ${row.plant} ${row.zone}: fallback ${activities.length} tasks`);
  }

  if (activities.length === 0) {
    console.warn(`  WARN: still empty — ${row.plant} ${row.zone}`);
  } else {
    filled++;
  }

  row.fields[idx.key] = formatKeyActivities(activities);
  outLines.push(
    row.fields.map((f, i) => (i === idx.key ? `"${f}"` : escapeCsvField(f))).join(',')
  );
}

const outPath = process.argv.includes('--in-place')
  ? csvPath
  : path.join(root, 'plant_timelines_corrected.with-tasks.csv');

fs.writeFileSync(outPath, outLines.join('\n') + '\n', 'utf8');
console.log(`\nWrote ${outPath}`);
console.log(`Filled ${filled} empty zone rows`);
