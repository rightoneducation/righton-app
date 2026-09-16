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
  deleteSession(id: string): Promise<IMicroCoachSession | null>;
}
