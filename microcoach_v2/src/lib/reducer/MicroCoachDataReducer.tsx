import { IUserProfile } from '../../api';
import { IMicroCoachDataState, UserStatusType } from '../MicroCoachModels';
import { IPlanItem } from '../PipelineModels';
import mockPipelineOutput from '../mocks/mockPipelineOutput.json';

// Seeded from the mock until the plan is persisted server-side. The COMPLETED
// entry references a misconception outside this week's three, so it can only
// come from seed data rather than from a selection.
const seededPlanItems = (
  mockPipelineOutput as unknown as {
    savedPlan: { items: IPlanItem[] };
  }
).savedPlan.items;

export const initMicroCoachDataState: IMicroCoachDataState = {
  userStatus: UserStatusType.LOADING,
  userProfile: null,
  userErrorString: '',
  planItems: seededPlanItems,
};

export type MicroCoachDataAction =
  | { type: 'SET_USER_STATUS'; payload: UserStatusType }
  | { type: 'SET_USER_PROFILE'; payload: IUserProfile }
  | { type: 'CLEAR_USER_PROFILE' }
  | { type: 'SET_USER_ERROR_STRING'; payload: string }
  | { type: 'SAVE_ACTIVITY'; payload: IPlanItem }
  | { type: 'MARK_PLAN_ITEM_DONE'; payload: string }
  | { type: 'REMOVE_PLAN_ITEM'; payload: string }
  | {
      type: 'SET_ADVANCE_GOOGLE_SIGNUP';
      payload: {
        firstName: string;
        lastName: string;
        userStatus: UserStatusType;
      };
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
        userProfile: {
          ...(state.userProfile ?? ({} as IUserProfile)),
          ...action.payload,
        },
      };
    case 'CLEAR_USER_PROFILE':
      return {
        ...initMicroCoachDataState,
        planItems: state.planItems,
        userStatus: UserStatusType.LOGGEDOUT,
      };
    case 'SAVE_ACTIVITY':
      // One saved activity per misconception — selecting a different one
      // replaces the previous entry rather than stacking up.
      return {
        ...state,
        planItems: [
          ...state.planItems.filter(
            (item) =>
              item.status !== 'SAVED' ||
              item.misconceptionId !== action.payload.misconceptionId,
          ),
          action.payload,
        ],
      };
    case 'MARK_PLAN_ITEM_DONE':
      return {
        ...state,
        planItems: state.planItems.map((item) =>
          item.id === action.payload
            ? { ...item, status: 'COMPLETED' as const }
            : item,
        ),
      };
    case 'REMOVE_PLAN_ITEM':
      return {
        ...state,
        planItems: state.planItems.filter((item) => item.id !== action.payload),
      };
    case 'SET_USER_ERROR_STRING':
      return { ...state, userErrorString: action.payload };
    case 'SET_ADVANCE_GOOGLE_SIGNUP':
      return {
        ...state,
        userStatus: action.payload.userStatus,
        userProfile: {
          ...(state.userProfile ?? ({} as IUserProfile)),
          teacherName:
            `${action.payload.firstName} ${action.payload.lastName}`.trim(),
        },
      };
    default:
      return state;
  }
}
