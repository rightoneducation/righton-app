import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { ApiClient, Environment } from '@righton/networking';
import GameSessionContainer from './containers/GameSessionContainer';
import Theme from './lib/Theme';

function RedirectToPlayIfMissing() {
  window.location.href = 'http://dev-central.rightoneducation.com/';
  return null;
}

const apiClient = new ApiClient(Environment.Developing);
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<GameSessionContainer apiClient={apiClient} />}
      />
      <Route element={<RedirectToPlayIfMissing />} />
    </>,
  ),
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