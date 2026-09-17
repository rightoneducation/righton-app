import { IMicroCoachActivity } from "../../../Models/IMicroCoachActivity";

export interface IActivityAPIClient {
  getActivitiesByMisconceptionId(
    misconceptionId: string,
  ): Promise<IMicroCoachActivity[]>;
}
