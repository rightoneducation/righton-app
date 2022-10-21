import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api"
import { Amplify, API, graphqlOperation } from "aws-amplify"
import awsconfig from "./aws-exports"
import {
    CreateTeamAnswerInput,
    CreateTeamAnswerMutation,
    CreateTeamAnswerMutationVariables,
    CreateTeamInput,
    CreateTeamMemberInput,
    CreateTeamMemberMutation,
    CreateTeamMemberMutationVariables,
    CreateTeamMutation,
    CreateTeamMutationVariables,
    GameSessionState, OnCreateTeamAnswerSubscription, OnCreateTeamSubscription,
    OnDeleteTeamSubscription, OnGameSessionUpdatedByIdSubscription,
    OnUpdateGameSessionSubscription, OnUpdateTeamMemberSubscription, UpdateGameSessionInput,
    UpdateGameSessionMutation,
    UpdateGameSessionMutationVariables
} from './AWSMobileApi'
import { gameSessionByCode, getGameSession, getTeam, onCreateTeam, onCreateTeamAnswer, onDeleteTeam, onGameSessionUpdatedById, onUpdateTeamMember } from './graphql'
import { createTeam, createTeamAnswer, createTeamMember, updateGameSession } from './graphql/mutations'
import { IApiClient } from './IApiClient'
import { Choice, IQuestion, ITeamAnswer, ITeamMember } from './Models'
import { IGameSession } from './Models/IGameSession'
import { ITeam } from './Models/ITeam'

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
            return GameSessionParser.gameSessionFromAWSGameSession(response)
        })
    }

    async getGameSession(id: string): Promise<IGameSession> {
        let result = await API.graphql(graphqlOperation(getGameSession, { id })) as { data: any }
        return GameSessionParser.gameSessionFromAWSGameSession(result.data.getGameSession)
    }

    async getTeam(id: string): Promise<ITeam> {
        let result = await API.graphql(graphqlOperation(getTeam, { id })) as { data: any }
        return TeamParser.teamFromAWSTeam(result.data.getTeam)
    }

    async updateGameSession(awsGameSessionInput: UpdateGameSessionInput): Promise<IGameSession> {
        let updateGameSessionInput: UpdateGameSessionInput = awsGameSessionInput
        let variables: UpdateGameSessionMutationVariables = { input: updateGameSessionInput }
        let result = await this.callGraphQL<UpdateGameSessionMutation>(updateGameSession, variables)
        if (result.errors != null) {
            throw new Error(`failed to update game session: ${result.errors}`)
        }

        if (result.data == null) {
            throw new Error("Failed to update the game session")
        }

        return this.mapUpdateGameSessionMutation(result.data)
    }

    subscribeUpdateGameSession(id: string, callback: (result: IGameSession) => void) {
        return this.subscribeGraphQL<OnGameSessionUpdatedByIdSubscription>({
            query: onGameSessionUpdatedById,
            variables: {
                id: id
            }
        }, (value: OnGameSessionUpdatedByIdSubscription) => {
            let gameSession = this.mapOnGameSessionUpdatedByIdSubscription(value)
            callback(gameSession)
        })
    }

    subscribeUpdateTeamMember(id: string, callback: (result: ITeamMember) => void) {
        return this.subscribeGraphQL<OnUpdateTeamMemberSubscription>({
            query: onUpdateTeamMember,
            variables: {
                id: id
            }
        }, (value: OnUpdateTeamMemberSubscription) => {
            let teamMember = this.mapOnUpdateTeamMemberSubscription(value)
            callback(teamMember)
        })
    }


    subscribeCreateTeam(id: string, callback: (result: ITeam) => void) {
        return this.subscribeGraphQL<OnCreateTeamSubscription>({
            query: onCreateTeam,
            variables: {
                id: id
            }
        }, (value: OnCreateTeamSubscription) => {
            let team = this.mapOnCreateTeamSubscription(value)
            callback(team)
        })
    }

    subscribeDeleteTeam(id: string, callback: (result: ITeam) => void) {
        return this.subscribeGraphQL<OnDeleteTeamSubscription>({
            query: onDeleteTeam,
            variables: {
                id: id
            }
        }, (value: OnDeleteTeamSubscription) => {
            let team = this.mapOnDeleteTeamSubscription(value)
            callback(team)
        })
    }

    subscribeCreateTeamAnswer(id: string, callback: (result: ITeamAnswer) => void) {
        return this.subscribeGraphQL<OnCreateTeamAnswerSubscription>({
            query: onCreateTeamAnswer,
            variables: {
                id: id
            }
        }, (value: OnCreateTeamAnswerSubscription) => {
            let teamAnswer = this.mapOnCreateTeamAnswerSubscription(value)
            callback(teamAnswer)
        })
    }

    async getGameSessionByCode(gameCode: number): Promise<IGameSession | null> {
        let result = await API.graphql(graphqlOperation(gameSessionByCode, { gameCode })) as { data: any }
        if (isNullOrUndefined(result.data) ||
            isNullOrUndefined(result.data.gameSessionByCode) ||
            isNullOrUndefined(result.data.gameSessionByCode.items) ||
            result.data.gameSessionByCode.items.length == 0) {
            return null
        }
        if (result.data.gameSessionByCode.items.length > 1) {
            throw new Error(`Multiple game sessions exist for ${gameCode}`)
        }
        return GameSessionParser.gameSessionFromAWSGameSession(result.data.gameSessionByCode.items[0])
    }

    async addTeamToGameSessionId(gameSessionId: string, name: string, questionId: string | null): Promise<ITeam> {
        const input: CreateTeamInput = {
            name,
            score: 0,
            teamQuestionId: questionId,
            gameSessionTeamsId: gameSessionId,
            teamQuestionGameSessionId: gameSessionId
        }
        const variables: CreateTeamMutationVariables = { input }
        const team = await this.callGraphQL<CreateTeamMutation>(createTeam, variables)
        if (isNullOrUndefined(team.data) ||
            isNullOrUndefined(team.data.createTeam)) {
            throw new Error(`Failed to create team`)
        }
        return team.data.createTeam as ITeam
    }

    async addTeamMemberToTeam(teamId: string, isFacilitator: boolean = false, deviceId: string): Promise<ITeamMember> {
        const input: CreateTeamMemberInput = {
            isFacilitator,
            deviceId,
            teamTeamMembersId: teamId
        }
        const variables: CreateTeamMemberMutationVariables = { input }
        const member = await this.callGraphQL<CreateTeamMemberMutation>(createTeamMember, variables)
        if (isNullOrUndefined(member.data) ||
            isNullOrUndefined(member.data.createTeamMember)) {
            throw new Error(`Failed to create team member`)
        }
        return member.data.createTeamMember as ITeamMember
    }

    async addTeamAnswer(teamMemberId: string, questionId: number, text: string, isChosen: boolean | null = null): Promise<ITeamAnswer> {
        const input: CreateTeamAnswerInput = {
            questionId,
            isChosen,
            text,
            teamMemberAnswersId: teamMemberId
        }
        const variables: CreateTeamAnswerMutationVariables = { input }
        const answer = await this.callGraphQL<CreateTeamAnswerMutation>(createTeamAnswer, variables)
        if (isNullOrUndefined(answer.data) ||
            isNullOrUndefined(answer.data.createTeamAnswer)) {
            throw new Error(`Failed to create team answer`)
        }
        return answer.data.createTeamAnswer as ITeamAnswer
    }

    calculateBasicModeWrongAnswerScore(gameSession: IGameSession, team: ITeam, questionId: number): number {
        if (isNullOrUndefined(gameSession.teams)) {
            throw new Error("'teams' can't be null")
        }

        if (isNullOrUndefined(team.teamMembers)) {
            throw new Error("No members available for the team")
        }

        const teamAnswers = team.teamMembers[0]?.answers?.filter((answer) => {
            answer?.questionId === questionId
        })

        if (isNullOrUndefined(teamAnswers) ||
            teamAnswers.length != 1) {
            return 0
        }

        // Calculate how many teams have chosen the same answer as the passed team.
        const totalNoChosenAnswer = gameSession.teams.reduce((previousVal: number, otherTeam: ITeam) => {
            if (isNullOrUndefined(otherTeam.teamMembers) ||
                otherTeam.teamMembers.length < 1) {
                return previousVal
            }

            const answersToQuestion = otherTeam.teamMembers[0]?.answers?.filter((answer) => {
                !isNullOrUndefined(answer) &&
                    !isNullOrUndefined(answer?.questionId) &&
                    answer.questionId === questionId &&
                    answer.text === teamAnswers[0]!.questionId
            })

            return previousVal + (answersToQuestion?.length ?? 0)
        }, 1)

        return Math.ceil(totalNoChosenAnswer / gameSession.teams.length) * 100
    }

    // Private methods
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

    private mapUpdateGameSessionMutation(updateGameSession: UpdateGameSessionMutation): IGameSession {
        return GameSessionParser.gameSessionFromMutation(updateGameSession)
    }

    private mapOnGameSessionUpdatedByIdSubscription(subscription: OnGameSessionUpdatedByIdSubscription): IGameSession {
        return GameSessionParser.gameSessionFromSubscriptionById(subscription)
    }

    private mapOnCreateTeamSubscription(subscription: OnCreateTeamSubscription): ITeam {
        return TeamParser.teamFromCreateTeamSubscription(subscription)
    }

    private mapOnDeleteTeamSubscription(subscription: OnDeleteTeamSubscription): ITeam {
        return TeamParser.teamFromDeleteTeamSubscription(subscription)
    }

    private mapOnUpdateTeamMemberSubscription(subscription: OnUpdateTeamMemberSubscription): ITeamMember {
        return TeamMemberParser.teamMemberFromTeamMemberSubscription(subscription)
    }

    private mapOnCreateTeamAnswerSubscription(subscription: OnCreateTeamAnswerSubscription): ITeamAnswer {
        return TeamAnswerParser.teamAnswerFromTeamAnswerSubscription(subscription)
    }
}

type AWSGameSession = {
    id: string
    gameId: number
    startTime?: string | null
    phaseOneTime: number
    phaseTwoTime: number
    teams?: {
        items: Array<AWSTeam | null>
    } | null
    currentQuestionIndex?: number | null
    currentState: GameSessionState
    gameCode: number
    isAdvancedMode: boolean
    imageUrl?: string | null
    description?: string | null
    title?: string | null
    currentTimer?: number | null
    questions?: {
        items: Array<AWSQuestion | null>
    } | null
    createdAt: string
    updatedAt: string
}

type AWSTeam = {
    id: string,
    name: string,
    trickiestAnswerIDs?: Array<string | null> | null,
    teamMembers?: Array<ITeamMember | null> | null,
    score: number,
    createdAt: string,
    updatedAt?: string,
    gameSessionTeamsId?: string | null,
    teamQuestionId?: string | null,
    teamQuestionGameSessionId?: string | null,
}

type AWSQuestion = {
    id: number,
    text: string,
    choices?: Array<Choice> | null,
    imageUrl?: string | null,
    instructions?: Array<string> | null,
    standard?: string | null,
    cluster?: string | null,
    domain?: string | null,
    grade?: string | null,
    gameSessionId: string,
    order: number,
}

type AWSTeamMember = {
    id: string,
    isFacilitator?: boolean | null,
    answers?: Array<ITeamAnswer> | null,
    deviceId?: string | null,
    createdAt?: string | null,
    updatedAt?: string | null,
    teamTeamMembersId?: string | null,
}

type AWSTeamAnswer = {
    id: string,
    questionId?: number | null,
    isChosen?: boolean | null,
    text?: string | null,
    createdAt?: string,
    updatedAt?: string,
    teamMemberAnswersId?: string | null,
}

class GameSessionParser {

    static gameSessionFromSubscription(subscription: OnUpdateGameSessionSubscription): IGameSession {
        const updateGameSession = subscription.onUpdateGameSession
        if (isNullOrUndefined(updateGameSession)) {
            throw new Error("subscription.onUpdateGameSession can't be null.")
        }
        //@ts-ignore
        return this.gameSessionFromAWSGameSession(updateGameSession)
    }

    static gameSessionFromMutation(mutation: UpdateGameSessionMutation) {
        const updateGameSession = mutation.updateGameSession
        if (isNullOrUndefined(updateGameSession)) {
            throw new Error("mutation.updateGameSession can't be null.")
        }
        //@ts-ignore
        return this.gameSessionFromAWSGameSession(updateGameSession)
    }

    static gameSessionFromAWSGameSession(awsGameSession: AWSGameSession): IGameSession {
        const {
            id,
            gameId,
            startTime,
            phaseOneTime,
            phaseTwoTime,
            teams,
            currentQuestionIndex,
            currentState,
            gameCode,
            questions,
            currentTimer,
            updatedAt,
            createdAt,
            title,
            isAdvancedMode

        } = awsGameSession || {}

        if (
            isNullOrUndefined(id) ||
            isNullOrUndefined(currentState) ||
            isNullOrUndefined(gameCode) ||
            isNullOrUndefined(gameId) ||
            isNullOrUndefined(phaseOneTime) ||
            isNullOrUndefined(phaseTwoTime) ||
            isNullOrUndefined(questions) ||
            isNullOrUndefined(questions.items) ||
            isNullOrUndefined(updatedAt) ||
            isNullOrUndefined(createdAt) ||
            isNullOrUndefined(isAdvancedMode)
        ) {
            throw new Error("GameSession has null field for the attributes that are not nullable")
        }

        const gameSession: IGameSession = {
            id,
            gameId,
            startTime,
            phaseOneTime,
            phaseTwoTime,
            teams: GameSessionParser.mapTeams(teams),
            currentQuestionIndex,
            currentState,
            gameCode,
            currentTimer,
            questions: GameSessionParser.mapQuestions(questions.items),
            isAdvancedMode,
            updatedAt,
            createdAt,
            title
        }
        return gameSession
    }

    static gameSessionFromSubscriptionById(subscription: OnGameSessionUpdatedByIdSubscription): IGameSession {
        const updateGameSession = subscription.onGameSessionUpdatedById
        if (isNullOrUndefined(updateGameSession)) {
            throw new Error("subscription.onUpdateGameSession can't be null.")
        }
        //@ts-ignore
        return this.gameSessionFromAWSGameSession(updateGameSession)

    }

    static mapTeams(awsTeams: { items: (AWSTeam | null)[] } | null | undefined): Array<ITeam> {
        if (isNullOrUndefined(awsTeams) || isNullOrUndefined(awsTeams.items)) {
            return []
        }

        return awsTeams.items.map(awsTeam => {
            if (isNullOrUndefined(awsTeam)) {
                throw new Error("Team can't be null in the backend.")
            }

            return awsTeam as ITeam
        })
    }

    private static mapQuestions(awsQuestions: Array<AWSQuestion | null>): Array<IQuestion> {
        return awsQuestions.map(awsQuestion => {
            if (isNullOrUndefined(awsQuestion)) {
                throw new Error("Question cannot be null.")
            }
            const question: IQuestion = {
                id: awsQuestion.id,
                text: awsQuestion.text,
                choices: isNullOrUndefined(awsQuestion.choices) ? [] : awsQuestion.choices,
                imageUrl: awsQuestion.imageUrl,
                instructions: isNullOrUndefined(awsQuestion.instructions) ? [] : awsQuestion.instructions,
                standard: awsQuestion.standard,
                cluster: awsQuestion.cluster,
                domain: awsQuestion.domain,
                grade: awsQuestion.grade,
                gameSessionId: awsQuestion.gameSessionId,
                order: awsQuestion.order
            }
            return question
        }).sort((lhs, rhs) => {
            return lhs.order - rhs.order
        })
    }
}

class TeamParser {

    static teamFromCreateTeamSubscription(subscription: OnCreateTeamSubscription): ITeam {
        const createTeam = subscription.onCreateTeam
        if (isNullOrUndefined(createTeam)) {
            throw new Error("subscription.teamFromCreateTeamSubscription can't be null.")
        }
        //@ts-ignore
        return this.teamFromAWSTeam(createTeam)
    }

    static teamFromDeleteTeamSubscription(subscription: OnDeleteTeamSubscription): ITeam {
        const deleteTeam = subscription.onDeleteTeam
        if (isNullOrUndefined(deleteTeam)) {
            throw new Error("subscription.teamFromDeleteTeamSubscription can't be null.")
        }
        //@ts-ignore
        return this.teamFromAWSTeam(deleteTeam)
    }

    static teamFromAWSTeam(awsTeam: AWSTeam): ITeam {
        const {
            id,
            name,
            trickiestAnswerIDs,
            teamMembers,
            score,
            createdAt,
            updatedAt,
            gameSessionTeamsId,
            teamQuestionId,
            teamQuestionGameSessionId

        } = awsTeam || {}

        if (
            isNullOrUndefined(id)
        ) {
            throw new Error("Team has null field for the attributes that are not nullable")
        }

        const team: ITeam = {
            id,
            name,
            trickiestAnswerIDs,
            teamMembers,
            score,
            createdAt,
            updatedAt,
            gameSessionTeamsId,
            teamQuestionId,
            teamQuestionGameSessionId
        }
        return team
    }


    static mapTeamMembers(awsTeamMembers: Array<AWSTeamMember | null>): Array<ITeamMember> {
        if (isNullOrUndefined(awsTeamMembers)) {
            return []
        }

        return awsTeamMembers.map(awsTeamMember => {
            if (isNullOrUndefined(awsTeamMember)) {
                throw new Error("Team can't be null in the backend.")
            }
            return awsTeamMember as ITeamMember
        })
    }
}


class TeamMemberParser {

    static teamMemberFromTeamMemberSubscription(subscription: OnUpdateTeamMemberSubscription): ITeamMember {
        const updateTeamMember = subscription.onUpdateTeamMember
        if (isNullOrUndefined(updateTeamMember)) {
            throw new Error("subscription.onUpdateGameSession can't be null.")
        }
        //@ts-ignore
        return this.teamMemberFromAWSTeamMember(updateTeamMember)
    }

    static teamMemberFromAWSTeamMember(awsTeamMember: AWSTeamMember): ITeamMember {
        const {
            id,
            isFacilitator,
            answers,
            deviceId,
            createdAt,
            updatedAt,
            teamTeamMembersId

        } = awsTeamMember || {}

        if (
            isNullOrUndefined(id) ||
            isNullOrUndefined(teamTeamMembersId)

        ) {
            throw new Error("Team member has null field for the attributes that are not nullable")
        }

        const teamMember: ITeamMember = {
            id,
            isFacilitator,
            answers,
            deviceId,
            createdAt,
            updatedAt,
            teamTeamMembersId
        }
        return teamMember
    }
}


class TeamAnswerParser {
    static teamAnswerFromTeamAnswerSubscription(subscription: OnCreateTeamAnswerSubscription): ITeamAnswer {
        const createTeamAnswer = subscription.onCreateTeamAnswer
        if (isNullOrUndefined(onCreateTeamAnswer)) {
            throw new Error("subscription.onCreateTeamAnswer can't be null.")
        }
        //@ts-ignore
        return this.teamAnswerFromAWSTeamAnswer(createTeamAnswer)
    }

    static teamAnswerFromAWSTeamAnswer(awsTeamAnswer: AWSTeamAnswer): ITeamAnswer {
        const {

            id,
            questionId,
            isChosen,
            text,
            createdAt,
            updatedAt,
            teamMemberAnswersId,

        } = awsTeamAnswer || {}

        if (
            isNullOrUndefined(id) ||
            isNullOrUndefined(teamMemberAnswersId)

        ) {
            throw new Error("Team answer has null field for the attributes that are not nullable")
        }

        const teamAnswer: ITeamAnswer = {
            id,
            questionId,
            isChosen,
            text,
            createdAt,
            updatedAt,
            teamMemberAnswersId
        }
        return teamAnswer
    }

}

function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined
}