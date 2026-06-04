import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const csvPath = path.join(root, 'plant_timelines_corrected.csv');

let content = fs.readFileSync(csvPath, 'utf8');
const before = content.length;
while (content.includes('""""')) {
  content = content.replace(/""""/g, '""');
}
fs.writeFileSync(csvPath, content, 'utf8');
console.log(`Repaired ${csvPath} (${before} → ${content.length} bytes)`);
