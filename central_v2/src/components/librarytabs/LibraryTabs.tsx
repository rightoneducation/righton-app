import React, { useState } from 'react';
import { Tabs } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import {
  ElementType,
  GalleryType,
  IGameTemplate,
  IQuestionTemplate,
  GradeTarget,
  SortType,
  SortDirection,
  PublicPrivateType,
} from '@righton/networking';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../../hooks/context/useCentralDataContext';
import CardGallery from '../cardgallery/CardGallery';
import SearchBar from '../searchbar/SearchBar';
import {
  ScreenSize,
  GameQuestionType,
  LibraryTabEnum,
} from '../../lib/CentralModels';
import {
  ContentContainer,
  TabContent,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { LibraryTab } from '../../lib/styledcomponents/MyLibraryStyledComponent';
import {
  getGameElements,
  getQuestionElements,
  getTabLabel,
} from '../../lib/helperfunctions/MyLibraryHelperFunctions';
import tabPublicIcon from '../../images/tabPublic.svg';
import tabDraftsIcon from '../../images/tabDrafts.svg';
import tabFavoritesIcon from '../../images/tabFavorites.svg';
import tabPrivateIcon from '../../images/tabPrivate.svg';
import LibraryTabsContent from './LibraryTabsContent';

interface LibraryTabsProps<T extends IGameTemplate | IQuestionTemplate> {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  openTab: LibraryTabEnum;
  setOpenTab: (tab: LibraryTabEnum) => void;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType) => void;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
  handleGameView: (element: IGameTemplate, elements: IGameTemplate[]) => void;
  handleQuestionView: (
    element: IQuestionTemplate,
    elements: IQuestionTemplate[],
  ) => void;
  loadMoreLibrary: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
  ) => void;
}

export default function LibraryTabs({
  gameQuestion,
  screenSize,
  openTab,
  setOpenTab,
  setIsTabsOpen,
  handlePublicPrivateChange,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  fetchElements,
  handleGameView,
  handleQuestionView,
  loadMoreLibrary,
}: LibraryTabsProps<IGameTemplate | IQuestionTemplate>) {
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const isDefaultSort = centralData.sort.field === SortType.listGameTemplates && 
                        centralData.sort.direction === SortDirection.ASC;
  const isSearchResults =
    centralData.searchTerms.length > 0 ||
    centralData.selectedGrades.length > 0 ||
    !isDefaultSort;

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

  if (centralData.isLibraryInit) {
    const librarySort = {
      field: gameQuestion === GameQuestionType.GAME 
        ? SortType.listGameTemplatesByDate 
        : SortType.listQuestionTemplatesByDate,
      direction: SortDirection.DESC,
    };
    centralDataDispatch({
      type: 'SET_SORT',
      payload: librarySort,
    });
    centralDataDispatch({ type: 'SET_IS_LIBRARY_INIT', payload: false });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    centralDataDispatch({ type: 'SET_OPEN_TAB', payload: openTab });
    fetchElements(openTab, '', null, true);
  }

  const handleChange = (
    event: React.SyntheticEvent,
    newTab: LibraryTabEnum,
  ) => {
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
    centralDataDispatch({ type: 'SET_OPEN_TAB', payload: newTab });
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    setOpenTab(newTab);
    fetchElements(newTab, '', null, true);
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
      <LibraryTabsContent
        gameQuestion={gameQuestion}
        screenSize={screenSize}
        openTab={openTab}
        setIsTabsOpen={setIsTabsOpen}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
        handleSearchChange={handleSearchChange}
        handleGameView={handleGameView}
        handleQuestionView={handleQuestionView}
        loadMoreLibrary={loadMoreLibrary}
      />
    </TabContent>
  );
}
