import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { extractLegacyHtml, sha256, SUBJECT_IDS } from './lib/legacy.mjs';

const file = process.argv.slice(2).find((s) => !s.startsWith('--'));
const rootFlag = process.argv.indexOf('--root');
const root = resolve(rootFlag >= 0 ? process.argv[rootFlag + 1] : '.');
if (!file) {
  console.error('Usage: npm run import:legacy -- /path/to/Orbit_2_6_Profiles_Studio_Offline.html');
  process.exit(2);
}
const original = readFileSync(resolve(file));
const html = original.toString('utf8');
const { shell, banks } = extractLegacyHtml(html);
const dataDir = join(root, 'src', 'data');
mkdirSync(dataDir, { recursive: true });
writeFileSync(join(root, 'src', 'orbit.shell.html'), shell);
for (const id of SUBJECT_IDS) writeFileSync(join(dataDir, id + '.json'), banks[id]);
const manifest = {
  importedAt: new Date().toISOString(),
  inputName: file.split(/[\\/]/).pop(),
  originalBytes: original.byteLength,
  originalSha256: sha256(original),
  htmlTextSha256: sha256(html),
  payloadSha256: Object.fromEntries(SUBJECT_IDS.map((id) => [id, sha256(banks[id])]))
};
writeFileSync(join(dataDir, 'import-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('Imported ' + SUBJECT_IDS.length + ' banks and one HTML shell.');
console.log('Original SHA-256: ' + manifest.originalSha256);
console.log('Next: npm run build && npm run audit && npm test');
