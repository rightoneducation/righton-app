import React, { useEffect, useState } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { Auth } from 'aws-amplify';
import { Box } from '@material-ui/core';
import { 
  ApiClient,
  IGameTemplate,
  IQuestionTemplate,
  CreateQuestionTemplateInput,
  getQuestion
 } from '@righton/networking';
import {Alert} from '../context/AlertContext';
import { Game, Questions } from '../API';
import { 
  createGameTemplate, 
  getGameTemplate, 
  updateGameTemplate,
  deleteGameTemplate, 
  listGameTemplates
} from '../lib/API/gametemplates';
import { 
  createQuestionTemplate, 
  getQuestionTemplate, 
  updateQuestionTemplate,
  deleteQuestionTemplate,
  listQuestionTemplates
} from '../lib/API/questiontemplates';
import { fetchGames, sortGames, createGame, updateGame, cloneGame, deleteGames, deleteQuestions } from '../lib/games';
import { updateQuestion, cloneQuestion } from '../lib/questions';
import { SORT_TYPES } from '../lib/sorting';
import {useMediaQuery} from '../hooks/useMediaQuery';
import { v4 as uuidv4 } from 'uuid';
import AlertBar from '../components/AlertBar';
import Nav from '../components/Nav';
import Games from '../components/Games';
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
  const [games, setGames] = useState<(IGameTemplate[])>([]);
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
  const queryLimit = 12; // number of games retreiived on main page

  const getAllGameTemplates = async (nextToken: string | null) => {
    try { 
      const games = await listGameTemplates(queryLimit, nextToken);
      if (games?.gameTemplates){
        setGames(games?.gameTemplates);
        setNextToken(games?.nextToken ?? null);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const getQuestionTemplates = async (nextToken: string | null) => {
    try {
      const questions = await listQuestionTemplates(queryLimit, nextToken);
      if (questions?.questionTemplates){
        setQuestions(questions?.questionTemplates ?? null);
        setNextToken(questions?.nextToken ?? null);
        return questions;
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleScrollDown = async (nextToken: string | null) => {
    let currentToken = nextToken;
    if (location.pathname === '/'){
      const games = await listGameTemplates(queryLimit, nextToken);
      if (games?.gameTemplates){
        setGames((prev) => [
          ...(prev ?? []),
          ...(games?.gameTemplates ?? [])
        ]);
        nextToken = games?.nextToken ?? null;
      }
  
    } else {
      const questions = await listQuestionTemplates(queryLimit, nextToken);
      if (questions?.questionTemplates){
        setQuestions((prev) => [
          ...(prev ?? []),
          ...(questions.questionTemplates ?? [])
        ]);
        nextToken = questions?.nextToken ?? null;
      }
    }
    if (nextToken) {
      setPrevTokens((prev) => [...prev, currentToken]);
    }  
    setNextToken((prev) => nextToken);
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
  const createNewGameTemplate = async (newGame: { owner: string, version: number, title: string, description: string, phaseOneTime?: number, phaseTwoTime?: number, grade?: string, domain?: string, cluster?: string, standard?: string }, questionIDSet: number[]) => {
    setLoading(true);
    try{
    const game = await createGameTemplate(newGame);
      if (game) {
        // ~~~~ add questions to game ~~~~~~ using , questionIDSet

        const games = await getAllGameTemplates(nextToken);
      } else {
        throw new Error ('Game was unable to be created');
      }
      setLoading(false);
      setAlert({ message: 'Game created.', type: 'success' });
    } catch (e) {
      console.log(e);
    }

  }


    // update existing game template with changes from game maker
    const editGameTemplate = async (newGame: { id: string, owner: string, version: number, title: string, description: string, phaseOneTime?: number, phaseTwoTime?: number, grade?: string, domain?: string, cluster?: string, standard?: string, questionTemplates?: IQuestionTemplate[] }, questionIDSet: number[]) => {
      setLoading(true);
      try{
        console.log(newGame);
      const {questionTemplates, ...rest} = newGame;
      const gameTemplateUpdate = rest; 
      const questionTemplatesUpdate = questionTemplates;
      const game = await updateGameTemplate(gameTemplateUpdate);
        if (game) {
          // ~~~~ add questions to game ~~~~~~ using , questionIDSet
  
          const games = await getAllGameTemplates(nextToken);
        } else {
          throw new Error ('Game was unable to be created');
        }
        setLoading(false);
        setAlert({ message: 'Game updated.', type: 'success' });
      } catch (e) {
        console.log(e);
      }
  
    }

  const handleQuestionBankClick = (gameDetails: any) => {
    getQuestionTemplates(null);
    history.push(`/gamemaker/${gameDetails.id}/addquestion`)
  }

  // @ts-ignore
  const cloneGameTemplate = async (game) => {
    const {questionTemplates, ...rest} = game;
    const questionTemplatesUpdate = questionTemplates;
    const newGameTemplate = { ...rest, id: uuidv4(), title: `Clone of ${game.title}`};
    const result = await createGameTemplate(newGameTemplate);
    if (result) {
      getAllGameTemplates(nextToken);
      setAlert({ message: 'Game cloned.', type: 'success' });
    }
    return result
  }

  const handleDeleteGameTemplate = async (id: string) => {
    const result = await deleteGameTemplate(id);
    if (result) {
      const games = await getAllGameTemplates(nextToken);
    }
    setAlert({ message: 'Game deleted.', type: 'success' });
  }

  const handleDeleteQuestionTemplate = async (id: string, game: Game) => {
    const result = await deleteQuestionTemplate(id);
    console.log(result);
    if (result) {
      getQuestionTemplates(nextToken)
    }
    setAlert({ message: 'Question deleted.', type: 'success' });
  }

  const handleCreateQuestionTemplate = async ( question: IQuestionTemplate) => {
    try {
      const result = await createQuestionTemplate(question);
      if (result) {
        getQuestionTemplates(null);
      }
      setAlert({ message: 'Question created.', type: 'success' });
      return result;
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  // update existing question template from question template bank
  const handleUpdateQuestionTemplate = async (newQuestion : IQuestionTemplate) => {
    setLoading(true);
    try{
      const {gameTemplates, ...rest} = newQuestion;
      const questionTemplateUpdate = rest; 
      const gameTemplatesUpdate = gameTemplates;
      const question = await updateQuestionTemplate(questionTemplateUpdate);
        if (question) {
          // ~~~~ add questions to game ~~~~~~ using , questionIDSet
  
          const question = await getQuestionTemplates(nextToken);
        } else {
          throw new Error ('Question was unable to be update');
        }
        setLoading(false);
        setAlert({ message: 'Question updated.', type: 'success' });
      } catch (e) {
        console.log(e);
      }
  }

  const handleCloneQuestionTemplate = async (question : IQuestionTemplate) => {
    const {gameTemplates, ...rest} = question;
    const gameTemplatesUpdate = gameTemplates;
    const newQuestionTemplate = { ...rest, id: uuidv4(), title: `Clone of ${question.title}`};
    const result = await createQuestionTemplate(newQuestionTemplate);
    if (result) {
      getAllGameTemplates(nextToken);
      setAlert({ message: 'Question cloned.', type: 'success' });
    }
    return result
  }

  const handleDeleteGameQuestion = async (id: string) => {
    // const result = await deleteQuestionTemplate(id);
    // if (result) {
    //   getQuestionTemplates(nextToken)
    // }
    // setAlert({ message: 'Question deleted.', type: 'success' });
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
    await getAllGameTemplates(nextToken);
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
    if (location.pathname === '/questions'){
      getQuestionTemplates(null);
    } else {
      getAllGameTemplates(null);
    }
    setStartup(false);
  }, [sortType]);

  useEffect(() => {
    // get either a list of games or questions when the route changes
    const fetchData = async () => {
      setNextToken(null);
      setPrevTokens([null]);
      setLoading(true);
      if (location.pathname === '/questions'){
        await getQuestionTemplates(null);
      } else {
        await getAllGameTemplates(null);
      }
      setLoading(false);
    };

    if (location.pathname === '/questions' || location.pathname === '/') 
      fetchData();
  }, [location]);

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
      <Box sx={{ height: '100vh' }}>
        <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
        <Games 
          loading={loading} 
          nextToken={nextToken} 
          games={filteredGames} 
          questions={questions} 
          handleScrollDown={handleScrollDown} 
          createNewGameTemplate={createNewGameTemplate} 
          editGameTemplate={editGameTemplate} 
          updateQuestion={updateQuestion} 
          handleDeleteQuestionTemplate={handleDeleteQuestionTemplate} 
          deleteGame={handleDeleteGameTemplate} 
          cloneGameTemplate={cloneGameTemplate} 
          sortType={sortType} 
          setSortType={setSortType} 
          cloneQuestion={cloneQuestion} 
          isUserAuth={isUserAuth}  
          isSearchClick={isSearchClick} 
          handleSearchClick={handleSearchClick} 
          setSearchInput={setSearchInput} 
          searchInput={searchInput} 
          isResolutionMobile={isResolutionMobile} 
          addQToGT={addQToGT} 
          handleQuestionBankClick={handleQuestionBankClick}
          handleCreateQuestionTemplate={handleCreateQuestionTemplate}
          handleUpdateQuestionTemplate={handleUpdateQuestionTemplate}
          handleCloneQuestionTemplate={handleCloneQuestionTemplate}
          handleDeleteGameQuestion={handleDeleteGameQuestion}
        />
      </Box>
      <AlertBar />
    </Route>
  </Switch>
  )    
};