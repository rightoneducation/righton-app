import { IGameSession } from "../../../Models";

export interface IHostSubscriptionAPIClient {
  getLatestGameSession(gameSessionId: string): Promise<IGameSession>;
  initUpdateGameSessionSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<any>;
  initDeleteTeamSubscription(teamId: string, callback: (team: any) => void): Promise<any>;
  initCreateTeamAnswerSubscription(teamId: string, callback: (teamAnswer: any) => void): Promise<any>;
  initUpdateTeamAnswerSubscription(teamId: string, callback: (teamAnswer: any) => void): Promise<any>;
  initUpdateTeamMemberSubscription(teamMemberId: string, callback: (teamMember: any) => void): Promise<any>;
}

export interface IPlaySubscriptionAPIClient {
  getLatestGameSession(gameSessionId: string): Promise<IGameSession>;
  initUpdateGameSessionSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<any>;
}

