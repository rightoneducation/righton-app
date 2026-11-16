// Which values the math check reads, and what it solves blind.
//   node --test test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rowsOf, shown, rowLabel, activityProblems, misconceptionProblems } from '../util/rows.mjs';

const activity = {
  templateId: 'spot-the-slip',
  targets: 'Reversing the sign',
  durationMinutes: 12,
  content: {
    schemaVersion: 2,
    durations: { facilitate: '9 min' },
    howToRun: [{ title: 'Present', body: 'Show $y > 2x + 4$.', groupings: ['PAIRS'], minutes: 3 }],
    facilitate: {
      type: 'INCORRECT_WORKED_EXAMPLES',
      examples: [{
        prompt: 'Solve $-2x > 6$',
        steps: [
          { step: 1, text: 'Divide by $-2$', annotation: null },
          { step: 2, text: '$x > -3$', annotation: { kind: 'ERROR', text: 'Sign not reversed' } },
        ],
        finalOutcome: '$x > -3$',
      }],
    },
    discussion: { takeaway: 'Reverse the sign.', questions: [{ question: 'Why?', answer: 'Order reverses.', minutes: 2 }] },
  },
};

test('every value is a row, at its path: text, numbers and labels', () => {
  assert.deepEqual(rowsOf(activity).map((r) => [r.rowId, r.text]), [
    ['templateId', 'spot-the-slip'],
    ['targets', 'Reversing the sign'],
    ['durationMinutes', '12'],
    ['content.schemaVersion', '2'],
    ['content.durations.facilitate', '9 min'],
    ['content.howToRun[0].title', 'Present'],
    ['content.howToRun[0].body', 'Show $y > 2x + 4$.'],
    ['content.howToRun[0].groupings[0]', 'PAIRS'],
    ['content.howToRun[0].minutes', '3'],
    ['content.facilitate.type', 'INCORRECT_WORKED_EXAMPLES'],
    ['content.facilitate.examples[0].prompt', 'Solve $-2x > 6$'],
    ['content.facilitate.examples[0].steps[0].step', '1'],
    ['content.facilitate.examples[0].steps[0].text', 'Divide by $-2$'],
    ['content.facilitate.examples[0].steps[1].step', '2'],
    ['content.facilitate.examples[0].steps[1].text', '$x > -3$'],
    ['content.facilitate.examples[0].steps[1].annotation.kind', 'ERROR'],
    ['content.facilitate.examples[0].steps[1].annotation.text', 'Sign not reversed'],
    ['content.facilitate.examples[0].finalOutcome', '$x > -3$'],
    ['content.discussion.takeaway', 'Reverse the sign.'],
    ['content.discussion.questions[0].question', 'Why?'],
    ['content.discussion.questions[0].answer', 'Order reverses.'],
    ['content.discussion.questions[0].minutes', '2'],
  ]);
});

test('only nothing is left out: null and empty text', () => {
  assert.deepEqual(rowsOf({ a: '', b: '   ', c: null, d: undefined }), []);
  assert.deepEqual(rowsOf({ d: 0, e: false }).map((r) => r.text), ['0', 'false']);
  assert.deepEqual(rowsOf(null), []);
});

test('a field this file has never heard of is still a row', () => {
  const rows = rowsOf({ content: { facilitate: { type: 'NEW_TEMPLATE', rounds: [{ hint: 'Try $x = 2$' }] } } });
  assert.deepEqual(rows.map((r) => r.rowId), ['content.facilitate.type', 'content.facilitate.rounds[0].hint']);
});

test('the graph strategies nobody is shown are the one thing not read', () => {
  const misconception = {
    title: 'Sign not reversed',
    rubric: { total: 24.5, scores: { frequency: 2.5 } },
    isRecommendedFocus: true,
    graphStandard: { code: '7.EE.B.4', description: 'Solve inequalities', lvnFactors: [{ strategies: ['x', 'y'] }] },
  };
  assert.deepEqual(rowsOf(misconception).map((r) => r.rowId), [
    'title', 'rubric.total', 'rubric.scores.frequency', 'isRecommendedFocus',
    'graphStandard.code', 'graphStandard.description',
  ]);
  assert.deepEqual(shown(misconception).graphStandard, { code: '7.EE.B.4', description: 'Solve inequalities' });
});

test('row labels read as a place in the material', () => {
  assert.equal(rowLabel('content.facilitate.examples[1].steps[2].text'), 'Example 2 › Step 3');
  assert.equal(rowLabel('content.discussion.watchFors[0].tryAsking'), 'Discussion › Watch for 1 › Try asking');
  assert.equal(rowLabel('wrongAnswers[1].explanation'), 'Wrong answer 2 › Explanation');
  assert.equal(rowLabel('instructionalNeed.text'), 'Instructional need');
  assert.equal(rowLabel('targets'), 'Targets');
});

test('an activity is solved from only what students are given', () => {
  assert.deepEqual(activityProblems(activity.content), [{ kind: 'PROBLEM', text: 'Solve $-2x > 6$' }]);
  assert.deepEqual(
    activityProblems({ facilitate: { claim: 'Always true', examples: [{ prompt: 'Check $(3,2)$', answer: 'True' }] } }),
    [{ kind: 'CLAIM', text: 'Always true' }, { kind: 'PROBLEM', text: 'Check $(3,2)$' }],
  );
  assert.deepEqual(activityProblems(undefined), []);
});

test('a misconception is solved from the assessment questions it links to', () => {
  const questions = [
    { questionNumber: 1, questionText: 'Solve $-2x > 6$', correctAnswer: 'B', answerChoices: [{ letter: 'A', content: '$x > -3$' }, { letter: 'B', content: '$x < -3$' }] },
    { questionNumber: 2, questionText: 'Other', answerChoices: [] },
  ];
  const linked = misconceptionProblems({ wrongAnswers: [{ questionNumber: '1', letter: 'A' }] }, questions);
  assert.deepEqual(linked, [{
    kind: 'QUESTION',
    text: 'Question 1: Solve $-2x > 6$\nOptions:\n  A) $x > -3$\n  B) $x < -3$\nKeyed answer: B',
  }]);
  // Links to none: every question, since its text still describes the assessment.
  assert.equal(misconceptionProblems({ wrongAnswers: [] }, questions).length, 2);
  assert.deepEqual(misconceptionProblems({}, []), []);
});
