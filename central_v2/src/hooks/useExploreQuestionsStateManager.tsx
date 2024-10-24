import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import {
  IQuestionTemplate,
  PublicPrivateType,
  SortDirection,
  SortType,
  GradeTarget,
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from './context/useAPIClientsContext';

interface UseExploreQuestionsStateManagerProps {
  recommendedQuestions: IQuestionTemplate[];
  mostPopularQuestions: IQuestionTemplate[];
  searchedQuestions: IQuestionTemplate[];
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
  loadMoreQuestions: () => void;
}

export default function useExploreQuestionsStateManager(): UseExploreQuestionsStateManagerProps {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const debounceInterval = 800;
  const [recommendedQuestions, setRecommendedQuestions] = useState<
    IQuestionTemplate[]
  >([]);
  const [mostPopularQuestions, setMostPopularQuestions] = useState<
    IQuestionTemplate[]
  >([]);
  const [searchedQuestions, setSearchedQuestions] = useState<
    IQuestionTemplate[]
  >([]);
  const [searchTerms, setSearchTerms] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<GradeTarget[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfiniteScroll, setIsLoadingInfiniteScroll] = useState(false);
  const [sort, setSort] = useState<{
    field: SortType;
    direction: SortDirection | null;
  }>({
    field: SortType.listQuestionTemplatesByDate,
    direction: SortDirection.DESC,
  });
  const [isTabsOpen, setIsTabsOpen] = useState(false);

  const initQuestions = async () => {
    setIsLoading(true);
    apiClients?.centralDataManager?.initQuestions().then((response) => {
      setIsLoading(false);
      setRecommendedQuestions(response.questions);
      setMostPopularQuestions(response.questions);
      setNextToken(response.nextToken);
    });
  };

  const handleChooseGrades = (grades: GradeTarget[]) => {
    setSelectedGrades((prev) => [...grades]);
    setIsLoading(true);
    setNextToken(null);
    apiClients?.centralDataManager
      ?.searchForQuestionTemplates(
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
        setSearchedQuestions(response.questions);
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
      ?.searchForQuestionTemplates(
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
        setSearchedQuestions(response.questions);
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
        setNextToken(null);
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
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
            setSearchedQuestions(response.questions);
          });
      },
      debounceInterval,
    ),
    [debounceInterval],
  );

  const handleSearchChange = (searchString: string) => {
    setIsLoading(true);
    setSearchTerms(searchString);
    debouncedSearch(
      searchString,
      sort.direction ?? SortDirection.ASC,
      selectedGrades,
      sort.field,
    );
  };

  const loadMoreQuestions = () => {
    if (nextToken && !isLoadingInfiniteScroll) {
      setIsLoadingInfiniteScroll(true);
      apiClients.questionTemplate
        .listQuestionTemplates(
          PublicPrivateType.PUBLIC,
          12,
          nextToken,
          null,
          null,
          [],
        )
        .then((response) => {
          if (response) {
            setMostPopularQuestions((prev) => [
              ...prev,
              ...response.questionTemplates,
            ]);
            setNextToken(response.nextToken || null);
            setIsLoadingInfiniteScroll(false);
          }
        })
        .catch((error) => {
          console.error('Error fetching more Questions:', error);
          setIsLoadingInfiniteScroll(false);
        });
    }
  };

  useEffect(() => {
    try {
      initQuestions();
    } catch (error) {
      console.log('Error:', error);
    }
  }, []); // eslint-disable-line
  return {
    recommendedQuestions,
    mostPopularQuestions,
    searchedQuestions,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    isTabsOpen,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    loadMoreQuestions,
  };
}
