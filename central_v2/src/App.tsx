import React, { useReducer } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { useAPIClients, Environment, AppType, PublicPrivateType, SortType, SortDirection } from '@righton/networking';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { APIClientsContext } from './lib/context/APIClientsContext';
import UserProfileReducer from './lib/reducer/UserProfileReducer';
import Theme from './lib/Theme';
import AppSwitch from './switches/AppSwitch';
import CreateQuestionLoader from './loaders/CreateQuestionLoader';
import { UserProfileContext, UserProfileDispatchContext } from './lib/context/UserProfileContext';
import { centralDataReducer } from './lib/reducer/CentralDataReducer';
import { CentralDataContext } from './lib/context/CentralDataContext';
import { ICentralDataState } from './lib/context/ICentralDataState';
import { UserStatusType } from './lib/CentralModels';

function App() {
  const { apiClients, loading } = useAPIClients(
    Environment.Developing,
    AppType.CENTRAL,
  );

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
    draftGames: [],
    favGames: [],
    recommendedQuestions: [],
    mostPopularQuestions: [],
    searchedQuestions: [],
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
      field: SortType.listGameTemplatesByDate,
      direction: SortDirection.ASC,
    }
  }

  const [centralDataState, dispatchCentralDataState] = useReducer(centralDataReducer, initCentralDataState);

  const blankUserProfile = {
    title: 'Title...',
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  }
  const [userProfile, dispatchUserProfile] = useReducer(UserProfileReducer, blankUserProfile);

  function RedirectToCentralIfMissing() {
    window.location.href = 'http://dev-central.rightoneducation.com/';
    return null;
  }

  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {apiClients && (
          <>
            <Route path="/" element={<AppSwitch />} />
            <Route path="/questions" element={<AppSwitch />} />
            <Route path="/signup" element={<AppSwitch />} />
            <Route path="/login" element={<AppSwitch />} />
            <Route path="/create/game" element={<AppSwitch />} />
            <Route path="/create/question" element={<AppSwitch />} loader={CreateQuestionLoader}/>
            <Route path="/confirmation" element={<AppSwitch />} />
            <Route path="/nextstep" element={<AppSwitch />} />
            <Route path="/library" element={<AppSwitch />} />
          </>
        )}
        <Route path="*" element={<RedirectToCentralIfMissing />} />
      </>,
    ),
  );

  return (
    <GoogleOAuthProvider clientId="23009502295-0ut6vmh3km13funjo26p409mgmbkeb76.apps.googleusercontent.com">
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Theme}>
          {apiClients && (
            <APIClientsContext.Provider value={apiClients}>
            { initCentralDataState &&
              <CentralDataContext.Provider value={{centralData: centralDataState, centralDataDispatch: dispatchCentralDataState}}> 
              { userProfile &&
                <UserProfileContext.Provider value={userProfile}>
                  <UserProfileDispatchContext.Provider value={dispatchUserProfile}>
                    <RouterProvider router={router} />
                  </UserProfileDispatchContext.Provider>
                </UserProfileContext.Provider>
              }
              </CentralDataContext.Provider>
            }
            </APIClientsContext.Provider>
          )}
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
