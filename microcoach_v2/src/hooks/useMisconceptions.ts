import { useEffect, useMemo, useState } from 'react';
import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IPipelineOutput, IReflect, ISession } from '../lib/PipelineModels';
import { IAPIClients } from '../api';

const mockMisconceptionsData = mockPipelineOutput as unknown as IPipelineOutput;

export type MisconceptionsStatus = 'idle' | 'loading' | 'ready' | 'error';

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
  const [misconceptions, setMisconceptions] = useState<
    IMicroCoachMisconception[]
  >([]);
  const [misconceptionsStatus, setMisconceptionsStatus] =
    useState<MisconceptionsStatus>('idle');
  const [misconceptionsError, setMisconceptionsError] =
    useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!sessionId) {
      setMisconceptions([]);
      setMisconceptionsStatus('idle');
      setMisconceptionsError(null);
      return undefined;
    }

    const activeSessionId = sessionId;
    setMisconceptions([]);
    setMisconceptionsStatus('loading');
    setMisconceptionsError(null);

    async function loadMisconceptions() {
      try {
        const fetchedMisconceptions =
          await apiClients.misconception.getMisconceptionsBySessionId(
            activeSessionId,
          );
        if (cancelled) return;

        setMisconceptions(fetchedMisconceptions);
        setMisconceptionsStatus('ready');
      } catch (error) {
        if (cancelled) return;

        setMisconceptionsError(
          error instanceof Error
            ? error
            : new Error('Failed to load misconceptions'),
        );
        setMisconceptionsStatus('error');
      }
    }

    loadMisconceptions();

    return () => {
      cancelled = true;
    };
  }, [apiClients, sessionId]);

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
