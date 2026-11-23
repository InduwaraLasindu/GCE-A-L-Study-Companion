import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { auditBanks, SUBJECT_IDS } from './lib/legacy.mjs';

const rootFlag = process.argv.indexOf('--root');
const root = resolve(rootFlag >= 0 ? process.argv[rootFlag + 1] : '.');
let banks;
try {
  banks = Object.fromEntries(SUBJECT_IDS.map((id) => [
    id, readFileSync(join(root, 'src', 'data', id + '.json'), 'utf8')
  ]));
} catch (err) {
  console.error('Audit requires imported data: ' + err.message);
  process.exit(2);
}
const report = auditBanks(banks);
console.log(JSON.stringify(report.subjects, null, 2));
console.log('Errors: ' + report.errors.length + '; warnings: ' + report.warnings.length);
for (const entry of report.errors) console.error('ERROR: ' + entry);
for (const entry of report.warnings.slice(0, 20)) console.warn('WARNING: ' + entry);
if (report.warnings.length > 20) console.warn('More warnings omitted from console.');
if (report.errors.length) process.exit(1);
