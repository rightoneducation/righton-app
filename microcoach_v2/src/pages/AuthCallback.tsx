import React from 'react';
import { Typography } from '@mui/material';
import { APIClients } from '../api';
import { UserStatusType } from '../lib/MicroCoachModels';
import { IUserState } from '../hooks/useUserState';
import AuthShell from '../components/AuthShell';

interface AuthCallbackProps {
  apiClients: APIClients;
  user: IUserState;
}

// Landing route for the Cognito Hosted-UI redirect (/auth), and where a Google
// signup is completed.
//
// validateUser (AuthLayout) resolves the session first. A Google identity with
// no MicroCoachUser row resolves to GOOGLE_SIGNUP, and AuthGuard now renders
// this screen rather than redirecting — so the row gets written here, from the
// idToken alone. That is why there is no Google signup form: the model needs
// cognitoId, email, teacherName, role and classes, and Google supplies the
// first three while role is server-fixed to TEACHER and classes are empty for
// a user who never walks the wizard.
//
// Every other status just waits here for a beat while AuthGuard redirects.
export default function AuthCallback({ apiClients, user }: AuthCallbackProps) {
  const { userStatus, signIn, signOut } = user;
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
        const { firstName, lastName } =
          await apiClients.auth.getFirstAndLastName();
        const email = (await apiClients.auth.getUserEmail()) ?? '';
        const profile = await apiClients.user.signUpGoogleBuildBackendUser({
          email,
          teacherName: `${firstName} ${lastName}`.trim(),
          classes: [],
        });
        signIn(profile, UserStatusType.LOGGEDIN);
      } catch (error) {
        // Log the error itself: signUpGoogleBuildBackendUser throws on a null
        // create, and the message names which step actually failed.
        console.error('Google signup could not create the user profile', error);
        // Drop to LOGGEDOUT rather than leaving them stuck in GOOGLE_SIGNUP,
        // which would render this screen forever. Tokens are left intact — the
        // same restore-failed shape validateUser uses.
        signOut();
      }
    };

    buildBackendUser();
  }, [userStatus, apiClients, signIn, signOut]);

  return (
    <AuthShell title="Completing sign-in…">
      <Typography variant="body2" align="center">
        One moment while we finish signing you in.
      </Typography>
    </AuthShell>
  );
}
