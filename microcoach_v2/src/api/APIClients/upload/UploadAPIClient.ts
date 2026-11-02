import { getUrl, uploadData } from "aws-amplify/storage";
import { BaseAPIClient, GraphQLOptions } from "../base/BaseAPIClient";
import {
  CreateMicroCoachUploadMutation,
  CreateMicroCoachUploadMutationVariables,
  UploadStatus,
} from "../../../AWSAPI";
import { createMicroCoachUpload } from "../../../graphql/mutations";
import { IRecordUploadInput, IUploadAPIClient } from "./interfaces/IUploadAPIClient";

// Spaces and symbols in a teacher's file name would otherwise end up in the key.
const safeName = (name: string) => name.replace(/[^A-Za-z0-9._-]+/g, "_");

export class UploadAPIClient extends BaseAPIClient implements IUploadAPIClient {
  /*
   * The private prefix, not public/: the bucket grants guests read on public/,
   * and the responses sheet holds student work. The Lambda reads with its own
   * role, so any key the teacher can write, it can read.
   *
   * Uploads are never deleted: they are the backup if the pipeline fails, and
   * the MicroCoachUpload row records where each pair is.
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

  /*
   * central_v2's pattern (awsUploadImagePrivate + profilePicPath): the picture
   * goes under the teacher's private prefix and the User row keeps its path.
   * Timestamped so a new picture never collides with a cached old one.
   */
  async uploadProfilePicture(file: File): Promise<string> {
    const result = await uploadData({
      path: ({ identityId }) =>
        `private/${identityId}/profile/${Date.now()}-${safeName(file.name)}`,
      data: file,
      options: { contentType: file.type || undefined },
    }).result;
    return result.path;
  }

  // central_v2 serves pictures through CloudFront; this app has no
  // distribution, so it signs a URL for the owner instead.
  async getFileUrl(path: string): Promise<string> {
    const { url } = await getUrl({ path, options: { expiresIn: 3600 } });
    return url.toString();
  }

  // cognitoId is left out: the owner rule fills it in from the signed-in user.
  async recordUpload(input: IRecordUploadInput): Promise<string> {
    const variables: CreateMicroCoachUploadMutationVariables = {
      input: { ...input, status: UploadStatus.RECEIVED },
    };
    const res = await this.mutateGraphQL<CreateMicroCoachUploadMutation>(
      createMicroCoachUpload,
      variables as unknown as GraphQLOptions,
    );
    const id = res?.data?.createMicroCoachUpload?.id;
    if (!id) throw new Error("createMicroCoachUpload returned no row");
    return id;
  }
}
