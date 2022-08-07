import { IGameSession } from './IGameSession'
import { IApiClient } from './IApiClient'
import {
    GameSessionState,
    OnUpdateGameSessionSubscription,
    UpdateGameSessionInput,
    UpdateGameSessionMutation,
    UpdateGameSessionMutationVariables
} from './AWSMobileApi'
import { updateGameSession } from './graphql/mutations'
import { Amplify, API, graphqlOperation } from "aws-amplify"
import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api"
import { onUpdateGameSession, getGameSession } from './graphql'
import awsconfig from "./aws-exports"

Amplify.configure(awsconfig)

export enum Environment {
    Staging = "staging"
}

enum HTTPMethod {
    Post = "POST"
}

interface GraphQLOptions {
    input?: object
    variables?: object
    authMode?: GRAPHQL_AUTH_MODE
}

interface SubscriptionValue<T> {
    value: {
        data: T,
        errors: Array<any> | null
    }
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

    async loadGameSession(id: string): Promise<IGameSession> {
        let result = await API.graphql(graphqlOperation(getGameSession, { id })) as { data: any }
        return result.data.getGameSession as IGameSession
    }

    async updateGameSession(id: string, gameState: GameSessionState): Promise<IGameSession> {
        let updateGameSessionInput: UpdateGameSessionInput = { id, currentState: gameState }
        let variables: UpdateGameSessionMutationVariables = { input: updateGameSessionInput }
        let result = await this.callGraphQL<UpdateGameSessionMutation>(updateGameSession, variables)
        if (result.errors != null) {
            throw new Error(`failed to update game session: ${result.errors}`)
        }

        if (result.data == null) {
            throw new Error("Failed to update the game session")
        }

        return result.data.updateGameSession as IGameSession

    }

    subscribeUpdateGameSession(id: string, callback: (result: IGameSession) => void) {
        return this.subscribeGraphQL<OnUpdateGameSessionSubscription>(
            {
                query: onUpdateGameSession,
                variables: {
                    filter: {
                        id: {
                            eq: id
                        }
                    }
                }
            }
            , (value: OnUpdateGameSessionSubscription) => {
                let gameSession = this.mapOnUpdateGameSessionSubscription(value)
                callback(gameSession)
            })
    }

    private subscribeGraphQL<T>(subscription: any, callback: (value: T) => void) {
        //@ts-ignore
        return API.graphql(subscription).subscribe({
            next: (response: SubscriptionValue<T>) => {
                if (!isNullOrUndefined(response.value.errors)) {
                    console.error(response.value.errors)
                }
                callback(response.value.data)
            },
            error: (error: any) => console.warn(error)
        })
    }

    private async callGraphQL<T>(query: any, options?: GraphQLOptions): Promise<GraphQLResult<T>> {
        return (await API.graphql(graphqlOperation(query, options))) as GraphQLResult<T>
    }

    private mapOnUpdateGameSessionSubscription(subscription: OnUpdateGameSessionSubscription): IGameSession {
        const {
            id,
            gameId,
            startTime,
            phaseOneTime,
            phaseTwoTime,
            // teams,
            currentQuestionId,
            currentState,
            gameCode,
            // questions,
            currentTimer,
            updatedAt,
            createdAt
        } = subscription.onUpdateGameSession || {}

        if (
            isNullOrUndefined(id) ||
            isNullOrUndefined(currentState) ||
            isNullOrUndefined(gameCode) ||
            isNullOrUndefined(gameId) ||
            isNullOrUndefined(phaseOneTime) ||
            isNullOrUndefined(phaseTwoTime) ||
            isNullOrUndefined(updatedAt) ||
            isNullOrUndefined(createdAt)
        ) {
            throw new Error("GameSession.id can't be null.")
        }

        const gameSession: IGameSession = {
            id,
            gameId,
            startTime,
            phaseOneTime,
            phaseTwoTime,
            // teams,
            currentQuestionId,
            currentState,
            gameCode,
            currentTimer,
            // questions,
            updatedAt,
            createdAt
        }
        return gameSession

    }
}


function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined
}