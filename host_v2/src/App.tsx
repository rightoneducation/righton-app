import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'; // change to mui v5 see CSS Injection Order section of https://mui.com/material-ui/guides/interoperability/
import { ApiClient, Environment, GameSessionState, GameSessionParser } from '@righton/networking';
import GameSessionContainer from './containers/GameSessionContainer';
import StartGame from './pages/StartGame'
import Theme from './lib/Theme';
import MockGameSession from './mock/MockGameSession.json';

function RedirectToPlayIfMissing() {
  window.location.href = 'http://dev-central.rightoneducation.com/';
  return null;
}
const mockGameSession = GameSessionParser.gameSessionFromAWSGameSession({
  ...MockGameSession,
  currentState: MockGameSession.currentState as GameSessionState,
});
const handleStartGame = ()=>{
  console.log("test")
}
const apiClient = new ApiClient(Environment.Developing);
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        
        element={<GameSessionContainer apiClient={apiClient} />}
      />
      <Route
        path="/StartGame"
        element={<StartGame teams={mockGameSession.teams ?? []} currentQuestionIndex={mockGameSession.currentQuestionIndex ?? 0} questions={mockGameSession.questions} title={mockGameSession.title ?? ''} gameSessionId={mockGameSession.id} 
        gameCode={mockGameSession.gameCode ?? 1100} currentState={mockGameSession.currentState} handleStartGame={handleStartGame} />}
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
