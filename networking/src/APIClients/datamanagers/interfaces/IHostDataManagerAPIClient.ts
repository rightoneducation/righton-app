import { IGameSession } from "../../../Models";
import { IPlayDataManagerAPIClient } from "./IPlayDataManagerAPIClient";

export interface IHostDataManagerAPIClient extends IPlayDataManagerAPIClient {
  cleanupSubscription(): void;
  initSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
}

