import React, { useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  ScrollRestoration,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Modal from 'react-modal';
import { APIClients, AppType, Environment } from './api';
import Theme from './lib/Theme';
import { GOOGLE_OAUTH_CLIENT_ID, ScreenType } from './lib/MicroCoachModels';
import { useAPIClients } from './hooks/useAPIClients';
import { useAuthResolver } from './hooks/useAuthActions';
import { useUserState } from './hooks/useUserState';
import { usePlanItems } from './hooks/usePlanItems';
import AppSwitch from './switches/AppSwitch';

/**
 * Parent layout route. React Router keeps this element mounted across child
 * route changes, so the auth resolver's mount effect fires exactly once per
 * session rather than re-flashing the loading state on every navigation.
 *
 * It also owns the signed-in user state. That has to live here rather than in
 * App: the router is memoised on `apiClients` (play's pattern), so anything
 * built into the route elements is captured once — user state changing in App
 * would either go stale or force a new router, and a new router remounts the
 * tree and drops ScrollRestoration's history. Here it sits *inside* the router,
 * where the resolver can also reach useNavigate, and reaches the screens through
 * the Outlet.
 */
// react-modal needs to know the app root so it can mark it aria-hidden while a
// modal is open. Without this it warns and leaves the background readable by
// screen readers — the other apps in the monorepo skip it.
Modal.setAppElement('#root');

function RootLayout({ apiClients }: { apiClients: APIClients }) {
  const user = useUserState();
  const plan = usePlanItems();
  useAuthResolver(apiClients, user);
  const outletContext = useMemo(
    () => ({ apiClients, user, plan }),
    [apiClients, user, plan],
  );
  return (
    <>
      {/*
       * Client-side navigation doesn't move the scroll position the way a real
       * document load does, and the sticky header hides that it hasn't — you
       * arrive on the next page already scrolled down it. This restores the
       * browser's own behaviour: top on a forward navigation, and the position
       * you actually left on Back/Forward.
       *
       * Available because the app runs a data router; getKey is deliberately
       * left at its default (location.key). Keying on pathname instead would
       * restore a remembered position on arrival, which is the bug, not the fix.
       */}
      <ScrollRestoration />
      <Outlet context={outletContext} />
    </>
  );
}

function App() {
  const { apiClients } = useAPIClients(Environment.Staging, AppType.MICROCOACH);

  /*
   * Memoised on apiClients, like play's App: createBrowserRouter must not be
   * re-run on unrelated renders — a new router instance swaps history and
   * remounts the whole tree. The router knows URLs only; AppSwitch turns a
   * ScreenType into a page wrapped in AuthGuard and AppContainer.
   */
  const router = useMemo(() => {
    if (!apiClients) return null;
    return createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<RootLayout apiClients={apiClients} />}>
            <Route
              index
              element={<AppSwitch currentScreen={ScreenType.LANDING} />}
            />
            <Route
              path="login"
              element={<AppSwitch currentScreen={ScreenType.LOGIN} />}
            />
            <Route
              path="signup/*"
              element={<AppSwitch currentScreen={ScreenType.SIGNUP} />}
            />
            <Route
              path="auth"
              element={<AppSwitch currentScreen={ScreenType.AUTH} />}
            />
            <Route
              path="password/reset"
              element={<AppSwitch currentScreen={ScreenType.PASSWORDRESET} />}
            />
            <Route
              path="dashboard"
              element={<AppSwitch currentScreen={ScreenType.DASHBOARD} />}
            />
            <Route
              path="review"
              element={<AppSwitch currentScreen={ScreenType.REVIEW} />}
            />
            <Route
              path="review/:misconceptionId/activities"
              element={<AppSwitch currentScreen={ScreenType.CHOOSE_ACTIVITY} />}
            />
            <Route
              path="activity/:activityId"
              element={<AppSwitch currentScreen={ScreenType.ACTIVITY_DETAIL} />}
            />
            <Route
              path="upload-rtd/*"
              element={<AppSwitch currentScreen={ScreenType.UPLOAD_RTD} />}
            />
            <Route
              path="reflect"
              element={<AppSwitch currentScreen={ScreenType.REFLECT} />}
            />
            <Route
              path="profile"
              element={<AppSwitch currentScreen={ScreenType.PROFILE} />}
            />
            <Route
              path="profile/password"
              element={<AppSwitch currentScreen={ScreenType.CHANGE_PASSWORD} />}
            />
            <Route
              path="myplan"
              element={<AppSwitch currentScreen={ScreenType.MY_PLAN} />}
            />
        </Route>,
      ),
    );
  }, [apiClients]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Theme}>
          <CssBaseline />
          {/*
            i18n no longer suspends (see src/i18n.tsx) — Landing renders its own
            skeleton off `ready` from useTranslation() instead. APIClients.create
            does no I/O, so the null branch lasts a single frame; rendering
            nothing there beats a spinner that flashes for one paint.
          */}
          {router && (
            <RouterProvider router={router} />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
