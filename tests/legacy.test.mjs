import test from 'node:test';
import assert from 'node:assert/strict';
import { extractLegacyHtml, rebuildLegacyHtml, auditBanks, sha256, SUBJECT_IDS } from '../scripts/lib/legacy.mjs';

const sample = (id, unit = 1) => JSON.stringify({
  title: id,
  questions: [{ id: id + '-q1', unit, type: 'single', answer: 2, context: 'shared-one' }],
  shared: { 'shared-one': { title: 'Read this first' } }
});
const fixture = '<!doctype html><html><head></head><body>' +
  SUBJECT_IDS.map((id) => '<script id="' + id + '" type="application/json">' + sample(id) + '</script>').join('') +
  '<script>console.log("other script")</script></body></html>';

test('three subject payloads can be extracted and rebuilt byte for byte', () => {
  const result = extractLegacyHtml(fixture);
  assert.equal(Object.keys(result.banks).length, 3);
  assert.equal(rebuildLegacyHtml(result.shell, result.banks), fixture);
  assert.equal(sha256(fixture), sha256(rebuildLegacyHtml(result.shell, result.banks)));
});

test('unchanged non-data scripts are preserved', () => {
  const result = extractLegacyHtml(fixture);
  assert.ok(result.shell.includes('<script>console.log("other script")</script>'));
});

test('bank audit checks IDs and shared context', () => {
  const { banks } = extractLegacyHtml(fixture);
  assert.deepEqual(auditBanks(banks).errors, []);
});

test('duplicate question IDs are rejected', () => {
  const { banks } = extractLegacyHtml(fixture);
  const obj = JSON.parse(banks['orbit-data']);
  obj.questions.push({ ...obj.questions[0] });
  banks['orbit-data'] = JSON.stringify(obj);
  assert.ok(auditBanks(banks).errors.some((x) => x.includes('duplicate ID')));
});

test('missing context is rejected', () => {
  const { banks } = extractLegacyHtml(fixture);
  const obj = JSON.parse(banks['orbit-ict-data']);
  obj.questions[0].context = 'missing-key';
  banks['orbit-ict-data'] = JSON.stringify(obj);
  assert.ok(auditBanks(banks).errors.some((x) => x.includes('missing shared context')));
});

test('missing required subject payload is rejected', () => {
  const { banks } = extractLegacyHtml(fixture);
  delete banks['orbit-accounting-data'];
  assert.throws(() => rebuildLegacyHtml(fixture, banks));
});
