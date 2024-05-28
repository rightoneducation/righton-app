import { UpdateGameSessionInput } from "../../../AWSMobileApi";
import { IGameSession } from "../../../Models";
import { Subscription } from 'rxjs'; // this is used in aws-amplify to handle subscriptions

export interface IGameSessionAPIClient {
  createGameSessionFromTemplate(id: string): Promise<string | null>;

  createGameSession(
    gameId: number,
    isAdvancedMode: Boolean
  ): Promise<IGameSession>;

  getGameSession(id: string): Promise<IGameSession>;

  updateGameSession(
    gameSessionInput: UpdateGameSessionInput
  ): Promise<IGameSession>;

  subscribeUpdateGameSession(
    id: string,
    callback: (result: IGameSession) => void
  ): Subscription;

  getGameSessionByCode(gameCode: number): Promise<IGameSession | null>;
}