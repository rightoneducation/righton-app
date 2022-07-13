import { IGameSession } from './IGameSession';
export interface IApiClient {
    createGameSession(gameId: number, isAdvancedMode: Boolean): Promise<IGameSession>;
}
