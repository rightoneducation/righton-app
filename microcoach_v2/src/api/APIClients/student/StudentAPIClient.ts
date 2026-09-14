import {
  CreateMicroCoachStudentInput,
  CreateMicroCoachStudentMutation,
  CreateMicroCoachStudentMutationVariables,
  DeleteMicroCoachStudentMutation,
  DeleteMicroCoachStudentMutationVariables,
  GetMicroCoachStudentQuery,
  GetMicroCoachStudentQueryVariables,
  MicroCoachStudentsByClassIdQuery,
  MicroCoachStudentsByClassIdQueryVariables,
  UpdateMicroCoachStudentInput,
  UpdateMicroCoachStudentMutation,
  UpdateMicroCoachStudentMutationVariables,
} from "../../../AWSAPI";
import {
  createMicroCoachStudent,
  deleteMicroCoachStudent,
  updateMicroCoachStudent,
} from "../../../graphql/mutations";
import {
  getMicroCoachStudent,
  microCoachStudentsByClassId,
} from "../../../graphql/queries";
import { IMicroCoachStudent } from "../../Models/IMicroCoachStudent";
import { StudentParser } from "../../Parsers/StudentParser";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { IStudentAPIClient } from "./interfaces/IStudentAPIClient";

export class StudentAPIClient
  extends BaseAPIClient
  implements IStudentAPIClient
{
  async getStudent(id: string): Promise<IMicroCoachStudent | null> {
    if (!id) return null;

    const variables: GetMicroCoachStudentQueryVariables = { id };
    const res = await this.callGraphQL<GetMicroCoachStudentQuery>(
      getMicroCoachStudent,
      variables as unknown as GraphQLOptions,
    );

    const student = res?.data?.getMicroCoachStudent;
    return student
      ? StudentParser.parseIMicroCoachStudentfromAWSStudent(student)
      : null;
  }

  async getStudentsByClassId(classId: string): Promise<IMicroCoachStudent[]> {
    if (!classId) return [];

    const variables: MicroCoachStudentsByClassIdQueryVariables = { classId };
    const res = await this.callGraphQL<MicroCoachStudentsByClassIdQuery>(
      microCoachStudentsByClassId,
      variables as unknown as GraphQLOptions,
    );

    const items = res?.data?.microCoachStudentsByClassId?.items ?? [];
    return items
      .filter((item): item is NonNullable<typeof item> => item != null)
      .map((item) => StudentParser.parseIMicroCoachStudentfromAWSStudent(item));
  }

  async createStudent(
    input: CreateMicroCoachStudentInput,
  ): Promise<IMicroCoachStudent | null> {
    const variables: CreateMicroCoachStudentMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateMicroCoachStudentMutation>(
      createMicroCoachStudent,
      variables as unknown as GraphQLOptions,
    );

    const student = res?.data?.createMicroCoachStudent;
    return student
      ? StudentParser.parseIMicroCoachStudentfromAWSStudent(student)
      : null;
  }

  async updateStudent(
    input: UpdateMicroCoachStudentInput,
  ): Promise<IMicroCoachStudent | null> {
    const variables: UpdateMicroCoachStudentMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateMicroCoachStudentMutation>(
      updateMicroCoachStudent,
      variables as unknown as GraphQLOptions,
    );

    const student = res?.data?.updateMicroCoachStudent;
    return student
      ? StudentParser.parseIMicroCoachStudentfromAWSStudent(student)
      : null;
  }

  async deleteStudent(id: string): Promise<IMicroCoachStudent | null> {
    if (!id) return null;

    const variables: DeleteMicroCoachStudentMutationVariables = {
      input: { id },
    };
    const res = await this.mutateGraphQL<DeleteMicroCoachStudentMutation>(
      deleteMicroCoachStudent,
      variables as unknown as GraphQLOptions,
    );

    const student = res?.data?.deleteMicroCoachStudent;
    return student
      ? StudentParser.parseIMicroCoachStudentfromAWSStudent(student)
      : null;
  }
}
