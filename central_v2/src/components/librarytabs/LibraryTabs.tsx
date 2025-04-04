import React, { useState } from 'react';
import {
  Tabs
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { 
  ElementType,
  GalleryType,
  IGameTemplate,
  IQuestionTemplate,
  GradeTarget,
  SortType,
  SortDirection,
  PublicPrivateType
} from '@righton/networking';
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, GameQuestionType, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  ContentContainer, 
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { 
  LibraryTab
} from '../../lib/styledcomponents/MyLibraryStyledComponent';
import { getGameElements, getQuestionElements, getTabLabel } from '../../lib/helperfunctions/MyLibraryHelperFunctions';
import tabPublicIcon from '../../images/tabPublic.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';

interface LibraryTabsProps<T extends IGameTemplate | IQuestionTemplate> {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  isLibraryInit: boolean;
  setIsLibraryInit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
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

export default function LibraryTabs({
  gameQuestion,
  screenSize,
  isLibraryInit,
  setIsLibraryInit,
  setIsTabsOpen,
  handlePublicPrivateChange,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleView
}: LibraryTabsProps<IGameTemplate | IQuestionTemplate>) {
const centralData = useCentralDataState();
const centralDataDispatch = useCentralDataDispatch();
const isSearchResults = centralData.searchTerms.length > 0 || centralData.selectedGrades.length > 0 || (centralData.sort.field !== SortType.listGameTemplates && centralData.sort.direction !== SortDirection.ASC);

const tabs: LibraryTabEnum[] = [
  LibraryTabEnum.PUBLIC,
  LibraryTabEnum.PRIVATE,
  LibraryTabEnum.DRAFTS,
  LibraryTabEnum.FAVORITES,
];

const tabMap: { [key in LibraryTabEnum]: string } = {
  [LibraryTabEnum.PUBLIC]: 'Public',
  [LibraryTabEnum.PRIVATE]: 'Private',
  [LibraryTabEnum.DRAFTS]: 'Drafts',
  [LibraryTabEnum.FAVORITES]: 'Favorites',
};
const tabIconMap: { [key in LibraryTabEnum]: string } = {
  [LibraryTabEnum.PUBLIC]: tabPublicIcon,
  [LibraryTabEnum.PRIVATE]: tabPrivateIcon,
  [LibraryTabEnum.DRAFTS]: tabDraftsIcon,
  [LibraryTabEnum.FAVORITES]: tabFavoritesIcon,
};

const [openTab, setOpenTab] = React.useState<LibraryTabEnum>(LibraryTabEnum.PUBLIC);
const elements = gameQuestion === GameQuestionType.GAME ?
  getGameElements(openTab, isSearchResults, centralData)
  : getQuestionElements(openTab, isSearchResults, centralData);

if (isLibraryInit) {
  setIsLibraryInit(false);
  fetchElements(openTab);
}

const handleChange = (event: React.SyntheticEvent, newTab: LibraryTabEnum) => {
  setOpenTab(newTab);
  fetchElements(newTab);
};

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
      {tabs.map((key) => {
        const value = tabMap[key];
        const isSelected = openTab === key;
        const label = getTabLabel(screenSize, isSelected, value);
        return (
          <LibraryTab
            key={uuidv4()}
            icon={
              <img
                src={tabIconMap[key]}
                alt={value}
                style={{ 
                  opacity: openTab === key ? 1 : 0.5, 
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
            label={label}
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
      { gameQuestion === GameQuestionType.GAME ?
        <CardGallery<IGameTemplate>
          screenSize={screenSize}
          searchTerm={isSearchResults ? centralData.searchTerms : undefined}
          grades={isSearchResults ? centralData.selectedGrades : undefined}
          galleryElements={elements as IGameTemplate[]} 
          elementType={ElementType.GAME}
          galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
          setIsTabsOpen={setIsTabsOpen}
          handleView={handleView}
          isLoading={centralData.isLoading}
          isMyLibrary
        />
        : 
        <CardGallery<IQuestionTemplate>
          screenSize={screenSize}
          searchTerm={isSearchResults ? centralData.searchTerms : undefined}
          grades={isSearchResults ? centralData.selectedGrades : undefined}
          galleryElements={elements as IQuestionTemplate[]} 
          elementType={ElementType.GAME}
          galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
          setIsTabsOpen={setIsTabsOpen}
          handleView={handleView}
          isLoading={centralData.isLoading}
          isMyLibrary
        />
      }
    </ContentContainer>
  </TabContent>
);
}