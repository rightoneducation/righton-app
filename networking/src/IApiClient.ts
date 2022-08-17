import { AWSUpdateGameSessionInput } from './ApiClient'
import { IGameSession } from './Models/IGameSession'

export interface IApiClient {
    createGameSession(gameId: number, isAdvancedMode: Boolean): Promise<IGameSession>
    getGameSession(id: string): Promise<IGameSession>
    updateGameSession(awsGameSessionInput: AWSUpdateGameSessionInput): Promise<IGameSession>
    subscribeUpdateGameSession(id: string, callback: (result: IGameSession) => void): any
    getGameSessionByCode(gameCode: number): Promise<IGameSession | null>
}