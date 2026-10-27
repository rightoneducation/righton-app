import { IMicroCoachActivity } from '../api/Models/IMicroCoachActivity';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IMicroCoachSavedPlan } from '../api/Models/IMicroCoachSavedPlan';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import { IMicroCoachStudent } from '../api/Models/IMicroCoachStudent';
import { IUser } from '../api/Models/IUser';

// Auth lifecycle states, mirroring central_v2's UserStatusType.
export enum UserStatusType {
  LOADING,
  LOGGEDIN,
  LOGGEDOUT,
  NONVERIFIED,
  INCOMPLETE,
  GOOGLE_SIGNIN,
  GOOGLE_SIGNUP,
  GOOGLE_ERROR,
}

// Screens this shell currently routes to.
export enum ScreenType {
  LANDING,
  LOGIN,
  // One entry for the whole wizard: the five steps are one route (`signup/*`)
  // owned by SignUpWizard, which keeps their shared state local.
  SIGNUP,
  AUTH,
  PASSWORDRESET,
  // The same reset flow reached from Account Settings instead of Login. A
  // separate screen rather than a flag on PASSWORDRESET: the two differ in
  // chrome and in auth posture, which is exactly what AppSwitch's sets model.
  CHANGE_PASSWORD,
  DASHBOARD,
  REVIEW,
  CHOOSE_ACTIVITY,
  MY_ACTIVITY,
  ACTIVITY_DETAIL,
  PROFILE,
  // Likewise `upload-miu/*` — both steps are UploadFlow.
  UPLOAD_MIU,
  // `upload-reassess/*`: the same UploadFlow, for the upload after the activity.
  UPLOAD_REASSESS,
  REFLECT,
  // The sidebar's other destination, beside DASHBOARD.
  PAST_ACTIVITIES,
}

// Resolved once from useMediaQuery at the top of a page and drilled down, so
// layout branches happen in JS rather than in CSS media queries (same approach
// as central_v2). Numeric enum: SMALL is 0, so always compare explicitly.
export enum ScreenSize {
  SMALL,
  MEDIUM,
  LARGE,
}

// Google OAuth 2.0 Web client id for the @react-oauth/google popup. Hardcoded,
// matching central_v2 (App.tsx): a client id is a public identifier — it travels
// in the authorization URL and ships in the bundle. The client SECRET is the
// confidential half, and it lives on the Cognito Google IdP, never in this app.
//
// Must stay the SAME client as that IdP (user pool us-east-1_S8zm9HGnX): the
// popup and the Hosted-UI redirect after it are two separate Google OAuth flows,
// and a mismatch lets the popup succeed while the redirect fails.
export const GOOGLE_OAUTH_CLIENT_ID =
  '23009502295-pl64u1k194fd798ps8esc58hhorts7gh.apps.googleusercontent.com';

export enum MicroCoachDataStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  READY = 'ready',
  ERROR = 'error',
}

/** One fetch's state, keyed by what it fetched (see `loadKeys`). */
export interface ILoadState {
  status: MicroCoachDataStatus;
  error: Error | null;
  // Shown as is while a background refetch replaces it.
  stale: boolean;
}

// The keys `loads` is indexed by: every status names exactly what it describes.
export const loadKeys = {
  classrooms: (userId: string) => `classrooms:${userId}`,
  // A class's sessions, students and saved plans.
  classChildren: (classId: string) => `class:${classId}`,
  // A session's misconceptions and their activities. The session's status is
  // part of the key, so the pipeline moving it on asks for them again.
  sessionChildren: (sessionId: string, status: string | null) =>
    `session:${sessionId}@${status ?? ''}`,
};

// A misconception as stored: its activities are their own table, joined back
// on by lib/selectors.ts.
export type MisconceptionRow = Omit<IMicroCoachMisconception, 'nextStepActivities'>;

/**
 * The schema's tables, one row per id. Each row is held once; every screen's
 * shape (a class's sessions, Home's weekly rows, a plan's items) is joined
 * from these during render by lib/selectors.ts, never stored.
 */
export interface IMicroCoachTables {
  classrooms: Record<string, IMicroCoachClassroom>;
  students: Record<string, IMicroCoachStudent>;
  sessions: Record<string, IMicroCoachSession>;
  savedPlans: Record<string, IMicroCoachSavedPlan>;
  misconceptions: Record<string, MisconceptionRow>;
  activities: Record<string, IMicroCoachActivity>;
}

export type TableName = keyof IMicroCoachTables;
export type TableRow<T extends TableName> = IMicroCoachTables[T][string];

export interface IMicroCoachDataState extends IMicroCoachTables {
  userProfile: IUser | null;
  userStatus: UserStatusType;
  userErrorString: string;
  loads: Record<string, ILoadState>;
  // What the teacher is looking at, set together in one action. Either may
  // point at a row that is gone; the selectors fall back (first class, the
  // class's latest session) rather than an effect correcting it.
  selection: { classId: string | null; sessionId: string | null };
  // Bumped on sign-out: a fetch that started before it drops its answer.
  epoch: number;
}

export const initMicroCoachDataState: IMicroCoachDataState = {
  userProfile: null,
  userStatus: UserStatusType.LOADING,
  userErrorString: '',
  classrooms: {},
  students: {},
  sessions: {},
  savedPlans: {},
  misconceptions: {},
  activities: {},
  loads: {},
  selection: { classId: null, sessionId: null },
  epoch: 0,
};
