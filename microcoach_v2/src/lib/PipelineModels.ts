export type PrevalenceLevel = 'FEW' | 'SOME' | 'MOST';

export type DetailStatus =
  'COMPLETE' | 'PARTIAL' | 'CARD_ONLY' | 'NOT_IN_WIREFRAMES';

export interface IPrevalence {
  level: PrevalenceLevel;
  label: string;
  studentsNeedingSupport: number | null;
  studentsUnderstood: number | null;
  studentsNoResponse: number | null;
  totalAnalyzed: number;
  supportSummaryLabel: string | null;
  understoodSummaryLabel: string | null;
  shortCountLabel: string | null;
}

export interface IErrorBucket {
  optionLetter: string;
  optionSummary: string;
  errorTag: string;
  interpretation: string;
  studentCount: number;
  students: string[];
}

export interface IUnderstoodConcept {
  sectionTitle: string;
  subLabel: string;
  countChip: string;
  studentCount: number;
  students: string[];
}

export interface INoResponse {
  studentCount: number;
  students: string[];
}

export interface IStudentWork {
  tabLabel: string;
  sectionTitle: string;
  errorsByFrequency: IErrorBucket[];
  understoodConcept: IUnderstoodConcept;
  noResponse: INoResponse;
}

export interface ISkill {
  code: string;
  name: string | null;
  description: string;
}

export interface ISkillGroup {
  groupLabel: string;
  skills: ISkill[];
}

export interface ISkillContext {
  tabLabel: string;
  sectionTitle: string;
  focusSkill: ISkill & { groupLabel: string };
  prerequisiteGaps: ISkillGroup;
  upcomingSkills: ISkillGroup;
}

export interface IRoutine {
  id: string;
  name: string;
  subtitle: string;
  description: string;
}

export interface IGrouping {
  level: string;
  label: string;
}

export type ActivityType =
  | 'INCORRECT_WORKED_EXAMPLES'
  | 'FAVORITE_NO'
  | 'COMPARE_THE_THINKING'
  | 'MULTIPLE_REPRESENTATIONS'
  | 'MATH_HOSPITAL';

export type WorkStatus = 'CORRECT' | 'INCORRECT' | 'NEUTRAL';

export interface IExampleStep {
  step: number;
  text: string;
  isError: boolean;
  errorNote?: string | null;
}

export interface IWorkedExample {
  label: string;
  prompt: string;
  steps: IExampleStep[];
  finalOutcomeLabel: string;
  finalOutcome: string;
}

export interface IWorkedExamplesContent {
  type: 'INCORRECT_WORKED_EXAMPLES';
  title: string;
  subtitle: string;
  supportsViewToggle: boolean;
  examples: IWorkedExample[];
}

export interface IFavoriteNoContent {
  type: 'FAVORITE_NO';
  title: string;
  boardPrompt: { problem: string; instruction: string };
  suggestedExample: {
    title: string;
    sourceLabel: string;
    studentWorkLabel: string;
    studentWork: { text: string; status: WorkStatus }[];
    whatToNoticeLabel: string;
    whatToNotice: { status: WorkStatus; text: string }[];
  };
  footnote: string;
}

export interface ICompareColumn {
  label: string;
  verdict: string;
  isCorrect: boolean;
  steps: IExampleStep[];
  annotation: string;
}

export interface ICompareContent {
  type: 'COMPARE_THE_THINKING';
  title: string;
  subtitle: string;
  supportsViewToggle: boolean;
  problemLabel: string;
  problem: string;
  columns: ICompareColumn[];
  keyTakeaway: { label: string; text: string };
}

export interface IRepresentation {
  kind: string;
  label: string;
  matches: boolean;
  matchLabel: string;
  value?: string;
  detail?: string;
  lineLabel?: string;
  plottedPoints?: string[];
  columns?: string[];
  rows?: (string | number)[][];
}

export interface IRepresentationsContent {
  type: 'MULTIPLE_REPRESENTATIONS';
  title: string;
  subtitle: string;
  studentTaskLabel: string;
  studentTask: string;
  representations: IRepresentation[];
  teachingNotesLabel: string;
  teachingNotes: { order: number; title: string; body: string }[];
}

export interface IMathHospitalContent {
  type: 'MATH_HOSPITAL';
  title: string;
  problem: string;
  problemChecklist: string;
  steps: {
    step: number;
    title: string;
    askLabel: string;
    ask: string;
    responseLabel: string;
    response: string;
  }[];
  footnote: string;
}

export type IActivityContent =
  | IWorkedExamplesContent
  | IFavoriteNoContent
  | ICompareContent
  | IRepresentationsContent
  | IMathHospitalContent;

export interface IPhaseStep {
  order: number;
  title: string;
  body?: string;
}

export interface IActivityGroup {
  label: string;
  description: string;
  students: string[];
}

export interface IActivityPhases {
  beforeClass: {
    title: string;
    checklist: IPhaseStep[];
    groupFormation: {
      title: string;
      guidance: string;
      groups: IActivityGroup[];
    } | null;
  } | null;
  activity: IActivityContent | null;
  facilitation: { title: string; steps: IPhaseStep[] } | null;
  discussion: { title: string; questions: IPhaseStep[] } | null;
}

export interface IActivity {
  activityType: ActivityType;
  id: string;
  misconceptionId: string;
  title: string | null;
  isSelected: boolean;
  selectLabel: string;
  detailStatus: DetailStatus;
  routine: IRoutine;
  durationLabel: string | null;
  grouping: IGrouping | null;
  targets: string | null;
  instructionalMove: string | null;
  strategyTag: string | null;
  phases: IActivityPhases | null;
}

export type PlanStatus = 'SAVED' | 'COMPLETED';

export interface IPlanItem {
  id: string;
  status: PlanStatus;
  activityId: string | null;
  activityTitle: string;
  skillCode: string;
  misconceptionId: string | null;
  misconceptionTitle: string;
  prevalence: { level: string; label: string };
  grouping: IGrouping;
}

export interface IMisconception {
  id: string;
  rank: number;
  badge: string | null;
  isRecommendedFocus: boolean;
  title: string;
  titleCased: string;
  shortLabel: string;
  description: string;
  consequence: string;
  prevalence: IPrevalence;
  detailStatus: DetailStatus;
  nextStepActivities: IActivity[];
  studentWork: IStudentWork | null;
  skillContext: ISkillContext | null;
}

export interface ISessionTeacher {
  displayName: string;
  shortName: string;
  email: string;
}

export interface ISessionClass {
  id: string;
  name: string;
  fullName: string | null;
  isSelected: boolean;
}

export interface ISession {
  teacher: ISessionTeacher;
  selectedClassId: string;
  classes: ISessionClass[];
  hasMoreClasses: boolean;
  selectedWeek: string;
  studentWorksAnalyzed: number;
  studentsWithStrongUnderstanding: number;
}

export interface IPipelineOutput {
  session: ISession;
  misconceptions: IMisconception[];
}
