import React, { useEffect, useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  Outlet,
  ScrollRestoration,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { APIClients, AppType, Environment } from './api';
import Theme from './lib/Theme';
import {
  GOOGLE_OAUTH_CLIENT_ID,
  MicroCoachDataStatus,
  ScreenType,
  UserStatusType,
} from './lib/MicroCoachModels';
import {
  isFlowPath,
  readSelectionParams,
  setSelectionParams,
} from './lib/selectionParams';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './hooks/context/useMicroCoachDataContext';
import { useAPIClients } from './hooks/useAPIClients';
import { useAuthResolver } from './hooks/useAuthActions';
import { useClassChildrenLoader } from './hooks/loaders';
import { useClassrooms } from './hooks/useClassrooms';
import { usePlanItems } from './hooks/usePlanItems';
import { useSessions } from './hooks/useSessions';
import { useUserState } from './hooks/useUserState';
import AppSwitch from './switches/AppSwitch';
import Preview from './pages/preview/Preview';
import PrepublishReview from './pages/prepublishReview/PrepublishReview';
import { MicroCoachDataProvider } from './lib/context/MicroCoachDataContext';

/**
 * Keeps the URL and the store's selection in step on the flow pages, which
 * read the URL's (useEffectiveSelection). Nothing renders from this effect:
 *   - URL names a class → the store takes it, so screens without one (Home, a
 *     fresh visit) start from the last class shown.
 *   - a flow page without one (a bookmark, an older link) → the URL takes the
 *     store's, replacing the entry, so Back returns to this class.
 * Raw ids are compared both ways: a SELECT always makes a new state, and an id
 * the selectors resolve differently (a deleted class) would otherwise dispatch
 * on every render. Signed-in only: sign-out clears the selection while the URL
 * may still carry one, which must not be written back.
 */
function useSelectionUrlSync(
  classrooms: ReturnType<typeof useClassrooms>,
  sessions: ReturnType<typeof useSessions>,
) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selection, userStatus } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();

  const fromUrl = readSelectionParams(searchParams);
  const urlClassId = fromUrl?.classId ?? null;
  const urlSessionId = fromUrl?.sessionId ?? null;
  const isSignedIn = userStatus === UserStatusType.LOGGEDIN;
  const needsParams =
    !fromUrl &&
    isFlowPath(pathname) &&
    classrooms.status === MicroCoachDataStatus.READY &&
    !!classrooms.selectedClassroomId;
  // The stored session, kept as is while it is the resolved class's: before
  // the class's sessions load, the resolved one would still be null.
  const fillClassId = classrooms.selectedClassroomId;
  const fillSessionId =
    selection.classId === fillClassId
      ? selection.sessionId ?? sessions.selectedSessionId
      : sessions.selectedSessionId;

  useEffect(() => {
    if (!isSignedIn) return;
    if (urlClassId) {
      if (selection.classId !== urlClassId || selection.sessionId !== urlSessionId) {
        dispatch({ type: 'SELECT', classId: urlClassId, sessionId: urlSessionId });
      }
      return;
    }
    if (needsParams) {
      setSearchParams(
        (params) =>
          setSelectionParams(params, { classId: fillClassId, sessionId: fillSessionId }),
        { replace: true, preventScrollReset: true },
      );
    }
  }, [
    dispatch,
    fillClassId,
    fillSessionId,
    isSignedIn,
    needsParams,
    selection.classId,
    selection.sessionId,
    setSearchParams,
    urlClassId,
    urlSessionId,
  ]);
}

/**
 * Parent layout route. React Router keeps this element mounted across child
 * route changes, so the auth resolver's mount effect fires exactly once per
 * session rather than re-flashing the loading state on every navigation.
 *
 * It also owns the signed-in user state. That has to live here rather than in
 * App: the router is memoised on `apiClients` (play's pattern), so anything
 * built into the route elements is captured once — user state changing in App
 * would either go stale or force a new router, and a new router remounts the
 * tree and drops ScrollRestoration's history. Here it sits *inside* the router,
 * where the resolver can also reach useNavigate, and reaches the screens through
 * the Outlet.
 */
function RootLayout({ apiClients }: { apiClients: APIClients }) {
  const user = useUserState(apiClients);
  // On-load session restore: without it a refresh comes up signed out and the
  // Google signup leg (/auth → AuthCallback) never resolves.
  useAuthResolver(apiClients, user);
  /*
   * The store holds the schema's tables, one row per id. The root layout
   * loads the teacher's classes and every class's sessions, students and
   * saved plans once; a session's misconceptions are loaded by the pages that
   * show them (useSessionMisconceptions). The hooks below only read the store.
   */
  const classrooms = useClassrooms(apiClients, user.userProfile?.id ?? null);
  useClassChildrenLoader(apiClients);
  const sessions = useSessions(apiClients);
  const plan = usePlanItems(apiClients);
  useSelectionUrlSync(classrooms, sessions);

  const outletContext = useMemo(
    () => ({ apiClients, user, classrooms, sessions, plan }),
    [apiClients, classrooms, plan, sessions, user],
  );
  return (
    <>
      {/*
       * Client-side navigation doesn't move the scroll position the way a real
       * document load does, and the sticky header hides that it hasn't — you
       * arrive on the next page already scrolled down it. This restores the
       * browser's own behaviour: top on a forward navigation, and the position
       * you actually left on Back/Forward.
       *
       * Available because the app runs a data router; getKey is deliberately
       * left at its default (location.key). Keying on pathname instead would
       * restore a remembered position on arrival, which is the bug, not the fix.
       */}
      <ScrollRestoration />
      <Outlet context={outletContext} />
    </>
  );
}

function App() {
  const { apiClients } = useAPIClients(Environment.Staging, AppType.MICROCOACH);

  /*
   * Memoised on apiClients, like play's App: createBrowserRouter must not be
   * re-run on unrelated renders — a new router instance swaps history and
   * remounts the whole tree. The router knows URLs only; AppSwitch turns a
   * ScreenType into a page wrapped in AuthGuard and AppContainer.
   */
  const router = useMemo(() => {
    if (!apiClients) return null;
    return createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<RootLayout apiClients={apiClients} />}>
            <Route
              index
              element={<AppSwitch currentScreen={ScreenType.LANDING} />}
            />
            <Route
              path="login"
              element={<AppSwitch currentScreen={ScreenType.LOGIN} />}
            />
            <Route
              path="signup/*"
              element={<AppSwitch currentScreen={ScreenType.SIGNUP} />}
            />
            <Route
              path="auth"
              element={<AppSwitch currentScreen={ScreenType.AUTH} />}
            />
            <Route
              path="password/reset"
              element={<AppSwitch currentScreen={ScreenType.PASSWORDRESET} />}
            />
            <Route
              path="dashboard"
              element={<AppSwitch currentScreen={ScreenType.DASHBOARD} />}
            />
            <Route
              path="this-week"
              // This Week merged into Home (rev2 LandingPage).
              element={<Navigate to="/dashboard" replace />}
            />
            <Route
              path="past-activities"
              element={<AppSwitch currentScreen={ScreenType.PAST_ACTIVITIES} />}
            />
            <Route
              path="review"
              element={<AppSwitch currentScreen={ScreenType.REVIEW} />}
            />
            <Route
              path="review/:misconceptionId/activities"
              element={<AppSwitch currentScreen={ScreenType.CHOOSE_ACTIVITY} />}
            />
            {/* Without a phase, ActivityFlow redirects to Before class. */}
            <Route
              path="activity/:activityId/:phase?"
              element={<AppSwitch currentScreen={ScreenType.ACTIVITY_DETAIL} />}
            />
            <Route
              path="upload-miu/*"
              element={<AppSwitch currentScreen={ScreenType.UPLOAD_MIU} />}
            />
            <Route
              path="upload-reassess/*"
              element={<AppSwitch currentScreen={ScreenType.UPLOAD_REASSESS} />}
            />
            {/* The upload was /upload-rtd before the MIU rename. */}
            <Route
              path="upload-rtd/*"
              element={<Navigate to="/upload-miu" replace />}
            />
            <Route
              path="reflect"
              element={<AppSwitch currentScreen={ScreenType.REFLECT} />}
            />
            <Route
              path="profile"
              element={<AppSwitch currentScreen={ScreenType.PROFILE} />}
            />
            <Route
              path="profile/password"
              element={<AppSwitch currentScreen={ScreenType.CHANGE_PASSWORD} />}
            />
            <Route
              path="myactivity"
              element={<AppSwitch currentScreen={ScreenType.MY_ACTIVITY} />}
            />
            {/* My Activity was /myplan before the rename. */}
            <Route path="myplan" element={<Navigate to="/myactivity" replace />} />
            {/*
              Scratchpad for reviewing eval pipeline output. Deliberately not
              routed through AppSwitch/AuthGuard — it reads the TEMPORARY
              MicroCoachPipelineRun table over the API key and has nothing to
              protect.
            */}
            <Route path="preview" element={<Preview />} />
            {/*
              Reviewer's last look at a real upload's generated results before
              the teacher sees them (linked from the "generation finished"
              email). Outside AppSwitch like /preview: no app chrome. The page
              checks sign-in and the Admins group itself.
            */}
            <Route path="prepublishreview/:sessionId" element={<PrepublishReview />} />
            {/* Any other URL goes to the landing page instead of the router's error page. */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Route>,
      ),
    );
  }, [apiClients]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={Theme}>
          <CssBaseline />
          {/*
            i18n no longer suspends (see src/i18n.tsx) — Landing renders its own
            skeleton off `ready` from useTranslation() instead. APIClients.create
            does no I/O, so the null branch lasts a single frame; rendering
            nothing there beats a spinner that flashes for one paint.
          */}
          <MicroCoachDataProvider>
            {router && <RouterProvider router={router} />}
          </MicroCoachDataProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
