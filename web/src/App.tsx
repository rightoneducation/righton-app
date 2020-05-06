import React, { useEffect, useState } from 'react';
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
import { fetchGames, createGame, updateGame } from './lib/games';
import { Game } from './types';

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
  const [startup, setStartup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<(Game | null)[]>([]);

  const getGames = async () => {
    setLoading(true);
    const games = await fetchGames();
    setGames(games);
    setLoading(false);
  };

  const saveNewGame = async (newGame: { title: string, description?: string }) => {
    setLoading(true);
    const game = await createGame(newGame);
    if (game) {
      const games = await fetchGames();
      setGames(games);
    }
    setLoading(false);
  }

  const saveGame = async (game: Game) => {
    setLoading(true);
    const result = await updateGame(game);
    if (result) {
      const games = await fetchGames();
      setGames(games);
    }
    setLoading(false);
  }

  useEffect(() => {
    getGames();
    setStartup(false);
  }, []);

  // @ts-ignore
  const handleSaveQuestion = async (question, gameIndex, questionIndex) => {
    const game = { ...games[Number(gameIndex)] };
    // @ts-ignore TODO: change how this is passed around
    game[`q${Number(questionIndex)}`] = question;
    // @ts-ignore
    saveGame(game);
  };

  if (startup) return null;

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box>
          <Nav />
          <Route path="/">
            <Games loading={loading} games={games} saveNewGame={saveNewGame} saveGame={saveGame} saveQuestion={handleSaveQuestion} />
          </Route>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
