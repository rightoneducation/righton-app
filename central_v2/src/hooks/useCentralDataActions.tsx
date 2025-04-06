import { useState, useEffect, useCallback } from 'react';
import { debounce, set } from 'lodash';
import { useNavigate, useMatch } from 'react-router-dom';
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
import { useCentralDataState, useCentralDataDispatch } from './context/useCentralDataContext';
import { UserStatusType, GameQuestionType, FetchType, LibraryTabEnum } from '../lib/CentralModels';

interface UseCentralDataManagerProps {
  gameQuestion: GameQuestionType;
}

interface UseCentralDataManagerReturnProps {
  isValidatingUser: boolean;
  setIsTabsOpen: (isOpen: boolean) => void;
  fetchElements: (libraryTab?: LibraryTabEnum) => void;
  isUserProfileComplete: (profile: IUserProfile) => boolean;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (
    newSort: {
      field: SortType;
      direction: SortDirection | null;
    }
  ) => void;
  handleSearchChange: (searchString: string) => void;
  getPublicPrivateElements: (newPublicPrivate: PublicPrivateType) => void;
  loadMore: () => void;
}

/* 
* useCentralDataManager handles all data from api calls and stores them in state at the top (AppSwitch) of the app
* It communicates primarily with apiClients.centralDataManager to fetch and maintain recent copies of subsets of games, questions 
* Includes: recommended, popular, draft, favourited, and searched/sorted/filtered versions of those
* There's a lot of duplicated code here via the switch statements but I preferred this over T extends GameQuestionType in the api layer
* I think this is more straightforward 
* */

export default function useCentralDataManager({
  gameQuestion
}: UseCentralDataManagerProps): UseCentralDataManagerReturnProps {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();

  const navigate = useNavigate();
  const isGames = useMatch('/');
  const isQuestions = useMatch('/questions');
  const isLibrary = useMatch('/library') !== null;
  const [isValidatingUser, setIsValidatingUser] = useState(true);

  const debounceInterval = 800;

  const setIsTabsOpen = (isOpen: boolean) => {
    centralDataDispatch({ type: 'SET_IS_TABS_OPEN', payload: isOpen });
  }

  const handleChooseGrades = (grades: GradeTarget[]) => {
    centralDataDispatch({ type: 'SET_SELECTED_GRADES', payload: grades });
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
        ?.searchForQuestionTemplates(
          PublicPrivateType.PUBLIC,
          null,
          null,
          centralData.searchTerms,
          centralData.sort.direction ?? SortDirection.ASC,
          centralData.sort.field,
          [...grades],
          null
        )
        .then((response) => {
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({ type: 'SET_SEARCHED_QUESTIONS', payload: response.questions });
        });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
        ?.searchForGameTemplates(
          PublicPrivateType.PUBLIC,
          null,
          null,
          centralData.searchTerms,
          centralData.sort.direction ?? SortDirection.ASC,
          centralData.sort.field,
          [...grades],
          null
        )
        .then((response) => {
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({ type: 'SET_SEARCHED_GAMES', payload: response.games });
        });
        break;
    }
  };

  const handleSortChange = (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => {
    centralDataDispatch({ type: 'SET_SORT', payload: newSort });
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
            centralData.publicPrivate,
            null,
            null,
            centralData.searchTerms,
            newSort.direction ?? SortDirection.ASC,
            newSort.field,
            centralData.selectedGrades,
            null
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({ type: 'SET_SEARCHED_QUESTIONS', payload: response.questions });
          });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            centralData.publicPrivate,
            null,
            null,
            centralData.searchTerms,
            newSort.direction ?? SortDirection.ASC,
            newSort.field,
            centralData.selectedGrades,
            null
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({ type: 'SET_SEARCHED_GAMES', payload: response.games });
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
        searchGameQuestion: GameQuestionType
      ) => {
        centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
        centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: search });
        centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
        switch(searchGameQuestion){
          case GameQuestionType.QUESTION:
            centralDataDispatch({ type: 'SET_SEARCHED_QUESTIONS', payload: [] });
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
                centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
                centralDataDispatch({ type: 'SET_SEARCHED_QUESTIONS', payload: response.questions });
              });
            break;
          case GameQuestionType.GAME:
          default:
            centralDataDispatch({ type: 'SET_SEARCHED_GAMES', payload: [] });
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
                centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
                centralDataDispatch({ type: 'SET_SEARCHED_GAMES', payload: response.games });
              });
          break;
        }
      },
      debounceInterval,
    ),
    [debounceInterval],
  );

  const handleSearchChange = (searchString: string) => {
    debouncedSearch(
      searchString.trim(),
      centralData.sort.direction ?? SortDirection.ASC,
      centralData.selectedGrades,
      centralData.sort.field,
      gameQuestion
    );
  };

  const getPublicPrivateElements = (newPublicPrivate: PublicPrivateType) => {
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    centralDataDispatch({ type: 'SET_PUBLIC_PRIVATE', payload: newPublicPrivate });
    const limit = newPublicPrivate === PublicPrivateType.PUBLIC ? 12 : null;
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
          apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
              newPublicPrivate,
              null,
              null,
              centralData.searchTerms,
              centralData.sort.direction ?? SortDirection.ASC,
              centralData.sort.field,
              centralData.selectedGrades ?? [],
              null
            )
            .then((response) => {
              centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
              console.log(response);
              if (response){
                switch (newPublicPrivate){
                  case PublicPrivateType.PRIVATE:
                    centralDataDispatch({ type: 'SET_PRIVATE_QUESTIONS', payload: response.questions });
                    break;
                  case PublicPrivateType.PUBLIC:
                  default:
                    centralDataDispatch({ type: 'SET_PUBLIC_QUESTIONS', payload: response.questions });
                    break;
                }
              }
            });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            newPublicPrivate,
            null,
            null,
            centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            centralData.selectedGrades ?? [],
            null
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            if (response)
              switch (newPublicPrivate){
                case PublicPrivateType.PRIVATE:
                  centralDataDispatch({ type: 'SET_PRIVATE_GAMES', payload: response.games});
                  break;
                case PublicPrivateType.PUBLIC:
                default:
                  centralDataDispatch({ type: 'SET_PUBLIC_GAMES', payload: response.games });
                  break;
              }
          });
      break;
    }
  };

  const loadMore = () => {
    if (centralData.nextToken && !centralData.isLoadingInfiniteScroll) {
      centralDataDispatch({ type: 'SET_IS_LOADING_INFINITE_SCROLL', payload: true })
      switch (gameQuestion){
        case (GameQuestionType.QUESTION):
          apiClients.questionTemplate
            .listQuestionTemplates(
              PublicPrivateType.PUBLIC,
              12,
              centralData.nextToken,
              null,
              null,
              centralData.selectedGrades ?? [],
              null
            )
            .then((response) => {
              if (response) {
                centralDataDispatch({ type: 'SET_MOST_POPULAR_QUESTIONS', payload: [...centralData.mostPopularQuestions, ...response.questionTemplates] });
                centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken ?? null });
                centralDataDispatch({ type: 'SET_IS_LOADING_INFINITE_SCROLL', payload: false });
              }
            })
            .catch((error) => {
              console.error('Error fetching more questions:', error);
              centralDataDispatch({ type: 'SET_IS_LOADING_INFINITE_SCROLL', payload: false });
            });
          break;
        case (GameQuestionType.GAME):
        default:
          apiClients.gameTemplate
            .listGameTemplates(
              PublicPrivateType.PUBLIC,
              12,
              centralData.nextToken,
              null,
              null,
              centralData.selectedGrades ?? [],
              null
            )
            .then((response) => {
              if (response) {
                centralDataDispatch({ type: 'SET_MOST_POPULAR_GAMES', payload: [...centralData.mostPopularGames, ...response.gameTemplates] });
                centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken ?? null });
                centralDataDispatch({ type: 'SET_IS_LOADING_INFINITE_SCROLL', payload: false });
              }
            })
            .catch((error) => {
              console.error('Error fetching more games:', error);
              centralDataDispatch({ type: 'SET_IS_LOADING_INFINITE_SCROLL', payload: false });
            });
          break;
      }
    }
  };

  const getDrafts = async () => {
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager?.searchForQuestionTemplates(
          PublicPrivateType.DRAFT,
          null,
          null,
          centralData.searchTerms,
          centralData.sort.direction ?? SortDirection.ASC,
          centralData.sort.field,
          [...centralData.selectedGrades],
          null
        ).then((response) => {
          centralDataDispatch({ type: 'SET_DRAFT_QUESTIONS', payload: response.questions });
          centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken });
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
        });
      break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager?.searchForGameTemplates(
          PublicPrivateType.DRAFT,
          null,
          null,
          centralData.searchTerms,
          centralData.sort.direction ?? SortDirection.ASC,
          centralData.sort.field,
          [...centralData.selectedGrades],
          null
        ).then((response) => {
          centralDataDispatch({ type: 'SET_DRAFT_GAMES', payload: response.games });
          centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken });
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
        });
      break;
    }
  };

  const getFav = async (user: IUserProfile) => {
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    console.log(user);
    switch (gameQuestion){
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager?.searchForQuestionTemplates(
          PublicPrivateType.PUBLIC,
          null,
          null,
          centralData.searchTerms,
          centralData.sort.direction ?? SortDirection.ASC,
          centralData.sort.field,
          [...centralData.selectedGrades],
          user.favoriteGameTemplateIds ?? null,
        ).then((response) => {
          centralDataDispatch({ type: 'SET_FAV_QUESTIONS', payload: response.questions });
          centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken });
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
        });
      break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager?.searchForGameTemplates(
          PublicPrivateType.PUBLIC,
          null,
          null,
          centralData.searchTerms,
          centralData.sort.direction ?? SortDirection.ASC,
          centralData.sort.field,
          [...centralData.selectedGrades],
          user.favoriteGameTemplateIds ?? null,
        ).then((response) => {
          centralDataDispatch({ type: 'SET_FAV_GAMES', payload: response.games });
          centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken });
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
        });
      break;
    }
  };

  const isUserProfileComplete = (profile: IUserProfile): boolean => {
    return Object.entries(profile).every(([key, value]) => value !== undefined && value !== null && value !== "");
  };

  const fetchElements = async (libraryTab?: LibraryTabEnum) => {
    const getFetchType = (tab: LibraryTabEnum | null) => {
      if (isLibrary && tab !== undefined) {
        switch(tab){
          case LibraryTabEnum.FAVORITES: 
            return gameQuestion === GameQuestionType.GAME ? FetchType.FAVORITE_GAMES : FetchType.FAVORITE_QUESTIONS;
          case LibraryTabEnum.DRAFTS: 
            return gameQuestion === GameQuestionType.GAME ? FetchType.DRAFT_GAMES : FetchType.DRAFT_QUESTIONS;
          case LibraryTabEnum.PRIVATE:
            return gameQuestion === GameQuestionType.GAME ? FetchType.PRIVATE_GAMES : FetchType.PRIVATE_QUESTIONS;
          case LibraryTabEnum.PUBLIC:
          default:
            return gameQuestion === GameQuestionType.GAME ? FetchType.PUBLIC_GAMES : FetchType.PUBLIC_QUESTIONS;
        }
      }
      if (isQuestions) return FetchType.EXPLORE_QUESTIONS;
      return FetchType.EXPLORE_GAMES;
    }

    const fetchType = getFetchType(libraryTab ?? null);
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });

    switch (fetchType) {
      case FetchType.PUBLIC_GAMES:
      case FetchType.PUBLIC_QUESTIONS:
        getPublicPrivateElements(PublicPrivateType.PUBLIC);
        break;
      case FetchType.PRIVATE_QUESTIONS:
      case FetchType.PRIVATE_GAMES:
        getPublicPrivateElements(PublicPrivateType.PRIVATE);
        break;
      case FetchType.DRAFT_QUESTIONS:
      case FetchType.DRAFT_GAMES: 
        getDrafts();
        break;
      case FetchType.FAVORITE_QUESTIONS:
      case FetchType.FAVORITE_GAMES:
        getFav(centralData.userProfile);
        break;
      case FetchType.EXPLORE_QUESTIONS:
        apiClients?.centralDataManager?.initQuestions().then((response) => {
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({ type: 'SET_RECOMMENDED_QUESTIONS', payload: response.questions });
          centralDataDispatch({ type: 'SET_MOST_POPULAR_QUESTIONS', payload: response.questions });
          centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken });
        });
        break;
      case FetchType.EXPLORE_GAMES:
      default:
        apiClients?.centralDataManager?.initGames().then((response) => {
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({ type: 'SET_RECOMMENDED_GAMES', payload: response.games });
          centralDataDispatch({ type: 'SET_MOST_POPULAR_GAMES', payload: response.games });
          centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: response.nextToken });
        });
        break;
    }
  };
  
  // useEffect for monitoring changes to auth status of Cognito User
  useEffect(() => {
    if (apiClients.auth.isUserAuth) 
      centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
  }, [apiClients.auth.isUserAuth]); // eslint-disable-line

  const validateUser = async () => {
    setIsValidatingUser(true);
    const status = await apiClients.auth.verifyAuth();
    if (status) {
      const localProfile = await apiClients.centralDataManager?.refreshLocalUserProfile();
      if (localProfile) {
        if (!isUserProfileComplete(localProfile)) {
          // navigate('/nextstep');
          centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.INCOMPLETE });
          setIsValidatingUser(false);
          return;
        }
        centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDIN });
        setIsValidatingUser(false);
        return;
      }
    }
    apiClients.centralDataManager?.clearLocalUserProfile();
    centralDataDispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
  };

  // useEffect for verifying that user data (Cognito and User Profile) is complete and valid
  // runs only on initial app load
  useEffect(() => {
    validateUser();
  }, []); // eslint-disable-line

  return {
    isValidatingUser,
    setIsTabsOpen,
    fetchElements,
    isUserProfileComplete,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    getPublicPrivateElements,
    loadMore,
  };
}
