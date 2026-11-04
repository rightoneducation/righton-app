import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPipeline, computeWrongAnswerDist } from '../util/pipeline.mjs';
import { buildRows } from '../util/buildRows.mjs';

const qr = (questionNumber, response, isCorrect, confidence = 4) => ({ questionNumber, response, isCorrect, confidence });
const studentResponses = [
  { studentId: 'Student 1', questionResponses: [qr(1, 'A', true), qr(2, 'C', false, 5)] },
  { studentId: 'Student 2', questionResponses: [qr(1, 'B', false, 3), qr(2, 'B', true)] },
  { studentId: 'Student 3', questionResponses: [qr(1, 'A', true), qr(2, null, false, null)] },
];
const choice = (letter, isCorrect) => ({ letter, content: `$${letter}$`, isCorrect });
const assessment = {
  id: 'a1',
  assessmentCode: 'MAT.07.MIXU.W11-MON.26-27.USI_COACH',
  questions: [
    { questionNumber: 1, ccssStandard: '7.NS.3', correctAnswer: 'A', classPercentCorrect: 2 / 3, questionText: 'one', answerChoices: [choice('A', true), choice('B', false)] },
    { questionNumber: 2, ccssStandard: '7.EE.1', correctAnswer: 'B', classPercentCorrect: 1 / 3, questionText: 'two', answerChoices: [choice('B', true), choice('C', false)] },
  ],
};
const session = { id: 's1', classId: 'c1', sessionLabel: 'W11', weekNumber: 11, ccssStandards: ['7.NS.A.3', '7.EE.1'] };

const replies = (overrides = {}) => {
  const calls = [];
  const stages = {
    learningScience: ({ input }) => ({ standards: [{ code: input.ccss === '7.EE.1' ? '7.EE.A.1' : '7.NS.A.3', description: 'desc', prerequisiteStandards: [{ code: '6.NS.1', description: 'pre' }], learningComponents: [{ description: 'lc' }] }] }),
    genMisconception: () => ({ misconceptions: [
      { title: 'Second one', description: 'd2', wrongAnswers: [{ questionNumber: 2, letter: 'C', explanation: 'why C' }] },
      { title: 'first one', description: 'd1', wrongAnswers: [{ questionNumber: 1, letter: 'B', explanation: 'why B' }] },
      { title: 'dropped', description: 'd3', wrongAnswers: [] },
    ] }),
    scoresCalc: () => ({ rubricVersion: 'v', scored: [
      { title: 'first one', scores: {}, total: 20, maxPossible: 30, normalized: 0.6, priorityRank: 1, isRecommendedFocus: true, retained: true },
      { title: 'Second one', scores: {}, total: 10, maxPossible: 30, normalized: 0.3, priorityRank: 2, retained: true },
      { title: 'dropped', scores: {}, total: 1, maxPossible: 30, normalized: 0, priorityRank: 3, retained: false },
    ] }),
    genInstrNeed: () => ({ needs: [
      { title: 'first one', instructionalNeed: { text: 'need one' }, rationale: {}, skillNames: [{ code: '7.NS.A.3', name: 'Rational ops' }] },
      { title: 'Second one', instructionalNeed: { text: 'need two' }, rationale: {} },
    ] }),
    selectTemplate: () => ({ selections: [
      { title: 'first one', picks: [{ templateId: 'spot-the-slip' }, { templateId: 'math-detective' }] },
      { title: 'Second one', picks: [{ templateId: 'make-your-case' }] },
    ] }),
    nextStepOption: ({ input }) => {
      const pick = JSON.parse(input.selectedTemplate);
      return { activityType: 'WORKED_EXAMPLE', durationMinutes: 12, content: { facilitate: { problem: `problem for ${pick.templateId}` } } };
    },
    ...overrides,
  };
  const invoke = async (stage, payload) => {
    calls.push({ stage, input: payload.input });
    const result = stages[stage](payload);
    if (result instanceof Error) throw result;
    return JSON.stringify(result); // the Lambdas reply with a JSON string
  };
  return { invoke, calls };
};

const run = (overrides) => {
  const { invoke, calls } = replies(overrides);
  return runPipeline({ session, assessment, studentResponses, invoke }).then((output) => ({ output, calls }));
};

test('stages run in order and carry only retained misconceptions, ranked', async () => {
  const { output, calls } = await run();
  assert.deepEqual([...new Set(calls.map((c) => c.stage))], [
    'learningScience', 'genMisconception', 'scoresCalc', 'genInstrNeed', 'selectTemplate', 'nextStepOption',
  ]);
  assert.deepEqual(output.misconceptions.map((m) => m.title), ['first one', 'Second one']);

  const first = output.misconceptions[0];
  assert.equal(first.studentCount, 1);
  assert.equal(first.studentPercent, 0.333);
  assert.equal(first.meanConfidence, 3);
  assert.equal(first.ccssStandard, '7.NS.3'); // from the linked question
  assert.equal(first.graphStandard.code, '7.NS.A.3'); // matched across spellings
  assert.equal(first.activities.length, 2);

  const gen = calls.find((c) => c.stage === 'genMisconception').input;
  const q1 = JSON.parse(gen.questions)[0];
  assert.equal(q1.answerChoices[1].studentCount, 1);
  assert.equal(q1.questionText, 'one');
  assert.deepEqual(JSON.parse(gen.context), { subject: 'Math', ccssStandards: session.ccssStandards });
});

test('the second activity for a need is told the first one\'s problems', async () => {
  const { calls } = await run();
  const activities = calls.filter((c) => c.stage === 'nextStepOption' && JSON.parse(c.input.misconception).title === 'first one');
  assert.equal(activities[0].input.siblingProblems, undefined);
  assert.deepEqual(JSON.parse(activities[1].input.siblingProblems), ['problem for spot-the-slip']);
});

test('no names reach any stage; only labels', async () => {
  const { calls } = await run();
  const { classroom } = JSON.parse(calls.find((c) => c.stage === 'genInstrNeed').input.classroomData);
  assert.deepEqual(classroom, { subject: 'Math', cohortSize: 3 });
});

test('a failed stage throws; one failed activity does not', async () => {
  await assert.rejects(run({ scoresCalc: () => ({ ok: false, error: { message: 'boom' } }) }), /scoresCalc failed: boom/);
  let count = 0;
  const { output } = await run({
    nextStepOption: ({ input }) => {
      count += 1;
      if (count === 1) return new Error('one bad call');
      return { activityType: 'X', content: { facilitate: { problem: input.selectedTemplate } } };
    },
  });
  assert.equal(output.misconceptions.flatMap((m) => m.activities).length, 2);
  await assert.rejects(run({ nextStepOption: () => new Error('all bad') }), /No activity was generated/);
});

test('no misconceptions is a result, not a failure', async () => {
  const { output } = await run({ genMisconception: () => ({ misconceptions: [] }) });
  assert.deepEqual(output.misconceptions, []);
});

test('rows: prevalence, labels, skips, badges and activity content', async () => {
  const { output } = await run();
  const { misconceptions, activities } = buildRows(session, output, studentResponses, 'now');
  assert.equal(misconceptions.length, 2);
  const [first, second] = misconceptions;
  assert.equal(first.badge, 'RECOMMENDED_FOCUS');
  assert.equal(first.rank, 1);
  assert.equal(second.badge, 'CORE');
  assert.equal(first.description, 'd1');
  assert.deepEqual(first.studentWork.errorsByFrequency[0].students, ['Student 2']);
  assert.deepEqual(first.responseEvidence, [{ questionNumber: 1, answers: ['B'] }]);
  assert.equal(first.prevalence.totalAnalyzed, 3);
  assert.equal(first.prevalence.studentsNeedingSupport, 1);
  assert.equal(first.prevalence.studentsUnderstood, 2);

  // Student 3 skipped Q2: no response, not "understood".
  assert.equal(second.studentWork.noResponse.studentCount, 1);
  assert.deepEqual(second.studentWork.noResponse.students, ['Student 3']);

  const focus = first.skillContext.focusSkill;
  assert.equal(focus.code, '7.NS.A.3');
  assert.equal(focus.name, 'Rational ops');
  assert.equal(focus.domainName, 'The Number System');
  assert.deepEqual(focus.learningComponents, ['lc']);
  assert.equal(first.skillContext.prerequisiteGaps.skills[0].code, '6.NS.1');

  assert.equal(activities.length, 3);
  assert.equal(activities[0].misconceptionId, first.id);
  assert.equal(activities[0].title, 'Spot the Slip');
  assert.equal(activities[0].durationLabel, '12 min');
  assert.equal(activities[0].phases.facilitate.problem, 'problem for spot-the-slip');
});

test('wrong-answer counts ignore correct answers and skips', () => {
  assert.deepEqual(computeWrongAnswerDist(studentResponses), { 1: { B: 1 }, 2: { C: 1 } });
});
