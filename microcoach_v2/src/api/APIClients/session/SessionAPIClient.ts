import {
  GetMicroCoachSessionQuery,
  GetMicroCoachSessionQueryVariables,
  MicroCoachSessionsByClassIdQuery,
  MicroCoachSessionsByClassIdQueryVariables,
} from "../../../AWSAPI";
import {
  getMicroCoachSession,
  microCoachSessionsByClassId,
} from "../../../graphql/queries";
import { IMicroCoachSession } from "../../Models/IMicroCoachSession";
import { SessionParser } from "../../Parsers/SessionParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { ISessionAPIClient } from "./interfaces/ISessionAPIClient";

export class SessionAPIClient
  extends BaseAPIClient
  implements ISessionAPIClient
{
  async getSession(id: string): Promise<IMicroCoachSession | null> {
    if (!id) return null;

    const variables: GetMicroCoachSessionQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachSessionQuery>(
      getMicroCoachSession,
      variables as unknown as GraphQLOptions,
    );

    const session = res?.data?.getMicroCoachSession;
    return session
      ? SessionParser.parseIMicroCoachSessionfromAWSSession(session)
      : null;
  }

  async getSessionsByClassId(classId: string): Promise<IMicroCoachSession[]> {
    if (!classId) return [];

    const variables: MicroCoachSessionsByClassIdQueryVariables = { classId };
    const res = await this.callGraphQL<MicroCoachSessionsByClassIdQuery>(
      microCoachSessionsByClassId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachSessionsByClassId?.items ?? [];

    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) => SessionParser.parseIMicroCoachSessionfromAWSSession(item));
  }
}
