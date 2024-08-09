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
  subscribeToUpdateGameSession(gameSessionId: string): Promise<IGameSession>;
  subscribeToCreateTeam():  Promise<IGameSession | null>;
  deleteTeam(teamId: string, callback:(updatedGameSession: IGameSession) => void): Promise<void>;
  subscribeToCreateTeamAnswer(): Promise<IHostTeamAnswers | null>;
  subscribeToUpdateTeamAnswer(): Promise<IHostTeamAnswers | null>;
  processGPTHints(hints: IHostTeamAnswersHint[], questionText: string, correctAnswer: string): Promise<any>;
}

