import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APIClients } from '../api';
import { ScreenType } from '../lib/MicroCoachModels';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useLogOut } from '../hooks/useMicroCoachDataActions';
import { useScreenSize } from '../hooks/useScreenSize';
import AppContainer from '../containers/AppContainer';
import { HeaderVariant } from '../components/Header';
import TemplateDebugMenu from '../components/TemplateDebugMenu';
import AuthGuard from '../containers/AuthGuard';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import SignUpRole from '../pages/SignUpRole';
import SignUpRegister from '../pages/SignUpRegister';
import SignUpVerify from '../pages/SignUpVerify';
import SignUpClasses from '../pages/SignUpClasses';
import SignUpSelect from '../pages/SignUpSelect';
import ResetPassword from '../pages/ResetPassword';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import Review from '../pages/Review';
import ChooseActivity from '../pages/ChooseActivity';
import MyPlan from '../pages/MyPlan';
import ActivityDetail from '../pages/ActivityDetail';
import Profile from '../pages/Profile';
import UploadRtd from '../pages/UploadRtd';
import UploadRtdReview from '../pages/UploadRtdReview';
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
  ScreenType.SIGNUP_ROLE,
  ScreenType.SIGNUP_REGISTER,
  ScreenType.SIGNUP_VERIFY,
  ScreenType.SIGNUP_CLASSES,
  ScreenType.SIGNUP_SELECT,
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
  ScreenType.UPLOAD_RTD_REVIEW,
  ScreenType.REFLECT,
]);

// The wizard's own chrome: brand only, no auth links to a flow you are in.
const SIGNUP_SCREENS = new Set<ScreenType>([
  ScreenType.LOGIN,
  ScreenType.PASSWORDRESET,
  ScreenType.SIGNUP_ROLE,
  ScreenType.SIGNUP_REGISTER,
  ScreenType.SIGNUP_VERIFY,
  ScreenType.SIGNUP_CLASSES,
  ScreenType.SIGNUP_SELECT,
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
  ScreenType.UPLOAD_RTD_REVIEW,
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
  const apiClients = useAPIClientsContext();
  const screenSize = useScreenSize();
  const { handleLogOut } = useLogOut(apiClients as APIClients);
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
      screenComponent = <Login screenSize={screenSize} />;
      break;
    case ScreenType.SIGNUP_ROLE:
      screenComponent = <SignUpRole screenSize={screenSize} />;
      break;
    case ScreenType.SIGNUP_REGISTER:
      screenComponent = <SignUpRegister screenSize={screenSize} />;
      break;
    case ScreenType.SIGNUP_VERIFY:
      screenComponent = <SignUpVerify screenSize={screenSize} />;
      break;
    case ScreenType.SIGNUP_CLASSES:
      screenComponent = <SignUpClasses screenSize={screenSize} />;
      break;
    case ScreenType.SIGNUP_SELECT:
      screenComponent = <SignUpSelect screenSize={screenSize} />;
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
      screenComponent = <ChooseActivity screenSize={screenSize} />;
      break;
    case ScreenType.ACTIVITY_DETAIL:
      screenComponent = <ActivityDetail screenSize={screenSize} />;
      break;
    case ScreenType.UPLOAD_RTD:
      screenComponent = <UploadRtd screenSize={screenSize} />;
      break;
    case ScreenType.UPLOAD_RTD_REVIEW:
      screenComponent = <UploadRtdReview screenSize={screenSize} />;
      break;
    case ScreenType.REFLECT:
      screenComponent = <Reflect screenSize={screenSize} />;
      break;
    case ScreenType.PROFILE:
      screenComponent = <Profile screenSize={screenSize} />;
      break;
    case ScreenType.MY_PLAN:
      screenComponent = <MyPlan screenSize={screenSize} />;
      break;
    case ScreenType.LANDING:
    default:
      screenComponent = <Landing screenSize={screenSize} />;
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
      onLogOut={handleHeaderLogOut}
      // The sign-up frames carry no footer either.
      showFooter={!usesAppChrome && !isSignUp}
    >
      <AuthGuard
        handleLogOut={handleLogOut}
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
