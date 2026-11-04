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

const DIR = process.env.MIU_FILES_DIR;
const read = (...parts) => fs.readFileSync(path.join(DIR, ...parts));
const skip = DIR ? false : 'MIU_FILES_DIR not set';
const DOCX = 'Gr7_Math_MixItUp_Week11_COACH.docx';
const XLSX = 'Week11_CMS_Gambatte_Monday.xlsx';

test('Monday results: students, fills, confidence', { skip }, () => {
  const r = parseResults(read(XLSX));
  assert.equal(r.assessmentToken, 'W11-MON');
  assert.equal(r.weekNumber, 11);
  assert.match(r.section, /Gambatte/);
  assert.equal(r.students.length, 28);
  assert.deepEqual(r.questions.map((q) => q.docxQuestion), [1, 3, 5, 7, 9, 11]);

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

test('the pair agrees; a wrong pairing or key is refused', { skip }, async () => {
  const r = parseResults(read(XLSX));
  const doc = await parseMiuDoc(read(DOCX), r.assessmentToken);
  checkResults(r, 'PPQ');
  checkAgreement(r, doc);
  assert.throws(() => checkResults(r, 'POST_PPQ'), /THU/);
  const changed = structuredClone(doc);
  changed.questions[1].correctAnswer = 'C';
  assert.throws(() => checkAgreement(r, changed), /Q3 \(document C, spreadsheet B\)/);
  await assert.rejects(parseMiuDoc(read(DOCX), 'W10-THU'), /no assessment/);
});

test('rows for Monday: ids from the upload, stats from the responses', { skip }, async () => {
  const results = parseResults(read(XLSX));
  const doc = await parseMiuDoc(read(DOCX), results.assessmentToken);
  const upload = { id: 'u1', classId: 'c1', sessionId: 's1', assessmentType: 'PPQ' };
  const { assessment, responses, sessionFields } = buildRows(upload, results, doc, 'now');

  assert.equal(assessment.id, 'u1');
  assert.equal(assessment.questions[2].docxQuestion, 5);
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
