import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import Box from '@material-ui/core/Box';
import {
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import AlertContext, { Alert } from './context/AlertContext';
import AlertBar from './components/AlertBar';
import Nav from './components/Nav';
import Games from './components/Games';
import { fetchGames, sortGames, createGame, updateGame, cloneGame, deleteGames, deleteQuestions } from './lib/games';
import { updateQuestion, createQuestion, listOfQuestions } from './lib/questions';
import { SORT_TYPES } from './lib/sorting';
import { Game } from './API';
import StatusPageContainer from './components/StatusPageContainer';

const filterGame = (game: Game | null, search: string) => {
  if (game && game.title && game.title.toLowerCase().indexOf(search) > -1) return true;
  return false;
};

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
  const [alert, setAlert] = useState<Alert | null>(null);

  const saveNewGame = async (newGame: { title: string, description?: string }) => {
    setLoading(true);
    const game = await createGame(newGame);
    if (game) {
     const games = sortGames(await fetchGames(), sortType);
     setGames(games);
    }
    setLoading(false);
    setAlert({ message: 'New game created.', type: 'success' });
  }

  const getSortedGames = async () => {
    const games = sortGames(await fetchGames(), SORT_TYPES.UPDATED);
    setGames(games);
  }

  const saveGame = async (game: Game) => {
    let updatedGame = {
      id: game.id,
      title: game.title,
      cluster: game.cluster,
      description: game.description,
      domain: game.domain,
      grade: game.grade,
      standard: game.standard,
    }
    const result = await updateGame(updatedGame);
    if (result) {
      getSortedGames();
    }
    setAlert({ message: 'Game saved.', type: 'success' });
  }

  const handleDeleteGame = async (id: number) => {
    const result = await deleteGames(id);
    
    if (result) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
    setAlert({ message: 'Game deleted.', type: 'success' });
  }

  const handleDeleteQuestion = async (id: number) => {
    const result = await deleteQuestions(id)

    if(result) {
      getSortedGames()
      
    } 
    setAlert({ message: 'Question deleted.', type: 'success' });
  }

  // @ts-ignore
  const handleCloneGame = async (game) => {
    const result = await cloneGame(game);
    if (result) {
      getSortedGames();
      setAlert({ message: 'Game cloned.', type: 'success' });
    }
  }

  useEffect(() => {
    const getGames = async () => {
      setLoading(true);
      await getSortedGames();
      setLoading(false);
    };
    getGames();
    setStartup(false);
    listOfQuestions();
  }, []);

  // @ts-ignore
  const handleSaveQuestion = async (question, gameId) => {
    // @ts-ignore TODO: change how this is passed around
    let result;
    if (question.id) {
      result = await updateQuestion(question);
      setAlert({ message: 'Question Updated', type: 'success' });
    }
    else {
      result = await createQuestion(question, gameId);
      setAlert({ message: 'Question Created', type: 'success' });
    }
    if (result) {
      setLoading(true);
      getSortedGames();
      setLoading(false);
    }
    // @ts-ignore
  };

  if (startup) return null;

  const filteredGames = games.filter((game: Game | null) => filterGame(game, searchInput.toLowerCase())) as Game[];

  const alertContext = {
    alert,
    setAlert,
  };

  return (
    <Router>
      <Switch>
        <Route path="/status/:gameID" component={StatusPageContainer} />
        <ThemeProvider theme={theme}>
          <AlertContext.Provider value={alertContext}>
            <Box>
              <Nav setSearchInput={setSearchInput} searchInput={searchInput} />
              <Route path="/">
                <Games loading={loading} games={filteredGames} saveNewGame={saveNewGame} saveGame={saveGame} saveQuestion={handleSaveQuestion} deleteQuestion={handleDeleteQuestion} deleteGame={handleDeleteGame} cloneGame={handleCloneGame} sortType={sortType} setSortType={setSortType} />
              </Route>
            </Box>
            <AlertBar />
          </AlertContext.Provider>
        </ThemeProvider>
      </ Switch>
    </Router>
  );
}

export default App;
