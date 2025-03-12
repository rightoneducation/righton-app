import { useState, useEffect, useCallback } from 'react';
import { debounce, set } from 'lodash';
import {
  IGameTemplate,
  PublicPrivateType,
  SortDirection,
  SortType,
  GradeTarget,
  IUserProfile,
  IQuestionTemplate,
} from '@righton/networking';
import { APIClientsContext } from '../lib/context/APIClientsContext';
import { useTSAPIClientsContext } from './context/useAPIClientsContext';
import { GameQuestionType } from '../lib/CentralModels';

interface UseExploreGamesStateManagerProps {
  recommendedGames: IGameTemplate[];
  mostPopularGames: IGameTemplate[];
  searchedGames: IGameTemplate[];
  favGames: IGameTemplate[];
  nextToken: string | null;
  isLoading: boolean;
  searchTerms: string;
  selectedGrades: GradeTarget[];
  isTabsOpen: boolean;
  isFavTabOpen: boolean;
  publicPrivate: PublicPrivateType;
  setIsTabsOpen: (isOpen: boolean) => void;
  handleChooseGrades: (grades: GradeTarget[], gameQuestion: GameQuestionType) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    },
    gameQuestion: GameQuestionType
  ) => void;
  handleSearchChange: (searchString: string, gameQuestion: GameQuestionType) => void;
  handlePublicPrivateChange: (newPublicPrivate: PublicPrivateType, gameQuestion: GameQuestionType ) => void;
  getFav: (user: IUserProfile, gameQuestion: GameQuestionType) => void;
  loadMore: (gameQuestion: GameQuestionType) => void;
}

/* 
* useCentralDataManager handles all data from api calls and stores them in state at the top (AppSwitch) of the app
* It communicates primarily with apiClients.centralDataManager to fetch and maintain recent copies of subsets of games, questions 
* Includes: recommended, popular, draft, favourited, and searched/sorted/filtered versions of those
* */

export default function useExploreGamesStateManager(
): UseExploreGamesStateManagerProps {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const debounceInterval = 800;
  
  // holding all of these seperately in state so that we can switch between them without refetching
  const [recommendedGames, setRecommendedGames] = useState<IGameTemplate[]>([]);
  const [mostPopularGames, setMostPopularGames] = useState<IGameTemplate[]>([]);
  const [searchedGames, setSearchedGames] = useState<IGameTemplate[]>([]);
  const [draftGames, setDraftGames] = useState<IGameTemplate[]>([]);
  const [favGames, setFavGames] = useState<IGameTemplate[]>([]);

  const [recommendedQuestions, setRecommendedQuestions] = useState<IQuestionTemplate[]>([]);
  const [mostPopularQuestions, setMostPopularQuestions] = useState<IQuestionTemplate[]>([]);
  const [searchedQuestions, setSearchedQuestions] = useState<IQuestionTemplate[]>([]);
  const [draftQuestions, setDraftQuestions] = useState<IQuestionTemplate[]>([]);
  const [favQuestions, setFavQuestions] = useState<IQuestionTemplate[]>([]);

  const [gameQuestionType, setGameQuestionType] = useState<GameQuestionType>(GameQuestionType.GAME);
  const [searchTerms, setSearchTerms] = useState('');
  const [selectedGrades, setSelectedGrades] = useState<GradeTarget[]>([]);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInfiniteScroll, setIsLoadingInfiniteScroll] = useState(false);
  const [publicPrivate, setPublicPrivate] = useState<PublicPrivateType>(
    PublicPrivateType.PUBLIC,
  );
  const [sort, setSort] = useState<{
    field: SortType;
    direction: SortDirection | null;
  }>({
    field: SortType.listGameTemplatesByDate,
    direction: null,
  });
  const [isTabsOpen, setIsTabsOpen] = useState(false);
  const [isFavTabOpen, setIsFavTabOpen] = useState(false);

  const init = async (gameQuestion: GameQuestionType) => {
    setIsLoading(true);
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager?.initQuestions().then((response) => {
          setIsLoading(false);
          setRecommendedQuestions(response.questions);
          setMostPopularQuestions(response.questions);
          setNextToken(response.nextToken);
        });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager?.initGames().then((response) => {
          setIsLoading(false);
          setRecommendedGames(response.games);
          setMostPopularGames(response.games);
          setNextToken(response.nextToken);
        });
        break;
    }
  };

  const handleChooseGrades = (grades: GradeTarget[], gameQuestion: GameQuestionType) => {
    setSelectedGrades((prev) => [...grades]);
    setIsLoading(true);
    setNextToken(null);
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
        ?.searchForQuestionTemplates(
          PublicPrivateType.PUBLIC,
          null,
          null,
          searchTerms,
          sort.direction ?? SortDirection.ASC,
          sort.field,
          [...grades],
          null
        )
        .then((response) => {
          setIsLoading(false);
          setSearchedQuestions(response.questions);
        });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
        ?.searchForGameTemplates(
          PublicPrivateType.PUBLIC,
          null,
          null,
          searchTerms,
          sort.direction ?? SortDirection.ASC,
          sort.field,
          [...grades],
          null
        )
        .then((response) => {
          setIsLoading(false);
          setSearchedGames(response.games);
        });
        break;
    }
  
  };

  const handleSortChange = (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }, gameQuestion: GameQuestionType) => {
    setSort(newSort);
    setIsLoading(true);
    setNextToken(null);
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
            publicPrivate,
            null,
            null,
            searchTerms,
            newSort.direction ?? SortDirection.ASC,
            newSort.field,
            selectedGrades,
            null
          )
          .then((response) => {
            setIsLoading(false);
            setSearchedQuestions(response.questions);
          });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            publicPrivate,
            null,
            null,
            searchTerms,
            newSort.direction ?? SortDirection.ASC,
            newSort.field,
            selectedGrades,
            null
          )
          .then((response) => {
            setIsLoading(false);
            setSearchedGames(response.games);
          });
        break;
    }
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
        gameQuestion: GameQuestionType
      ) => {
        setIsLoading(true);
        setSearchedGames([]);
        setSearchTerms(search);
        setNextToken(null);
        switch(gameQuestion){
          case GameQuestionType.QUESTION:
            apiClients?.centralDataManager
              ?.searchForQuestionTemplates(
                PublicPrivateType.PUBLIC,
                null,
                null,
                search,
                sortDirection,
                sortType,
                gradeTargets,
                null
              )
              .then((response) => {
                setIsLoading(false);
                setMostPopularQuestions(response.questions);
              });
            break;
          case GameQuestionType.GAME:
          default:
            apiClients?.centralDataManager
              ?.searchForGameTemplates(
                PublicPrivateType.PUBLIC,
                null,
                null,
                search,
                sortDirection,
                sortType,
                gradeTargets,
                null
              )
              .then((response) => {
                setIsLoading(false);
                setMostPopularGames(response.games);
              });
          break;
        }
      },
      debounceInterval,
    ),
    [debounceInterval],
  );

  const handleSearchChange = (searchString: string, gameQuestion: GameQuestionType) => {
    debouncedSearch(
      searchString.trim(),
      sort.direction ?? SortDirection.ASC,
      selectedGrades,
      sort.field,
      gameQuestion
    );
  };

  const handlePublicPrivateChange = (newPublicPrivate: PublicPrivateType, gameQuestion: GameQuestionType) => {
    setIsLoading(true);
    setNextToken(null);
    setPublicPrivate(newPublicPrivate);
    setMostPopularGames([]);
    const limit = newPublicPrivate === PublicPrivateType.PUBLIC ? 12 : null;
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
          apiClients?.questionTemplate
            ?.listQuestionTemplates(
              newPublicPrivate,
              limit,
              null,
              null,
              null,
              selectedGrades ?? [],
              null
            )
            .then((response) => {
              setIsLoading(false);
              if (response)
                setMostPopularQuestions(response.questionTemplates);
            });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.gameTemplate
          ?.listGameTemplates(
            newPublicPrivate,
            limit,
            null,
            null,
            null,
            selectedGrades ?? [],
            null
          )
          .then((response) => {
            setIsLoading(false);
            if (response)
              setMostPopularGames(response.gameTemplates);
          });
      break;
    }
  };

  const loadMore = (gameQuestion: GameQuestionType) => {
    if (nextToken && !isLoadingInfiniteScroll) {
      setIsLoadingInfiniteScroll(true);
      switch (gameQuestion){
        case (GameQuestionType.QUESTION):
          apiClients.questionTemplate
            .listQuestionTemplates(
              PublicPrivateType.PUBLIC,
              12,
              nextToken,
              null,
              null,
              selectedGrades ?? [],
              null
            )
            .then((response) => {
              if (response) {
                setMostPopularQuestions((prev) => [...prev, ...response.questionTemplates]);
                setNextToken(response.nextToken || null);
                setIsLoadingInfiniteScroll(false);
              }
            })
            .catch((error) => {
              console.error('Error fetching more questions:', error);
              setIsLoadingInfiniteScroll(false);
            });
          break;
        case (GameQuestionType.GAME):
        default:
          apiClients.gameTemplate
            .listGameTemplates(
              PublicPrivateType.PUBLIC,
              12,
              nextToken,
              null,
              null,
              selectedGrades ?? [],
              null
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
          break;
      }
    }
  };

  const getFav = async (user: IUserProfile, gameQuestion: GameQuestionType) => {
    setIsLoading(true);
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager?.searchForQuestionTemplates(
          PublicPrivateType.PUBLIC,
          12,
          null,
          searchTerms,
          sort.direction ?? SortDirection.ASC,
          sort.field,
          [...selectedGrades],
          user.favoriteGameTemplateIds ?? null,
        ).then((response) => {
          setFavQuestions(response.questions);
          setNextToken(response.nextToken); 
          setIsLoading(false);
        });
      break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager?.searchForGameTemplates(
          PublicPrivateType.PUBLIC,
          12,
          null,
          searchTerms,
          sort.direction ?? SortDirection.ASC,
          sort.field,
          [...selectedGrades],
          user.favoriteGameTemplateIds ?? null,
        ).then((response) => {
          setFavGames(response.games);
          setNextToken(response.nextToken); 
          setIsLoading(false);
        });
      break;
    }
  };

  useEffect(() => {
    try {
      init(GameQuestionType.GAME);
    } catch (error) {
      console.log('Error:', error);
    }
  }, []); // eslint-disable-line
  return {
    recommendedGames,
    mostPopularGames,
    favGames,
    searchedGames,
    nextToken,
    isLoading,
    searchTerms,
    selectedGrades,
    isTabsOpen,
    isFavTabOpen,
    publicPrivate,
    setIsTabsOpen,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    handlePublicPrivateChange,
    getFav,
    loadMore,
  };
}
