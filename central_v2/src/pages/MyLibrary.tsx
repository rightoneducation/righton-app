import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { 
  IAPIClients, 
  IQuestionTemplate,
  IGameTemplate,
  PublicPrivateType,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection
} from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import LibraryTabsContainer from '../components/librarytabs/LibraryTabsContainer';
import { ScreenSize, GameQuestionType } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';

interface MyLibraryProps {
  gameQuestion: GameQuestionType;
  isTabsOpen: boolean;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  userProfile: IUserProfile;
  screenSize: ScreenSize;
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

export default function MyLibrary({ 
  gameQuestion,
  isTabsOpen,
  setIsTabsOpen,
  userProfile,
  screenSize,
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
  loadMore,
}: MyLibraryProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
        <LibraryTabsContainer 
          gameQuestion={gameQuestion}
          isTabsOpen={isTabsOpen}
          setIsTabsOpen={setIsTabsOpen}
          userProfile={userProfile}
          screenSize={screenSize}
          recommendedGames={recommendedGames}
          mostPopularGames={mostPopularGames}
          searchedGames={searchedGames}
          draftGames={draftGames}
          recommendedQuestions={recommendedQuestions}
          mostPopularQuestions={mostPopularQuestions}
          searchedQuestions={searchedQuestions}
          draftQuestions={draftQuestions}
          favQuestions={favQuestions}
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
        />
    </MyLibraryMainContainer>
  );
}
