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
    case ScreenType.LANDING:
    default:
      screenComponent = <Landing screenSize={screenSize} />;
  }

  return (
    <AppContainer>
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
