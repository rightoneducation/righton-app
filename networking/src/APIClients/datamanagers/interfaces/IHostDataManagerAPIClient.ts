import { IGameSession, IHostTeamAnswers, IHostTeamAnswersHint, IQuestion, IHostTeamAnswersResponse } from "../../../Models";
import { IPhase } from "../HostDataManagerAPIClient";
import { IPlayDataManagerAPIClient } from "./IPlayDataManagerAPIClient";

export interface IHostDataManagerAPIClient extends IPlayDataManagerAPIClient {
  init(gameSessionId: string): Promise<void>;
  cleanupSubscription(): void;
  updateTime(time: number): Promise<void>;
  updateGameSession(gameSessionUpdates: any): Promise<void>;
  initHostTeamAnswers(inputGameSession: IGameSession): IHostTeamAnswers;
  getHostTeamAnswers(): IHostTeamAnswers;
  updateHostTeamAnswersSelectedMistakes(mistakes: any, currentQuestion: IQuestion): void;
  getResponsesForQuestion(questionId: string, phase: IPhase): IHostTeamAnswersResponse[];
  subscribeToCreateTeam(callback: (updatedGameSession: IGameSession | null) => void): void
  subscribeToUpdateTeam(callback: (updatedGameSession: IGameSession | null) => void): void;
  deleteTeam(teamId: string, callback:(updatedGameSession: IGameSession) => void): Promise<void>;
  subscribeToCreateTeamAnswer(callback: (createdHostTeamAnswers: IHostTeamAnswers | null) => void): void;
  subscribeToUpdateTeamAnswer(callback: (updatedHostTeamAnswers: IHostTeamAnswers) => void): void;
  processGPTHints(hints: IHostTeamAnswersHint[], questionText: string, correctAnswer: string): Promise<any>;
}

