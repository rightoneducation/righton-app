import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Box from '@material-ui/core/Box';
import {
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import Nav from './components/Nav';
import Games from './components/Games';
import { fetchGames, sortGames, createGame, updateGame, cloneGame, deleteGames, deleteQuestions } from './lib/games';
import { updateQuestion, createQuestion, addQuestion } from './lib/questions';
import { SORT_TYPES } from './lib/sorting';
import AlertContext, { Alert } from './context/AlertContext';
import { Game } from './API';
import AlertBar from './components/AlertBar';
import StatusPageContainer from './components/StatusPageContainer';

import Nav from './components/Nav';
import Games from './components/Games';
import { StartGame } from './host/pages/StartGame';
import Ranking  from './host/pages/Ranking';
import GameInProgress from './host/pages/GameInProgress';

import SignUp from './components/auth/SignUp';
import LogIn from './components/auth/LogIn';
import Confirmation from './components/auth/Confirmation';
import { Auth } from 'aws-amplify';


const filterGame = (game: Game | null, search: string) => {
  if (game && game.title && game.title.toLowerCase().indexOf(search) > -1) return true;
  return false;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#307583',
    },
    secondary: {
      main: '#8e2e9d',
    },
  },
  typography: {
    fontFamily: 'Poppins',
  },
});

function App() {
  const [startup, setStartup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState(SORT_TYPES.UPDATED);
  const [searchInput, setSearchInput] = useState('');
  const [games, setGames] = useState<(Game | null)[]>([]);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isAuthenticated, setLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // Update newGame parameter to include other aspects (or like saveGame below have it equal a Game object if that is possible) and possibly add the createGameQuestio here with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
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
    const games = sortGames(await fetchGames(), sortType);
    setGames(games);
  }

  // Update saveGame let statement to include other attributes of game that have now been created and possibly add the createGameQuestion here (if functionaloity is not in updateGame) with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
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

  const getWhatToDo = (async () => {
    let user = null;
    try {
      user = await Auth.currentAuthenticatedUser();
      //Auth.signOut();
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setUserLoading(false);
    } catch (e) {
      setLoggedIn(false);
      setUserLoading(false);
    }
  });

  const getGames = async () => {
    setLoading(true);
    await getSortedGames();
    setLoading(false);
  };

  useEffect(() => {
    getWhatToDo();
    getGames();
    setStartup(false);
  }, [sortType]);

  // @ts-ignore
  const handleSaveQuestion = async (question, gameId) => {
    // @ts-ignore TODO: change how this is passed around
    let result;
    if (question.id) {
      result = await updateQuestion(question);
      setAlert({ message: 'Question Updated', type: 'success' });
    }
    else {
      // needs to be update to new createQuestion function
      // Jared - will use handleSaveQuestion for Add to Game button
      // Ray - will use new createQuestion function for Add to Game button (pass down as new prop seperate from handleSaveQuestion?)
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
      <ThemeProvider theme={theme}>
        {(isAuthenticated) ? (<Redirect to="/" />) : 
          <Switch>
            <Route path="/login">
              <Nav setSearchInput={setSearchInput} searchInput={searchInput} isUserAuth={false} />
              <LogIn />
            </Route>
            <Route path="/signup">
              <Nav setSearchInput={setSearchInput} searchInput={searchInput} isUserAuth={false} />
              <SignUp />
            </Route>
            <Route path="/confirmation">
              <Nav setSearchInput={setSearchInput} searchInput={searchInput} isUserAuth={false} />
              <Confirmation />
            </Route>
            <Route path="/status/:gameID" component={StatusPageContainer} />
            <Route path="/host">
              <GameInProgress/>
            </Route>
          </Switch>
        }
        {userLoading ? <div>Loading</div> : (isAuthenticated ? (
          <AlertContext.Provider value={alertContext}>
            <Box>
              <Nav setSearchInput={setSearchInput} searchInput={searchInput} isUserAuth={true} />
              <Route path="/">
                <Games loading={loading} games={filteredGames} saveNewGame={saveNewGame} saveGame={saveGame} saveQuestion={handleSaveQuestion} deleteQuestion={handleDeleteQuestion} deleteGame={handleDeleteGame} cloneGame={handleCloneGame} sortType={sortType} setSortType={setSortType} addQuestion={addQuestion} />
              </Route>
            </Box>
            <AlertBar />
          </AlertContext.Provider>
        ) : <Redirect to="/login" />
        )}
        </ThemeProvider>
      </Switch>
    </Router>

  );
}

export default App;
