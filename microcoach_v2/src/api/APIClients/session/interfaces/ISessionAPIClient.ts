import { SessionStatus } from "../../../../AWSAPI";
import { IMicroCoachSession, IMiuUpload } from "../../../Models/IMicroCoachSession";

export interface ISessionAPIClient {
  getSession(id: string): Promise<IMicroCoachSession | null>;
  getSessionsByClassId(classId: string): Promise<IMicroCoachSession[]>;
  createSession(
    session: IMicroCoachSession,
  ): Promise<IMicroCoachSession | null>;
  updateSession(
    session: IMicroCoachSession,
  ): Promise<IMicroCoachSession | null>;
  // Writes only selectedMisconceptionId, so nothing else on the row is touched.
  setSelectedMisconception(
    id: string,
    misconceptionId: string | null,
  ): Promise<IMicroCoachSession | null>;
  // MIU 1 submitted: a new session holding the upload, waiting on the pipeline.
  createUploadedSession(
    classId: string,
    upload: IMiuUpload,
  ): Promise<IMicroCoachSession | null>;
  // Writes only miuUploads (the full list, the new one appended) and status.
  recordMiuUpload(
    id: string,
    miuUploads: IMiuUpload[],
    status: SessionStatus,
  ): Promise<IMicroCoachSession | null>;
  deleteSession(id: string): Promise<IMicroCoachSession | null>;
}
