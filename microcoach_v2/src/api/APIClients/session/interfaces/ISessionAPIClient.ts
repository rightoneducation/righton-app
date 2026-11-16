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
  // The reviewer's Publish (/prepublishreview): DRAFT → PUBLISHED and the
  // uploading teacher is emailed, server-side (microcoachv2EmailTeacher).
  // Resolves to the session's publishStatus after the call.
  publishSession(sessionId: string): Promise<PublishStatus | null>;
  // The reviewer's Check math (/prepublishreview): marks the session's
  // mathCheck RUNNING and starts the check server-side
  // (microcoachv2FinalMathCheck), returning at once. Poll getSession for the
  // result. Resolves to the session's mathCheck JSON after the call.
  checkSessionMath(sessionId: string): Promise<string | null>;
  // The reviewer's Correct: fixes the chosen issues server-side
  // (microcoachv2FinalMathCorrect) and re-checks them, returning at once.
  // `issues` is JSON: [{ kind, misconceptionIndex, activityIndex, rowId }].
  // Resolves to the session's mathCorrect JSON after the call.
  correctSessionMath(sessionId: string, issues: string): Promise<string | null>;
  // The reviewer's hand edits, written before Publish. `edits` is JSON:
  // [{ kind, misconceptionIndex, activityIndex, rowId, value }]. Resolves to
  // the session as it is after the edits.
  applySessionEdits(sessionId: string, edits: string): Promise<IMicroCoachSession | null>;
  // Writes only publishStatus. Not for publishing: that emails the teacher,
  // so it goes through publishSession.
  setPublishStatus(
    id: string,
    publishStatus: PublishStatus,
  ): Promise<IMicroCoachSession | null>;
  deleteSession(id: string): Promise<IMicroCoachSession | null>;
}
