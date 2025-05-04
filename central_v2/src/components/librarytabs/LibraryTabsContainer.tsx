import React from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  PublicPrivateType,
  GradeTarget,
  SortType,
  SortDirection,
} from '@righton/networking';

import { ScreenSize, GameQuestionType, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  LibraryTabsStyledContainer,
  ContentFrame
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import LibraryTabs from './LibraryTabs';

interface TabContainerProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElements: (libraryTab: LibraryTabEnum) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType ) => void;
}

export default function LibraryTabsContainer({
  gameQuestion,
  screenSize,
  setIsTabsOpen,
  fetchElements,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange
}: TabContainerProps) {
  const theme = useTheme();
  const handleView = () => {
  }

  return (
    <LibraryTabsStyledContainer>
      <ContentFrame>
        <LibraryTabs
          gameQuestion={gameQuestion}
          screenSize={screenSize}
          setIsTabsOpen={setIsTabsOpen}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          handlePublicPrivateChange={handlePublicPrivateChange}
          fetchElements={fetchElements}
          handleView={handleView}
        />
      </ContentFrame>
    </LibraryTabsStyledContainer>
  );
}