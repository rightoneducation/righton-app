import { useEffect, useMemo } from 'react';
import { IAPIClients } from '../api';
import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { MicroCoachDataStatus } from '../lib/MicroCoachModels';
import { IPipelineOutput, IReflect, ISession } from '../lib/PipelineModels';
import {
  useMicroCoachDataDispatch,
  useMicroCoachDataState,
} from './context/useMicroCoachDataContext';

const mockMisconceptionsData = mockPipelineOutput as unknown as IPipelineOutput;

export type MisconceptionsStatus = MicroCoachDataStatus;

export interface UseMisconceptionsResult {
  session: ISession;
  misconceptions: IMicroCoachMisconception[];
  reflect: IReflect;
  status: MisconceptionsStatus;
  error: Error | null;
  isReady: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function useMisconceptions(
  apiClients: IAPIClients,
  sessionId: string | null,
): UseMisconceptionsResult {
  const { misconceptions, misconceptionsStatus, misconceptionsError } =
    useMicroCoachDataState();
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

  return useMemo(
    () => ({
      session: mockMisconceptionsData.session,
      misconceptions,
      reflect: mockMisconceptionsData.reflect,
      status: misconceptionsStatus,
      error: misconceptionsError,
      isReady: misconceptionsStatus === 'ready',
    }),
    [misconceptions, misconceptionsError, misconceptionsStatus],
  );
}
