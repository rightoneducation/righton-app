import {
  IAuthManager,
  AuthManager,
  Environment,
  CreateGameInput,
  IGame,
} from '@righton/networking';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import {
  fetchGames,
  sortGames,
  createGame,
  updateGame,
  cloneGame,
  deleteGames,
  deleteQuestion,
  updateQuestion,
  cloneQuestion,
} from './lib/games';
import { SORT_TYPES } from './lib/sorting';
import AlertContext, { Alert } from './context/AlertContext';
import AlertBar from './components/AlertBar';
import Nav from './components/Nav';
import Games from './components/Games';
import SignUp from './components/auth/SignUp';
import LogIn from './components/auth/LogIn';
import Confirmation from './components/auth/Confirmation';
import OnboardingModal from './components/OnboardingModal';
import { useMediaQuery } from './hooks/useMediaQuery';
import 'swiper/css';
import 'swiper/css/pagination';

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

const filterGame = (game: IGame | null, search: string) => {
  if (!game || !game?.title) {
    return false;
  }
  if (
    game.title.toLowerCase().indexOf(search) > -1 ||
    (game.description && game.description.toLowerCase().indexOf(search) > -1)
  ) {
    return true;
  }
  if (game?.questions) {
    for (let i = 0; i < game.questions.length; i++) {
      const questionText = game.questions[i]?.text;
      if (
        questionText !== undefined &&
        questionText.toLowerCase().indexOf(search) > -1
      ) {
        return true;
      }
    }
  }
  return false;
};

function App() {
  const [startup, setStartup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState(SORT_TYPES.UPDATED);
  const [searchInput, setSearchInput] = useState('');
  const [games, setGames] = useState<(IGame | null)[]>([]);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isAuthenticated, setLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const [modalOpen, setModalOpen] = useState(checkUserPlayed());
  const [showModalGetApp, setShowModalGetApp] = useState(false);

  const authManager: IAuthManager = new AuthManager(Environment.Local);

  const getSortedGames = async () => {
    try {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    } catch (error) {
      console.error(error);
      setGames([]);
    }
  };

  // Update newGame parameter to include other aspects (or like saveGame below have it equal a Game object if that is possible) and possibly add the createGameQuestio here with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
  const saveNewGame = async (newGame: CreateGameInput) => {
    setLoading(true);
    const game = await createGame(newGame);
    if (game) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
    setLoading(false);
    setAlert({ message: 'Game created.', type: 'success' });
  };

  // Update saveGame let statement to include other attributes of game that have now been created and possibly add the createGameQuestion here (if functionaloity is not in updateGame) with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
  const saveGame = async (game: IGame) => {
    const result = await updateGame(game);
    if (result) {
      getSortedGames();
    }
    setAlert({ message: 'Game saved.', type: 'success' });
  };

  // @ts-ignore
  const handleCloneGame = async (game) => {
    const result = await cloneGame(game);
    if (result) {
      getSortedGames();
      setAlert({ message: 'Game cloned.', type: 'success' });
    }
    return result;
  };

  const handleDeleteGame = async (id: string) => {
    const result = await deleteGames(id);
    if (result) {
      const games = sortGames(await fetchGames(), sortType);
      setGames(games);
    }
    setAlert({ message: 'Game deleted.', type: 'success' });
  };

  const handleDeleteQuestion = async (id: string, game: IGame) => {
    await deleteQuestion(id, game);
    getSortedGames();
    setAlert({ message: 'Question deleted.', type: 'success' });
  };

  const handleUserAuth = (isAuth: boolean) => {
    setIsUserAuth(isAuth);
  };

  const persistUserAuth = async () => {
    let user = null;
    try {
      user = await authManager.getCurrentAuthenticatedUser();
      setIsUserAuth(true);
    } catch (e) {
      setIsUserAuth(false);
    }
  };

  const getGames = async () => {
    setLoading(true);
    await getSortedGames();
    setLoading(false);
  };

  const isResolutionMobile = useMediaQuery('(max-width: 760px)');

  const handleSearchClick = (isClick: boolean) => {
    setIsSearchClick(isClick);
  };

  const handleModalClose = (modalOpen: boolean) => {
    localStorage.setItem('userPlayedBefore', 'true');
    setModalOpen(modalOpen);
  };

  const handleModalOpen = (modalOpen: boolean, showModalGetApp: boolean) => {
    localStorage.setItem('userPlayedBefore', 'false');
    setShowModalGetApp(showModalGetApp);
    setModalOpen(modalOpen);
  };

  function checkUserPlayed(): boolean {
    if (localStorage.getItem('userPlayedBefore') === 'true') return false;
    return true;
  }

  useEffect(() => {
    persistUserAuth();
    getGames();
    setStartup(false);
  }, [sortType]);

  if (startup) return null;

  const filteredGames = games.filter((game: IGame | null) =>
    filterGame(game, searchInput.toLowerCase()),
  ) as IGame[];

  const alertContext = {
    alert,
    setAlert,
  };

  return (
    <ThemeProvider theme={theme}>
      <AlertContext.Provider value={alertContext}>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <>
                  <Nav
                    isResolutionMobile={isResolutionMobile}
                    isUserAuth={isUserAuth}
                    handleModalOpen={handleModalOpen}
                  />
                  <LogIn
                    handleUserAuth={handleUserAuth}
                    authManager={authManager}
                  />
                </>
              }
            />

            <Route
              path="/signup"
              element={
                <>
                  <Nav
                    isResolutionMobile={isResolutionMobile}
                    isUserAuth={isUserAuth}
                    handleModalOpen={handleModalOpen}
                  />
                  <SignUp authManager={authManager} />
                </>
              }
            />

            <Route
              path="/confirmation"
              element={
                <>
                  <Nav
                    isResolutionMobile={isResolutionMobile}
                    isUserAuth={isUserAuth}
                    handleModalOpen={handleModalOpen}
                  />
                  <Confirmation authManager={authManager} />
                </>
              }
            />

            <Route
              path="*"
              element={
                <>
                  <OnboardingModal
                    modalOpen={modalOpen}
                    showModalGetApp={showModalGetApp}
                    handleModalClose={handleModalClose}
                  />
                  <Nav
                    isResolutionMobile={isResolutionMobile}
                    isUserAuth={isUserAuth}
                    handleModalOpen={handleModalOpen}
                  />
                  <Games
                    loading={loading}
                    games={filteredGames}
                    saveNewGame={saveNewGame}
                    saveGame={saveGame}
                    updateQuestion={updateQuestion}
                    deleteQuestion={handleDeleteQuestion}
                    deleteGame={handleDeleteGame}
                    cloneGame={handleCloneGame}
                    setSortType={setSortType}
                    cloneQuestion={cloneQuestion}
                    isUserAuth={isUserAuth}
                    isSearchClick={isSearchClick}
                    handleSearchClick={handleSearchClick}
                    setSearchInput={setSearchInput}
                    searchInput={searchInput}
                    isResolutionMobile={isResolutionMobile}
                  />
                  <AlertBar />
                </>
              }
            />
          </Routes>
        </Router>
      </AlertContext.Provider>
    </ThemeProvider>
  );
}

export default App;
