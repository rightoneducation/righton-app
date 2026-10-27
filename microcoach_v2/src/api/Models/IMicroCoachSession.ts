import { PublishStatus, SessionStatus } from '../../AWSAPI';

export interface IMicroCoachReflectionStudentResult {
  studentId: string;
  studentName: string | null;
  questionsCorrectBefore: number | null;
  questionsCorrectAfter: number | null;
}

export interface IMicroCoachReflectionAnswerResult {
  letter: string;
  text: string;
  percentChosen: number;
  isCorrect: boolean;
}

export interface IMicroCoachReflectionQuestionResult {
  questionNumber: number;
  questionText: string;
  beforeQuestionText: string | null;
  afterQuestionText: string | null;
  beforeStandard: string | null;
  afterStandard: string | null;
  percentCorrectBefore: number;
  percentCorrectAfter: number;
  beforeAnswers: IMicroCoachReflectionAnswerResult[];
  afterAnswers: IMicroCoachReflectionAnswerResult[];
}

export interface IMicroCoachReflectionResult {
  activityId: string | null;
  misconceptionId: string;
  questionCount: number;
  averagePercentCorrectBefore: number;
  averagePercentCorrectAfter: number;
  averageQuestionsCorrectBefore: number;
  averageQuestionsCorrectAfter: number;
  improvedStudentCount: number;
  studentResults: IMicroCoachReflectionStudentResult[];
  questionResults: IMicroCoachReflectionQuestionResult[];
}

/** One answer option on an MIU question: what it said and who chose it. */
export interface IQuestionOption {
  letter: string;
  text: string | null;
  percentChosen: number | null;
  isCorrect: boolean;
  studentNames: string[];
}

/** Class % correct on one MIU question (Review's "Correct responses" tiles). */
export interface IQuestionStat {
  questionNumber: number;
  percentCorrect: number;
  questionText: string | null;
  // Empty when the session predates per-option data.
  options: IQuestionOption[];
}

export interface IMicroCoachSession {
  id: string;
  classId: string;
  sessionLabel: string | null;
  weekLabel: string | null;
  weekNumber: number | null;
  topic: string | null;
  ccssStandards: string[];
  status: SessionStatus | null;
  publishStatus: PublishStatus | null;
  studentWorksAnalyzed: number | null;
  studentsWithStrongUnderstanding: number | null;
  studentsWithStrongUnderstandingIds: string[];
  studentIdsNeedingSupport: string[];
  ppqAssessmentId: string | null;
  postPpqAssessmentId: string | null;
  // The misconception picked on Review before an activity is saved.
  selectedMisconceptionId: string | null;
  pregeneratedNextSteps: string | null;
  evaluationResults: string | null;
  // Empty until the pipeline writes it (see the v2 pipeline task).
  questionStats: IQuestionStat[];
  reflectionResults: IMicroCoachReflectionResult[];
  createdAt: string;
  updatedAt: string;
}
