import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { band, linearSaturating, scoreOne, rank } from '../scoreRubric.mjs';

const rubric = JSON.parse(readFileSync(new URL('../misconceptionRubric.json', import.meta.url), 'utf8'));
const metric = (id) => rubric.metrics.find((m) => m.id === id);

const full = (over = {}) => ({
  studentPercent: 0.3, downstreamCount: 1, meanConfidence: 3.5, conceptualDepth: 2, ...over,
});

test('frequency is continuous and saturates at half the class', () => {
  const sc = metric('frequency').scale;
  assert.equal(linearSaturating(0, sc), 0);
  assert.equal(linearSaturating(0.50, sc), 3);
  assert.equal(linearSaturating(0.90, sc), 3);      // flat above the saturation point
  assert.equal(linearSaturating(1, sc), 3);
  assert.equal(linearSaturating(0.25, sc), 1.5);    // linear below it
  assert.ok(Math.abs(linearSaturating(0.10, sc) - 0.6) < 1e-9);
});

// The reason for going continuous: reaches that differ must score differently.
test('reaches the doc\'s bands flattened now separate', () => {
  const sc = metric('frequency').scale;
  const at = (p) => linearSaturating(p, sc);
  // All three scored 2 under the >25–50% band.
  assert.ok(at(0.29) < at(0.39) && at(0.39) < at(0.43), 'expected 29% < 39% < 43%');
});

test('the doc\'s original bands are kept in the config as the record', () => {
  const docBands = metric('frequency').docBands;
  assert.equal(docBands.length, 4);
  assert.equal(band(0.51, docBands), 3);
  assert.equal(band(0.10, docBands), 0);
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

test('a full row reports 0-3 scores and a weighted total out of 30', () => {
  // 30% of the class → 30/50 × 3 = 1.8 on the continuous frequency scale.
  const r = scoreOne(full(), rubric);
  assert.deepEqual(r.scores, {
    frequency: 1.8, learningProgressionInfluence: 1, studentConfidence: 2, conceptualDepth: 2,
  });
  // Weighted 3/1/3/3: 5.4 + 1 + 6 + 6.
  assert.deepEqual(r.weighted, {
    frequency: 5.4, learningProgressionInfluence: 1, studentConfidence: 6, conceptualDepth: 6,
  });
  assert.equal(r.total, 18.4);
  assert.equal(r.maxPossible, 30);
  assert.deepEqual(r.missing, []);
  assert.equal('lcMisconceptionEvalScore' in r.scores, false);
});

// The point of the weighting: progression cannot outweigh share of class.
test('progression carries a third of the weight of the other metrics', () => {
  const lowReachHighProgression = scoreOne(full({ studentPercent: 0.11, downstreamCount: 5 }), rubric);
  const highReachLowProgression = scoreOne(full({ studentPercent: 0.43, downstreamCount: 1 }), rubric);
  assert.equal(lowReachHighProgression.scores.learningProgressionInfluence, 3);
  assert.equal(highReachLowProgression.scores.learningProgressionInfluence, 1);
  assert.ok(
    highReachLowProgression.total > lowReachHighProgression.total,
    `expected reach to win: ${highReachLowProgression.total} vs ${lowReachHighProgression.total}`,
  );
});

// What the continuous scale buys: a four-point reach gap changes the total.
test('a small difference in reach changes the total', () => {
  const a = scoreOne(full({ studentPercent: 0.39 }), rubric);
  const b = scoreOne(full({ studentPercent: 0.43 }), rubric);
  assert.ok(b.total > a.total, `expected 43% to beat 39%: ${b.total} vs ${a.total}`);
});

test('a null input is missing, not zero, and drops its own weight from the max', () => {
  const r = scoreOne(full({ downstreamCount: null }), rubric);
  assert.equal(r.scores.learningProgressionInfluence, null);
  assert.equal(r.weighted.learningProgressionInfluence, null);
  assert.deepEqual(r.missing, ['learningProgressionInfluence']);
  // Progression's weight is 1, so the max falls 30 → 27, not by an average share.
  assert.equal(r.maxPossible, 27);
  assert.equal(r.total, 17.4);
});

test('LC transform applies when the metric is enabled', () => {
  const on = { ...rubric, metrics: rubric.metrics.map((m) => (m.id === 'lcMisconceptionEvalScore' ? { ...m, enabled: true } : m)) };
  const r = scoreOne(full({ lcScore: 80 }), on);
  assert.equal(r.scores.lcMisconceptionEvalScore, 2.4);
  // Enabling it at weight 3 lifts the maximum 30 → 39.
  assert.equal(r.maxPossible, 39);
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
