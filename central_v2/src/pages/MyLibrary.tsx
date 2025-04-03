import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
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
  isValidatingUser: boolean;
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
  isValidatingUser,
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
  const theme = useTheme();
  return (
    <MyLibraryMainContainer>
      <MyLibraryBackground/>
      {isValidatingUser 
        ? <CircularProgress style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',   color: theme.palette.primary.darkBlueCardColor, zIndex: 1}}/>
        : <LibraryTabsContainer 
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
      }
    </MyLibraryMainContainer>
  );
}
