import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIClients } from '../api';
import { UserStatusType } from '../lib/MicroCoachModels';
import { useMicroCoachDataDispatch } from './context/useMicroCoachDataContext';

// On-load auth resolver + logout, adapted from central_v2's useCentralDataActions.
// Google vs Cognito is distinguished by the idToken `identities` claim; Google
// signup-vs-signin by whether a backend User row exists for the cognitoId.
//
// Split into two hooks on purpose. The resolver carries a mount effect and must
// run exactly once, from the router's root layout; `useLogOut` is effect-free so
// any screen can call it without re-triggering auth resolution. (central_v2
// keeps both in one hook called from AppSwitch, which re-fires the effect on
// every route change and re-flashes its loading state.)

export function useLogOut(apiClients: APIClients) {
  const dispatch = useMicroCoachDataDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOADING });
    await apiClients.microcoachDataManager.signOut();
    dispatch({ type: 'CLEAR_USER_PROFILE' });
    dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
    navigate('/');
  };

  return { handleLogOut };
}

export function useAuthResolver(apiClients: APIClients) {
  const dispatch = useMicroCoachDataDispatch();
  const { handleLogOut } = useLogOut(apiClients);

  const validateUser = async () => {
    try {
      const isAuthed = await apiClients.auth.verifyAuth();
      if (!isAuthed) {
        dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
        return;
      }
      const session = await apiClients.auth.getCurrentSession();
      const cognitoId = session.userSub;
      if (!cognitoId) {
        await handleLogOut();
        return;
      }
      const identities = (session.tokens?.idToken?.payload?.identities ?? []) as {
        providerName?: string;
      }[];
      const isGoogle = Array.isArray(identities)
        && identities.some((i) => i.providerName === 'Google');

      const profile = await apiClients.microcoachDataManager.getUser(cognitoId);
      if (profile) {
        dispatch({ type: 'SET_USER_PROFILE', payload: profile });
        dispatch({
          type: 'SET_USER_STATUS',
          payload: isGoogle ? UserStatusType.GOOGLE_SIGNIN : UserStatusType.LOGGEDIN,
        });
      } else if (isGoogle) {
        const { firstName, lastName } = await apiClients.auth.getFirstAndLastName();
        dispatch({
          type: 'SET_ADVANCE_GOOGLE_SIGNUP',
          payload: { firstName, lastName, userStatus: UserStatusType.GOOGLE_SIGNUP },
        });
      } else {
        dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.NONVERIFIED });
      }
    } catch (e) {
      console.error('validateUser failed', e);
      dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOGGEDOUT });
    }
  };

  useEffect(() => {
    dispatch({ type: 'SET_USER_STATUS', payload: UserStatusType.LOADING });
    validateUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { validateUser };
}
