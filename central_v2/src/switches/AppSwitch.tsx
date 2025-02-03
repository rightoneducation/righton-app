import React from 'react';
import { useMatch } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUp from '../pages/SignUp';
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
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  const confirmationScreen = useMatch('/confirmation') !== null;

  switch (true) {
    case questionScreen: {
      return (
        <AppContainer currentScreen={ScreenType.QUESTIONS}>
          <ExploreQuestions screenSize={screenSize}/>
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
        <AppContainer currentScreen={ScreenType.SIGNUP}>
          <SignUp />
        </AppContainer>
      );
    }
    case loginScreen: {
      return (
        <AppContainer currentScreen={ScreenType.LOGIN}>
          <Login />
        </AppContainer>
      );
    }
    case createQuestionScreen: {
      return (
        <AppContainer currentScreen={ScreenType.SIGNUP}>
          <CreateQuestion screenSize={screenSize}/>
        </AppContainer>
      );
    }
    case confirmationScreen: {
      return (
        <AppContainer currentScreen={ScreenType.CONFIRMATION}>
          <Confirmation />
        </AppContainer>
      );
    }
    default:{
      return (
        <AppContainer currentScreen={ScreenType.GAMES}>
          <ExploreGames screenSize={screenSize}/>
        </AppContainer>
      );
    }
  }
}

export default AppSwitch;
