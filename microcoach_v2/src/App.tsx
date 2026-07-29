import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { APIClients, AppType, Environment } from './api';
import Theme from './lib/Theme';
import { GOOGLE_OAUTH_CLIENT_ID } from './lib/MicroCoachModels';
import { useAPIClients } from './hooks/useAPIClients';
import { APIClientsContext } from './lib/context/APIClientsContext';
import { MicroCoachDataProvider } from './lib/context/MicroCoachDataContext';
import { useAPIClientsContext } from './hooks/context/useAPIClientsContext';
import { useMicroCoachDataActions } from './hooks/useMicroCoachDataActions';
import AuthGuard from './containers/AuthGuard';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Confirmation from './pages/Confirmation';
import GoogleSignup from './pages/GoogleSignup';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';

// Shared by the pre-auth branch and the i18n Suspense boundary below.
function LoadingScreen() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'designSystem.background.cream',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

// Root layout: runs the on-load auth resolver once and guards the routes.
function AuthLayout() {
  const apiClients = useAPIClientsContext();
  const { handleLogOut } = useMicroCoachDataActions(apiClients as APIClients);
  return (
    <AuthGuard handleLogOut={handleLogOut}>
      <Outlet />
    </AuthGuard>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
      { path: 'confirmation', element: <Confirmation /> },
      { path: 'googlesignup', element: <GoogleSignup /> },
      { path: 'auth', element: <AuthCallback /> },
      { path: 'password/reset', element: <ResetPassword /> },
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
          {apiClients ? (
            <APIClientsContext.Provider value={apiClients}>
              <MicroCoachDataProvider>
                {/*
                  Landing is the index route and calls useTranslation() at the
                  top of the tree, so react-i18next suspends on a cold load
                  while /locales/{lng}/translation.json is in flight. React 18
                  throws without a boundary here.
                */}
                <Suspense fallback={<LoadingScreen />}>
                  <RouterProvider router={router} />
                </Suspense>
              </MicroCoachDataProvider>
            </APIClientsContext.Provider>
          ) : (
            // Anything rendered here is outside the router, so it must not use
            // router hooks or Links.
            <LoadingScreen />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
