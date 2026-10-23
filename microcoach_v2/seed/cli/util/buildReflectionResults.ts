export interface ReflectionTarget {
  activityId?: string | null;
  misconceptionId: string;
}

export interface ReflectionStudent {
  id: string;
  name?: string | null;
}

export interface ReflectionAssessmentAnswerChoice {
  letter: string;
  text?: string | null;
}

export interface ReflectionAssessmentQuestion {
  questionNumber: number;
  questionText?: string | null;
  standard?: string | null;
  correctAnswer: string;
  answerChoices?: ReflectionAssessmentAnswerChoice[] | null;
}

export interface ReflectionAssessment {
  id: string;
  type: 'PPQ' | 'POST_PPQ';
  sourceAssessmentId?: string | null;
  questions: ReflectionAssessmentQuestion[];
}

export interface ReflectionQuestionResponse {
  questionNumber: number;
  response?: string | null;
  isCorrect: boolean;
}

export interface ReflectionStudentResponse {
  studentId: string;
  questionResponses: ReflectionQuestionResponse[];
}

export interface ReflectionQuestionStat {
  questionNumber: number;
  questionText?: string | null;
}

export interface ReflectionStudentResult {
  studentId: string;
  studentName: string | null;
  questionsCorrectBefore: number | null;
  questionsCorrectAfter: number | null;
}

export interface ReflectionAnswerResult {
  letter: string;
  text: string;
  percentChosen: number;
  isCorrect: boolean;
}

export interface ReflectionQuestionResult {
  questionNumber: number;
  questionText: string;
  beforeQuestionText: string | null;
  afterQuestionText: string | null;
  beforeStandard: string | null;
  afterStandard: string | null;
  percentCorrectBefore: number;
  percentCorrectAfter: number;
  beforeAnswers: ReflectionAnswerResult[];
  afterAnswers: ReflectionAnswerResult[];
}

export interface ReflectionResult {
  activityId: string | null;
  misconceptionId: string;
  questionCount: number;
  averagePercentCorrectBefore: number;
  averagePercentCorrectAfter: number;
  averageQuestionsCorrectBefore: number;
  averageQuestionsCorrectAfter: number;
  improvedStudentCount: number;
  studentResults: ReflectionStudentResult[];
  questionResults: ReflectionQuestionResult[];
}

export interface BuildReflectionResultsInput {
  targets: ReflectionTarget[];
  beforeAssessment: ReflectionAssessment;
  afterAssessment: ReflectionAssessment;
  beforeResponses: ReflectionStudentResponse[];
  afterResponses: ReflectionStudentResponse[];
  students: ReflectionStudent[];
  questionStats?: ReflectionQuestionStat[];
}

interface PreparedQuestion {
  questionNumber: number;
  questionText: string;
  before: ReflectionAssessmentQuestion;
  after: ReflectionAssessmentQuestion;
}

interface PreparedResponse {
  studentId: string;
  answersByQuestion: Map<number, string | null>;
  questionsCorrect: number;
}

const normalizeLetter = (value?: string | null): string | null => {
  const normalized = value?.trim().toUpperCase();
  return normalized || null;
};

const roundToOneDecimal = (value: number): number =>
  Math.round(value * 10) / 10;

const indexByStudent = (
  responses: ReflectionStudentResponse[],
  assessment: ReflectionAssessment,
): Map<string, PreparedResponse> => {
  const questionByNumber = new Map(
    assessment.questions.map((question) => [question.questionNumber, question]),
  );
  const indexed = new Map<string, PreparedResponse>();

  responses.forEach((studentResponse) => {
    if (indexed.has(studentResponse.studentId)) {
      throw new Error(
        `Assessment ${assessment.id} has more than one response for student ${studentResponse.studentId}.`,
      );
    }

    const answersByQuestion = new Map<number, string | null>();
    studentResponse.questionResponses.forEach((questionResponse) => {
      const question = questionByNumber.get(questionResponse.questionNumber);
      if (!question) {
        throw new Error(
          `Assessment ${assessment.id} response references unknown question ${questionResponse.questionNumber}.`,
        );
      }
      if (answersByQuestion.has(questionResponse.questionNumber)) {
        throw new Error(
          `Assessment ${assessment.id} has duplicate responses for question ${questionResponse.questionNumber} and student ${studentResponse.studentId}.`,
        );
      }

      const correctAnswer = normalizeLetter(question.correctAnswer);
      let answer = normalizeLetter(questionResponse.response);

      // Some existing upload data represents a correct selected answer with an
      // empty response. Preserve that result by using the assessment answer key.
      if (!answer && questionResponse.isCorrect) answer = correctAnswer;

      const validAnswers = new Set(
        (question.answerChoices ?? []).map((choice) =>
          normalizeLetter(choice.letter),
        ),
      );
      if (answer && !validAnswers.has(answer)) {
        throw new Error(
          `Assessment ${assessment.id} response uses unknown answer ${answer} for question ${question.questionNumber}.`,
        );
      }

      answersByQuestion.set(questionResponse.questionNumber, answer);
    });

    const questionsCorrect = assessment.questions.reduce((total, question) => {
      const answer = answersByQuestion.get(question.questionNumber);
      return (
        total + (answer === normalizeLetter(question.correctAnswer) ? 1 : 0)
      );
    }, 0);

    indexed.set(studentResponse.studentId, {
      studentId: studentResponse.studentId,
      answersByQuestion,
      questionsCorrect,
    });
  });

  return indexed;
};

const validateAndPairQuestions = (
  beforeAssessment: ReflectionAssessment,
  afterAssessment: ReflectionAssessment,
  questionStats: ReflectionQuestionStat[],
): PreparedQuestion[] => {
  if (beforeAssessment.questions.length === 0) {
    throw new Error('The assessments must contain at least one question.');
  }

  const statsByNumber = new Map(
    questionStats.map((stat) => [stat.questionNumber, stat]),
  );
  const afterByNumber = new Map(
    afterAssessment.questions.map((question) => [
      question.questionNumber,
      question,
    ]),
  );

  if (afterByNumber.size !== afterAssessment.questions.length) {
    throw new Error(
      `Assessment ${afterAssessment.id} has duplicate question numbers.`,
    );
  }

  const beforeNumbers = new Set<number>();
  const paired = beforeAssessment.questions.map((before) => {
    if (beforeNumbers.has(before.questionNumber)) {
      throw new Error(
        `Assessment ${beforeAssessment.id} has duplicate question numbers.`,
      );
    }
    beforeNumbers.add(before.questionNumber);

    const after = afterByNumber.get(before.questionNumber);
    if (!after) {
      throw new Error(
        `Assessment questions do not align at question ${before.questionNumber}.`,
      );
    }

    [before, after].forEach((question) => {
      const correctAnswer = normalizeLetter(question.correctAnswer);
      const choices = question.answerChoices ?? [];
      const choiceLetters = choices.map((choice) =>
        normalizeLetter(choice.letter),
      );

      if (!correctAnswer) {
        throw new Error(
          `Assessment question ${question.questionNumber} is missing its correct answer.`,
        );
      }
      if (
        choices.length === 0 ||
        choiceLetters.some((letter) => letter == null)
      ) {
        throw new Error(
          `Assessment question ${question.questionNumber} is missing answer choices.`,
        );
      }
      if (new Set(choiceLetters).size !== choiceLetters.length) {
        throw new Error(
          `Assessment question ${question.questionNumber} has duplicate answer choices.`,
        );
      }
      if (!choiceLetters.includes(correctAnswer)) {
        throw new Error(
          `Assessment question ${question.questionNumber} does not include its correct answer in its answer choices.`,
        );
      }
    });

    const questionText =
      before.questionText?.trim() ||
      after.questionText?.trim() ||
      statsByNumber.get(before.questionNumber)?.questionText?.trim();
    if (!questionText) {
      throw new Error(
        `Question ${before.questionNumber} is missing its question text.`,
      );
    }

    return {
      questionNumber: before.questionNumber,
      questionText,
      before,
      after,
    };
  });

  if (paired.length !== afterAssessment.questions.length) {
    throw new Error(
      'The before and after assessments have different question numbers.',
    );
  }

  return paired.sort((a, b) => a.questionNumber - b.questionNumber);
};

const buildAnswerResults = (
  question: ReflectionAssessmentQuestion,
  matchedResponses: PreparedResponse[],
): ReflectionAnswerResult[] => {
  const correctAnswer = normalizeLetter(question.correctAnswer);

  return (question.answerChoices ?? []).map((choice) => {
    const letter = normalizeLetter(choice.letter) as string;
    const selectedCount = matchedResponses.filter(
      (response) =>
        response.answersByQuestion.get(question.questionNumber) === letter,
    ).length;

    return {
      letter,
      text: choice.text?.trim() ?? '',
      percentChosen: roundToOneDecimal(
        (selectedCount / matchedResponses.length) * 100,
      ),
      isCorrect: letter === correctAnswer,
    };
  });
};

/**
 * Builds the deterministic comparison data displayed by Reflect.
 *
 * Students who completed only one MIU remain in studentResults with a null
 * score for the missed MIU. All before/after averages, improvement counts, and
 * per-question percentages use only students who completed both MIUs.
 */
export default function buildReflectionResults({
  targets,
  beforeAssessment,
  afterAssessment,
  beforeResponses,
  afterResponses,
  students,
  questionStats = [],
}: BuildReflectionResultsInput): ReflectionResult[] {
  if (beforeAssessment.type !== 'PPQ' || afterAssessment.type !== 'POST_PPQ') {
    throw new Error(
      'Reflect requires a PPQ assessment followed by a POST_PPQ assessment.',
    );
  }
  if (afterAssessment.sourceAssessmentId !== beforeAssessment.id) {
    throw new Error(
      `Assessment ${afterAssessment.id} is not linked to source assessment ${beforeAssessment.id}.`,
    );
  }

  const pairedQuestions = validateAndPairQuestions(
    beforeAssessment,
    afterAssessment,
    questionStats,
  );
  const beforeByStudent = indexByStudent(beforeResponses, beforeAssessment);
  const afterByStudent = indexByStudent(afterResponses, afterAssessment);
  const matchedStudentIds = [...beforeByStudent.keys()].filter((studentId) =>
    afterByStudent.has(studentId),
  );

  if (matchedStudentIds.length === 0) {
    throw new Error(
      'Reflect requires at least one student who completed both MIUs.',
    );
  }

  const matchedBefore = matchedStudentIds.map(
    (studentId) => beforeByStudent.get(studentId) as PreparedResponse,
  );
  const matchedAfter = matchedStudentIds.map(
    (studentId) => afterByStudent.get(studentId) as PreparedResponse,
  );
  const studentNameById = new Map(
    students.map((student) => [student.id, student.name]),
  );
  const participatingStudentIds = new Set([
    ...beforeByStudent.keys(),
    ...afterByStudent.keys(),
  ]);

  const studentResults = [...participatingStudentIds]
    .sort((a, b) => a.localeCompare(b))
    .map((studentId): ReflectionStudentResult => ({
      studentId,
      studentName: studentNameById.get(studentId)?.trim() || null,
      questionsCorrectBefore:
        beforeByStudent.get(studentId)?.questionsCorrect ?? null,
      questionsCorrectAfter:
        afterByStudent.get(studentId)?.questionsCorrect ?? null,
    }));

  const averageQuestionsCorrectBefore = roundToOneDecimal(
    matchedBefore.reduce(
      (total, response) => total + response.questionsCorrect,
      0,
    ) / matchedBefore.length,
  );
  const averageQuestionsCorrectAfter = roundToOneDecimal(
    matchedAfter.reduce(
      (total, response) => total + response.questionsCorrect,
      0,
    ) / matchedAfter.length,
  );
  const questionCount = pairedQuestions.length;
  const averagePercentCorrectBefore = roundToOneDecimal(
    (matchedBefore.reduce(
      (total, response) => total + response.questionsCorrect,
      0,
    ) /
      (matchedBefore.length * questionCount)) *
      100,
  );
  const averagePercentCorrectAfter = roundToOneDecimal(
    (matchedAfter.reduce(
      (total, response) => total + response.questionsCorrect,
      0,
    ) /
      (matchedAfter.length * questionCount)) *
      100,
  );
  const improvedStudentCount = matchedStudentIds.filter(
    (studentId) =>
      (afterByStudent.get(studentId) as PreparedResponse).questionsCorrect >
      (beforeByStudent.get(studentId) as PreparedResponse).questionsCorrect,
  ).length;

  const questionResults = pairedQuestions.map(
    ({
      questionNumber,
      questionText,
      before,
      after,
    }): ReflectionQuestionResult => {
      const correctBefore = matchedBefore.filter(
        (response) =>
          response.answersByQuestion.get(questionNumber) ===
          normalizeLetter(before.correctAnswer),
      ).length;
      const correctAfter = matchedAfter.filter(
        (response) =>
          response.answersByQuestion.get(questionNumber) ===
          normalizeLetter(after.correctAnswer),
      ).length;

      return {
        questionNumber,
        questionText,
        beforeQuestionText: before.questionText?.trim() || null,
        afterQuestionText: after.questionText?.trim() || null,
        beforeStandard: before.standard?.trim() || null,
        afterStandard: after.standard?.trim() || null,
        percentCorrectBefore: roundToOneDecimal(
          (correctBefore / matchedBefore.length) * 100,
        ),
        percentCorrectAfter: roundToOneDecimal(
          (correctAfter / matchedAfter.length) * 100,
        ),
        beforeAnswers: buildAnswerResults(before, matchedBefore),
        afterAnswers: buildAnswerResults(after, matchedAfter),
      };
    },
  );

  return targets.map((target) => ({
    activityId: target.activityId ?? null,
    misconceptionId: target.misconceptionId,
    questionCount,
    averagePercentCorrectBefore,
    averagePercentCorrectAfter,
    averageQuestionsCorrectBefore,
    averageQuestionsCorrectAfter,
    improvedStudentCount,
    studentResults,
    questionResults,
  }));
}
