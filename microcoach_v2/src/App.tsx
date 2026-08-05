import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Modal from 'react-modal';
import { APIClients, AppType, Environment } from './api';
import Theme from './lib/Theme';
import { GOOGLE_OAUTH_CLIENT_ID, ScreenType } from './lib/MicroCoachModels';
import { useAPIClients } from './hooks/useAPIClients';
import { APIClientsContext } from './lib/context/APIClientsContext';
import { MicroCoachDataProvider } from './lib/context/MicroCoachDataContext';
import { useAPIClientsContext } from './hooks/context/useAPIClientsContext';
import { useAuthResolver } from './hooks/useMicroCoachDataActions';
import AppSwitch from './switches/AppSwitch';

/**
 * Parent layout route. React Router keeps this element mounted across child
 * route changes, so the auth resolver's mount effect fires exactly once per
 * session rather than re-flashing the loading state on every navigation.
 *
 * It has to live here rather than in MicroCoachDataProvider: the resolver needs
 * both the reducer's dispatch (so it must be *under* that provider) and
 * useNavigate (so it must be *inside* the router).
 */
// react-modal needs to know the app root so it can mark it aria-hidden while a
// modal is open. Without this it warns and leaves the background readable by
// screen readers — the other apps in the monorepo skip it.
Modal.setAppElement('#root');

function RootLayout() {
  const apiClients = useAPIClientsContext();
  useAuthResolver(apiClients as APIClients);
  return <Outlet />;
}

// The router knows URLs only. AppSwitch turns a ScreenType into a page wrapped
// in AuthGuard and AppContainer (central_v2's arrangement).
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AppSwitch currentScreen={ScreenType.LANDING} />,
      },
      {
        path: 'login',
        element: <AppSwitch currentScreen={ScreenType.LOGIN} />,
      },
      {
        path: 'signup',
        element: <AppSwitch currentScreen={ScreenType.SIGNUP} />,
      },
      {
        path: 'confirmation',
        element: <AppSwitch currentScreen={ScreenType.CONFIRMATION} />,
      },
      {
        path: 'googlesignup',
        element: <AppSwitch currentScreen={ScreenType.GOOGLESIGNUP} />,
      },
      { path: 'auth', element: <AppSwitch currentScreen={ScreenType.AUTH} /> },
      {
        path: 'password/reset',
        element: <AppSwitch currentScreen={ScreenType.PASSWORDRESET} />,
      },
      {
        path: 'analysis',
        element: <AppSwitch currentScreen={ScreenType.ANALYSIS} />,
      },
      {
        path: 'analysis/:misconceptionId/activities',
        element: <AppSwitch currentScreen={ScreenType.CHOOSE_ACTIVITY} />,
      },
      {
        path: 'activity/:activityId',
        element: <AppSwitch currentScreen={ScreenType.ACTIVITY_DETAIL} />,
      },
      {
        path: 'myplan',
        element: <AppSwitch currentScreen={ScreenType.MY_PLAN} />,
      },
    ],
  },
]);

function App() {
  const { apiClients } = useAPIClients(Environment.Staging, AppType.MICROCOACH);

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
          {apiClients && (
            <APIClientsContext.Provider value={apiClients}>
              <MicroCoachDataProvider>
                <RouterProvider router={router} />
              </MicroCoachDataProvider>
            </APIClientsContext.Provider>
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
