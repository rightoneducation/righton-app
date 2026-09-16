import {
  CreateMicroCoachSessionMutation,
  CreateMicroCoachSessionMutationVariables,
  DeleteMicroCoachSessionMutation,
  DeleteMicroCoachSessionMutationVariables,
  GetMicroCoachSessionQuery,
  GetMicroCoachSessionQueryVariables,
  MicroCoachSessionsByClassIdQuery,
  MicroCoachSessionsByClassIdQueryVariables,
  UpdateMicroCoachSessionMutation,
  UpdateMicroCoachSessionMutationVariables,
} from "../../../AWSAPI";
import {
  createMicroCoachSession,
  deleteMicroCoachSession,
  updateMicroCoachSession,
} from "../../../graphql/mutations";
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

  async createSession(
    session: IMicroCoachSession,
  ): Promise<IMicroCoachSession | null> {
    const input =
      SessionParser.parseAWSSessionInputfromIMicroCoachSession(session);
    const variables: CreateMicroCoachSessionMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateMicroCoachSessionMutation>(
      createMicroCoachSession,
      variables as unknown as GraphQLOptions,
    );

    const createdSession = res?.data?.createMicroCoachSession;
    return createdSession
      ? SessionParser.parseIMicroCoachSessionfromAWSSession(createdSession)
      : null;
  }

  async updateSession(
    session: IMicroCoachSession,
  ): Promise<IMicroCoachSession | null> {
    const input =
      SessionParser.parseAWSSessionInputfromIMicroCoachSession(session);
    const variables: UpdateMicroCoachSessionMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateMicroCoachSessionMutation>(
      updateMicroCoachSession,
      variables as unknown as GraphQLOptions,
    );

    const updatedSession = res?.data?.updateMicroCoachSession;
    return updatedSession
      ? SessionParser.parseIMicroCoachSessionfromAWSSession(updatedSession)
      : null;
  }

  async deleteSession(id: string): Promise<IMicroCoachSession | null> {
    if (!id) return null;

    const variables: DeleteMicroCoachSessionMutationVariables = {
      input: { id },
    };
    const res = await this.mutateGraphQL<DeleteMicroCoachSessionMutation>(
      deleteMicroCoachSession,
      variables as unknown as GraphQLOptions,
    );

    const session = res?.data?.deleteMicroCoachSession;
    return session
      ? SessionParser.parseIMicroCoachSessionfromAWSSession(session)
      : null;
  }
}
