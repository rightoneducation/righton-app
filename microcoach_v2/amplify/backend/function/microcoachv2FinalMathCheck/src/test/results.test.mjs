// What a finished check stores on the session.
//   node --test test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize, describeError, parseOutput, checkItems } from '../util/results.mjs';

const misconception = (i) => ({ kind: 'misconception', i, j: null, templateId: '', misconceptionTitle: `M${i}`, rowsChecked: 60, issues: [] });
const activity = (i, j) => ({ kind: 'activity', i, j, templateId: 'spot-the-slip', misconceptionTitle: `M${i}`, rowsChecked: 20, issues: [] });
const issue = { rowId: 'content.discussion.takeaway', rowLabel: 'Discussion › Takeaway', text: 'x', why: 'y' };

test('all clean', () => {
  const s = summarize([misconception(0), activity(0, 0), activity(0, 1)]);
  assert.equal(s.summary, 'No math issues in 1 misconception and 2 activities');
  assert.equal(s.itemsChecked, 3);
  assert.equal(s.itemsUnchecked, 0);
  assert.equal(s.rowsChecked, 100);
  assert.deepEqual(s.issues, []);
});

test('issues carry where they came from', () => {
  const s = summarize([
    { ...misconception(1), issues: [{ ...issue, rowId: 'wrongAnswers[0].explanation' }] },
    { ...activity(1, 1), issues: [issue] },
  ]);
  assert.equal(s.summary, '2 math issues across 1 misconception and 1 activity');
  assert.deepEqual(s.issues[0], {
    kind: 'misconception', misconceptionIndex: 1, activityIndex: null, misconceptionTitle: 'M1', templateId: '',
    ...issue, rowId: 'wrongAnswers[0].explanation',
  });
  assert.deepEqual(s.issues[1], {
    kind: 'activity', misconceptionIndex: 1, activityIndex: 1, misconceptionTitle: 'M1', templateId: 'spot-the-slip', ...issue,
  });
});

test('an unchecked item is never part of a clean result', () => {
  const s = summarize([misconception(0), { kind: 'activity', i: 0, j: 0, unchecked: true, error: { Error: 'States.Timeout' } }]);
  assert.equal(s.summary, 'No math issues in 1 misconception; 1 activity not checked');
  assert.equal(s.itemsUnchecked, 1);
  assert.deepEqual(s.unchecked, [{ kind: 'activity', misconceptionIndex: 0, activityIndex: 0 }]);
});

test('nothing checked says so', () => {
  assert.equal(summarize([{ kind: 'misconception', i: 0, j: null, unchecked: true }]).summary, 'Nothing could be checked');
  assert.equal(summarize([]).summary, 'There was nothing to check');
});

test('state machine errors read as one line', () => {
  assert.equal(describeError({ Error: 'States.Timeout' }), 'A step ran past its time limit');
  assert.equal(describeError({ Error: 'Error', Cause: JSON.stringify({ errorMessage: 'boom' }) }), 'boom');
  assert.equal(describeError({ Error: 'X', Cause: 'plain' }), 'plain');
  assert.equal(describeError(null), 'Unknown error');
});

test('pipeline output parses, double-encoded or not', () => {
  const output = { misconceptions: [] };
  assert.deepEqual(parseOutput(JSON.stringify(output)), output);
  assert.deepEqual(parseOutput(JSON.stringify(JSON.stringify(output))), output);
  assert.equal(parseOutput('not json'), null);
  assert.equal(parseOutput(null), null);
});

test('every misconception and every activity is an item', () => {
  const output = { misconceptions: [
    { activities: [{ content: {} }, { content: null }] },
    { activities: [] },
    {},
  ] };
  assert.deepEqual(checkItems(output), [
    { kind: 'misconception', i: 0, j: null },
    { kind: 'activity', i: 0, j: 0 },
    { kind: 'activity', i: 0, j: 1 },
    { kind: 'misconception', i: 1, j: null },
    { kind: 'misconception', i: 2, j: null },
  ]);
});
