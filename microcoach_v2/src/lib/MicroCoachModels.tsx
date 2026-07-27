import { IUserProfile } from '../api';

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
  SIGNUP,
  CONFIRMATION,
  GOOGLESIGNUP,
  AUTH,
  PASSWORDRESET,
}

// TODO(auth): replace with the MicroCoach Google Cloud OAuth 2.0 Web client id
// after it's created (same id used to configure the Cognito Google IdP).
export const GOOGLE_OAUTH_CLIENT_ID = 'REPLACE_WITH_MICROCOACH_GOOGLE_CLIENT_ID';

export interface IMicroCoachDataState {
  userStatus: UserStatusType;
  userProfile: IUserProfile | null;
  userErrorString: string;
}
