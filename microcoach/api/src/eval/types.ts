
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