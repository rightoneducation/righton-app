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
import { ScreenSize, GameQuestionType, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  LibraryTabsStyledContainer,
  ContentFrame
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import LibraryTabsGames from './LibraryTabsGames';
import LibraryTabsQuestions from './LibraryTabsQuestions';

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
            screenSize={screenSize}
            tabMap={tabMap}
            tabIconMap={tabIconMap}
            getLabel={getLabel}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={handlePublicPrivateChange}
            fetchElements={fetchElements}
            handleView={handleView}
          />
        : <LibraryTabsQuestions
            screenSize={screenSize}
            tabMap={tabMap}
            tabIconMap={tabIconMap}
            getLabel={getLabel}
            setIsTabsOpen={setIsTabsOpen}
            handleChooseGrades={handleChooseGrades}
            handleSortChange={handleSortChange}
            handleSearchChange={handleSearchChange}
            handlePublicPrivateChange={handlePublicPrivateChange}
            fetchElements={fetchElements}
            handleView={handleView}
          />
      }
    </ContentFrame>
  </LibraryTabsStyledContainer>
  );
}