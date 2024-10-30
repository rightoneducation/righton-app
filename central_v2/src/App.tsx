import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useMatch,
} from 'react-router-dom';
import { useAPIClients, Environment, AppType } from '@righton/networking';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { APIClientsContext } from './lib/context/APIClientsContext';
import Theme from './lib/Theme';
import AppSwitch from './switches/AppSwitch';

function App() {
  const { apiClients, loading } = useAPIClients(
    Environment.Developing,
    AppType.CENTRAL,
  );

  function RedirectToCentralIfMissing() {
    window.location.href = 'http://dev-central.rightoneducation.com/';
    return null;
  }

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {apiClients && (
          <>
            <Route path="/" element={<AppSwitch />} />
            <Route path="/questions" element={<AppSwitch />} />
            <Route path="/signup" element={<AppSwitch />} />
            <Route path="/create/question" element={<AppSwitch />} />
          </>
        )}
        <Route path="*" element={<RedirectToCentralIfMissing />} />
      </>,
    ),
  );

  return (
    <GoogleOAuthProvider clientId="23009502295-0ut6vmh3km13funjo26p409mgmbkeb76.apps.googleusercontent.com">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Theme}>
          {apiClients && (
            <APIClientsContext.Provider value={apiClients}>
              <RouterProvider router={router} />
            </APIClientsContext.Provider>
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
