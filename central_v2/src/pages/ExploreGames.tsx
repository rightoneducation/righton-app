import React, { useState, useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { APIClients, IGameTemplate } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce'
import { ScreenSize } from '../lib/HostModels';
import ExploreGamesUpper from '../components/ExploreGamesUpper';
import EGMostPopular from '../components/EGMostPopular';
import fetchMoreGames from "../lib/HelperFunctions";
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';

interface ExploreGamesProps {
  apiClients: APIClients;
}

const ExploreGamesContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  backgroundColor: `${theme.palette.primary.extraDarkBlue}`,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    // Chrome and Safari
    display: 'none',
  },
  scrollbarWidth: 'none', // Firefox
  '-ms-overflow-style': 'none',
}));

export default function ExploreGames({ apiClients }: ExploreGamesProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isXLScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const screenSize = isLargeScreen  // eslint-disable-line
      ? ScreenSize.LARGE 
      : isMediumScreen 
        ? ScreenSize.MEDIUM 
        : ScreenSize.SMALL;

  const [recommendedGames, setRecommendedGames] = useState<IGameTemplate[]>([]);
  const [mostPopularGames, setMostPopularGames] = useState<IGameTemplate[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [searchedGames, setSearchedGames] = useState<IGameTemplate[]>([]);
  const [sort, setSort] = useState<{ field: string; direction: string | null }>({
    field: '',
    direction: null,
  });
  
  const handleSearchChange = (newSearch: string) => {
    setSearchTerm(newSearch);
  };

  const handleGradeChange = (newGrades: string[]) => {
    setSelectedGrades(newGrades);
  };

  const handleSortChange = (newSort: { field: string; direction: string | null }) => {
    setSort(newSort);
    console.log(newSort);
  };

  useEffect(() => {
    if (apiClients) {
      apiClients.gameTemplate.listGameTemplates(12, null, null, null)
        .then(response => {
          setRecommendedGames(response?.gameTemplates || []);
          setNextToken(response?.nextToken || null);
          console.log("Initial Next Token:", response?.nextToken);
        })
        .catch(error => {
          console.error('Error fetching games:', error);
        });

      apiClients.gameTemplate.listGameTemplates(12, null, null, null)
        .then(response => {
          setMostPopularGames(response?.gameTemplates || []);
          setNextToken(response?.nextToken || null);
          console.log("Initial Next Token (mp games):", response?.nextToken);
        })
        .catch(error => {
          console.error('Error fetching games:', error);
        });
    }
  }, [apiClients]);


  return (
    <ExploreGamesContainer id = "scrollableDiv">
      <InfiniteScroll
        dataLength={mostPopularGames.length}
        next={() => fetchMoreGames(apiClients, nextToken || '', setNextToken, setMostPopularGames, setLoading, loading)}
        hasMore = {nextToken !== null}
        loader=<h4>loading...</h4>
        scrollableTarget="scrollableDiv"
        style={{ width: '100vw', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
          <SearchBar screenSize={screenSize} onSearchChange={handleSearchChange} onGradeChange={handleGradeChange} onSortChange={handleSortChange}/>
          {searchTerm || selectedGrades.length > 0 ? (
            <SearchResults screenSize={screenSize} apiClients={apiClients} searchedGames={recommendedGames} searchTerm={searchTerm} grades={selectedGrades}/>
          ) :(
            <>
            <ExploreGamesUpper screenSize={screenSize} apiClients={apiClients} recommendedGames={recommendedGames} />
            <EGMostPopular screenSize={screenSize} apiClients={apiClients} mostPopularGames={mostPopularGames} />
            </>
          )}
      </InfiniteScroll>
    </ExploreGamesContainer>
  );
}
