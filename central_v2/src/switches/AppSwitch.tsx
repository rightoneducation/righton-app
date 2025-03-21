import React, {useState, useEffect} from 'react';
import { useMatch } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IUserProfile } from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login'
import CreateQuestion from '../pages/CreateQuestion';
import CreateGame from '../pages/CreateGame';
import { ScreenType, ScreenSize } from '../lib/CentralModels';
import Confirmation from '../pages/Confirmation';
// import { profile } from 'console';

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
  const googlenextstep = useMatch('/nextstep') !== null;
  
  const blankUserProfile = {
    title: 'Title...',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  }
  const [userProfile, setUserProfile] = useState<IUserProfile>(blankUserProfile);
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
  
  const isUserProfileComplete = (profile: IUserProfile): boolean => {
    return Object.entries(profile).every(([key, value]) => value !== undefined && value !== null && value !== "");
  };
  useEffect(() => {
    const response = apiClients.auth.verifyAuth().then((status) => {
        console.log("UseEffect is RUNNING!")
        if (status){
          const localProfile = apiClients.centralDataManager?.getLocalUserProfile();
          // console.log("Local Profile fetched: ", localProfile)
          if (localProfile) {
            if (!isUserProfileComplete(localProfile)) {
                // navigate to next step
            }
          }

          setIsUserLoggedIn(true);
          if (localProfile){
            setUserProfile(localProfile);
          }
        }
      }
    )
  }, [apiClients.auth, apiClients.centralDataManager, apiClients.auth.isUserAuth]);  // manually state that flips at the bottom.

  const session = apiClients.auth.verifyAuth();
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
    case signUpScreen:
    case googlenextstep: {
      return (
        <AppContainer currentScreen={ScreenType.SIGNUP} isUserLoggedIn={isUserLoggedIn}>
          <SignUpSwitch userProfile={userProfile} setUserProfile={setUserProfile} setIsTabsOpen={setIsTabsOpen}/>
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
