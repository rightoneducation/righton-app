import mockPipelineOutput from '../lib/mocks/mockPipelineOutput.json';
import { IMicroCoachMisconception } from '../api/Models/IMicroCoachMisconception';
import { IPipelineOutput, IReflect, ISession } from '../lib/PipelineModels';

const data = mockPipelineOutput as unknown as IPipelineOutput;

interface UseMisconceptionsResult {
  session: ISession;
  misconceptions: IMicroCoachMisconception[];
  reflect: IReflect;
  isReady: boolean;
}

// eslint-disable-next-line import/prefer-default-export
export function useMisconceptions(): UseMisconceptionsResult {
  return {
    session: data.session,
    misconceptions: data.misconceptions,
    reflect: data.reflect,
    isReady: true,
  };
}
