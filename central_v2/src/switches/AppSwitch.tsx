import React, {useState, useEffect} from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const isSignupPage = useMatch("/signup");  // Checks if the current route is /signup
  const isLoginPage = useMatch("/login");    // Checks if the current route is /login

  const isUserProfileComplete = (profile: IUserProfile): boolean => {
    return Object.entries(profile).every(([key, value]) => {
      if (key === "password") return true; 
      return value !== undefined && value !== null && value !== "";
    });
  };
  useEffect(() => {
    const response = apiClients.auth.verifyAuth().then((status) => {
      console.log("UseEffect is RUNNING!");
      console.log("Status: ", status)
      if (status) {
        const localProfile = apiClients.centralDataManager?.getLocalUserProfile();
        console.log("printing local profile: ", localProfile)
        if (localProfile === null) {
          // prevent user from going to any other page wtihout fully signing up.
          navigate("/nextstep");  // Navigate if profile is incomplete
        }
          // user tries to go to signup or login page when they finished the signup process.
        else if (localProfile !== null && localProfile !== undefined){
          if(isUserProfileComplete(localProfile)){
            console.log("navigating user to the current page they are in.")
            setIsUserLoggedIn(true);

            if (isSignupPage || isLoginPage) {
              console.log("User is on signup/login, redirecting back.");
              navigate(-1);
            }
          }
        }

      }
    });
  }, [apiClients.auth, apiClients.centralDataManager, apiClients.auth.isUserAuth, navigate, isSignupPage, isLoginPage]);   // manually state that flips at the bottom.

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
