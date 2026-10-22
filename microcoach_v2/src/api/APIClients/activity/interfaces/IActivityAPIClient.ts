import { IMicroCoachActivity } from "../../../Models/IMicroCoachActivity";

export interface IActivityAPIClient {
  getActivity(id: string): Promise<IMicroCoachActivity | null>;
  getActivitiesByMisconceptionId(
    misconceptionId: string,
  ): Promise<IMicroCoachActivity[]>;
}
