// Runs against the client's real files, which never go in the repo. Point
// MIU_FILES_DIR at a folder holding them; without it these tests are skipped.
//   MIU_FILES_DIR=~/Desktop/UncommonDocs/"Wave 2" node --test test/parseUpload.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { parseResults } from '../util/parse-excel.mjs';
import { parseMiuDoc } from '../util/parseMiuDoc.mjs';
import { checkAgreement, checkResults } from '../util/checkUpload.mjs';
import { buildRows } from '../util/buildRows.mjs';
import { rescore } from '../util/rescore.mjs';
import { buildReflectionResults } from '../util/buildReflection.mjs';

const DIR = process.env.MIU_FILES_DIR;
const read = (...parts) => fs.readFileSync(path.join(DIR, ...parts));
const skip = DIR ? false : 'MIU_FILES_DIR not set';
const DOCX = 'Gr7_Math_MixItUp_Week11_COACH.docx';
const XLSX = 'Week11_CMS_Gambatte_Monday.xlsx';
const CLEAN = 'MIUClean.docx';

test('Monday results: students, fills, confidence', { skip }, () => {
  const r = parseResults(read(XLSX));
  assert.equal(r.assessmentToken, 'W11-MON');
  assert.equal(r.weekNumber, 11);
  assert.match(r.section, /Gambatte/);
  assert.equal(r.students.length, 28);
  assert.deepEqual(r.questions.map((q) => q.docxQuestion), [1, 3, 5, 7, 9, 11]);
  // Numbered as printed, on the questions and on every student's answers.
  assert.deepEqual(r.questions.map((q) => q.questionNumber), [1, 3, 5, 7, 9, 11]);
  assert.deepEqual(r.students[0].questionResponses.map((q) => q.questionNumber), [1, 3, 5, 7, 9, 11]);

  // Green counts reproduce the report's own class percentages.
  r.questions.forEach((q, i) => {
    const correct = r.students.filter((s) => s.questionResponses[i].isCorrect).length;
    assert.ok(Math.abs(correct / 28 - q.classPercentCorrect) < 1e-9, `Q${q.docxQuestion}`);
  });
  const chose = (i, letter) => r.students.filter((s) => s.questionResponses[i].response === letter).length;
  assert.equal(chose(2, 'C'), 1); // Q5's keyed answer
  assert.equal(chose(2, 'B'), 20);
  assert.ok(r.students.flatMap((s) => s.questionResponses).some((q) => q.confidence === 1));
});

test('skipped answers are red and empty, not correct', { skip }, () => {
  const r = parseResults(read('archive', 'Week 10_Thursday Results.xlsx'));
  const all = r.students.flatMap((s) => s.questionResponses);
  const skipped = all.filter((q) => q.response === null);
  assert.equal(skipped.length, 8);
  assert.ok(skipped.every((q) => !q.isCorrect));
  assert.throws(() => checkResults(r, 'POST_PPQ'), /section/); // Section(s): All
});

test('Monday document: stems, options and equations', { skip }, async () => {
  const { questions, warnings } = await parseMiuDoc(read(DOCX), 'W11-MON');
  assert.deepEqual(questions.map((q) => q.correctAnswer), ['A', 'B', 'C', 'A', 'B', 'D']);
  assert.match(questions[0].questionText, /\\frac\{\(\\frac\{3\}\{4\}-\\frac\{5\}\{6\}\)\}\{\\frac\{2\}\{3\}\}/);
  assert.equal(questions[0].answerChoices[0].content, '$-\\frac{1}{8}$');
  assert.ok(questions.every((q) => q.answerChoices.length === 4));
  assert.equal(questions[4].questionText, 'Solve for $x$: $3x+21=63$'); // stray line gone
  assert.equal(warnings.length, 1);
});

test('Thursday document uses its typed key', { skip }, async () => {
  const { questions } = await parseMiuDoc(read(DOCX), 'W11-THU');
  assert.deepEqual(questions.map((q) => q.correctAnswer), ['A', 'B', 'A', 'A', 'A', 'C']);
});

test('a wrong pairing is refused', { skip }, async () => {
  const r = parseResults(read(XLSX));
  const doc = await parseMiuDoc(read(DOCX), r.assessmentToken);
  checkResults(r, 'PPQ');
  checkAgreement(r, doc);
  assert.throws(() => checkResults(r, 'POST_PPQ'), /THU/);
  const fewer = { ...doc, questions: doc.questions.slice(1) };
  assert.throws(() => checkAgreement(r, fewer), /has questions/);
  await assert.rejects(parseMiuDoc(read(DOCX), 'W10-THU'), /no assessment/);
});

test('the corrected document re-scores only Q3 and Q5', { skip }, async () => {
  const r = parseResults(read(XLSX));
  const doc = await parseMiuDoc(read(CLEAN), r.assessmentToken);
  const before = r.students[0].questionResponses.map((q) => ({ ...q }));
  assert.deepEqual(rescore(r, doc), [
    { docxQuestion: 3, from: 'B', to: 'C' },
    { docxQuestion: 5, from: 'C', to: 'B' },
  ]);
  const correct = (i) => r.students.filter((s) => s.questionResponses[i].isCorrect).length;
  assert.deepEqual([0, 1, 2, 3, 4, 5].map(correct), [18, 13, 20, 15, 23, 24]);
  assert.ok(Math.abs(r.classPercentCorrect - 113 / 168) < 1e-9);
  assert.ok(Math.abs(r.questions[1].classPercentCorrect - 13 / 28) < 1e-9);
  assert.equal(r.questions[0].classPercentCorrect, 18 / 28);

  // Student 1 chose C on Q3 and B on Q5, and both flip to correct.
  assert.deepEqual(r.students[0].questionResponses.map((q) => q.isCorrect), [true, true, true, true, true, true]);
  assert.equal(r.students[0].totalScore, 1);
  assert.deepEqual(r.students[0].questionResponses.map((q) => q.response), before.map((q) => q.response));
});

test('a document that agrees changes nothing', { skip }, async () => {
  const r = parseResults(read(XLSX));
  const doc = await parseMiuDoc(read(DOCX), r.assessmentToken);
  const snapshot = JSON.stringify(r);
  assert.deepEqual(rescore(r, doc), []);
  assert.equal(JSON.stringify(r), snapshot);
});

test('the key can come from another assessment in the document', { skip }, async () => {
  const doc = await parseMiuDoc(read(CLEAN), 'W11-THU', 'W11-MON');
  assert.deepEqual(doc.questions.map((q) => q.correctAnswer), ['A', 'C', 'B', 'A', 'B', 'D']);
  assert.match(doc.questions[4].questionText, /40x\+160=960/); // Thursday's question
});

test('Reflect with the same responses and key shows no change', { skip }, async () => {
  const r = parseResults(read(XLSX));
  const docMon = await parseMiuDoc(read(CLEAN), 'W11-MON');
  const docThu = await parseMiuDoc(read(CLEAN), 'W11-THU', 'W11-MON');
  rescore(r, docMon);
  const upload = { id: 'u1', classId: 'c1', sessionId: 's1', assessmentType: 'PPQ' };
  const a = buildRows(upload, r, docMon, 'now');
  const b = buildRows({ ...upload, id: 'u2', assessmentType: 'POST_PPQ' }, r, docThu, 'now');

  const [result] = buildReflectionResults({
    target: { activityId: 'act', misconceptionId: 'mis' },
    before: { assessment: a.assessment, responses: a.responses },
    after: { assessment: b.assessment, responses: b.responses },
  });
  assert.equal(result.questionCount, 6);
  assert.equal(result.averagePercentCorrectBefore, 67.3);
  assert.equal(result.averagePercentCorrectAfter, 67.3);
  assert.equal(result.averageQuestionsCorrectBefore, 4);
  assert.deepEqual(result.studentResults, []);
  assert.equal(result.improvedStudentCount, 0);

  const q3 = result.questionResults[1];
  assert.equal(q3.questionNumber, 3);
  assert.equal(q3.percentCorrectBefore, 46.4);
  assert.equal(q3.percentCorrectAfter, 46.4);
  assert.match(q3.beforeQuestionText, /0\.125/);
  assert.match(q3.afterQuestionText, /0\.3/);
  assert.equal(q3.beforeAnswers[2].percentChosen, 46.4); // C
  assert.equal(q3.beforeAnswers[2].isCorrect, true);
  assert.equal(q3.beforeAnswers[2].text, '4.4');
});

test('Reflect refuses assessments it cannot compare', () => {
  const q = (questionNumber) => ({ questionNumber, questionText: 't', answerChoices: [] });
  const responses = [{ questionResponses: [] }];
  assert.throws(() => buildReflectionResults({
    target: { misconceptionId: 'm' },
    before: { assessment: { questions: [q(1)] }, responses },
    after: { assessment: { questions: [q(2)] }, responses },
  }), /different questions/);
  assert.throws(() => buildReflectionResults({
    target: { misconceptionId: 'm' },
    before: { assessment: { questions: [q(1)] }, responses: [] },
    after: { assessment: { questions: [q(1)] }, responses },
  }), /student responses/);
});

test('rows for Monday: ids from the upload, stats from the responses', { skip }, async () => {
  const results = parseResults(read(XLSX));
  const doc = await parseMiuDoc(read(DOCX), results.assessmentToken);
  const upload = { id: 'u1', classId: 'c1', sessionId: 's1', assessmentType: 'PPQ' };
  const { assessment, responses, sessionFields } = buildRows(upload, results, doc, 'now');

  assert.equal(assessment.id, 'u1');
  assert.equal(assessment.questions[2].questionNumber, 5);
  assert.deepEqual(sessionFields.questionStats.map((q) => q.questionNumber), [1, 3, 5, 7, 9, 11]);
  assert.equal(responses.length, 28);
  assert.equal(new Set(responses.map((r) => r.id)).size, 28);
  assert.equal(sessionFields.ppqAssessmentId, 'u1');
  assert.equal(sessionFields.studentWorksAnalyzed, 28);
  assert.deepEqual(sessionFields.ccssStandards, ['7.NS.A.3', '7.EE.1', '7.EE.4.a']);

  const q5 = sessionFields.questionStats[2];
  assert.equal(q5.options[1].studentNames.length, 20); // B
  assert.match(q5.options[1].studentNames[0], /^Student \d+$/);
  assert.equal(q5.options[2].isCorrect, true); // C, as keyed
  const q1Share = sessionFields.questionStats[0].options.reduce((sum, o) => sum + o.percentChosen, 0);
  assert.ok(Math.abs(q1Share - 1) < 1e-9);

  const later = buildRows({ ...upload, assessmentType: 'POST_PPQ' }, results, doc, 'now');
  assert.deepEqual(later.sessionFields, { postPpqAssessmentId: 'u1' });
});
