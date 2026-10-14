import { AssessmentType } from "../../../../AWSAPI";

export interface ITeacherUploadInput {
  classroomId: string;
  docxKey: string;
  xlsxKey: string;
  /** PPQ for the first upload, POST_PPQ for the one after the activity. */
  assessmentType: AssessmentType;
}

export interface IUploadAPIClient {
  /** Uploads one MIU file to the docs bucket; resolves to its S3 key. */
  uploadFile(classroomId: string, file: File): Promise<string>;
  removeFile(key: string): Promise<void>;
  /** Uploads a profile picture to the teacher's private prefix; resolves to its S3 path. */
  uploadProfilePicture(file: File): Promise<string>;
  /** A short-lived URL to show a private file (the owner's own). */
  getFileUrl(path: string): Promise<string>;
  /** Starts the MicroCoach analysis of an uploaded exemplar + responses pair. */
  startAnalysis(input: ITeacherUploadInput): Promise<string>;
}
