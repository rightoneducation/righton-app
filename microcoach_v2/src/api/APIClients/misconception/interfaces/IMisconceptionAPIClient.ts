import { IMicroCoachMisconception } from "../../../Models/IMicroCoachMisconception";

export interface IMisconceptionAPIClient {
  getMisconceptionsBySessionId(
    sessionId: string,
  ): Promise<IMicroCoachMisconception[]>;
}
