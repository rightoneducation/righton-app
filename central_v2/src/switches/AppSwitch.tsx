import React from 'react';
import { useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import { IGameTemplate, IQuestionTemplate } from '@righton/networking';
import useInitCentralContainer from '../hooks/useExploreGamesStateManager';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import SignUp from '../pages/SignUp';

// interface AppSwitchProps {
// }

function AppSwitch() {
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;
  const signUpScreen = useMatch('/signup') !== null;
  switch (true) {
    case (questionScreen):
      return (
        <><Box/><Box/></>
        // <AppContainer>
        //   <ExploreQuestions apiClients={apiClients} />
        // </AppContainer>
      );
    case (libraryScreen):
      return (
        <><Box/><Box/></>
        // <AppContainer>
        //   <MyLibrary apiClients={apiClients} />
        // </AppContainer>
      );
    case (signUpScreen):
      return (
        <AppContainer>
          <SignUp />
        </AppContainer>
      );
    default: 
      return (
        <AppContainer>
          <ExploreGames />
        </AppContainer>
      );
  }
}

export default AppSwitch;
