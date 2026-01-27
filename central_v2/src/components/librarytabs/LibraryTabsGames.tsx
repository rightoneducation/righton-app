import React, { useState, useEffect } from 'react';
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
  IGameTemplate,
} from '@righton/networking';
import {
  getGameElements,
  getTabLabel,
} from '../../lib/helperfunctions/MyLibraryHelperFunctions';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import { ScreenSize, LibraryTabEnum, GameQuestionType } from '../../lib/CentralModels';
import {
  ContentContainer,
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { LibraryTab } from '../../lib/styledcomponents/MyLibraryStyledComponent';
import tabPublicIcon from '../../images/tabPublic.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import libraryTabsCloseIcon from '../../images/libraryTabsClose.svg';

interface LibraryTabsGamesProps<T extends IGameTemplate> {
  screenSize: ScreenSize;
  publicPrivateType: PublicPrivateType;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
    isLoadMoreLibrary?: boolean,
    sortOverride?: {
      field: SortType;
      direction: SortDirection | null;
    } | null,
    gameQuestionOverride?: GameQuestionType,
  ) => void;
  handleView: (element: T, elements: T[]) => void;
  handleCloseGamesTabs: () => void;
}

export default function LibraryTabsGames({
  publicPrivateType,
  screenSize,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleView,
  handleCloseGamesTabs,
}: LibraryTabsGamesProps<IGameTemplate>) {
  const centralData = useCentralDataState();

  const isSearchResults = centralData?.searchTerms?.length > 0;
  const isPublic = publicPrivateType === PublicPrivateType.PUBLIC;
  const isDraft = publicPrivateType === PublicPrivateType.DRAFT;

  const tabMap: { [key: number]: string } = {
    [LibraryTabEnum.PUBLIC]: 'Public',
    [LibraryTabEnum.FAVORITES]: 'Favorites',
    [LibraryTabEnum.PRIVATE]: 'Private',
    [LibraryTabEnum.DRAFTS]: 'Drafts',
  };

  const tabIconMap: { [key: number]: string } = {
    [LibraryTabEnum.PUBLIC]: tabPublicIcon,
    [LibraryTabEnum.PRIVATE]: tabPrivateIcon,
    [LibraryTabEnum.FAVORITES]: tabFavoritesIcon,
    [LibraryTabEnum.DRAFTS]: tabDraftsIcon,
  };

  let tabIndexToEnum: { [key: number]: LibraryTabEnum };
  let enumToTabIndex: { [key in LibraryTabEnum]?: number };
  let tabs: LibraryTabEnum[];
  let initialTab: LibraryTabEnum;

  if (isPublic) {
    tabIndexToEnum = { 0: LibraryTabEnum.PUBLIC, 1: LibraryTabEnum.FAVORITES };
    enumToTabIndex = { [LibraryTabEnum.PUBLIC]: 0, [LibraryTabEnum.FAVORITES]: 1 };
    tabs = [LibraryTabEnum.PUBLIC, LibraryTabEnum.FAVORITES];
    initialTab = LibraryTabEnum.PUBLIC;
  } else if (isDraft) {
    tabIndexToEnum = { 0: LibraryTabEnum.DRAFTS };
    enumToTabIndex = { [LibraryTabEnum.DRAFTS]: 0 };
    tabs = [LibraryTabEnum.DRAFTS];
    initialTab = LibraryTabEnum.DRAFTS;
  } else {
    tabIndexToEnum = { 0: LibraryTabEnum.PRIVATE };
    enumToTabIndex = { [LibraryTabEnum.PRIVATE]: 0 };
    tabs = [LibraryTabEnum.PRIVATE];
    initialTab = LibraryTabEnum.PRIVATE;
  }

  const [openTab, setOpenTab] = React.useState<LibraryTabEnum>(initialTab);

  useEffect(() => {
    fetchElements(openTab, undefined, undefined, undefined, undefined, undefined, GameQuestionType.GAME);
  }, [openTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    const newTabEnum = tabIndexToEnum[newValue as number];
    setOpenTab(newTabEnum);
    fetchElements(newTabEnum, undefined, undefined, undefined, undefined, undefined, GameQuestionType.GAME);
  };
  const elements = getGameElements(openTab, isSearchResults, centralData);
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
            onClick={handleCloseGamesTabs}
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
        <CardGallery<IGameTemplate>
          screenSize={screenSize}
          searchTerm={isSearchResults ? centralData.searchTerms : undefined}
          grades={isSearchResults ? centralData.selectedGrades : undefined}
          galleryElements={elements as IGameTemplate[]}
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
