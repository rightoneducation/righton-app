import { IGameSession } from './IGameSession';
import { IApiClient } from './IApiClient';
export declare enum Environment {
    Staging = "staging"
}
export declare class ApiClient implements IApiClient {
    private endpoint;
    constructor(env: Environment);
    createGameSession(gameId: number, isAdvancedMode: Boolean): Promise<IGameSession>;
}
