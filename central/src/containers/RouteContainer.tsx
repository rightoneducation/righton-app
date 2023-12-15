import React, { useEffect, useState } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { Auth } from 'aws-amplify';
import { 
  ApiClient,
  IGameTemplate,
  IQuestionTemplate,
  CreateQuestionTemplateInput
 } from '@righton/networking';
import {Alert} from '../context/AlertContext';
import { Game, Questions } from '../API';
import { fetchGames, sortGames, createGame, updateGame, cloneGame, deleteGames, deleteQuestions } from '../lib/games';
import { updateQuestion, cloneQuestion } from '../lib/questions';
import { SORT_TYPES } from '../lib/sorting';
import {useMediaQuery} from '../hooks/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import AlertBar from '../components/AlertBar';
import Nav from '../components/Nav';
import Games from '../components/Games';
import GamesFooter from '../components/GamesFooter';
import SignUp from '../components/auth/SignUp';
import LogIn from '../components/auth/LogIn';
import Confirmation from '../components/auth/Confirmation';
import OnboardingModal from '../components/OnboardingModal';

type RouteContainerProps = {
  apiClient: ApiClient;
  setAlert: (alert: Alert) => void;
};

export const RouteContainer = ({
   apiClient,
   setAlert
  }: RouteContainerProps ) => {
  const [startup, setStartup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState(SORT_TYPES.UPDATED);
  const [searchInput, setSearchInput] = useState('');
  const [games, setGames] = useState<(IGameTemplate[] | null)>([]);
  const [questions, setQuestions] = useState<(IQuestionTemplate[] | null)>([]);
  const [isAuthenticated, setLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isUserAuth, setIsUserAuth] = useState(false);
  const [modalOpen, setModalOpen] = useState(checkUserPlayed()); 
  const [showModalGetApp, setShowModalGetApp] = useState(false);
  const [prevTokens, setPrevTokens] = useState<(string | null)[]>([null]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const location = useLocation();
  const history = useHistory();
  const queryLimit = 8; // number of games retreiived on main page

  const getSortedGames = async (nextToken: string | null) => {
    try { 
      const games = await apiClient.listGameTemplates(queryLimit, nextToken);
      if (games?.gameTemplates){
        setGames(games?.gameTemplates ?? null);
        setNextToken(games?.nextToken ?? null);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const getQuestions = async (nextToken: string | null) => {
    try {
      const questions = await apiClient.listQuestionTemplates(queryLimit, nextToken);
      if (questions?.questionTemplates){
        setQuestions(questions?.questionTemplates ?? null);
        setNextToken(questions?.nextToken ?? null);
        return questions;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleNextPage = async (nextToken: string | null) => {
    if (location.pathname === '/'){
      const games = await apiClient.listGameTemplates( queryLimit, nextToken);
      if (games?.gameTemplates){
        setGames(games?.gameTemplates ?? null);
        nextToken = games?.nextToken ?? null;
        //console.log(nextToken);
      }
  
    } else {
      const questions = await apiClient.listQuestionTemplates( queryLimit, nextToken);
      if (questions?.questionTemplates){
        setQuestions(questions?.questionTemplates ?? null);
        nextToken = questions?.nextToken ?? null;
        //console.log(nextToken);
      }
    }
    setPrevTokens((prev) => [...prev, nextToken]);
    setNextToken(nextToken);
  }

  const handlePrevPage = async (prevTokens: (string | null)[]) => {
    const prevToken = prevTokens[prevTokens.length - 2];
    const nextToken = prevTokens[prevTokens.length-1];
    if (location.pathname === '/'){
      const games = await apiClient.listGameTemplates(queryLimit, prevToken);
      if (games?.gameTemplates){
        setGames(games?.gameTemplates ?? null);
      }
    } else {
      const questions = await apiClient.listQuestionTemplates( queryLimit, nextToken);
      if (questions?.questionTemplates){
        setQuestions(questions?.questionTemplates ?? null);

      }
    }
    setPrevTokens((prev) => prev.slice(0, -1));
    setNextToken(nextToken);

  }
  
  //   const cloneQuestion = async (questionInput: CreateQuestionTemplateInput) => {
  const cloneQuestion = async (questionInput: CreateQuestionTemplateInput) => {
    try{
    const question = await apiClient.createQuestionTemplate(questionInput);
    } catch (e) {
      console.log(e);
    }
  }

  const addQToGT = async (gameId: string, questionId: string) => {
    try{
      const game = await apiClient.createGameQuestions(uuidv4(), '5561', 'f98648a9-84e4-48b0-8ffa-5e5dfcb8a752');
    }
    catch (e) {
      console.log(e);
    }
  }

  // Update newGame parameter to include other aspects (or like saveGame below have it equal a Game object if that is possible) and possibly add the createGameQuestio here with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
  const saveNewGame = async (newGame: { title: string, description?: string, phaseOneTime?: string, phaseTwoTime?: string, grade?: string, domain?: string, cluster?: string, standard?: string }, questionIDSet: number[]) => {
    setLoading(true);
    const game = await createGame(newGame, questionIDSet);
    if (game) {
      const games = sortGames(await fetchGames(), sortType);
      // setGames(games);
    }
    setLoading(false);
    setAlert({ message: 'Game created.', type: 'success' });
  }

  // Update saveGame let statement to include other attributes of game that have now been created and possibly add the createGameQuestion here (if functionaloity is not in updateGame) with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
  const saveGame = async (game: Game, questions: Questions) => {
    let updatedGame = {
      id: game.id,
      title: game.title,
      description: game.description,
      phaseOneTime: game.phaseOneTime,
      phaseTwoTime: game.phaseTwoTime,
      imageUrl: game.imageUrl,
      grade: game.grade,
      domain: game.domain,
      cluster: game.cluster,
      standard: game.standard,
      questions: questions,
    }
    const result = await updateGame(updatedGame);
    if (result) {
      getSortedGames(nextToken);
    }
    setAlert({ message: 'Game saved.', type: 'success' });
  }

  const handleQuestionBankClick = (gameDetails: any) => {
    getQuestions(null);
    history.push(`/gamemaker/${gameDetails.id}/addquestion`)
  }

  // @ts-ignore
  const handleCloneGame = async (game) => {
    const result = await cloneGame(game);
    if (result) {
      getSortedGames(nextToken);
      setAlert({ message: 'Game cloned.', type: 'success' });
    }
    return result
  }

  const handleDeleteGame = async (id: number) => {
    const result = await deleteGames(id);
    if (result) {
      const games = sortGames(await fetchGames(), sortType);
      // setGames(games);
    }
    setAlert({ message: 'Game deleted.', type: 'success' });
  }

  const handleDeleteQuestion = async (id: number, game: Game) => {
    const result = await deleteQuestions(id)
    if (result) {
      getSortedGames(nextToken)
    }
    setAlert({ message: 'Question deleted.', type: 'success' });
  }

  const handleUserAuth = (isAuth: boolean) => {
    setIsUserAuth(isAuth);
  }

  const persistUserAuth = (async () => {
    let user = null;
    try {
      user = await Auth.currentAuthenticatedUser();
      let userSession = await Auth.userSession(user);
      if (userSession) {
        setIsUserAuth(true);
      }
    } catch (e) {
      setIsUserAuth(false);
    }
  });

  const getGames = async () => {
    setLoading(true);
    await getSortedGames(nextToken);
    setLoading(false);
  };

  const isResolutionMobile = useMediaQuery("(max-width: 760px)");

  const handleSearchClick = (isClick: boolean) => {
    setIsSearchClick(isClick);
  }

  const handleModalClose =(modalOpen: boolean) =>{ 
    localStorage.setItem('userPlayedBefore', 'true');
    setModalOpen(modalOpen);
  };

  const handleModalOpen = (modalOpen:boolean, showModalGetApp:boolean) => {
    localStorage.setItem('userPlayedBefore', 'false');
    setShowModalGetApp(showModalGetApp);
    setModalOpen(modalOpen);
  }

  function checkUserPlayed(): boolean {
    if (localStorage.getItem('userPlayedBefore') === 'true')
      return false;
    else 
      return true;
  };

  const filterGame = (game: IGameTemplate | null, search: string) => {
    if (!game || !game?.title) {
      return false;
    }
    if (game.title.toLowerCase().indexOf(search) > -1 || (game.description && game.description.toLowerCase().indexOf(search) > -1)) {
      return true;
    }
    else {
      // if (game?.questions) {
      //   for (let i = 0; i < game.questions.length; i++) {
      //     let questionText = game.questions[i]?.text;
      //     if (questionText !== undefined && questionText.toLowerCase().indexOf(search) > -1) {
      //       return true;
      //     }
      //   }
      // }
      return false;
    }
  };

  useEffect(() => {
    persistUserAuth();
    getGames();
    setStartup(false);
  }, [sortType]);


  // useEffect(() => {
  //   // get either a list of games or questions when the route changes
  //   const fetchData = async () => {
  //     setNextToken(null);
  //     setPrevTokens([null]);
  //     setLoading(true);
  //     if (location.pathname === '/questions'){
  //       await getSortedGames(null);
  //     } else {
  //       await getQuestions(null);
  //     }
  //     setLoading(false);
  //   };

  //   if (location.pathname === '/questions' || location.pathname === '/') 
  //     fetchData();
  // }, [location]);

  if (startup) return null;

  const filteredGames = games?.filter((game: IGameTemplate | null) => filterGame(game, searchInput.toLowerCase())) as IGameTemplate[];

  const alertContext = {
    alert,
    setAlert,
  };

  return (
    <Switch>
    <Route path="/login">
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <LogIn handleUserAuth={handleUserAuth} />
    </Route>

    <Route path="/signup">
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <SignUp />
    </Route>

    <Route path="/confirmation">
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <Confirmation />
    </Route>

    <Route>
      <OnboardingModal modalOpen={modalOpen} showModalGetApp={showModalGetApp} handleModalClose={handleModalClose} />
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <Games loading={loading} games={filteredGames} questions={questions} saveNewGame={saveNewGame} saveGame={saveGame} updateQuestion={updateQuestion} deleteQuestion={handleDeleteQuestion} deleteGame={handleDeleteGame} cloneGame={handleCloneGame} sortType={sortType} setSortType={setSortType} cloneQuestion={cloneQuestion} isUserAuth={isUserAuth}  isSearchClick={isSearchClick} handleSearchClick={handleSearchClick} setSearchInput={setSearchInput} searchInput={searchInput} isResolutionMobile={isResolutionMobile} addQToGT={addQToGT} handleQuestionBankClick={handleQuestionBankClick} />
      <GamesFooter nextToken={nextToken} prevTokens={prevTokens} handleNextPage={handleNextPage} handlePrevPage={handlePrevPage}></GamesFooter>
      <AlertBar />
    </Route>
  </Switch>
  )    
};