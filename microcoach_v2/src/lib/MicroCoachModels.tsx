import { IPlanItem } from './PipelineModels';

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
  MY_PLAN,
  ACTIVITY_DETAIL,
  PROFILE,
  // Likewise `upload-rtd/*` — both steps are UploadFlow.
  UPLOAD_RTD,
  REFLECT,
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

// App data only — signed-in user state lives in RootLayout (see App.tsx).
export interface IMicroCoachDataState {
  planItems: IPlanItem[];
}
