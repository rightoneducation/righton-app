import { IGameSession } from "../../../Models";

export interface IPlaySubscriptionManagerAPIClient {
  getGameSession(): IGameSession;
}

export interface IHostSubscriptionManagerAPIClient extends IPlaySubscriptionManagerAPIClient {
  cleanupSubscription(): void;
  initSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession>;
}

