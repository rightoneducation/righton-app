export type ReflectionDetailSort = 'highestScoring' | 'mostImproved';

export interface MockReflectionStudentResult {
  id: string;
  displayName: string;
  questionsCorrectBefore: number | null;
  questionsCorrectAfter: number | null;
}

export interface MockReflectionAnswerResult {
  id: string;
  letter: string;
  text: string;
  percentChosen: number;
  isCorrect: boolean;
}

export interface MockReflectionQuestionResult {
  questionNumber: number;
  questionText: string;
  percentCorrectBefore: number;
  percentCorrectAfter: number;
  beforeAnswers: MockReflectionAnswerResult[];
  afterAnswers: MockReflectionAnswerResult[];
}

export const mockReflectionStudents: MockReflectionStudentResult[] = [
  {
    id: 'student-jordan-m',
    displayName: 'Jordan M.',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 6,
  },
  {
    id: 'student-kayla',
    displayName: 'Kayla',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 6,
  },
  {
    id: 'student-mason',
    displayName: 'Mason',
    questionsCorrectBefore: 4,
    questionsCorrectAfter: 6,
  },
  {
    id: 'student-nadia',
    displayName: 'Nadia',
    questionsCorrectBefore: 4,
    questionsCorrectAfter: 6,
  },
  {
    id: 'student-carlos',
    displayName: 'Carlos',
    questionsCorrectBefore: 5,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-jordan-r',
    displayName: 'Jordan R.',
    questionsCorrectBefore: 6,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-maya',
    displayName: 'Maya',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-priya',
    displayName: 'Priya',
    questionsCorrectBefore: 4,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-roy',
    displayName: 'Roy',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-taylor',
    displayName: 'Taylor',
    questionsCorrectBefore: 0,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-zaeden',
    displayName: 'Zaeden',
    questionsCorrectBefore: 6,
    questionsCorrectAfter: 5,
  },
  {
    id: 'student-alex',
    displayName: 'Alex',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 4,
  },
  {
    id: 'student-asha',
    displayName: 'Asha',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 4,
  },
  {
    id: 'student-nia',
    displayName: 'Nia',
    questionsCorrectBefore: 3,
    questionsCorrectAfter: 4,
  },
  {
    id: 'student-theo',
    displayName: 'Theo',
    questionsCorrectBefore: 2,
    questionsCorrectAfter: 4,
  },
  {
    id: 'student-elena',
    displayName: 'Elena',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 3,
  },
  {
    id: 'student-ruby',
    displayName: 'Ruby',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 3,
  },
  {
    id: 'student-cole',
    displayName: 'Cole',
    questionsCorrectBefore: 3,
    questionsCorrectAfter: 2,
  },
  {
    id: 'student-finn',
    displayName: 'Finn',
    questionsCorrectBefore: 2,
    questionsCorrectAfter: 2,
  },
  {
    id: 'student-mara',
    displayName: 'Mara',
    questionsCorrectBefore: 2,
    questionsCorrectAfter: 2,
  },
  {
    id: 'student-devon',
    displayName: 'Devon',
    questionsCorrectBefore: 2,
    questionsCorrectAfter: 1,
  },
  {
    id: 'student-tess',
    displayName: 'Tess',
    questionsCorrectBefore: 3,
    questionsCorrectAfter: 1,
  },
  {
    id: 'student-jayden',
    displayName: 'Jayden',
    questionsCorrectBefore: 1,
    questionsCorrectAfter: 0,
  },
  {
    id: 'student-sam',
    displayName: 'Sam',
    questionsCorrectBefore: 4,
    questionsCorrectAfter: null,
  },
  {
    id: 'student-lee',
    displayName: 'Lee',
    questionsCorrectBefore: null,
    questionsCorrectAfter: 5,
  },
];

export const mockReflectionQuestions: MockReflectionQuestionResult[] = [
  {
    questionNumber: 1,
    questionText: 'Which graph shows the solution to y < −½x + 3?',
    percentCorrectBefore: 42,
    percentCorrectAfter: 83,
    beforeAnswers: [
      { id: 'q1-before-a', letter: 'A', text: 'Solid line, shaded above', percentChosen: 7, isCorrect: false },
      { id: 'q1-before-b', letter: 'B', text: 'Dashed line, shaded above', percentChosen: 30, isCorrect: true },
      { id: 'q1-before-c', letter: 'C', text: 'Solid line, shaded below', percentChosen: 22, isCorrect: false },
      { id: 'q1-before-d', letter: 'D', text: 'Dashed line, shaded below', percentChosen: 41, isCorrect: false },
    ],
    afterAnswers: [
      { id: 'q1-after-a', letter: 'A', text: 'Dashed line, shaded below', percentChosen: 4, isCorrect: false },
      { id: 'q1-after-b', letter: 'B', text: 'Solid line, shaded above', percentChosen: 16, isCorrect: false },
      { id: 'q1-after-c', letter: 'C', text: 'Dashed line, shaded above', percentChosen: 9, isCorrect: false },
      { id: 'q1-after-d', letter: 'D', text: 'Solid line, shaded below', percentChosen: 71, isCorrect: true },
    ],
  },
  {
    questionNumber: 2,
    questionText: 'Which inequality matches the shaded region shown?',
    percentCorrectBefore: 75,
    percentCorrectAfter: 84,
    beforeAnswers: [
      { id: 'q2-before-a', letter: 'A', text: 'A solid line', percentChosen: 57, isCorrect: false },
      { id: 'q2-before-b', letter: 'B', text: 'A dashed line', percentChosen: 29, isCorrect: true },
      { id: 'q2-before-c', letter: 'C', text: 'A vertical line', percentChosen: 14, isCorrect: false },
    ],
    afterAnswers: [
      { id: 'q2-after-a', letter: 'A', text: 'A vertical line', percentChosen: 14, isCorrect: false },
      { id: 'q2-after-b', letter: 'B', text: 'A dashed line', percentChosen: 71, isCorrect: true },
      { id: 'q2-after-c', letter: 'C', text: 'A solid line', percentChosen: 15, isCorrect: false },
    ],
  },
  {
    questionNumber: 3,
    questionText: 'Which inequality matches the shaded region shown?',
    percentCorrectBefore: 46,
    percentCorrectAfter: 78,
    beforeAnswers: [
      { id: 'q3-before-a', letter: 'A', text: '(0, 0)', percentChosen: 57, isCorrect: true },
      { id: 'q3-before-b', letter: 'B', text: '(2, 1)', percentChosen: 29, isCorrect: false },
      { id: 'q3-before-c', letter: 'C', text: '(4, 4)', percentChosen: 14, isCorrect: false },
    ],
    afterAnswers: [
      { id: 'q3-after-a', letter: 'A', text: '(3, 2)', percentChosen: 14, isCorrect: false },
      { id: 'q3-after-b', letter: 'B', text: '(0, 0)', percentChosen: 86, isCorrect: true },
      { id: 'q3-after-c', letter: 'C', text: '(5, 5)', percentChosen: 0, isCorrect: false },
    ],
  },
  {
    questionNumber: 4,
    questionText: 'Which inequality matches the shaded region shown?',
    percentCorrectBefore: 68,
    percentCorrectAfter: 80,
    beforeAnswers: [
      { id: 'q4-before-a', letter: 'A', text: 'Points on the line are included', percentChosen: 43, isCorrect: false },
      { id: 'q4-before-b', letter: 'B', text: 'Points on the line are excluded', percentChosen: 43, isCorrect: true },
      { id: 'q4-before-c', letter: 'C', text: 'Only the intercept is included', percentChosen: 14, isCorrect: false },
    ],
    afterAnswers: [
      { id: 'q4-after-a', letter: 'A', text: 'Only the intercept is excluded', percentChosen: 14, isCorrect: false },
      { id: 'q4-after-b', letter: 'B', text: 'Points on the line are excluded', percentChosen: 71, isCorrect: true },
      { id: 'q4-after-c', letter: 'C', text: 'Points on the line are included', percentChosen: 15, isCorrect: false },
    ],
  },
  {
    questionNumber: 5,
    questionText: 'Which side of the boundary should be shaded?',
    percentCorrectBefore: 57,
    percentCorrectAfter: 71,
    beforeAnswers: [
      { id: 'q5-before-a', letter: 'A', text: 'The side containing a true test point', percentChosen: 57, isCorrect: true },
      { id: 'q5-before-b', letter: 'B', text: 'The side above the x-axis', percentChosen: 29, isCorrect: false },
      { id: 'q5-before-c', letter: 'C', text: 'The side nearest the origin', percentChosen: 14, isCorrect: false },
    ],
    afterAnswers: [
      { id: 'q5-after-a', letter: 'A', text: 'The side nearest the y-axis', percentChosen: 14, isCorrect: false },
      { id: 'q5-after-b', letter: 'B', text: 'The side containing a true test point', percentChosen: 71, isCorrect: true },
      { id: 'q5-after-c', letter: 'C', text: 'The side below the x-axis', percentChosen: 15, isCorrect: false },
    ],
  },
  {
    questionNumber: 6,
    questionText: 'Which inequality matches the displayed graph?',
    percentCorrectBefore: 43,
    percentCorrectAfter: 86,
    beforeAnswers: [
      { id: 'q6-before-a', letter: 'A', text: 'y ≥ -2x + 1', percentChosen: 29, isCorrect: false },
      { id: 'q6-before-b', letter: 'B', text: 'y > -2x + 1', percentChosen: 43, isCorrect: true },
      { id: 'q6-before-c', letter: 'C', text: 'y < 2x + 1', percentChosen: 28, isCorrect: false },
    ],
    afterAnswers: [
      { id: 'q6-after-a', letter: 'A', text: 'y < 2x + 1', percentChosen: 14, isCorrect: false },
      { id: 'q6-after-b', letter: 'B', text: 'y > -2x + 1', percentChosen: 86, isCorrect: true },
      { id: 'q6-after-c', letter: 'C', text: 'y ≥ -2x + 1', percentChosen: 0, isCorrect: false },
    ],
  },
];
