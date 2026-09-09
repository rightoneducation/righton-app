/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  cognitoId: string,
  email: string,
  name?: string | null,
  role: UserRole,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}


export type ModelUserConditionInput = {
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
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

export type User = {
  __typename: "User",
  id: string,
  cognitoId: string,
  email: string,
  name?: string | null,
  classes?: ModelClassConnection | null,
  role: UserRole,
  createdAt: string,
  updatedAt: string,
};

export type ModelClassConnection = {
  __typename: "ModelClassConnection",
  items:  Array<Class | null >,
  nextToken?: string | null,
};

export type Class = {
  __typename: "Class",
  id: string,
  userId: string,
  sessions?: ModelSessionConnection | null,
  students?: ModelStudentConnection | null,
  name: string,
  grade?: number | null,
  state?: string | null,
  schoolYear?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelSessionConnection = {
  __typename: "ModelSessionConnection",
  items:  Array<Session | null >,
  nextToken?: string | null,
};

export type Session = {
  __typename: "Session",
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
  ppqAssessmentId?: string | null,
  postPpqAssessmentId?: string | null,
  assessments?: ModelAssessmentConnection | null,
  misconceptions?: ModelMisconceptionConnection | null,
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


export type ModelAssessmentConnection = {
  __typename: "ModelAssessmentConnection",
  items:  Array<Assessment | null >,
  nextToken?: string | null,
};

export type Assessment = {
  __typename: "Assessment",
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
  QUIZ = "QUIZ",
}


export type ModelMisconceptionConnection = {
  __typename: "ModelMisconceptionConnection",
  items:  Array<Misconception | null >,
  nextToken?: string | null,
};

export type Misconception = {
  __typename: "Misconception",
  id: string,
  sessionId: string,
  classId: string,
  activities?: ModelActivityConnection | null,
  rank: number,
  badge?: Badge | null,
  isRecommendedFocus: boolean,
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

export type ModelActivityConnection = {
  __typename: "ModelActivityConnection",
  items:  Array<Activity | null >,
  nextToken?: string | null,
};

export type Activity = {
  __typename: "Activity",
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


export type ModelStudentConnection = {
  __typename: "ModelStudentConnection",
  items:  Array<Student | null >,
  nextToken?: string | null,
};

export type Student = {
  __typename: "Student",
  id: string,
  classId: string,
  name: string,
  externalId?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserInput = {
  id: string,
  cognitoId?: string | null,
  email?: string | null,
  name?: string | null,
  role?: UserRole | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteUserInput = {
  id: string,
};

export type CreateClassInput = {
  id?: string | null,
  userId: string,
  name: string,
  grade?: number | null,
  state?: string | null,
  schoolYear?: string | null,
};

export type ModelClassConditionInput = {
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  grade?: ModelIntInput | null,
  state?: ModelStringInput | null,
  schoolYear?: ModelStringInput | null,
  and?: Array< ModelClassConditionInput | null > | null,
  or?: Array< ModelClassConditionInput | null > | null,
  not?: ModelClassConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
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

export type UpdateClassInput = {
  id: string,
  userId?: string | null,
  name?: string | null,
  grade?: number | null,
  state?: string | null,
  schoolYear?: string | null,
};

export type DeleteClassInput = {
  id: string,
};

export type CreateStudentInput = {
  id?: string | null,
  classId: string,
  name: string,
  externalId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelStudentConditionInput = {
  classId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  externalId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelStudentConditionInput | null > | null,
  or?: Array< ModelStudentConditionInput | null > | null,
  not?: ModelStudentConditionInput | null,
};

export type UpdateStudentInput = {
  id: string,
  classId?: string | null,
  name?: string | null,
  externalId?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteStudentInput = {
  id: string,
};

export type CreateSessionInput = {
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
  ppqAssessmentId?: string | null,
  postPpqAssessmentId?: string | null,
  pregeneratedNextSteps?: string | null,
  evaluationResults?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type ModelSessionConditionInput = {
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
  ppqAssessmentId?: ModelIDInput | null,
  postPpqAssessmentId?: ModelIDInput | null,
  pregeneratedNextSteps?: ModelStringInput | null,
  evaluationResults?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSessionConditionInput | null > | null,
  or?: Array< ModelSessionConditionInput | null > | null,
  not?: ModelSessionConditionInput | null,
};

export type ModelSessionStatusInput = {
  eq?: SessionStatus | null,
  ne?: SessionStatus | null,
};

export type ModelPublishStatusInput = {
  eq?: PublishStatus | null,
  ne?: PublishStatus | null,
};

export type UpdateSessionInput = {
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
  ppqAssessmentId?: string | null,
  postPpqAssessmentId?: string | null,
  pregeneratedNextSteps?: string | null,
  evaluationResults?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteSessionInput = {
  id: string,
};

export type CreateAssessmentInput = {
  id?: string | null,
  classId: string,
  sessionId: string,
  assessmentCode: string,
  type: AssessmentType,
  weekNumber: number,
};

export type ModelAssessmentConditionInput = {
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  assessmentCode?: ModelStringInput | null,
  type?: ModelAssessmentTypeInput | null,
  weekNumber?: ModelIntInput | null,
  and?: Array< ModelAssessmentConditionInput | null > | null,
  or?: Array< ModelAssessmentConditionInput | null > | null,
  not?: ModelAssessmentConditionInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelAssessmentTypeInput = {
  eq?: AssessmentType | null,
  ne?: AssessmentType | null,
};

export type UpdateAssessmentInput = {
  id: string,
  classId?: string | null,
  sessionId?: string | null,
  assessmentCode?: string | null,
  type?: AssessmentType | null,
  weekNumber?: number | null,
};

export type DeleteAssessmentInput = {
  id: string,
};

export type CreateMisconceptionInput = {
  id?: string | null,
  sessionId: string,
  classId: string,
  rank: number,
  badge?: Badge | null,
  isRecommendedFocus: boolean,
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

export type ModelMisconceptionConditionInput = {
  sessionId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  rank?: ModelIntInput | null,
  badge?: ModelBadgeInput | null,
  isRecommendedFocus?: ModelBooleanInput | null,
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
  and?: Array< ModelMisconceptionConditionInput | null > | null,
  or?: Array< ModelMisconceptionConditionInput | null > | null,
  not?: ModelMisconceptionConditionInput | null,
};

export type ModelBadgeInput = {
  eq?: Badge | null,
  ne?: Badge | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelDetailStatusInput = {
  eq?: DetailStatus | null,
  ne?: DetailStatus | null,
};

export type UpdateMisconceptionInput = {
  id: string,
  sessionId?: string | null,
  classId?: string | null,
  rank?: number | null,
  badge?: Badge | null,
  isRecommendedFocus?: boolean | null,
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

export type DeleteMisconceptionInput = {
  id: string,
};

export type CreateActivityInput = {
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

export type ModelActivityConditionInput = {
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
  and?: Array< ModelActivityConditionInput | null > | null,
  or?: Array< ModelActivityConditionInput | null > | null,
  not?: ModelActivityConditionInput | null,
};

export type ModelActivityTypeInput = {
  eq?: ActivityType | null,
  ne?: ActivityType | null,
};

export type UpdateActivityInput = {
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

export type DeleteActivityInput = {
  id: string,
};

export type CreateSavedPlanInput = {
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


export type ModelSavedPlanConditionInput = {
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSavedPlanConditionInput | null > | null,
  or?: Array< ModelSavedPlanConditionInput | null > | null,
  not?: ModelSavedPlanConditionInput | null,
};

export type SavedPlan = {
  __typename: "SavedPlan",
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

export type UpdateSavedPlanInput = {
  id: string,
  classId?: string | null,
  sessionId?: string | null,
  items?: Array< ItemInput | null > | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteSavedPlanInput = {
  id: string,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  cognitoId?: ModelStringInput | null,
  email?: ModelStringInput | null,
  name?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelClassFilterInput = {
  id?: ModelIDInput | null,
  userId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  grade?: ModelIntInput | null,
  state?: ModelStringInput | null,
  schoolYear?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelClassFilterInput | null > | null,
  or?: Array< ModelClassFilterInput | null > | null,
  not?: ModelClassFilterInput | null,
};

export type ModelStudentFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  externalId?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelStudentFilterInput | null > | null,
  or?: Array< ModelStudentFilterInput | null > | null,
  not?: ModelStudentFilterInput | null,
};

export type ModelSessionFilterInput = {
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
  ppqAssessmentId?: ModelIDInput | null,
  postPpqAssessmentId?: ModelIDInput | null,
  pregeneratedNextSteps?: ModelStringInput | null,
  evaluationResults?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSessionFilterInput | null > | null,
  or?: Array< ModelSessionFilterInput | null > | null,
  not?: ModelSessionFilterInput | null,
};

export type ModelAssessmentFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  assessmentCode?: ModelStringInput | null,
  type?: ModelAssessmentTypeInput | null,
  weekNumber?: ModelIntInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelAssessmentFilterInput | null > | null,
  or?: Array< ModelAssessmentFilterInput | null > | null,
  not?: ModelAssessmentFilterInput | null,
};

export type ModelMisconceptionFilterInput = {
  id?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  rank?: ModelIntInput | null,
  badge?: ModelBadgeInput | null,
  isRecommendedFocus?: ModelBooleanInput | null,
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
  and?: Array< ModelMisconceptionFilterInput | null > | null,
  or?: Array< ModelMisconceptionFilterInput | null > | null,
  not?: ModelMisconceptionFilterInput | null,
};

export type ModelActivityFilterInput = {
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
  and?: Array< ModelActivityFilterInput | null > | null,
  or?: Array< ModelActivityFilterInput | null > | null,
  not?: ModelActivityFilterInput | null,
};

export type ModelSavedPlanFilterInput = {
  id?: ModelIDInput | null,
  classId?: ModelIDInput | null,
  sessionId?: ModelIDInput | null,
  createdAt?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  and?: Array< ModelSavedPlanFilterInput | null > | null,
  or?: Array< ModelSavedPlanFilterInput | null > | null,
  not?: ModelSavedPlanFilterInput | null,
};

export type ModelSavedPlanConnection = {
  __typename: "ModelSavedPlanConnection",
  items:  Array<SavedPlan | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelSubscriptionUserFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  email?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  cognitoId?: ModelStringInput | null,
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

export type ModelSubscriptionClassFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  userId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  grade?: ModelSubscriptionIntInput | null,
  state?: ModelSubscriptionStringInput | null,
  schoolYear?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionClassFilterInput | null > | null,
  or?: Array< ModelSubscriptionClassFilterInput | null > | null,
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

export type ModelSubscriptionStudentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  externalId?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionStudentFilterInput | null > | null,
  or?: Array< ModelSubscriptionStudentFilterInput | null > | null,
};

export type ModelSubscriptionSessionFilterInput = {
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
  ppqAssessmentId?: ModelSubscriptionIDInput | null,
  postPpqAssessmentId?: ModelSubscriptionIDInput | null,
  pregeneratedNextSteps?: ModelSubscriptionStringInput | null,
  evaluationResults?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSessionFilterInput | null > | null,
  or?: Array< ModelSubscriptionSessionFilterInput | null > | null,
};

export type ModelSubscriptionAssessmentFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  assessmentCode?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  weekNumber?: ModelSubscriptionIntInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionAssessmentFilterInput | null > | null,
  or?: Array< ModelSubscriptionAssessmentFilterInput | null > | null,
};

export type ModelSubscriptionMisconceptionFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  rank?: ModelSubscriptionIntInput | null,
  badge?: ModelSubscriptionStringInput | null,
  isRecommendedFocus?: ModelSubscriptionBooleanInput | null,
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
  and?: Array< ModelSubscriptionMisconceptionFilterInput | null > | null,
  or?: Array< ModelSubscriptionMisconceptionFilterInput | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
};

export type ModelSubscriptionActivityFilterInput = {
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
  and?: Array< ModelSubscriptionActivityFilterInput | null > | null,
  or?: Array< ModelSubscriptionActivityFilterInput | null > | null,
};

export type ModelSubscriptionSavedPlanFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  classId?: ModelSubscriptionIDInput | null,
  sessionId?: ModelSubscriptionIDInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionSavedPlanFilterInput | null > | null,
  or?: Array< ModelSubscriptionSavedPlanFilterInput | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type CreateClassMutationVariables = {
  input: CreateClassInput,
  condition?: ModelClassConditionInput | null,
};

export type CreateClassMutation = {
  createClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type UpdateClassMutationVariables = {
  input: UpdateClassInput,
  condition?: ModelClassConditionInput | null,
};

export type UpdateClassMutation = {
  updateClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type DeleteClassMutationVariables = {
  input: DeleteClassInput,
  condition?: ModelClassConditionInput | null,
};

export type DeleteClassMutation = {
  deleteClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type CreateStudentMutationVariables = {
  input: CreateStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type CreateStudentMutation = {
  createStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStudentMutationVariables = {
  input: UpdateStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type UpdateStudentMutation = {
  updateStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStudentMutationVariables = {
  input: DeleteStudentInput,
  condition?: ModelStudentConditionInput | null,
};

export type DeleteStudentMutation = {
  deleteStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateSessionMutationVariables = {
  input: CreateSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type CreateSessionMutation = {
  createSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type UpdateSessionMutationVariables = {
  input: UpdateSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type UpdateSessionMutation = {
  updateSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type DeleteSessionMutationVariables = {
  input: DeleteSessionInput,
  condition?: ModelSessionConditionInput | null,
};

export type DeleteSessionMutation = {
  deleteSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type CreateAssessmentMutationVariables = {
  input: CreateAssessmentInput,
  condition?: ModelAssessmentConditionInput | null,
};

export type CreateAssessmentMutation = {
  createAssessment?:  {
    __typename: "Assessment",
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

export type UpdateAssessmentMutationVariables = {
  input: UpdateAssessmentInput,
  condition?: ModelAssessmentConditionInput | null,
};

export type UpdateAssessmentMutation = {
  updateAssessment?:  {
    __typename: "Assessment",
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

export type DeleteAssessmentMutationVariables = {
  input: DeleteAssessmentInput,
  condition?: ModelAssessmentConditionInput | null,
};

export type DeleteAssessmentMutation = {
  deleteAssessment?:  {
    __typename: "Assessment",
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

export type CreateMisconceptionMutationVariables = {
  input: CreateMisconceptionInput,
  condition?: ModelMisconceptionConditionInput | null,
};

export type CreateMisconceptionMutation = {
  createMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type UpdateMisconceptionMutationVariables = {
  input: UpdateMisconceptionInput,
  condition?: ModelMisconceptionConditionInput | null,
};

export type UpdateMisconceptionMutation = {
  updateMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type DeleteMisconceptionMutationVariables = {
  input: DeleteMisconceptionInput,
  condition?: ModelMisconceptionConditionInput | null,
};

export type DeleteMisconceptionMutation = {
  deleteMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type CreateActivityMutationVariables = {
  input: CreateActivityInput,
  condition?: ModelActivityConditionInput | null,
};

export type CreateActivityMutation = {
  createActivity?:  {
    __typename: "Activity",
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

export type UpdateActivityMutationVariables = {
  input: UpdateActivityInput,
  condition?: ModelActivityConditionInput | null,
};

export type UpdateActivityMutation = {
  updateActivity?:  {
    __typename: "Activity",
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

export type DeleteActivityMutationVariables = {
  input: DeleteActivityInput,
  condition?: ModelActivityConditionInput | null,
};

export type DeleteActivityMutation = {
  deleteActivity?:  {
    __typename: "Activity",
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

export type CreateSavedPlanMutationVariables = {
  input: CreateSavedPlanInput,
  condition?: ModelSavedPlanConditionInput | null,
};

export type CreateSavedPlanMutation = {
  createSavedPlan?:  {
    __typename: "SavedPlan",
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

export type UpdateSavedPlanMutationVariables = {
  input: UpdateSavedPlanInput,
  condition?: ModelSavedPlanConditionInput | null,
};

export type UpdateSavedPlanMutation = {
  updateSavedPlan?:  {
    __typename: "SavedPlan",
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

export type DeleteSavedPlanMutationVariables = {
  input: DeleteSavedPlanInput,
  condition?: ModelSavedPlanConditionInput | null,
};

export type DeleteSavedPlanMutation = {
  deleteSavedPlan?:  {
    __typename: "SavedPlan",
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

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      name?: string | null,
      classes?:  {
        __typename: "ModelClassConnection",
        items:  Array< {
          __typename: "Class",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelStudentConnection",
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

export type GetClassQueryVariables = {
  id: string,
};

export type GetClassQuery = {
  getClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type ListClassesQueryVariables = {
  filter?: ModelClassFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListClassesQuery = {
  listClasses?:  {
    __typename: "ModelClassConnection",
    items:  Array< {
      __typename: "Class",
      id: string,
      userId: string,
      sessions?:  {
        __typename: "ModelSessionConnection",
        items:  Array< {
          __typename: "Session",
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
          ppqAssessmentId?: string | null,
          postPpqAssessmentId?: string | null,
          assessments?:  {
            __typename: "ModelAssessmentConnection",
            nextToken?: string | null,
          } | null,
          misconceptions?:  {
            __typename: "ModelMisconceptionConnection",
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
        __typename: "ModelStudentConnection",
        items:  Array< {
          __typename: "Student",
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

export type GetStudentQueryVariables = {
  id: string,
};

export type GetStudentQuery = {
  getStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListStudentsQueryVariables = {
  filter?: ModelStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStudentsQuery = {
  listStudents?:  {
    __typename: "ModelStudentConnection",
    items:  Array< {
      __typename: "Student",
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

export type GetSessionQueryVariables = {
  id: string,
};

export type GetSessionQuery = {
  getSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type ListSessionsQueryVariables = {
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSessionsQuery = {
  listSessions?:  {
    __typename: "ModelSessionConnection",
    items:  Array< {
      __typename: "Session",
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
      ppqAssessmentId?: string | null,
      postPpqAssessmentId?: string | null,
      assessments?:  {
        __typename: "ModelAssessmentConnection",
        items:  Array< {
          __typename: "Assessment",
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
        __typename: "ModelMisconceptionConnection",
        items:  Array< {
          __typename: "Misconception",
          id: string,
          sessionId: string,
          classId: string,
          activities?:  {
            __typename: "ModelActivityConnection",
            nextToken?: string | null,
          } | null,
          rank: number,
          badge?: Badge | null,
          isRecommendedFocus: boolean,
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

export type GetAssessmentQueryVariables = {
  id: string,
};

export type GetAssessmentQuery = {
  getAssessment?:  {
    __typename: "Assessment",
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

export type ListAssessmentsQueryVariables = {
  filter?: ModelAssessmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAssessmentsQuery = {
  listAssessments?:  {
    __typename: "ModelAssessmentConnection",
    items:  Array< {
      __typename: "Assessment",
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

export type GetMisconceptionQueryVariables = {
  id: string,
};

export type GetMisconceptionQuery = {
  getMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type ListMisconceptionsQueryVariables = {
  filter?: ModelMisconceptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListMisconceptionsQuery = {
  listMisconceptions?:  {
    __typename: "ModelMisconceptionConnection",
    items:  Array< {
      __typename: "Misconception",
      id: string,
      sessionId: string,
      classId: string,
      activities?:  {
        __typename: "ModelActivityConnection",
        items:  Array< {
          __typename: "Activity",
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
      isRecommendedFocus: boolean,
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

export type GetActivityQueryVariables = {
  id: string,
};

export type GetActivityQuery = {
  getActivity?:  {
    __typename: "Activity",
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

export type ListActivitiesQueryVariables = {
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActivitiesQuery = {
  listActivities?:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
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

export type GetSavedPlanQueryVariables = {
  id: string,
};

export type GetSavedPlanQuery = {
  getSavedPlan?:  {
    __typename: "SavedPlan",
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

export type ListSavedPlansQueryVariables = {
  filter?: ModelSavedPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListSavedPlansQuery = {
  listSavedPlans?:  {
    __typename: "ModelSavedPlanConnection",
    items:  Array< {
      __typename: "SavedPlan",
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
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByCognitoIdQuery = {
  usersByCognitoId?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      name?: string | null,
      classes?:  {
        __typename: "ModelClassConnection",
        items:  Array< {
          __typename: "Class",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelStudentConnection",
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
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByEmailQuery = {
  usersByEmail?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      name?: string | null,
      classes?:  {
        __typename: "ModelClassConnection",
        items:  Array< {
          __typename: "Class",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelStudentConnection",
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
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UsersByRoleQuery = {
  usersByRole?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      cognitoId: string,
      email: string,
      name?: string | null,
      classes?:  {
        __typename: "ModelClassConnection",
        items:  Array< {
          __typename: "Class",
          id: string,
          userId: string,
          sessions?:  {
            __typename: "ModelSessionConnection",
            nextToken?: string | null,
          } | null,
          students?:  {
            __typename: "ModelStudentConnection",
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

export type ClassesByUserIdQueryVariables = {
  userId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelClassFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ClassesByUserIdQuery = {
  classesByUserId?:  {
    __typename: "ModelClassConnection",
    items:  Array< {
      __typename: "Class",
      id: string,
      userId: string,
      sessions?:  {
        __typename: "ModelSessionConnection",
        items:  Array< {
          __typename: "Session",
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
          ppqAssessmentId?: string | null,
          postPpqAssessmentId?: string | null,
          assessments?:  {
            __typename: "ModelAssessmentConnection",
            nextToken?: string | null,
          } | null,
          misconceptions?:  {
            __typename: "ModelMisconceptionConnection",
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
        __typename: "ModelStudentConnection",
        items:  Array< {
          __typename: "Student",
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

export type StudentsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelStudentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type StudentsByClassIdQuery = {
  studentsByClassId?:  {
    __typename: "ModelStudentConnection",
    items:  Array< {
      __typename: "Student",
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

export type SessionsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSessionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SessionsByClassIdQuery = {
  sessionsByClassId?:  {
    __typename: "ModelSessionConnection",
    items:  Array< {
      __typename: "Session",
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
      ppqAssessmentId?: string | null,
      postPpqAssessmentId?: string | null,
      assessments?:  {
        __typename: "ModelAssessmentConnection",
        items:  Array< {
          __typename: "Assessment",
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
        __typename: "ModelMisconceptionConnection",
        items:  Array< {
          __typename: "Misconception",
          id: string,
          sessionId: string,
          classId: string,
          activities?:  {
            __typename: "ModelActivityConnection",
            nextToken?: string | null,
          } | null,
          rank: number,
          badge?: Badge | null,
          isRecommendedFocus: boolean,
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

export type AssessmentsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAssessmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AssessmentsByClassIdQuery = {
  assessmentsByClassId?:  {
    __typename: "ModelAssessmentConnection",
    items:  Array< {
      __typename: "Assessment",
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

export type AssessmentsBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelAssessmentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type AssessmentsBySessionIdQuery = {
  assessmentsBySessionId?:  {
    __typename: "ModelAssessmentConnection",
    items:  Array< {
      __typename: "Assessment",
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

export type MisconceptionsBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMisconceptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MisconceptionsBySessionIdQuery = {
  misconceptionsBySessionId?:  {
    __typename: "ModelMisconceptionConnection",
    items:  Array< {
      __typename: "Misconception",
      id: string,
      sessionId: string,
      classId: string,
      activities?:  {
        __typename: "ModelActivityConnection",
        items:  Array< {
          __typename: "Activity",
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
      isRecommendedFocus: boolean,
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

export type MisconceptionsByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelMisconceptionFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type MisconceptionsByClassIdQuery = {
  misconceptionsByClassId?:  {
    __typename: "ModelMisconceptionConnection",
    items:  Array< {
      __typename: "Misconception",
      id: string,
      sessionId: string,
      classId: string,
      activities?:  {
        __typename: "ModelActivityConnection",
        items:  Array< {
          __typename: "Activity",
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
      isRecommendedFocus: boolean,
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

export type ActivitiesByMisconceptionIdQueryVariables = {
  misconceptionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActivitiesByMisconceptionIdQuery = {
  activitiesByMisconceptionId?:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
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

export type ActivitiesBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActivitiesBySessionIdQuery = {
  activitiesBySessionId?:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
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

export type ActivitiesByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelActivityFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ActivitiesByClassIdQuery = {
  activitiesByClassId?:  {
    __typename: "ModelActivityConnection",
    items:  Array< {
      __typename: "Activity",
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

export type SavedPlansByClassIdQueryVariables = {
  classId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSavedPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SavedPlansByClassIdQuery = {
  savedPlansByClassId?:  {
    __typename: "ModelSavedPlanConnection",
    items:  Array< {
      __typename: "SavedPlan",
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

export type SavedPlansBySessionIdQueryVariables = {
  sessionId: string,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelSavedPlanFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type SavedPlansBySessionIdQuery = {
  savedPlansBySessionId?:  {
    __typename: "ModelSavedPlanConnection",
    items:  Array< {
      __typename: "SavedPlan",
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

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
  cognitoId?: string | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    cognitoId: string,
    email: string,
    name?: string | null,
    classes?:  {
      __typename: "ModelClassConnection",
      items:  Array< {
        __typename: "Class",
        id: string,
        userId: string,
        sessions?:  {
          __typename: "ModelSessionConnection",
          items:  Array< {
            __typename: "Session",
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
          __typename: "ModelStudentConnection",
          items:  Array< {
            __typename: "Student",
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

export type OnCreateClassSubscriptionVariables = {
  filter?: ModelSubscriptionClassFilterInput | null,
};

export type OnCreateClassSubscription = {
  onCreateClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type OnUpdateClassSubscriptionVariables = {
  filter?: ModelSubscriptionClassFilterInput | null,
};

export type OnUpdateClassSubscription = {
  onUpdateClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type OnDeleteClassSubscriptionVariables = {
  filter?: ModelSubscriptionClassFilterInput | null,
};

export type OnDeleteClassSubscription = {
  onDeleteClass?:  {
    __typename: "Class",
    id: string,
    userId: string,
    sessions?:  {
      __typename: "ModelSessionConnection",
      items:  Array< {
        __typename: "Session",
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
        ppqAssessmentId?: string | null,
        postPpqAssessmentId?: string | null,
        assessments?:  {
          __typename: "ModelAssessmentConnection",
          items:  Array< {
            __typename: "Assessment",
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
          __typename: "ModelMisconceptionConnection",
          items:  Array< {
            __typename: "Misconception",
            id: string,
            sessionId: string,
            classId: string,
            rank: number,
            badge?: Badge | null,
            isRecommendedFocus: boolean,
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
      __typename: "ModelStudentConnection",
      items:  Array< {
        __typename: "Student",
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

export type OnCreateStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnCreateStudentSubscription = {
  onCreateStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnUpdateStudentSubscription = {
  onUpdateStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteStudentSubscriptionVariables = {
  filter?: ModelSubscriptionStudentFilterInput | null,
};

export type OnDeleteStudentSubscription = {
  onDeleteStudent?:  {
    __typename: "Student",
    id: string,
    classId: string,
    name: string,
    externalId?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnCreateSessionSubscription = {
  onCreateSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type OnUpdateSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnUpdateSessionSubscription = {
  onUpdateSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type OnDeleteSessionSubscriptionVariables = {
  filter?: ModelSubscriptionSessionFilterInput | null,
};

export type OnDeleteSessionSubscription = {
  onDeleteSession?:  {
    __typename: "Session",
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
    ppqAssessmentId?: string | null,
    postPpqAssessmentId?: string | null,
    assessments?:  {
      __typename: "ModelAssessmentConnection",
      items:  Array< {
        __typename: "Assessment",
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
      __typename: "ModelMisconceptionConnection",
      items:  Array< {
        __typename: "Misconception",
        id: string,
        sessionId: string,
        classId: string,
        activities?:  {
          __typename: "ModelActivityConnection",
          items:  Array< {
            __typename: "Activity",
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
        isRecommendedFocus: boolean,
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

export type OnCreateAssessmentSubscriptionVariables = {
  filter?: ModelSubscriptionAssessmentFilterInput | null,
};

export type OnCreateAssessmentSubscription = {
  onCreateAssessment?:  {
    __typename: "Assessment",
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

export type OnUpdateAssessmentSubscriptionVariables = {
  filter?: ModelSubscriptionAssessmentFilterInput | null,
};

export type OnUpdateAssessmentSubscription = {
  onUpdateAssessment?:  {
    __typename: "Assessment",
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

export type OnDeleteAssessmentSubscriptionVariables = {
  filter?: ModelSubscriptionAssessmentFilterInput | null,
};

export type OnDeleteAssessmentSubscription = {
  onDeleteAssessment?:  {
    __typename: "Assessment",
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

export type OnCreateMisconceptionSubscriptionVariables = {
  filter?: ModelSubscriptionMisconceptionFilterInput | null,
};

export type OnCreateMisconceptionSubscription = {
  onCreateMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type OnUpdateMisconceptionSubscriptionVariables = {
  filter?: ModelSubscriptionMisconceptionFilterInput | null,
};

export type OnUpdateMisconceptionSubscription = {
  onUpdateMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type OnDeleteMisconceptionSubscriptionVariables = {
  filter?: ModelSubscriptionMisconceptionFilterInput | null,
};

export type OnDeleteMisconceptionSubscription = {
  onDeleteMisconception?:  {
    __typename: "Misconception",
    id: string,
    sessionId: string,
    classId: string,
    activities?:  {
      __typename: "ModelActivityConnection",
      items:  Array< {
        __typename: "Activity",
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
    isRecommendedFocus: boolean,
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

export type OnCreateActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
};

export type OnCreateActivitySubscription = {
  onCreateActivity?:  {
    __typename: "Activity",
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

export type OnUpdateActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
};

export type OnUpdateActivitySubscription = {
  onUpdateActivity?:  {
    __typename: "Activity",
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

export type OnDeleteActivitySubscriptionVariables = {
  filter?: ModelSubscriptionActivityFilterInput | null,
};

export type OnDeleteActivitySubscription = {
  onDeleteActivity?:  {
    __typename: "Activity",
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

export type OnCreateSavedPlanSubscriptionVariables = {
  filter?: ModelSubscriptionSavedPlanFilterInput | null,
};

export type OnCreateSavedPlanSubscription = {
  onCreateSavedPlan?:  {
    __typename: "SavedPlan",
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

export type OnUpdateSavedPlanSubscriptionVariables = {
  filter?: ModelSubscriptionSavedPlanFilterInput | null,
};

export type OnUpdateSavedPlanSubscription = {
  onUpdateSavedPlan?:  {
    __typename: "SavedPlan",
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

export type OnDeleteSavedPlanSubscriptionVariables = {
  filter?: ModelSubscriptionSavedPlanFilterInput | null,
};

export type OnDeleteSavedPlanSubscription = {
  onDeleteSavedPlan?:  {
    __typename: "SavedPlan",
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
