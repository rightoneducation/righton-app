import React, { useState, useEffect, useCallback, useContext } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IGameTemplate, GradeTarget, PublicPrivateType, SortType, SortDirection } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce'
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import { ScreenSize } from '../lib/CentralModels';
import { ExploreGamesMainContainer, ExploreGamesUpperContainer } from '../lib/styledcomponents/ExploreGamesStyledComponents';
import useExploreGamesStateManager from '../hooks/useExploreGamesStateManager';
import RecommendedGames from '../components/exploregames/RecommendedGames';
import EGMostPopular from '../components/exploregames/EGMostPopular';
import SearchBar from '../components/searchbar/SearchBar';
import SearchResults from '../components/exploregames/SearchResults';

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
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreGames
  } = useExploreGamesStateManager();
  
  return (
    <ExploreGamesMainContainer id = "scrollableDiv">
      <InfiniteScroll
        dataLength={mostPopularGames.length}
        next={loadMoreGames}
        hasMore = {nextToken !== null}
        loader=<h4>loading...</h4>
        scrollableTarget="scrollableDiv"
        style={{ width: '100vw', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
          <SearchBar screenSize={screenSize} handleSearchChange={handleSearchChange} handleChooseGrades={handleChooseGrades} handleSortChange={handleSortChange}/>
            {searchTerms.length > 0 || searchedGames.length > 0 || selectedGrades.length > 0 ? (
          <SearchResults screenSize={screenSize} apiClients={apiClients} searchTerm={searchTerms} grades={selectedGrades} searchedGames={searchedGames} isLoading={isLoading}/>
          ) : (
            <>
              <ExploreGamesUpperContainer screenSize={screenSize}>
                <RecommendedGames screenSize={screenSize} apiClients={apiClients} recommendedGames={recommendedGames}/>
              </ExploreGamesUpperContainer>
              <EGMostPopular screenSize={screenSize} apiClients={apiClients} mostPopularGames={mostPopularGames}/>
            </>
          )}
      </InfiniteScroll>
    </ExploreGamesMainContainer>
  );
}
