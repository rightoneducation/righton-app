import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  SortDirection,
  SortType,
  PublicPrivateType,
  GalleryType,
  IGameTemplate,
  IQuestionTemplate,
  GradeTarget,
} from '@righton/networking';
import { Box, CircularProgress, useTheme } from '@mui/material';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from '../hooks/context/useAPIClientsContext';
import {
  useCentralDataState,
  useCentralDataDispatch,
} from '../hooks/context/useCentralDataContext';
import {
  ScreenSize,
  GameQuestionType,
  ISelectedQuestion,
  LibraryTabEnum,
} from '../lib/CentralModels';
import {
  ExploreGamesMainContainer,
  ExploreGamesUpperContainer,
} from '../lib/styledcomponents/ExploreGamesStyledComponents';
import GamesLibraryGallery from '../components/cardgallery/GamesLibraryGallery';
import QuestionsLibraryGallery from '../components/cardgallery/QuestionsLibraryGallery';
import PaginatedNavigation from '../components/pagination/PaginatedNavigation';
import SearchBar from '../components/searchbar/SearchBar';
import GalleryHeaderText from '../components/cardgallery/GalleryHeaderText';
import QuestionTabs from '../components/questiontabs/QuestionTabs';
import QuestionTabsModalBackground from '../components/questiontabs/QuestionTabsModalBackground';
import EditModal from '../components/modal/EditModal';
import ModalBackground from '../components/modal/ModalBackground';

type ITemplate = IGameTemplate | IQuestionTemplate;

const PAGE_SIZE = 12;
/**
 * Scan window per request. Deliberately larger than PAGE_SIZE: AppSync applies
 * `filter` AFTER `limit`, so a limit of 12 bounds items *scanned* and a filtered
 * page can come back with 0-11 items plus a token. Scanning wider and buffering
 * the survivors keeps pages a consistent size. Same top-up shape as initGames.
 */
const SCAN_WINDOW = 60;

const DEFAULT_SORT = (gameQuestion: GameQuestionType) => ({
  field:
    gameQuestion === GameQuestionType.QUESTION
      ? SortType.listQuestionTemplates
      : SortType.listGameTemplates,
  direction: SortDirection.DESC as SortDirection | null,
});

/**
 * SortSearchMenu only ever emits GAME SortType members. Handed straight to
 * searchForQuestionTemplates they match none of its named cases and fall through
 * to the default branch, so Date/Grade/Count would silently no-op on questions.
 */
const GAME_TO_QUESTION_SORT: Partial<Record<SortType, SortType>> = {
  [SortType.listGameTemplates]: SortType.listQuestionTemplates,
  [SortType.listGameTemplatesByDate]: SortType.listQuestionTemplatesByDate,
  [SortType.listGameTemplatesByGrade]: SortType.listQuestionTemplatesByGrade,
  [SortType.listGameTemplatesByQuestionCount]:
    SortType.listQuestionTemplatesByGameCount,
};

type Query = {
  search: string;
  grades: GradeTarget[];
  sort: { field: SortType; direction: SortDirection | null };
};

/**
 * Mirrors LibraryTabsContent's isDefaultSort/isSearchResults pair -- grades and a
 * non-default sort count as queries in their own right, not just a typed term.
 */
const isQueryActive = (
  query: Query,
  gameQuestion: GameQuestionType,
): boolean => {
  const defaults =
    gameQuestion === GameQuestionType.QUESTION
      ? [SortType.listQuestionTemplates, SortType.listQuestionTemplatesByDate]
      : [SortType.listGameTemplates, SortType.listGameTemplatesByDate];
  const isDefaultSort =
    defaults.includes(query.sort.field) &&
    query.sort.direction === SortDirection.DESC;
  return query.search.length > 0 || query.grades.length > 0 || !isDefaultSort;
};

interface BrowseTemplatesProps {
  screenSize: ScreenSize;
  gameQuestion: GameQuestionType;
  // questions only -- the card opens the QuestionTabs overlay, which needs the
  // same central handlers ExploreQuestions threads through
  setIsTabsOpen?: (isTabsOpen: boolean) => void;
  viewQuestion?: (question: IQuestionTemplate) => Promise<ISelectedQuestion>;
  fetchElements?: (libraryTab?: LibraryTabEnum, searchTerms?: string) => void;
  handlePublicPrivateChange?: (newPublicPrivate: PublicPrivateType) => void;
  handleChooseGrades?: (grades: GradeTarget[]) => void;
  handleSortChange?: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange?: (searchString: string) => void;
  loadMore?: () => void;
  deleteQuestionTemplate?: (
    questionId: string,
    type: PublicPrivateType,
  ) => Promise<void>;
}

export default function BrowseTemplates({
  screenSize,
  gameQuestion,
  setIsTabsOpen,
  viewQuestion,
  fetchElements,
  handlePublicPrivateChange,
  // renamed on destructure: this page has its own same-named handlers for the
  // SearchBar, which drive the LOCAL query rather than central state
  handleChooseGrades: centralChooseGrades,
  handleSortChange: centralSortChange,
  handleSearchChange: centralSearchChange,
  loadMore,
  deleteQuestionTemplate,
}: BrowseTemplatesProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();
  const isQuestions = gameQuestion === GameQuestionType.QUESTION;
  const defaultSort = DEFAULT_SORT(gameQuestion);
  const emptyQuery: Query = { search: '', grades: [], sort: defaultSort };

  // the query the grid is currently showing -- NOT raw central state, because
  // SelectGradesMenu dispatches SET_SELECTED_GRADES on every checkbox tick,
  // before Choose is pressed
  const [query, setQuery] = useState<Query>(emptyQuery);
  const [pages, setPages] = useState<ITemplate[][]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // survivors of the filter not yet handed to a page, and the server position
  const buffer = useRef<ITemplate[]>([]);
  // null means "start from the beginning", so it cannot double as "no more to
  // fetch" -- exhaustion is tracked separately or the first request never fires
  const cursor = useRef<string | null>(null);
  const isExhausted = useRef(false);
  const requestId = useRef(0);

  const pageCount = pages.length;
  const hasNext = currentPage + 1 < pageCount || hasMore;

  /** One scan window, normalised across the two clients. */
  const fetchWindow = async (activeQuery: Query) => {
    if (isQuestions) {
      const response =
        await apiClients.centralDataManager?.searchForQuestionTemplates(
          PublicPrivateType.PUBLIC,
          SCAN_WINDOW,
          cursor.current,
          // '' still pushes a `contains ''` filter into the query -- only null
          // skips the term entirely (BaseAPIClient executeQuery)
          activeQuery.search.length > 0 ? activeQuery.search : null,
          activeQuery.sort.direction ?? SortDirection.DESC,
          activeQuery.sort.field,
          activeQuery.grades,
          null,
        );
      if (!response) return null;
      return {
        elements: response.questions as ITemplate[],
        nextToken: response.nextToken ?? null,
      };
    }
    const response =
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
    if (!response) return null;
    return {
      elements: response.games as ITemplate[],
      nextToken: response.nextToken ?? null,
    };
  };

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
        // eslint-disable-next-line no-await-in-loop
        const scan = await fetchWindow(activeQuery);
        if (id !== requestId.current) return; // a newer query superseded this one
        if (!scan) break;
        buffer.current.push(...scan.elements);
        cursor.current = scan.nextToken;
        if (cursor.current === null) isExhausted.current = true;
      }
      if (id !== requestId.current) return;
      const page = buffer.current.splice(0, PAGE_SIZE);
      setHasMore(buffer.current.length > 0 || !isExhausted.current);
      if (page.length > 0) setPages((prev) => [...prev, page]);
    } catch (error) {
      console.error('Failed to load browse page', error);
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
   *
   * This runs on mount only. Switching game <-> question is handled by the
   * `key` AppSwitch puts on this component, which remounts it outright rather
   * than leaving a cross-type cursor in the refs above.
   */
  useEffect(() => {
    centralDataDispatch({ type: 'SET_IS_TABS_OPEN', payload: false });
    centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: '' });
    centralDataDispatch({
      type: isQuestions ? 'SET_SEARCHED_QUESTIONS' : 'SET_SEARCHED_GAMES',
      payload: [],
    });
    centralDataDispatch({ type: 'SET_SELECTED_GRADES', payload: [] });
    centralDataDispatch({ type: 'SET_SORT', payload: defaultSort });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    runQuery(emptyQuery);
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
    const field = isQuestions
      ? (GAME_TO_QUESTION_SORT[newSort.field] ?? newSort.field)
      : newSort.field;
    const sort = { ...newSort, field };
    centralDataDispatch({ type: 'SET_SORT', payload: sort });
    runQuery({ ...query, sort });
  };

  /**
   * The navigator offers four page numbers, so a click can land up to three
   * pages past the frontier -- fetchNextPage only appends one page per call, so
   * walk forward until the target exists or the query runs dry.
   */
  const handlePageChange = async (page: number) => {
    if (page < pageCount) {
      setCurrentPage(page);
      return;
    }
    if (!hasMore || isFetching) return;
    requestId.current += 1;
    const id = requestId.current;
    setCurrentPage(page);
    for (let target = pageCount; target <= page; target += 1) {
      // eslint-disable-next-line no-await-in-loop
      await fetchNextPage(query, id);
      if (id !== requestId.current) return; // superseded by a newer query
      if (isExhausted.current && buffer.current.length === 0) {
        // ran out before reaching the target -- land on the last real page,
        // which is the one this iteration just appended
        setCurrentPage(Math.max(target, 0));
        return;
      }
    }
  };

  // ---------------------------------------------------------------- questions
  // the QuestionTabs overlay, ported from ExploreQuestions. Questions have no
  // view route (only clone/edit), so this is the only way to open one.
  const [openQuestionTab, setOpenQuestionTab] = useState<LibraryTabEnum>(
    LibraryTabEnum.PUBLIC,
  );
  const [selectedQuestion, setSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [originalSelectedQuestion, setOriginalSelectedQuestion] =
    useState<IQuestionTemplate | null>(null);
  const [questionSet, setQuestionSet] = useState<IQuestionTemplate[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleViewQuestion = async (
    question: IQuestionTemplate,
    questions: IQuestionTemplate[],
  ) => {
    setSelectedQuestion(question);
    if (centralData.isTabsOpen === false) setOriginalSelectedQuestion(question);
    setQuestionSet(questions);
    setIsTabsOpen?.(true);
    const selectedQ = await viewQuestion?.(question);
    if (selectedQ && 'question' in selectedQ && selectedQ.question) {
      setSelectedQuestion(selectedQ.question);
      if (centralData.isTabsOpen === false)
        setOriginalSelectedQuestion(selectedQ.question);
    }
  };

  const handlePrevQuestion = () => {
    const index = questionSet.findIndex((q) => q.id === selectedQuestion?.id);
    setSelectedQuestion(
      index > 0 ? questionSet[index - 1] : questionSet[questionSet.length - 1],
    );
  };

  const handleNextQuestion = () => {
    const index = questionSet.findIndex((q) => q.id === selectedQuestion?.id);
    setSelectedQuestion(
      index < questionSet.length - 1 ? questionSet[index + 1] : questionSet[0],
    );
  };

  const handleBackToExplore = () => setSelectedQuestion(null);

  const handleCloseQuestionTabs = () =>
    centralDataDispatch({ type: 'SET_IS_TABS_OPEN', payload: false });

  const handleCloneButtonClick = () => {
    setIsTabsOpen?.(false);
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: selectedQuestion,
    });
    navigate(
      `/clone/question/${selectedQuestion?.publicPrivateType}/${selectedQuestion?.id}`,
    );
  };

  const handleEditQuestion = () => {
    setIsTabsOpen?.(false);
    centralDataDispatch({
      type: 'SET_SELECTED_QUESTION',
      payload: selectedQuestion,
    });
    navigate(
      `/edit/question/${selectedQuestion?.publicPrivateType}/${selectedQuestion?.id}`,
    );
  };

  const handleEditButtonClick = () => {
    if (selectedQuestion?.publicPrivateType === PublicPrivateType.PUBLIC)
      setIsEditModalOpen(true);
    else handleEditQuestion();
  };

  const handleDeleteQuestion = async () => {
    try {
      if (selectedQuestion) {
        await deleteQuestionTemplate?.(
          selectedQuestion.id,
          selectedQuestion.publicPrivateType,
        );
        setIsDeleteModalOpen(false);
        setSelectedQuestion(null);
        centralDataDispatch({ type: 'SET_SELECTED_QUESTION', payload: null });
        centralDataDispatch({ type: 'SET_IS_TABS_OPEN', payload: false });
        // ExploreQuestions refetches central state and navigates to /questions;
        // this page reads its own pages, so re-run the local query in place
        runQuery(query);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteButtonClick = async () => {
    if (selectedQuestion?.publicPrivateType === PublicPrivateType.PUBLIC)
      setIsDeleteModalOpen(true);
    else handleDeleteQuestion();
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleViewGame = (game: IGameTemplate) => {
    centralDataDispatch({ type: 'SET_SELECTED_GAME', payload: null });
    navigate(`/games/${game.publicPrivateType}/${game.id}`);
  };

  const pageElements = pages[currentPage] ?? [];
  // hold the outgoing page while the next is in flight so the grid height --
  // and the navigator below it -- cannot move
  const lastFilledPage = useRef<ITemplate[]>([]);
  if (pageElements.length > 0) lastFilledPage.current = pageElements;
  const isAwaitingPage = pageElements.length === 0 && pages.length > 0;
  const visibleElements = isAwaitingPage ? lastFilledPage.current : pageElements;

  const header = isQueryActive(query, gameQuestion) ? (
    <GalleryHeaderText<ITemplate>
      screenSize={screenSize}
      galleryType={GalleryType.SEARCH_RESULTS}
      searchedTerm={query.search}
      grades={query.grades}
      isLoading={isFetching}
      // the result count is deliberately withheld: with cursor pagination the
      // total is unknown until the query is exhausted, so it would climb as the
      // user pages. Passing [] only when the set is genuinely empty keeps the
      // no-results message working.
      searchedElements={!hasMore && pages.length === 0 ? [] : undefined}
    />
  ) : undefined;

  const footer = (
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
          hasMorePages={hasMore}
          isLoading={isFetching}
          onPageChange={handlePageChange}
          screenSize={screenSize}
        />
      )}
    </Box>
  );

  return (
    <ExploreGamesMainContainer id="scrollableDiv">
      {/* every handler below is required by QuestionTabs and only supplied on
          the questions branch, so gate the whole overlay on their presence */}
      {isQuestions &&
        setIsTabsOpen &&
        viewQuestion &&
        fetchElements &&
        centralChooseGrades &&
        centralSortChange &&
        centralSearchChange &&
        handlePublicPrivateChange &&
        loadMore && (
        <>
          <ModalBackground
            isModalOpen={isEditModalOpen}
            handleCloseModal={handleCloseModal}
          />
          <EditModal
            isModalOpen={isEditModalOpen}
            gameQuestion={GameQuestionType.QUESTION}
            setIsModalOpen={setIsEditModalOpen}
            handleProceedToEdit={handleEditQuestion}
          />
          <EditModal
            isModalOpen={isDeleteModalOpen}
            gameQuestion={GameQuestionType.QUESTION}
            setIsModalOpen={setIsDeleteModalOpen}
            handleProceedToEdit={handleDeleteQuestion}
          />
          <QuestionTabsModalBackground
            isTabsOpen={centralData.isTabsOpen}
            handleBackToExplore={handleBackToExplore}
          />
          <QuestionTabs
            screenSize={screenSize}
            isTabsOpen={centralData.isTabsOpen}
            question={selectedQuestion}
            originalSelectedQuestion={originalSelectedQuestion}
            questions={questionSet}
            setQuestionSet={setQuestionSet}
            setIsTabsOpen={setIsTabsOpen}
            viewQuestion={viewQuestion}
            fetchElements={fetchElements}
            setSelectedQuestion={setSelectedQuestion}
            handleCloseQuestionTabs={handleCloseQuestionTabs}
            handleBackToExplore={handleBackToExplore}
            handlePrevQuestion={handlePrevQuestion}
            handleNextQuestion={handleNextQuestion}
            handleCloneButtonClick={handleCloneButtonClick}
            handleEditButtonClick={handleEditButtonClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
            handleChooseGrades={centralChooseGrades}
            handleSortChange={centralSortChange}
            handleSearchChange={centralSearchChange}
            handlePublicPrivateChange={handlePublicPrivateChange}
            handleQuestionView={handleViewQuestion}
            loadMore={loadMore}
            openTab={openQuestionTab}
            setOpenTab={setOpenQuestionTab}
          />
        </>
        )}
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
        {isQuestions ? (
          <QuestionsLibraryGallery
            screenSize={screenSize}
            header={header}
            galleryElements={visibleElements as IQuestionTemplate[]}
            handleView={handleViewQuestion}
            isLoading={isFetching && pages.length === 0}
            footer={footer}
          />
        ) : (
          <GamesLibraryGallery
            screenSize={screenSize}
            header={header}
            galleryElements={visibleElements as IGameTemplate[]}
            handleView={handleViewGame}
            isLoading={isFetching && pages.length === 0}
            footer={footer}
          />
        )}
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
