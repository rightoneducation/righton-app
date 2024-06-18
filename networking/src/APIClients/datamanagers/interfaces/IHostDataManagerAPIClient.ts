import { IGameSession, IHostTeamAnswers } from "../../../Models";
import { IPlayDataManagerAPIClient } from "./IPlayDataManagerAPIClient";

export interface IHostDataManagerAPIClient extends IPlayDataManagerAPIClient {
  cleanupSubscription(): void;
  getHostTeamAnswers(): IHostTeamAnswers;
  subscribeToUpdateGameSession(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
  subscribeToCreateTeamAnswer(callback: (hostTeamAnswers: IHostTeamAnswers) => void): Promise<IHostTeamAnswers>
}

