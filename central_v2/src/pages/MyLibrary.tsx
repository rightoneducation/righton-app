import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { 
  PublicPrivateType,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection
} from '@righton/networking';
import LibraryTabsContainer from '../components/librarytabs/LibraryTabsContainer';
import { ScreenSize, GameQuestionType } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';

interface MyLibraryProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
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
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  getFav,
  getDrafts,
  loadMore,
}: MyLibraryProps) {
  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
        <LibraryTabsContainer 
          gameQuestion={gameQuestion}
          screenSize={screenSize}
          setIsTabsOpen={setIsTabsOpen}
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
