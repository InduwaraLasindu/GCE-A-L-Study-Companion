import { createHash } from 'node:crypto';

export const SUBJECT_IDS = ['orbit-data', 'orbit-accounting-data', 'orbit-ict-data'];
export const MARKER_PREFIX = '__ORBIT_PAYLOAD_';
export const sha256 = (value) => createHash('sha256').update(value).digest('hex');

export function extractLegacyHtml(html) {
  if (typeof html !== 'string') throw new TypeError('HTML source must be a string.');
  const banks = {};
  const shell = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (whole, attributes, body) => {
    const id = /\bid=(["'])(.*?)\1/i.exec(attributes)?.[2];
    const type = /\btype=(["'])(.*?)\1/i.exec(attributes)?.[2];
    if (!SUBJECT_IDS.includes(id) || type !== 'application/json') return whole;
    if (Object.hasOwn(banks, id)) throw new Error('Duplicate JSON script ID: ' + id);
    JSON.parse(body);
    banks[id] = body;
    return whole.replace(body, MARKER_PREFIX + id.toUpperCase().replaceAll('-', '_') + '__');
  });
  const missing = SUBJECT_IDS.filter((id) => !Object.hasOwn(banks, id));
  if (missing.length) throw new Error('Missing subject bank(s): ' + missing.join(', '));
  return { shell, banks };
}

export function rebuildLegacyHtml(shell, banks) {
  let html = shell;
  for (const id of SUBJECT_IDS) {
    const marker = MARKER_PREFIX + id.toUpperCase().replaceAll('-', '_') + '__';
    if (html.split(marker).length !== 2) throw new Error('Expected one placeholder for ' + id);
    const payload = banks[id];
    if (typeof payload !== 'string') throw new Error('Missing payload ' + id);
    JSON.parse(payload);
    html = html.replace(marker, payload);
  }
  if (html.includes(MARKER_PREFIX)) throw new Error('Unreplaced payload marker.');
  return html;
}

export function auditBanks(banks) {
  const report = { subjects: {}, errors: [], warnings: [] };
  for (const id of SUBJECT_IDS) {
    let bank;
    try {
      bank = JSON.parse(banks[id]);
    } catch (err) {
      report.errors.push(id + ': invalid JSON (' + err.message + ')');
      continue;
    }
    const questions = bank.questions;
    if (!Array.isArray(questions)) {
      report.errors.push(id + ': questions must be an array');
      continue;
    }
    const seen = new Set();
    const shared = bank.shared || {};
    for (const q of questions) {
      if (!q || typeof q.id !== 'string' || !q.id) {
        report.errors.push(id + ': question has an invalid ID');
        continue;
      }
      if (seen.has(q.id)) report.errors.push(id + ': duplicate ID ' + q.id);
      seen.add(q.id);
      if (!Number.isInteger(q.unit) || q.unit < 1) {
        report.errors.push(id + ': invalid unit for ' + q.id);
      }
      if (q.context && !Object.hasOwn(shared, q.context)) {
        report.errors.push(id + ': missing shared context for ' + q.id);
      }
      if (q.type === 'single' && q.answer !== null && q.answer !== undefined) {
        const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
        if (!answers.length || answers.some((n) => !Number.isInteger(n) || n < 1 || n > 5)) {
          report.errors.push(id + ': invalid option key for ' + q.id);
        }
      }
      if (q.type === 'single' && (q.answer === null || q.answer === undefined)) {
        report.warnings.push(id + ': no auto-grading key for ' + q.id);
      }
    }
    report.subjects[id] = { questions: questions.length, sharedContexts: Object.keys(shared).length };
  }
  return report;
}
