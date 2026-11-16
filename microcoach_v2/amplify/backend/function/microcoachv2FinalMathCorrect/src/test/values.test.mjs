// Writing a corrected value into the stored output and the teacher's rows.
//   node --test test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePath, getAt, setAt, coerceLike } from '../util/paths.mjs';
import {
  titleCase, findMisconceptionRow, findActivityRow, applyToMisconceptionRow, applyToActivityRow,
} from '../util/teacherRows.mjs';

test('paths read and write the value the check names', () => {
  assert.deepEqual(parsePath('content.facilitate.examples[1].steps[2].text'),
    ['content', 'facilitate', 'examples', 1, 'steps', 2, 'text']);
  const obj = { content: { facilitate: { examples: [{}, { steps: [{}, {}, { text: 'old' }] }] } } };
  assert.equal(getAt(obj, 'content.facilitate.examples[1].steps[2].text'), 'old');
  setAt(obj, 'content.facilitate.examples[1].steps[2].text', 'new');
  assert.equal(obj.content.facilitate.examples[1].steps[2].text, 'new');
  assert.equal(getAt(obj, 'content.missing.text'), undefined);
});

test('a path that is not there is never created', () => {
  const obj = { a: { b: 'x' } };
  assert.throws(() => setAt(obj, 'a.c', 'y'), /No value at a.c/);
  assert.throws(() => setAt(obj, 'z.b', 'y'), /No value at z.b/);
  assert.deepEqual(obj, { a: { b: 'x' } });
});

test('a corrected value keeps its kind', () => {
  assert.equal(coerceLike('text', 'new text', 'p'), 'new text');
  assert.equal(coerceLike(24.5, ' 25 ', 'p'), 25);
  assert.equal(coerceLike(true, 'False', 'p'), false);
  assert.throws(() => coerceLike(3, 'three', 'p'), /must stay a number/);
  assert.throws(() => coerceLike(true, 'maybe', 'p'), /must stay true or false/);
  assert.throws(() => coerceLike({ a: 1 }, 'x', 'p'), /not a single value/);
});

test('the right teacher rows are found', () => {
  const mRows = [{ id: 'm1', rank: 1, title: 'A' }, { id: 'm2', rank: 2, title: 'B' }];
  assert.equal(findMisconceptionRow(mRows, { priorityRank: 2, title: 'renamed' }).id, 'm2');
  assert.equal(findMisconceptionRow(mRows, { title: 'A' }).id, 'm1');
  assert.equal(findMisconceptionRow(mRows, { priorityRank: 9, title: 'none' }), null);

  const aRows = [
    { id: 'a1', misconceptionId: 'm1', routine: { id: 'routine-spot-the-slip' }, activityType: 'INCORRECT_WORKED_EXAMPLES' },
    { id: 'a2', misconceptionId: 'm2', routine: { id: 'routine-spot-the-slip' }, activityType: 'INCORRECT_WORKED_EXAMPLES' },
    { id: 'a3', misconceptionId: 'm2', routine: null, activityType: 'FAVORITE_NO' },
  ];
  assert.equal(findActivityRow(aRows, mRows[1], { templateId: 'spot-the-slip' }).id, 'a2');
  assert.equal(findActivityRow(aRows, mRows[1], { templateId: 'my-favorite-no', activityType: 'FAVORITE_NO' }).id, 'a3');
  assert.equal(findActivityRow(aRows, mRows[0], { templateId: 'make-your-case' }), null);
});

test('a misconception value reaches the fields the teacher reads', () => {
  const row = {
    title: 'old', titleCased: 'Old', shortLabel: 'Old', description: 'd',
    studentWork: { errorsByFrequency: [{ errorTag: 'Q2, Answer C', interpretation: 'old' }, { errorTag: 'Q1, Answer B', interpretation: 'x' }] },
  };
  const m = { wrongAnswers: [{ questionNumber: 1, letter: 'B' }, { questionNumber: 2, letter: 'C' }] };

  assert.deepEqual(applyToMisconceptionRow(row, m, 'title', 'sign flipped in the second step'), ['title', 'titleCased', 'shortLabel']);
  assert.equal(row.titleCased, 'Sign Flipped in the Second Step');
  assert.equal(row.shortLabel, 'Sign Flipped in');
  assert.equal(titleCase('a point on the line'), 'A Point on the Line');

  assert.deepEqual(applyToMisconceptionRow(row, m, 'wrongAnswers[1].explanation', 'fixed'), ['studentWork']);
  assert.equal(row.studentWork.errorsByFrequency[0].interpretation, 'fixed');
  assert.equal(row.studentWork.errorsByFrequency[1].interpretation, 'x');

  // Not shown to the teacher: only the stored output changes.
  assert.deepEqual(applyToMisconceptionRow(row, m, 'rubric.conceptualDepthWhy', 'x'), []);
});

test('an activity value reaches the row: content under phases, the rest by name', () => {
  const row = { phases: { discussion: { takeaway: 'old' } }, targets: 't', durationMinutes: 12, durationLabel: '12 min' };
  assert.deepEqual(applyToActivityRow(row, 'content.discussion.takeaway', 'new'), ['phases']);
  assert.equal(row.phases.discussion.takeaway, 'new');
  assert.deepEqual(applyToActivityRow(row, 'targets', 'new targets'), ['targets']);
  assert.deepEqual(applyToActivityRow(row, 'durationMinutes', 14), ['durationMinutes', 'durationLabel']);
  assert.equal(row.durationLabel, '14 min');
  assert.deepEqual(applyToActivityRow(row, 'aiReasoning', 'x'), []);
  assert.throws(() => applyToActivityRow(row, 'content.discussion.missing', 'x'), /No value/);
});
