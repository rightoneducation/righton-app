import React from 'react';
import { useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUp from '../pages/SignUp';
import Confirmation from '../pages/Confirmation';
import { ScreenType } from '../lib/CentralModels';

// interface AppSwitchProps {
// }

function AppSwitch() {
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;
  const signUpScreen = useMatch('/signup') !== null;
  const confirmationScreen = useMatch('/confirmation') !== null;

  switch (true) {
    case questionScreen: {
      return (
        <AppContainer currentScreen={ScreenType.QUESTIONS}>
          <ExploreQuestions />
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
          <ExploreGames />
        </AppContainer>
      );
    }
  }
}

export default AppSwitch;
