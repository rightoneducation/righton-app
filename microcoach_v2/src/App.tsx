import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
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
                <RouterProvider router={router} />
              </MicroCoachDataProvider>
            </APIClientsContext.Provider>
          ) : (
            <Landing />
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
