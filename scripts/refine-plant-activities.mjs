/**
 * Refine plant_timelines_corrected.csv — post-plant actionable tasks only.
 * Run: node scripts/refine-plant-activities.mjs --in-place
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
  normalizeYearFraming,
} from './plant-activity-rules.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csvPath = path.join(root, 'plant_timelines_corrected.csv');

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
const keyIdx = parseCsvLine(lines[0]).indexOf('key_activities');

let removed = 0;
let expanded = 0;
let rewritten = 0;
let emptyRows = 0;

const outLines = [lines[0]];

for (let li = 1; li < lines.length; li++) {
  const line = lines[li];
  if (!line.trim()) {
    outLines.push(line);
    continue;
  }

  const fields = parseCsvLine(line);
  if (fields.length <= keyIdx) {
    outLines.push(line);
    continue;
  }

  let activities;
  try {
    activities = parseKeyActivities(fields[keyIdx]);
  } catch {
    outLines.push(line);
    continue;
  }

  const next = [];
  const seen = new Set();

  for (const raw of activities) {
    const act = normalizeYearFraming(raw);

    if (shouldRemoveActivity(act.activity, act.category, act.timing)) {
      removed++;
      continue;
    }

    const candidates = expandActivity(act);
    if (candidates.length > 1) expanded += candidates.length - 1;

    for (const candidate of candidates) {
      const newTitle = rewriteActivityTitle(candidate.activity);
      if (!newTitle || shouldRemoveActivity(newTitle, candidate.category, candidate.timing)) {
        removed++;
        continue;
      }

      if (newTitle !== candidate.activity) rewritten++;

      const timing = adjustActivityTiming(newTitle, candidate.timing, candidate.category);
      const key = `${timing}|${newTitle}|${candidate.category}`;
      if (seen.has(key)) {
        removed++;
        continue;
      }
      seen.add(key);

      next.push({
        ...candidate,
        activity: newTitle,
        timing,
      });
    }
  }

  next.sort((a, b) => a.timing - b.timing);

  if (next.length === 0) emptyRows++;

  fields[keyIdx] = formatKeyActivities(next);
  outLines.push(
    fields.map((f, i) => (i === keyIdx ? `"${f}"` : escapeCsvField(f))).join(',')
  );
}

const outPath = process.argv.includes('--in-place')
  ? csvPath
  : path.join(root, 'plant_timelines_corrected.refined.csv');

fs.writeFileSync(outPath, outLines.join('\n') + '\n', 'utf8');

console.log(`Wrote ${outPath}`);
console.log(`  Removed: ${removed}`);
console.log(`  Rewritten: ${rewritten}`);
console.log(`  Expanded into extra tasks: ${expanded}`);
console.log(`  Rows with no activities left: ${emptyRows}`);
