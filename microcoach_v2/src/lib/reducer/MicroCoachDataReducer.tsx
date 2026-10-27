import { IUser } from '../../api/Models/IUser';
import {
  IMicroCoachDataState,
  ILoadState,
  initMicroCoachDataState,
  MicroCoachDataStatus,
  TableName,
  TableRow,
  UserStatusType,
} from '../MicroCoachModels';

// One table's rows, typed by the table they go into.
type RowsFor = {
  [T in TableName]: { table: T; rows: TableRow<T>[] };
}[TableName];

type ParentKey = 'classId' | 'sessionId' | 'misconceptionId';

export type MicroCoachDataAction =
  | { type: 'SET_USER_PROFILE'; payload: IUser | null }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<IUser> }
  | { type: 'SET_USER_STATUS'; payload: UserStatusType }
  | { type: 'SET_USER_ERROR_STRING'; payload: string }
  | { type: 'CLEAR_USER_PROFILE' }
  // Adds rows or replaces them by id.
  | ({ type: 'UPSERT_ROWS' } & RowsFor)
  // A fetched list is the whole truth for its parent: rows of that parent the
  // answer no longer has (deleted elsewhere) go, the rest are upserted.
  // Without a parent it replaces the whole table.
  | ({
      type: 'REPLACE_ROWS';
      parent?: { key: ParentKey; id: string };
    } & RowsFor)
  | { type: 'REMOVE_ROWS'; table: TableName; ids: string[] }
  | {
      type: 'SET_LOAD';
      key: string;
      status: MicroCoachDataStatus;
      error?: Error | null;
    }
  // Marks every load whose key starts with the prefix for a background refetch.
  | { type: 'MARK_LOADS_STALE'; prefix: string }
  | { type: 'SELECT'; classId: string | null; sessionId: string | null };

// Rows keyed by id. The action's union already ties rows to their table.
const byId = (rows: readonly { id: string }[]) =>
  Object.fromEntries(rows.map((row) => [row.id, row]));

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
      return { ...initMicroCoachDataState, epoch: state.epoch + 1 };
    case 'UPSERT_ROWS':
      return {
        ...state,
        [action.table]: { ...state[action.table], ...byId(action.rows) },
      };
    case 'REPLACE_ROWS': {
      const { table, rows, parent } = action;
      if (!parent) return { ...state, [table]: byId(rows) };
      const kept = Object.values(state[table]).filter(
        (row) => (row as Record<string, unknown>)[parent.key] !== parent.id,
      );
      return { ...state, [table]: byId([...kept, ...rows]) };
    }
    case 'REMOVE_ROWS': {
      const next = { ...state[action.table] };
      action.ids.forEach((id) => delete next[id]);
      return { ...state, [action.table]: next };
    }
    case 'SET_LOAD': {
      const load: ILoadState = {
        status: action.status,
        error: action.error ?? null,
        stale: false,
      };
      return { ...state, loads: { ...state.loads, [action.key]: load } };
    }
    case 'MARK_LOADS_STALE': {
      const loads = Object.fromEntries(
        Object.entries(state.loads).map(([key, load]) => [
          key,
          key.startsWith(action.prefix) ? { ...load, stale: true } : load,
        ]),
      );
      return { ...state, loads };
    }
    case 'SELECT':
      return {
        ...state,
        selection: { classId: action.classId, sessionId: action.sessionId },
      };
    default:
      return state;
  }
}
