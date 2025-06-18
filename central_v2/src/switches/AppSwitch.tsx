import React, { useState } from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  SortType,
  SortDirection,
  PublicPrivateType,
} from '@righton/networking';
import useCentralDataManager from '../hooks/useCentralDataActions';
import AppContainer from '../containers/AppContainer';
import AuthGuard from '../containers/AuthGuard';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login';
import CreateQuestion from '../pages/CreateQuestion';
import CreateGame from '../pages/CreateGame';
import ViewGame from '../pages/ViewGame';
import MyLibrary from '../pages/MyLibrary';
import UserProfile from '../pages/UserProfile';
import { ScreenType, ScreenSize, GameQuestionType } from '../lib/CentralModels';
import ResetPassword from '../pages/ResetPassword';

// import { useCentralDataState, useCentralDataDispatch } from '../hooks/context/useCentralDataContext';

interface AppSwitchProps {
  currentScreen: ScreenType;
}

function AppSwitch({ currentScreen }: AppSwitchProps) {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [libraryGameQuestionSwitch, setLibraryGameQuestionSwitch] =
    useState<GameQuestionType>(GameQuestionType.GAME);
  const screenSize = isLargeScreen // eslint-disable-line
    ? ScreenSize.LARGE
    : isMediumScreen
      ? ScreenSize.MEDIUM
      : ScreenSize.SMALL;
  let screenComponent;

  const gameQuestion: GameQuestionType =
    currentScreen === ScreenType.GAMES ||
    (currentScreen === ScreenType.LIBRARY &&
      libraryGameQuestionSwitch === GameQuestionType.GAME)
      ? GameQuestionType.GAME
      : GameQuestionType.QUESTION;

  const {
    setIsTabsOpen,
    handleLibraryInit,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    getPublicPrivateElements,
    loadMore,
    loadMoreLibrary,
    fetchElement,
    fetchElements,
    handleLogOut,
    checkForUniqueEmail,
    deleteQuestionTemplate,
  } = useCentralDataManager({ gameQuestion });

  const handleLibraryGameQuestionSwitch = (
    gameQuestionValue: GameQuestionType,
  ) => {
    setLibraryGameQuestionSwitch(gameQuestionValue);
    handleSortChange({
      field:
        gameQuestionValue === GameQuestionType.GAME
          ? SortType.listGameTemplates
          : SortType.listQuestionTemplates,
      direction: SortDirection.ASC,
    });
    handleLibraryInit(true);
  };

  switch (currentScreen) {
    case ScreenType.QUESTIONS: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <ExploreQuestions
            screenSize={screenSize}
            fetchElement={fetchElement}
            fetchElements={fetchElements}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            loadMore={loadMore}
            loadMoreLibrary={loadMoreLibrary}
            handlePublicPrivateChange={getPublicPrivateElements}
            deleteQuestionTemplate={deleteQuestionTemplate}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.LIBRARY: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <MyLibrary
            gameQuestion={gameQuestion}
            screenSize={screenSize}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={getPublicPrivateElements}
            fetchElement={fetchElement}
            fetchElements={fetchElements}
            loadMoreLibrary={loadMoreLibrary}
            deleteQuestionTemplate={deleteQuestionTemplate}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.SIGNUP:
    case ScreenType.CONFIRMATION:
    case ScreenType.AUTH:
    case ScreenType.NEXTSTEP: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <SignUpSwitch
            setIsTabsOpen={setIsTabsOpen}
            checkForUniqueEmail={checkForUniqueEmail}
          />
        </AuthGuard>
      );
      break;
    }

    case ScreenType.PASSWORDRESET: {
      screenComponent = <ResetPassword setIsTabsOpen={setIsTabsOpen} />;
      break;
    }
    case ScreenType.LOGIN: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <Login handleLogOut={handleLogOut} />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.CREATEQUESTION: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <CreateQuestion
            screenSize={screenSize}
            fetchElement={fetchElement}
            fetchElements={fetchElements}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.CLONEQUESTION:
    case ScreenType.EDITQUESTION: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <CreateQuestion
            screenSize={screenSize}
            fetchElement={fetchElement}
            fetchElements={fetchElements}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.CREATEGAME: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <CreateGame
            screenSize={screenSize}
            setIsTabsOpen={setIsTabsOpen}
            fetchElement={fetchElement}
            fetchElements={fetchElements}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            loadMore={loadMore}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.CLONEGAME:
    case ScreenType.EDITGAME: {
      screenComponent = (
        <CreateGame
          screenSize={screenSize}
          setIsTabsOpen={setIsTabsOpen}
          fetchElement={fetchElement}
          fetchElements={fetchElements}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          loadMore={loadMore}
        />
      );
      break;
    }
    case ScreenType.VIEWGAME: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
          <ViewGame
            screenSize={screenSize}
            fetchElement={fetchElement}
            fetchElements={fetchElements}
          />
        </AuthGuard>
      );
      break;
    }
    case ScreenType.USERPROFILE: {
      screenComponent = <UserProfile screenSize={screenSize} />;
      break;
    }
    case ScreenType.GAMES:
    default: {
      screenComponent = (
        <AuthGuard handleLogOut={handleLogOut}>
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
    <AppContainer
      setIsTabsOpen={setIsTabsOpen}
      currentScreen={currentScreen}
      setLibraryGameQuestionSwitch={handleLibraryGameQuestionSwitch}
      gameQuestion={gameQuestion}
      handleLogOut={handleLogOut}
    >
      {screenComponent}
    </AppContainer>
  );
}

export default AppSwitch;
