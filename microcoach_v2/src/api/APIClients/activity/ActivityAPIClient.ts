import {
  GetMicroCoachActivityQuery,
  GetMicroCoachActivityQueryVariables,
  MicroCoachActivitiesByMisconceptionIdQuery,
  MicroCoachActivitiesByMisconceptionIdQueryVariables,
} from "../../../AWSAPI";
import {
  getMicroCoachActivity,
  microCoachActivitiesByMisconceptionId,
} from "../../../graphql/queries";
import { IMicroCoachActivity } from "../../Models/IMicroCoachActivity";
import { ActivityParser } from "../../Parsers/ActivityParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IActivityAPIClient } from "./interfaces/IActivityAPIClient";

export class ActivityAPIClient
  extends BaseAPIClient
  implements IActivityAPIClient
{
  async getActivity(id: string): Promise<IMicroCoachActivity | null> {
    if (!id) return null;

    const variables: GetMicroCoachActivityQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachActivityQuery>(
      getMicroCoachActivity,
      variables as unknown as GraphQLOptions,
    );

    const activity = res?.data?.getMicroCoachActivity;
    return activity
      ? ActivityParser.parseIMicroCoachActivityfromAWSActivity(activity)
      : null;
  }

  async getActivitiesByMisconceptionId(
    misconceptionId: string,
  ): Promise<IMicroCoachActivity[]> {
    if (!misconceptionId) return [];

    const variables: MicroCoachActivitiesByMisconceptionIdQueryVariables = {
      misconceptionId,
    };

    const res = await this.callGraphQL<MicroCoachActivitiesByMisconceptionIdQuery>(
      microCoachActivitiesByMisconceptionId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachActivitiesByMisconceptionId?.items ?? [];

    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        ActivityParser.parseIMicroCoachActivityfromAWSActivity(item),
      );
  }
}
