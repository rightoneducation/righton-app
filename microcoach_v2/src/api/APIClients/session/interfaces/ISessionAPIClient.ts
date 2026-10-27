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
  deleteSession(id: string): Promise<IMicroCoachSession | null>;
}
