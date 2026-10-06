export interface ITeacherUploadInput {
  classroomId: string;
  docxKey: string;
  xlsxKey: string;
}

export interface IUploadAPIClient {
  /** Uploads one MIU file to the docs bucket; resolves to its S3 key. */
  uploadFile(classroomId: string, file: File): Promise<string>;
  removeFile(key: string): Promise<void>;
  /** Starts the MicroCoach analysis of an uploaded exemplar + responses pair. */
  startAnalysis(input: ITeacherUploadInput): Promise<string>;
}
