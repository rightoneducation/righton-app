import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useMatch
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import {APIClients, Environment, AppType} from '@righton/networking';
import LaunchWrapper from './containers/Launcher/LaunchWrapper';
import GameSessionWrapper from './containers/GameSession/GameSessionWrapper';
import Theme from './lib/Theme';

function App() {
  const apiClients = new APIClients(Environment.Developing, AppType.HOST);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/new/:gameId" element={<LaunchWrapper apiClients={apiClients}/>} />
        <Route path="/host/:gameSessionId" element={<GameSessionWrapper apiClients={apiClients}/>} />
      </>
    ));

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={Theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
