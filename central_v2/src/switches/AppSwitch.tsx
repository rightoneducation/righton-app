import React, { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useCentralDataManager from '../hooks/useCentralDataActions';
import AppContainer from '../containers/AppContainer';
import AuthGuard from '../containers/AuthGuard';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login'
import CreateQuestion from '../pages/CreateQuestion';
import CreateGame from '../pages/CreateGame';
import ViewGame from '../pages/ViewGame';
import MyLibrary from '../pages/MyLibrary';
import { ScreenType, ScreenSize, GameQuestionType } from '../lib/CentralModels';

function AppSwitch() {
  const theme = useTheme();
  const mainScreen = useMatch('/') !== null;
  const viewGameScreen = useMatch('/games/:gameId') !== null;
  const questionScreen = useMatch('/questions') !== null;
  const libraryScreen = useMatch('/library') !== null;
  const signUpScreen = useMatch('/signup') !== null;
  const loginScreen = useMatch('/login') !== null;
  const createQuestionScreen = useMatch('/create/question') !== null;
  const createGameScreen = useMatch('/create/game') !== null;
  const googlenextstep = useMatch('/nextstep') !== null;
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [libraryGameQuestionSwitch, setLibraryGameQuestionSwitch] = useState<GameQuestionType>(GameQuestionType.GAME)
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  let currentScreen: ScreenType;
  let screenComponent;
  
  const gameQuestion: GameQuestionType = 
    (mainScreen || (libraryScreen && libraryGameQuestionSwitch === GameQuestionType.GAME)) ? GameQuestionType.GAME : GameQuestionType.QUESTION;
  const {
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    handlePublicPrivateChange,
    getFav,
    getDrafts,
    loadMore,
    fetchElement,
    fetchElements,
  } = useCentralDataManager({gameQuestion});
  
  switch (true) {
    case questionScreen: {
      currentScreen = ScreenType.QUESTIONS;
      screenComponent = (
        <AuthGuard>
          <ExploreQuestions 
            screenSize={screenSize} 
            fetchElements={fetchElements}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            loadMore={loadMore}
          />
        </AuthGuard>
      );
      break;
    }
    case libraryScreen: {
      currentScreen = ScreenType.LIBRARY;
      screenComponent = (
        <AuthGuard>
          <MyLibrary 
            gameQuestion={gameQuestion}
            screenSize={screenSize} 
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={handlePublicPrivateChange}
            fetchElements={fetchElements}
          />
        </AuthGuard>
      );
      break;
    }
    case signUpScreen:
    case googlenextstep: {
      currentScreen = ScreenType.SIGNUP;
      screenComponent = (
          <SignUpSwitch setIsTabsOpen={setIsTabsOpen}/>
      );
      break;
    }
    
    case loginScreen: {
      currentScreen = ScreenType.LOGIN;
      screenComponent = (
          <Login />
      );
      break;
    }
    case createQuestionScreen: {
      currentScreen = ScreenType.CREATEQUESTION;
      screenComponent = (
          <CreateQuestion screenSize={screenSize}/>
      );
      break;
    }
    case createGameScreen: {
      currentScreen = ScreenType.CREATEQUESTION;
      screenComponent = (
          <CreateGame screenSize={screenSize}/>
      );
      break;
    }
    case viewGameScreen: {
      currentScreen = ScreenType.VIEWGAME;
      screenComponent = (
          <ViewGame screenSize={screenSize} fetchElement={fetchElement} />
      );
      break;
    }
    default:{
      currentScreen = ScreenType.GAMES;
      screenComponent = (
        <AuthGuard>
          <ExploreGames 
            screenSize={screenSize} 
            setIsTabsOpen={setIsTabsOpen}
            fetchElements={fetchElements}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            loadMore={loadMore}
          />
        </AuthGuard>
      );
    }
  }

  return (
    <AppContainer setIsTabsOpen={setIsTabsOpen} currentScreen={currentScreen}>
      {screenComponent}
    </AppContainer>
  )
}

export default AppSwitch;
