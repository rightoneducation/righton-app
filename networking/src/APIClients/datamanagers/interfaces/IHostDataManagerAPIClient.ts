import { IGameSession, IHostTeamAnswers, IHostTeamAnswersHint } from "../../../Models";
import { IPlayDataManagerAPIClient } from "./IPlayDataManagerAPIClient";

export interface IHostDataManagerAPIClient extends IPlayDataManagerAPIClient {
  init(gameSessionId: string): Promise<void>;
  cleanupSubscription(): void;
  getHostTeamAnswers(): IHostTeamAnswers;
  subscribeToUpdateGameSession(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
  subscribeToCreateTeamAnswer(callback: (hostTeamAnswers: IHostTeamAnswers) => void): Promise<void>
  processGPTHints(hints: IHostTeamAnswersHint[], questionText: string, correctAnswer: string): Promise<any>;
}

