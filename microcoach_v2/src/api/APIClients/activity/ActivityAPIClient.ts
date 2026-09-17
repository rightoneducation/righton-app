import {
  MicroCoachActivitiesByMisconceptionIdQuery,
  MicroCoachActivitiesByMisconceptionIdQueryVariables,
} from "../../../AWSAPI";
import { microCoachActivitiesByMisconceptionId } from "../../../graphql/queries";
import { IMicroCoachActivity } from "../../Models/IMicroCoachActivity";
import { ActivityParser } from "../../Parsers/ActivityParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IActivityAPIClient } from "./interfaces/IActivityAPIClient";

export class ActivityAPIClient
  extends BaseAPIClient
  implements IActivityAPIClient
{
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
