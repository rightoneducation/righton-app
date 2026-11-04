/**
 * Turns a parsed upload into the rows ingest writes, in the shape the API's own
 * writes produce. Pure, so it can be checked without AWS.
 *
 * Ids come from the upload: rerunning an upload overwrites its rows, so a rerun
 * can't duplicate them.
 */

import { canonicalCcss } from './ccssCode.mjs';

// No names (FERPA). The label is only meaningful within one upload.
export const studentLabel = (studentRef) => `Student ${studentRef}`;

/** Each distinct standard once: the document spells 7.NS.3 and 7.NS.A.3 both ways. */
function distinctStandards(questions) {
  const seen = new Set();
  return questions.flatMap(({ standard }) => {
    const key = canonicalCcss(standard);
    if (seen.has(key)) return [];
    seen.add(key);
    return [standard];
  });
}

/**
 * @param upload  the MicroCoachUpload row
 * @param results parseResults output
 * @param doc     parseMiuDoc output (same questions; see checkAgreement)
 * @param now     ISO timestamp
 */
export function buildRows(upload, results, doc, now) {
  const questions = results.questions.map((q, i) => ({
    questionNumber: q.questionNumber,
    docxQuestion: q.docxQuestion,
    questionText: doc.questions[i].questionText,
    ccssStandard: doc.questions[i].standard,
    correctAnswer: q.correctAnswer,
    classPercentCorrect: q.classPercentCorrect,
    answerChoices: doc.questions[i].answerChoices,
  }));

  const assessment = {
    __typename: 'MicroCoachAssessment',
    id: upload.id,
    uploadId: upload.id,
    classId: upload.classId,
    sessionId: upload.sessionId,
    assessmentCode: results.assessmentCode,
    type: upload.assessmentType,
    weekNumber: results.weekNumber,
    classPercentCorrect: results.classPercentCorrect,
    questions,
    createdAt: now,
    updatedAt: now,
  };

  const responses = results.students.map((student) => ({
    __typename: 'MicroCoachStudentResponse',
    id: `${upload.id}-${student.studentRef}`,
    assessmentId: assessment.id,
    classId: upload.classId,
    sessionId: upload.sessionId,
    studentRef: student.studentRef,
    totalScore: student.totalScore,
    questionResponses: student.questionResponses,
    createdAt: now,
    updatedAt: now,
  }));

  const total = results.students.length;
  const questionStats = questions.map((q, i) => ({
    questionNumber: q.questionNumber,
    percentCorrect: q.classPercentCorrect,
    questionText: q.questionText,
    options: q.answerChoices.map((choice) => {
      // A double-marked "BC" counts as choosing both, as the pipeline's reach does.
      const chose = results.students.filter(
        (student) => student.questionResponses[i].response?.includes(choice.letter),
      );
      return {
        letter: choice.letter,
        text: choice.content,
        percentChosen: chose.length / total,
        isCorrect: choice.isCorrect,
        studentNames: chose.map((student) => studentLabel(student.studentRef)),
      };
    }),
  }));

  // MIU 2 only links its assessment: Review keeps showing the MIU 1 picture.
  const sessionFields = upload.assessmentType === 'PPQ'
    ? {
        ppqAssessmentId: assessment.id,
        sessionLabel: `W${results.weekNumber}`,
        weekNumber: results.weekNumber,
        ccssStandards: distinctStandards(doc.questions),
        studentWorksAnalyzed: total,
        questionStats,
      }
    : { postPpqAssessmentId: assessment.id };

  return { assessment, responses, sessionFields };
}
