import { useEffect } from 'react';
import { IAPIClients } from '../api';
import { IPipelineOutput } from '../lib/PipelineModels';
import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import { useMicroCoachDataDispatch } from './context/useMicroCoachDataContext';

const mockMisconceptionsData = mockPipelineOutput as unknown as IPipelineOutput;

// eslint-disable-next-line import/prefer-default-export
export function useMisconceptions(
  apiClients: IAPIClients,
  sessionId: string | null,
): void {
  const dispatch = useMicroCoachDataDispatch();

  useEffect(() => {
    let cancelled = false;

    if (!sessionId) {
      dispatch({
        type: 'SET_MISCONCEPTIONS',
        payload: mockMisconceptionsData.misconceptions,
      });
      dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'ready' });
      dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });
      return undefined;
    }

    const activeSessionId = sessionId;
    dispatch({ type: 'SET_MISCONCEPTIONS', payload: [] });
    dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'loading' });
    dispatch({ type: 'SET_MISCONCEPTIONS_ERROR', payload: null });

    async function loadMisconceptions() {
      try {
        const fetchedMisconceptions =
          await apiClients.misconception.getMisconceptionsBySessionId(
            activeSessionId,
          );
        if (cancelled) return;

        dispatch({
          type: 'SET_MISCONCEPTIONS',
          payload: fetchedMisconceptions,
        });
        dispatch({ type: 'SET_MISCONCEPTIONS_STATUS', payload: 'ready' });
      } catch (error) {
        if (cancelled) return;

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
