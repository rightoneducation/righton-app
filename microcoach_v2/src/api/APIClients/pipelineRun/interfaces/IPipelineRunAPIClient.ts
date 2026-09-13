import { IPipelineRun, IPipelineRunSummary } from '../../../Models/IPipelineRun';

// TEMPORARY — see MicroCoachPipelineRun in schema.graphql.
export interface IPipelineRunAPIClient {
  listRuns(): Promise<IPipelineRunSummary[]>;
  getRun(id: string): Promise<IPipelineRun | null>;
}
