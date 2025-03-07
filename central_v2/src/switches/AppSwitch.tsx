import React, {useState, useEffect} from 'react';
import { useMatch } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { UserProfileContext, UserProfileDispatchContext } from '../lib/context/UserProfileContext';
import { useUserProfileContext, useUserProfileDispatchContext } from '../hooks/context/useUserProfileContext';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login'
import CreateQuestion from '../pages/CreateQuestion';
import CreateGame from '../pages/CreateGame';
import MyLibrary from '../pages/MyLibrary';
import { ScreenType, ScreenSize, GameQuestionType } from '../lib/CentralModels';

function AppSwitch() {
  const theme = useTheme();
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;
  const signUpScreen = useMatch('/signup') !== null;
  const loginScreen = useMatch('/login') !== null;
  const createQuestionScreen = useMatch('/create/question') !== null;
  const createGameScreen = useMatch('/create/game') !== null;
  const googleNextStep = useMatch('/nextstep') !== null;
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isTabsOpen, setIsTabsOpen] = React.useState(false);
  const [gameQuestion, setGameQuestion] = useState<GameQuestionType>(GameQuestionType.GAME)
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const userProfile = useUserProfileContext(UserProfileContext);
  const userProfileDispatch = useUserProfileDispatchContext(UserProfileDispatchContext);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(apiClients.auth.isUserAuth);
  console.log('user profile:');
  console.log(userProfile);
  useEffect(() => {
    apiClients.auth.verifyAuth().then((status) => {
        if (status){
          const localProfile = apiClients.centralDataManager?.getLocalUserProfile();
          if (localProfile){
            userProfileDispatch({type: 'update_user_profile', payload: localProfile});
            setIsUserLoggedIn(true);
          }
        }
      }
    )
  }, [apiClients.auth, apiClients.centralDataManager, apiClients.auth.isUserAuth, userProfileDispatch]);

  switch (true) {
    case questionScreen: {
      return (
        <AppContainer isTabsOpen={isTabsOpen} setIsTabsOpen={setIsTabsOpen} currentScreen={ScreenType.QUESTIONS} isUserLoggedIn={isUserLoggedIn}>
          <ExploreQuestions isTabsOpen={isTabsOpen} setIsTabsOpen={setIsTabsOpen} screenSize={screenSize} />
        </AppContainer>
      );
    }
    case libraryScreen: {
      return (
        <AppContainer currentScreen={ScreenType.LIBRARY} isUserLoggedIn={isUserLoggedIn} gameQuestion={gameQuestion} setGameQuestion={setGameQuestion}>
          <MyLibrary apiClients={apiClients} gameQuestion={gameQuestion}/>
        </AppContainer>
      );
    }
    case signUpScreen: 
    case googleNextStep: { 
      return (
        <AppContainer currentScreen={ScreenType.SIGNUP} isUserLoggedIn={isUserLoggedIn}>
          <SignUpSwitch setIsTabsOpen={setIsTabsOpen}/>
        </AppContainer>
      );
    }
    case loginScreen: {
      return (
        <AppContainer currentScreen={ScreenType.LOGIN} isUserLoggedIn={isUserLoggedIn}>
          <Login />
        </AppContainer>
      );
    }
    case createQuestionScreen: {
      return (
        <AppContainer currentScreen={ScreenType.CREATEQUESTION} isUserLoggedIn={isUserLoggedIn}>
          <CreateQuestion screenSize={screenSize}/>
        </AppContainer>
      );
    }
    case createGameScreen: {
      return (
        <AppContainer currentScreen={ScreenType.CREATEGAME} isUserLoggedIn={isUserLoggedIn}>
          <CreateGame screenSize={screenSize}/>
        </AppContainer>
      );
    }
    default:{
      return (
        <AppContainer currentScreen={ScreenType.GAMES} isUserLoggedIn={isUserLoggedIn}>
          <ExploreGames userProfile={userProfile} screenSize={screenSize} setIsUserLoggedIn={setIsUserLoggedIn}/>
        </AppContainer>
      );
    }
  }
}

export default AppSwitch;
