import { IGameSession, IHostTeamAnswers, IHostTeamAnswersHint, IQuestion, IHostTeamAnswersResponse } from "../../../Models";
import { IPhase } from "../HostDataManagerAPIClient";
import { IPlayDataManagerAPIClient } from "./IPlayDataManagerAPIClient";

export interface IHostDataManagerAPIClient extends IPlayDataManagerAPIClient {
  init(gameSessionId: string): Promise<void>;
  cleanupSubscription(): void;
  updateTime(time: number): Promise<void>;
  initHostTeamAnswers(inputGameSession: IGameSession): IHostTeamAnswers;
  getHostTeamAnswers(): IHostTeamAnswers;
  updateHostTeamAnswersSelectedMistakes(mistakes: any, currentQuestion: IQuestion): void;
  getResponsesForQuestion(questionId: string, phase: IPhase): IHostTeamAnswersResponse[];
  subscribeToUpdateGameSession(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
  subscribeToCreateTeam(callback: (updatedGameSession: IGameSession) => void): Promise<void>;
  deleteTeam(teamId: string, callback:(updatedGameSession: IGameSession) => void): Promise<void>;
  subscribeToCreateTeamAnswer(callback: (hostTeamAnswers: IHostTeamAnswers) => void): Promise<void>;
  subscribeToUpdateTeamAnswer(callback: (hostTeamAnswers: IHostTeamAnswers) => void): Promise<void>;
  processGPTHints(hints: IHostTeamAnswersHint[], questionText: string, correctAnswer: string): Promise<any>;
}

