import { Environment } from "../interfaces/IBaseAPIClient";
import { IGameSessionAPIClient, IQuestionAPIClient, ITeamAPIClient, ITeamMemberAPIClient, ITeamAnswerAPIClient } from "../interfaces";
import { IGameSession } from "../../Models";
import { IHostSubscriptionAPIClient, IPlaySubscriptionAPIClient } from "./interfaces/ISubscriptionAPIClient";


export abstract class BaseSubscriptionAPIClient {
  protected env: Environment;
  protected gameSessionAPIClient: IGameSessionAPIClient;

  constructor (
    env: Environment,
    gameSession: IGameSessionAPIClient,
  ) {
    this.env = env;
    this.gameSessionAPIClient = gameSession;
  }
  
  getLatestGameSession = async (gameSessionId: string): Promise<IGameSession> => {
    return await this.gameSessionAPIClient.getGameSession(gameSessionId);
  }

  initUpdateGameSessionSubscription = async (gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<any> => {
    return await this.gameSessionAPIClient.subscribeUpdateGameSession(gameSessionId, callback);
  }
}

export class HostSubscriptionAPIClient extends BaseSubscriptionAPIClient implements IHostSubscriptionAPIClient {
  protected questionAPIClient: IQuestionAPIClient;
  protected teamAPIClient: ITeamAPIClient;
  protected teamMemberAPIClient: ITeamMemberAPIClient;
  protected teamAnswerAPIClient: ITeamAnswerAPIClient;

  constructor (
    env: Environment,
    gameSessionAPIClient: IGameSessionAPIClient,
    question: IQuestionAPIClient,
    team: ITeamAPIClient,
    teamMember: ITeamMemberAPIClient,
    teamAnswer: ITeamAnswerAPIClient
  ) {
    super(env, gameSessionAPIClient);
    this.questionAPIClient = question;
    this.teamAPIClient = team;
    this.teamMemberAPIClient = teamMember;
    this.teamAnswerAPIClient = teamAnswer;    
  } 

  getLatestTeam = async (teamId: string) => {
    return await this.teamAPIClient.getTeam(teamId);
  }

  initCreateTeamSubscription = async (teamId: string, callback: (team: any) => void) => {
    return await this.teamAPIClient.subscribeCreateTeam(teamId, callback);
  }

  initDeleteTeamSubscription = async (teamId: string, callback: (team: any) => void) => {
    return await this.teamAPIClient.subscribeDeleteTeam(teamId, callback);
  }

  initCreateTeamAnswerSubscription = async (teamId: string, callback: (teamAnswer: any) => void) => {
    return await this.teamAnswerAPIClient.subscribeCreateTeamAnswer(teamId, callback);
  }

  initUpdateTeamAnswerSubscription = async (teamId: string, callback: (teamAnswer: any) => void) => {
    return await this.teamAnswerAPIClient.subscribeUpdateTeamAnswer(teamId, callback);
  }

  initUpdateTeamMemberSubscription = async (teamMemberId: string, callback: (teamMember: any) => void) => {
    return this.teamMemberAPIClient.subscribeUpdateTeamMember(teamMemberId, callback);
  }
}

export class PlaySubscriptionAPIClient 
  extends BaseSubscriptionAPIClient
  implements IPlaySubscriptionAPIClient {
  constructor (
    env: Environment,
    gameSessionAPIClient: IGameSessionAPIClient,
  ){
    super(env, gameSessionAPIClient);
  }
}