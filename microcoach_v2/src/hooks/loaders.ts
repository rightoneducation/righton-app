import { useEffect, useRef } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachSession } from '../api/Models/IMicroCoachSession';
import {
  ILoadState,
  loadKeys,
  MicroCoachDataStatus,
} from '../lib/MicroCoachModels';
import { MicroCoachDataAction } from '../lib/reducer/MicroCoachDataReducer';
import { classroomList } from '../lib/selectors';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

/*
 * The loaders fetch rows and put them in the store's tables; that is all they
 * do. Each fetch is recorded under a key naming what it fetched (loadKeys), so
 * a screen reads the status of exactly the data it shows. A key is fetched
 * when it has no entry or is marked stale; a stale refetch keeps its rows on
 * screen until the new ones replace them by id.
 */

// Keys being fetched right now, across every hook instance: two pages asking
// for the same session in one render fetch it once.
const inFlight = new Set<string>();

type Dispatch = (action: MicroCoachDataAction) => void;

/**
 * Runs one keyed fetch. `fetchRows` dispatches its rows through the guarded
 * dispatch it is given, which drops them if the user signed out meanwhile.
 * A failed refetch of data already shown keeps that data rather than erroring.
 */
async function runLoad(
  dispatch: Dispatch,
  key: string,
  previous: ILoadState | undefined,
  isCurrent: () => boolean,
  fetchRows: (guarded: Dispatch) => Promise<void>,
) {
  const guarded: Dispatch = (action) => {
    if (isCurrent()) dispatch(action);
  };
  const wasReady = previous?.status === MicroCoachDataStatus.READY;
  inFlight.add(key);
  guarded({
    type: 'SET_LOAD',
    key,
    status: wasReady ? MicroCoachDataStatus.READY : MicroCoachDataStatus.LOADING,
  });
  try {
    await fetchRows(guarded);
    guarded({ type: 'SET_LOAD', key, status: MicroCoachDataStatus.READY });
  } catch (error) {
    console.error(`[loaders] Could not load ${key}`, error);
    guarded(
      wasReady
        ? { type: 'SET_LOAD', key, status: MicroCoachDataStatus.READY }
        : {
            type: 'SET_LOAD',
            key,
            status: MicroCoachDataStatus.ERROR,
            error: error instanceof Error ? error : new Error(`Could not load ${key}`),
          },
    );
  } finally {
    inFlight.delete(key);
  }
}

const needsFetch = (load: ILoadState | undefined) => !load || load.stale;

// Whether the store is still the one a fetch started against.
function useEpochGuard() {
  const { epoch } = useMicroCoachDataState();
  const epochRef = useRef(epoch);
  epochRef.current = epoch;
  return () => {
    const started = epochRef.current;
    return () => epochRef.current === started;
  };
}

/** The signed-in teacher's classes. */
export function useClassroomsLoader(apiClients: IAPIClients, userId: string | null) {
  const { loads } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const startGuard = useEpochGuard();
  const key = userId ? loadKeys.classrooms(userId) : null;
  const load = key ? loads[key] : undefined;
  const shouldFetch = !!key && needsFetch(load);

  useEffect(() => {
    if (!key || !userId || !shouldFetch || inFlight.has(key)) return;
    runLoad(dispatch, key, load, startGuard(), async (guarded) => {
      const rows = await apiClients.classroom.getClassroomsByUserId(userId);
      guarded({ type: 'REPLACE_ROWS', table: 'classrooms', rows });
    });
    // `load` is read at the moment the fetch starts, not a reason to rerun.
  }, [apiClients, dispatch, key, shouldFetch, userId]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Every class's sessions, students and saved plans, plus the activity each
 * plan saved (Past Activities shows its title). Runs in the root layout, so a
 * class switch anywhere is answered from the store.
 */
export function useClassChildrenLoader(apiClients: IAPIClients) {
  const state = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const startGuard = useEpochGuard();
  const stateRef = useRef(state);
  stateRef.current = state;

  const pending = classroomList(state)
    .map((classroom) => classroom.id)
    .filter((classId) => needsFetch(state.loads[loadKeys.classChildren(classId)]));
  const pendingKey = pending.join(',');

  useEffect(() => {
    if (!pendingKey) return;
    pendingKey.split(',').forEach((classId) => {
      const key = loadKeys.classChildren(classId);
      if (inFlight.has(key)) return;
      runLoad(dispatch, key, stateRef.current.loads[key], startGuard(), async (guarded) => {
        const [sessions, students, savedPlans] = await Promise.all([
          apiClients.session.getSessionsByClassId(classId),
          apiClients.student.getStudentsByClassId(classId),
          apiClients.savedPlan.getSavedPlansByClassId(classId),
        ]);
        const parent = { key: 'classId' as const, id: classId };
        guarded({ type: 'REPLACE_ROWS', table: 'sessions', rows: sessions, parent });
        guarded({ type: 'REPLACE_ROWS', table: 'students', rows: students, parent });
        guarded({ type: 'REPLACE_ROWS', table: 'savedPlans', rows: savedPlans, parent });

        // One lookup per saved activity not already held. A failed lookup
        // only leaves that title blank.
        const held = stateRef.current.activities;
        const missing = Array.from(
          new Set(
            savedPlans.flatMap((plan) => {
              const id = plan.items[0]?.id;
              return id && !held[id] ? [id] : [];
            }),
          ),
        );
        const activities = await Promise.all(
          missing.map((id) => apiClients.activity.getActivity(id).catch(() => null)),
        );
        const rows = activities.flatMap((activity) => (activity ? [activity] : []));
        if (rows.length > 0) guarded({ type: 'UPSERT_ROWS', table: 'activities', rows });
      });
    });
  }, [apiClients, dispatch, pendingKey]); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * A session's misconceptions and their activities, fetched by the pages that
 * show them. Keyed on the session's status too, so a session the pipeline has
 * moved on since is asked again.
 */
export function useSessionChildrenLoader(
  apiClients: IAPIClients,
  session: IMicroCoachSession | null,
): { status: MicroCoachDataStatus; error: Error | null } {
  const { loads } = useMicroCoachDataState();
  const dispatch = useMicroCoachDataDispatch();
  const startGuard = useEpochGuard();
  const sessionId = session?.id ?? null;
  const key = session ? loadKeys.sessionChildren(session.id, session.status) : null;
  const load = key ? loads[key] : undefined;
  const shouldFetch = !!key && needsFetch(load);

  useEffect(() => {
    if (!key || !sessionId || !shouldFetch || inFlight.has(key)) return;
    runLoad(dispatch, key, load, startGuard(), async (guarded) => {
      const misconceptions =
        await apiClients.misconception.getMisconceptionsBySessionId(sessionId);
      const activities = await Promise.all(
        misconceptions.map((misconception) =>
          apiClients.activity.getActivitiesByMisconceptionId(misconception.id),
        ),
      );
      guarded({
        type: 'REPLACE_ROWS',
        table: 'misconceptions',
        rows: misconceptions,
        parent: { key: 'sessionId', id: sessionId },
      });
      misconceptions.forEach((misconception, index) =>
        guarded({
          type: 'REPLACE_ROWS',
          table: 'activities',
          rows: activities[index],
          parent: { key: 'misconceptionId', id: misconception.id },
        }),
      );
    });
  }, [apiClients, dispatch, key, sessionId, shouldFetch]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!key) return { status: MicroCoachDataStatus.IDLE, error: null };
  return {
    status: load?.status ?? MicroCoachDataStatus.LOADING,
    error: load?.error ?? null,
  };
}

/**
 * Refreshes every class's rows in the background on arrival (Home, Past
 * Activities), so a session the pipeline finished since shows up. Data not
 * loaded yet is untouched: its first fetch is already on the way.
 */
export function useRefreshClassesOnMount() {
  const dispatch = useMicroCoachDataDispatch();
  useEffect(() => {
    dispatch({ type: 'MARK_LOADS_STALE', prefix: 'class:' });
  }, [dispatch]);
}
