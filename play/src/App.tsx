import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { APIClients, Environment, AppType } from '@righton/networking';
import {
  PregameContainer,
  PregameLocalModelLoader,
} from './containers/PregameContainer';
import {
  GameInProgressContainer,
  LocalModelLoader,
} from './containers/GameInProgressContainer';
import Theme from './lib/Theme';

function RedirectToPlayIfMissing() {
  window.location.href = 'http://play.rightoneducation.com/';
  return null;
}

const apiClients = new APIClients(Environment.Developing, AppType.PLAY);
const router = createBrowserRouter(
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

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
