import { AssessmentType } from "../../../../AWSAPI";

/** One submitted MIU file pair, as recorded in MicroCoachUpload. */
export interface IRecordUploadInput {
  userId: string;
  classId: string;
  sessionId: string;
  /** PPQ for the first upload, POST_PPQ for the one after the activity. */
  assessmentType: AssessmentType;
  docxKey: string;
  xlsxKey: string;
  /** Monday of the school week the teacher picked, `YYYY-MM-DD`. */
  weekStart: string | null;
}

export interface IUploadAPIClient {
  /** Uploads one MIU file to the docs bucket; resolves to its S3 key. */
  uploadFile(classroomId: string, file: File): Promise<string>;
  /** Uploads a profile picture to the teacher's private prefix; resolves to its S3 path. */
  uploadProfilePicture(file: File): Promise<string>;
  /** A short-lived URL to show a private file (the owner's own). */
  getFileUrl(path: string): Promise<string>;
  /**
   * Records a submitted file pair. Creating the row is what starts ingest (a
   * DynamoDB stream on MicroCoachUpload); resolves to the new row's id.
   */
  recordUpload(input: IRecordUploadInput): Promise<string>;
}
