import { PublishStatus, SessionStatus } from "../../../../AWSAPI";
import { IMicroCoachSession } from "../../../Models/IMicroCoachSession";

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
  // MIU 1 submitted: a new session, waiting on the pipeline (DATA_INGESTED).
  // weekStart: the school week's Monday the teacher uploaded for.
  createUploadedSession(
    classId: string,
    weekStart: string,
  ): Promise<IMicroCoachSession | null>;
  // Writes only status (MIU 2 submitted: REASSESS_INGESTED).
  setSessionStatus(
    id: string,
    status: SessionStatus,
  ): Promise<IMicroCoachSession | null>;
  // Writes only publishStatus (/prepublishreview's Publish: DRAFT → PUBLISHED).
  setPublishStatus(
    id: string,
    publishStatus: PublishStatus,
  ): Promise<IMicroCoachSession | null>;
  deleteSession(id: string): Promise<IMicroCoachSession | null>;
}
