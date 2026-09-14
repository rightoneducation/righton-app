import { IActivity } from "../../../../lib/PipelineModels";

export interface IActivityAPIClient {
  getActivitiesByMisconceptionId(misconceptionId: string): Promise<IActivity[]>;
}
