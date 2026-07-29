import { IUserProfile } from '../../api';
import { IMicroCoachDataState, UserStatusType } from '../MicroCoachModels';

export const initMicroCoachDataState: IMicroCoachDataState = {
  userStatus: UserStatusType.LOADING,
  userProfile: null,
  userErrorString: '',
};

export type MicroCoachDataAction =
  | { type: 'SET_USER_STATUS'; payload: UserStatusType }
  | { type: 'SET_USER_PROFILE'; payload: IUserProfile }
  | { type: 'CLEAR_USER_PROFILE' }
  | { type: 'SET_USER_ERROR_STRING'; payload: string }
  | {
      type: 'SET_ADVANCE_GOOGLE_SIGNUP';
      payload: { firstName: string; lastName: string; userStatus: UserStatusType };
    };

export function microCoachDataReducer(
  state: IMicroCoachDataState,
  action: MicroCoachDataAction,
): IMicroCoachDataState {
  switch (action.type) {
    case 'SET_USER_STATUS':
      return { ...state, userStatus: action.payload };
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfile: { ...(state.userProfile ?? ({} as IUserProfile)), ...action.payload },
      };
    case 'CLEAR_USER_PROFILE':
      return { ...initMicroCoachDataState, userStatus: UserStatusType.LOGGEDOUT };
    case 'SET_USER_ERROR_STRING':
      return { ...state, userErrorString: action.payload };
    case 'SET_ADVANCE_GOOGLE_SIGNUP':
      return {
        ...state,
        userStatus: action.payload.userStatus,
        userProfile: {
          ...(state.userProfile ?? ({} as IUserProfile)),
          teacherName: `${action.payload.firstName} ${action.payload.lastName}`.trim(),
        },
      };
    default:
      return state;
  }
}
