/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateMicroCoachUserInput = {
  id?: string | null,
  cognitoId: string,
  email: string,
  firstName?: string | null,
  lastName?: string | null,
  role: UserRole,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}


export type ModelMicroCoachUserConditionInput = {
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachUserConditionInput | null > | null,
  or?: Array< ModelMicroCoachUserConditionInput | null > | null,
  not?: ModelMicroCoachUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type MicroCoachUser = {
  __typename: "MicroCoachUser",
  id: string,
  cognitoId: string,
  email: string,
  firstName?: string | null,
  lastName?: string | null,
  classes?: ModelMicroCoachClassroomConnection | null,
  role: UserRole,
  createdAt: string,
  updatedAt: string,
};

export type ModelMicroCoachClassroomConnection = {
  __typename: "ModelMicroCoachClassroomConnection",
  items:  Array<MicroCoachClassroom | null >,
  nextToken?: string | null,
};

export type MicroCoachClassroom = {
  __typename: "MicroCoachClassroom",
  id: string,
  userId: string,
  sessions?: ModelMicroCoachSessionConnection | null,
  students?: ModelMicroCoachStudentConnection | null,
  name: string,
  grade?: number | null,
  state?: string | null,
  schoolYear?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMicroCoachSessionConnection = {
  __typename: "ModelMicroCoachSessionConnection",
  items:  Array<MicroCoachSession | null >,
  nextToken?: string | null,
};

export type MicroCoachSession = {
  __typename: "MicroCoachSession",
  id: string,
  classId: string,
  sessionLabel?: string | null,
  weekLabel?: string | null,
  weekNumber?: number | null,
  topic?: string | null,
  ccssStandards?: Array< string | null > | null,
  status?: SessionStatus | null,
  publishStatus?: PublishStatus | null,
  studentWorksAnalyzed?: number | null,
  studentsWithStrongUnderstanding?: number | null,
  studentsWithStrongUnderstandingIds?: Array< string | null > | null,
  studentIdsNeedingSupport?: Array< string | null > | null,
  ppqAssessmentId?: string | null,
  postPpqAssessmentId?: string | null,
  assessments?: ModelMicroCoachAssessmentConnection | null,
  misconceptions?: ModelMicroCoachMisconceptionConnection | null,
  pregeneratedNextSteps?: string | null,
  evaluationResults?: string | null,
  createdAt: string,
  updatedAt: string,
};

export enum SessionStatus {
  DATA_INGESTED = "DATA_INGESTED",
  GENERATED = "GENERATED",
  COMPLETED = "COMPLETED",
}


export enum PublishStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}


export type ModelMicroCoachAssessmentConnection = {
  __typename: "ModelMicroCoachAssessmentConnection",
  items:  Array<MicroCoachAssessment | null >,
  nextToken?: string | null,
};

export type MicroCoachAssessment = {
  __typename: "MicroCoachAssessment",
  id: string,
  classId: string,
  sessionId: string,
  assessmentCode: string,
  type: AssessmentType,
  weekNumber: number,
  createdAt: string,
  updatedAt: string,
};

export enum AssessmentType {
  PPQ = "PPQ",
  POST_PPQ = "POST_PPQ",
}


export type ModelMicroCoachMisconceptionConnection = {
  __typename: "ModelMicroCoachMisconceptionConnection",
  items:  Array<MicroCoachMisconception | null >,
  nextToken?: string | null,
};

export type MicroCoachMisconception = {
  __typename: "MicroCoachMisconception",
  id: string,
  sessionId: string,
  classId: string,
  activities?: ModelMicroCoachActivityConnection | null,
  rank: number,
  badge?: Badge | null,
  title: string,
  titleCased?: string | null,
  shortLabel?: string | null,
  description: string,
  consequence?: string | null,
  prevalence?: Prevalence | null,
  detailStatus: DetailStatus,
  studentWork?: string | null,
  skillContext?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelMicroCoachActivityConnection = {
  __typename: "ModelMicroCoachActivityConnection",
  items:  Array<MicroCoachActivity | null >,
  nextToken?: string | null,
};

export type MicroCoachActivity = {
  __typename: "MicroCoachActivity",
  id: string,
  misconceptionId: string,
  sessionId: string,
  classId: string,
  activityType: ActivityType,
  title?: string | null,
  isSelected?: boolean | null,
  selectLabel?: string | null,
  detailStatus: DetailStatus,
  routine?: string | null,
  durationMinutes?: number | null,
  durationLabel?: string | null,
  grouping?: Grouping | null,
  targets?: string | null,
  instructionalMove?: string | null,
  strategyTag?: string | null,
  phases?: string | null,
  createdAt: string,
  updatedAt: string,
};

export enum ActivityType {
  INCORRECT_WORKED_EXAMPLES = "INCORRECT_WORKED_EXAMPLES",
  COMPARE_THE_THINKING = "COMPARE_THE_THINKING",
  MATH_HOSPITAL = "MATH_HOSPITAL",
  MULTIPLE_REPRESENTATIONS = "MULTIPLE_REPRESENTATIONS",
  FAVORITE_NO = "FAVORITE_NO",
}


export enum DetailStatus {
  COMPLETE = "COMPLETE",
  PARTIAL = "PARTIAL",
  CARD_ONLY = "CARD_ONLY",
  NOT_IN_WIREFRAMES = "NOT_IN_WIREFRAMES",
}


export type Grouping = {
  __typename: "Grouping",
  level: GroupingLevel,
  label: string,
};

export enum GroupingLevel {
  WHOLE_CLASS = "WHOLE_CLASS",
  SPLIT_CLASS = "SPLIT_CLASS",
  SMALL_GROUP = "SMALL_GROUP",
}


export enum Badge {
  RECOMMENDED_FOCUS = "RECOMMENDED_FOCUS",
  CORE = "CORE",
}


export type Prevalence = {
  __typename: "Prevalence",
  level: PrevalenceLevel,
  label: string,
  studentsNeedingSupport?: number | null,
  studentsUnderstood?: number | null,
  studentsNoResponse?: number | null,
  totalAnalyzed: number,
  supportSummaryLabel?: string | null,
  understoodSummaryLabel?: string | null,
  shortCountLabel?: string | null,
};

export enum PrevalenceLevel {
  FEW = "FEW",
  SOME = "SOME",
  MOST = "MOST",
}


export type ModelMicroCoachStudentConnection = {
  __typename: "ModelMicroCoachStudentConnection",
  items:  Array<MicroCoachStudent | null >,
  nextToken?: string | null,
};

export type MicroCoachStudent = {
  __typename: "MicroCoachStudent",
  id: string,
  classId: string,
  name: string,
  externalId?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateMicroCoachUserInput = {
  id: string,
  cognitoId?: string | null,
  email?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  role?: UserRole | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachUserInput = {
  id: string,
};

export type CreateMicroCoachClassroomInput = {
  id?: string | null,
  userId: string,
  name: string,
  grade?: number | null,
  state?: string | null,
  schoolYear?: string | null,
};

export type ModelMicroCoachClassroomConditionInput = {
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  grade?: ModelIntInput | null,
  state?: ModelStringInput | null,
  schoolYear?: ModelStringInput | null,
  and?: Array< ModelMicroCoachClassroomConditionInput | null > | null,
  or?: Array< ModelMicroCoachClassroomConditionInput | null > | null,
  not?: ModelMicroCoachClassroomConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateMicroCoachClassroomInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  grade?: number | null,
  state?: string | null,
  schoolYear?: string | null,
};

export type DeleteMicroCoachClassroomInput = {
  id: string,
};

export type CreateMicroCoachStudentInput = {
  id?: string | null,
  classId: string,
  name: string,
  externalId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelMicroCoachStudentConditionInput = {
  classId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  externalId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachStudentConditionInput | null > | null,
  or?: Array< ModelMicroCoachStudentConditionInput | null > | null,
  not?: ModelMicroCoachStudentConditionInput | null,
};

export type UpdateMicroCoachStudentInput = {
  id: string,
  classId?: string | null,
  name?: string | null,
  externalId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachStudentInput = {
  id: string,
};

export type CreateMicroCoachSessionInput = {
  id?: string | null,
  classId: string,
  sessionLabel?: string | null,
  weekLabel?: string | null,
  weekNumber?: number | null,
  topic?: string | null,
  ccssStandards?: Array< string | null > | null,
  status?: SessionStatus | null,
  publishStatus?: PublishStatus | null,
  studentWorksAnalyzed?: number | null,
  studentsWithStrongUnderstanding?: number | null,
  studentsWithStrongUnderstandingIds?: Array< string | null > | null,
  studentIdsNeedingSupport?: Array< string | null > | null,
  ppqAssessmentId?: string | null,
  postPpqAssessmentId?: string | null,
  pregeneratedNextSteps?: string | null,
  evaluationResults?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelMicroCoachSessionConditionInput = {
  classId?: ModelIDInput | null,
  sessionLabel?: ModelStringInput | null,
  weekLabel?: ModelStringInput | null,
  weekNumber?: ModelIntInput | null,
  topic?: ModelStringInput | null,
  ccssStandards?: ModelStringInput | null,
  status?: ModelSessionStatusInput | null,
  publishStatus?: ModelPublishStatusInput | null,
  studentWorksAnalyzed?: ModelIntInput | null,
  studentsWithStrongUnderstanding?: ModelIntInput | null,
  studentsWithStrongUnderstandingIds?: ModelIDInput | null,
  studentIdsNeedingSupport?: ModelIDInput | null,
  ppqAssessmentId?: ModelIDInput | null,
  postPpqAssessmentId?: ModelIDInput | null,
  pregeneratedNextSteps?: ModelStringInput | null,
  evaluationResults?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachSessionConditionInput | null > | null,
  or?: Array< ModelMicroCoachSessionConditionInput | null > | null,
  not?: ModelMicroCoachSessionConditionInput | null,
};

export type ModelSessionStatusInput = {
  eq?: SessionStatus | null,
  ne?: SessionStatus | null,
};

export type ModelPublishStatusInput = {
  eq?: PublishStatus | null,
  ne?: PublishStatus | null,
};

export type UpdateMicroCoachSessionInput = {
  id: string,
  classId?: string | null,
  sessionLabel?: string | null,
  weekLabel?: string | null,
  weekNumber?: number | null,
  topic?: string | null,
  ccssStandards?: Array< string | null > | null,
  status?: SessionStatus | null,
  publishStatus?: PublishStatus | null,
  studentWorksAnalyzed?: number | null,
  studentsWithStrongUnderstanding?: number | null,
  studentsWithStrongUnderstandingIds?: Array< string | null > | null,
  studentIdsNeedingSupport?: Array< string | null > | null,
  ppqAssessmentId?: string | null,
  postPpqAssessmentId?: string | null,
  pregeneratedNextSteps?: string | null,
  evaluationResults?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachSessionInput = {
  id: string,
};

export type CreateMicroCoachAssessmentInput = {
  id?: string | null,
  classId: string,
  sessionId: string,
  assessmentCode: string,
  type: AssessmentType,
  weekNumber: number,
};

export type ModelMicroCoachAssessmentConditionInput = {
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  assessmentCode?: ModelStringInput | null,
  type?: ModelAssessmentTypeInput | null,
  weekNumber?: ModelIntInput | null,
  and?: Array< ModelMicroCoachAssessmentConditionInput | null > | null,
  or?: Array< ModelMicroCoachAssessmentConditionInput | null > | null,
  not?: ModelMicroCoachAssessmentConditionInput | null,
};

export type ModelAssessmentTypeInput = {
  eq?: AssessmentType | null,
  ne?: AssessmentType | null,
};

export type UpdateMicroCoachAssessmentInput = {
  id: string,
  classId?: string | null,
  sessionId?: string | null,
  assessmentCode?: string | null,
  type?: AssessmentType | null,
  weekNumber?: number | null,
};

export type DeleteMicroCoachAssessmentInput = {
  id: string,
};

export type CreateMicroCoachMisconceptionInput = {
  id?: string | null,
  sessionId: string,
  classId: string,
  rank: number,
  badge?: Badge | null,
  title: string,
  titleCased?: string | null,
  shortLabel?: string | null,
  description: string,
  consequence?: string | null,
  prevalence?: PrevalenceInput | null,
  detailStatus: DetailStatus,
  studentWork?: string | null,
  skillContext?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type PrevalenceInput = {
  level: PrevalenceLevel,
  label: string,
  studentsNeedingSupport?: number | null,
  studentsUnderstood?: number | null,
  studentsNoResponse?: number | null,
  totalAnalyzed: number,
  supportSummaryLabel?: string | null,
  understoodSummaryLabel?: string | null,
  shortCountLabel?: string | null,
};

export type ModelMicroCoachMisconceptionConditionInput = {
  sessionId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  rank?: ModelIntInput | null,
  badge?: ModelBadgeInput | null,
  title?: ModelStringInput | null,
  titleCased?: ModelStringInput | null,
  shortLabel?: ModelStringInput | null,
  description?: ModelStringInput | null,
  consequence?: ModelStringInput | null,
  detailStatus?: ModelDetailStatusInput | null,
  studentWork?: ModelStringInput | null,
  skillContext?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachMisconceptionConditionInput | null > | null,
  or?: Array< ModelMicroCoachMisconceptionConditionInput | null > | null,
  not?: ModelMicroCoachMisconceptionConditionInput | null,
};

export type ModelBadgeInput = {
  eq?: Badge | null,
  ne?: Badge | null,
};

export type ModelDetailStatusInput = {
  eq?: DetailStatus | null,
  ne?: DetailStatus | null,
};

export type UpdateMicroCoachMisconceptionInput = {
  id: string,
  sessionId?: string | null,
  classId?: string | null,
  rank?: number | null,
  badge?: Badge | null,
  title?: string | null,
  titleCased?: string | null,
  shortLabel?: string | null,
  description?: string | null,
  consequence?: string | null,
  prevalence?: PrevalenceInput | null,
  detailStatus?: DetailStatus | null,
  studentWork?: string | null,
  skillContext?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachMisconceptionInput = {
  id: string,
};

export type CreateMicroCoachActivityInput = {
  id?: string | null,
  misconceptionId: string,
  sessionId: string,
  classId: string,
  activityType: ActivityType,
  title?: string | null,
  isSelected?: boolean | null,
  selectLabel?: string | null,
  detailStatus: DetailStatus,
  routine?: string | null,
  durationMinutes?: number | null,
  durationLabel?: string | null,
  grouping?: GroupingInput | null,
  targets?: string | null,
  instructionalMove?: string | null,
  strategyTag?: string | null,
  phases?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type GroupingInput = {
  level: GroupingLevel,
  label: string,
};

export type ModelMicroCoachActivityConditionInput = {
  misconceptionId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  activityType?: ModelActivityTypeInput | null,
  title?: ModelStringInput | null,
  isSelected?: ModelBooleanInput | null,
  selectLabel?: ModelStringInput | null,
  detailStatus?: ModelDetailStatusInput | null,
  routine?: ModelStringInput | null,
  durationMinutes?: ModelIntInput | null,
  durationLabel?: ModelStringInput | null,
  targets?: ModelStringInput | null,
  instructionalMove?: ModelStringInput | null,
  strategyTag?: ModelStringInput | null,
  phases?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachActivityConditionInput | null > | null,
  or?: Array< ModelMicroCoachActivityConditionInput | null > | null,
  not?: ModelMicroCoachActivityConditionInput | null,
};

export type ModelActivityTypeInput = {
  eq?: ActivityType | null,
  ne?: ActivityType | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UpdateMicroCoachActivityInput = {
  id: string,
  misconceptionId?: string | null,
  sessionId?: string | null,
  classId?: string | null,
  activityType?: ActivityType | null,
  title?: string | null,
  isSelected?: boolean | null,
  selectLabel?: string | null,
  detailStatus?: DetailStatus | null,
  routine?: string | null,
  durationMinutes?: number | null,
  durationLabel?: string | null,
  grouping?: GroupingInput | null,
  targets?: string | null,
  instructionalMove?: string | null,
  strategyTag?: string | null,
  phases?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachActivityInput = {
  id: string,
};

export type CreateMicroCoachSavedPlanInput = {
  id?: string | null,
  classId: string,
  sessionId?: string | null,
  items?: Array< ItemInput | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ItemInput = {
  id: string,
  status: PlanStatus,
};

export enum PlanStatus {
  SAVED = "SAVED",
  COMPLETED = "COMPLETED",
}


export type ModelMicroCoachSavedPlanConditionInput = {
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachSavedPlanConditionInput | null > | null,
  or?: Array< ModelMicroCoachSavedPlanConditionInput | null > | null,
  not?: ModelMicroCoachSavedPlanConditionInput | null,
};

export type MicroCoachSavedPlan = {
  __typename: "MicroCoachSavedPlan",
  id: string,
  classId: string,
  sessionId?: string | null,
  items?:  Array<Item | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type Item = {
  __typename: "Item",
  id: string,
  status: PlanStatus,
};

export type UpdateMicroCoachSavedPlanInput = {
  id: string,
  classId?: string | null,
  sessionId?: string | null,
  items?: Array< ItemInput | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteMicroCoachSavedPlanInput = {
  id: string,
};

export type CreateContextDataInput = {
  id?: string | null,
  type: ContextDataType,
  title: string,
  gradeLevel?: number | null,
  weekNumber?: number | null,
  ccssStandards?: Array< string | null > | null,
  assessmentCode?: string | null,
  isReference?: boolean | null,
  nextStepLesson?: NextStepLessonInput | null,
  exemplarQuestions?: Array< ExemplarQuestionInput | null > | null,
  strategy?: InstructionalStrategyInput | null,
  walkthroughData?: WalkthroughDataInput | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum ContextDataType {
  NEXT_STEP_LESSON = "NEXT_STEP_LESSON",
  EXEMPLAR = "EXEMPLAR",
  STRATEGY = "STRATEGY",
  WALKTHROUGH = "WALKTHROUGH",
  STUDENT_WORK_SAMPLE = "STUDENT_WORK_SAMPLE",
  LESSON_PLAN = "LESSON_PLAN",
}


export type NextStepLessonInput = {
  targetAssessmentCode: string,
  targetQuestionNumbers?: Array< number | null > | null,
  topic: string,
  targetProblem: string,
  errorScenarios?: Array< ErrorScenarioInput | null > | null,
  phases?: Array< LessonPhaseInput | null > | null,
  keyTakeaways?: Array< string | null > | null,
  independentProblems?: Array< string | null > | null,
  exitTicket?: string | null,
};

export type ErrorScenarioInput = {
  studentLabel: string,
  isCorrect: boolean,
  approach: string,
  reasoning?: Array< string | null > | null,
};

export type LessonPhaseInput = {
  phaseName: string,
  durationMinutes?: number | null,
  steps?: Array< string | null > | null,
  teacherPrompts?: Array< string | null > | null,
};

export type ExemplarQuestionInput = {
  questionNumber: number,
  questionText: string,
  ccssStandard: string,
  correctAnswer: string,
  pointValue: number,
  answerChoices?: Array< AnswerChoiceInput | null > | null,
  misconceptions?: Array< ExemplarMisconceptionInput | null > | null,
  sourceNote?: string | null,
};

export type AnswerChoiceInput = {
  label: string,
  text: string,
};

export type ExemplarMisconceptionInput = {
  description: string,
  targetAnswer?: string | null,
};

export type InstructionalStrategyInput = {
  name: string,
  description: string,
  steps?: Array< string | null > | null,
  applicableGrades?: Array< number | null > | null,
  applicableStandards?: Array< string | null > | null,
  examples?: Array< string | null > | null,
};

export type WalkthroughDataInput = {
  quarter?: string | null,
  schools?: Array< SchoolObservationInput | null > | null,
};

export type SchoolObservationInput = {
  schoolCode: string,
  rubricScores?: string | null,
  notes?: string | null,
};

export type ModelContextDataConditionInput = {
  type?: ModelContextDataTypeInput | null,
  title?: ModelStringInput | null,
  gradeLevel?: ModelIntInput | null,
  weekNumber?: ModelIntInput | null,
  ccssStandards?: ModelStringInput | null,
  assessmentCode?: ModelStringInput | null,
  isReference?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContextDataConditionInput | null > | null,
  or?: Array< ModelContextDataConditionInput | null > | null,
  not?: ModelContextDataConditionInput | null,
};

export type ModelContextDataTypeInput = {
  eq?: ContextDataType | null,
  ne?: ContextDataType | null,
};

export type ContextData = {
  __typename: "ContextData",
  id: string,
  type: ContextDataType,
  title: string,
  gradeLevel?: number | null,
  weekNumber?: number | null,
  ccssStandards?: Array< string | null > | null,
  assessmentCode?: string | null,
  isReference?: boolean | null,
  nextStepLesson?: NextStepLesson | null,
  exemplarQuestions?:  Array<ExemplarQuestion | null > | null,
  strategy?: InstructionalStrategy | null,
  walkthroughData?: WalkthroughData | null,
  createdAt: string,
  updatedAt: string,
};

export type NextStepLesson = {
  __typename: "NextStepLesson",
  targetAssessmentCode: string,
  targetQuestionNumbers?: Array< number | null > | null,
  topic: string,
  targetProblem: string,
  errorScenarios?:  Array<ErrorScenario | null > | null,
  phases?:  Array<LessonPhase | null > | null,
  keyTakeaways?: Array< string | null > | null,
  independentProblems?: Array< string | null > | null,
  exitTicket?: string | null,
};

export type ErrorScenario = {
  __typename: "ErrorScenario",
  studentLabel: string,
  isCorrect: boolean,
  approach: string,
  reasoning?: Array< string | null > | null,
};

export type LessonPhase = {
  __typename: "LessonPhase",
  phaseName: string,
  durationMinutes?: number | null,
  steps?: Array< string | null > | null,
  teacherPrompts?: Array< string | null > | null,
};

export type ExemplarQuestion = {
  __typename: "ExemplarQuestion",
  questionNumber: number,
  questionText: string,
  ccssStandard: string,
  correctAnswer: string,
  pointValue: number,
  answerChoices?:  Array<AnswerChoice | null > | null,
  misconceptions?:  Array<ExemplarMisconception | null > | null,
  sourceNote?: string | null,
};

export type AnswerChoice = {
  __typename: "AnswerChoice",
  label: string,
  text: string,
};

export type ExemplarMisconception = {
  __typename: "ExemplarMisconception",
  description: string,
  targetAnswer?: string | null,
};

export type InstructionalStrategy = {
  __typename: "InstructionalStrategy",
  name: string,
  description: string,
  steps?: Array< string | null > | null,
  applicableGrades?: Array< number | null > | null,
  applicableStandards?: Array< string | null > | null,
  examples?: Array< string | null > | null,
};

export type WalkthroughData = {
  __typename: "WalkthroughData",
  quarter?: string | null,
  schools?:  Array<SchoolObservation | null > | null,
};

export type SchoolObservation = {
  __typename: "SchoolObservation",
  schoolCode: string,
  rubricScores?: string | null,
  notes?: string | null,
};

export type UpdateContextDataInput = {
  id: string,
  type?: ContextDataType | null,
  title?: string | null,
  gradeLevel?: number | null,
  weekNumber?: number | null,
  ccssStandards?: Array< string | null > | null,
  assessmentCode?: string | null,
  isReference?: boolean | null,
  nextStepLesson?: NextStepLessonInput | null,
  exemplarQuestions?: Array< ExemplarQuestionInput | null > | null,
  strategy?: InstructionalStrategyInput | null,
  walkthroughData?: WalkthroughDataInput | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteContextDataInput = {
  id: string,
};

export type ModelMicroCoachUserFilterInput = {
  id?: ModelIDInput | null,
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firstName?: ModelStringInput | null,
  lastName?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachUserFilterInput | null > | null,
  or?: Array< ModelMicroCoachUserFilterInput | null > | null,
  not?: ModelMicroCoachUserFilterInput | null,
};

export type ModelMicroCoachUserConnection = {
  __typename: "ModelMicroCoachUserConnection",
  items:  Array<MicroCoachUser | null >,
  nextToken?: string | null,
};

export type ModelMicroCoachClassroomFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  grade?: ModelIntInput | null,
  state?: ModelStringInput | null,
  schoolYear?: ModelStringInput | null,
  and?: Array< ModelMicroCoachClassroomFilterInput | null > | null,
  or?: Array< ModelMicroCoachClassroomFilterInput | null > | null,
  not?: ModelMicroCoachClassroomFilterInput | null,
};

export type ModelMicroCoachStudentFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  externalId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachStudentFilterInput | null > | null,
  or?: Array< ModelMicroCoachStudentFilterInput | null > | null,
  not?: ModelMicroCoachStudentFilterInput | null,
};

export type ModelMicroCoachSessionFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  sessionLabel?: ModelStringInput | null,
  weekLabel?: ModelStringInput | null,
  weekNumber?: ModelIntInput | null,
  topic?: ModelStringInput | null,
  ccssStandards?: ModelStringInput | null,
  status?: ModelSessionStatusInput | null,
  publishStatus?: ModelPublishStatusInput | null,
  studentWorksAnalyzed?: ModelIntInput | null,
  studentsWithStrongUnderstanding?: ModelIntInput | null,
  studentsWithStrongUnderstandingIds?: ModelIDInput | null,
  studentIdsNeedingSupport?: ModelIDInput | null,
  ppqAssessmentId?: ModelIDInput | null,
  postPpqAssessmentId?: ModelIDInput | null,
  pregeneratedNextSteps?: ModelStringInput | null,
  evaluationResults?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachSessionFilterInput | null > | null,
  or?: Array< ModelMicroCoachSessionFilterInput | null > | null,
  not?: ModelMicroCoachSessionFilterInput | null,
};

export type ModelMicroCoachAssessmentFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  assessmentCode?: ModelStringInput | null,
  type?: ModelAssessmentTypeInput | null,
  weekNumber?: ModelIntInput | null,
  and?: Array< ModelMicroCoachAssessmentFilterInput | null > | null,
  or?: Array< ModelMicroCoachAssessmentFilterInput | null > | null,
  not?: ModelMicroCoachAssessmentFilterInput | null,
};

export type ModelMicroCoachMisconceptionFilterInput = {
  id?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  rank?: ModelIntInput | null,
  badge?: ModelBadgeInput | null,
  title?: ModelStringInput | null,
  titleCased?: ModelStringInput | null,
  shortLabel?: ModelStringInput | null,
  description?: ModelStringInput | null,
  consequence?: ModelStringInput | null,
  detailStatus?: ModelDetailStatusInput | null,
  studentWork?: ModelStringInput | null,
  skillContext?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachMisconceptionFilterInput | null > | null,
  or?: Array< ModelMicroCoachMisconceptionFilterInput | null > | null,
  not?: ModelMicroCoachMisconceptionFilterInput | null,
};

export type ModelMicroCoachActivityFilterInput = {
  id?: ModelIDInput | null,
  misconceptionId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  activityType?: ModelActivityTypeInput | null,
  title?: ModelStringInput | null,
  isSelected?: ModelBooleanInput | null,
  selectLabel?: ModelStringInput | null,
  detailStatus?: ModelDetailStatusInput | null,
  routine?: ModelStringInput | null,
  durationMinutes?: ModelIntInput | null,
  durationLabel?: ModelStringInput | null,
  targets?: ModelStringInput | null,
  instructionalMove?: ModelStringInput | null,
  strategyTag?: ModelStringInput | null,
  phases?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachActivityFilterInput | null > | null,
  or?: Array< ModelMicroCoachActivityFilterInput | null > | null,
  not?: ModelMicroCoachActivityFilterInput | null,
};

export type ModelMicroCoachSavedPlanFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelMicroCoachSavedPlanFilterInput | null > | null,
  or?: Array< ModelMicroCoachSavedPlanFilterInput | null > | null,
  not?: ModelMicroCoachSavedPlanFilterInput | null,
};

export type ModelMicroCoachSavedPlanConnection = {
  __typename: "ModelMicroCoachSavedPlanConnection",
  items:  Array<MicroCoachSavedPlan | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelContextDataFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelContextDataTypeInput | null,
  title?: ModelStringInput | null,
  gradeLevel?: ModelIntInput | null,
  weekNumber?: ModelIntInput | null,
  ccssStandards?: ModelStringInput | null,
  assessmentCode?: ModelStringInput | null,
  isReference?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelContextDataFilterInput | null > | null,
  or?: Array< ModelContextDataFilterInput | null > | null,
  not?: ModelContextDataFilterInput | null,
};

export type ModelContextDataConnection = {
  __typename: "ModelContextDataConnection",
  items:  Array<ContextData | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionMicroCoachUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  firstName?: ModelSubscriptionStringInput | null,
  lastName?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachUserFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionMicroCoachClassroomFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  grade?: ModelSubscriptionIntInput | null,
  state?: ModelSubscriptionStringInput | null,
  schoolYear?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachClassroomFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachClassroomFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionMicroCoachStudentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  externalId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachStudentFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachStudentFilterInput | null > | null,
};

export type ModelSubscriptionMicroCoachSessionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  sessionLabel?: ModelSubscriptionStringInput | null,
  weekLabel?: ModelSubscriptionStringInput | null,
  weekNumber?: ModelSubscriptionIntInput | null,
  topic?: ModelSubscriptionStringInput | null,
  ccssStandards?: ModelSubscriptionStringInput | null,
  status?: ModelSubscriptionStringInput | null,
  publishStatus?: ModelSubscriptionStringInput | null,
  studentWorksAnalyzed?: ModelSubscriptionIntInput | null,
  studentsWithStrongUnderstanding?: ModelSubscriptionIntInput | null,
  studentsWithStrongUnderstandingIds?: ModelSubscriptionIDInput | null,
  studentIdsNeedingSupport?: ModelSubscriptionIDInput | null,
  ppqAssessmentId?: ModelSubscriptionIDInput | null,
  postPpqAssessmentId?: ModelSubscriptionIDInput | null,
  pregeneratedNextSteps?: ModelSubscriptionStringInput | null,
  evaluationResults?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachSessionFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachSessionFilterInput | null > | null,
};

export type ModelSubscriptionMicroCoachAssessmentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  assessmentCode?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  weekNumber?: ModelSubscriptionIntInput | null,
  and?: Array< ModelSubscriptionMicroCoachAssessmentFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachAssessmentFilterInput | null > | null,
};

export type ModelSubscriptionMicroCoachMisconceptionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  rank?: ModelSubscriptionIntInput | null,
  badge?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  titleCased?: ModelSubscriptionStringInput | null,
  shortLabel?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  consequence?: ModelSubscriptionStringInput | null,
  detailStatus?: ModelSubscriptionStringInput | null,
  studentWork?: ModelSubscriptionStringInput | null,
  skillContext?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachMisconceptionFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachMisconceptionFilterInput | null > | null,
};

export type ModelSubscriptionMicroCoachActivityFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  misconceptionId?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  activityType?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  isSelected?: ModelSubscriptionBooleanInput | null,
  selectLabel?: ModelSubscriptionStringInput | null,
  detailStatus?: ModelSubscriptionStringInput | null,
  routine?: ModelSubscriptionStringInput | null,
  durationMinutes?: ModelSubscriptionIntInput | null,
  durationLabel?: ModelSubscriptionStringInput | null,
  targets?: ModelSubscriptionStringInput | null,
  instructionalMove?: ModelSubscriptionStringInput | null,
  strategyTag?: ModelSubscriptionStringInput | null,
  phases?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachActivityFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachActivityFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionMicroCoachSavedPlanFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionMicroCoachSavedPlanFilterInput | null > | null,
  or?: Array< ModelSubscriptionMicroCoachSavedPlanFilterInput | null > | null,
};

export type ModelSubscriptionContextDataFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  title?: ModelSubscriptionStringInput | null,
  gradeLevel?: ModelSubscriptionIntInput | null,
  weekNumber?: ModelSubscriptionIntInput | null,
  ccssStandards?: ModelSubscriptionStringInput | null,
  assessmentCode?: ModelSubscriptionStringInput | null,
  isReference?: ModelSubscriptionBooleanInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionContextDataFilterInput | null > | null,
  or?: Array< ModelSubscriptionContextDataFilterInput | null > | null,
};

export type CreateMicroCoachUserMutationVariables = {
  input: CreateMicroCoachUserInput,
  condition?: ModelMicroCoachUserConditionInput | null,
};

export type CreateMicroCoachUserMutation = {
  createMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachUserMutationVariables = {
  input: UpdateMicroCoachUserInput,
  condition?: ModelMicroCoachUserConditionInput | null,
};

export type UpdateMicroCoachUserMutation = {
  updateMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachUserMutationVariables = {
  input: DeleteMicroCoachUserInput,
  condition?: ModelMicroCoachUserConditionInput | null,
};

export type DeleteMicroCoachUserMutation = {
  deleteMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachClassroomMutationVariables = {
  input: CreateMicroCoachClassroomInput,
  condition?: ModelMicroCoachClassroomConditionInput | null,
};

export type CreateMicroCoachClassroomMutation = {
  createMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachClassroomMutationVariables = {
  input: UpdateMicroCoachClassroomInput,
  condition?: ModelMicroCoachClassroomConditionInput | null,
};

export type UpdateMicroCoachClassroomMutation = {
  updateMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachClassroomMutationVariables = {
  input: DeleteMicroCoachClassroomInput,
  condition?: ModelMicroCoachClassroomConditionInput | null,
};

export type DeleteMicroCoachClassroomMutation = {
  deleteMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachStudentMutationVariables = {
  input: CreateMicroCoachStudentInput,
  condition?: ModelMicroCoachStudentConditionInput | null,
};

export type CreateMicroCoachStudentMutation = {
  createMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachStudentMutationVariables = {
  input: UpdateMicroCoachStudentInput,
  condition?: ModelMicroCoachStudentConditionInput | null,
};

export type UpdateMicroCoachStudentMutation = {
  updateMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachStudentMutationVariables = {
  input: DeleteMicroCoachStudentInput,
  condition?: ModelMicroCoachStudentConditionInput | null,
};

export type DeleteMicroCoachStudentMutation = {
  deleteMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachSessionMutationVariables = {
  input: CreateMicroCoachSessionInput,
  condition?: ModelMicroCoachSessionConditionInput | null,
};

export type CreateMicroCoachSessionMutation = {
  createMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachSessionMutationVariables = {
  input: UpdateMicroCoachSessionInput,
  condition?: ModelMicroCoachSessionConditionInput | null,
};

export type UpdateMicroCoachSessionMutation = {
  updateMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachSessionMutationVariables = {
  input: DeleteMicroCoachSessionInput,
  condition?: ModelMicroCoachSessionConditionInput | null,
};

export type DeleteMicroCoachSessionMutation = {
  deleteMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachAssessmentMutationVariables = {
  input: CreateMicroCoachAssessmentInput,
  condition?: ModelMicroCoachAssessmentConditionInput | null,
};

export type CreateMicroCoachAssessmentMutation = {
  createMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachAssessmentMutationVariables = {
  input: UpdateMicroCoachAssessmentInput,
  condition?: ModelMicroCoachAssessmentConditionInput | null,
};

export type UpdateMicroCoachAssessmentMutation = {
  updateMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachAssessmentMutationVariables = {
  input: DeleteMicroCoachAssessmentInput,
  condition?: ModelMicroCoachAssessmentConditionInput | null,
};

export type DeleteMicroCoachAssessmentMutation = {
  deleteMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachMisconceptionMutationVariables = {
  input: CreateMicroCoachMisconceptionInput,
  condition?: ModelMicroCoachMisconceptionConditionInput | null,
};

export type CreateMicroCoachMisconceptionMutation = {
  createMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachMisconceptionMutationVariables = {
  input: UpdateMicroCoachMisconceptionInput,
  condition?: ModelMicroCoachMisconceptionConditionInput | null,
};

export type UpdateMicroCoachMisconceptionMutation = {
  updateMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachMisconceptionMutationVariables = {
  input: DeleteMicroCoachMisconceptionInput,
  condition?: ModelMicroCoachMisconceptionConditionInput | null,
};

export type DeleteMicroCoachMisconceptionMutation = {
  deleteMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachActivityMutationVariables = {
  input: CreateMicroCoachActivityInput,
  condition?: ModelMicroCoachActivityConditionInput | null,
};

export type CreateMicroCoachActivityMutation = {
  createMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachActivityMutationVariables = {
  input: UpdateMicroCoachActivityInput,
  condition?: ModelMicroCoachActivityConditionInput | null,
};

export type UpdateMicroCoachActivityMutation = {
  updateMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachActivityMutationVariables = {
  input: DeleteMicroCoachActivityInput,
  condition?: ModelMicroCoachActivityConditionInput | null,
};

export type DeleteMicroCoachActivityMutation = {
  deleteMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateMicroCoachSavedPlanMutationVariables = {
  input: CreateMicroCoachSavedPlanInput,
  condition?: ModelMicroCoachSavedPlanConditionInput | null,
};

export type CreateMicroCoachSavedPlanMutation = {
  createMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateMicroCoachSavedPlanMutationVariables = {
  input: UpdateMicroCoachSavedPlanInput,
  condition?: ModelMicroCoachSavedPlanConditionInput | null,
};

export type UpdateMicroCoachSavedPlanMutation = {
  updateMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteMicroCoachSavedPlanMutationVariables = {
  input: DeleteMicroCoachSavedPlanInput,
  condition?: ModelMicroCoachSavedPlanConditionInput | null,
};

export type DeleteMicroCoachSavedPlanMutation = {
  deleteMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateContextDataMutationVariables = {
  input: CreateContextDataInput,
  condition?: ModelContextDataConditionInput | null,
};

export type CreateContextDataMutation = {
  createContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateContextDataMutationVariables = {
  input: UpdateContextDataInput,
  condition?: ModelContextDataConditionInput | null,
};

export type UpdateContextDataMutation = {
  updateContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteContextDataMutationVariables = {
  input: DeleteContextDataInput,
  condition?: ModelContextDataConditionInput | null,
};

export type DeleteContextDataMutation = {
  deleteContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetMicroCoachUserQueryVariables = {
  id: string,
};

export type GetMicroCoachUserQuery = {
  getMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachUsersQueryVariables = {
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachUsersQuery = {
  listMicroCoachUsers?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      firstName?: string | null,
      lastName?: string | null,
      classes?:  {
        __typename: "ModelMicroCoachClassroomConnection",
        items:  Array< {
          __typename: "MicroCoachClassroom",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelMicroCoachSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelMicroCoachStudentConnection",
            nextToken?: string | null,
          } | null,
          name: string,
          grade?: number | null,
          state?: string | null,
          schoolYear?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachClassroomQueryVariables = {
  id: string,
};

export type GetMicroCoachClassroomQuery = {
  getMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachClassroomsQueryVariables = {
  filter?: ModelMicroCoachClassroomFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachClassroomsQuery = {
  listMicroCoachClassrooms?:  {
    __typename: "ModelMicroCoachClassroomConnection",
    items:  Array< {
      __typename: "MicroCoachClassroom",
      id: string,
      userId: string,
      sessions?:  {
        __typename: "ModelMicroCoachSessionConnection",
        items:  Array< {
          __typename: "MicroCoachSession",
          id: string,
          classId: string,
          sessionLabel?: string | null,
          weekLabel?: string | null,
          weekNumber?: number | null,
          topic?: string | null,
          ccssStandards?: Array< string | null > | null,
          status?: SessionStatus | null,
          publishStatus?: PublishStatus | null,
          studentWorksAnalyzed?: number | null,
          studentsWithStrongUnderstanding?: number | null,
          studentsWithStrongUnderstandingIds?: Array< string | null > | null,
          studentIdsNeedingSupport?: Array< string | null > | null,
          ppqAssessmentId?: string | null,
          postPpqAssessmentId?: string | null,
          assessments?:  {
            __typename: "ModelMicroCoachAssessmentConnection",
            nextToken?: string | null,
          } | null,
          misconceptions?:  {
            __typename: "ModelMicroCoachMisconceptionConnection",
            nextToken?: string | null,
          } | null,
          pregeneratedNextSteps?: string | null,
          evaluationResults?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      students?:  {
        __typename: "ModelMicroCoachStudentConnection",
        items:  Array< {
          __typename: "MicroCoachStudent",
          id: string,
          classId: string,
          name: string,
          externalId?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      name: string,
      grade?: number | null,
      state?: string | null,
      schoolYear?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachStudentQueryVariables = {
  id: string,
};

export type GetMicroCoachStudentQuery = {
  getMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachStudentsQueryVariables = {
  filter?: ModelMicroCoachStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachStudentsQuery = {
  listMicroCoachStudents?:  {
    __typename: "ModelMicroCoachStudentConnection",
    items:  Array< {
      __typename: "MicroCoachStudent",
      id: string,
      classId: string,
      name: string,
      externalId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachSessionQueryVariables = {
  id: string,
};

export type GetMicroCoachSessionQuery = {
  getMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachSessionsQueryVariables = {
  filter?: ModelMicroCoachSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachSessionsQuery = {
  listMicroCoachSessions?:  {
    __typename: "ModelMicroCoachSessionConnection",
    items:  Array< {
      __typename: "MicroCoachSession",
      id: string,
      classId: string,
      sessionLabel?: string | null,
      weekLabel?: string | null,
      weekNumber?: number | null,
      topic?: string | null,
      ccssStandards?: Array< string | null > | null,
      status?: SessionStatus | null,
      publishStatus?: PublishStatus | null,
      studentWorksAnalyzed?: number | null,
      studentsWithStrongUnderstanding?: number | null,
      studentsWithStrongUnderstandingIds?: Array< string | null > | null,
      studentIdsNeedingSupport?: Array< string | null > | null,
      ppqAssessmentId?: string | null,
      postPpqAssessmentId?: string | null,
      assessments?:  {
        __typename: "ModelMicroCoachAssessmentConnection",
        items:  Array< {
          __typename: "MicroCoachAssessment",
          id: string,
          classId: string,
          sessionId: string,
          assessmentCode: string,
          type: AssessmentType,
          weekNumber: number,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      misconceptions?:  {
        __typename: "ModelMicroCoachMisconceptionConnection",
        items:  Array< {
          __typename: "MicroCoachMisconception",
          id: string,
          sessionId: string,
          classId: string,
          activities?:  {
            __typename: "ModelMicroCoachActivityConnection",
            nextToken?: string | null,
          } | null,
          rank: number,
          badge?: Badge | null,
          title: string,
          titleCased?: string | null,
          shortLabel?: string | null,
          description: string,
          consequence?: string | null,
          prevalence?:  {
            __typename: "Prevalence",
            level: PrevalenceLevel,
            label: string,
            studentsNeedingSupport?: number | null,
            studentsUnderstood?: number | null,
            studentsNoResponse?: number | null,
            totalAnalyzed: number,
            supportSummaryLabel?: string | null,
            understoodSummaryLabel?: string | null,
            shortCountLabel?: string | null,
          } | null,
          detailStatus: DetailStatus,
          studentWork?: string | null,
          skillContext?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      pregeneratedNextSteps?: string | null,
      evaluationResults?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachAssessmentQueryVariables = {
  id: string,
};

export type GetMicroCoachAssessmentQuery = {
  getMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachAssessmentsQueryVariables = {
  filter?: ModelMicroCoachAssessmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachAssessmentsQuery = {
  listMicroCoachAssessments?:  {
    __typename: "ModelMicroCoachAssessmentConnection",
    items:  Array< {
      __typename: "MicroCoachAssessment",
      id: string,
      classId: string,
      sessionId: string,
      assessmentCode: string,
      type: AssessmentType,
      weekNumber: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachMisconceptionQueryVariables = {
  id: string,
};

export type GetMicroCoachMisconceptionQuery = {
  getMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachMisconceptionsQueryVariables = {
  filter?: ModelMicroCoachMisconceptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachMisconceptionsQuery = {
  listMicroCoachMisconceptions?:  {
    __typename: "ModelMicroCoachMisconceptionConnection",
    items:  Array< {
      __typename: "MicroCoachMisconception",
      id: string,
      sessionId: string,
      classId: string,
      activities?:  {
        __typename: "ModelMicroCoachActivityConnection",
        items:  Array< {
          __typename: "MicroCoachActivity",
          id: string,
          misconceptionId: string,
          sessionId: string,
          classId: string,
          activityType: ActivityType,
          title?: string | null,
          isSelected?: boolean | null,
          selectLabel?: string | null,
          detailStatus: DetailStatus,
          routine?: string | null,
          durationMinutes?: number | null,
          durationLabel?: string | null,
          grouping?:  {
            __typename: "Grouping",
            level: GroupingLevel,
            label: string,
          } | null,
          targets?: string | null,
          instructionalMove?: string | null,
          strategyTag?: string | null,
          phases?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      rank: number,
      badge?: Badge | null,
      title: string,
      titleCased?: string | null,
      shortLabel?: string | null,
      description: string,
      consequence?: string | null,
      prevalence?:  {
        __typename: "Prevalence",
        level: PrevalenceLevel,
        label: string,
        studentsNeedingSupport?: number | null,
        studentsUnderstood?: number | null,
        studentsNoResponse?: number | null,
        totalAnalyzed: number,
        supportSummaryLabel?: string | null,
        understoodSummaryLabel?: string | null,
        shortCountLabel?: string | null,
      } | null,
      detailStatus: DetailStatus,
      studentWork?: string | null,
      skillContext?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachActivityQueryVariables = {
  id: string,
};

export type GetMicroCoachActivityQuery = {
  getMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachActivitiesQueryVariables = {
  filter?: ModelMicroCoachActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachActivitiesQuery = {
  listMicroCoachActivities?:  {
    __typename: "ModelMicroCoachActivityConnection",
    items:  Array< {
      __typename: "MicroCoachActivity",
      id: string,
      misconceptionId: string,
      sessionId: string,
      classId: string,
      activityType: ActivityType,
      title?: string | null,
      isSelected?: boolean | null,
      selectLabel?: string | null,
      detailStatus: DetailStatus,
      routine?: string | null,
      durationMinutes?: number | null,
      durationLabel?: string | null,
      grouping?:  {
        __typename: "Grouping",
        level: GroupingLevel,
        label: string,
      } | null,
      targets?: string | null,
      instructionalMove?: string | null,
      strategyTag?: string | null,
      phases?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetMicroCoachSavedPlanQueryVariables = {
  id: string,
};

export type GetMicroCoachSavedPlanQuery = {
  getMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListMicroCoachSavedPlansQueryVariables = {
  filter?: ModelMicroCoachSavedPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMicroCoachSavedPlansQuery = {
  listMicroCoachSavedPlans?:  {
    __typename: "ModelMicroCoachSavedPlanConnection",
    items:  Array< {
      __typename: "MicroCoachSavedPlan",
      id: string,
      classId: string,
      sessionId?: string | null,
      items?:  Array< {
        __typename: "Item",
        id: string,
        status: PlanStatus,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByCognitoIdQueryVariables = {
  cognitoId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByCognitoIdQuery = {
  usersByCognitoId?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      firstName?: string | null,
      lastName?: string | null,
      classes?:  {
        __typename: "ModelMicroCoachClassroomConnection",
        items:  Array< {
          __typename: "MicroCoachClassroom",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelMicroCoachSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelMicroCoachStudentConnection",
            nextToken?: string | null,
          } | null,
          name: string,
          grade?: number | null,
          state?: string | null,
          schoolYear?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByEmailQueryVariables = {
  email: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      firstName?: string | null,
      lastName?: string | null,
      classes?:  {
        __typename: "ModelMicroCoachClassroomConnection",
        items:  Array< {
          __typename: "MicroCoachClassroom",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelMicroCoachSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelMicroCoachStudentConnection",
            nextToken?: string | null,
          } | null,
          name: string,
          grade?: number | null,
          state?: string | null,
          schoolYear?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UsersByRoleQueryVariables = {
  role: UserRole,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByRoleQuery = {
  usersByRole?:  {
    __typename: "ModelMicroCoachUserConnection",
    items:  Array< {
      __typename: "MicroCoachUser",
      id: string,
      cognitoId: string,
      email: string,
      firstName?: string | null,
      lastName?: string | null,
      classes?:  {
        __typename: "ModelMicroCoachClassroomConnection",
        items:  Array< {
          __typename: "MicroCoachClassroom",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelMicroCoachSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelMicroCoachStudentConnection",
            nextToken?: string | null,
          } | null,
          name: string,
          grade?: number | null,
          state?: string | null,
          schoolYear?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      role: UserRole,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachClassroomsByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachClassroomFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachClassroomsByUserIdQuery = {
  microCoachClassroomsByUserId?:  {
    __typename: "ModelMicroCoachClassroomConnection",
    items:  Array< {
      __typename: "MicroCoachClassroom",
      id: string,
      userId: string,
      sessions?:  {
        __typename: "ModelMicroCoachSessionConnection",
        items:  Array< {
          __typename: "MicroCoachSession",
          id: string,
          classId: string,
          sessionLabel?: string | null,
          weekLabel?: string | null,
          weekNumber?: number | null,
          topic?: string | null,
          ccssStandards?: Array< string | null > | null,
          status?: SessionStatus | null,
          publishStatus?: PublishStatus | null,
          studentWorksAnalyzed?: number | null,
          studentsWithStrongUnderstanding?: number | null,
          studentsWithStrongUnderstandingIds?: Array< string | null > | null,
          studentIdsNeedingSupport?: Array< string | null > | null,
          ppqAssessmentId?: string | null,
          postPpqAssessmentId?: string | null,
          assessments?:  {
            __typename: "ModelMicroCoachAssessmentConnection",
            nextToken?: string | null,
          } | null,
          misconceptions?:  {
            __typename: "ModelMicroCoachMisconceptionConnection",
            nextToken?: string | null,
          } | null,
          pregeneratedNextSteps?: string | null,
          evaluationResults?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      students?:  {
        __typename: "ModelMicroCoachStudentConnection",
        items:  Array< {
          __typename: "MicroCoachStudent",
          id: string,
          classId: string,
          name: string,
          externalId?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      name: string,
      grade?: number | null,
      state?: string | null,
      schoolYear?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachStudentsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachStudentsByClassIdQuery = {
  microCoachStudentsByClassId?:  {
    __typename: "ModelMicroCoachStudentConnection",
    items:  Array< {
      __typename: "MicroCoachStudent",
      id: string,
      classId: string,
      name: string,
      externalId?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachSessionsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachSessionsByClassIdQuery = {
  microCoachSessionsByClassId?:  {
    __typename: "ModelMicroCoachSessionConnection",
    items:  Array< {
      __typename: "MicroCoachSession",
      id: string,
      classId: string,
      sessionLabel?: string | null,
      weekLabel?: string | null,
      weekNumber?: number | null,
      topic?: string | null,
      ccssStandards?: Array< string | null > | null,
      status?: SessionStatus | null,
      publishStatus?: PublishStatus | null,
      studentWorksAnalyzed?: number | null,
      studentsWithStrongUnderstanding?: number | null,
      studentsWithStrongUnderstandingIds?: Array< string | null > | null,
      studentIdsNeedingSupport?: Array< string | null > | null,
      ppqAssessmentId?: string | null,
      postPpqAssessmentId?: string | null,
      assessments?:  {
        __typename: "ModelMicroCoachAssessmentConnection",
        items:  Array< {
          __typename: "MicroCoachAssessment",
          id: string,
          classId: string,
          sessionId: string,
          assessmentCode: string,
          type: AssessmentType,
          weekNumber: number,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      misconceptions?:  {
        __typename: "ModelMicroCoachMisconceptionConnection",
        items:  Array< {
          __typename: "MicroCoachMisconception",
          id: string,
          sessionId: string,
          classId: string,
          activities?:  {
            __typename: "ModelMicroCoachActivityConnection",
            nextToken?: string | null,
          } | null,
          rank: number,
          badge?: Badge | null,
          title: string,
          titleCased?: string | null,
          shortLabel?: string | null,
          description: string,
          consequence?: string | null,
          prevalence?:  {
            __typename: "Prevalence",
            level: PrevalenceLevel,
            label: string,
            studentsNeedingSupport?: number | null,
            studentsUnderstood?: number | null,
            studentsNoResponse?: number | null,
            totalAnalyzed: number,
            supportSummaryLabel?: string | null,
            understoodSummaryLabel?: string | null,
            shortCountLabel?: string | null,
          } | null,
          detailStatus: DetailStatus,
          studentWork?: string | null,
          skillContext?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      pregeneratedNextSteps?: string | null,
      evaluationResults?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachAssessmentsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachAssessmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachAssessmentsByClassIdQuery = {
  microCoachAssessmentsByClassId?:  {
    __typename: "ModelMicroCoachAssessmentConnection",
    items:  Array< {
      __typename: "MicroCoachAssessment",
      id: string,
      classId: string,
      sessionId: string,
      assessmentCode: string,
      type: AssessmentType,
      weekNumber: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachAssessmentsBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachAssessmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachAssessmentsBySessionIdQuery = {
  microCoachAssessmentsBySessionId?:  {
    __typename: "ModelMicroCoachAssessmentConnection",
    items:  Array< {
      __typename: "MicroCoachAssessment",
      id: string,
      classId: string,
      sessionId: string,
      assessmentCode: string,
      type: AssessmentType,
      weekNumber: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachMisconceptionsBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachMisconceptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachMisconceptionsBySessionIdQuery = {
  microCoachMisconceptionsBySessionId?:  {
    __typename: "ModelMicroCoachMisconceptionConnection",
    items:  Array< {
      __typename: "MicroCoachMisconception",
      id: string,
      sessionId: string,
      classId: string,
      activities?:  {
        __typename: "ModelMicroCoachActivityConnection",
        items:  Array< {
          __typename: "MicroCoachActivity",
          id: string,
          misconceptionId: string,
          sessionId: string,
          classId: string,
          activityType: ActivityType,
          title?: string | null,
          isSelected?: boolean | null,
          selectLabel?: string | null,
          detailStatus: DetailStatus,
          routine?: string | null,
          durationMinutes?: number | null,
          durationLabel?: string | null,
          grouping?:  {
            __typename: "Grouping",
            level: GroupingLevel,
            label: string,
          } | null,
          targets?: string | null,
          instructionalMove?: string | null,
          strategyTag?: string | null,
          phases?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      rank: number,
      badge?: Badge | null,
      title: string,
      titleCased?: string | null,
      shortLabel?: string | null,
      description: string,
      consequence?: string | null,
      prevalence?:  {
        __typename: "Prevalence",
        level: PrevalenceLevel,
        label: string,
        studentsNeedingSupport?: number | null,
        studentsUnderstood?: number | null,
        studentsNoResponse?: number | null,
        totalAnalyzed: number,
        supportSummaryLabel?: string | null,
        understoodSummaryLabel?: string | null,
        shortCountLabel?: string | null,
      } | null,
      detailStatus: DetailStatus,
      studentWork?: string | null,
      skillContext?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachMisconceptionsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachMisconceptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachMisconceptionsByClassIdQuery = {
  microCoachMisconceptionsByClassId?:  {
    __typename: "ModelMicroCoachMisconceptionConnection",
    items:  Array< {
      __typename: "MicroCoachMisconception",
      id: string,
      sessionId: string,
      classId: string,
      activities?:  {
        __typename: "ModelMicroCoachActivityConnection",
        items:  Array< {
          __typename: "MicroCoachActivity",
          id: string,
          misconceptionId: string,
          sessionId: string,
          classId: string,
          activityType: ActivityType,
          title?: string | null,
          isSelected?: boolean | null,
          selectLabel?: string | null,
          detailStatus: DetailStatus,
          routine?: string | null,
          durationMinutes?: number | null,
          durationLabel?: string | null,
          grouping?:  {
            __typename: "Grouping",
            level: GroupingLevel,
            label: string,
          } | null,
          targets?: string | null,
          instructionalMove?: string | null,
          strategyTag?: string | null,
          phases?: string | null,
          createdAt: string,
          updatedAt: string,
        } | null >,
        nextToken?: string | null,
      } | null,
      rank: number,
      badge?: Badge | null,
      title: string,
      titleCased?: string | null,
      shortLabel?: string | null,
      description: string,
      consequence?: string | null,
      prevalence?:  {
        __typename: "Prevalence",
        level: PrevalenceLevel,
        label: string,
        studentsNeedingSupport?: number | null,
        studentsUnderstood?: number | null,
        studentsNoResponse?: number | null,
        totalAnalyzed: number,
        supportSummaryLabel?: string | null,
        understoodSummaryLabel?: string | null,
        shortCountLabel?: string | null,
      } | null,
      detailStatus: DetailStatus,
      studentWork?: string | null,
      skillContext?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachActivitiesByMisconceptionIdQueryVariables = {
  misconceptionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachActivitiesByMisconceptionIdQuery = {
  microCoachActivitiesByMisconceptionId?:  {
    __typename: "ModelMicroCoachActivityConnection",
    items:  Array< {
      __typename: "MicroCoachActivity",
      id: string,
      misconceptionId: string,
      sessionId: string,
      classId: string,
      activityType: ActivityType,
      title?: string | null,
      isSelected?: boolean | null,
      selectLabel?: string | null,
      detailStatus: DetailStatus,
      routine?: string | null,
      durationMinutes?: number | null,
      durationLabel?: string | null,
      grouping?:  {
        __typename: "Grouping",
        level: GroupingLevel,
        label: string,
      } | null,
      targets?: string | null,
      instructionalMove?: string | null,
      strategyTag?: string | null,
      phases?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachActivitiesBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachActivitiesBySessionIdQuery = {
  microCoachActivitiesBySessionId?:  {
    __typename: "ModelMicroCoachActivityConnection",
    items:  Array< {
      __typename: "MicroCoachActivity",
      id: string,
      misconceptionId: string,
      sessionId: string,
      classId: string,
      activityType: ActivityType,
      title?: string | null,
      isSelected?: boolean | null,
      selectLabel?: string | null,
      detailStatus: DetailStatus,
      routine?: string | null,
      durationMinutes?: number | null,
      durationLabel?: string | null,
      grouping?:  {
        __typename: "Grouping",
        level: GroupingLevel,
        label: string,
      } | null,
      targets?: string | null,
      instructionalMove?: string | null,
      strategyTag?: string | null,
      phases?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachActivitiesByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachActivitiesByClassIdQuery = {
  microCoachActivitiesByClassId?:  {
    __typename: "ModelMicroCoachActivityConnection",
    items:  Array< {
      __typename: "MicroCoachActivity",
      id: string,
      misconceptionId: string,
      sessionId: string,
      classId: string,
      activityType: ActivityType,
      title?: string | null,
      isSelected?: boolean | null,
      selectLabel?: string | null,
      detailStatus: DetailStatus,
      routine?: string | null,
      durationMinutes?: number | null,
      durationLabel?: string | null,
      grouping?:  {
        __typename: "Grouping",
        level: GroupingLevel,
        label: string,
      } | null,
      targets?: string | null,
      instructionalMove?: string | null,
      strategyTag?: string | null,
      phases?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachSavedPlansByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachSavedPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachSavedPlansByClassIdQuery = {
  microCoachSavedPlansByClassId?:  {
    __typename: "ModelMicroCoachSavedPlanConnection",
    items:  Array< {
      __typename: "MicroCoachSavedPlan",
      id: string,
      classId: string,
      sessionId?: string | null,
      items?:  Array< {
        __typename: "Item",
        id: string,
        status: PlanStatus,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type MicroCoachSavedPlansBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMicroCoachSavedPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MicroCoachSavedPlansBySessionIdQuery = {
  microCoachSavedPlansBySessionId?:  {
    __typename: "ModelMicroCoachSavedPlanConnection",
    items:  Array< {
      __typename: "MicroCoachSavedPlan",
      id: string,
      classId: string,
      sessionId?: string | null,
      items?:  Array< {
        __typename: "Item",
        id: string,
        status: PlanStatus,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetContextDataQueryVariables = {
  id: string,
};

export type GetContextDataQuery = {
  getContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListContextDataQueryVariables = {
  filter?: ModelContextDataFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListContextDataQuery = {
  listContextData?:  {
    __typename: "ModelContextDataConnection",
    items:  Array< {
      __typename: "ContextData",
      id: string,
      type: ContextDataType,
      title: string,
      gradeLevel?: number | null,
      weekNumber?: number | null,
      ccssStandards?: Array< string | null > | null,
      assessmentCode?: string | null,
      isReference?: boolean | null,
      nextStepLesson?:  {
        __typename: "NextStepLesson",
        targetAssessmentCode: string,
        targetQuestionNumbers?: Array< number | null > | null,
        topic: string,
        targetProblem: string,
        errorScenarios?:  Array< {
          __typename: "ErrorScenario",
          studentLabel: string,
          isCorrect: boolean,
          approach: string,
          reasoning?: Array< string | null > | null,
        } | null > | null,
        phases?:  Array< {
          __typename: "LessonPhase",
          phaseName: string,
          durationMinutes?: number | null,
          steps?: Array< string | null > | null,
          teacherPrompts?: Array< string | null > | null,
        } | null > | null,
        keyTakeaways?: Array< string | null > | null,
        independentProblems?: Array< string | null > | null,
        exitTicket?: string | null,
      } | null,
      exemplarQuestions?:  Array< {
        __typename: "ExemplarQuestion",
        questionNumber: number,
        questionText: string,
        ccssStandard: string,
        correctAnswer: string,
        pointValue: number,
        answerChoices?:  Array< {
          __typename: "AnswerChoice",
          label: string,
          text: string,
        } | null > | null,
        misconceptions?:  Array< {
          __typename: "ExemplarMisconception",
          description: string,
          targetAnswer?: string | null,
        } | null > | null,
        sourceNote?: string | null,
      } | null > | null,
      strategy?:  {
        __typename: "InstructionalStrategy",
        name: string,
        description: string,
        steps?: Array< string | null > | null,
        applicableGrades?: Array< number | null > | null,
        applicableStandards?: Array< string | null > | null,
        examples?: Array< string | null > | null,
      } | null,
      walkthroughData?:  {
        __typename: "WalkthroughData",
        quarter?: string | null,
        schools?:  Array< {
          __typename: "SchoolObservation",
          schoolCode: string,
          rubricScores?: string | null,
          notes?: string | null,
        } | null > | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateMicroCoachUserSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnCreateMicroCoachUserSubscription = {
  onCreateMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachUserSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnUpdateMicroCoachUserSubscription = {
  onUpdateMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachUserSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnDeleteMicroCoachUserSubscription = {
  onDeleteMicroCoachUser?:  {
    __typename: "MicroCoachUser",
    id: string,
    cognitoId: string,
    email: string,
    firstName?: string | null,
    lastName?: string | null,
    classes?:  {
      __typename: "ModelMicroCoachClassroomConnection",
      items:  Array< {
        __typename: "MicroCoachClassroom",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelMicroCoachSessionConnection",
          items:  Array< {
            __typename: "MicroCoachSession",
            id: string,
            classId: string,
            sessionLabel?: string | null,
            weekLabel?: string | null,
            weekNumber?: number | null,
            topic?: string | null,
            ccssStandards?: Array< string | null > | null,
            status?: SessionStatus | null,
            publishStatus?: PublishStatus | null,
            studentWorksAnalyzed?: number | null,
            studentsWithStrongUnderstanding?: number | null,
            studentsWithStrongUnderstandingIds?: Array< string | null > | null,
            studentIdsNeedingSupport?: Array< string | null > | null,
            ppqAssessmentId?: string | null,
            postPpqAssessmentId?: string | null,
            pregeneratedNextSteps?: string | null,
            evaluationResults?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        students?:  {
          __typename: "ModelMicroCoachStudentConnection",
          items:  Array< {
            __typename: "MicroCoachStudent",
            id: string,
            classId: string,
            name: string,
            externalId?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        name: string,
        grade?: number | null,
        state?: string | null,
        schoolYear?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    role: UserRole,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachClassroomSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachClassroomFilterInput | null,
};

export type OnCreateMicroCoachClassroomSubscription = {
  onCreateMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachClassroomSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachClassroomFilterInput | null,
};

export type OnUpdateMicroCoachClassroomSubscription = {
  onUpdateMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachClassroomSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachClassroomFilterInput | null,
};

export type OnDeleteMicroCoachClassroomSubscription = {
  onDeleteMicroCoachClassroom?:  {
    __typename: "MicroCoachClassroom",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelMicroCoachSessionConnection",
      items:  Array< {
        __typename: "MicroCoachSession",
        id: string,
        classId: string,
        sessionLabel?: string | null,
        weekLabel?: string | null,
        weekNumber?: number | null,
        topic?: string | null,
        ccssStandards?: Array< string | null > | null,
        status?: SessionStatus | null,
        publishStatus?: PublishStatus | null,
        studentWorksAnalyzed?: number | null,
        studentsWithStrongUnderstanding?: number | null,
        studentsWithStrongUnderstandingIds?: Array< string | null > | null,
        studentIdsNeedingSupport?: Array< string | null > | null,
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelMicroCoachAssessmentConnection",
          items:  Array< {
            __typename: "MicroCoachAssessment",
            id: string,
            classId: string,
            sessionId: string,
            assessmentCode: string,
            type: AssessmentType,
            weekNumber: number,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        misconceptions?:  {
          __typename: "ModelMicroCoachMisconceptionConnection",
          items:  Array< {
            __typename: "MicroCoachMisconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            title: string,
            titleCased?: string | null,
            shortLabel?: string | null,
            description: string,
            consequence?: string | null,
            detailStatus: DetailStatus,
            studentWork?: string | null,
            skillContext?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        pregeneratedNextSteps?: string | null,
        evaluationResults?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    students?:  {
      __typename: "ModelMicroCoachStudentConnection",
      items:  Array< {
        __typename: "MicroCoachStudent",
        id: string,
        classId: string,
        name: string,
        externalId?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    name: string,
    grade?: number | null,
    state?: string | null,
    schoolYear?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachStudentSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachStudentFilterInput | null,
};

export type OnCreateMicroCoachStudentSubscription = {
  onCreateMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachStudentSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachStudentFilterInput | null,
};

export type OnUpdateMicroCoachStudentSubscription = {
  onUpdateMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachStudentSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachStudentFilterInput | null,
};

export type OnDeleteMicroCoachStudentSubscription = {
  onDeleteMicroCoachStudent?:  {
    __typename: "MicroCoachStudent",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachSessionSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachSessionFilterInput | null,
};

export type OnCreateMicroCoachSessionSubscription = {
  onCreateMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachSessionSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachSessionFilterInput | null,
};

export type OnUpdateMicroCoachSessionSubscription = {
  onUpdateMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachSessionSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachSessionFilterInput | null,
};

export type OnDeleteMicroCoachSessionSubscription = {
  onDeleteMicroCoachSession?:  {
    __typename: "MicroCoachSession",
    id: string,
    classId: string,
    sessionLabel?: string | null,
    weekLabel?: string | null,
    weekNumber?: number | null,
    topic?: string | null,
    ccssStandards?: Array< string | null > | null,
    status?: SessionStatus | null,
    publishStatus?: PublishStatus | null,
    studentWorksAnalyzed?: number | null,
    studentsWithStrongUnderstanding?: number | null,
    studentsWithStrongUnderstandingIds?: Array< string | null > | null,
    studentIdsNeedingSupport?: Array< string | null > | null,
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelMicroCoachAssessmentConnection",
      items:  Array< {
        __typename: "MicroCoachAssessment",
        id: string,
        classId: string,
        sessionId: string,
        assessmentCode: string,
        type: AssessmentType,
        weekNumber: number,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    misconceptions?:  {
      __typename: "ModelMicroCoachMisconceptionConnection",
      items:  Array< {
        __typename: "MicroCoachMisconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelMicroCoachActivityConnection",
          items:  Array< {
            __typename: "MicroCoachActivity",
            id: string,
            misconceptionId: string,
            sessionId: string,
            classId: string,
            activityType: ActivityType,
            title?: string | null,
            isSelected?: boolean | null,
            selectLabel?: string | null,
            detailStatus: DetailStatus,
            routine?: string | null,
            durationMinutes?: number | null,
            durationLabel?: string | null,
            targets?: string | null,
            instructionalMove?: string | null,
            strategyTag?: string | null,
            phases?: string | null,
            createdAt: string,
            updatedAt: string,
          } | null >,
          nextToken?: string | null,
        } | null,
        rank: number,
        badge?: Badge | null,
        title: string,
        titleCased?: string | null,
        shortLabel?: string | null,
        description: string,
        consequence?: string | null,
        prevalence?:  {
          __typename: "Prevalence",
          level: PrevalenceLevel,
          label: string,
          studentsNeedingSupport?: number | null,
          studentsUnderstood?: number | null,
          studentsNoResponse?: number | null,
          totalAnalyzed: number,
          supportSummaryLabel?: string | null,
          understoodSummaryLabel?: string | null,
          shortCountLabel?: string | null,
        } | null,
        detailStatus: DetailStatus,
        studentWork?: string | null,
        skillContext?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    pregeneratedNextSteps?: string | null,
    evaluationResults?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachAssessmentSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachAssessmentFilterInput | null,
};

export type OnCreateMicroCoachAssessmentSubscription = {
  onCreateMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachAssessmentSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachAssessmentFilterInput | null,
};

export type OnUpdateMicroCoachAssessmentSubscription = {
  onUpdateMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachAssessmentSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachAssessmentFilterInput | null,
};

export type OnDeleteMicroCoachAssessmentSubscription = {
  onDeleteMicroCoachAssessment?:  {
    __typename: "MicroCoachAssessment",
    id: string,
    classId: string,
    sessionId: string,
    assessmentCode: string,
    type: AssessmentType,
    weekNumber: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachMisconceptionSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachMisconceptionFilterInput | null,
};

export type OnCreateMicroCoachMisconceptionSubscription = {
  onCreateMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachMisconceptionSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachMisconceptionFilterInput | null,
};

export type OnUpdateMicroCoachMisconceptionSubscription = {
  onUpdateMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachMisconceptionSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachMisconceptionFilterInput | null,
};

export type OnDeleteMicroCoachMisconceptionSubscription = {
  onDeleteMicroCoachMisconception?:  {
    __typename: "MicroCoachMisconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelMicroCoachActivityConnection",
      items:  Array< {
        __typename: "MicroCoachActivity",
        id: string,
        misconceptionId: string,
        sessionId: string,
        classId: string,
        activityType: ActivityType,
        title?: string | null,
        isSelected?: boolean | null,
        selectLabel?: string | null,
        detailStatus: DetailStatus,
        routine?: string | null,
        durationMinutes?: number | null,
        durationLabel?: string | null,
        grouping?:  {
          __typename: "Grouping",
          level: GroupingLevel,
          label: string,
        } | null,
        targets?: string | null,
        instructionalMove?: string | null,
        strategyTag?: string | null,
        phases?: string | null,
        createdAt: string,
        updatedAt: string,
      } | null >,
      nextToken?: string | null,
    } | null,
    rank: number,
    badge?: Badge | null,
    title: string,
    titleCased?: string | null,
    shortLabel?: string | null,
    description: string,
    consequence?: string | null,
    prevalence?:  {
      __typename: "Prevalence",
      level: PrevalenceLevel,
      label: string,
      studentsNeedingSupport?: number | null,
      studentsUnderstood?: number | null,
      studentsNoResponse?: number | null,
      totalAnalyzed: number,
      supportSummaryLabel?: string | null,
      understoodSummaryLabel?: string | null,
      shortCountLabel?: string | null,
    } | null,
    detailStatus: DetailStatus,
    studentWork?: string | null,
    skillContext?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachActivitySubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachActivityFilterInput | null,
};

export type OnCreateMicroCoachActivitySubscription = {
  onCreateMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachActivitySubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachActivityFilterInput | null,
};

export type OnUpdateMicroCoachActivitySubscription = {
  onUpdateMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachActivitySubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachActivityFilterInput | null,
};

export type OnDeleteMicroCoachActivitySubscription = {
  onDeleteMicroCoachActivity?:  {
    __typename: "MicroCoachActivity",
    id: string,
    misconceptionId: string,
    sessionId: string,
    classId: string,
    activityType: ActivityType,
    title?: string | null,
    isSelected?: boolean | null,
    selectLabel?: string | null,
    detailStatus: DetailStatus,
    routine?: string | null,
    durationMinutes?: number | null,
    durationLabel?: string | null,
    grouping?:  {
      __typename: "Grouping",
      level: GroupingLevel,
      label: string,
    } | null,
    targets?: string | null,
    instructionalMove?: string | null,
    strategyTag?: string | null,
    phases?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateMicroCoachSavedPlanSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachSavedPlanFilterInput | null,
};

export type OnCreateMicroCoachSavedPlanSubscription = {
  onCreateMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateMicroCoachSavedPlanSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachSavedPlanFilterInput | null,
};

export type OnUpdateMicroCoachSavedPlanSubscription = {
  onUpdateMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteMicroCoachSavedPlanSubscriptionVariables = {
  filter?: ModelSubscriptionMicroCoachSavedPlanFilterInput | null,
};

export type OnDeleteMicroCoachSavedPlanSubscription = {
  onDeleteMicroCoachSavedPlan?:  {
    __typename: "MicroCoachSavedPlan",
    id: string,
    classId: string,
    sessionId?: string | null,
    items?:  Array< {
      __typename: "Item",
      id: string,
      status: PlanStatus,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateContextDataSubscriptionVariables = {
  filter?: ModelSubscriptionContextDataFilterInput | null,
};

export type OnCreateContextDataSubscription = {
  onCreateContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateContextDataSubscriptionVariables = {
  filter?: ModelSubscriptionContextDataFilterInput | null,
};

export type OnUpdateContextDataSubscription = {
  onUpdateContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteContextDataSubscriptionVariables = {
  filter?: ModelSubscriptionContextDataFilterInput | null,
};

export type OnDeleteContextDataSubscription = {
  onDeleteContextData?:  {
    __typename: "ContextData",
    id: string,
    type: ContextDataType,
    title: string,
    gradeLevel?: number | null,
    weekNumber?: number | null,
    ccssStandards?: Array< string | null > | null,
    assessmentCode?: string | null,
    isReference?: boolean | null,
    nextStepLesson?:  {
      __typename: "NextStepLesson",
      targetAssessmentCode: string,
      targetQuestionNumbers?: Array< number | null > | null,
      topic: string,
      targetProblem: string,
      errorScenarios?:  Array< {
        __typename: "ErrorScenario",
        studentLabel: string,
        isCorrect: boolean,
        approach: string,
        reasoning?: Array< string | null > | null,
      } | null > | null,
      phases?:  Array< {
        __typename: "LessonPhase",
        phaseName: string,
        durationMinutes?: number | null,
        steps?: Array< string | null > | null,
        teacherPrompts?: Array< string | null > | null,
      } | null > | null,
      keyTakeaways?: Array< string | null > | null,
      independentProblems?: Array< string | null > | null,
      exitTicket?: string | null,
    } | null,
    exemplarQuestions?:  Array< {
      __typename: "ExemplarQuestion",
      questionNumber: number,
      questionText: string,
      ccssStandard: string,
      correctAnswer: string,
      pointValue: number,
      answerChoices?:  Array< {
        __typename: "AnswerChoice",
        label: string,
        text: string,
      } | null > | null,
      misconceptions?:  Array< {
        __typename: "ExemplarMisconception",
        description: string,
        targetAnswer?: string | null,
      } | null > | null,
      sourceNote?: string | null,
    } | null > | null,
    strategy?:  {
      __typename: "InstructionalStrategy",
      name: string,
      description: string,
      steps?: Array< string | null > | null,
      applicableGrades?: Array< number | null > | null,
      applicableStandards?: Array< string | null > | null,
      examples?: Array< string | null > | null,
    } | null,
    walkthroughData?:  {
      __typename: "WalkthroughData",
      quarter?: string | null,
      schools?:  Array< {
        __typename: "SchoolObservation",
        schoolCode: string,
        rubricScores?: string | null,
        notes?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
