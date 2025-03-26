import React, {useState, useEffect} from 'react';
import { useMatch } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IUserProfile } from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { UserProfileContext, UserProfileDispatchContext } from '../lib/context/UserProfileContext';
import { useUserProfileContext, useUserProfileDispatchContext } from '../hooks/context/useUserProfileContext';
import useCentralDataManager from '../hooks/useCentralDataManager';
import AppContainer from '../containers/AppContainer';
import ExploreGames from '../pages/ExploreGames';
import ExploreQuestions from '../pages/ExploreQuestions';
import SignUpSwitch from './SignUpSwitch';
import Login from '../pages/Login'
import CreateQuestion from '../pages/CreateQuestion';
import CreateGame from '../pages/CreateGame';
import MyLibrary from '../pages/MyLibrary';
import { ScreenType, ScreenSize, GameQuestionType } from '../lib/CentralModels';

function AppSwitch() {
  const theme = useTheme();
  const mainScreen = useMatch('/') !== null;
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
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const userProfileDispatch = useUserProfileDispatchContext(UserProfileDispatchContext);
  let currentScreen: ScreenType;
  let screenComponent;
  
  const gameQuestion: GameQuestionType = 
    (mainScreen || (libraryScreen && libraryGameQuestionSwitch === GameQuestionType.GAME)) ? GameQuestionType.GAME : GameQuestionType.QUESTION;
  const {
    userProfile,
    userStatus,
    recommendedGames,
    mostPopularGames,
    searchedGames,
    draftGames,
    favGames,
    recommendedQuestions,
    mostPopularQuestions,
    searchedQuestions,
    favQuestions,
    draftQuestions,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    isTabsOpen,
    isFavTabOpen,
    publicPrivate,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    handlePublicPrivateChange,
    getFav,
    getDrafts,
    loadMore,
  } = useCentralDataManager({gameQuestion});
  
  switch (true) {
    case questionScreen: {
      currentScreen = ScreenType.QUESTIONS;
      screenComponent = (
        <ExploreQuestions 
          isTabsOpen={isTabsOpen} 
          setIsTabsOpen={setIsTabsOpen} 
          screenSize={screenSize} 
          publicPrivate={publicPrivate}
          recommendedQuestions={recommendedQuestions}
          mostPopularQuestions={mostPopularQuestions}
          searchedQuestions={searchedQuestions}
          favQuestions={favQuestions}
          draftQuestions={draftQuestions}
          nextToken={nextToken}
          isLoading={isLoading}
          searchTerms={searchTerms}
          selectedGrades={selectedGrades}
          isFavTabOpen={isFavTabOpen}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          handlePublicPrivateChange={handlePublicPrivateChange}
          getFav={getFav}
          loadMore={loadMore}
        />
      );
      break;
    }
    case libraryScreen: {
      currentScreen = ScreenType.LIBRARY;
      screenComponent = (
          <MyLibrary 
            gameQuestion={gameQuestion}
            isTabsOpen={isTabsOpen} 
            setIsTabsOpen={setIsTabsOpen}
            userProfile={userProfile} 
            screenSize={screenSize} 
            recommendedGames={recommendedGames}
            mostPopularGames={mostPopularGames}
            searchedGames={searchedGames}
            draftGames={draftGames}
            favGames={favGames}
            recommendedQuestions={recommendedQuestions}
            mostPopularQuestions={mostPopularQuestions}
            searchedQuestions={searchedQuestions}
            draftQuestions={draftQuestions}
            favQuestions={favQuestions}
            nextToken={nextToken}
            isLoading={isLoading}
            searchTerms={searchTerms}
            selectedGrades={selectedGrades}
            isFavTabOpen={isFavTabOpen}
            publicPrivate={publicPrivate}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={handlePublicPrivateChange}
            getFav={getFav}
            getDrafts={getDrafts}
            loadMore={loadMore}
          />
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
      break
    }
    default:{
      currentScreen = ScreenType.GAMES;
      screenComponent = (
          <ExploreGames 
            isTabsOpen={isTabsOpen} 
            setIsTabsOpen={setIsTabsOpen}
            userProfile={userProfile} 
            screenSize={screenSize} 
            recommendedGames={recommendedGames}
            mostPopularGames={mostPopularGames}
            searchedGames={searchedGames}
            draftGames={draftGames}
            favGames={favGames}
            nextToken={nextToken}
            isLoading={isLoading}
            searchTerms={searchTerms}
            selectedGrades={selectedGrades}
            isFavTabOpen={isFavTabOpen}
            publicPrivate={publicPrivate}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={handlePublicPrivateChange}
            getFav={getFav}
            loadMore={loadMore}
          />
      );
    }
  }

  return (
    <AppContainer isTabsOpen={isTabsOpen} setIsTabsOpen={setIsTabsOpen} currentScreen={currentScreen} userStatus={userStatus}>
      {screenComponent}
    </AppContainer>
  )
}

export default AppSwitch;
