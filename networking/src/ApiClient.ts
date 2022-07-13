import { IGameSession } from './IGameSession'
import { IApiClient } from './IApiClient'

export enum Environment {
    Staging = "staging"
}

enum HTTPMethod {
    Post = "POST"
}

export class ApiClient implements IApiClient {
    private endpoint: string

    constructor(env: Environment) {
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`
    }

    createGameSession(
        gameId: number,
        isAdvancedMode: Boolean): Promise<IGameSession> {

        return fetch(
            this.endpoint, {
            'method': HTTPMethod.Post,
            headers: {
                'content-type': 'application/json',
                'connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                gameId: gameId,
                isAdvancedMode: isAdvancedMode,
            }),
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText)
            }
            return response.json()
        }).then(response => {
            return response as IGameSession
        })
    }
}