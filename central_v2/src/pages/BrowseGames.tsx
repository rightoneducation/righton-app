import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  SortDirection,
  SortType,
  PublicPrivateType,
  GalleryType,
  IGameTemplate,
  GradeTarget,
} from '@righton/networking';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import { ScreenSize } from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import GamesLibraryGallery from '../components/cardgallery/GamesLibraryGallery';
import PaginatedNavigation from '../components/pagination/PaginatedNavigation';
import SearchBar from '../components/searchbar/SearchBar';
import GalleryHeaderText from '../components/cardgallery/GalleryHeaderText';

const PAGE_SIZE = 12;
/**
 * Scan window per request. Deliberately larger than PAGE_SIZE: AppSync applies
 * `filter` AFTER `limit`, so a limit of 12 bounds items *scanned* and a filtered
 * page can come back with 0-11 items plus a token. Scanning wider and buffering
 * the survivors keeps pages a consistent size. Same top-up shape as initGames.
 */
const SCAN_WINDOW = 60;

const DEFAULT_SORT = {
  field: SortType.listGameTemplates,
  direction: SortDirection.DESC as SortDirection | null,
};

type Query = {
  search: string;
  grades: GradeTarget[];
  sort: { field: SortType; direction: SortDirection | null };
};

const EMPTY_QUERY: Query = {
  search: '',
  grades: [],
  sort: DEFAULT_SORT,
};

/**
 * Mirrors LibraryTabsContent's isDefaultSort/isSearchResults pair -- grades and a
 * non-default sort count as queries in their own right, not just a typed term.
 */
const isQueryActive = (query: Query): boolean => {
  const isDefaultSort =
    (query.sort.field === SortType.listGameTemplates ||
      query.sort.field === SortType.listGameTemplatesByDate) &&
    query.sort.direction === SortDirection.DESC;
  return query.search.length > 0 || query.grades.length > 0 || !isDefaultSort;
};

interface BrowseGamesProps {
  screenSize: ScreenSize;
}

export default function BrowseGames({ screenSize }: BrowseGamesProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();

  // the query the grid is currently showing -- NOT raw central state, because
  // SelectGradesMenu dispatches SET_SELECTED_GRADES on every checkbox tick,
  // before Choose is pressed
  const [query, setQuery] = useState<Query>(EMPTY_QUERY);
  const [pages, setPages] = useState<IGameTemplate[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // survivors of the filter not yet handed to a page, and the server position
  const buffer = useRef<IGameTemplate[]>([]);
  // null means "start from the beginning", so it cannot double as "no more to
  // fetch" -- exhaustion is tracked separately or the first request never fires
  const cursor = useRef<string | null>(null);
  const isExhausted = useRef(false);
  const requestId = useRef(0);

  const pageCount = pages.length;
  const hasNext = currentPage + 1 < pageCount || hasMore;

  /**
   * Fills the buffer until it can serve a full page, then commits that page.
   * The while loop is the filter-after-limit top-up: one iteration usually
   * suffices because SCAN_WINDOW is 5x PAGE_SIZE, and leftovers carry forward
   * rather than being discarded.
   */
  const fetchNextPage = async (activeQuery: Query, id: number) => {
    setIsFetching(true);
    try {
      while (buffer.current.length < PAGE_SIZE && !isExhausted.current) {
        const response =
          // eslint-disable-next-line no-await-in-loop
          await apiClients.centralDataManager?.searchForGameTemplates(
            PublicPrivateType.PUBLIC,
            SCAN_WINDOW,
            cursor.current,
            activeQuery.search,
            activeQuery.sort.direction ?? SortDirection.DESC,
            activeQuery.sort.field,
            activeQuery.grades,
            null,
          );
        if (id !== requestId.current) return; // a newer query superseded this one
        if (!response) break;
        buffer.current.push(...response.games);
        cursor.current = response.nextToken ?? null;
        if (cursor.current === null) isExhausted.current = true;
      }
      if (id !== requestId.current) return;
      const page = buffer.current.splice(0, PAGE_SIZE);
      setHasMore(buffer.current.length > 0 || !isExhausted.current);
      if (page.length > 0) setPages((prev) => [...prev, page]);
    } catch (error) {
      console.error('Failed to load games page', error);
      if (id === requestId.current) setHasMore(false);
    } finally {
      if (id === requestId.current) setIsFetching(false);
    }
  };

  /** Any query change discards the buffer, cursor and every cached page. */
  const runQuery = (nextQuery: Query) => {
    requestId.current += 1;
    buffer.current = [];
    cursor.current = null;
    isExhausted.current = false;
    setQuery(nextQuery);
    setPages([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchNextPage(nextQuery, requestId.current);
  };

  /**
   * Central state survives route changes, so this page can arrive holding
   * another screen's leftovers. These are the same resets
   * Header.handleButtonClick performs on navigation -- reused here because a
   * direct URL or the Browse button bypasses it.
   */
  useEffect(() => {
    centralDataDispatch({ type: 'SET_IS_TABS_OPEN', payload: false });
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
    centralDataDispatch({ type: 'SET_SEARCHED_GAMES', payload: [] });
    centralDataDispatch({ type: 'SET_SELECTED_GRADES', payload: [] });
    centralDataDispatch({ type: 'SET_SORT', payload: DEFAULT_SORT });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    runQuery(EMPTY_QUERY);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const debouncedSearch = useCallback( // eslint-disable-line
    debounce((search: string, current: Query) => {
      runQuery({ ...current, search });
    }, 800),
    [],
  );

  const handleSearchChange = (searchString: string) => {
    const trimmed = searchString.trim();
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: trimmed });
    debouncedSearch(trimmed, query);
  };

  const handleChooseGrades = (grades: GradeTarget[]) => {
    centralDataDispatch({ type: 'SET_SELECTED_GRADES', payload: grades });
    runQuery({ ...query, grades });
  };

  const handleSortChange = (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => {
    centralDataDispatch({ type: 'SET_SORT', payload: newSort });
    runQuery({ ...query, sort: newSort });
  };

  const handlePageChange = (page: number) => {
    if (page < pageCount) {
      setCurrentPage(page);
      return;
    }
    if (hasMore && !isFetching) {
      requestId.current += 1;
      setCurrentPage(page);
      fetchNextPage(query, requestId.current);
    }
  };

  const handleView = (game: IGameTemplate) => {
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: null });
    navigate(`/games/${game.publicPrivateType}/${game.id}`);
  };

  const pageGames = pages[currentPage] ?? [];
  // hold the outgoing page while the next is in flight so the grid height --
  // and the navigator below it -- cannot move
  const lastFilledPage = useRef<IGameTemplate[]>([]);
  if (pageGames.length > 0) lastFilledPage.current = pageGames;
  const isAwaitingPage = pageGames.length === 0 && pages.length > 0;
  const visibleGames = isAwaitingPage ? lastFilledPage.current : pageGames;

  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      <ExploreGamesUpperContainer screenSize={screenSize}>
        <SearchBar
          isSearchResults
          screenSize={screenSize}
          searchTerms={centralData.searchTerms}
          handleSearchChange={handleSearchChange}
          handleChooseGrades={handleChooseGrades}
          handleSortChange={handleSortChange}
        />
      </ExploreGamesUpperContainer>
      <Box
        style={{
          width: '100vw',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          backgroundColor: theme.palette.primary.creamBackgroundColor,
        }}
      >
        <GamesLibraryGallery
          screenSize={screenSize}
          header={
            isQueryActive(query) ? (
              <GalleryHeaderText<IGameTemplate>
                screenSize={screenSize}
                galleryType={GalleryType.SEARCH_RESULTS}
                searchedTerm={query.search}
                grades={query.grades}
                isLoading={isFetching}
                // the result count is deliberately withheld: with cursor
                // pagination the total is unknown until the query is exhausted,
                // so it would climb as the user pages. Passing [] only when the
                // set is genuinely empty keeps the no-results message working.
                searchedElements={
                  !hasMore && pages.length === 0 ? [] : undefined
                }
              />
            ) : undefined
          }
          galleryElements={visibleGames}
          handleView={handleView}
          isLoading={isFetching && pages.length === 0}
          footer={
            // fixed height so swapping the nav for the spinner cannot change the
            // footer's height -- that would reintroduce the jump this solved
            <Box
              sx={{
                minHeight: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isAwaitingPage || (isFetching && pages.length > 0) ? (
                <CircularProgress
                  size={32}
                  style={{ color: theme.palette.primary.darkBlueCardColor }}
                />
              ) : (
                <PaginatedNavigation
                  currentPage={currentPage}
                  pageCount={pageCount}
                  hasNext={hasNext}
                  isLoading={isFetching}
                  onPageChange={handlePageChange}
                  screenSize={screenSize}
                />
              )}
            </Box>
          }
        />
      </Box>
      <Box
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexGrow: 1,
          backgroundColor: theme.palette.primary.creamBackgroundColor,
        }}
      />
    </ExploreGamesMainContainer>
  );
}
