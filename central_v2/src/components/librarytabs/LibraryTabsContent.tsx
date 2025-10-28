import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, CircularProgress, useTheme, Typography } from '@mui/material';
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
import SearchBar from '../searchbar/SearchBar';
import CardGallery from '../cardgallery/CardGallery';
import {
  ScreenSize,
  GameQuestionType,
  LibraryTabEnum,
} from '../../lib/CentralModels';
import {
  ContentContainer,
  ScrollContainer,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import {
  getGameElements,
  getQuestionElements,
} from '../../lib/helperfunctions/MyLibraryHelperFunctions';

interface LibraryTabsProps<T extends IGameTemplate | IQuestionTemplate> {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  openTab: LibraryTabEnum;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  handleGameView?: (element: IGameTemplate, elements: IGameTemplate[]) => void;
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

export default function LibraryTabsContent({
  gameQuestion,
  screenSize,
  openTab,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handleGameView,
  handleQuestionView,
  loadMoreLibrary,
}: LibraryTabsProps<IGameTemplate | IQuestionTemplate>) {
  const centralData = useCentralDataState();
  const theme = useTheme();
  const isDefaultSort = gameQuestion === GameQuestionType.GAME
    ? (centralData.sort.field === SortType.listGameTemplates && 
       centralData.sort.direction === SortDirection.ASC) ||
      (centralData.sort.field === SortType.listGameTemplatesByDate && 
       centralData.sort.direction === SortDirection.DESC)
    : (centralData.sort.field === SortType.listQuestionTemplates && 
       centralData.sort.direction === SortDirection.ASC) ||
      (centralData.sort.field === SortType.listQuestionTemplatesByDate && 
       centralData.sort.direction === SortDirection.DESC);
  const isSearchResults =
    centralData.searchTerms.length > 0 ||
    centralData.selectedGrades.length > 0 ||
    !isDefaultSort;
  const elements =
    gameQuestion === GameQuestionType.GAME
      ? getGameElements(openTab, isSearchResults, centralData)
      : getQuestionElements(openTab, isSearchResults, centralData);

  const hasMore = openTab !== LibraryTabEnum.FAVORITES ? 
    centralData.nextToken !== null :
    false;

  let padding = 0;
  switch (screenSize){
    case (ScreenSize.LARGE):
      padding = 144;
      break;
    case (ScreenSize.MEDIUM):
      padding = 112;
      break;
    case (ScreenSize.SMALL):
    default:
      padding = 80;
      break
  }

  let gameQuestionText = '';
  switch (gameQuestion) {
    case (GameQuestionType.GAME):
      gameQuestionText = 'games';
      break;
    case (GameQuestionType.QUESTION):
    default:
      gameQuestionText = 'questions';
      break;
  }

  let emptyText = '';
  switch (openTab){
    case (LibraryTabEnum.PUBLIC):
      emptyText = `public ${gameQuestionText}`;
      break;
    case (LibraryTabEnum.PRIVATE):
      emptyText = `private ${gameQuestionText}`;
      break;
    case (LibraryTabEnum.DRAFTS):
      emptyText = `draft ${gameQuestionText}`;
      break;
    case (LibraryTabEnum.FAVORITES):
    default:
      emptyText = `favorite ${gameQuestionText}`;
      break;
  }
  const handleLoadMore = async () => {
    loadMoreLibrary(openTab, centralData.searchTerms, centralData.nextToken);
  };

  const cardGallery = [
     gameQuestion === GameQuestionType.GAME ? (
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
          handleView={handleGameView}
          isLoading={centralData.isLoading}
          isMyLibrary
        />
      ) : (
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
          handleView={handleQuestionView}
          isLoading={centralData.isLoading}
          isMyLibrary
          isMyLibraryQuestion
        />
      )
  ]
  
  return (
    <ContentContainer>
      <SearchBar
        screenSize={screenSize}
        searchTerms={centralData.searchTerms}
        handleSearchChange={handleSearchChange}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
      />
     
      { centralData.isLoading // eslint-disable-line no-nested-ternary
        ? <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'column', justifyContent: 'center'}}>
              <CircularProgress style={{ color: '#FFF'}} />
          </Box>
        : elements && elements.length > 0 ? (
          <ScrollContainer id="scrollableDiv">
            <InfiniteScroll
              dataLength={elements.length}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={
                <Box
                  style={{
                    position: 'relative',
                    bottom: '75px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  { !centralData.isLoading &&
                  <CircularProgress style={{ color: '#FFF' }} />
                  }
                </Box>
              }
              scrollableTarget="scrollableDiv"
            >
              {cardGallery}
            </InfiniteScroll>
          </ScrollContainer> 
          ) : (
              <Typography sx={{
              fontFamily: 'Poppins',
              fontSize: '24px',
              lineHeight: '24px',
              fontWeight: '700',
              color: '#FFF',
              paddingTop: `${padding}px`,
              textAlign: 'center'
            }}>
              {centralData.searchTerms.length > 0 
              ? `There are no ${emptyText} that match your search.`
              : `You currently don’t have any ${emptyText}.`}
            </Typography>
          )
      }
    </ContentContainer>
  );
}
