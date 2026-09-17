import {
  CreateMicroCoachClassroomMutation,
  CreateMicroCoachClassroomMutationVariables,
  DeleteMicroCoachClassroomMutation,
  DeleteMicroCoachClassroomMutationVariables,
  GetMicroCoachClassroomQuery,
  GetMicroCoachClassroomQueryVariables,
  MicroCoachClassroomsByUserIdQuery,
  MicroCoachClassroomsByUserIdQueryVariables,
  UpdateMicroCoachClassroomMutation,
  UpdateMicroCoachClassroomMutationVariables,
} from "../../../AWSAPI";
import {
  createMicroCoachClassroom,
  deleteMicroCoachClassroom,
  updateMicroCoachClassroom,
} from "../../../graphql/mutations";
import {
  getMicroCoachClassroom,
  microCoachClassroomsByUserId,
} from "../../../graphql/queries";
import { IMicroCoachClassroom } from "../../Models/IMicroCoachClassroom";
import { ClassroomParser } from "../../Parsers/ClassroomParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IClassroomAPIClient } from "./interfaces/IClassroomAPIClient";

export class ClassroomAPIClient
  extends BaseAPIClient
  implements IClassroomAPIClient
{
  async getClassroom(id: string): Promise<IMicroCoachClassroom | null> {
    if (!id) return null;

    const variables: GetMicroCoachClassroomQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachClassroomQuery>(
      getMicroCoachClassroom,
      variables as unknown as GraphQLOptions,
    );

    const classroom = res?.data?.getMicroCoachClassroom;
    return classroom
      ? ClassroomParser.parseIMicroCoachClassroomfromAWSClassroom(classroom)
      : null;
  }

  async getClassroomsByUserId(userId: string): Promise<IMicroCoachClassroom[]> {
    if (!userId) return [];

    const variables: MicroCoachClassroomsByUserIdQueryVariables = { userId };
    const res = await this.callGraphQL<MicroCoachClassroomsByUserIdQuery>(
      microCoachClassroomsByUserId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachClassroomsByUserId?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) =>
        ClassroomParser.parseIMicroCoachClassroomfromAWSClassroom(item),
      );
  }

  async createClassroom(
    classroom: IMicroCoachClassroom,
  ): Promise<IMicroCoachClassroom | null> {
    const input =
      ClassroomParser.parseAWSClassroomInputfromIMicroCoachClassroom(classroom);
    const variables: CreateMicroCoachClassroomMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateMicroCoachClassroomMutation>(
      createMicroCoachClassroom,
      variables as unknown as GraphQLOptions,
    );

    const createdClassroom = res?.data?.createMicroCoachClassroom;
    return createdClassroom
      ? ClassroomParser.parseIMicroCoachClassroomfromAWSClassroom(
          createdClassroom,
        )
      : null;
  }

  async updateClassroom(
    classroom: IMicroCoachClassroom,
  ): Promise<IMicroCoachClassroom | null> {
    const input =
      ClassroomParser.parseAWSClassroomInputfromIMicroCoachClassroom(classroom);
    const variables: UpdateMicroCoachClassroomMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateMicroCoachClassroomMutation>(
      updateMicroCoachClassroom,
      variables as unknown as GraphQLOptions,
    );

    const updatedClassroom = res?.data?.updateMicroCoachClassroom;
    return updatedClassroom
      ? ClassroomParser.parseIMicroCoachClassroomfromAWSClassroom(
          updatedClassroom,
        )
      : null;
  }

  async deleteClassroom(id: string): Promise<IMicroCoachClassroom | null> {
    if (!id) return null;

    const variables: DeleteMicroCoachClassroomMutationVariables = {
      input: { id },
    };
    const res = await this.mutateGraphQL<DeleteMicroCoachClassroomMutation>(
      deleteMicroCoachClassroom,
      variables as unknown as GraphQLOptions,
    );

    const classroom = res?.data?.deleteMicroCoachClassroom;
    return classroom
      ? ClassroomParser.parseIMicroCoachClassroomfromAWSClassroom(classroom)
      : null;
  }
}
