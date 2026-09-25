import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchByTitle, titleKey } from '../util/matchByTitle.mjs';

const INPUTS = [
  { title: 'Treated coefficient as slope' },
  { title: 'Used solid boundary for strict inequality' },
  { title: 'Shaded wrong half-plane' },
];

test('the heading prefix the model echoed is stripped', () => {
  assert.equal(titleKey('Misconception 1: Treated coefficient as slope'), 'treated coefficient as slope');
  assert.equal(titleKey('Need 2 - Shaded wrong half-plane'), 'shaded wrong half-plane');
  assert.equal(titleKey('  MISCONCEPTION 3 — Shaded   wrong half-plane '), 'shaded wrong half-plane');
});

test('a title that merely contains the word misconception is not mangled', () => {
  assert.equal(titleKey('Misconceptions about slope persist'), 'misconceptions about slope persist');
  assert.equal(titleKey('Needs a common denominator first'), 'needs a common denominator first');
});

test('an exact title at its own position matches on title', () => {
  const r = matchByTitle('Shaded wrong half-plane', INPUTS, 2, 3);
  assert.deepEqual(r, { index: 2, matchedBy: 'title' });
});

// The v11 failure: correct answers, in order, every one discarded.
test('an echoed heading still matches on title', () => {
  for (let i = 0; i < INPUTS.length; i += 1) {
    const r = matchByTitle(`Misconception ${i + 1}: ${INPUTS[i].title}`, INPUTS, i, 3);
    assert.deepEqual(r, { index: i, matchedBy: 'title' }, INPUTS[i].title);
  }
});

test('a reordered reply matches on title, not position', () => {
  const r = matchByTitle('Treated coefficient as slope', INPUTS, 2, 3);
  assert.deepEqual(r, { index: 0, matchedBy: 'title' });
});

test('an unusable title falls back to position when the reply is complete', () => {
  const r = matchByTitle('', INPUTS, 1, 3);
  assert.deepEqual(r, { index: 1, matchedBy: 'position' });
  const r2 = matchByTitle('something else entirely', INPUTS, 0, 3);
  assert.deepEqual(r2, { index: 0, matchedBy: 'position' });
});

test('an incomplete reply does NOT fall back to position', () => {
  // Two rows for three inputs: position is not trustworthy, so refuse to guess.
  assert.deepEqual(matchByTitle('unknown', INPUTS, 0, 2), { index: null, matchedBy: null });
  assert.deepEqual(matchByTitle('unknown', INPUTS, 5, 3), { index: null, matchedBy: null });
});

test('empty inputs and junk do not throw', () => {
  assert.deepEqual(matchByTitle('x', [], 0, 0), { index: null, matchedBy: null });
  assert.deepEqual(matchByTitle(null, undefined, 0, 0), { index: null, matchedBy: null });
  assert.equal(titleKey(null), '');
});
