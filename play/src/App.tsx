import React, { useMemo, useState } from 'react';
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

function RedirectToPlayIfMissing() {
  window.location.href = 'http://play.rightoneducation.com/';
  return null;
}

function App() {
  const { apiClients, loading } = useAPIClients(Environment.Developing, AppType.PLAY);
  // this will get initialized in the pregame flow, as it needs a teamId prior to init
  const [eduDataAPIClient, setEduDataAPIClient] = useState<IEduDataAPIClient | null>(null);
  

  const router = useMemo(() => {
    if (!apiClients) return null;
    return createBrowserRouter(
      createRoutesFromElements(
        <>
          <Route
            path="/"
            element={<PregameContainer apiClients={apiClients} setEduDataAPIClient={setEduDataAPIClient} />}
            loader={PregameLocalModelLoader}
          />
          <Route
            path="/game"
            element={<GameInProgressContainer apiClients={apiClients} eduDataAPIClient={eduDataAPIClient}/>}
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
