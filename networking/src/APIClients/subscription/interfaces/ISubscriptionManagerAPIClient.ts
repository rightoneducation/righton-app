import { IGameSession } from "../../../Models";

export interface ISubscriptionManagerAPIClient {
  getGameSession(): IGameSession;
  cleanupSubscription(): void;
  initSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
}

