import React, { useEffect, useState, useCallback } from 'react';
import {
  Route,
  Switch,
  useHistory,
  useLocation
} from "react-router-dom";
import { Box } from '@material-ui/core';
import {debounce, set} from 'lodash';
import { 
  IAPIClients,
  IGameTemplate,
  IQuestionTemplate,
  CreateGameTemplateInput,
  CreateQuestionTemplateInput,
  isNullOrUndefined
 } from '@righton/networking';
import {Alert} from '../context/AlertContext';
import { Game } from '../API';
import { 
  getGameTemplate,
  createGameTemplate, 
  updateGameTemplate,
  deleteGameTemplate, 
  listGameTemplates
} from '../lib/API/GameTemplates';
import { 
  getQuestionTemplate,
  createQuestionTemplate, 
  updateQuestionTemplate,
  deleteQuestionTemplate,
  listQuestionTemplates
} from '../lib/API/QuestionTemplates';
import {
  createGameQuestions,
  getGameQuestions,
  deleteGameQuestions
} from '../lib/API/GameQuestions';
import { IListQuerySettings, SortDirection, SortField } from '../lib/API/QueryInputs';
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
  apiClients: IAPIClients;
  setAlert: (alert: Alert) => void;
};

export const RouteContainer = ({
   apiClients,
   setAlert
  }: RouteContainerProps ) => {
  const [startup, setStartup] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [games, setGames] = useState<(IGameTemplate[])>([]);
  const [questions, setQuestions] = useState<(IQuestionTemplate[] | null)>([]);
  const [isAuthenticated, setLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [isSearchClick, setIsSearchClick] = useState(false);
  const [isUserAuth, setIsUserAuth] = useState(apiClients.auth.isUserAuth);
  const [modalOpen, setModalOpen] = useState(checkUserPlayed()); 
  const [showModalGetApp, setShowModalGetApp] = useState(false);
  const [prevTokens, setPrevTokens] = useState<(string | null)[]>([null]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const location = useLocation();
  const history = useHistory();
  const queryLimit = 12; // number of games retrieved on main page
  const [listQuerySettings, setListQuerySettings] = useState<IListQuerySettings>({
    nextToken: null,
    queryLimit
  });
  const [currentAuthenticatedUser, setCurrentAuthenticatedUser] = useState(null);

  const [sortByCheck, setSortByCheck] = React.useState(false);
  const handleUpdateListQuerySettings = async (listQuerySettings: IListQuerySettings ) => {
    setSortByCheck(false);
    const updatedListQuerySettings = {
      nextToken: null,
      queryLimit,
      sortDirection: listQuerySettings.sortDirection,
      sortField: listQuerySettings.sortField
    }
    setListQuerySettings(updatedListQuerySettings);
    if (location.pathname === "/questions")
      getAllQuestionTemplates(updatedListQuerySettings);
    else if (location.pathname === "/")
      getAllGameTemplates(updatedListQuerySettings);
  }

  const getAllGameTemplates = async (listQuerySettings: IListQuerySettings | null) => {
    try { 
      setLoading(true);
      const games = await listGameTemplates(apiClients, listQuerySettings);
      if (games?.gameTemplates){
        setGames(games?.gameTemplates);
        setNextToken(games?.nextToken ?? null);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const getAllQuestionTemplates = async (listQuerySettings: IListQuerySettings | null) => {
    try {
      setLoading(true);
      const questions = await listQuestionTemplates(apiClients, listQuerySettings);
      if (questions?.questionTemplates){
        setQuestions(questions?.questionTemplates ?? null);
        setNextToken(questions?.nextToken ?? null);
        setLoading(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const handleScrollDown = async (nextToken: string | null) => {
    let currentToken = nextToken;
    listQuerySettings.nextToken = nextToken;
    if (location.pathname === '/'){
      const games = await listGameTemplates(apiClients, listQuerySettings);
      if (games?.gameTemplates){
        setGames((prev) => [
          ...(prev ?? []),
          ...(games?.gameTemplates ?? [])
        ]);
        nextToken = games?.nextToken ?? null;
      }
  
    } else if (location.pathname === '/questions'){
      const questions = await listQuestionTemplates(apiClients, listQuerySettings);
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

  const debouncedApiCall = useCallback(debounce((updatedListQuerySettings, location) => {
    if (location.pathname === "/")
      getAllGameTemplates(updatedListQuerySettings);
    else 
      getAllQuestionTemplates(updatedListQuerySettings);
  }, 500), []);

  const handleSearchChange = (searchValue: string) => {
    const updatedListQuerySettings = {
      ...listQuerySettings,
      filterString: searchValue,
      nextToken: null,
      queryLimit: undefined
    };
    setListQuerySettings(updatedListQuerySettings);
    setSearchInput(searchValue);
    debouncedApiCall(updatedListQuerySettings, location);
  };

  //   const cloneQuestion = async (questionInput: CreateQuestionTemplateInput) => {
  const cloneQuestion = async (questionInput: CreateQuestionTemplateInput) => {
    try{
    const question = await createQuestionTemplate(apiClients, questionInput);
    } catch (e) {
      console.log(e);
    }
  }

  // Update newGame parameter to include other aspects (or like saveGame below have it equal a Game object if that is possible) and possibly add the createGameQuestio here with array of questions or question ids as params (whatever createQuestion returns to Game Maker)
  const createNewGameTemplate = async (newGame: CreateGameTemplateInput) => {
    try{
    newGame.owner = "Owner";
    newGame.version = 0;
    const game = await createGameTemplate(apiClients, newGame);
      if (!game) {
        throw new Error ('Game was unable to be created');
      }
      return game;
    } catch (e) {
      console.log(e);
    }
  }

  const saveGameTemplate = async (existingGame: IGameTemplate, updatedGame: IGameTemplate) => {
    // first create the game template
    setLoading(true);
    let backendGame;
    // seperate out questionTemplates from gameTemplate object
    const {questionTemplates, ...rest} = updatedGame;
    const gameTemplateUpdate = rest as IGameTemplate; 
    const gameTemplateUpdateInput = {...gameTemplateUpdate, createdAt: gameTemplateUpdate.createdAt?.toString(), updatedAt: gameTemplateUpdate.updatedAt?.toString()}
    gameTemplateUpdateInput.questionTemplatesCount = gameTemplateUpdateInput.questionTemplates?.length ?? 0;
    if (isNullOrUndefined(existingGame))
    {
      backendGame = await createNewGameTemplate(gameTemplateUpdateInput);
    }
    else {
      backendGame = await updateGameTemplate(apiClients, gameTemplateUpdateInput);
    }
    if (!isNullOrUndefined(updatedGame.questionTemplates) && updatedGame.questionTemplates.length > 0) {
      const newQuestionTemplates = updatedGame.questionTemplates.map((updatedQuestion) => {
        if (updatedQuestion.gameQuestionId === null)  {
          handleCreateQuestionTemplate(updatedQuestion.questionTemplate);
        }
      });
      const newQuestions = await Promise.all(newQuestionTemplates);
      
      const newGameQuestionRequests = updatedGame.questionTemplates.map((question) => {
        if (question.gameQuestionId === null){ 
          handleCreateGameQuestion(updatedGame.id, question.questionTemplate.id);
        }
      });
      const newGameQuestions = await Promise.all(newGameQuestionRequests);
      if (!isNullOrUndefined(existingGame) && !isNullOrUndefined(existingGame.questionTemplates)){
        // find question templates that were deleted (if gameQuestionId is present in existing but not in updated)
        const questionTemplatesToDelete = existingGame.questionTemplates.filter((existingQuestion) => {
          return updatedGame.questionTemplates && !updatedGame.questionTemplates.some(updatedQuestion => 
              updatedQuestion.gameQuestionId === existingQuestion.gameQuestionId);
        });
        const newDeletedGameQuestionTemplates = questionTemplatesToDelete.map((question) => {
          handleDeleteGameQuestion(question.gameQuestionId);
        });
        const deletedGameQuestionTemplates = await Promise.all(newDeletedGameQuestionTemplates);
      }
    }
    listQuerySettings.nextToken = null;
    const games = await getAllGameTemplates(listQuerySettings);
    setLoading(false);
    setAlert({ message: 'Save Completed.', type: 'success' });
  };

    // update existing game template with changes from game maker
    const editGameTemplate = async (newGame: { id: string, owner: string, version: number, title: string, description: string, phaseOneTime?: number, phaseTwoTime?: number, grade?: string, domain?: string, cluster?: string, standard?: string, questionTemplates?: IQuestionTemplate[] }, questionIDSet: number[]) => {
      setLoading(true);
      try {
        const {questionTemplates, ...rest} = newGame;
        const gameTemplateUpdate = rest; 
        const questionTemplatesUpdate = questionTemplates;
        const game = await updateGameTemplate(apiClients, gameTemplateUpdate);
          
        if (game) {
          // ~~~~ add questions to game ~~~~~~ using , questionIDSet
          listQuerySettings.nextToken = nextToken;
          const games = await getAllGameTemplates(listQuerySettings);
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
    getAllQuestionTemplates(null);
    history.push(`/gamemaker/${gameDetails.id}/addquestion`)
  }

  // @ts-ignore
  const cloneGameTemplate = async (game) => {
    const {questionTemplates, ...rest} = game;
    const questionTemplatesUpdate = questionTemplates;
    const newGameTemplate = { ...rest, id: uuidv4(), title: `Clone of ${game.title}`};
    const result = await createGameTemplate(apiClients, newGameTemplate);
    if (result) {
      listQuerySettings.nextToken = nextToken;
      getAllGameTemplates(listQuerySettings);
      setAlert({ message: 'Game cloned.', type: 'success' });
    }
    return result
  }

  const handleDeleteGameTemplate = async (id: string) => {
    const result = await deleteGameTemplate(apiClients, id);
    if (result) {
      listQuerySettings.nextToken = nextToken;
      const games = await getAllGameTemplates(listQuerySettings);
    }
    setAlert({ message: 'Game deleted.', type: 'success' });
  }

  const handleDeleteQuestionTemplate = async (id: string, game: Game) => {
    const result = await deleteQuestionTemplate(apiClients, id);
    if (result) {
      listQuerySettings.nextToken = nextToken;
      getAllQuestionTemplates(listQuerySettings)
    }
    setAlert({ message: 'Question deleted.', type: 'success' });
  }

  const handleCreateQuestionTemplate = async ( question: IQuestionTemplate) => {
    try {
      const newQuestionInput = {...question, createdAt: question.createdAt?.toString(), updatedAt: question.updatedAt?.toString()};
      const result = await createQuestionTemplate(apiClients, newQuestionInput);
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
      const updatedAt = questionTemplateUpdate.updatedAt?.toString();
      const createdAt = questionTemplateUpdate.createdAt?.toString();
      const updatedQuestion = {...questionTemplateUpdate, updatedAt, createdAt};
      const question = await updateQuestionTemplate(apiClients, updatedQuestion);
      if (question) {  
        listQuerySettings.nextToken = nextToken;
        const question = await getAllQuestionTemplates(listQuerySettings);
      } else {
        throw new Error ('Question was unable to be update');
      }
      setLoading(false);
      setAlert({ message: 'Question updated.', type: 'success' });
      return question;
      } catch (e) {
        console.log(e);
      }
  }

  const handleCloneQuestionTemplate = async (question : IQuestionTemplate) => {
    const {gameTemplates, ...rest} = question;
    const gameTemplatesUpdate = gameTemplates;
    const updatedQuestionTemplate: CreateQuestionTemplateInput = { ...rest, id: uuidv4(), title: `Clone of ${question.title}`, createdAt: question.createdAt?.toISOString(), updatedAt: question.updatedAt?.toISOString()};
    const result = await createQuestionTemplate(apiClients, updatedQuestionTemplate);
    if (result) {
      listQuerySettings.nextToken = null;
      getAllGameTemplates(listQuerySettings);
      setAlert({ message: 'Question cloned.', type: 'success' });
    }
    return result
  }
  const handleCreateGameQuestion = async (gameId: string, questionId: string) => {
    try {
      const result = await createGameQuestions(apiClients, {gameTemplateID: gameId, questionTemplateID: questionId});
      // when a game and question are linked, we update the respective gameTemplatesCount and questionTemplatesCount
      if (
        !isNullOrUndefined(result) &&
        !isNullOrUndefined(result.gameTemplate) &&
        !isNullOrUndefined(result.questionTemplate) &&
        !isNullOrUndefined(result.gameTemplate.questionTemplates) &&
        !isNullOrUndefined(result.questionTemplate.gameTemplates) &&
        result.gameTemplate.questionTemplates.length >= 0 &&
        result.questionTemplate.gameTemplates.length >= 0
      ) {
        const {questionTemplates, ...restGame} = result.gameTemplate;
        const gameTemplateUpdate = {...restGame, questionTemplatesCount: questionTemplates.length}; 
        const gameTemplateUpdateInput = {...gameTemplateUpdate, createdAt: gameTemplateUpdate.createdAt?.toString(), updatedAt: gameTemplateUpdate.updatedAt?.toString()};
        const {gameTemplates, ...restQuestion} = result.questionTemplate;
        const questionTemplateUpdate = {...restQuestion, gameTemplatesCount: gameTemplates.length};
        const questionTemplateUpdateInput = {...questionTemplateUpdate, createdAt: questionTemplateUpdate.createdAt?.toString(), updatedAt: questionTemplateUpdate.updatedAt?.toString()};
        await updateGameTemplate(apiClients, gameTemplateUpdateInput);
        await updateQuestionTemplate(apiClients, questionTemplateUpdateInput);
      }
      return result;
    } catch (e) {
      console.log(e);
    }
  };
  
  const handleDeleteGameQuestion = async (id: string, gameId?: string) => {
    const result = await deleteGameQuestions(apiClients, id);
    if (gameId && gameId !== ''){
      const updatedGame = await getGameTemplate(apiClients, gameId ?? '');
      if (updatedGame) 
        setGames((prevGames) => prevGames.map(game => game.id === updatedGame.id ? updatedGame : game));
    }  
  }

  const handleUserAuth = (isAuth: boolean) => {
    console.log('handleUserAuth', isAuth);
    setIsUserAuth(isAuth);
  }

  const persistUserAuth = (async () => {
    try {
      if (await apiClients.auth.verifyAuth()) {
        setIsUserAuth(true);
      }
    } catch (e) {
      console.log(e);
      setIsUserAuth(false);
    }
  });

  const isResolutionMobile = useMediaQuery("(max-width: 760px)");

  const handleSearchClick = (isClick: boolean) => {
    setNextToken(null);
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

  // this useEffect establishes the Hub.listener to subscribe to changes in user auth
  useEffect(() => {
    persistUserAuth();
  }, [apiClients.auth.isUserAuth]);

  useEffect(() => {
    // get either a list of games or questions when the route changes
    setSearchInput('');
    const updatedListQuerySettings = {
      nextToken: null,
      queryLimit,
      sortDirection: SortDirection.DESC,
      sortField: SortField.UPDATEDAT,
      filterString: ''
    }
    const gameIdPattern = /^\/games\/([^\/]+)$/;
    const fetchData = async (gameIdPattern: RegExp) => {
      setNextToken(null);
      setPrevTokens([null]);
      setLoading(true);
      if (location.pathname === "/questions"){
        await getAllQuestionTemplates(updatedListQuerySettings);
      } else if (location.pathname === "/") {
        await getAllGameTemplates(updatedListQuerySettings);
      } else if (gameIdPattern.test(location.pathname) && games.length === 0) {
        const games = await getAllGameTemplates(updatedListQuerySettings);
        localStorage.setItem('games', JSON.stringify(games));
      } 
      setListQuerySettings(updatedListQuerySettings);
      setLoading(false);
    };
    if ((location.pathname === "/questions") || (location.pathname === "/") || (gameIdPattern.test(location.pathname))) 
      fetchData(gameIdPattern);
    setStartup(false);
  }, [location.pathname]);

  if (startup) return null;

  const alertContext = {
    alert,
    setAlert,
  };

  return (
    <Switch>
    <Route path="/login">
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <LogIn apiClients={apiClients} handleUserAuth={handleUserAuth} />
    </Route>

    <Route path="/signup">
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <SignUp apiClients={apiClients}/>
    </Route>

    <Route path="/confirmation">
      <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
      <Confirmation apiClients={apiClients}/>
    </Route>

    <Route>
      <OnboardingModal modalOpen={modalOpen} showModalGetApp={showModalGetApp} handleModalClose={handleModalClose} />
      <Box sx={{ height: '100vh' }}>
        <Box style={{display: 'flex', position: 'relative', width: '100%', zIndex: 1}}>
          <Nav isResolutionMobile={isResolutionMobile} isUserAuth={isUserAuth} handleModalOpen={handleModalOpen} />
        </Box>
        <Box style={{display: 'flex', width: '100%', zIndex: 0}}>
          <Games 
            loading={loading} 
            nextToken={nextToken} 
            games={games} 
            questions={questions} 
            handleScrollDown={handleScrollDown} 
            createNewGameTemplate={createNewGameTemplate} 
            editGameTemplate={editGameTemplate} 
            handleDeleteQuestionTemplate={handleDeleteQuestionTemplate} 
            deleteGame={handleDeleteGameTemplate} 
            cloneGameTemplate={cloneGameTemplate} 
            cloneQuestion={cloneQuestion} 
            isUserAuth={isUserAuth}  
            isSearchClick={isSearchClick} 
            handleSearchClick={handleSearchClick} 
            setSearchInput={setSearchInput} 
            searchInput={searchInput} 
            isResolutionMobile={isResolutionMobile} 
            handleQuestionBankClick={handleQuestionBankClick}
            handleCreateQuestionTemplate={handleCreateQuestionTemplate}
            handleUpdateQuestionTemplate={handleUpdateQuestionTemplate}
            handleCloneQuestionTemplate={handleCloneQuestionTemplate}
            handleDeleteGameQuestion={handleDeleteGameQuestion}
            saveGameTemplate={saveGameTemplate}
            listQuerySettings={listQuerySettings} 
            handleUpdateListQuerySettings={handleUpdateListQuerySettings}
            handleSearchChange={handleSearchChange}
            sortByCheck={sortByCheck}
            setSortByCheck={setSortByCheck}
          />
        </Box>
      </Box>
      <AlertBar />
    </Route>
  </Switch>
  )    
};