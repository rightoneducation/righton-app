import React, { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
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
    Environment.Staging,
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
            <Route
              path="/"
              element={<AppSwitch currentScreen={ScreenType.GAMES} />}
            />
            <Route
              path="/questions"
              element={<AppSwitch currentScreen={ScreenType.QUESTIONS} />}
            />
            <Route
              path="/signup"
              element={<AppSwitch currentScreen={ScreenType.SIGNUP} />}
            />
            <Route
              path="/login"
              element={<AppSwitch currentScreen={ScreenType.LOGIN} />}
            />
            <Route
              path="/create/game"
              element={<AppSwitch currentScreen={ScreenType.CREATEGAME} />}
            />
            <Route
              path="/clone/game/:type/:gameId"
              element={<AppSwitch currentScreen={ScreenType.CLONEGAME} />}
            />
            <Route
              path="/edit/game/:type/:gameId"
              element={<AppSwitch currentScreen={ScreenType.EDITGAME} />}
            />
            <Route
              path="/games/:type/:gameId"
              element={<AppSwitch currentScreen={ScreenType.VIEWGAME} />}
            />
            <Route
              path="/library/games/:type/:gameId"
              element={<AppSwitch currentScreen={ScreenType.VIEWGAME} />}
            />
            <Route
              path="/create/question"
              element={<AppSwitch currentScreen={ScreenType.CREATEQUESTION} />}
              loader={CreateQuestionLoader}
            />
            <Route
              path="/clone/question/:type/:questionId"
              element={<AppSwitch currentScreen={ScreenType.CLONEQUESTION} />}
            />
            <Route
              path="/edit/question/:type/:questionId"
              element={<AppSwitch currentScreen={ScreenType.EDITQUESTION} />}
            />
            <Route
              path="/confirmation"
              element={<AppSwitch currentScreen={ScreenType.CONFIRMATION} />}
            />
            <Route
              path="/nextstep"
              element={<AppSwitch currentScreen={ScreenType.NEXTSTEP} />}
            />
            <Route
              path="/library"
              element={<AppSwitch currentScreen={ScreenType.LIBRARY} />}
            />
            <Route
              path="/userprofile"
              element={<AppSwitch currentScreen={ScreenType.USERPROFILE} />}
            />
            <Route
              path="/auth"
              element={<AppSwitch currentScreen={ScreenType.AUTH} />}
            />
            <Route
              path="/password/reset"
              element={<AppSwitch currentScreen={ScreenType.PASSWORDRESET} />}
            />
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
