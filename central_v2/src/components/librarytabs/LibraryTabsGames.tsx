import React from 'react';
import {
  Tabs
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { 
  ElementType,
  GalleryType,
  IGameTemplate,
  PublicPrivateType,
} from '@righton/networking';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize } from '../../lib/CentralModels';
import { 
  ContentContainer, 
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import useExploreGamesStateManager from '../../hooks/useExploreGamesStateManager';
import { UserProfileContext } from '../../lib/context/UserProfileContext';
import { useUserProfileContext } from '../../hooks/context/useUserProfileContext';
import { 
  LibraryTab
} from '../../lib/styledcomponents/MyLibraryStyledComponent';

interface LibraryTabsGamesProps<T extends IGameTemplate> {
  screenSize: ScreenSize;
  tabMap: { [key: number]: string };
  tabIconMap: { [key: number]: string };
  getLabel: (screen: ScreenSize, isSelected: boolean, value: string) => string;
  handleView: (element: T, elements: T[]) => void;
}

export default function LibraryTabsGames({
  screenSize,
  tabMap,
  tabIconMap,
  getLabel,
  handleView
}: LibraryTabsGamesProps<IGameTemplate>) {
const {
  recommendedGames,
  mostPopularGames,
  searchedGames,
  favGames,
  nextToken,
  isLoading,
  searchTerms,
  selectedGrades,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handlePublicPrivateChange,
  getFavGames,
  loadMoreGames,
} = useExploreGamesStateManager();
const isSearchResults = searchTerms.length > 0;
const [publicPrivate, setPublicPrivate] = React.useState<PublicPrivateType>(PublicPrivateType.PUBLIC);
const [openTab, setOpenTab] = React.useState(0);
const userProfile = useUserProfileContext(UserProfileContext);
const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  console.log('sup')
  console.log(newValue)
  if (newValue === 3) {
    getFavGames(userProfile);
    console.log(favGames);
  } else {
    setPublicPrivate(newValue === 1 ? PublicPrivateType.PRIVATE : PublicPrivateType.PUBLIC);
    handlePublicPrivateChange(newValue === 1 ? PublicPrivateType.PRIVATE : PublicPrivateType.PUBLIC);
  }
  setOpenTab(newValue);
};
const getElements = () => {
  if (favGames.length > 0 && openTab === 3)
    return favGames;
  if (isSearchResults)
    return searchedGames 
  return mostPopularGames;
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
        searchTerms={searchTerms}
        handleSearchChange={handleSearchChange}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
      />
      <CardGallery<IGameTemplate>
        screenSize={screenSize}
        searchTerm={isSearchResults ? searchTerms : undefined}
        grades={isSearchResults ? selectedGrades : undefined}
        galleryElements={getElements()} 
        elementType={ElementType.GAME}
        galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
        setIsTabsOpen={setIsTabsOpen}
        handleView={handleView}
        isLoading={isLoading}
        isMyLibrary
      />
    </ContentContainer>
  </TabContent>
);
}