// Every kind of material the check reads has a guide, and the audit carries it.
//   node --test test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GUIDE, guideFor } from '../util/templateGuide.mjs';
import { auditPromptFor } from '../util/prompt.mjs';

// The content types the generator writes (NextStepOption's activityContent.mjs CONTENT_TYPES).
const CONTENT_TYPES = ['INCORRECT_WORKED_EXAMPLES', 'FAVORITE_NO', 'MATH_DETECTIVE', 'COMPARE_THE_THINKING', 'MAKE_YOUR_CASE'];

test('every content type and the misconception analysis has a guide', () => {
  for (const type of CONTENT_TYPES) {
    assert.ok(GUIDE[type]?.length > 100, type);
    assert.equal(guideFor('activity', { content: { facilitate: { type } } }), GUIDE[type]);
  }
  assert.equal(guideFor('misconception'), GUIDE.MISCONCEPTION);
});

test('an unknown template still gets the parts every activity has', () => {
  assert.match(guideFor('activity', { content: { facilitate: { type: 'NEW_TEMPLATE' } } }), /takeaway/);
});

test('a Make Your Case claim is described as argued, not asserted', () => {
  assert.match(GUIDE.MAKE_YOUR_CASE, /claim is the position students argue about/);
  assert.match(GUIDE.MAKE_YOUR_CASE, /resolution/);
});

test('the audit prompt includes the guide', () => {
  const prompt = auditPromptFor({ what: 'x', guide: 'GUIDE-TEXT', material: {}, reference: [], rows: [] });
  assert.match(prompt, /## How this material is built\nGUIDE-TEXT/);
});
