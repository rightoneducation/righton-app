import {
  CreateMicroCoachStudentMutation,
  CreateMicroCoachStudentMutationVariables,
  DeleteMicroCoachStudentMutation,
  DeleteMicroCoachStudentMutationVariables,
  GetMicroCoachStudentQuery,
  GetMicroCoachStudentQueryVariables,
  MicroCoachStudentsByClassIdQuery,
  MicroCoachStudentsByClassIdQueryVariables,
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
    student: IMicroCoachStudent,
  ): Promise<IMicroCoachStudent | null> {
    const input =
      StudentParser.parseAWSStudentInputfromIMicroCoachStudent(student);
    const variables: CreateMicroCoachStudentMutationVariables = { input };
    const res = await this.mutateGraphQL<CreateMicroCoachStudentMutation>(
      createMicroCoachStudent,
      variables as unknown as GraphQLOptions,
    );

    const createdStudent = res?.data?.createMicroCoachStudent;
    return createdStudent
      ? StudentParser.parseIMicroCoachStudentfromAWSStudent(createdStudent)
      : null;
  }

  async updateStudent(
    student: IMicroCoachStudent,
  ): Promise<IMicroCoachStudent | null> {
    const input =
      StudentParser.parseAWSStudentInputfromIMicroCoachStudent(student);
    const variables: UpdateMicroCoachStudentMutationVariables = { input };
    const res = await this.mutateGraphQL<UpdateMicroCoachStudentMutation>(
      updateMicroCoachStudent,
      variables as unknown as GraphQLOptions,
    );

    const updatedStudent = res?.data?.updateMicroCoachStudent;
    return updatedStudent
      ? StudentParser.parseIMicroCoachStudentfromAWSStudent(updatedStudent)
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
