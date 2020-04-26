import React, { useEffect, useCallback, useState } from 'react';
import Amplify from 'aws-amplify';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";
import Box from '@material-ui/core/Box';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Nav from './components/Nav';
import Games from './components/Games';
// use local storage instead of mock
import awsconfig from './aws-exports';
import { fetchGames } from './lib/games';

Amplify.configure(awsconfig);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#307583',
    },
    secondary: {
      main: '#8e2e9d',
    },
  },
});

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchGames(setGames);
  }, []);

  const saveGame = useCallback((game, gameIndex) => {
    const newGames = [...games];
    newGames[Number(gameIndex)] = game;
    setGames(newGames);
  }, [games, setGames]);

  const saveQuestion = useCallback((question, gameIndex, questionIndex) => {
    const newGames = [...games];
    const game = { ...games[Number(gameIndex)] };
    game[`q${Number(questionIndex)}`] = question;
    newGames[Number(gameIndex)] = game;
    setGames(newGames);
  }, [games, setGames]);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box>
          <Nav />
          <Route path="/">
            <Games games={games} saveGame={saveGame} saveQuestion={saveQuestion} />
          </Route>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
