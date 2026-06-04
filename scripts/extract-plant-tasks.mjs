import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csv = fs.readFileSync(path.join(root, 'plant_timelines_corrected.csv'), 'utf8');

const activities = new Set();
const categories = new Set();

for (const m of csv.matchAll(/""activity"":\s*""([^"]+)""/g)) {
  activities.add(m[1].trim());
}

for (const m of csv.matchAll(/""category"":\s*""(planting|pest|pruning|harvest|watering|fertilizing)""/g)) {
  categories.add(m[1]);
}

const sorted = [...activities].sort((a, b) => a.localeCompare(b));
const outPath = path.join(root, 'docs', 'plant-tasks-extract.txt');
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const body = [
  '# GrowGuide — unique plant activity titles',
  `# Source: plant_timelines_corrected.csv`,
  `# Pipeline: node scripts/refine-plant-activities.mjs --in-place`,
  `#          node scripts/generate-empty-zone-tasks.mjs --in-place  (if needed)`,
  `#          node scripts/extract-plant-tasks.mjs`,
  `# Rules: scripts/plant-activity-rules.mjs`,
  `# Generated: ${new Date().toISOString()}`,
  `# Total unique activities: ${sorted.length}`,
  `# Categories in CSV: ${[...categories].sort().join(', ')}`,
  '',
  '## Activity categories (database)',
  '- planting, fertilizing, pruning, pest, harvest, watering',
  '',
  '## App task categories (UI / taskListBuilders)',
  '- planting, fertilizing, pruning, pest, harvest, climate, other',
  '',
  '## Generic template activities (plants-definitions.json)',
  '- Transplant seedlings (if planted in pots)',
  '- Apply fertilizer',
  '- Check for pests and disease',
  '- Apply mulch around plants',
  '- Begin harvesting',
  '',
  '## Unique activity titles (canonical CSV)',
  ...sorted.map((a) => `- ${a}`),
  '',
].join('\n');

fs.writeFileSync(outPath, body, 'utf8');
console.log(`Wrote ${sorted.length} activities to ${outPath}`);
