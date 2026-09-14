import {
  CreateMicroCoachAssessmentInput,
  CreateMicroCoachAssessmentMutation,
  CreateMicroCoachAssessmentMutationVariables,
  DeleteMicroCoachAssessmentMutation,
  DeleteMicroCoachAssessmentMutationVariables,
  GetMicroCoachAssessmentQuery,
  GetMicroCoachAssessmentQueryVariables,
  MicroCoachAssessmentsByClassIdQuery,
  MicroCoachAssessmentsByClassIdQueryVariables,
  MicroCoachAssessmentsBySessionIdQuery,
  MicroCoachAssessmentsBySessionIdQueryVariables,
  UpdateMicroCoachAssessmentInput,
  UpdateMicroCoachAssessmentMutation,
  UpdateMicroCoachAssessmentMutationVariables,
} from "../../../AWSAPI";
import {
  createMicroCoachAssessment,
  deleteMicroCoachAssessment,
  updateMicroCoachAssessment,
} from "../../../graphql/mutations";
import {
  getMicroCoachAssessment,
  microCoachAssessmentsByClassId,
  microCoachAssessmentsBySessionId,
} from "../../../graphql/queries";
import { IMicroCoachAssessment } from "../../Models/IMicroCoachAssessment";
import { AssessmentParser } from "../../Parsers/AssessmentParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IAssessmentAPIClient } from "./interfaces/IAssessmentAPIClient";

export class AssessmentAPIClient
  extends BaseAPIClient
  implements IAssessmentAPIClient
{
  async getAssessment(id: string): Promise<IMicroCoachAssessment | null> {
    if (!id) return null;

    const variables: GetMicroCoachAssessmentQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachAssessmentQuery>(
      getMicroCoachAssessment,
      variables as unknown as GraphQLOptions,
    );

    const assessment = res?.data?.getMicroCoachAssessment;
    return assessment
      ? AssessmentParser.parseIMicroCoachAssessmentfromAWSAssessment(assessment)
      : null;
  }

  async getAssessmentsByClassId(
    classId: string,
  ): Promise<IMicroCoachAssessment[]> {
    if (!classId) return [];

    const variables: MicroCoachAssessmentsByClassIdQueryVariables = { classId };
    const res = await this.callGraphQL<MicroCoachAssessmentsByClassIdQuery>(
      microCoachAssessmentsByClassId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachAssessmentsByClassId?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        AssessmentParser.parseIMicroCoachAssessmentfromAWSAssessment(item),
      );
  }

  async getAssessmentsBySessionId(
    sessionId: string,
  ): Promise<IMicroCoachAssessment[]> {
    if (!sessionId) return [];

    const variables: MicroCoachAssessmentsBySessionIdQueryVariables = {
      sessionId,
    };
    const res = await this.callGraphQL<MicroCoachAssessmentsBySessionIdQuery>(
      microCoachAssessmentsBySessionId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachAssessmentsBySessionId?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        AssessmentParser.parseIMicroCoachAssessmentfromAWSAssessment(item),
      );
  }

  async createAssessment(
    input: CreateMicroCoachAssessmentInput,
  ): Promise<IMicroCoachAssessment | null> {
    const variables: CreateMicroCoachAssessmentMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateMicroCoachAssessmentMutation>(
      createMicroCoachAssessment,
      variables as unknown as GraphQLOptions,
    );

    const assessment = res?.data?.createMicroCoachAssessment;
    return assessment
      ? AssessmentParser.parseIMicroCoachAssessmentfromAWSAssessment(assessment)
      : null;
  }

  async updateAssessment(
    input: UpdateMicroCoachAssessmentInput,
  ): Promise<IMicroCoachAssessment | null> {
    const variables: UpdateMicroCoachAssessmentMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateMicroCoachAssessmentMutation>(
      updateMicroCoachAssessment,
      variables as unknown as GraphQLOptions,
    );

    const assessment = res?.data?.updateMicroCoachAssessment;
    return assessment
      ? AssessmentParser.parseIMicroCoachAssessmentfromAWSAssessment(assessment)
      : null;
  }

  async deleteAssessment(id: string): Promise<IMicroCoachAssessment | null> {
    if (!id) return null;

    const variables: DeleteMicroCoachAssessmentMutationVariables = {
      input: { id },
    };
    const res = await this.mutateGraphQL<DeleteMicroCoachAssessmentMutation>(
      deleteMicroCoachAssessment,
      variables as unknown as GraphQLOptions,
    );

    const assessment = res?.data?.deleteMicroCoachAssessment;
    return assessment
      ? AssessmentParser.parseIMicroCoachAssessmentfromAWSAssessment(assessment)
      : null;
  }
}
