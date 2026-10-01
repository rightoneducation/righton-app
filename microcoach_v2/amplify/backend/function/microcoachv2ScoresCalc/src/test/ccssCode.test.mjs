import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalCcss, matchStandard, normalizeCode } from '../util/ccssCode.mjs';

// The pair that started this: every misconception in the v10 run carried the left
// spelling, every graph standard the right one.
test('the short form and the canonical form reduce to the same key', () => {
  assert.equal(canonicalCcss('A.REI.3'), canonicalCcss('HSA-REI.B.3'));
  assert.equal(canonicalCcss('A.REI.3'), 'rei.3');
  assert.equal(canonicalCcss('A.CED.3'), canonicalCcss('HSA-CED.A.3'));
  assert.equal(canonicalCcss('A.REI.12'), canonicalCcss('HSA-REI.D.12'));
});

test('K-8 codes keep their grade number', () => {
  assert.equal(canonicalCcss('8.EE.C.8'), '8.ee.8');
  assert.equal(canonicalCcss('8.EE.8'), '8.ee.8');
  // The filter drops single letters, not single characters, so grades survive and
  // the same standard number in two grades stays distinct.
  assert.notEqual(canonicalCcss('7.EE.4'), canonicalCcss('8.EE.4'));
});

test('distinct standards in one domain stay distinct', () => {
  assert.notEqual(canonicalCcss('HSA-REI.D.10'), canonicalCcss('HSA-REI.D.12'));
  assert.notEqual(canonicalCcss('HSA-REI.B.3'), canonicalCcss('HSA-CED.A.3'));
});

test('spacing, case and dash style do not matter', () => {
  const want = canonicalCcss('HSA-REI.B.3');
  for (const v of [' hsa-rei.b.3 ', 'HSA–REI.B.3', 'hsa-REI.B.3', 'HSA-REI.B.3']) {
    assert.equal(canonicalCcss(v), want, v);
  }
});

test('empty and junk input do not throw', () => {
  for (const v of [null, undefined, '', '   ']) assert.equal(canonicalCcss(v), '');
  assert.equal(normalizeCode(null), '');
});

const GRAPH = [
  { code: 'HSA-REI.D.12', futureDependentStandards: [{ code: 'HSA-CED.A.3' }] },
  { code: '8.EE.C.8', futureDependentStandards: [] },
  { code: 'HSA-REI.B.3', futureDependentStandards: [{ code: 'a' }, { code: 'b' }, { code: 'c' }] },
];

test('matchStandard prefers an exact match and says so', () => {
  const r = matchStandard('8.EE.C.8', GRAPH);
  assert.equal(r.standard.code, '8.EE.C.8');
  assert.equal(r.matchedBy, 'exact');
});

test('matchStandard falls back to the canonical key and reports it', () => {
  const r = matchStandard('A.REI.3', GRAPH);
  assert.equal(r.standard.code, 'HSA-REI.B.3');
  assert.equal(r.matchedBy, 'canonical');
  assert.equal(r.standard.futureDependentStandards.length, 3);
});

test('a genuinely absent standard still misses', () => {
  const r = matchStandard('HSF-IF.A.1', GRAPH);
  assert.equal(r.standard, null);
  assert.equal(r.matchedBy, null);
});

test('no code, no match, no throw', () => {
  assert.deepEqual(matchStandard(null, GRAPH), { standard: null, matchedBy: null });
  assert.deepEqual(matchStandard('A.REI.3', []), { standard: null, matchedBy: null });
  assert.deepEqual(matchStandard('A.REI.3', undefined), { standard: null, matchedBy: null });
});
