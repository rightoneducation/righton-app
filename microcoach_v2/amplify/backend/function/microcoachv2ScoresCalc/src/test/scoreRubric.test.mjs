import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { band, scoreOne, rank } from '../scoreRubric.mjs';

const rubric = JSON.parse(readFileSync(new URL('../misconceptionRubric.json', import.meta.url), 'utf8'));
const metric = (id) => rubric.metrics.find((m) => m.id === id);

const full = (over = {}) => ({
  studentPercent: 0.3, downstreamCount: 1, meanConfidence: 3.5, conceptualDepth: 2, ...over,
});

test('frequency bands are exclusive at the doc boundaries (">10–25%")', () => {
  const b = metric('frequency').bands;
  assert.equal(band(0.10, b), 0);
  assert.equal(band(0.1001, b), 1);
  assert.equal(band(0.25, b), 1);
  assert.equal(band(0.2501, b), 2);
  assert.equal(band(0.50, b), 2);
  assert.equal(band(0.51, b), 3);
  assert.equal(band(0, b), 0);
});

test('confidence bands are inclusive at the doc boundaries ("≥ 2.0")', () => {
  const b = metric('studentConfidence').bands;
  assert.equal(band(1.99, b), 0);
  assert.equal(band(2.0, b), 1);
  assert.equal(band(2.99, b), 1);
  assert.equal(band(3.0, b), 2);
  assert.equal(band(3.99, b), 2);
  assert.equal(band(4.0, b), 3);
});

test('learning progression influence counts downstream standards', () => {
  const b = metric('learningProgressionInfluence').bands;
  assert.equal(band(0, b), 0);
  assert.equal(band(1, b), 1);
  assert.equal(band(2, b), 2);
  assert.equal(band(3, b), 3);
  assert.equal(band(7, b), 3);
});

test('a full row sums four metrics out of 12 with LC disabled', () => {
  const r = scoreOne(full(), rubric);
  assert.deepEqual(r.scores, {
    frequency: 2, learningProgressionInfluence: 1, studentConfidence: 2, conceptualDepth: 2,
  });
  assert.equal(r.total, 7);
  assert.equal(r.maxPossible, 12);
  assert.equal(r.normalized, 7 / 12);
  assert.deepEqual(r.missing, []);
  assert.equal('lcMisconceptionEvalScore' in r.scores, false);
});

test('a null input is missing, not zero', () => {
  const r = scoreOne(full({ downstreamCount: null }), rubric);
  assert.equal(r.scores.learningProgressionInfluence, null);
  assert.deepEqual(r.missing, ['learningProgressionInfluence']);
  assert.equal(r.maxPossible, 9);
  assert.equal(r.total, 6);
});

test('LC transform applies when the metric is enabled', () => {
  const on = { ...rubric, metrics: rubric.metrics.map((m) => (m.id === 'lcMisconceptionEvalScore' ? { ...m, enabled: true } : m)) };
  const r = scoreOne(full({ lcScore: 80 }), on);
  assert.equal(r.scores.lcMisconceptionEvalScore, 2.4);
  assert.equal(r.maxPossible, 15);
});

const item = (raw, inputOrder) => ({ ...scoreOne(raw, rubric), raw, inputOrder });

test('rank orders by normalized, then depth, then studentPercent, then input order', () => {
  const items = [
    item(full({ studentPercent: 0.3, conceptualDepth: 1 }), 0),     // 6/12
    item(full({ studentPercent: 0.3, conceptualDepth: 2 }), 1),     // 7/12
    item(full({ studentPercent: 0.31, conceptualDepth: 1 }), 2),    // 6/12, same depth, higher pct
    item(full({ studentPercent: 0.3, conceptualDepth: 1 }), 3),     // 6/12, identical to #0 → input order
  ];
  const out = rank(items, rubric.selection);
  assert.deepEqual(out.map((x) => x.inputOrder), [1, 2, 0, 3]);
  assert.deepEqual(out.map((x) => x.priorityRank), [1, 2, 3, 4]);
  assert.equal(out[0].isRecommendedFocus, true);
  assert.equal(out.filter((x) => x.isRecommendedFocus).length, 1);
});

test('cap retains exactly selection.cap', () => {
  const items = [0.6, 0.5, 0.4, 0.3, 0.2].map((p, i) => item(full({ studentPercent: p }), i));
  const out = rank(items, rubric.selection);
  assert.equal(out.filter((x) => x.retained).length, rubric.selection.cap);
  assert.deepEqual(out.slice(rubric.selection.cap).map((x) => x.retained), [false, false]);
});

test('a row missing a metric is ranked on normalized, not penalized on total', () => {
  const items = [
    item(full({ studentPercent: 0.3, downstreamCount: null, conceptualDepth: 3 }), 0), // 7/9 = .78
    item(full({ studentPercent: 0.3, downstreamCount: 1, conceptualDepth: 2 }), 1),    // 7/12 = .58
  ];
  const out = rank(items, rubric.selection);
  assert.equal(out[0].inputOrder, 0);
});
