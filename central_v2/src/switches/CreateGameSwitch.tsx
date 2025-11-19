import React from 'react';
import { 
  ScreenSize, 
  GameQuestionType, 
  LibraryTabEnum,
  StorageKeyIsFirstCreate
} from '../lib/CentralModels';
import { GradeTarget, SortType, SortDirection } from '@righton/networking';
import CreateGame from '../pages/CreateGame';

interface CreateGameProps {
  screenSize: ScreenSize;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  fetchElement: (type: GameQuestionType, id: string) => void;
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
  loadMore: () => void;
}

export default function CreateGameSwitch({
  screenSize,
  setIsTabsOpen,
  fetchElement,
  fetchElements,
  handleChooseGrades,
  handleSearchChange,
  handleSortChange,
  loadMore
}: CreateGameProps) {
  const isFirstCreate = localStorage.getItem(StorageKeyIsFirstCreate) === 'true';
  console.log('isFirstCreate', isFirstCreate);
  switch (isFirstCreate){
    case false:
      return (
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
    case true:
    default:
      return (
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
  }
}