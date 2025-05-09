import { IGameTemplate, IQuestionTemplate, IUserProfile, GradeTarget, PublicPrivateType, SortType, SortDirection } from '@righton/networking';
import { ICentralDataState } from '../context/ICentralDataState';
import { UserStatusType } from '../CentralModels';

export type CentralDataAction =
  | { type: 'SET_USER_STATUS'; payload: UserStatusType }
  | { type: 'SET_USER_PROFILE'; payload: IUserProfile }
  | { type: 'SET_RECOMMENDED_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_MOST_POPULAR_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_SEARCHED_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_PUBLIC_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_PRIVATE_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_DRAFT_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_FAV_GAMES'; payload: IGameTemplate[] }
  | { type: 'SET_SELECTED_GAME'; payload: {
      game: IGameTemplate | null,
      profilePic: string | null;
      createdName: string | null;
      lastModified: string | null;
      numUsed: number | null;
  } }
  | { type: 'SET_SELECTED_GAME_PROFILE_PIC'; payload: string | null }
  | { type: 'SET_RECOMMENDED_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_MOST_POPULAR_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_SEARCHED_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_PUBLIC_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_PRIVATE_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_DRAFT_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_FAV_QUESTIONS'; payload: IQuestionTemplate[] }
  | { type: 'SET_SELECTED_QUESTION'; payload: {
      question: IQuestionTemplate | null,
      profilePic: string | null;
      createdName: string | null;
      lastModified: string | null;
      numUsed: number | null;
  }}
  | { type: 'SET_IS_LOADING'; payload: boolean }
  | { type: 'SET_IS_LOADING_INFINITE_SCROLL'; payload: boolean }
  | { type: 'SET_NEXT_TOKEN'; payload: string | null}
  | { type: 'SET_SEARCH_TERMS'; payload: string }
  | { type: 'SET_SELECTED_GRADES'; payload: GradeTarget[] }
  | { type: 'SET_IS_LIBRARY_INIT'; payload: boolean }
  | { type: 'SET_IS_TABS_OPEN'; payload: boolean }
  | { type: 'SET_IS_FAV_TAB_OPEN'; payload: boolean }
  | { type: 'SET_PUBLIC_PRIVATE'; payload: PublicPrivateType }
  | { type: 'SET_SORT'; payload: { field: SortType, direction: SortDirection | null } }
  | { type: 'SET_ADVANCE_GOOGLE_SIGNUP'; payload: { firstName: string, lastName: string, userStatus: UserStatusType } };
  
export const centralDataReducer = (state: ICentralDataState, action: CentralDataAction): ICentralDataState => {
  switch (action.type) {
    case 'SET_USER_STATUS':
      return { ...state, userStatus: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: {...state.userProfile, ...action.payload},};
    case 'SET_RECOMMENDED_GAMES':
      return { ...state, recommendedGames: action.payload };
    case 'SET_SEARCHED_GAMES':
      return { ...state, searchedGames: action.payload };
    case 'SET_MOST_POPULAR_GAMES':
      return { ...state, mostPopularGames: action.payload };
    case 'SET_PUBLIC_GAMES':
      return { ...state, publicGames: action.payload };
    case 'SET_PRIVATE_GAMES':
      return { ...state, privateGames: action.payload };
    case 'SET_DRAFT_GAMES':
      return { ...state, draftGames: action.payload };
    case 'SET_FAV_GAMES':
      return { ...state, favGames: action.payload };
    case 'SET_SELECTED_GAME':
      return { ...state, selectedGame: action.payload };
    case 'SET_RECOMMENDED_QUESTIONS':
      return { ...state, recommendedQuestions: action.payload };
    case 'SET_MOST_POPULAR_QUESTIONS':
      return { ...state, mostPopularQuestions: action.payload };
    case 'SET_SEARCHED_QUESTIONS':
      return { ...state, searchedQuestions: action.payload };
    case 'SET_PUBLIC_QUESTIONS':
      return { ...state, publicQuestions: action.payload };
    case 'SET_PRIVATE_QUESTIONS':
      return { ...state, privateQuestions: action.payload };
    case 'SET_DRAFT_QUESTIONS':
      return { ...state, draftQuestions: action.payload };
    case 'SET_FAV_QUESTIONS':
      return { ...state, favQuestions: action.payload };
    case 'SET_SELECTED_QUESTION':
      return { ...state, selectedQuestion: action.payload };
    case 'SET_IS_LOADING':
      return {...state, isLoading: action.payload};
    case 'SET_IS_LOADING_INFINITE_SCROLL':
      return {...state, isLoadingInfiniteScroll: action.payload};
    case 'SET_NEXT_TOKEN':
      return {...state, nextToken: action.payload};
    case 'SET_SEARCH_TERMS':
      return {...state, searchTerms: action.payload};
    case 'SET_SELECTED_GRADES':
      return {...state, selectedGrades: action.payload};
    case 'SET_IS_LIBRARY_INIT':
      return {...state, isLibraryInit: action.payload};
    case 'SET_IS_TABS_OPEN':
      return {...state, isTabsOpen: action.payload};
    case 'SET_IS_FAV_TAB_OPEN':
      return {...state, isFavTabOpen: action.payload};
    case 'SET_PUBLIC_PRIVATE':
      return {...state, publicPrivate: action.payload};
    case 'SET_SORT':
      return {...state, sort: action.payload};
    case 'SET_ADVANCE_GOOGLE_SIGNUP':
      return  {...state, userProfile: {...state.userProfile, firstName: action.payload.firstName, lastName: action.payload.lastName}, userStatus: action.payload.userStatus};
    default:
      return state;
  }
};