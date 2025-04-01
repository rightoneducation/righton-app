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
import { ScreenSize, GameQuestionType, LibraryTabEnum } from '../lib/CentralModels';
import { MyLibraryMainContainer, MyLibraryBackground } from '../lib/styledcomponents/MyLibraryStyledComponent';

interface MyLibraryProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  isLibraryInit: boolean;
  setIsLibraryInit: React.Dispatch<React.SetStateAction<boolean>>;
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
  fetchElements: (libraryTab: LibraryTabEnum) => void;
}

export default function MyLibrary({ 
  gameQuestion,
  screenSize,
  isLibraryInit,
  setIsLibraryInit,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  fetchElements
}: MyLibraryProps) {
  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
        <LibraryTabsContainer 
          gameQuestion={gameQuestion}
          screenSize={screenSize}
          isLibraryInit={isLibraryInit}
          setIsLibraryInit={setIsLibraryInit}
          setIsTabsOpen={setIsTabsOpen}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          handlePublicPrivateChange={handlePublicPrivateChange}
          fetchElements={fetchElements}
        />
    </MyLibraryMainContainer>
  );
}
