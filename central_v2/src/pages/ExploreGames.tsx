import React, { useState, useEffect, useCallback, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ElementType, GalleryType, IGameTemplate, GradeTarget, PublicPrivateType, SortType, SortDirection } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce'
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ScreenSize } from '../lib/CentralModels';
import { ExploreGamesMainContainer, ExploreGamesUpperContainer } from '../lib/styledcomponents/ExploreGamesStyledComponents';
import useExploreGamesStateManager from '../hooks/useExploreGamesStateManager';
import Recommended from '../components/explore/Recommended';
import CardGallery from '../components/cardgallery/CardGallery';
import SearchBar from '../components/searchbar/SearchBar';

// interface ExploreGamesProps {
// }

export default function ExploreGames() {
  const theme = useTheme();
  const { t } = useTranslation();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const screenSize = isLargeScreen  // eslint-disable-line
      ? ScreenSize.LARGE 
      : isMediumScreen 
        ? ScreenSize.MEDIUM 
        : ScreenSize.SMALL;
  const {
    recommendedGames,
    mostPopularGames,
    searchedGames,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    isTabsOpen,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreGames
  } = useExploreGamesStateManager();
  return (
    <ExploreGamesMainContainer id = "scrollableDiv">
      <SearchBar screenSize={screenSize} handleSearchChange={handleSearchChange} handleChooseGrades={handleChooseGrades} handleSortChange={handleSortChange}/>
        {searchTerms.length > 0 || searchedGames.length > 0 || selectedGrades.length > 0 ? (
            <CardGallery screenSize={screenSize} searchTerm={searchTerms} grades={selectedGrades} galleryElements={searchedGames} isLoading={isLoading} elementType={ElementType.GAME} galleryType={GalleryType.SEARCH_RESULTS} setIsTabsOpen={setIsTabsOpen}/>
      ) : (
        <>
          <ExploreGamesUpperContainer screenSize={screenSize}>
            <Recommended screenSize={screenSize} recommendedElements={recommendedGames} elementType={ElementType.GAME} setIsTabsOpen={setIsTabsOpen}/>
          </ExploreGamesUpperContainer>
          <InfiniteScroll
            dataLength={mostPopularGames.length}
            next={loadMoreGames}
            hasMore = {nextToken !== null}
            loader=<h4>loading...</h4>
            scrollableTarget="scrollableDiv"
            style={{ width: '100vw', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <CardGallery screenSize={screenSize} galleryElements={mostPopularGames} elementType={ElementType.GAME} galleryType={GalleryType.MOST_POPULAR} setIsTabsOpen={setIsTabsOpen}/>
          </InfiniteScroll>
        </>
      )}
    </ExploreGamesMainContainer>
  );
}
