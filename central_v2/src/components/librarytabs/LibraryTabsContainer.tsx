import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  PublicPrivateType,
  GradeTarget,
  SortType,
  SortDirection,
  IGameTemplate,
  IQuestionTemplate,
} from '@righton/networking';
import {
  ScreenSize,
  GameQuestionType,
  LibraryTabEnum,
} from '../../lib/CentralModels';
import {
  LibraryTabsStyledContainer,
  ContentFrame,
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import LibraryTabs from './LibraryTabs';
import { useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';

interface TabContainerProps {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  openTab: LibraryTabEnum;
  setOpenTab: (tab: LibraryTabEnum) => void;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType) => void;
  handleQuestionView: (
    element: IQuestionTemplate,
    elements: IQuestionTemplate[],
  ) => void;
  loadMoreLibrary: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
  ) => void;
}

export default function LibraryTabsContainer({
  gameQuestion,
  screenSize,
  openTab,
  setOpenTab,
  setIsTabsOpen,
  fetchElements,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  handleQuestionView,
  loadMoreLibrary,
}: TabContainerProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const centralDataDispatch = useCentralDataDispatch();
  const handleGameView = (element: IGameTemplate | IQuestionTemplate) => {
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: element });
    navigate(`/library/games/${element.publicPrivateType}/${element.id}`);
  };
  return (
    <LibraryTabsStyledContainer>
      <ContentFrame>
        <LibraryTabs
          gameQuestion={gameQuestion}
          screenSize={screenSize}
          openTab={openTab}
          setOpenTab={setOpenTab}
          setIsTabsOpen={setIsTabsOpen}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
          handleSearchChange={handleSearchChange}
          handlePublicPrivateChange={handlePublicPrivateChange}
          fetchElements={fetchElements}
          handleGameView={handleGameView}
          handleQuestionView={handleQuestionView}
          loadMoreLibrary={loadMoreLibrary}
        />
      </ContentFrame>
    </LibraryTabsStyledContainer>
  );
}
