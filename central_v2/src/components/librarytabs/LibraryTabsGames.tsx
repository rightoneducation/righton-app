import React, { useState } from 'react';
import {
  Tabs
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { 
  ElementType,
  GalleryType,
  IGameTemplate,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection,
  PublicPrivateType,
} from '@righton/networking';
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  ContentContainer, 
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { 
  LibraryTab
} from '../../lib/styledcomponents/MyLibraryStyledComponent';

interface LibraryTabsGamesProps<T extends IGameTemplate> {
  screenSize: ScreenSize;
  tabMap: { [key: number]: string };
  tabIconMap: { [key: number]: string };
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  getLabel: (screen: ScreenSize, isSelected: boolean, value: string) => string;
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
  handleView: (element: T, elements: T[]) => void;
}

export default function LibraryTabsGames({
  screenSize,
  tabMap,
  tabIconMap,
  setIsTabsOpen,
  getLabel,
  handlePublicPrivateChange,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleView
}: LibraryTabsGamesProps<IGameTemplate>) {
const centralData = useCentralDataState();
const centralDataDispatch = useCentralDataDispatch();
const isSearchResults = centralData.searchTerms.length > 0;
const [openTab, setOpenTab] = React.useState<LibraryTabEnum>(LibraryTabEnum.PUBLIC);
const [hasInitialized, setHasInitialized] = useState(false);    
if (!hasInitialized) {
  const needsFetch = centralData.mostPopularGames.length === 0; 
  if (needsFetch) {
    fetchElements(openTab); 
  }
  setHasInitialized(true);
}

const handleChange = (event: React.SyntheticEvent, newTab: LibraryTabEnum) => {
  setOpenTab(newTab);
  fetchElements(newTab);
};

const getElements = () => {
  switch (openTab){
    case LibraryTabEnum.FAVORITES:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.favGames.map((favGame) => favGame.id).includes(game.id));
      return centralData.favGames;
    case LibraryTabEnum.DRAFTS:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.draftGames.map((draftGame) => draftGame.id).includes(game.id));
      return centralData.draftGames;
    case LibraryTabEnum.PRIVATE:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.privateGames.map((privateGame) => privateGame.id).includes(game.id));
      return centralData.privateGames;
    case LibraryTabEnum.PUBLIC:
    default:
      if (isSearchResults)
        return centralData.searchedGames.filter((game) => centralData.publicGames.map((publicGame) => publicGame.id).includes(game.id));
      return centralData.publicGames;
  }
}

return (
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
        searchTerms={centralData.searchTerms}
        handleSearchChange={handleSearchChange}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
      />
      <CardGallery<IGameTemplate>
        screenSize={screenSize}
        searchTerm={isSearchResults ? centralData.searchTerms : undefined}
        grades={isSearchResults ? centralData.selectedGrades : undefined}
        galleryElements={getElements()} 
        elementType={ElementType.GAME}
        galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
        setIsTabsOpen={setIsTabsOpen}
        handleView={handleView}
        isLoading={centralData.isLoading}
        isMyLibrary
      />
    </ContentContainer>
  </TabContent>
);
}