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
  nextStepActivities: unknown[];
  studentWork: unknown;
  skillContext: unknown;
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
