import React, { createContext, useReducer } from 'react';
import { SortDirection, SortType, PublicPrivateType } from '@righton/networking';
import { centralDataReducer, CentralDataAction } from '../reducer/CentralDataReducer';
import { ICentralDataState } from './ICentralDataState';
import { UserStatusType } from '../CentralModels';

export const userProfileInit = {
    title: 'Title...',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
}

// initialize centralDataState
const initCentralDataState: ICentralDataState = {
  userProfile: userProfileInit,
  userStatus: UserStatusType.LOGGEDOUT,
  recommendedGames: [],
  mostPopularGames: [],
  searchedGames: [],
  publicGames: [],
  privateGames: [],
  draftGames: [],
  favGames: [],
  selectedGame: null,
  recommendedQuestions: [],
  mostPopularQuestions: [],
  searchedQuestions: [],
  publicQuestions: [],
  privateQuestions: [],
  draftQuestions: [],
  favQuestions: [],
  selectedQuestion: null,
  nextToken: null,
  isLoading: false,
  isLoadingInfiniteScroll: false,
  searchTerms: '',
  selectedGrades: [],
  isTabsOpen: false,
  isFavTabOpen: false,
  publicPrivate: PublicPrivateType.PUBLIC,
  sort: {
    field: SortType.listGameTemplates,
    direction: SortDirection.ASC,
  }
}

export interface CentralDataContextType {
  centralData: ICentralDataState;
  centralDataDispatch: React.Dispatch<CentralDataAction>;
}

export const CentralDataStateContext = createContext<ICentralDataState | undefined>(undefined);
export const CentralDataDispatchContext = createContext<React.Dispatch<any> | undefined>(undefined);

export function CentralDataProvider ({ children }: { children: React.ReactNode }) {
  const [centralData, centralDataDispatch] = useReducer(centralDataReducer, initCentralDataState);
  return (
    <CentralDataStateContext.Provider value={centralData}>
      <CentralDataDispatchContext.Provider value={centralDataDispatch}>
        {children}
      </CentralDataDispatchContext.Provider>
    </CentralDataStateContext.Provider>
  );
}