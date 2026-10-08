import { IExampleStep, WorkStatus } from './PipelineModels';

/*
 * An activity's generated content (Wave 2 activity templates), stored in the
 * MicroCoachActivity row's `phases` AWSJSON. Everything that is fixed per
 * template (its name, instructional move and description) lives in
 * lib/activityTemplates instead; this is only what differs per activity.
 *
 * Generation order is need → takeaway → discussion questions + Watch for, so
 * the three discussion parts are written as one connected set; the page shows
 * them questions first and the takeaway last.
 */

export type GroupingKind = 'INDIVIDUAL' | 'PAIRS' | 'WHOLE_CLASS';

export interface IRunStep {
  title: string;
  body: string;
  /**
   * The grouping for this step. Empty when it doesn't regroup (e.g. "Repeat
   * with other examples"); two entries are alternatives ("Pairs or Whole
   * Class"), for the teacher to choose between.
   */
  groupings: GroupingKind[];
}

/* ── Facilitate: one artifact per template ─────────────────────────────── */

/** Spot the Slip: worked solutions with a first point of breakdown. */
export interface ISpotTheSlipExample {
  /** The bare problem, shown on the example's tile. */
  problem: string;
  /** The full prompt, shown over the steps. */
  prompt: string;
  /** Teacher view only: the slip in a few words. */
  slip: string;
  /** The ERROR annotation marks the first invalid step; teacher view only. */
  steps: IExampleStep[];
  /** Teacher view only: what the slip led to. */
  finalOutcome: string;
}

export interface ISpotTheSlipFacilitate {
  type: 'INCORRECT_WORKED_EXAMPLES';
  examples: ISpotTheSlipExample[];
}

export type NoticeKind = 'PRESERVE' | 'REVISE';

/** My Favorite No: a response worth preserving and building on. */
export interface IFavoriteNoExample {
  problem: string;
  prompt: string;
  /** The student's work, line by line. `status` shows in teacher view only. */
  work: { text: string; status: WorkStatus }[];
  /** Teacher view: what the reasoning gets right, then what needs to change. */
  notice: { kind: NoticeKind; text: string }[];
  /** Teacher view: where the response came from and how to swap in a real one. */
  sourceNote: string;
}

export interface IFavoriteNoFacilitate {
  type: 'FAVORITE_NO';
  examples: IFavoriteNoExample[];
}

export type DetectiveStageKind = 'INVESTIGATE' | 'SOLVE' | 'GENERALIZE';

/** Math Detective: evidence of a deeper issue to investigate, revise and check. */
export interface IMathDetectiveExample {
  problem: string;
  prompt: string;
  /** The response in brief. `status` shows in teacher view only. */
  workSummary: { text: string; status: WorkStatus }[];
  /** `ask` is student-facing; `answer` is teacher view only. */
  stages: { kind: DetectiveStageKind; ask: string; answer: string }[];
}

export interface IMathDetectiveFacilitate {
  type: 'MATH_DETECTIVE';
  examples: IMathDetectiveExample[];
}

export type CompareVerdict = 'CORRECT' | 'INCORRECT' | 'STRONGER';
export type Tone = 'ERROR' | 'SUCCESS' | 'NEUTRAL';

export interface ICompareStrategy {
  label: string;
  /** Teacher view only. null when the verdict shouldn't be labelled. */
  verdict: CompareVerdict | null;
  /** `highlight` shows in teacher view only. */
  steps: { step: number; text: string; highlight: Exclude<Tone, 'NEUTRAL'> | null }[];
  /** Teacher view only. `heading` is e.g. "Why it works"; null for a single note. */
  notes: { heading: string | null; text: string; tone: Tone }[];
}

/** Compare the Thinking: two approaches with equal visual weight. */
export interface ICompareFacilitate {
  type: 'COMPARE_THE_THINKING';
  problem: string;
  comparison: 'CORRECT_VS_INCORRECT' | 'BOTH_CORRECT';
  strategies: ICompareStrategy[];
}

export type ClaimVerdict = 'TRUE' | 'FALSE' | 'CONDITIONAL';

/** Make Your Case: a claim to defend, challenge or refine. */
export interface IMakeYourCaseFacilitate {
  type: 'MAKE_YOUR_CASE';
  claim: string;
  /** Teacher view only. */
  resolution: { verdict: ClaimVerdict; why: string };
  /** Student view: what to do while building a case. */
  studentSteps: string[];
  /** Examples to bring in; `answer` is teacher view only. */
  examples: { prompt: string; answer: string }[];
  /** Teacher reference: substantive arguments on both sides. */
  arguments: { stance: 'SUPPORT' | 'CHALLENGE'; text: string }[];
}

export type IFacilitateContent =
  | ISpotTheSlipFacilitate
  | IFavoriteNoFacilitate
  | IMathDetectiveFacilitate
  | ICompareFacilitate
  | IMakeYourCaseFacilitate;

/* ── Closing discussion ────────────────────────────────────────────────── */

export interface IDiscussionQuestion {
  question: string;
  answer: string;
}

export interface IWatchFor {
  watchFor: string;
  tryAsking: string;
  howToRespond: string;
}

export interface IActivityContent {
  schemaVersion: 2;
  /** Why MicroCoach picked this activity for this need; complements the description. */
  whyThisActivity: string;
  durations: { beforeClass: string; facilitate: string; discussion: string };
  beforeClass: { steps: string[]; groupingRationale: string };
  howToRun: IRunStep[];
  facilitate: IFacilitateContent;
  discussion: {
    /** Three. */
    questions: IDiscussionQuestion[];
    /** One to three: fewer strong sets over more weak ones. */
    watchFors: IWatchFor[];
    takeaway: string;
  };
}

export const ACTIVITY_CONTENT_VERSION = 2;

/** The parsed `phases`, when it holds this shape; null for anything older. */
export function toActivityContent(raw: unknown): IActivityContent | null {
  if (
    raw &&
    typeof raw === 'object' &&
    (raw as { schemaVersion?: unknown }).schemaVersion === ACTIVITY_CONTENT_VERSION
  ) {
    return raw as IActivityContent;
  }
  return null;
}
