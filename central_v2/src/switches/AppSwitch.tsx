import React from 'react';
import { useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';

// interface AppSwitchProps {
// }

function AppSwitch() {
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;
  switch (true) {
    case (questionScreen):
      return (
        <AppContainer>
          <ExploreQuestions />
        </AppContainer>
      );
    case (libraryScreen):
      return (
        <><Box/><Box/></>
        // <AppContainer>
        //   <MyLibrary apiClients={apiClients} />
        // </AppContainer>
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
