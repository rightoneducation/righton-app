import React, {useState} from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { GradeTarget, SortType, SortDirection, PublicPrivateType } from '@righton/networking';
import { 
  ScreenSize, 
  GameQuestionType, 
  LibraryTabEnum,
  StorageKeyIsFirstCreate
} from '../lib/CentralModels';
import CreateGame from '../pages/CreateGame';
import CreateGamePublicPrivate from '../pages/CreateGamePublicPrivate';

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
  const navigate = useNavigate();
  const isEdit = useMatch('/edit/game/:type/:gameId') !== null;
  const [isFirstCreate, setIsFirstCreate] = useState<boolean>(!localStorage.getItem(StorageKeyIsFirstCreate) && !isEdit);
  const handleBackClick = () => {
    localStorage.removeItem(StorageKeyIsFirstCreate);
    navigate('/library');
  };
  const [initPublicPrivate, setInitPublicPrivate] = useState<PublicPrivateType>(PublicPrivateType.PUBLIC);

  const handleStartCreating = (selected: PublicPrivateType) => {
    setInitPublicPrivate(selected);
    setIsFirstCreate(false);
  };

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
          initPublicPrivate={initPublicPrivate}
        />
      );
    case true:
    default:
      return (
        <CreateGamePublicPrivate 
          screenSize={screenSize}
          handleBackClick={handleBackClick}
          handleStartCreating={handleStartCreating}
        />
      );
  }
}