import type { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';

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
  | 'MATH_DETECTIVE'
  | 'MAKE_YOUR_CASE';

export type WorkStatus = 'CORRECT' | 'INCORRECT' | 'NEUTRAL';

export type StepAnnotationKind = 'CORRECT' | 'ERROR';

/**
 * A teacher-only remark on one step of a worked example.
 *
 * Figma renders both kinds inline in the same navy as the step body — the
 * error row is distinguished by its highlight, not by the note's colour. It is
 * still a separate field rather than part of `text` because the student view
 * has to strip it: "Student view shows the problem clean".
 */
export interface IStepAnnotation {
  kind: StepAnnotationKind;
  /**
   * The note itself, with no presentation baked in — the component supplies
   * the "(Correct)" / "← (Error: …)" wrapper from the catalogue so it stays
   * translatable. `null` for a bare CORRECT marker, which carries no note.
   */
  text: string | null;
}

export interface IExampleStep {
  step: number;
  /** Student-safe. Carries no correctness marker of its own. */
  text: string;
  annotation: IStepAnnotation | null;
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
    studentWork: {
      text: string;
      status: WorkStatus;
      /**
       * Figma highlights the restated problem green but gives it no tick —
       * the fill and the mark are not the same signal. Defaults to marked.
       */
      showMark?: boolean;
    }[];
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

export interface IGraphLine {
  /** Plotted directly. Kept as numbers so nothing has to parse `lineLabel`. */
  slope: number;
  intercept: number;
}

export interface IAxisRange {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface IRepresentation {
  kind: string;
  label: string;
  matches: boolean;
  matchLabel: string;
  value?: string;
  detail?: string;
  lineLabel?: string;
  line?: IGraphLine;
  axisRange?: IAxisRange;
  slopeAnnotation?: { riseLabel: string; runLabel: string };
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

export interface IMathDetectiveContent {
  type: 'MATH_DETECTIVE';
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

/**
 * Make Your Case — students take a position on a mathematical claim, argue it with
 * evidence, then revisit the claim. Shaped to the template's classroomFlow in
 * activityLibrary.json: present the claim, initial vote, make your case, revisit,
 * name the takeaway.
 *
 * `positions` and `resolution` are teacher-only, the same split the compare
 * template makes with `verdict`/`annotation` — the template's `views.student`
 * says to present the claim without revealing the resolution or which argument
 * is strongest.
 */
export interface IMakeYourCasePosition {
  label: string;
  /** Which side of the claim this argument takes. */
  stance: string;
  argument: string;
  isStrongest: boolean;
}

export interface IMakeYourCaseContent {
  type: 'MAKE_YOUR_CASE';
  title: string;
  subtitle: string;
  supportsViewToggle: boolean;
  claim: { label: string; text: string };
  /** Students commit before arguing, so the revisit step has something to move. */
  initialVote: { label: string; options: string[] };
  evidence: { label: string; prompts: string[] };
  /** Teacher view only. */
  positions: IMakeYourCasePosition[];
  /** Teacher view only — the mathematical resolution of the claim. */
  resolution: { label: string; text: string };
  keyTakeaway: { label: string; text: string };
}

export type IActivityContent =
  | IWorkedExamplesContent
  | IFavoriteNoContent
  | ICompareContent
  | IRepresentationsContent
  | IMathDetectiveContent
  | IMakeYourCaseContent;

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

export interface ISessionTeacher {
  displayName: string;
  shortName: string;
  email: string;
  /** ISO date. Account Settings reads this until a real profile carries one. */
  accountCreated: string;
  uploadsMade: number;
}

export interface ISessionClass {
  id: string;
  name: string;
  fullName: string | null;
  isSelected: boolean;
}

export interface IFlowStep {
  order: number;
  label: string;
  state: 'COMPLETE' | 'CURRENT' | 'UPCOMING';
  /** Where the step links to, when it is clickable. */
  path?: string;
  /** Completed steps, plus Assess in any state (it is always where to start). */
  isClickable?: boolean;
}

export interface ISidebarItem {
  id: string;
  label: string;
  isActive: boolean;
}

export interface ISession {
  teacher: ISessionTeacher;
  selectedClassId: string;
  classes: ISessionClass[];
  hasMoreClasses: boolean;
  selectedWeek: string;
  studentWorksAnalyzed: number;
  studentsWithStrongUnderstanding: number;
  flowSteps: IFlowStep[];
  sidebarItems: ISidebarItem[];
}

export interface IImplementedActivity {
  id: string;
  title: string;
  skillCode: string;
  misconceptionTitle: string;
  /** Percentages the frame states outright; nothing here is derived. */
  masteryBefore: number;
  masteryAfter: number;
  studentsImproved: number;
}

export interface IReflect {
  implementedActivities: IImplementedActivity[];
}

export interface IPipelineOutput {
  session: ISession;
  misconceptions: IMicroCoachMisconception[];
  reflect: IReflect;
}
