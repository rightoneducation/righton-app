import { IUserProfile } from '../api';
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
  SIGNUP_ROLE,
  SIGNUP_REGISTER,
  SIGNUP_VERIFY,
  SIGNUP_CLASSES,
  SIGNUP_SELECT,
  AUTH,
  PASSWORDRESET,
  DASHBOARD,
  REVIEW,
  CHOOSE_ACTIVITY,
  MY_PLAN,
  ACTIVITY_DETAIL,
  PROFILE,
  UPLOAD_RTD,
  UPLOAD_RTD_REVIEW,
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

// TODO(auth): replace with the MicroCoach Google Cloud OAuth 2.0 Web client id
// after it's created (same id used to configure the Cognito Google IdP).
export const GOOGLE_OAUTH_CLIENT_ID =
  'REPLACE_WITH_MICROCOACH_GOOGLE_CLIENT_ID';

export interface IMicroCoachDataState {
  userStatus: UserStatusType;
  userProfile: IUserProfile | null;
  userErrorString: string;
  planItems: IPlanItem[];
}
