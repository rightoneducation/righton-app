import React, { useState } from 'react';
import { Box, Tabs, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  ElementType,
  GalleryType,
  IQuestionTemplate,
  PublicPrivateType,
  IUserProfile,
  GradeTarget,
  SortType,
  SortDirection,
} from '@righton/networking';
import {
  getQuestionElements,
  getTabLabel,
} from '../../lib/helperfunctions/MyLibraryHelperFunctions';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, LibraryTabEnum } from '../../lib/CentralModels';
import {
  ContentContainer,
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { LibraryTab } from '../../lib/styledcomponents/MyLibraryStyledComponent';
import tabPublicIcon from '../../images/tabPublic.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';
import libraryTabsCloseIcon from '../../images/libraryTabsClose.svg';

interface LibraryTabsQuestionsProps<T extends IQuestionTemplate> {
  screenSize: ScreenSize;
  isPublic: boolean;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  fetchElements: (libraryTab: LibraryTabEnum) => void;
  handleView: (element: T, elements: T[]) => void;
  handleCloseQuestionTabs: () => void;
}

export default function LibraryTabsQuestions({
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleView,
  isPublic,
  handleCloseQuestionTabs,
}: LibraryTabsQuestionsProps<IQuestionTemplate>) {
  const centralData = useCentralDataState();

  const isSearchResults = centralData?.searchTerms?.length > 0;

  const tabMap: { [key: number]: string } = {
    [LibraryTabEnum.PUBLIC]: 'Public',
    [LibraryTabEnum.FAVORITES]: 'Favorites',
    [LibraryTabEnum.PRIVATE]: 'Private',
  };

  const tabIconMap: { [key: number]: string } = {
    [LibraryTabEnum.PUBLIC]: tabPublicIcon,
    [LibraryTabEnum.PRIVATE]: tabPrivateIcon,
    [LibraryTabEnum.FAVORITES]: tabFavoritesIcon,
  };

  const tabIndexToEnum: { [key: number]: LibraryTabEnum } = isPublic
    ? { 0: LibraryTabEnum.PUBLIC, 1: LibraryTabEnum.FAVORITES }
    : { 0: LibraryTabEnum.PRIVATE };

  const enumToTabIndex: { [key in LibraryTabEnum]?: number } = isPublic
    ? { [LibraryTabEnum.PUBLIC]: 0, [LibraryTabEnum.FAVORITES]: 1 }
    : { [LibraryTabEnum.PRIVATE]: 0 };

  const tabs: LibraryTabEnum[] = isPublic
    ? [LibraryTabEnum.PUBLIC, LibraryTabEnum.FAVORITES]
    : [LibraryTabEnum.PRIVATE];

  const [openTab, setOpenTab] = React.useState<LibraryTabEnum>(
    isPublic ? LibraryTabEnum.PUBLIC : LibraryTabEnum.PRIVATE,
  );
  const [hasInitialized, setHasInitialized] = useState(false);
  if (!hasInitialized) {
    fetchElements(openTab);
    setHasInitialized(true);
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const newTabEnum = tabIndexToEnum[newValue as number];
    setOpenTab(newTabEnum);
    fetchElements(newTabEnum);
  };

  const elements = getQuestionElements(openTab, isSearchResults, centralData);

  return (
    <TabContent>
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Tabs
        value={enumToTabIndex[openTab]}
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
                    margin: 0,
                  }}
                />
              }
              iconPosition="start"
              label={label}
              isSelected={isSelected}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginRight: '12px',
                textTransform: 'none',
                fontFamily: 'Karla',
                fontSize: 20,
                fontWeight: 600,
                padding: '16px',
                boxSizing: 'border-box',
              }}
            />
          );
        })}
    
      </Tabs>
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
            onClick={handleCloseQuestionTabs}
          >
            <img
              src={libraryTabsCloseIcon}
              alt="Close"
              style={{
                width: '30px',
                height: '30px',
                cursor: 'pointer',
              }}
            />
        </Box>
      </Box>
      <ContentContainer>
        <SearchBar
          screenSize={screenSize}
          searchTerms={centralData.searchTerms}
          handleSearchChange={handleSearchChange}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
        />
        <CardGallery<IQuestionTemplate>
          screenSize={screenSize}
          searchTerm={isSearchResults ? centralData.searchTerms : undefined}
          grades={isSearchResults ? centralData.selectedGrades : undefined}
          galleryElements={elements as IQuestionTemplate[]}
          elementType={ElementType.GAME}
          galleryType={
            isSearchResults
              ? GalleryType.SEARCH_RESULTS
              : GalleryType.MOST_POPULAR
          }
          setIsTabsOpen={setIsTabsOpen}
          handleView={handleView}
          isLoading={centralData.isLoading}
          isMyLibrary
          isCreateGame
        />
      </ContentContainer>
    </TabContent>
  );
}
