import React, { createContext, useReducer } from 'react';
import { SortDirection, SortType, PublicPrivateType } from '@righton/networking';
import { centralDataReducer, CentralDataAction } from '../reducer/CentralDataReducer';
import { ICentralDataState } from './ICentralDataState';
import { UserStatusType } from '../CentralModels';

// initialize centralDataState
const initCentralDataState: ICentralDataState = {
  userProfile: {
    title: 'Title...',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  },
  userStatus: UserStatusType.LOGGEDOUT,
  recommendedGames: [],
  mostPopularGames: [],
  searchedGames: [],
  publicGames: [],
  privateGames: [],
  draftGames: [],
  favGames: [],
  recommendedQuestions: [],
  mostPopularQuestions: [],
  searchedQuestions: [],
  publicQuestions: [],
  privateQuestions: [],
  draftQuestions: [],
  favQuestions: [],
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
  console.log(centralData);
  return (
    <CentralDataStateContext.Provider value={centralData}>
      <CentralDataDispatchContext.Provider value={centralDataDispatch}>
        {children}
      </CentralDataDispatchContext.Provider>
    </CentralDataStateContext.Provider>
  );
}