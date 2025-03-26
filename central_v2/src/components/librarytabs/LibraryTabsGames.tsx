import React from 'react';
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
import { CentralDataContext } from '../../lib/context/CentralDataContext';
import { useCentralDataContext } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, GameQuestionType } from '../../lib/CentralModels';
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
  getFav: (user: IUserProfile) => void;
  getDrafts: () => void;
  loadMore: () => void;
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
  getFav,
  getDrafts,
  loadMore,
  handleView
}: LibraryTabsGamesProps<IGameTemplate>) {
const { centralData  } = useCentralDataContext(CentralDataContext);
const isSearchResults = centralData.searchTerms.length > 0;
const [openTab, setOpenTab] = React.useState(0);
const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  if (newValue === 3) {
    getFav(centralData.userProfile);
  } else if (newValue === 2) {
    getDrafts();
  } else {
    // TODO
    handlePublicPrivateChange(newValue === 1 ? PublicPrivateType.PRIVATE : PublicPrivateType.PUBLIC);
  }
  setOpenTab(newValue);
};

const getElements = () => {
  if (centralData.favGames.length > 0 && openTab === 3){
    if (isSearchResults)
      return centralData.searchedGames.filter((game) => centralData.favGames.map((favGame) => favGame.id).includes(game.id));
    return centralData.favGames;
  }
  if (centralData.draftGames.length > 0 && openTab === 2){
    return centralData.draftGames;
  }
  if (isSearchResults)
    return centralData.searchedGames 
  return centralData.mostPopularGames;
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