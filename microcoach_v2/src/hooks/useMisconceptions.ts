import { useEffect } from 'react';
import { IAPIClients } from '../api';
import { useMicroCoachDataDispatch } from './context/useMicroCoachDataContext';

// eslint-disable-next-line import/prefer-default-export
export function useMisconceptions(
  apiClients: IAPIClients,
  sessionId: string | null,
): void {
  const dispatch = useMicroCoachDataDispatch();

  useEffect(() => {
    let cancelled = false;

    if (!sessionId) {
      dispatch({ type: 'SET_MISCONCEPTIONS', payload: [] });
      dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'idle' });
      dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });
      return undefined;
    }

    const activeSessionId = sessionId;
    dispatch({ type: 'SET_MISCONCEPTIONS', payload: [] });
    dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'loading' });
    dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });

    async function loadMisconceptions() {
      try {
        // eslint-disable-next-line no-console
        console.log('[useMisconceptions] Fetching misconceptions', {
          sessionId: activeSessionId,
        });
        const fetchedMisconceptions =
          await apiClients.misconception.getMisconceptionsBySessionId(
            activeSessionId,
          );
        // eslint-disable-next-line no-console
        console.log(
          '[useMisconceptions] Fetched misconceptions',
          fetchedMisconceptions,
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
        // eslint-disable-next-line no-console
        console.log(
          '[useMisconceptions] Fetched misconceptions with activities',
          misconceptionsWithActivities,
        );
        if (cancelled) return;

        dispatch({
          type: 'SET_MISCONCEPTIONS',
          payload: misconceptionsWithActivities,
        });
        dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'ready' });
      } catch (error) {
        if (cancelled) return;

        // eslint-disable-next-line no-console
        console.error('[useMisconceptions] Fetch failed', error);
        dispatch({
          type: 'SET_MISCONCEPTIONS_ERROR',
          payload:
            error instanceof Error
              ? error
              : new Error('Failed to load misconceptions'),
        });
        dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'error' });
      }
    }

    loadMisconceptions();

    return () => {
      cancelled = true;
    };
  }, [apiClients, dispatch, sessionId]);
}
