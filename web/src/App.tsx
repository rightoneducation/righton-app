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
import awsconfig from './aws-exports';
import { fetchGames, sortGames, createGame, updateGame, duplicateGame, deleteGame, SORT_TYPES } from './lib/games';
import { Game } from './types';

const filterGame = (game: Game | null, search: string) => {
  if (game && game.title.toLowerCase().indexOf(search) > -1) return true;
  return false;
};

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
  const [sortType, setSortType] = useState(SORT_TYPES.UPDATED);
  const [searchInput, setSearchInput] = useState('');
  const [games, setGames] = useState<(Game | null)[]>([]);

  const saveNewGame = async (newGame: { title: string, description?: string }) => {
    setLoading(true);
    const game = await createGame(newGame);
    if (game) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
    setLoading(false);
  }

  const saveGame = async (game: Game) => {
    const result = await updateGame(game);
    if (result) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
  }

  const handleDeleteGame = async (id: number) => {
    const result = await deleteGame(id);
    if (result) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
  }

  // @ts-ignore
  const handleDuplicateGame = async (game) => {
    const result = await duplicateGame(game);
    if (result) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
  }

  useEffect(() => {
    const getGames = async () => {
      setLoading(true);
      const games = sortGames(await fetchGames(), SORT_TYPES.UPDATED);
      setGames(games);
      setLoading(false);
    };
    getGames();
    setStartup(false);
  }, []);

  useEffect(() => {
    // @ts-ignore
    setGames(sortGames(games, sortType));
    // eslint-disable-next-line
  }, [sortType]);

  // @ts-ignore
  const handleSaveQuestion = async (question, gameIndex, questionIndex) => {
    const game = { ...games[Number(gameIndex)] };
    // @ts-ignore TODO: change how this is passed around
    game[`q${Number(questionIndex)}`] = question;
    // @ts-ignore
    saveGame(game);
  };

  if (startup) return null;

  const filteredGames = games.filter((game: Game | null) => filterGame(game, searchInput.toLowerCase())) as Game[];

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Box>
          <Nav />
          <Route path="/">
            <Games loading={loading} games={filteredGames} saveNewGame={saveNewGame} saveGame={saveGame} saveQuestion={handleSaveQuestion} setSearchInput={setSearchInput} searchInput={searchInput} deleteGame={handleDeleteGame} duplicateGame={handleDuplicateGame} sortType={sortType} setSortType={setSortType} />
          </Route>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
