import { IMicroCoachClassroom } from '../../api/Models/IMicroCoachClassroom';
import { IMicroCoachMisconception } from '../../api/Models/IMicroCoachMisconception';
import { IMicroCoachSession } from '../../api/Models/IMicroCoachSession';
import { IUser } from '../../api/Models/IUser';
import {
  IMicroCoachDataState,
  initMicroCoachDataState,
  MicroCoachDataStatus,
  UserStatusType,
} from '../MicroCoachModels';
import { IPlanItem } from '../PipelineModels';
import { IClassActivityData } from '../ActivityListModels';
import { sortSessionsLatestFirst } from '../flowProgress';

export type MicroCoachDataAction =
  | { type: 'SET_USER_PROFILE'; payload: IUser | null }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<IUser> }
  | { type: 'SET_USER_STATUS'; payload: UserStatusType }
  | { type: 'SET_USER_ERROR_STRING'; payload: string }
  | { type: 'CLEAR_USER_PROFILE' }
  | { type: 'SET_CLASSROOMS'; payload: IMicroCoachClassroom[] }
  | { type: 'SET_SELECTED_CLASSROOM_ID'; payload: string | null }
  | { type: 'SET_CLASSROOMS_STATUS'; payload: MicroCoachDataStatus }
  | { type: 'SET_CLASSROOMS_ERROR'; payload: Error | null }
  | { type: 'SET_SESSIONS'; payload: IMicroCoachSession[] }
  | { type: 'SET_SELECTED_SESSION_ID'; payload: string | null }
  | { type: 'SET_SESSIONS_STATUS'; payload: MicroCoachDataStatus }
  | { type: 'SET_SESSIONS_ERROR'; payload: Error | null }
  | {
      type: 'UPDATE_SESSION';
      payload: { id: string; changes: Partial<IMicroCoachSession> };
    }
  | {
      type: 'SET_MISCONCEPTIONS';
      payload: IMicroCoachMisconception[];
    }
  | { type: 'SET_MISCONCEPTIONS_STATUS'; payload: MicroCoachDataStatus }
  | { type: 'SET_MISCONCEPTIONS_ERROR'; payload: Error | null }
  | { type: 'SET_PLAN_ITEMS'; payload: IPlanItem[] }
  | { type: 'SAVE_PLAN_ITEM'; payload: IPlanItem }
  | { type: 'MARK_PLAN_ITEM_DONE'; payload: string }
  | { type: 'REMOVE_PLAN_ITEM'; payload: string }
  | { type: 'SET_PLAN_ITEMS_STATUS'; payload: MicroCoachDataStatus }
  | { type: 'SET_PLAN_ITEMS_ERROR'; payload: Error | null }
  | {
      type: 'SET_CLASS_ACTIVITY';
      payload: {
        key: string;
        data: IClassActivityData | null;
        status: MicroCoachDataStatus;
      };
    }
  | { type: 'INVALIDATE_CLASS_ACTIVITY' };

const patchSession = (
  sessions: IMicroCoachSession[],
  id: string,
  changes: Partial<IMicroCoachSession>,
) =>
  sessions.map((session) =>
    session.id === id ? { ...session, ...changes } : session,
  );

export function microCoachDataReducer(
  state: IMicroCoachDataState,
  action: MicroCoachDataAction,
): IMicroCoachDataState {
  switch (action.type) {
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile
          ? { ...state.userProfile, ...action.payload }
          : (action.payload as IUser),
      };
    case 'SET_USER_STATUS':
      return { ...state, userStatus: action.payload };
    case 'SET_USER_ERROR_STRING':
      return { ...state, userErrorString: action.payload };
    case 'CLEAR_USER_PROFILE':
      return { ...initMicroCoachDataState };
    case 'SET_CLASSROOMS':
      return { ...state, classrooms: action.payload };
    case 'SET_SELECTED_CLASSROOM_ID':
      return { ...state, selectedClassroomId: action.payload };
    case 'SET_CLASSROOMS_STATUS':
      return { ...state, classroomsStatus: action.payload };
    case 'SET_CLASSROOMS_ERROR':
      return { ...state, classroomsError: action.payload };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'SET_SELECTED_SESSION_ID':
      return { ...state, selectedSessionId: action.payload };
    case 'SET_SESSIONS_STATUS':
      return { ...state, sessionsStatus: action.payload };
    case 'SET_SESSIONS_ERROR':
      return { ...state, sessionsError: action.payload };
    // One session changed here (a misconception picked): the selected class's
    // list and the cross-class data both carry it.
    case 'UPDATE_SESSION': {
      const { id, changes } = action.payload;
      return {
        ...state,
        sessions: patchSession(state.sessions, id, changes),
        classActivity: state.classActivity && {
          ...state.classActivity,
          perClass: state.classActivity.perClass.map((record) => ({
            ...record,
            sessions: patchSession(record.sessions, id, changes),
          })),
        },
      };
    }
    case 'SET_MISCONCEPTIONS':
      return { ...state, misconceptions: action.payload };
    case 'SET_MISCONCEPTIONS_STATUS':
      return { ...state, misconceptionsStatus: action.payload };
    case 'SET_MISCONCEPTIONS_ERROR':
      return { ...state, misconceptionsError: action.payload };
    case 'SET_PLAN_ITEMS':
      return { ...state, planItems: action.payload };
    case 'SAVE_PLAN_ITEM':
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
    case 'SET_PLAN_ITEMS_STATUS':
      return { ...state, planItemsStatus: action.payload };
    case 'SET_PLAN_ITEMS_ERROR':
      return { ...state, planItemsError: action.payload };
    case 'SET_CLASS_ACTIVITY': {
      const { key, data, status } = action.payload;
      const next = {
        ...state,
        classActivity: data,
        classActivityKey: key,
        classActivityStatus: status,
        classActivityStale: false,
      };
      // A refetch also refreshes the selected class's own session list (a
      // session the pipeline finished since), keeping the selection when it
      // is still there.
      const record = data?.perClass.find(
        (entry) => entry.classroom.id === state.selectedClassroomId,
      );
      if (!record || state.sessionsStatus !== MicroCoachDataStatus.READY) {
        return next;
      }
      const sessions = sortSessionsLatestFirst(record.sessions);
      const keepsSelection = sessions.some(
        (session) => session.id === state.selectedSessionId,
      );
      return {
        ...next,
        sessions,
        selectedSessionId: keepsSelection
          ? state.selectedSessionId
          : (sessions[0]?.id ?? null),
      };
    }
    case 'INVALIDATE_CLASS_ACTIVITY':
      return { ...state, classActivityStale: true };
    default:
      return state;
  }
}
