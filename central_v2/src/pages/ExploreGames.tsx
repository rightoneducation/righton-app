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
  const [searchedGames, setSearchedGames] = useState<IGameTemplate[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
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
          setSearchedGames(response?.gameTemplates || []);
          setNextToken(response?.nextToken || null);
          console.log("Initial Next Token (searched games):", response?.nextToken);
        })
        .catch(error => {
          console.error('Error fetching games:', error);
        });
    }
  }, [apiClients]);


  return (
    <ExploreGamesContainer id = "scrollableDiv">
      <InfiniteScroll
        dataLength={searchedGames.length}
        next={() => fetchMoreGames(apiClients, nextToken || '', setNextToken, setSearchedGames, setLoading, loading)}
        hasMore = {nextToken !== null}
        loader=<h4>loading...</h4>
        scrollableTarget="scrollableDiv"
        style={{ width: '100vw', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
      >
          <SearchBar screenSize={screenSize} onSearchChange={handleSearchChange}/>
          {/* right now based on if typed anything, will change to if enter or whatever */}
          {searchQuery === '' && (
            <>
            <ExploreGamesUpper screenSize={screenSize} apiClients={apiClients} recommendedGames={recommendedGames} />
            <EGMostPopular screenSize={screenSize} apiClients={apiClients} searchedGames={searchedGames} />
            </>
          )}
      </InfiniteScroll>
    </ExploreGamesContainer>
  );
}
