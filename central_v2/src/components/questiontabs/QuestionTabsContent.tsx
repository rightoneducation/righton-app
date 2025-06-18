import React from 'react';
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
} from '@righton/networking';
import SearchBar from '../searchbar/SearchBar';
import CardGallery from '../cardgallery/CardGallery';
import {
  ScreenSize,
  LibraryTabEnum,
} from '../../lib/CentralModels';
import {
  ContentContainer,
  ScrollContainer,
} from '../../lib/styledcomponents/QuestionTabsStyledComponents';
import { useCentralDataState, useCentralDataDispatch } from '../../hooks/context/useCentralDataContext';
import {
  getQuestionElements,
} from '../../lib/helperfunctions/MyLibraryHelperFunctions';

interface QuestionTabsProps<T extends IGameTemplate | IQuestionTemplate> {
  screenSize: ScreenSize;
  openTab: LibraryTabEnum;
  setIsTabsOpen: (isTabsOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  handleQuestionView: (
    element: IQuestionTemplate,
    elements: IQuestionTemplate[],
  ) => void;
  loadMore: () => void;
}

export default function QuestionTabsContent({
  screenSize,
  openTab,
  setIsTabsOpen,
  handleChooseGrades,
  handleSortChange,
  handleSearchChange,
  handleQuestionView,
  loadMore,
}: QuestionTabsProps<IGameTemplate | IQuestionTemplate>) {
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const theme = useTheme();
  const isSearchResults =
    centralData.searchTerms.length > 0 ||
    centralData.selectedGrades.length > 0 ||
    (centralData.sort.field !== SortType.listGameTemplates &&
      centralData.sort.direction !== SortDirection.ASC);
  const elements = getQuestionElements(openTab, isSearchResults, centralData);
  const handleLoadMore = async () => {
    loadMore();
  };
  return (
    <ContentContainer>
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
          hasMore={centralData.isLoadingInfiniteScroll}
          loader={
            <Box
              style={{
                position: 'relative',
                bottom: '75px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <CircularProgress style={{ color: '#FFF' }} />
            </Box>
          }
          scrollableTarget="scrollableDiv"
        >
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
        </InfiniteScroll>
      </ScrollContainer>
    </ContentContainer>
  );
}
