/**
 * Apply activity-title-overrides.json to plant_timelines_corrected.csv.
 * Run: node scripts/normalize-plant-activities.mjs [--in-place]
 * Then: node scripts/extract-plant-tasks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csvPath = path.join(root, 'plant_timelines_corrected.csv');
const overridesPath = path.join(root, 'scripts', 'activity-title-overrides.json');

const { rename, remove } = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));
const removeSet = new Set(remove);

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

const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split(/\r?\n/);
const headerFields = parseCsvLine(lines[0]);
const keyActivitiesIdx = headerFields.indexOf('key_activities');

let renamed = 0;
let removed = 0;
const outLines = [lines[0]];

for (let li = 1; li < lines.length; li++) {
  const line = lines[li];
  if (!line.trim()) {
    outLines.push(line);
    continue;
  }

  const fields = parseCsvLine(line);
  if (fields.length <= keyActivitiesIdx) {
    outLines.push(line);
    continue;
  }

  let activities;
  try {
    activities = parseKeyActivities(fields[keyActivitiesIdx]);
  } catch {
    outLines.push(line);
    continue;
  }

  const next = [];
  for (const act of activities) {
    if (removeSet.has(act.activity)) {
      removed++;
      continue;
    }
    if (rename[act.activity]) {
      act.activity = rename[act.activity];
      renamed++;
    }
    next.push(act);
  }

  fields[keyActivitiesIdx] = formatKeyActivities(next);
  outLines.push(
    fields
      .map((f, i) => (i === keyActivitiesIdx ? `"${f}"` : escapeCsvField(f)))
      .join(',')
  );
}

const outPath = process.argv.includes('--in-place')
  ? csvPath
  : path.join(root, 'plant_timelines_corrected.normalized.csv');

fs.writeFileSync(outPath, outLines.join('\n') + '\n', 'utf8');
console.log(`Wrote ${outPath}`);
console.log(`  Renamed: ${renamed} activities`);
console.log(`  Removed: ${removed} activities`);
if (outPath !== csvPath) {
  console.log('Copy over source:');
  console.log('  Copy-Item plant_timelines_corrected.normalized.csv plant_timelines_corrected.csv -Force');
}
