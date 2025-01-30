import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import {
  IGameTemplate,
  PublicPrivateType,
  SortDirection,
  SortType,
  GradeTarget,
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from './context/useAPIClientsContext';

interface UseExploreGamesStateManagerProps {
  recommendedGames: IGameTemplate[];
  mostPopularGames: IGameTemplate[];
  searchedGames: IGameTemplate[];
  nextToken: string | null;
  isLoading: boolean;
  searchTerms: string;
  selectedGrades: GradeTarget[];
  isTabsOpen: boolean;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  loadMoreGames: () => void;
}

export default function useExploreGamesStateManager(): UseExploreGamesStateManagerProps {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const debounceInterval = 800;
  const [recommendedGames, setRecommendedGames] = useState<IGameTemplate[]>([]);
  const [mostPopularGames, setMostPopularGames] = useState<IGameTemplate[]>([]);
  const [searchedGames, setSearchedGames] = useState<IGameTemplate[]>([]);
  const [searchTerms, setSearchTerms] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<GradeTarget[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfiniteScroll, setIsLoadingInfiniteScroll] = useState(false);
  const [sort, setSort] = useState<{
    field: SortType;
    direction: SortDirection | null;
  }>({
    field: SortType.listGameTemplatesByDate,
    direction: null,
  });
  const [isTabsOpen, setIsTabsOpen] = useState(false);

  const initGames = async () => {
    setIsLoading(true);
    apiClients?.centralDataManager?.initGames().then((response) => {
      setIsLoading(false);
      setRecommendedGames(response.games);
      setMostPopularGames(response.games);
      setNextToken(response.nextToken);
    });
  };

  const handleChooseGrades = (grades: GradeTarget[]) => {
    setSelectedGrades((prev) => [...grades]);
    setIsLoading(true);
    setNextToken(null);
    apiClients?.centralDataManager
      ?.searchForGameTemplates(
        PublicPrivateType.PUBLIC,
        null,
        null,
        searchTerms,
        sort.direction ?? SortDirection.ASC,
        sort.field,
        [...grades],
      )
      .then((response) => {
        setIsLoading(false);
        setSearchedGames(response.games);
      });
  };

  const handleSortChange = (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => {
    setSort(newSort);
    setIsLoading(true);
    setNextToken(null);
    apiClients?.centralDataManager
      ?.searchForGameTemplates(
        PublicPrivateType.PUBLIC,
        null,
        null,
        searchTerms,
        newSort.direction ?? SortDirection.ASC,
        newSort.field,
        selectedGrades,
      )
      .then((response) => {
        setIsLoading(false);
        setSearchedGames(response.games);
      });
  };

  // note that all parameters are sent through as props
  // this avoids stale state issues from the useCallback
  const debouncedSearch = useCallback( // eslint-disable-line
    debounce(
      (
        search: string,
        sortDirection: SortDirection,
        gradeTargets: GradeTarget[],
        sortType: SortType,
      ) => {
        setIsLoading(true);
        setSearchedGames([]);
        setSearchTerms(search);
        setNextToken(null);
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            PublicPrivateType.PUBLIC,
            null,
            null,
            search,
            sortDirection,
            sortType,
            gradeTargets,
          )
          .then((response) => {
            setIsLoading(false);
            setSearchedGames(response.games);
          });
      },
      debounceInterval,
    ),
    [debounceInterval],
  );

  const handleSearchChange = (searchString: string) => {
    if (searchString !== ''){
      debouncedSearch(
        searchString,
        sort.direction ?? SortDirection.ASC,
        selectedGrades,
        sort.field,
      );
    }
  };

  const loadMoreGames = () => {
    if (nextToken && !isLoadingInfiniteScroll) {
      setIsLoadingInfiniteScroll(true);
      apiClients.gameTemplate
        .listGameTemplates(
          PublicPrivateType.PUBLIC,
          12,
          nextToken,
          null,
          null,
          selectedGrades ?? [],
        )
        .then((response) => {
          if (response) {
            setMostPopularGames((prev) => [...prev, ...response.gameTemplates]);
            setNextToken(response.nextToken || null);
            setIsLoadingInfiniteScroll(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching more games:', error);
          setIsLoadingInfiniteScroll(false);
        });
    }
  };

  useEffect(() => {
    try {
      initGames();
    } catch (error) {
      console.log('Error:', error);
    }
  }, []); // eslint-disable-line
  return {
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
    loadMoreGames,
  };
}
