import React, { useState, useEffect, useCallback } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IAPIClients, IGameTemplate, GradeTarget, PublicPrivateType, SortType, SortDirection } from '@righton/networking';
import { useTranslation } from 'react-i18next';
import { useTheme, styled } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash/debounce'
import { ScreenSize } from '../lib/CentralModels';
import ExploreGamesUpper from '../components/ExploreGamesUpper';
import EGMostPopular from '../components/EGMostPopular';
import { handleGameSearch } from "../lib/HelperFunctions";
import SearchBar from '../components/searchbar/SearchBar';
import SearchResults from '../components/SearchResults';

interface ExploreGamesProps {
apiClients: IAPIClients;
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
  const defaultFetchLimit = 9;
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
  const [searchedGames, setSearchedGames]= useState<IGameTemplate[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<GradeTarget[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const debounceInterval = 800;
  const [sort, setSort] = useState<{ field: SortType; direction: SortDirection | null }>({
    field: SortType.listGameTemplatesByDate,
    direction: SortDirection.DESC,
  });

  const handleChooseGrades = (grades: GradeTarget[]) => {
    setSelectedGrades((prev) => [...grades]);
    setIsLoading(true);
    setNextToken(null);
    handleGameSearch(apiClients, PublicPrivateType.PUBLIC, null, null, searchTerms, sort.direction ?? SortDirection.ASC, sort.field, [...grades]).then((response) => {
      setIsLoading(false);
      setSearchedGames(response.games);
    })
  };

  const handleSortChange = (newSort: { field: SortType; direction: SortDirection | null }) => {
    setSort(newSort);
    setIsLoading(true);
    setNextToken(null);
    handleGameSearch(apiClients, PublicPrivateType.PUBLIC, null, null, searchTerms, newSort.direction ?? SortDirection.ASC, newSort.field, selectedGrades).then((response) => {
      setIsLoading(false);
      setSearchedGames(response.games);
    })
  };

  // note that all parameters are sent through as props
  // this avoids stale state issues from the useCallback
  const debouncedSearch = useCallback(  // eslint-disable-line
    debounce((search: string, sortDirection: SortDirection, gradeTargets: GradeTarget[], sortType: SortType) => {
      setNextToken(null);
      handleGameSearch(apiClients, PublicPrivateType.PUBLIC, null, null, search, sortDirection, sortType, gradeTargets).then((response) => {
        setIsLoading(false);
        setSearchedGames(response.games);
      })
    }, debounceInterval),
    [debounceInterval]
  );

  const handleSearchChange = (searchString: string) => {
    setIsLoading(true);
    setSearchTerms(searchString);
    debouncedSearch(searchString, sort.direction ?? SortDirection.ASC, selectedGrades, sort.field);
  };

  useEffect(() => {
    if (apiClients) {
      apiClients.gameTemplate.listGameTemplates(PublicPrivateType.PUBLIC, 12, null, null, null, selectedGrades ?? [])
        .then(response => {
          setRecommendedGames(response?.gameTemplates || []);
          setMostPopularGames(response?.gameTemplates || []);
          setNextToken(response?.nextToken || null);
        })
        .catch(error => {
          console.error('Error fetching games:', error);
        });
    }
  }, []); // eslint-disable-line

  const loadMoreGames = () => {
    if (nextToken && !isFetching) {
      setIsFetching(true);
      apiClients.gameTemplate.listGameTemplates(PublicPrivateType.PUBLIC, 12, nextToken, null, null, selectedGrades ?? [])
        .then(response => {
          if (response){
            setMostPopularGames(prev => [...prev, ...response.gameTemplates]);
            setNextToken(response.nextToken || null);
            setIsFetching(false);
          }
        })
        .catch(error => {
          console.error('Error fetching more games:', error);
          setIsFetching(false);
        });
    }
  }
  return (
    <ExploreGamesContainer id = "scrollableDiv">
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
              <ExploreGamesUpper screenSize={screenSize} apiClients={apiClients} recommendedGames={recommendedGames} />
              <EGMostPopular screenSize={screenSize} apiClients={apiClients} mostPopularGames={mostPopularGames}/>
            </>
          )}
      </InfiniteScroll>
    </ExploreGamesContainer>
  );
}
