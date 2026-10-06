import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScreenType } from '../lib/MicroCoachModels';
import { useAppOutletContext } from '../hooks/useAppOutletContext';
import { useLogOut } from '../hooks/useAuthActions';
import { useScreenSize } from '../hooks/useScreenSize';
import AppContainer from '../containers/AppContainer';
import { HeaderVariant } from '../components/Header';
import TemplateDebugMenu from '../components/TemplateDebugMenu';
import AuthGuard from '../containers/AuthGuard';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import SignUpWizard from '../containers/SignUpWizard';
import ResetPassword from '../pages/ResetPassword';
import AuthCallback from '../pages/AuthCallback';
import Dashboard from '../pages/Dashboard';
import ThisWeek from '../pages/ThisWeek';
import PastActivities from '../pages/PastActivities';
import Review from '../pages/Review';
import ChooseActivity from '../pages/ChooseActivity';
import MyPlan from '../pages/MyPlan';
import ActivityDetail from '../pages/ActivityDetail';
import Profile from '../pages/Profile';
import UploadFlow from '../containers/UploadFlow';
import Reflect from '../pages/Reflect';

/**
 * Maps a ScreenType to its page, wraps it in AuthGuard, and drops the result
 * into AppContainer. Mirrors central_v2's AppSwitch — the router only knows
 * URLs, this decides what a screen actually is.
 */

/**
 * Screens whose content doesn't depend on who the user is. They render while
 * the auth check is still in flight, so their own copy and imagery start
 * loading immediately rather than queueing behind it.
 *
 * Everything else requires a signed-in user: AuthGuard holds it during
 * LOADING (its content is the user's own data) and redirects a signed-out
 * visitor to the landing page. AuthGuard's other status redirects apply to
 * every screen either way.
 */
const PUBLIC_SCREENS = new Set<ScreenType>([
  ScreenType.LANDING,
  ScreenType.LOGIN,
  ScreenType.SIGNUP,
  ScreenType.PASSWORDRESET,
  // /auth is the Cognito redirect target. Its whole content is "hold on while
  // we finish", which does not depend on knowing who the user is — holding it
  // behind the auth check just showed a blank screen for the length of
  // validateUser before the message appeared.
  ScreenType.AUTH,
  // Every in-app screen is deliberately absent: they need a signed-in user, so
  // AuthGuard holds them during LOADING and sends a signed-out visitor to /.
]);

// The wizard's own chrome: brand only, no auth links to a flow you are in.
const SIGNUP_SCREENS = new Set<ScreenType>([
  ScreenType.LOGIN,
  ScreenType.PASSWORDRESET,
  ScreenType.SIGNUP,
  // /auth is mid-signup: the Cognito redirect lands here while the account is
  // being finished. Offering Sign up / Log in there points at the flow the user
  // is already inside. Also drops the footer, matching the wizard steps.
  ScreenType.AUTH,
]);

/*
 * The profile frame draws the app header differently from every other in-app
 * frame: identity as avatar-and-name, and no class switcher. CHANGE_PASSWORD
 * has no frame of its own, but it is entered from the profile — flipping the
 * pill and re-adding the switcher mid-flow would read as a glitch.
 */
const PROFILE_CHROME_SCREENS = new Set<ScreenType>([
  ScreenType.PROFILE,
  ScreenType.CHANGE_PASSWORD,
]);

// Screens whose header is the initials avatar and its account menu (HeaderVariant
// `avatar`): the sidebar screens and the MIU upload flow.
const AVATAR_HEADER_SCREENS = new Set<ScreenType>([
  ScreenType.DASHBOARD,
  ScreenType.THIS_WEEK,
  ScreenType.PAST_ACTIVITIES,
  ScreenType.UPLOAD_MIU,
]);

const APP_CHROME_SCREENS = new Set<ScreenType>([
  ScreenType.PROFILE,
  ScreenType.CHANGE_PASSWORD,
  ScreenType.UPLOAD_MIU,
  ScreenType.REFLECT,
  ScreenType.DASHBOARD,
  ScreenType.THIS_WEEK,
  ScreenType.PAST_ACTIVITIES,
  ScreenType.REVIEW,
  ScreenType.CHOOSE_ACTIVITY,
  ScreenType.MY_PLAN,
  ScreenType.ACTIVITY_DETAIL,
]);

interface AppSwitchProps {
  currentScreen: ScreenType;
}

export default function AppSwitch({ currentScreen }: AppSwitchProps) {
  const { apiClients, user, classrooms, sessions, plan } =
    useAppOutletContext();
  const { saveActivity, markPlanItemDone, removePlanItem } = plan;

  const screenSize = useScreenSize();
  const { handleLogOut } = useLogOut(apiClients, user);
  const navigate = useNavigate();

  /*
   * This used to clear the reducer by hand and never call handleLogOut, so the
   * Cognito session outlived the click and the next load re-authenticated
   * straight back in. handleLogOut does the local reset too — status, profile
   * and all — so the only thing left to add is the destination: the header's
   * control belongs to someone signing out deliberately, who wants the sign-in
   * screen rather than the marketing page handleLogOut lands its forced-logout
   * callers on. `replace` so Back cannot return to a screen that is now
   * unauthenticated.
   */
  const handleHeaderLogOut = async () => {
    await handleLogOut();
    navigate('/login', { replace: true });
  };

  let screenComponent;
  switch (currentScreen) {
    case ScreenType.LOGIN:
      screenComponent = (
        <Login
          apiClients={apiClients}
          screenSize={screenSize}
          signIn={user.signIn}
        />
      );
      break;
    case ScreenType.SIGNUP:
      screenComponent = (
        <SignUpWizard
          apiClients={apiClients}
          screenSize={screenSize}
          setSignedInUser={user.setSignedInUser}
          updateUserProfile={user.updateUserProfile}
        />
      );
      break;
    case ScreenType.AUTH:
      screenComponent = (
        <AuthCallback
          apiClients={apiClients}
          screenSize={screenSize}
          setSignedInUser={user.setSignedInUser}
          signOut={user.signOut}
        />
      );
      break;
    case ScreenType.PASSWORDRESET:
      screenComponent = <ResetPassword screenSize={screenSize} />;
      break;
    case ScreenType.CHANGE_PASSWORD:
      // Same flow, entered by someone already signed in: it returns to the
      // profile rather than the login screen, and drops the wizard framing.
      screenComponent = <ResetPassword screenSize={screenSize} isInSession />;
      break;
    case ScreenType.DASHBOARD:
      screenComponent = (
        <Dashboard
          apiClients={apiClients}
          screenSize={screenSize}
          classrooms={classrooms}
          sessions={sessions}
          plan={plan}
        />
      );
      break;
    case ScreenType.THIS_WEEK:
      screenComponent = (
        <ThisWeek
          apiClients={apiClients}
          screenSize={screenSize}
          classrooms={classrooms}
          sessions={sessions}
        />
      );
      break;
    case ScreenType.PAST_ACTIVITIES:
      screenComponent = (
        <PastActivities
          apiClients={apiClients}
          screenSize={screenSize}
          classrooms={classrooms}
          sessions={sessions}
        />
      );
      break;
    case ScreenType.REVIEW:
      screenComponent = <Review screenSize={screenSize} sessions={sessions} />;
      break;
    case ScreenType.CHOOSE_ACTIVITY:
      screenComponent = (
        <ChooseActivity screenSize={screenSize} saveActivity={saveActivity} />
      );
      break;
    case ScreenType.ACTIVITY_DETAIL:
      screenComponent = <ActivityDetail screenSize={screenSize} />;
      break;
    case ScreenType.UPLOAD_MIU:
      screenComponent = (
        <UploadFlow
          apiClients={apiClients}
          screenSize={screenSize}
          classrooms={classrooms}
        />
      );
      break;
    case ScreenType.REFLECT:
      screenComponent = <Reflect screenSize={screenSize} sessions={sessions} />;
      break;
    case ScreenType.PROFILE:
      screenComponent = (
        <Profile
          apiClients={apiClients}
          screenSize={screenSize}
          updateUserProfile={user.updateUserProfile}
        />
      );
      break;
    case ScreenType.MY_PLAN:
      screenComponent = (
        <MyPlan
          screenSize={screenSize}
          markPlanItemDone={markPlanItemDone}
          removePlanItem={removePlanItem}
        />
      );
      break;
    case ScreenType.LANDING:
    default:
      screenComponent = (
        <Landing screenSize={screenSize} />
      );
  }

  const usesAppChrome = APP_CHROME_SCREENS.has(currentScreen);
  const isSignUp = SIGNUP_SCREENS.has(currentScreen);

  let headerVariant: HeaderVariant = 'public';
  if (PROFILE_CHROME_SCREENS.has(currentScreen)) headerVariant = 'profile';
  else if (AVATAR_HEADER_SCREENS.has(currentScreen)) headerVariant = 'avatar';
  else if (usesAppChrome) headerVariant = 'app';
  else if (isSignUp) headerVariant = 'signup';

  return (
    <AppContainer
      headerVariant={headerVariant}
      onLogOut={handleHeaderLogOut}
      classrooms={classrooms.classrooms}
      selectedClassroomId={classrooms.selectedClassroomId}
      onSelectClassroom={classrooms.selectClassroom}
      // The sign-up frames carry no footer either.
      showFooter={!usesAppChrome && !isSignUp}
    >
      <AuthGuard
        handleLogOut={handleLogOut}
        setUserStatus={user.setUserStatus}
        setUserErrorString={user.setUserErrorString}
        screenSize={screenSize}
        requiresAuth={!PUBLIC_SCREENS.has(currentScreen)}
      >
        {screenComponent}
      </AuthGuard>
      {/* Review scaffolding — remove with TemplateDebugMenu once the activity
          screen is backed by real data. */}
      {currentScreen === ScreenType.ACTIVITY_DETAIL && <TemplateDebugMenu />}
    </AppContainer>
  );
}
