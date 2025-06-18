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
import {
  useCentralDataState,
  useCentralDataDispatch,
} from './context/useCentralDataContext';
import {
  UserStatusType,
  GameQuestionType,
  FetchType,
  LibraryTabEnum,
  ISelectedGame,
  ISelectedQuestion,
  CallType,
} from '../lib/CentralModels';
import getCallType from '../lib/helperfunctions/getCallType';

interface UseCentralDataManagerProps {
  gameQuestion: GameQuestionType;
}

interface UseCentralDataManagerReturnProps {
  setIsTabsOpen: (isOpen: boolean) => void;
  handleLibraryInit: (isInit: boolean) => void;
  fetchElement: (
    type: GameQuestionType,
    id: string,
  ) => Promise<ISelectedGame | ISelectedQuestion>;
  fetchElements: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => void;
  isUserProfileComplete: (profile: IUserProfile) => boolean;
  handleChooseGrades: (grades: GradeTarget[]) => void;
  handleSortChange: (newSort: {
    field: SortType;
    direction: SortDirection | null;
  }) => void;
  handleSearchChange: (searchString: string) => void;
  getPublicPrivateElements: (newPublicPrivate: PublicPrivateType) => void;
  loadMore: () => void;
  loadMoreLibrary: (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
  ) => void;
  handleLogOut: () => void;
  checkForUniqueEmail: (email: string) => Promise<boolean>;
  deleteQuestionTemplate: (
    questionId: string,
    type: PublicPrivateType,
  ) => Promise<void>;
}

/*
 * useCentralDataManager handles all data from api calls and stores them in state at the top (AppSwitch) of the app
 * It communicates primarily with apiClients.centralDataManager to fetch and maintain recent copies of subsets of games, questions
 * Includes: recommended, popular, draft, favourited, and searched/sorted/filtered versions of those
 * There's a lot of duplicated code here via the switch statements but I preferred this over T extends GameQuestionType in the api layer
 * I think this is more straightforward
 * */

export default function useCentralDataManager({
  gameQuestion,
}: UseCentralDataManagerProps): UseCentralDataManagerReturnProps {
  const apiClients = useTSAPIClientsContext(APIClientsContext);
  const centralData = useCentralDataState();
  const centralDataDispatch = useCentralDataDispatch();

  const isQuestions = useMatch('/questions');
  const isCreateGame = useMatch('/create/game');
  const isEditGame = useMatch('/edit/game/:type/:gameId') !== null;
  const isLibrary = useMatch('/library') !== null;
  const callTypeMatches = {
    matchViewGame: useMatch('/games/:type/:gameId'),
    matchLibViewGame: useMatch('/library/games/:type/:gameId'),
    matchCloneGame: useMatch('/clone/:type/:gameId'),
    matchEditGame: useMatch('/edit/game/:type/:gameId'),
    matchCloneQuestion: useMatch('/clone/question/:type/:questionId'),
    matchEditQuestion: useMatch('/edit/question/:type/:questionId'),
    matchLibraryTab: useMatch('/library'),
  };

  const navigate = useNavigate();

  const debounceInterval = 800;

  const setIsTabsOpen = (isOpen: boolean) => {
    centralDataDispatch({ type: 'SET_IS_TABS_OPEN', payload: isOpen });
  };

  const handleLibraryInit = (isInit: boolean) => {
    centralDataDispatch({ type: 'SET_IS_LIBRARY_INIT', payload: isInit });
  };

  const handleChooseGrades = (grades: GradeTarget[]) => {
    centralDataDispatch({ type: 'SET_SELECTED_GRADES', payload: grades });
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
    const libraryTab = centralData.openTab;
    const callType = getCallType({
      ...callTypeMatches,
      libraryTab,
      gameQuestion,
    });
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
            callType.publicPrivateType,
            null,
            null,
            centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            [...grades],
            null,
            isLibrary ?? false,
            isLibrary ? centralData.userProfile.dynamoId : undefined,
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({
              type: 'SET_SEARCHED_QUESTIONS',
              payload: response.questions,
            });
          });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            callType.publicPrivateType,
            null,
            null,
            centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            [...grades],
            null,
            isLibrary ?? false,
            isLibrary ? centralData.userProfile.dynamoId : undefined,
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({
              type: 'SET_SEARCHED_GAMES',
              payload: response.games,
            });
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
    const libraryTab = centralData.openTab;
    const callType = getCallType({
      ...callTypeMatches,
      libraryTab,
      gameQuestion,
    });
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
            callType.publicPrivateType,
            null,
            null,
            centralData.searchTerms,
            newSort.direction ?? SortDirection.ASC,
            newSort.field,
            centralData.selectedGrades,
            null,
            isLibrary ?? false,
            isLibrary ? centralData.userProfile.dynamoId : undefined,
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({
              type: 'SET_SEARCHED_QUESTIONS',
              payload: response.questions,
            });
          });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            callType.publicPrivateType,
            null,
            null,
            centralData.searchTerms,
            newSort.direction ?? SortDirection.ASC,
            newSort.field,
            centralData.selectedGrades,
            null,
            isLibrary ?? false,
            isLibrary ? centralData.userProfile.dynamoId : undefined,
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({
              type: 'SET_SEARCHED_GAMES',
              payload: response.games,
            });
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
        searchGameQuestion: GameQuestionType,
        libraryTab: LibraryTabEnum,
        userProfile: IUserProfile,
      ) => {
        centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
        centralDataDispatch({ type: 'SET_SEARCH_TERMS', payload: search });
        centralDataDispatch({ type: 'SET_NEXT_TOKEN', payload: null });
        const callType = getCallType({
          ...callTypeMatches,
          libraryTab,
          gameQuestion: searchGameQuestion,
        });
        switch (searchGameQuestion) {
          case GameQuestionType.QUESTION:
            centralDataDispatch({
              type: 'SET_SEARCHED_QUESTIONS',
              payload: [],
            });
            apiClients?.centralDataManager
              ?.searchForQuestionTemplates(
                callType.publicPrivateType,
                500,
                null,
                search,
                sortDirection,
                sortType,
                gradeTargets,
                null,
                isLibrary ?? false,
                isLibrary ? userProfile.dynamoId : undefined,
              )
              .then((response) => {
                centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
                centralDataDispatch({
                  type: 'SET_SEARCHED_QUESTIONS',
                  payload: response.questions,
                });
              });
            break;
          case GameQuestionType.GAME:
          default:
            centralDataDispatch({ type: 'SET_SEARCHED_GAMES', payload: [] });
            apiClients?.centralDataManager
              ?.searchForGameTemplates(
                callType.publicPrivateType,
                500,
                null,
                search,
                sortDirection,
                sortType,
                gradeTargets,
                null,
                isLibrary ?? false,
                isLibrary ? userProfile.dynamoId : undefined,
              )
              .then((response) => {
                centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
                centralDataDispatch({
                  type: 'SET_SEARCHED_GAMES',
                  payload: response.games,
                });
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
      gameQuestion,
      centralData.openTab,
      centralData.userProfile,
    );
  };

  const getPublicPrivateElements = (
    newPublicPrivate: PublicPrivateType,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => {
    if (!isFromLibrary)
      centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    centralDataDispatch({
      type: 'SET_PUBLIC_PRIVATE',
      payload: newPublicPrivate,
    });
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
            newPublicPrivate,
            12,
            nextToken ?? null,
            searchTerms ?? centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            centralData.selectedGrades ?? [],
            null,
            isFromLibrary ?? false,
            isFromLibrary ? centralData.userProfile.dynamoId : undefined,
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            if (response) {
              switch (newPublicPrivate) {
                case PublicPrivateType.PRIVATE:
                  centralDataDispatch({
                    type: 'SET_PRIVATE_QUESTIONS',
                    payload: [
                      ...centralData.privateQuestions,
                      ...response.questions,
                    ],
                  });
                  centralDataDispatch({
                    type: 'SET_NEXT_TOKEN',
                    payload: response.nextToken,
                  });
                  centralDataDispatch({
                    type: 'SET_IS_LOADING_INFINITE_SCROLL',
                    payload: false,
                  });
                  break;
                case PublicPrivateType.PUBLIC:
                default:
                  centralDataDispatch({
                    type: 'SET_PUBLIC_QUESTIONS',
                    payload: [
                      ...centralData.publicQuestions,
                      ...response.questions,
                    ],
                  });
                  centralDataDispatch({
                    type: 'SET_NEXT_TOKEN',
                    payload: response.nextToken,
                  });
                  centralDataDispatch({
                    type: 'SET_IS_LOADING_INFINITE_SCROLL',
                    payload: false,
                  });
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
            12,
            nextToken ?? null,
            searchTerms ?? centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            centralData.selectedGrades ?? [],
            null,
            isFromLibrary ?? false,
            isFromLibrary ? centralData.userProfile.dynamoId : undefined,
          )
          .then((response) => {
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            if (response)
              switch (newPublicPrivate) {
                case PublicPrivateType.PRIVATE:
                  centralDataDispatch({
                    type: 'SET_PRIVATE_GAMES',
                    payload: [...centralData.privateGames, ...response.games],
                  });
                  centralDataDispatch({
                    type: 'SET_NEXT_TOKEN',
                    payload: response.nextToken,
                  });
                  centralDataDispatch({
                    type: 'SET_IS_LOADING_INFINITE_SCROLL',
                    payload: false,
                  });
                  break;
                case PublicPrivateType.PUBLIC:
                default:
                  centralDataDispatch({
                    type: 'SET_PUBLIC_GAMES',
                    payload: [...centralData.publicGames, ...response.games],
                  });
                  centralDataDispatch({
                    type: 'SET_NEXT_TOKEN',
                    payload: response.nextToken,
                  });
                  centralDataDispatch({
                    type: 'SET_IS_LOADING_INFINITE_SCROLL',
                    payload: false,
                  });
                  break;
              }
          });
        break;
    }
  };

  // loadMore on explore pages
  const loadMore = () => {
    if (centralData.nextToken && !centralData.isLoadingInfiniteScroll) {
      centralDataDispatch({
        type: 'SET_IS_LOADING_INFINITE_SCROLL',
        payload: true,
      });
      switch (gameQuestion) {
        case GameQuestionType.QUESTION:
          apiClients.questionTemplate
            .listQuestionTemplates(
              PublicPrivateType.PUBLIC,
              12,
              centralData.nextToken,
              null,
              null,
              centralData.selectedGrades ?? [],
              null,
            )
            .then((response) => {
              if (response) {
                centralDataDispatch({
                  type: 'SET_MOST_POPULAR_QUESTIONS',
                  payload: [
                    ...centralData.mostPopularQuestions,
                    ...response.questionTemplates,
                  ],
                });
                centralDataDispatch({
                  type: 'SET_NEXT_TOKEN',
                  payload: response.nextToken ?? null,
                });
                centralDataDispatch({
                  type: 'SET_IS_LOADING_INFINITE_SCROLL',
                  payload: false,
                });
              }
            })
            .catch((error) => {
              console.error('Error fetching more questions:', error);
              centralDataDispatch({
                type: 'SET_IS_LOADING_INFINITE_SCROLL',
                payload: false,
              });
            });
          break;
        case GameQuestionType.GAME:
        default:
          apiClients.gameTemplate
            .listGameTemplates(
              PublicPrivateType.PUBLIC,
              12,
              centralData.nextToken,
              null,
              null,
              centralData.selectedGrades ?? [],
              null,
              true
            )
            .then((response) => {
              if (response) {
                centralDataDispatch({
                  type: 'SET_MOST_POPULAR_GAMES',
                  payload: [
                    ...centralData.mostPopularGames,
                    ...response.gameTemplates,
                  ],
                });
                centralDataDispatch({
                  type: 'SET_NEXT_TOKEN',
                  payload: response.nextToken ?? null,
                });
                centralDataDispatch({
                  type: 'SET_IS_LOADING_INFINITE_SCROLL',
                  payload: false,
                });
              }
            })
            .catch((error) => {
              console.error('Error fetching more games:', error);
              centralDataDispatch({
                type: 'SET_IS_LOADING_INFINITE_SCROLL',
                payload: false,
              });
            });
          break;
      }
    }
  };

  const getDrafts = async (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => {
    if (!isFromLibrary)
      centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        apiClients?.centralDataManager
          ?.searchForQuestionTemplates(
            PublicPrivateType.DRAFT,
            12,
            nextToken ?? null,
            searchTerms ?? centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            [...centralData.selectedGrades],
            null,
          )
          .then((response) => {
            centralDataDispatch({
              type: 'SET_DRAFT_QUESTIONS',
              payload: [...centralData.draftQuestions, ...response.questions],
            });
            centralDataDispatch({
              type: 'SET_NEXT_TOKEN',
              payload: response.nextToken,
            });
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({
              type: 'SET_IS_LOADING_INFINITE_SCROLL',
              payload: false,
            });
          });
        break;
      case GameQuestionType.GAME:
      default:
        apiClients?.centralDataManager
          ?.searchForGameTemplates(
            PublicPrivateType.DRAFT,
            12,
            nextToken ?? null,
            libraryTab ? '' : centralData.searchTerms,
            centralData.sort.direction ?? SortDirection.ASC,
            centralData.sort.field,
            [...centralData.selectedGrades],
            null,
          )
          .then((response) => {
            centralDataDispatch({
              type: 'SET_DRAFT_GAMES',
              payload: [...centralData.draftGames, ...response.games],
            });
            centralDataDispatch({
              type: 'SET_NEXT_TOKEN',
              payload: response.nextToken,
            });
            centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
            centralDataDispatch({
              type: 'SET_IS_LOADING_INFINITE_SCROLL',
              payload: false,
            });
          });
        break;
    }
  };

  const getFav = async (
    user: IUserProfile,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibrary?: boolean,
  ) => {
    if (!isFromLibrary)
      centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    switch (gameQuestion) {
      case GameQuestionType.QUESTION:
        if (
          user.favoriteQuestionTemplateIds &&
          user.favoriteQuestionTemplateIds.length > 0
        ) {
          apiClients?.centralDataManager
            ?.searchForQuestionTemplates(
              PublicPrivateType.PUBLIC,
              12,
              nextToken ?? null,
              searchTerms ?? centralData.searchTerms,
              centralData.sort.direction ?? SortDirection.ASC,
              centralData.sort.field,
              [...centralData.selectedGrades],
              user.favoriteQuestionTemplateIds,
            )
            .then((response) => {
              centralDataDispatch({
                type: 'SET_FAV_QUESTIONS',
                payload: [...response.questions],
              });
              centralDataDispatch({
                type: 'SET_NEXT_TOKEN',
                payload: response.nextToken,
              });
              centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
              centralDataDispatch({
                type: 'SET_IS_LOADING_INFINITE_SCROLL',
                payload: false,
              });
            });
        } else {
          centralDataDispatch({ type: 'SET_FAV_QUESTIONS', payload: [] });
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({
            type: 'SET_IS_LOADING_INFINITE_SCROLL',
            payload: false,
          });
        }
        break;
      case GameQuestionType.GAME:
      default:
        if (
          user.favoriteGameTemplateIds &&
          user.favoriteGameTemplateIds.length > 0
        ) {
          apiClients?.centralDataManager
            ?.searchForGameTemplates(
              PublicPrivateType.PUBLIC,
              12,
              nextToken ?? null,
              searchTerms ?? centralData.searchTerms,
              centralData.sort.direction ?? SortDirection.ASC,
              centralData.sort.field,
              [...centralData.selectedGrades],
              user.favoriteGameTemplateIds,
            )
            .then((response) => {
              centralDataDispatch({
                type: 'SET_FAV_GAMES',
                payload: [...response.games],
              });
              centralDataDispatch({
                type: 'SET_NEXT_TOKEN',
                payload: response.nextToken,
              });
              centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
              centralDataDispatch({
                type: 'SET_IS_LOADING_INFINITE_SCROLL',
                payload: false,
              });
            });
        } else {
          centralDataDispatch({ type: 'SET_FAV_GAMES', payload: [] });
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({
            type: 'SET_IS_LOADING_INFINITE_SCROLL',
            payload: false,
          });
        }
        break;
    }
  };

  const isUserProfileComplete = (profile: IUserProfile): boolean => {
    return Object.entries(profile).every(([key, value]) => {
      if (key === 'password') return true;
      return value !== undefined && value !== null && value !== '';
    });
  };

  const fetchElement = async (
    type: GameQuestionType,
    id: string,
    isPrivateQuestion?: boolean,
  ) => {
    centralDataDispatch({ type: 'SET_IS_LOADING', payload: true });
    const callType = isPrivateQuestion
      ? {
          gameQuestionType: GameQuestionType.QUESTION,
          publicPrivateType: PublicPrivateType.PRIVATE,
        }
      : getCallType({ ...callTypeMatches });
    switch (type) {
      case GameQuestionType.QUESTION: {
        const responseQuestion =
          await apiClients?.questionTemplate.getQuestionTemplate(
            callType.publicPrivateType,
            id,
          );
        let selectedQuestion: ISelectedQuestion = {
          question: responseQuestion,
          profilePic: '',
          createdName: '',
          lastModified: new Date(),
          timesPlayed: 0,
        };
        if (responseQuestion) {
          const userResponse = await apiClients?.user.getUser(
            responseQuestion.userId,
          );
          if (userResponse) {
            const title =
              userResponse.title && userResponse.title !== 'Title...'
                ? userResponse.title
                : '';
            const firstName = userResponse?.firstName?.split('')[0] ?? '';
            selectedQuestion = {
              question: responseQuestion,
              profilePic: userResponse.profilePicPath ?? '',
              createdName: `${title} ${firstName.toUpperCase()}. ${userResponse.lastName}`,
              lastModified: responseQuestion.updatedAt ?? new Date(),
              timesPlayed: responseQuestion.timesPlayed ?? 0,
            };
          }
        }
        centralDataDispatch({
          type: 'SET_SELECTED_QUESTION',
          payload: selectedQuestion,
        });
        centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
        return selectedQuestion;
      }
      case GameQuestionType.GAME:
      default: {
        const responseGame = await apiClients?.gameTemplate.getGameTemplate(
          callType.publicPrivateType,
          id,
        );
        // TODO: check refresh condition on an empty game, as I think questionTEmplatesOrder is going to break stuff when its null
        let selectedGame: ISelectedGame = {
          game: responseGame,
          profilePic: '',
          createdName: '',
          lastModified: new Date(),
          timesPlayed: 0,
        };
        if (responseGame) {
          const userResponse = await apiClients?.user.getUser(
            responseGame.userId,
          );
          if (userResponse) {
            const title =
              userResponse.title && userResponse.title !== 'Title...'
                ? userResponse.title
                : '';
            const firstName = userResponse?.firstName?.split('')[0] ?? '';
            selectedGame = {
              game: responseGame,
              profilePic: userResponse.profilePicPath ?? '',
              createdName: `${title} ${firstName.toUpperCase()}. ${userResponse.lastName}`,
              lastModified: responseGame.updatedAt ?? new Date(),
              timesPlayed: responseGame.timesPlayed ?? 0,
            };
          }
        }
        centralDataDispatch({
          type: 'SET_SELECTED_GAME',
          payload: selectedGame,
        });
        centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
        return selectedGame;
      }
    }
  };

  const fetchElements = async (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
    isFromLibray?: boolean,
  ) => {
    const getFetchType = (tab: LibraryTabEnum | null) => {
      if (isEditGame) {
        switch (tab) {
          case LibraryTabEnum.FAVORITES:
            return FetchType.FAVORITE_QUESTIONS;
          case LibraryTabEnum.DRAFTS:
            return FetchType.DRAFT_QUESTIONS;
          case LibraryTabEnum.PRIVATE:
            return FetchType.PRIVATE_QUESTIONS;
          case LibraryTabEnum.PUBLIC:
          default:
            return FetchType.PUBLIC_QUESTIONS;
        }
      }
      if (
        (isLibrary || isCreateGame || centralData.isTabsOpen) &&
        tab !== undefined
      ) {
        switch (tab) {
          case LibraryTabEnum.FAVORITES:
            return gameQuestion === GameQuestionType.GAME
              ? FetchType.FAVORITE_GAMES
              : FetchType.FAVORITE_QUESTIONS;
          case LibraryTabEnum.DRAFTS:
            return gameQuestion === GameQuestionType.GAME
              ? FetchType.DRAFT_GAMES
              : FetchType.DRAFT_QUESTIONS;
          case LibraryTabEnum.PRIVATE:
            return gameQuestion === GameQuestionType.GAME
              ? FetchType.PRIVATE_GAMES
              : FetchType.PRIVATE_QUESTIONS;
          case LibraryTabEnum.PUBLIC:
          default:
            return gameQuestion === GameQuestionType.GAME
              ? FetchType.PUBLIC_GAMES
              : FetchType.PUBLIC_QUESTIONS;
        }
      }
      if (isQuestions) return FetchType.EXPLORE_QUESTIONS;
      return FetchType.EXPLORE_GAMES;
    };
    const fetchType = getFetchType(libraryTab ?? null);
    switch (fetchType) {
      case FetchType.PUBLIC_GAMES:
      case FetchType.PUBLIC_QUESTIONS:
        getPublicPrivateElements(
          PublicPrivateType.PUBLIC,
          searchTerms,
          nextToken,
          isFromLibray ?? false,
        );
        break;
      case FetchType.PRIVATE_QUESTIONS:
      case FetchType.PRIVATE_GAMES:
        getPublicPrivateElements(
          PublicPrivateType.PRIVATE,
          searchTerms,
          nextToken,
          isFromLibray ?? false,
        );
        break;
      case FetchType.DRAFT_QUESTIONS:
      case FetchType.DRAFT_GAMES:
        getDrafts(libraryTab, searchTerms, nextToken, isFromLibray ?? false);
        break;
      case FetchType.FAVORITE_QUESTIONS:
      case FetchType.FAVORITE_GAMES:
        getFav(
          centralData.userProfile,
          searchTerms,
          nextToken,
          isFromLibray ?? false,
        );
        break;
      case FetchType.EXPLORE_QUESTIONS:
        apiClients?.centralDataManager?.initQuestions().then((response) => {
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({
            type: 'SET_IS_LOADING_INFINITE_SCROLL',
            payload: false,
          });
          centralDataDispatch({
            type: 'SET_RECOMMENDED_QUESTIONS',
            payload: response.questions,
          });
          centralDataDispatch({
            type: 'SET_MOST_POPULAR_QUESTIONS',
            payload: response.questions,
          });
          centralDataDispatch({
            type: 'SET_NEXT_TOKEN',
            payload: response.nextToken,
          });
        });
        break;
      case FetchType.EXPLORE_GAMES:
      default:
        apiClients?.centralDataManager?.initGames().then((response) => {
          centralDataDispatch({ type: 'SET_IS_LOADING', payload: false });
          centralDataDispatch({
            type: 'SET_IS_LOADING_INFINITE_SCROLL',
            payload: false,
          });
          centralDataDispatch({
            type: 'SET_RECOMMENDED_GAMES',
            payload: response.games,
          });
          centralDataDispatch({
            type: 'SET_MOST_POPULAR_GAMES',
            payload: response.games,
          });
          centralDataDispatch({
            type: 'SET_NEXT_TOKEN',
            payload: response.nextToken,
          });
        });
        break;
    }
  };

  const loadMoreLibrary = (
    libraryTab?: LibraryTabEnum,
    searchTerms?: string,
    nextToken?: string | null,
  ) => {
    if (nextToken && !centralData.isLoadingInfiniteScroll) {
      centralDataDispatch({
        type: 'SET_IS_LOADING_INFINITE_SCROLL',
        payload: true,
      });
      fetchElements(libraryTab, searchTerms, nextToken, true);
    }
  };

  const checkForUniqueEmail = async (email: string) => {
    const response = await apiClients?.user.getUserByEmail(email);
    if (response) return false;
    return true;
  };

  // useEffect for monitoring changes to auth status of Cognito User
  useEffect(() => {
    if (apiClients.auth.isUserAuth)
      centralDataDispatch({
        type: 'SET_USER_STATUS',
        payload: UserStatusType.LOGGEDIN,
      });
  }, [apiClients.auth.isUserAuth]); // eslint-disable-line

  const handleLogOut = async () => {
    centralDataDispatch({
      type: 'SET_USER_STATUS',
      payload: UserStatusType.LOADING,
    });
    await apiClients.centralDataManager?.signOut();
    apiClients.centralDataManager?.clearLocalUserProfile();
    centralDataDispatch({ type: 'CLEAR_USER_PROFILE' });
    centralDataDispatch({ type: 'SET_IS_LIBRARY_INIT', payload: true });
    centralDataDispatch({
      type: 'SET_USER_STATUS',
      payload: UserStatusType.LOGGEDOUT,
    });
    navigate('/');
  };

  const validateUser = async () => {
    const status = await apiClients.auth.verifyAuth();
    if (status) {
      const currentSession = await apiClients.auth.getCurrentSession();
      const cognitoId = currentSession?.userSub;
      if (!cognitoId) {
        handleLogOut();
        return;
      }
      const localProfile =
        await apiClients.centralDataManager?.getUser(cognitoId);
      if (localProfile) {
        if (
          !isUserProfileComplete(localProfile) ||
          cognitoId !== localProfile.cognitoId
        ) {
          handleLogOut();
          return;
        }
        // if there is a local profile
        if (
          (
            currentSession.tokens?.idToken?.payload?.identities as
              | { providerName: string }[]
              | undefined
          )?.some((i) => i.providerName === 'Google')
        ) {
          centralDataDispatch({
            type: 'SET_USER_PROFILE',
            payload: localProfile,
          });
          centralDataDispatch({
            type: 'SET_USER_STATUS',
            payload: UserStatusType.GOOGLE_SIGNIN,
          });
          return;
        }
        centralDataDispatch({
          type: 'SET_USER_PROFILE',
          payload: localProfile,
        });
        centralDataDispatch({
          type: 'SET_USER_STATUS',
          payload: UserStatusType.LOGGEDIN,
        });
        return;
      }
      // case for google oauth sign up, cognito present, but no local profile
      // google idtoken has a providerName whereas cognito does not
      if (
        (
          currentSession.tokens?.idToken?.payload?.identities as
            | { providerName: string }[]
            | undefined
        )?.some((i) => i.providerName === 'Google')
      ) {
        const { firstName, lastName } =
          await apiClients.auth.getFirstAndLastName();
        centralDataDispatch({
          type: 'SET_ADVANCE_GOOGLE_SIGNUP',
          payload: {
            firstName,
            lastName,
            userStatus: UserStatusType.GOOGLE_SIGNUP,
          },
        });
        return;
      }
    }
    centralDataDispatch({
      type: 'SET_USER_STATUS',
      payload: UserStatusType.LOADING,
    });
    await apiClients.centralDataManager?.signOut();
    apiClients.centralDataManager?.clearLocalUserProfile();
    centralDataDispatch({ type: 'CLEAR_USER_PROFILE' });
    centralDataDispatch({
      type: 'SET_USER_STATUS',
      payload: UserStatusType.LOGGEDOUT,
    });
  };

  const deleteQuestionTemplate = async (
    questionId: string,
    type: PublicPrivateType,
  ) => {
    try {
      const response =
        await apiClients.centralDataManager?.deleteQuestionTemplate(
          type,
          questionId,
        );
    } catch (err) {
      console.error('Error deleting question template:', err);
      throw new Error('Failed to delete question template');
    }
  };

  // useEffect for verifying that user data (Cognito and User Profile) is complete and valid
  // runs only on initial app load
  useEffect(() => {
    centralDataDispatch({
      type: 'SET_USER_STATUS',
      payload: UserStatusType.LOADING,
    });
    const executeValidate = async () => {
      try {
        await validateUser();
      } catch (err) {
        console.error('Error validating user:', err);
      }
    };
    // call it
    executeValidate();
  }, []); // eslint-disable-line

  return {
    setIsTabsOpen,
    handleLibraryInit,
    fetchElement,
    fetchElements,
    isUserProfileComplete,
    handleChooseGrades,
    handleSortChange,
    handleSearchChange,
    getPublicPrivateElements,
    loadMore,
    loadMoreLibrary,
    handleLogOut,
    checkForUniqueEmail,
    deleteQuestionTemplate,
  };
}
