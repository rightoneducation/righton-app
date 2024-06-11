import { Environment } from '../interfaces/IBaseAPIClient';
import { IPlaySubscriptionManagerAPIClient } from './interfaces/ISubscriptionManagerAPIClient';
import { IGameSessionAPIClient, IQuestionAPIClient, ITeamAPIClient, ITeamMemberAPIClient, ITeamAnswerAPIClient } from '../interfaces';
import { IGameSession } from '../../Models';

export class PlaySubscriptionManagerAPIClient implements IPlaySubscriptionManagerAPIClient{
  protected env: Environment;
  protected gameSessionAPIClient: IGameSessionAPIClient;
  protected gameSessionId: string | null = null;
  protected gameSession: IGameSession | null = null;
  protected gameSessionSubscription: any;

  constructor (
    env: Environment,
    gameSession: IGameSessionAPIClient,
  ) {
    this.env = env;
    this.gameSessionAPIClient = gameSession;
    this.gameSessionId = null;    
  } 

  getGameSession(): IGameSession {
    const gameSession = this.gameSession;
    if (!gameSession){
      throw new Error ("Error: Invalid game session");
    }
    return gameSession;
  }

  protected async subscribeToGameSessionUpdates(callback: (gameSession: IGameSession) => void) {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
    this.gameSessionSubscription = await this.gameSessionAPIClient.subscribeUpdateGameSession(this.gameSessionId, (response: IGameSession) => {
      if (!response) {
        console.error('Error: Invalid game session update');
        return;
      }
      this.gameSession = { ...this.gameSession, ...response };
      callback(this.gameSession); // Call the callback with the updated session
    });
  }
}

export class HostSubscriptionManagerAPIClient extends PlaySubscriptionManagerAPIClient {
  protected questionAPIClient: IQuestionAPIClient;
  protected teamAPIClient: ITeamAPIClient;
  protected teamMemberAPIClient: ITeamMemberAPIClient;
  protected teamAnswerAPIClient: ITeamAnswerAPIClient;

  constructor (
    env: Environment,
    gameSession: IGameSessionAPIClient,
    question: IQuestionAPIClient,
    team: ITeamAPIClient,
    teamMember: ITeamMemberAPIClient,
    teamAnswer: ITeamAnswerAPIClient
  ) {
    super(env, gameSession);
    this.questionAPIClient = question;
    this.teamAPIClient = team;
    this.teamMemberAPIClient = teamMember;
    this.teamAnswerAPIClient = teamAnswer;
  }

  cleanupSubscription() {
    if (this.gameSessionSubscription && this.gameSessionSubscription.unsubscribe) {
      this.gameSessionSubscription.unsubscribe();
    }
  }

  async initSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession> {
    try {
      this.gameSessionId = gameSessionId;
      const fetchedGame = await this.gameSessionAPIClient.getGameSession(this.gameSessionId);
      if (!fetchedGame || !fetchedGame.id) {
        throw new Error('Invalid game session');
      }
      this.gameSession = fetchedGame;
      this.subscribeToGameSessionUpdates(callback);
      return this.gameSession;
    } catch (error) {
      throw new Error (`Error: ${error}`)
    }
  }
}