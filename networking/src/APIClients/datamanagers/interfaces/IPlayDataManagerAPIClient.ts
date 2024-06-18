import { IGameSession } from "../../../Models/IGameSession";

export interface IPlayDataManagerAPIClient {
  getGameSession(): IGameSession;
}
