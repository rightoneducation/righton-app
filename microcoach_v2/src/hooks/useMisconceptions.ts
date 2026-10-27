import { useEffect, useRef } from 'react';
import { IAPIClients } from '../api';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { SessionStatus } from '../AWSAPI';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { useMicroCoachDataDispatch } from './context/useMicroCoachDataContext';

/**
 * The selected session's misconceptions, with their activities. A session's
 * misconceptions never change once generated, so each answer is kept for the
 * rest of the visit and revisiting a session (switching back to a class or
 * week) shows it at once. An empty answer is not kept: the pipeline may not
 * have reported yet. `sessionStatus` refetches when the pipeline moves the
 * session on (DATA_INGESTED → GENERATED).
 */
// eslint-disable-next-line import/prefer-default-export
export function useMisconceptions(
  apiClients: IAPIClients,
  sessionId: string | null,
  sessionStatus: SessionStatus | null,
): void {
  const dispatch = useMicroCoachDataDispatch();
  const cacheRef = useRef(new Map<string, IMicroCoachMisconception[]>());

  useEffect(() => {
    let cancelled = false;

    if (!sessionId) {
      dispatch({ type: 'SET_MISCONCEPTIONS', payload: [] });
      dispatch({
        type: 'SET_MISCONCEPTIONS_STATUS',
        payload: MicroCoachDataStatus.IDLE,
      });
      dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });
      return undefined;
    }

    const cached = cacheRef.current.get(sessionId);
    if (cached) {
      dispatch({ type: 'SET_MISCONCEPTIONS', payload: cached });
      dispatch({
        type: 'SET_MISCONCEPTIONS_STATUS',
        payload: MicroCoachDataStatus.READY,
      });
      dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });
      return undefined;
    }

    const activeSessionId = sessionId;
    dispatch({ type: 'SET_MISCONCEPTIONS', payload: [] });
    dispatch({
      type: 'SET_MISCONCEPTIONS_STATUS',
      payload: MicroCoachDataStatus.LOADING,
    });
    dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });

    async function loadMisconceptions() {
      try {
        const fetchedMisconceptions =
          await apiClients.misconception.getMisconceptionsBySessionId(
            activeSessionId,
          );

        const misconceptionsWithActivities = await Promise.all(
          fetchedMisconceptions.map(async (misconception) => ({
            ...misconception,
            nextStepActivities:
              await apiClients.activity.getActivitiesByMisconceptionId(
                misconception.id,
              ),
          })),
        );
        if (cancelled) return;

        // The query returns rows in storage order; screens list them by the
        // pipeline's rank, so the recommended focus (rank 1) comes first.
        const ranked = [...misconceptionsWithActivities].sort(
          (a, b) => a.rank - b.rank,
        );
        if (ranked.length > 0) cacheRef.current.set(activeSessionId, ranked);
        dispatch({ type: 'SET_MISCONCEPTIONS', payload: ranked });
        dispatch({
          type: 'SET_MISCONCEPTIONS_STATUS',
          payload: MicroCoachDataStatus.READY,
        });
      } catch (error) {
        if (cancelled) return;

        dispatch({
          type: 'SET_MISCONCEPTIONS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load misconceptions'),
        });
        dispatch({
          type: 'SET_MISCONCEPTIONS_STATUS',
          payload: MicroCoachDataStatus.ERROR,
        });
      }
    }

    loadMisconceptions();

    return () => {
      cancelled = true;
    };
  }, [apiClients, dispatch, sessionId, sessionStatus]);
}
