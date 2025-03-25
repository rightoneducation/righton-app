import React from 'react';
import {
  Tabs
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { 
  IQuestionTemplate, 
  PublicPrivateType,
} from '@righton/networking';
import tabExploreQuestionsIcon from '../../images/tabExploreQuestions.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';
import { ScreenSize, GameQuestionType } from '../../lib/CentralModels';
import { 
  LibraryTab,
  LibraryTabsStyledContainer,
  ContentFrame
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import { 
  TabContent, 
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import LibraryTabsGames from './LibraryTabsGames';
import LibraryTabsQuestions from './LibraryTabsQuestions';


interface TabContainerProps {
  screenSize: ScreenSize;
  gameQuestion: GameQuestionType;
}

export default function LibraryTabsContainer({
  screenSize,
  gameQuestion,
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
  };
  return (
    <LibraryTabsStyledContainer>
    <ContentFrame>
      { gameQuestion === GameQuestionType.GAME 
        ? <LibraryTabsGames
            screenSize={screenSize}
            tabMap={tabMap}
            tabIconMap={tabIconMap}
            getLabel={getLabel}
            handleView={handleView}
          />
        : <LibraryTabsQuestions
            screenSize={screenSize}
            tabMap={tabMap}
            tabIconMap={tabIconMap}
            getLabel={getLabel}
            handleView={handleView}
          />
      }
    </ContentFrame>
  </LibraryTabsStyledContainer>
  );
}