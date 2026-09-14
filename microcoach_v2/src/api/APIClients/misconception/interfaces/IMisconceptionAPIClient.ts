import { IMisconception } from "../../../../lib/PipelineModels";

export interface IMisconceptionAPIClient {
  getMisconceptionsBySessionId(sessionId: string): Promise<IMisconception[]>;
}
