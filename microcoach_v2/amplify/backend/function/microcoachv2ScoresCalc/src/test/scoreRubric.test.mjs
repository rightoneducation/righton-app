import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { band, linearSaturating, scoreOne, rank, middleValue } from '../scoreRubric.mjs';

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
  // Weighted 3/1/3/3, depth scaled by frequency's share (1.8 / 3 = 0.6):
  // 5.4 + 1 + 6 + 6 × 0.6.
  assert.deepEqual(r.weighted, {
    frequency: 5.4, learningProgressionInfluence: 1, studentConfidence: 6, conceptualDepth: 3.6,
  });
  assert.equal(r.total, 16);
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
  assert.equal(r.total, 15);
});

test('LC transform applies when the metric is enabled', () => {
  const on = { ...rubric, metrics: rubric.metrics.map((m) => (m.id === 'lcMisconceptionEvalScore' ? { ...m, enabled: true } : m)) };
  const r = scoreOne(full({ lcScore: 80 }), on);
  assert.equal(r.scores.lcMisconceptionEvalScore, 2.4);
  // Enabling it at weight 3 lifts the maximum 30 → 39.
  assert.equal(r.maxPossible, 39);
});

// Depth scales reach (misconceptionRubric.json, conceptualDepth.scaledBy). With the
// other metrics equal, a conceptual misconception outranks a procedural one unless
// the procedural one reaches more than twice as many students.
const pct = (students) => students / 28;
const sameOtherwise = (over) => full({ downstreamCount: 1, meanConfidence: 3.5, ...over });

test('depth counts in proportion to reach, up to its full weight at the reach maximum', () => {
  const atMax = scoreOne(sameOtherwise({ studentPercent: 0.5, conceptualDepth: 3 }), rubric);
  assert.equal(atMax.weighted.conceptualDepth, 9);
  // Frequency 9 + progression 1 + confidence 6 (2 × 3) + depth 9 = 25.
  assert.equal(atMax.total, 25);
  const tiny = scoreOne(sameOtherwise({ studentPercent: 0.05, conceptualDepth: 3 }), rubric);
  assert.ok(Math.abs(tiny.weighted.conceptualDepth - 0.9) < 1e-9, `got ${tiny.weighted.conceptualDepth}`);
  assert.equal(scoreOne(sameOtherwise({ conceptualDepth: 0 }), rubric).weighted.conceptualDepth, 0);
});

test('a close call still goes to the conceptual misconception (6 students vs 8)', () => {
  const conceptual = scoreOne(sameOtherwise({ studentPercent: pct(6), conceptualDepth: 3 }), rubric);
  const procedural = scoreOne(sameOtherwise({ studentPercent: pct(8), conceptualDepth: 0 }), rubric);
  assert.ok(conceptual.total > procedural.total, `${conceptual.total} vs ${procedural.total}`);
});

test('a much more common procedural misconception beats a rare conceptual one (5 vs 11)', () => {
  const conceptual = scoreOne(sameOtherwise({ studentPercent: pct(5), conceptualDepth: 3 }), rubric);
  const procedural = scoreOne(sameOtherwise({ studentPercent: pct(11), conceptualDepth: 0 }), rubric);
  assert.ok(procedural.total > conceptual.total, `${procedural.total} vs ${conceptual.total}`);
});

test('the crossover is twice the students: 5 vs 10 ties, 5 vs 11 does not', () => {
  const conceptual = scoreOne(sameOtherwise({ studentPercent: pct(5), conceptualDepth: 3 }), rubric);
  const twice = scoreOne(sameOtherwise({ studentPercent: pct(10), conceptualDepth: 0 }), rubric);
  assert.ok(Math.abs(conceptual.total - twice.total) < 1e-9, `${conceptual.total} vs ${twice.total}`);
});

test('depth is missing when there is no reach to scale it by', () => {
  const r = scoreOne(full({ studentPercent: null }), rubric);
  assert.deepEqual(r.missing, ['frequency', 'conceptualDepth']);
  assert.equal(r.weighted.conceptualDepth, null);
  assert.equal(r.scores.conceptualDepth, 2); // the judgment is still reported
  assert.equal(r.maxPossible, 30 - 9 - 9);
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

test('the retained misconception with the widest reach is tagged highest frequency', () => {
  const items = [
    item(full({ studentPercent: 0.18, conceptualDepth: 3, meanConfidence: 4.5 }), 0),
    item(full({ studentPercent: 0.32, conceptualDepth: 3 }), 1),
    item(full({ studentPercent: 0.39, conceptualDepth: 1 }), 2),
    item(full({ studentPercent: 0.45, conceptualDepth: 0, meanConfidence: 1 }), 3), // widest, but not retained
  ];
  const out = rank(items, rubric.selection);
  const tagged = out.filter((x) => x.isHighestFrequency);
  assert.equal(tagged.length, 1);
  assert.equal(tagged[0].raw.studentPercent, 0.39);
  assert.equal(tagged[0].retained, true);
  // A tag only: ranking is unchanged by it.
  assert.deepEqual(out.map((x) => x.priorityRank), [1, 2, 3, 4]);
});

test('a reach tie for highest frequency goes to the better-ranked misconception', () => {
  const items = [
    item(full({ studentPercent: 0.3, conceptualDepth: 1 }), 0),
    item(full({ studentPercent: 0.3, conceptualDepth: 3 }), 1),
  ];
  const out = rank(items, rubric.selection);
  assert.equal(out[0].inputOrder, 1);
  assert.equal(out[0].isHighestFrequency, true);
  assert.equal(out[1].isHighestFrequency, false);
});

test('depth takes the middle of the calls, never rounding a split up', () => {
  assert.equal(middleValue([2, 1, 2]), 2);
  assert.equal(middleValue([0, 3, 1]), 1);
  assert.equal(middleValue([1, null, 2]), 1);   // a call that judged nothing is ignored; even count → lower
  assert.equal(middleValue([3]), 3);
  assert.equal(middleValue([null, null]), null);
});
