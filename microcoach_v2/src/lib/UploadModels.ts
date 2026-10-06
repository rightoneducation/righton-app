import { ScreenSize } from './MicroCoachModels';
import { IMicroCoachClassroom } from '../api/Models/IMicroCoachClassroom';
import { IUser } from '../api/Models/IUser';

// MIU upload state, actions and step-prop shape — split out of UploadFlow for
// the same reason as SignUpModels: the steps type their props from here.

export type UploadSlot = 'exemplar' | 'responses';
export type UploadFileError = 'FORMAT' | 'SIZE';

// Design notes: the exemplar takes .docx, the responses .xlsx, each up to 5MB.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const SLOT_EXTENSION: Record<UploadSlot, string> = {
  exemplar: '.docx',
  responses: '.xlsx',
};

export interface IUploadFile {
  name: string;
  // The picked file; null when it failed validation and will not be sent.
  file: File | null;
  error: UploadFileError | null;
}

export interface IUploadSubmission {
  docxKey: string;
  xlsxKey: string;
}

export type SubmitStatus = 'IDLE' | 'SUBMITTING' | 'ERROR';
// Which half failed: the S3 upload, or starting the analysis afterwards.
export type SubmitError = 'UPLOAD' | 'ANALYSIS';

export interface IUploadState {
  // null follows the dashboard's selected class; '' is "none chosen" (a new
  // classroom's upload); otherwise the class this upload is for.
  classId: string | null;
  /** Monday of the week this upload covers, local `YYYY-MM-DD` (lib/weeks). */
  weekStart: string;
  exemplar: IUploadFile | null;
  responses: IUploadFile | null;
  submitStatus: SubmitStatus;
  submitError: SubmitError | null;
  // Set once the files are in S3 and the analysis has started.
  submission: IUploadSubmission | null;
}

export const emptyUploadState = (
  classId: string | null,
  weekStart: string,
): IUploadState => ({
  classId,
  weekStart,
  exemplar: null,
  responses: null,
  submitStatus: 'IDLE',
  submitError: null,
  submission: null,
});

/** Null when the file is accepted for the slot. */
export function validateUploadFile(
  slot: UploadSlot,
  file: File,
): UploadFileError | null {
  if (!file.name.toLowerCase().endsWith(SLOT_EXTENSION[slot])) return 'FORMAT';
  if (file.size > MAX_UPLOAD_BYTES) return 'SIZE';
  return null;
}

export const isFileReady = (upload: IUploadFile | null) =>
  !!upload && !upload.error && !!upload.file;

export interface IUploadActions {
  setClass: (classId: string) => void;
  setWeek: (weekStart: string) => void;
  pickFile: (slot: UploadSlot, file: File) => void;
  clearFile: (slot: UploadSlot) => void;
  // Uploads both files and starts the analysis; resolves true on success.
  submit: () => Promise<boolean>;
  // Cancels the submission: removes the uploaded files, back to an empty form.
  startOver: () => Promise<void>;
  // A fresh form for another class; the current submission stays as it is.
  startNewClassroom: () => void;
}

export interface UploadStepProps {
  screenSize: ScreenSize;
  upload: IUploadState;
  actions: IUploadActions;
  classrooms: IMicroCoachClassroom[];
  teacher: IUser | null;
}
