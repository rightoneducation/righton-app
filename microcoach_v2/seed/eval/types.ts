
// Types associated with return from normalized Knowledge Graph Query
// source: normalizeStandard.mjs
export interface LearningComponentType {
  id: string,
  description: string
}

export interface LVNStrategyType {
  id: string,
  name: string,
  description: string,
  category: string | null,
  gradeLevel: string[],
  academicSubject: string | null
}

export interface LVNLearnerModelType {
  id: string,
  name: string,
  description: string,
  gradeLevel: string[],
  academicSubject: string | null
}

export interface LVNInteractsWithType {
  id: string,
  name: string,
  description: string
}

export interface LVNFactorType {
  id: string,
  name: string,
  description: string,
  category: string,
  gradeLevel: string[],
  academicSubject: string | null,
  strategies: LVNStrategyType[],
  learnerModels: LVNLearnerModelType[],
  interactsWith: LVNInteractsWithType[]
}

// A reference to another standard in the graph. The four *Standards arrays below
// carry these, not bare code strings — buildNextSteps reads .code and .description
// off them, and maskQuery is typed through KgQueryType, so getting this wrong
// misleads anyone editing the mask.
export interface RelatedStandardType {
  id: string,
  code: string,
  description: string
}

export interface KgQueryType {
  id: string,
  code: string,
  description: string,
  prerequisiteStandards: RelatedStandardType[],
  futureDependentStandards: RelatedStandardType[],
  childStandards: RelatedStandardType[],
  relatedStandards: RelatedStandardType[],
  learningComponents: LearningComponentType[],
  lvnFactors: LVNFactorType[]
}

// Enum that describes masking options for normalized KG query
// masking performed in maskQuery function switch
export enum MaskOptionEnum{
  NONE = 'NONE',
  NO_PREREQ = 'NO_PREREQ',
  NO_DOWNSTREAM = 'NO_DOWNSTREAM',
  NO_CHILD = 'NO_CHILD',
  NO_RELATED = 'NO_RELATED',
  NO_LC = 'NO_LC',
  NO_LVN_FULL = 'NO_LVN_FULL',
  NO_LVN_STRATEGY = 'NO_LVN_STRATEGY',
  NO_LVN_LEARNERMODELS = 'NO_LVN_LEARNERMODELS',
  NO_LVN_INTERACTSWITH = 'NO_LVN_INTERACTSWITH',
  FULL = 'FULL'
}

// Misconception Types
export interface ImpactedObjectivesType {
  standard: string,
  description: string,
}

export interface PrerequisiteGapType {
  standard: string,
  description: string
}

export interface EvidenceType {
  source: string,
  mostCommonError: string,
  sampleStudentWork: string[],
  aiThinkingPattern: string
}

export interface QuestionErrorRateType {
  lavel: string,
  errorRate: string
}

export interface PPQQuestionType {
  questionNumber: number,
  correctAnswer: string,
  classPercentCorrect: number
}

export interface WrongAnswerType {
  questionNumber: number,
  letter: string
}

export interface MisconceptionOutputType {
  id: string,
  title: string,
  frequency: string,
  isCore: boolean,
  occurrence: string,
  studentCount: number | null,
  studentPercent: number | null,
  wrongAnswers: WrongAnswerType[],
  linkStatus: 'linked' | 'unlinked',
  example: { 
    incorrect: string,
    correct: string
  },
  misconceptionSummary: string,
  aiReasoning: string,
  successIndicators: string[],
  ccssStandards: {
    targetObjective: {
      standard: string,
      description: string,
      learningComponents: string[]
    },
    impactedObjectives: ImpactedObjectivesType[],
    prerequisiteGaps: PrerequisiteGapType[],
  },
  evidence: EvidenceType,
  questionErrorRates: QuestionErrorRateType[],
  ppqQuestions: PPQQuestionType[] 
}

export interface MisconceptionScore {
  frequency: number,
  learningProgressionInfluence: number,
  studentConfidence: number,
  lcMisconceptionEvalScore: number,
  conceptualDepth: number
}