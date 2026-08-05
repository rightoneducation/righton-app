export type PrevalenceLevel = 'FEW' | 'SOME' | 'MOST';

export type DetailStatus =
  | 'COMPLETE'
  | 'PARTIAL'
  | 'CARD_ONLY'
  | 'NOT_IN_WIREFRAMES';

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

export interface IActivity {
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
  phases: unknown;
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
