import React from 'react';
import { useMatch } from 'react-router-dom';
import { Box } from '@mui/material';
import { IAPIClients } from '@righton/networking';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';

// interface AppSwitchProps {
// }

function AppSwitch() {
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;

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
    default: 
      return (
        <AppContainer>
          <ExploreGames />
        </AppContainer>
      );
  }
}

export default AppSwitch;
