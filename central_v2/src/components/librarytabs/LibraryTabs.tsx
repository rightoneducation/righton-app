import React from 'react';
import {
  Tabs
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import { 
  IQuestionTemplate, 
  ElementType,
  GalleryType,
  IGameTemplate,
} from '@righton/networking';
import CardGallery from '../cardgallery/CardGallery';
import useExploreGamesStateManager from '../../hooks/useExploreGamesStateManager';
import tabExploreQuestionsIcon from '../../images/tabExploreQuestions.svg';
import SearchBar from '../searchbar/SearchBar';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';
import { ScreenSize } from '../../lib/CentralModels';
import { LibraryTab } from '../../lib/styledcomponents/MyLibraryStyledComponent';
import { 
  TabContainer, 
  ContentFrame, 
  TabContent, 
  ContentContainer, 
  CardContainer,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';

interface TabContainerProps {
  screenSize: ScreenSize;
  questions: IQuestionTemplate[];
}

interface TabContainerProps {
  screenSize: ScreenSize;
  questions: IQuestionTemplate[];
}

export default function QuestionTabs({
  screenSize,
  questions,
}: TabContainerProps) {
  const theme = useTheme();
  const {
    recommendedGames,
    mostPopularGames,
    searchedGames,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreGames,
  } = useExploreGamesStateManager();
  const [openTab, setOpenTab] = React.useState(0);
  const isSearchResults = searchTerms.length > 0;
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setOpenTab(newValue);
  };
  const handleView = () => {
  };
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
  return (
    <TabContainer>
      <ContentFrame>
        <TabContent>
          <Tabs
            value={openTab}
            onChange={handleChange}
            TabIndicatorProps={{
              style: {
                display: 'none',
              },
            }}
          >
            {Object.entries(tabMap).map(([key, value], index) => {
              const numericKey = Number(key);
              const isSelected = openTab === numericKey;
              return (
                <LibraryTab
                  key={uuidv4()}
                  icon={
                    <img
                      src={tabIconMap[numericKey]}
                      alt={value}
                      style={{ 
                        opacity: openTab === numericKey ? 1 : 0.5, 
                        paddingTop: 0,
                        paddingLeft: 0,
                        paddingRight: '12px',
                        paddingBottom: 0,
                        height: '30px',
                        width: '30px',
                        margin: 0
                      }}
                    />
                  }
                  iconPosition="start"
                  label={getLabel(screenSize, isSelected, value)}
                  isSelected={isSelected}
                  style={{ display: 'flex', alignItems: 'center', marginRight: '12px', textTransform: 'none', fontFamily: 'Karla', fontSize: 20, fontWeight: 600, padding: '16px', boxSizing: 'border-box' }}
                />
              );
            })}
          </Tabs>
          <ContentContainer>
            <SearchBar
              screenSize={screenSize}
              searchTerms={searchTerms}
              handleSearchChange={handleSearchChange}
              handleChooseGrades={handleChooseGrades}
              handleSortChange={handleSortChange}
            />
            <CardGallery<IGameTemplate>
              screenSize={screenSize}
              searchTerm={isSearchResults ? searchTerms : undefined}
              grades={isSearchResults ? selectedGrades : undefined}
              galleryElements={isSearchResults ? searchedGames : mostPopularGames}
              elementType={ElementType.GAME}
              galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
              setIsTabsOpen={setIsTabsOpen}
              handleView={handleView}
              isLoading={isLoading}
              isMyLibrary
            />
          </ContentContainer>
        </TabContent>
      </ContentFrame>
    </TabContainer>
  );
}
