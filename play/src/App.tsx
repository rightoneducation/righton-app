import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { GameSessionAPIClient, TeamAPIClient, TeamMemberAPIClient, TeamAnswerAPIClient, Environment } from '@righton/networking';
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
  window.location.href = 'http://dev-play.rightoneducation.com/';
  return null;
}

const gameSessionAPIClient = new GameSessionAPIClient(Environment.Developing);
const teamAPIClient = new TeamAPIClient(Environment.Developing);
const teamMemberAPIClient = new TeamMemberAPIClient(Environment.Developing);
const teamAnswerAPIClient = new TeamAnswerAPIClient(Environment.Developing);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<PregameContainer gameSessionAPIClient={gameSessionAPIClient} teamAPIClient={teamAPIClient} teamMemberAPIClient={teamMemberAPIClient} />}
        loader={PregameLocalModelLoader}
      />
      <Route
        path="/game"
        element={<GameInProgressContainer gameSessionAPIClient={gameSessionAPIClient} teamAPIClient={teamAPIClient} teamMemberAPIClient={teamMemberAPIClient} teamAnswerAPIClient={teamAnswerAPIClient} />}
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
