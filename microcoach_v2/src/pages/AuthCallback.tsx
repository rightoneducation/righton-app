import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { APIClients } from '../api';
import { ScreenSize, UserStatusType } from '../lib/MicroCoachModels';
import { IUserState } from '../hooks/useUserState';
import {
  clearGoogleProfile,
  readGoogleProfile,
} from '../lib/googleProfileStash';
import AppContentRow from '../components/AppContentRow';
import {
  SignUpColumn,
  SignUpSubheading,
} from '../lib/styledcomponents/SignUpStyledComponents';

interface AuthCallbackProps {
  apiClients: APIClients;
  screenSize: ScreenSize;
  user: IUserState;
}

// Landing route for the Cognito Hosted-UI redirect (/auth), and where a Google
// signup is completed.
//
// validateUser (AuthLayout) resolves the session first. A Google identity with
// no User row resolves to GOOGLE_SIGNUP, and AuthGuard renders this screen
// rather than redirecting — so the row gets written here.
//
// That is why there is no Google signup form. The row needs cognitoId, email,
// name and role: cognitoId comes off the session, email and name from the
// profile the popup stashed (lib/googleProfileStash — Cognito's IdP mapping
// does not forward given_name/family_name, so the idToken has neither), and
// role is server-fixed. `classes` is a @hasMany relation, not a field, so a
// Google user simply has none until Class rows exist.
//
// Every other status just waits here for a beat while AuthGuard redirects.
export default function AuthCallback({
  apiClients,
  screenSize,
  user,
}: AuthCallbackProps) {
  const theme = useTheme();
  const { userStatus, setSignedInUser, signOut } = user;
  // validateUser can resolve more than once (StrictMode double-invokes effects
  // in dev), and a second pass would post a second createUser for an identity
  // that now has a row.
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    if (userStatus !== UserStatusType.GOOGLE_SIGNUP) return;
    if (hasRun.current) return;
    hasRun.current = true;

    const buildBackendUser = async () => {
      try {
        // The name comes from the stash the popup wrote (see
        // lib/googleProfileStash). getFirstAndLastName reads given_name /
        // family_name off the idToken, which Cognito does not populate under
        // the current IdP mapping — it is kept as a fallback so this starts
        // working from the token alone if that mapping is ever added.
        const stash = readGoogleProfile();
        const { firstName, lastName } =
          await apiClients.auth.getFirstAndLastName();
        // Stored as two fields, so the stash's halves go straight through.
        const givenName = stash?.givenName || firstName;
        const familyName = stash?.familyName || lastName;
        // Stash first, Cognito only as a fallback. fetchUserAttributes needs
        // the `aws.cognito.signin.user.admin` scope, which this pool's app
        // clients do not grant, so calling it first just logs a 400 on every
        // signup before falling through to the value we already had.
        const email = stash?.email || (await apiClients.auth.getUserEmail()) || '';
        const profile = await apiClients.user.signUpGoogleBuildBackendUser({
          email,
          firstName: givenName,
          lastName: familyName,
        });
        setSignedInUser(profile, UserStatusType.LOGGEDIN);
      } catch (error) {
        // Log the error itself: signUpGoogleBuildBackendUser throws on a null
        // create, and the message names which step actually failed.
        console.error('Google signup could not create the user profile', error);
        // Drop to LOGGEDOUT rather than leaving them stuck in GOOGLE_SIGNUP,
        // which would render this screen forever. Tokens are left intact — the
        // same restore-failed shape validateUser uses.
        signOut();
      } finally {
        // Always clear it, including on failure: a stale stash would give the
        // NEXT Google account whoever signed up before them as a name.
        clearGoogleProfile();
      }
    };

    buildBackendUser();
  }, [userStatus, apiClients, setSignedInUser, signOut]);

  // Same frame as the signup steps (see SignUpVerify): AppContentRow owns the
  // page padding, SignUpColumn the centring and max width. Arriving here is the
  // middle of the signup flow, so it should not change shape.
  return (
    <AppContentRow
      screenSize={screenSize}
      sx={{ pt: `${theme.sizing.space8}px`, pb: `${theme.sizing.space12}px` }}
    >
      <SignUpColumn screenSize={screenSize}>
        <SignUpSubheading>Completing sign-in…</SignUpSubheading>
        <Typography
          variant="rubikBody"
          sx={{ color: 'designSystem.surface.darkBlue', textAlign: 'center' }}
        >
          One moment while we finish signing you in.
        </Typography>
      </SignUpColumn>
    </AppContentRow>
  );
}
