import { IGameSession, IHostTeamAnswers } from "../../../Models";
import { IPlayDataManagerAPIClient } from "./IPlayDataManagerAPIClient";

export interface IHostDataManagerAPIClient extends IPlayDataManagerAPIClient {
  init(gameSessionId: string): Promise<void>;
  cleanupSubscription(): void;
  getHostTeamAnswers(): IHostTeamAnswers;
  initHostTeamAnswers(): IHostTeamAnswers;
  subscribeToUpdateGameSession(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
  subscribeToCreateTeamAnswer(callback: (hostTeamAnswers: IHostTeamAnswers) => void): Promise<IHostTeamAnswers>
}

