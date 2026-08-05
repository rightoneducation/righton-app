import React from 'react';
import { APIClients } from '../api';
import { ScreenType } from '../lib/MicroCoachModels';
import { useAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { useLogOut } from '../hooks/useMicroCoachDataActions';
import { useScreenSize } from '../hooks/useScreenSize';
import AppContainer from '../containers/AppContainer';
import AuthGuard from '../containers/AuthGuard';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Confirmation from '../pages/Confirmation';
import GoogleSignup from '../pages/GoogleSignup';
import ResetPassword from '../pages/ResetPassword';
import AuthCallback from '../pages/AuthCallback';
import Analysis from '../pages/Analysis';
import ChooseActivity from '../pages/ChooseActivity';
import MyPlan from '../pages/MyPlan';
import ActivityDetail from '../pages/ActivityDetail';

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
  ScreenType.ANALYSIS,
  ScreenType.CHOOSE_ACTIVITY,
  ScreenType.MY_PLAN,
  ScreenType.ACTIVITY_DETAIL,
]);

const APP_CHROME_SCREENS = new Set<ScreenType>([
  ScreenType.ANALYSIS,
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

  let screenComponent;
  switch (currentScreen) {
    case ScreenType.LOGIN:
      screenComponent = <Login />;
      break;
    case ScreenType.SIGNUP:
      screenComponent = <SignUp />;
      break;
    case ScreenType.CONFIRMATION:
      screenComponent = <Confirmation />;
      break;
    case ScreenType.GOOGLESIGNUP:
      screenComponent = <GoogleSignup />;
      break;
    case ScreenType.AUTH:
      screenComponent = <AuthCallback />;
      break;
    case ScreenType.PASSWORDRESET:
      screenComponent = <ResetPassword />;
      break;
    case ScreenType.ANALYSIS:
      screenComponent = <Analysis screenSize={screenSize} />;
      break;
    case ScreenType.CHOOSE_ACTIVITY:
      screenComponent = <ChooseActivity screenSize={screenSize} />;
      break;
    case ScreenType.ACTIVITY_DETAIL:
      screenComponent = <ActivityDetail screenSize={screenSize} />;
      break;
    case ScreenType.MY_PLAN:
      screenComponent = <MyPlan screenSize={screenSize} />;
      break;
    case ScreenType.LANDING:
    default:
      screenComponent = <Landing screenSize={screenSize} />;
  }

  const usesAppChrome = APP_CHROME_SCREENS.has(currentScreen);

  return (
    <AppContainer
      headerVariant={usesAppChrome ? 'app' : 'public'}
      showFooter={!usesAppChrome}
    >
      <AuthGuard
        handleLogOut={handleLogOut}
        screenSize={screenSize}
        requiresAuth={!PUBLIC_SCREENS.has(currentScreen)}
      >
        {screenComponent}
      </AuthGuard>
    </AppContainer>
  );
}
