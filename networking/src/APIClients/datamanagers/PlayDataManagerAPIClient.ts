import { Environment } from '../interfaces/IBaseAPIClient';
import { IPlayDataManagerAPIClient } from './interfaces/IPlayDataManagerAPIClient';
import { IGameSessionAPIClient } from '../gamesession/interfaces';
import { IGameSession } from '../../Models/IGameSession';

export class PlayDataManagerAPIClient implements IPlayDataManagerAPIClient{
  protected env: Environment;
  protected gameSessionAPIClient: IGameSessionAPIClient;
  protected gameSessionId: string | null = null;
  protected gameSession: IGameSession | null = null;
  protected gameSessionSubscription: any;

  constructor (
    env: Environment,
    gameSessionAPIClient: IGameSessionAPIClient,
  ) {
    this.env = env;
    this.gameSessionAPIClient = gameSessionAPIClient;
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