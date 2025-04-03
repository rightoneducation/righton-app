import React, { useState } from 'react';
import { useMatch } from 'react-router-dom';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SortType, SortDirection } from '@righton/networking';
import useCentralDataManager from '../hooks/useCentralDataActions';
import AppContainer from '../containers/AppContainer';
import AuthGuard from '../containers/AuthGuard';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login'
import CreateQuestion from '../pages/CreateQuestion';
import CreateGame from '../pages/CreateGame';
import MyLibrary from '../pages/MyLibrary';
import { ScreenType, ScreenSize, GameQuestionType } from '../lib/CentralModels';

interface AppSwitchProps {
  currentScreen: ScreenType;
}

function AppSwitch({
  currentScreen
}: AppSwitchProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [libraryGameQuestionSwitch, setLibraryGameQuestionSwitch] = useState<GameQuestionType>(GameQuestionType.GAME);
  const [isLibraryInit, setIsLibraryInit] = useState<boolean>(true);
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  let screenComponent;
  
  const gameQuestion: GameQuestionType = 
    (currentScreen === ScreenType.GAMES|| (currentScreen === ScreenType.LIBRARY && libraryGameQuestionSwitch === GameQuestionType.GAME)) ? GameQuestionType.GAME : GameQuestionType.QUESTION;
  const {
    isValidatingUser,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    getPublicPrivateElements,
    loadMore,
    fetchElements,
  } = useCentralDataManager({gameQuestion});

  console.log('isValidatingUser');
  console.log(isValidatingUser);

  const handleLibraryGameQuestionSwitch = (gameQuestionValue: GameQuestionType) => {
    setLibraryGameQuestionSwitch(gameQuestionValue);
    handleSortChange({
      field: gameQuestionValue === GameQuestionType.GAME ? SortType.listGameTemplates : SortType.listQuestionTemplates,
      direction: SortDirection.ASC,
    })
    setIsLibraryInit(false);  
  };
  
  switch (currentScreen) {
    case ScreenType.QUESTIONS: {
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
    case ScreenType.LIBRARY: {
      screenComponent = (
        <AuthGuard isValidatingUser={isValidatingUser}>
          <MyLibrary 
            isValidatingUser={isValidatingUser}
            gameQuestion={gameQuestion}
            screenSize={screenSize}
            setIsTabsOpen={setIsTabsOpen}
            isLibraryInit={isLibraryInit}
            setIsLibraryInit={setIsLibraryInit}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={getPublicPrivateElements}
            fetchElements={fetchElements}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.SIGNUP:
    case ScreenType.CONFIRMATION:
    case ScreenType.NEXTSTEP: {
      screenComponent = (
          <SignUpSwitch setIsTabsOpen={setIsTabsOpen}/>
      );
      break;
    }
    case ScreenType.LOGIN: {
      screenComponent = (
          <Login />
      );
      break;
    }
    case ScreenType.CREATEQUESTION: {
      screenComponent = (
          <CreateQuestion screenSize={screenSize}/>
      );
      break;
    }
    case ScreenType.CREATEGAME: {
      screenComponent = (
          <CreateGame screenSize={screenSize}/>
      );
      break
    }
    case ScreenType.GAMES:
    default:{
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
    <AppContainer isValidatingUser={isValidatingUser} setIsTabsOpen={setIsTabsOpen} currentScreen={currentScreen} setLibraryGameQuestionSwitch={handleLibraryGameQuestionSwitch} gameQuestion={gameQuestion}>
      {screenComponent}
    </AppContainer>
  )
}

export default AppSwitch;
