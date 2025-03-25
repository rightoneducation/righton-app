import React from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  IQuestionTemplate, 
  IGameTemplate,
  PublicPrivateType,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection,
} from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabExploreQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';
import { ScreenSize, GameQuestionType } from '../../lib/CentralModels';
import { 
  LibraryTabsStyledContainer,
  ContentFrame
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import LibraryTabsGames from './LibraryTabsGames';
import LibraryTabsQuestions from './LibraryTabsQuestions';

interface TabContainerProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  isTabsOpen: boolean;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  userProfile: IUserProfile;
  setIsUserLoggedIn: (isUserLoggedIn: boolean) => void;
  recommendedGames: IGameTemplate[];
  mostPopularGames: IGameTemplate[];
  searchedGames: IGameTemplate[];
  draftGames: IGameTemplate[];
  favGames: IGameTemplate[];
  recommendedQuestions: IQuestionTemplate[];
  mostPopularQuestions: IQuestionTemplate[];
  searchedQuestions: IQuestionTemplate[];
  draftQuestions: IQuestionTemplate[];
  favQuestions: IQuestionTemplate[];
  nextToken: string | null;
  isLoading: boolean;
  searchTerms: string;
  selectedGrades: GradeTarget[];
  isFavTabOpen: boolean;
  publicPrivate: PublicPrivateType;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType ) => void;
  getFav: (user: IUserProfile) => void;
  getDrafts: () => void;
  loadMore: () => void;
}

export default function LibraryTabsContainer({
  gameQuestion,
  isTabsOpen,
  setIsTabsOpen,
  userProfile,
  screenSize,
  setIsUserLoggedIn,
  recommendedGames,
  mostPopularGames,
  searchedGames,
  draftGames,
  favGames,
  recommendedQuestions,
  mostPopularQuestions,
  searchedQuestions,
  draftQuestions,
  favQuestions,
  nextToken,
  isLoading,
  searchTerms,
  selectedGrades,
  isFavTabOpen,
  publicPrivate,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  getFav,
  getDrafts,
  loadMore
}: TabContainerProps) {
  const theme = useTheme();
  const tabMap: { [key: number]: string } = {
    0: 'Public',
    1: 'Private',
    2: 'Drafts',
    3: 'Favorites',
  };
  const tabIconMap: { [key: number]: string } = {
    0: tabExploreQuestionsIcon,
    1: tabPrivateIcon,
    2: tabDraftsIcon,
    3: tabFavoritesIcon,
  };
  const getLabel = (screen: ScreenSize, isSelected: boolean, value: string) => {
    if (screen === ScreenSize.LARGE)
      return value;
    if (screen === ScreenSize.MEDIUM && isSelected)
     return value;
    return '';
  }

  const handleView = () => {
  }

  return (
    <LibraryTabsStyledContainer>
    <ContentFrame>
      { gameQuestion === GameQuestionType.GAME 
        ? <LibraryTabsGames
            gameQuestion={gameQuestion}
            tabMap={tabMap}
            tabIconMap={tabIconMap}
            getLabel={getLabel}
            isTabsOpen={isTabsOpen} 
            setIsTabsOpen={setIsTabsOpen}
            userProfile={userProfile} 
            setIsUserLoggedIn={setIsUserLoggedIn}
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
            getDrafts={getDrafts}
            loadMore={loadMore}
            handleView={handleView}
          />
        : <LibraryTabsQuestions
            gameQuestion={gameQuestion}
            tabMap={tabMap}
            tabIconMap={tabIconMap}
            getLabel={getLabel}
            isTabsOpen={isTabsOpen} 
            setIsTabsOpen={setIsTabsOpen}
            userProfile={userProfile} 
            setIsUserLoggedIn={setIsUserLoggedIn}
            screenSize={screenSize} 
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
            handleView={handleView}
          />
      }
    </ContentFrame>
  </LibraryTabsStyledContainer>
  );
}