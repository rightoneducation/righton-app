import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useMatch
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import {useAPIClients, Environment, AppType, APIClients} from '@righton/networking';
import LaunchWrapper from './containers/Launcher/LaunchWrapper';
import GameSessionWrapper from './containers/GameSession/GameSessionWrapper';
import Theme from './lib/Theme';

function RedirectToCentralIfMissing() {
  // window.location.href = 'http://central.rightoneducation.com/';
  return null;
}

function App() {
  const { apiClients, loading } = useAPIClients(Environment.Developing, AppType.HOST);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        { apiClients && 
          <>
            <Route path="/new/:publicPrivate/:gameId" element={<LaunchWrapper apiClients={apiClients} />}/>
            <Route path="/host/:gameSessionId" element={<GameSessionWrapper apiClients={apiClients} />}/>
          </>
        }
        <Route path="*" element={<RedirectToCentralIfMissing />} />
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