import { UpdateGameSessionInput } from "../../AWSMobileApi";
import { IGameSession } from "../../Models";

export interface IGameSessionAPIClient {
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
  ): Promise<any>;

  getGameSessionByCode(gameCode: number): Promise<IGameSession | null>;
}