import React, {useState, useEffect} from 'react';
import { useMatch } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login'
import CreateQuestion from '../pages/CreateQuestion';
import { ScreenType, ScreenSize } from '../lib/CentralModels';
import Confirmation from '../pages/Confirmation';

// interface AppSwitchProps {
// }

function AppSwitch() {
  const theme = useTheme();
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;
  const signUpScreen = useMatch('/signup') !== null;
  const loginScreen = useMatch('/login') !== null;
  const createQuestionScreen = useMatch('/create/question') !== null;
  const createGameScreen = useMatch('/create/game') !== null;
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isTabsOpen, setIsTabsOpen] = React.useState(false);
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const confirmationScreen = useMatch('/confirmation') !== null;
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(apiClients.auth.isUserAuth);

  // TODO: remove useeffect and monitor via hook etc
  
  
  useEffect(() => {
    setIsUserLoggedIn(apiClients.auth.isUserAuth);
  }, [apiClients.auth.isUserAuth]);

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
        <>
          <Box />
          <Box />
        </>
        // <AppContainer>
        //   <MyLibrary apiClients={apiClients} />
        // </AppContainer>
      );
    }
    case signUpScreen: {
      return (
        <AppContainer currentScreen={ScreenType.SIGNUP} isUserLoggedIn={isUserLoggedIn}>
          <SignUpSwitch />
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
        <AppContainer currentScreen={ScreenType.SIGNUP} isUserLoggedIn={isUserLoggedIn}>
          <CreateQuestion screenSize={screenSize}/>
        </AppContainer>
      );
    }
    default:{
      return (
        <AppContainer currentScreen={ScreenType.GAMES} isUserLoggedIn={isUserLoggedIn}>
          <ExploreGames screenSize={screenSize} setIsUserLoggedIn={setIsUserLoggedIn}/>
        </AppContainer>
      );
    }
  }
}

export default AppSwitch;
