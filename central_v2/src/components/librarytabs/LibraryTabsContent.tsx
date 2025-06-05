import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, CircularProgress, useTheme } from '@mui/material';
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
import SearchBar from '../searchbar/SearchBar';
import CardGallery from '../cardgallery/CardGallery';
import { ScreenSize, GameQuestionType, LibraryTabEnum } from '../../lib/CentralModels';
import { 
  ContentContainer,
  ScrollContainer 
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { useCentralDataState } from '../../hooks/context/useCentralDataContext';
import { getGameElements, getQuestionElements } from '../../lib/helperfunctions/MyLibraryHelperFunctions';

interface LibraryTabsProps<T extends IGameTemplate | IQuestionTemplate> {
  gameQuestion: GameQuestionType;
  screenSize: ScreenSize;
  openTab: LibraryTabEnum;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  handleGameView?: (element: IGameTemplate, elements: IGameTemplate[]) => void;
  handleQuestionView: (element: IQuestionTemplate, elements: IQuestionTemplate[]) => void;
  loadMoreLibrary: (libraryTab?: LibraryTabEnum, searchTerms?: string, nextToken?: string | null) => void;
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
  loadMoreLibrary
}: LibraryTabsProps<IGameTemplate | IQuestionTemplate>) {
  const centralData = useCentralDataState();
  const theme = useTheme();
  const isSearchResults = centralData.searchTerms.length > 0 || centralData.selectedGrades.length > 0 || (centralData.sort.field !== SortType.listGameTemplates && centralData.sort.direction !== SortDirection.ASC);
  const elements = gameQuestion === GameQuestionType.GAME ?
    getGameElements(openTab, isSearchResults, centralData)
    : getQuestionElements(openTab, isSearchResults, centralData);

  const handleLoadMore = async () => {
    loadMoreLibrary(openTab, centralData.searchTerms, centralData.nextToken);
  }

  return (
     <ContentContainer >
      <SearchBar
        screenSize={screenSize}
        searchTerms={centralData.searchTerms}
        handleSearchChange={handleSearchChange}
        handleChooseGrades={handleChooseGrades}
        handleSortChange={handleSortChange}
      />
      <ScrollContainer id="scrollableDiv">
        <InfiniteScroll
          dataLength={elements.length}
          next={handleLoadMore}
          hasMore={centralData.nextToken !== null}
          loader={
            <Box style={{position: 'relative', bottom: '75px', display: 'flex', justifyContent: 'center'}}> 
              <CircularProgress style={{ color: '#FFF' }} />
            </Box>
          }
          scrollableTarget="scrollableDiv"
        >
          { gameQuestion === GameQuestionType.GAME ?
            <CardGallery<IGameTemplate>
              screenSize={screenSize}
              searchTerm={isSearchResults ? centralData.searchTerms : undefined}
              grades={isSearchResults ? centralData.selectedGrades : undefined}
              galleryElements={elements as IGameTemplate[]} 
              elementType={ElementType.GAME}
              galleryType={ isSearchResults ? GalleryType.SEARCH_RESULTS : GalleryType.MOST_POPULAR}
              setIsTabsOpen={setIsTabsOpen}
              handleView={handleGameView}
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
              handleView={handleQuestionView}
              isLoading={centralData.isLoading}
              isMyLibrary
              isMyLibraryQuestion
            />
          }
          </InfiniteScroll>
        </ScrollContainer>
    </ContentContainer>
  )
}