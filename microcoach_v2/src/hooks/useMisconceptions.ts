import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import {
  IMisconception,
  IPipelineOutput,
  ISession,
} from '../lib/PipelineModels';

const data = mockPipelineOutput as unknown as IPipelineOutput;

interface UseMisconceptionsResult {
  session: ISession;
  misconceptions: IMisconception[];
  isReady: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function useMisconceptions(): UseMisconceptionsResult {
  return {
    session: data.session,
    misconceptions: data.misconceptions,
    isReady: true,
  };
}
