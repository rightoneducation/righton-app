/**
 * The class-level before/after comparison Reflect shows, from seed/cli/util/
 * buildReflectionResults.ts without its per-student parts.
 *
 * Students have no identity across uploads (FERPA: a row number means nothing
 * beyond its own spreadsheet), so each assessment is averaged over its own students
 * and nobody is paired. That's why studentResults stays empty and
 * improvedStudentCount stays 0.
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
  answers: new Map((r.questionResponses ?? []).map((q) => [q.questionNumber, q])),
}));

const percentCorrect = (question, responses) => oneDecimal(
  (responses.filter((r) => r.answers.get(question.questionNumber)?.isCorrect).length / responses.length) * 100,
);

/** Average questions correct per student, over one assessment's own students. */
const averageCorrect = (responses) => responses.reduce(
  (total, r) => total + [...r.answers.values()].filter((q) => q.isCorrect).length,
  0,
) / responses.length;

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
    studentResults: [],
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
