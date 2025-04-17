import React, { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useAPIClients, Environment, AppType } from '@righton/networking';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { APIClientsContext } from './lib/context/APIClientsContext';
import Theme from './lib/Theme';
import AppSwitch from './switches/AppSwitch';
import CreateQuestionLoader from './loaders/CreateQuestionLoader';
import { CentralDataProvider } from './lib/context/CentralDataContext';
import { ScreenType } from './lib/CentralModels';

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
            <Route path="/" element={<AppSwitch currentScreen={ScreenType.GAMES} />} />
            <Route path="/questions" element={<AppSwitch currentScreen={ScreenType.QUESTIONS} />} />
            <Route path="/signup" element={<AppSwitch currentScreen={ScreenType.SIGNUP} />} />
            <Route path="/login" element={<AppSwitch currentScreen={ScreenType.LOGIN} />} />
            <Route path="/create/game" element={<AppSwitch currentScreen={ScreenType.CREATEGAME} />} />
            <Route path="/create/question" element={<AppSwitch currentScreen={ScreenType.CREATEQUESTION} />} loader={CreateQuestionLoader}/>
            <Route path="/confirmation" element={<AppSwitch currentScreen={ScreenType.CONFIRMATION} />} />
            <Route path="/nextstep" element={<AppSwitch currentScreen={ScreenType.NEXTSTEP} />} />
            <Route path="/library" element={<AppSwitch currentScreen={ScreenType.LIBRARY} />} />
            <Route path="/auth" element={<AppSwitch currentScreen={ScreenType.AUTH} />} />

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
                <CentralDataProvider> 
                  <RouterProvider router={router} />
                </CentralDataProvider>
            </APIClientsContext.Provider>
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
