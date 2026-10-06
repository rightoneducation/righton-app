import { remove, uploadData } from "aws-amplify/storage";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import { ITeacherUploadInput, IUploadAPIClient } from "./interfaces/IUploadAPIClient";

/*
 * Not in the generated graphql/ files: the v2 schema has no teacherUpload
 * mutation yet. v1 defined it as
 *   teacherUpload(input: TeacherUploadInput!): String
 *     @function(name: "microcoachTeacherUpload-${env}")
 *   input TeacherUploadInput { classroomId: ID!  docxKey: String!  xlsxKey: String! }
 * and microcoachv2TeacherUpload reads exactly that input. Until the schema
 * carries it, AppSync rejects this call and startAnalysis throws.
 */
const teacherUploadMutation = /* GraphQL */ `
  mutation TeacherUpload($input: TeacherUploadInput!) {
    teacherUpload(input: $input)
  }
`;

// Spaces and symbols in a teacher's file name would otherwise end up in the key.
const safeName = (name: string) => name.replace(/[^A-Za-z0-9._-]+/g, "_");

export class UploadAPIClient extends BaseAPIClient implements IUploadAPIClient {
  /*
   * The private prefix, not public/: the bucket grants guests read on public/,
   * and the responses sheet holds student work. The Lambda reads with its own
   * role, so any key the teacher can write, it can read.
   */
  async uploadFile(classroomId: string, file: File): Promise<string> {
    const result = await uploadData({
      path: ({ identityId }) =>
        `private/${identityId}/miu-uploads/${classroomId}/${Date.now()}-${safeName(file.name)}`,
      data: file,
      options: { contentType: file.type || undefined },
    }).result;
    return result.path;
  }

  async removeFile(key: string): Promise<void> {
    await remove({ path: key });
  }

  async startAnalysis(input: ITeacherUploadInput): Promise<string> {
    const res = await this.callGraphQL<{ teacherUpload?: string | null }>(
      teacherUploadMutation,
      { input } as unknown as GraphQLOptions,
    );
    const message = res?.data?.teacherUpload;
    if (!message) throw new Error("teacherUpload returned no response");
    // The Lambda reports bad input in its string result rather than throwing.
    if (message.includes('"error"')) throw new Error(message);
    return message;
  }
}
