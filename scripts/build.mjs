import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { rebuildLegacyHtml, sha256, SUBJECT_IDS } from './lib/legacy.mjs';

const rootFlag = process.argv.indexOf('--root');
const root = resolve(rootFlag >= 0 ? process.argv[rootFlag + 1] : '.');
const shellPath = join(root, 'src', 'orbit.shell.html');
const dataDir = join(root, 'src', 'data');
let html;
try {
  const shell = readFileSync(shellPath, 'utf8');
  const banks = Object.fromEntries(SUBJECT_IDS.map((id) => [id, readFileSync(join(dataDir, id + '.json'), 'utf8')]));
  html = rebuildLegacyHtml(shell, banks);
} catch (err) {
  console.error('Build failed: ' + err.message);
  console.error('Import a licensed local Orbit HTML first (see README.md).');
  process.exit(1);
}
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'orbit.html'), html);
const hash = sha256(Buffer.from(html, 'utf8'));
console.log('Built dist/orbit.html (' + Buffer.byteLength(html) + ' bytes) SHA-256 ' + hash);
try {
  const manifest = JSON.parse(readFileSync(join(dataDir, 'import-manifest.json'), 'utf8'));
  if (manifest.originalSha256 !== hash) {
    console.warn('WARNING: Build hash differs from the original imported artifact. Expected ' + manifest.originalSha256);
  } else {
    console.log('Verified: output is byte-identical to original input.');
  }
} catch {
  console.log('No import manifest available for byte-for-byte comparison.');
}
