import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = root;
const report = JSON.parse(fs.readFileSync(path.join(repo, 'reference-original/_CAPTURE_REPORT.json'), 'utf8'));
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
let verified = 0;

for (const entry of report.downloaded) {
  const archivedPath = path.join(repo, 'reference-original', entry.path);
  const localPath = entry.path === 'index.html'
    ? path.join(root, 'public/archive/index.html')
    : path.join(root, 'public', entry.path);
  const source = fs.readFileSync(archivedPath);
  const copy = fs.readFileSync(localPath);
  if (digest(source) !== digest(copy)) {
    throw new Error(`Public copy differs from archive: ${entry.path}`);
  }
  verified += 1;
}

console.log(`Verified ${verified} archived resources are byte-identical in the Vite public directory.`);
