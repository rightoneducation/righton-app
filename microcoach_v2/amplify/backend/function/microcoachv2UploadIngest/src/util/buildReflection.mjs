/**
 * The before/after comparison Reflect shows: class averages, each question's
 * answers, and every student's score on each assessment.
 *
 * The client de-identifies the files before upload and each upload is taken as it
 * is: students are not linked between MIU 1 and MIU 2. So each assessment is
 * summarised over its own students, studentResults holds one row per response with
 * the other assessment's score null, and improvedStudentCount stays 0 (it would
 * need the same student on both).
 */

const oneDecimal = (value) => Math.round(value * 10) / 10;

function answerResults(question, responses) {
  return (question.answerChoices ?? []).map((choice) => {
    // A double-marked "BC" counts as choosing both, as the pipeline's reach does.
    const chose = responses.filter((r) => r.answers.get(question.questionNumber)?.response?.includes(choice.letter));
    return {
      letter: choice.letter,
      text: choice.content?.trim() ?? '',
      percentChosen: oneDecimal((chose.length / responses.length) * 100),
      isCorrect: choice.isCorrect === true,
    };
  });
}

const indexAnswers = (responses) => responses.map((r) => ({
  id: r.id,
  answers: new Map((r.questionResponses ?? []).map((q) => [q.questionNumber, q])),
}));

const percentCorrect = (question, responses) => oneDecimal(
  (responses.filter((r) => r.answers.get(question.questionNumber)?.isCorrect).length / responses.length) * 100,
);

/** How many questions one student got right. */
const questionsCorrect = (response) => [...response.answers.values()].filter((q) => q.isCorrect).length;

/** Average questions correct per student, over one assessment's own students. */
const averageCorrect = (responses) => responses.reduce(
  (total, r) => total + questionsCorrect(r),
  0,
) / responses.length;

/** One assessment's students, each with a score on that assessment only. */
const studentScores = (responses, scoreField) => responses.map((r) => ({
  studentId: r.id,
  studentName: null,
  questionsCorrectBefore: null,
  questionsCorrectAfter: null,
  [scoreField]: questionsCorrect(r),
}));

/**
 * @param target { activityId, misconceptionId }: what the class worked on
 * @param before { assessment, responses } MIU 1
 * @param after  { assessment, responses } MIU 2
 */
export function buildReflectionResults({ target, before, after }) {
  if (!before.responses.length || !after.responses.length) {
    throw new Error('Reflect needs student responses on both assessments');
  }
  const afterByNumber = new Map(after.assessment.questions.map((q) => [q.questionNumber, q]));
  const beforeQuestions = [...before.assessment.questions].sort((a, b) => a.questionNumber - b.questionNumber);
  if (beforeQuestions.length !== afterByNumber.size
    || beforeQuestions.some((q) => !afterByNumber.has(q.questionNumber))) {
    throw new Error('MIU 1 and MIU 2 have different questions, so they cannot be compared');
  }

  const beforeRows = indexAnswers(before.responses);
  const afterRows = indexAnswers(after.responses);
  const questionCount = beforeQuestions.length;
  const averageBefore = averageCorrect(beforeRows);
  const averageAfter = averageCorrect(afterRows);

  return [{
    activityId: target.activityId ?? null,
    misconceptionId: target.misconceptionId,
    questionCount,
    averagePercentCorrectBefore: oneDecimal((averageBefore / questionCount) * 100),
    averagePercentCorrectAfter: oneDecimal((averageAfter / questionCount) * 100),
    averageQuestionsCorrectBefore: oneDecimal(averageBefore),
    averageQuestionsCorrectAfter: oneDecimal(averageAfter),
    improvedStudentCount: 0,
    studentResults: [
      ...studentScores(beforeRows, 'questionsCorrectBefore'),
      ...studentScores(afterRows, 'questionsCorrectAfter'),
    ],
    questionResults: beforeQuestions.map((b) => {
      const a = afterByNumber.get(b.questionNumber);
      return {
        questionNumber: b.questionNumber,
        questionText: b.questionText,
        beforeQuestionText: b.questionText ?? null,
        afterQuestionText: a.questionText ?? null,
        beforeStandard: b.ccssStandard ?? null,
        afterStandard: a.ccssStandard ?? null,
        percentCorrectBefore: percentCorrect(b, beforeRows),
        percentCorrectAfter: percentCorrect(a, afterRows),
        beforeAnswers: answerResults(b, beforeRows),
        afterAnswers: answerResults(a, afterRows),
      };
    }),
  }];
}
