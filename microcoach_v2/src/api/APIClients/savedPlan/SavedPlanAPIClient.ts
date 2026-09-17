import {
  CreateMicroCoachSavedPlanMutation,
  CreateMicroCoachSavedPlanMutationVariables,
  DeleteMicroCoachSavedPlanMutation,
  DeleteMicroCoachSavedPlanMutationVariables,
  GetMicroCoachSavedPlanQuery,
  GetMicroCoachSavedPlanQueryVariables,
  MicroCoachSavedPlansByClassIdQuery,
  MicroCoachSavedPlansByClassIdQueryVariables,
  MicroCoachSavedPlansBySessionIdQuery,
  MicroCoachSavedPlansBySessionIdQueryVariables,
  UpdateMicroCoachSavedPlanMutation,
  UpdateMicroCoachSavedPlanMutationVariables,
} from "../../../AWSAPI";
import {
  createMicroCoachSavedPlan,
  deleteMicroCoachSavedPlan,
  updateMicroCoachSavedPlan,
} from "../../../graphql/mutations";
import {
  getMicroCoachSavedPlan,
  microCoachSavedPlansByClassId,
  microCoachSavedPlansBySessionId,
} from "../../../graphql/queries";
import { IMicroCoachSavedPlan } from "../../Models/IMicroCoachSavedPlan";
import { SavedPlanParser } from "../../Parsers/SavedPlanParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { ISavedPlanAPIClient } from "./interfaces/ISavedPlanAPIClient";

export class SavedPlanAPIClient
  extends BaseAPIClient
  implements ISavedPlanAPIClient
{
  async getSavedPlan(id: string): Promise<IMicroCoachSavedPlan | null> {
    if (!id) return null;

    const variables: GetMicroCoachSavedPlanQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachSavedPlanQuery>(
      getMicroCoachSavedPlan,
      variables as unknown as GraphQLOptions,
    );

    const savedPlan = res?.data?.getMicroCoachSavedPlan;
    return savedPlan
      ? SavedPlanParser.parseIMicroCoachSavedPlanfromAWSSavedPlan(savedPlan)
      : null;
  }

  async getSavedPlansByClassId(classId: string): Promise<IMicroCoachSavedPlan[]> {
    if (!classId) return [];

    const variables: MicroCoachSavedPlansByClassIdQueryVariables = { classId };
    const res = await this.callGraphQL<MicroCoachSavedPlansByClassIdQuery>(
      microCoachSavedPlansByClassId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachSavedPlansByClassId?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        SavedPlanParser.parseIMicroCoachSavedPlanfromAWSSavedPlan(item),
      );
  }

  async getSavedPlansBySessionId(
    sessionId: string,
  ): Promise<IMicroCoachSavedPlan[]> {
    if (!sessionId) return [];

    const variables: MicroCoachSavedPlansBySessionIdQueryVariables = {
      sessionId,
    };
    const res = await this.callGraphQL<MicroCoachSavedPlansBySessionIdQuery>(
      microCoachSavedPlansBySessionId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachSavedPlansBySessionId?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        SavedPlanParser.parseIMicroCoachSavedPlanfromAWSSavedPlan(item),
      );
  }

  async createSavedPlan(
    savedPlan: IMicroCoachSavedPlan,
  ): Promise<IMicroCoachSavedPlan | null> {
    const input =
      SavedPlanParser.parseAWSSavedPlanInputfromIMicroCoachSavedPlan(savedPlan);
    const variables: CreateMicroCoachSavedPlanMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateMicroCoachSavedPlanMutation>(
      createMicroCoachSavedPlan,
      variables as unknown as GraphQLOptions,
    );

    const createdSavedPlan = res?.data?.createMicroCoachSavedPlan;
    return createdSavedPlan
      ? SavedPlanParser.parseIMicroCoachSavedPlanfromAWSSavedPlan(
          createdSavedPlan,
        )
      : null;
  }

  async updateSavedPlan(
    savedPlan: IMicroCoachSavedPlan,
  ): Promise<IMicroCoachSavedPlan | null> {
    const input =
      SavedPlanParser.parseAWSSavedPlanInputfromIMicroCoachSavedPlan(savedPlan);
    const variables: UpdateMicroCoachSavedPlanMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateMicroCoachSavedPlanMutation>(
      updateMicroCoachSavedPlan,
      variables as unknown as GraphQLOptions,
    );

    const updatedSavedPlan = res?.data?.updateMicroCoachSavedPlan;
    return updatedSavedPlan
      ? SavedPlanParser.parseIMicroCoachSavedPlanfromAWSSavedPlan(
          updatedSavedPlan,
        )
      : null;
  }

  async deleteSavedPlan(id: string): Promise<IMicroCoachSavedPlan | null> {
    if (!id) return null;

    const variables: DeleteMicroCoachSavedPlanMutationVariables = {
      input: { id },
    };
    const res = await this.mutateGraphQL<DeleteMicroCoachSavedPlanMutation>(
      deleteMicroCoachSavedPlan,
      variables as unknown as GraphQLOptions,
    );

    const savedPlan = res?.data?.deleteMicroCoachSavedPlan;
    return savedPlan
      ? SavedPlanParser.parseIMicroCoachSavedPlanfromAWSSavedPlan(savedPlan)
      : null;
  }
}
