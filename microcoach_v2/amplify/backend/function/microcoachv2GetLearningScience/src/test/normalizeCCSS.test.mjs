import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCCSSCode } from '../util/normalizeCCSS.mjs';

test('grade codes gain cluster candidates and lose sub-standards', () => {
  const clusters = (domain, n) => ['A', 'B', 'C', 'D'].map((c) => `${domain}.${c}.${n}`);
  assert.deepEqual(normalizeCCSSCode('7.NS.3'), ['7.NS.3', ...clusters('7.NS', 3)]);
  assert.deepEqual(normalizeCCSSCode('7.EE.4.a'), ['7.EE.4.a', ...clusters('7.EE', 4)]);
  assert.deepEqual(normalizeCCSSCode('7.NS.A.1.b'), ['7.NS.A.1.b', '7.NS.A.1']);
  assert.deepEqual(normalizeCCSSCode('7.NS.A.3'), ['7.NS.A.3']);
  assert.deepEqual(normalizeCCSSCode('8.EE.C.8'), ['8.EE.C.8']);
});

test('high school codes are unchanged', () => {
  assert.equal(normalizeCCSSCode('A.REI.3')[0], 'HSA-REI.B.3');
  assert.ok(normalizeCCSSCode('A.REI.3').includes('CCSS.Math.Content.HSA-REI.3'));
});
