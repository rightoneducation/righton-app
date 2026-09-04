import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenType } from '../lib/MicroCoachModels';
import { useAppOutletContext } from '../hooks/useAppOutletContext';
import { useLogOut } from '../hooks/useAuthActions';
import { useScreenSize } from '../hooks/useScreenSize';
import AppContainer from '../containers/AppContainer';
import { HeaderVariant } from '../components/Header';
import TemplateDebugMenu from '../components/TemplateDebugMenu';
import AuthGuard from '../containers/AuthGuard';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import SignUpWizard from '../containers/SignUpWizard';
import ResetPassword from '../pages/ResetPassword';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import Review from '../pages/Review';
import ChooseActivity from '../pages/ChooseActivity';
import MyPlan from '../pages/MyPlan';
import ActivityDetail from '../pages/ActivityDetail';
import Profile from '../pages/Profile';
import UploadFlow from '../containers/UploadFlow';
import Reflect from '../pages/Reflect';

/**
 * Maps a ScreenType to its page, wraps it in AuthGuard, and drops the result
 * into AppContainer. Mirrors central_v2's AppSwitch — the router only knows
 * URLs, this decides what a screen actually is.
 */

/**
 * Screens whose content doesn't depend on who the user is. They render while
 * the auth check is still in flight, so their own copy and imagery start
 * loading immediately rather than queueing behind it.
 *
 * The rest are mid-auth-flow screens — the auth state *is* their content, so
 * they wait. AuthGuard still redirects on every screen once the status
 * resolves; this only governs what happens during LOADING.
 */
const PUBLIC_SCREENS = new Set<ScreenType>([
  ScreenType.LANDING,
  ScreenType.LOGIN,
  ScreenType.SIGNUP,
  ScreenType.PASSWORDRESET,
  // TODO(auth): move UNDERSTAND behind the guard once sign-in is wired; also
  // needs AuthGuard's LOGGEDOUT case to redirect.
  ScreenType.DASHBOARD,
  ScreenType.REVIEW,
  ScreenType.CHOOSE_ACTIVITY,
  ScreenType.MY_PLAN,
  ScreenType.ACTIVITY_DETAIL,
  ScreenType.PROFILE,
  ScreenType.CHANGE_PASSWORD,
  ScreenType.UPLOAD_RTD,
  ScreenType.REFLECT,
]);

// The wizard's own chrome: brand only, no auth links to a flow you are in.
const SIGNUP_SCREENS = new Set<ScreenType>([
  ScreenType.LOGIN,
  ScreenType.PASSWORDRESET,
  ScreenType.SIGNUP,
]);

/*
 * The profile frame draws the app header differently from every other in-app
 * frame: identity as avatar-and-name, and no class switcher. CHANGE_PASSWORD
 * has no frame of its own, but it is entered from the profile — flipping the
 * pill and re-adding the switcher mid-flow would read as a glitch.
 */
const PROFILE_CHROME_SCREENS = new Set<ScreenType>([
  ScreenType.PROFILE,
  ScreenType.CHANGE_PASSWORD,
]);

const APP_CHROME_SCREENS = new Set<ScreenType>([
  ScreenType.PROFILE,
  ScreenType.CHANGE_PASSWORD,
  ScreenType.UPLOAD_RTD,
  ScreenType.REFLECT,
  ScreenType.DASHBOARD,
  ScreenType.REVIEW,
  ScreenType.CHOOSE_ACTIVITY,
  ScreenType.MY_PLAN,
  ScreenType.ACTIVITY_DETAIL,
]);

interface AppSwitchProps {
  currentScreen: ScreenType;
}

export default function AppSwitch({ currentScreen }: AppSwitchProps) {
  const { apiClients, user, plan } = useAppOutletContext();
  const screenSize = useScreenSize();
  const { handleLogOut } = useLogOut(apiClients, user);
  const navigate = useNavigate();

  /*
   * This used to clear the reducer by hand and never call handleLogOut, so the
   * Cognito session outlived the click and the next load re-authenticated
   * straight back in. handleLogOut does the local reset too — status, profile
   * and all — so the only thing left to add is the destination: the header's
   * control belongs to someone signing out deliberately, who wants the sign-in
   * screen rather than the marketing page handleLogOut lands its forced-logout
   * callers on. `replace` so Back cannot return to a screen that is now
   * unauthenticated.
   */
  const handleHeaderLogOut = async () => {
    await handleLogOut();
    navigate('/login', { replace: true });
  };

  let screenComponent;
  switch (currentScreen) {
    case ScreenType.LOGIN:
      screenComponent = <Login screenSize={screenSize} user={user} />;
      break;
    case ScreenType.SIGNUP:
      screenComponent = <SignUpWizard screenSize={screenSize} user={user} />;
      break;
    case ScreenType.AUTH:
      screenComponent = <AuthCallback />;
      break;
    case ScreenType.PASSWORDRESET:
      screenComponent = <ResetPassword screenSize={screenSize} />;
      break;
    case ScreenType.CHANGE_PASSWORD:
      // Same flow, entered by someone already signed in: it returns to the
      // profile rather than the login screen, and drops the wizard framing.
      screenComponent = <ResetPassword screenSize={screenSize} isInSession />;
      break;
    case ScreenType.DASHBOARD:
      screenComponent = <Dashboard screenSize={screenSize} />;
      break;
    case ScreenType.REVIEW:
      screenComponent = <Review screenSize={screenSize} />;
      break;
    case ScreenType.CHOOSE_ACTIVITY:
      screenComponent = <ChooseActivity screenSize={screenSize} plan={plan} />;
      break;
    case ScreenType.ACTIVITY_DETAIL:
      screenComponent = <ActivityDetail screenSize={screenSize} />;
      break;
    case ScreenType.UPLOAD_RTD:
      screenComponent = <UploadFlow screenSize={screenSize} user={user} />;
      break;
    case ScreenType.REFLECT:
      screenComponent = <Reflect screenSize={screenSize} />;
      break;
    case ScreenType.PROFILE:
      screenComponent = <Profile screenSize={screenSize} user={user} />;
      break;
    case ScreenType.MY_PLAN:
      screenComponent = <MyPlan screenSize={screenSize} plan={plan} />;
      break;
    case ScreenType.LANDING:
    default:
      screenComponent = <Landing screenSize={screenSize} user={user} />;
  }

  const usesAppChrome = APP_CHROME_SCREENS.has(currentScreen);
  const isSignUp = SIGNUP_SCREENS.has(currentScreen);

  let headerVariant: HeaderVariant = 'public';
  if (PROFILE_CHROME_SCREENS.has(currentScreen)) headerVariant = 'profile';
  else if (usesAppChrome) headerVariant = 'app';
  else if (isSignUp) headerVariant = 'signup';

  return (
    <AppContainer
      headerVariant={headerVariant}
      user={user}
      onLogOut={handleHeaderLogOut}
      // The sign-up frames carry no footer either.
      showFooter={!usesAppChrome && !isSignUp}
    >
      <AuthGuard
        handleLogOut={handleLogOut}
        user={user}
        screenSize={screenSize}
        requiresAuth={!PUBLIC_SCREENS.has(currentScreen)}
      >
        {screenComponent}
      </AuthGuard>
      {/* Review scaffolding — remove with TemplateDebugMenu once the activity
          screen is backed by real data. */}
      {currentScreen === ScreenType.ACTIVITY_DETAIL && <TemplateDebugMenu />}
    </AppContainer>
  );
}
