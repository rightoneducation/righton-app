import React, { useMemo, useState, useEffect } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { useAPIClients, Environment, AppType, IEduDataAPIClient } from '@righton/networking';
import {
  PregameContainer,
  PregameLocalModelLoader,
} from './containers/PregameContainer';
import {
  GameInProgressContainer,
  LocalModelLoader,
} from './containers/GameInProgressContainer';
import Theme from './lib/Theme';
import AppErrorBoundary from './components/AppErrorBoundary';
import { initConnectionStateTracking, initVisibilityTracking } from './lib/analytics';

function RedirectToPlayIfMissing() {
  window.location.href = 'http://play.rightoneducation.com/';
  return null;
}

function App() {
  const { apiClients, loading } = useAPIClients(Environment.Developing, AppType.PLAY);

  useEffect(() => {
    if (!apiClients) return undefined;
    const unsubscribeConnection = initConnectionStateTracking(apiClients);
    const unsubscribeVisibility = initVisibilityTracking();
    return () => {
      unsubscribeConnection();
      unsubscribeVisibility();
    };
  }, [apiClients]);

  const router = useMemo(() => {
    if (!apiClients) return null;
    return createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route
            path="/"
            element={<PregameContainer apiClients={apiClients} />}
            loader={PregameLocalModelLoader}
          />
          <Route
            path="/game"
            element={<GameInProgressContainer apiClients={apiClients} />}
            loader={LocalModelLoader}
          />
          <Route element={<RedirectToPlayIfMissing />} />
        </>
      )
    );
  }, [apiClients]);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <AppErrorBoundary>
          {router && <RouterProvider router={router} />}
        </AppErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
