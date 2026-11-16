// What each step hands back to the state machine, and what it leaves in the store.
// generate.test.mjs covers the content the steps produce.
//   node --test test/pipelineSteps.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { memoryStore, runSteps } from './runSteps.mjs';

// ── Fixture: 4 students, 2 questions ────────────────────────────────────────

const session = {
  id: 'session-1',
  sessionLabel: 'Session 1',
  weekNumber: 11,
  topic: 'Signed numbers',
  ccssStandards: ['7.NS.A.3', '7.EE.1'],
};

const assessment = {
  id: 'upload-1',
  assessmentCode: 'MAT.7.W11',
  questions: [
    {
      questionNumber: 1,
      ccssStandard: '7.NS.A.3',
      correctAnswer: 'A',
      classPercentCorrect: 0.5,
      questionText: 'What is -6 / 2?',
      answerChoices: [
        { letter: 'A', content: '-3', isCorrect: true },
        { letter: 'B', content: '3', isCorrect: false },
      ],
    },
    {
      questionNumber: 2,
      ccssStandard: '7.EE.1',
      correctAnswer: 'C',
      classPercentCorrect: 0.25,
      questionText: 'Simplify -(x - 2)',
      answerChoices: [
        { letter: 'C', content: '-x + 2', isCorrect: true },
        { letter: 'D', content: '-x - 2', isCorrect: false },
      ],
    },
  ],
};

const answer = (questionNumber, response, isCorrect, confidence) => ({
  questionNumber, response, isCorrect, confidence,
});
const studentResponses = [
  { studentId: 'Student 1', questionResponses: [answer(1, 'A', true, 4), answer(2, 'D', false, 5)] },
  { studentId: 'Student 2', questionResponses: [answer(1, 'B', false, 3), answer(2, 'D', false, 2)] },
  { studentId: 'Student 3', questionResponses: [answer(1, 'B', false, 4), answer(2, 'C', true, 4)] },
  { studentId: 'Student 4', questionResponses: [answer(1, 'A', true, 5), answer(2, 'D', false, 4)] },
];

// ── Fake stage Lambdas ──────────────────────────────────────────────────────

const MISCONCEPTIONS = [
  { title: 'Sign rule', description: 'd1', wrongAnswers: [{ questionNumber: 1, letter: 'B' }] },
  { title: 'Distributes to first term', description: 'd2', wrongAnswers: [{ questionNumber: 2, letter: 'D' }] },
  { title: 'Dropped by the rubric', description: 'd3', wrongAnswers: [] },
];

/**
 * Stands in for the six stage Lambdas. Records every call.
 * @param misconceptions what genMisconception returns
 * @param failTemplates  template ids whose activity call fails
 */
function fakeStages({ misconceptions = MISCONCEPTIONS, failTemplates = [] } = {}) {
  const calls = [];
  const replies = {
    learningScience: ({ ccss }) => ({
      standards: [{
        code: ccss,
        lvnFactors: [{ id: 'factor-1', name: 'Shared factor', strategies: [{ id: 's-1', name: 'Strategy' }] }],
      }],
    }),
    genMisconception: () => ({ misconceptions }),
    scoresCalc: () => ({
      rubricVersion: 'test-rubric',
      scored: [
        { title: 'Sign rule', scores: { depth: 3 }, total: 18, maxPossible: 30, normalized: 0.6, priorityRank: 1, isRecommendedFocus: true, retained: true },
        { title: 'Distributes to first term', scores: { depth: 2 }, total: 15, maxPossible: 30, normalized: 0.5, priorityRank: 2, retained: true },
        { title: 'Dropped by the rubric', scores: { depth: 1 }, total: 5, maxPossible: 30, normalized: 0.17, priorityRank: 3, retained: false },
      ],
    }),
    genInstrNeed: () => ({
      needs: [
        { title: 'Sign rule', instructionalNeed: { text: 'See why the sign flips.' }, rationale: 'r1', skillNames: ['Dividing integers'] },
        { title: 'Distributes to first term', instructionalNeed: { text: 'See the negative as -1 times the group.' }, rationale: 'r2' },
      ],
    }),
    selectTemplate: () => ({
      selections: [
        { title: 'Sign rule', picks: [{ templateId: 'spot-the-slip' }, { templateId: 'two-groups' }] },
        { title: 'Distributes to first term', picks: [{ templateId: 'my-favorite-no' }] },
      ],
    }),
    nextStepOption: ({ selectedTemplate }) => {
      const { templateId } = JSON.parse(selectedTemplate);
      if (failTemplates.includes(templateId)) {
        return { ok: false, error: { message: `no activity for ${templateId}` } };
      }
      return { content: { facilitate: { problem: `Problem for ${templateId}` } }, durationMinutes: 12 };
    },
  };

  const invoke = async (stage, payload) => {
    calls.push({ stage, input: payload.input });
    // A real Lambda replies with JSON text.
    return JSON.stringify(replies[stage](payload.input));
  };
  return { invoke, calls };
}

const run = (options, store) => {
  const { invoke, calls } = fakeStages(options);
  return runSteps({ session, assessment, studentResponses, invoke, store })
    .then((result) => ({ ...result, calls }));
};

// ── Tests ───────────────────────────────────────────────────────────────────

test('each step returns what the state machine reads', async () => {
  const { returned } = await run();
  // WasClaimed reads count; index.mjs adds `claimed` beside it.
  assert.deepEqual(returned.misconceptions, { count: 3 });
  assert.deepEqual(returned.scores, { count: 2 });
  assert.deepEqual(returned.needs, { count: 2 });
  // The Activities map fans out over these.
  assert.deepEqual(returned.templates, { indexes: [0, 1] });
});

test('an activity step reports saved, skipped or failed, and never throws', async () => {
  const { returned } = await run({ failTemplates: ['two-groups'] });
  assert.deepEqual(returned.activities, [
    [{ saved: true }, { failed: true }], // two picks, the second one fails
    [{ saved: true }, { skipped: true }], // one pick, so no second activity
  ]);
});

test('the output holds each misconception with its saved activities', async () => {
  const { output } = await run();
  assert.deepEqual(output.misconceptions.map((m) => m.title), ['Sign rule', 'Distributes to first term']);
  assert.deepEqual(
    output.misconceptions.map((m) => m.activities.map((a) => a.templateId)),
    [['spot-the-slip', 'two-groups'], ['my-favorite-no']],
  );
  // The de-duplicated graph: the second standard's repeated factor is a stub.
  assert.deepEqual(output.graph[1].lvnFactors, [{ id: 'factor-1', name: 'Shared factor', seeAbove: true }]);
});

test('the second activity is told the first one\'s problems, read from the store', async () => {
  const { calls } = await run();
  const second = calls.find(
    (c) => c.stage === 'nextStepOption' && JSON.parse(c.input.selectedTemplate).templateId === 'two-groups',
  );
  assert.deepEqual(JSON.parse(second.input.siblingProblems), ['Problem for spot-the-slip']);
});

test('a failed first activity leaves the second with no sibling problems', async () => {
  const { output, calls } = await run({ failTemplates: ['spot-the-slip'] });
  const second = calls.find(
    (c) => c.stage === 'nextStepOption' && JSON.parse(c.input.selectedTemplate).templateId === 'two-groups',
  );
  assert.equal(second.input.siblingProblems, undefined);
  assert.deepEqual(output.misconceptions.map((m) => m.activities.length), [1, 1]);
});

test('no misconceptions goes straight to the output, with the raw graph', async () => {
  const { output, returned, calls } = await run({ misconceptions: [] });
  assert.deepEqual(returned, { misconceptions: { count: 0 } });
  assert.deepEqual(output.misconceptions, []);
  // Raw: the second standard still has its full factor.
  assert.equal(output.graph[1].lvnFactors[0].seeAbove, undefined);
  assert.deepEqual(calls.map((c) => c.stage), ['learningScience', 'learningScience', 'genMisconception']);
});

test('no activity at all fails when the output is assembled', async () => {
  const failTemplates = ['spot-the-slip', 'two-groups', 'my-favorite-no'];
  await assert.rejects(run({ failTemplates }), /No activity was generated/);
});

test('each step saves under the name the next one loads', async () => {
  const store = memoryStore();
  await run({}, store);
  assert.deepEqual(store.names(), [
    'activity-0-0',
    'activity-0-1',
    'activity-1-0',
    'generatedMisconceptions',
    'graph',
    'retained',
    'selected',
    'withNeeds',
  ]);
});
