import { GraphQLResult, GRAPHQL_AUTH_MODE } from "@aws-amplify/api"
import { Amplify, API, graphqlOperation } from "aws-amplify"
import awsconfig from "./aws-exports"
import {
    ConfidenceLevel,
    CreateGameTemplateInput,
    CreateGameTemplateMutationVariables,
    CreateGameTemplateMutation,
    CreateQuestionTemplateInput,
    CreateQuestionTemplateMutationVariables,
    CreateQuestionTemplateMutation,
    CreateGameQuestionsInput,
    CreateGameQuestionsMutationVariables,
    CreateGameQuestionsMutation,
    CreateTeamAnswerInput, CreateTeamAnswerMutation,
    CreateTeamAnswerMutationVariables, CreateTeamInput,
    CreateTeamMemberInput,
    CreateTeamMemberMutation,
    CreateTeamMemberMutationVariables,
    CreateTeamMutation,
    CreateTeamMutationVariables,
    OnCreateTeamAnswerSubscription,
    OnUpdateTeamAnswerSubscription,
    OnCreateTeamSubscription,
    OnDeleteTeamSubscription,
    OnGameSessionUpdatedByIdSubscription,
    OnUpdateGameSessionSubscription,
    OnUpdateTeamMemberSubscription,
    UpdateGameSessionInput,
    UpdateGameSessionMutation,
    UpdateGameSessionMutationVariables, 
    UpdateTeamAnswerInput, 
    UpdateTeamInput,
    UpdateTeamAnswerMutation, 
    UpdateTeamAnswerMutationVariables, 
    UpdateTeamMutation, 
    UpdateTeamMutationVariables,
    UpdateQuestionInput,
    UpdateQuestionMutation,
    UpdateQuestionMutationVariables,
} from "./AWSMobileApi"
import {
    listGameTemplates,
    listQuestionTemplates,
    createGameSessionFromTemplate,
    gameSessionByCode,
    getGameSession,
    getTeam,
    onCreateTeam,
    onCreateTeamAnswer,
    onDeleteTeam,
    onGameSessionUpdatedById,
    onUpdateTeamMember,
    onUpdateTeamAnswer
} from "./graphql"
import {
    createGameTemplate,
    createQuestionTemplate,
    createGameQuestions,
    createTeam,
    createTeamAnswer,
    createTeamMember,
    updateGameSession,
    updateTeamAnswer,
    updateTeam,
    updateQuestion
} from "./graphql/mutations"
import { IApiClient, isNullOrUndefined } from "./IApiClient"
import { IGameTemplate, IQuestionTemplate, IChoice, IQuestion, ITeamAnswer, ITeamMember } from "./Models"
import { AWSGameSession, AWSGameTemplate, AWSQuestion, AWSQuestionTemplate, AWSTeam, AWSTeamAnswer, AWSTeamMember } from "./Models/AWS"
import { IGameSession } from "./Models/IGameSession"
import { ITeam } from "./Models/ITeam"

Amplify.configure(awsconfig)

export enum Environment {
    Staging = "staging",
    Developing = "developing",
    Testing = "testing"
}

enum HTTPMethod {
    Post = "POST",
}

interface GraphQLOptions {
    input?: object
    variables?: object
    authMode?: GRAPHQL_AUTH_MODE
}

interface SubscriptionValue<T> {
    value: {
        data: T
        errors: Array<any> | null
    }
}

export class ApiClient implements IApiClient {

    async createGameTemplate(
        id: string,
        title: string,
        owner: string,
        version: number,
        description: string,
        domain: string | null,
        cluster: string | null,
        grade: string | null,
        standard: string | null,
        phaseOneTime: number,
        phaseTwoTime: number,
        imageUrl: string
    ): Promise<IGameTemplate | null> {
        const input: CreateGameTemplateInput = {
           id,
           title,
           owner,
           version,
           description,
           domain,
           cluster,
           grade,
           standard,
           phaseOneTime,
           phaseTwoTime,
           imageUrl
        }
        const variables: CreateGameTemplateMutationVariables = { input }
        const gameTemplate = await this.callGraphQL<CreateGameTemplateMutation>(
            createGameTemplate,
            variables
        ) 
        if (
            isNullOrUndefined(gameTemplate.data) ||
            isNullOrUndefined(gameTemplate.data.createGameTemplate)
        ) {
            throw new Error(`Failed to create game template.`)
        }
        return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.createGameTemplate as AWSGameTemplate)
    } 

    async listGameTemplates(limit: number, nextToken: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
        let result = (await API.graphql(
            graphqlOperation(listGameTemplates, {limit, nextToken})
        )) as { data: any }
        const parsedGameTemplates = result.data.listGameTemplates.items.map((gameTemplate: AWSGameTemplate) => {
            return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate)
        });
        const parsedNextToken = result.data.listGameTemplates.nextToken;
        return { gameTemplates: parsedGameTemplates, nextToken: parsedNextToken };
    }
  
    async createQuestionTemplate(inputParams: CreateQuestionTemplateInput): Promise<IQuestionTemplate | null> {
        const variables: CreateQuestionTemplateMutationVariables = {input: inputParams}
        const questionTemplate = await this.callGraphQL<CreateQuestionTemplateMutation>(
            createQuestionTemplate,
            variables
        )
        if (
            isNullOrUndefined(questionTemplate.data) ||
            isNullOrUndefined(questionTemplate.data.createQuestionTemplate)
        ) {
            throw new Error(`Failed to create question template.`)
        }
        return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.createQuestionTemplate as AWSQuestionTemplate)
    }

    async listQuestionTemplates(limit: number, nextToken: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
        try{
        let result = (await API.graphql(
            graphqlOperation(listQuestionTemplates, {limit: limit, nextToken })
        )) as { data: any }
        const parsedQuestionTemplates = result.data.listQuestionTemplates.items.map((questionTemplate: AWSQuestionTemplate) => {
            return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate)
        });
        const parsedNextToken = result.data.listQuestionTemplates.nextToken;
        console.log(result);
        return { questionTemplates: parsedQuestionTemplates, nextToken: parsedNextToken };
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async createGameQuestions(
        id: string,
        gameTemplateID: string,
        questionTemplateID: string,
    ): Promise<IGameTemplate | null> {
        const input: CreateGameQuestionsInput = {
           id,
           gameTemplateID,
           questionTemplateID,
        }
        const variables: CreateGameQuestionsMutationVariables = { input }
        console.log(variables);
        try {
            const gameQuestions = await this.callGraphQL<CreateGameQuestionsMutation>(
                createGameQuestions,
                variables
            )
            console.log('sup');
            if (
                isNullOrUndefined(gameQuestions.data) ||
                isNullOrUndefined(gameQuestions.data.createGameQuestions)
            ) {
                throw new Error(`Failed to create game template.`)
            }
            console.log(gameQuestions);
        } catch (e) {
            console.log(e);
        } 
        return null; // GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.createGameTemplate) as IGameTemplate
    }

    async listGameQuestion(nextToken: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
        let result = (await API.graphql(
            graphqlOperation(listGameTemplates, {limit: 5, nextToken })
        )) as { data: any }
        const parsedGameTemplates = result.data.listGameTemplates.items.map((gameTemplate: AWSGameTemplate) => {
            return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate) as IGameTemplate
        });
        const parsedNextToken = result.data.listGameTemplates.nextToken;
        
        return { gameTemplates: parsedGameTemplates, nextToken: parsedNextToken };
    }

    private endpoint: string

    constructor(env: Environment) {
        this.endpoint = `https://1y2kkd6x3e.execute-api.us-east-1.amazonaws.com/${env}/createGameSession`
    }


    async createGameSessionFromTemplate(id: string): Promise<string | null> {
        try {
            console.log('sup');
            const response = await API.graphql(
                graphqlOperation(createGameSessionFromTemplate, { input: { gameTemplateId: id } })
            ) as { data: { createGameSessionFromTemplate: string } };
            const result = response.data.createGameSessionFromTemplate;
            console.log(result);
            return result;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
    // async createGameSessionFromTemplate(id: string): Promise< IGameSession | null> {
    //     try{
    //         console.log('sup');
    //     let result = (await API.graphql(
    //         graphqlOperation(createGameSessionFromTemplate, { input: { gameTemplateId: id } })
    //     )) as any
    //     console.log(result);
    //     return null; //  GameSessionParser.gameSessionFromAWSGameSession(result)
   
    //     } catch (e) {
    //         console.log(e);
    //         return null;
    //     }
    // }

    createGameSession(
        gameId: number,
        isAdvancedMode: Boolean
    ): Promise<IGameSession> {
        return fetch(this.endpoint, {
            method: HTTPMethod.Post,
            headers: {
                "content-type": "application/json",
                connection: "keep-alive",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                gameId: gameId,
                isAdvancedMode: isAdvancedMode,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
                return response.json()
            })
            .then((response) => {
                return GameSessionParser.gameSessionFromAWSGameSession(response)
            })
    }

    async getGameSession(id: string): Promise<IGameSession> {
        let result = (await API.graphql(
            graphqlOperation(getGameSession, { id })
        )) as { data: any }
        return GameSessionParser.gameSessionFromAWSGameSession(
            result.data.getGameSession
        )
    }

    async getTeam(id: string): Promise<ITeam> {
        let result = (await API.graphql(graphqlOperation(getTeam, { id }))) as {
            data: any
        }
        return TeamParser.teamFromAWSTeam(result.data.getTeam)
    }

    async updateGameSession(
        awsGameSessionInput: UpdateGameSessionInput
    ): Promise<IGameSession> {
        let updateGameSessionInput: UpdateGameSessionInput = awsGameSessionInput
        let variables: UpdateGameSessionMutationVariables = {
            input: updateGameSessionInput,
        }
        let result = await this.callGraphQL<UpdateGameSessionMutation>(
            updateGameSession,
            variables
        )
        if (result.errors != null) {
            throw new Error(`failed to update game session: ${result.errors}`)
        }

        if (result.data == null) {
            throw new Error("Failed to update the game session")
        }

        return this.mapUpdateGameSessionMutation(result.data)
    }

    subscribeUpdateGameSession(
        id: string,
        callback: (result: IGameSession) => void
    ) {
        return this.subscribeGraphQL<OnGameSessionUpdatedByIdSubscription>(
            {
                query: onGameSessionUpdatedById,
                variables: {
                    id: id,
                },
            },
            (value: OnGameSessionUpdatedByIdSubscription) => {
                let gameSession =
                    this.mapOnGameSessionUpdatedByIdSubscription(value)
                callback(gameSession)
            }
        )
    }

    subscribeUpdateTeamMember(
        id: string,
        callback: (result: ITeamMember) => void
    ) {
        return this.subscribeGraphQL<OnUpdateTeamMemberSubscription>(
            {
                query: onUpdateTeamMember,
                variables: {
                    id: id,
                },
            },
            (value: OnUpdateTeamMemberSubscription) => {
                let teamMember = this.mapOnUpdateTeamMemberSubscription(value)
                callback(teamMember)
            }
        )
    }

    subscribeCreateTeam(id: string, callback: (result: ITeam) => void) {
        return this.subscribeGraphQL<OnCreateTeamSubscription>(
            {
                query: onCreateTeam,
                variables: {
                    id: id,
                },
            },
            (value: OnCreateTeamSubscription) => {
                let team = this.mapOnCreateTeamSubscription(value)
                callback(team)
            }
        )
    }

    subscribeDeleteTeam(id: string, callback: (result: ITeam) => void) {
        return this.subscribeGraphQL<OnDeleteTeamSubscription>(
            {
                query: onDeleteTeam,
                variables: {
                    id: id,
                },
            },
            (value: OnDeleteTeamSubscription) => {
                let team = this.mapOnDeleteTeamSubscription(value)
                callback(team)
            }
        )
    }

    subscribeCreateTeamAnswer(
        id: string,
        callback: (result: ITeamAnswer) => void
    ) {
        return this.subscribeGraphQL<OnCreateTeamAnswerSubscription>(
            {
                query: onCreateTeamAnswer,
                variables: {
                    id: id,
                },
            },
            (value: OnCreateTeamAnswerSubscription) => {
                let teamAnswer = this.mapOnCreateTeamAnswerSubscription(value)
                callback(teamAnswer)
            }
        )
    }

    subscribeUpdateTeamAnswer(
        id: string,
        callback: (result: ITeamAnswer) => void
    ) {
        return this.subscribeGraphQL<OnUpdateTeamAnswerSubscription>(
            {
                query: onUpdateTeamAnswer,
                variables: {
                    id: id,
                },
            },
            (value: OnUpdateTeamAnswerSubscription) => {
                let teamAnswer = this.mapOnUpdateTeamAnswerSubscription(value)
                callback(teamAnswer)
            }
        )
    }

    async getGameSessionByCode(gameCode: number): Promise<IGameSession | null> {
        let result = (await API.graphql(
            graphqlOperation(gameSessionByCode, { gameCode })
        )) as { data: any }
        if (
            isNullOrUndefined(result.data) ||
            isNullOrUndefined(result.data.gameSessionByCode) ||
            isNullOrUndefined(result.data.gameSessionByCode.items) ||
            result.data.gameSessionByCode.items.length == 0
        ) {
            return null
        }
        if (result.data.gameSessionByCode.items.length > 1) {
            throw new Error(`Multiple game sessions exist for ${gameCode}`)
        }
        return GameSessionParser.gameSessionFromAWSGameSession(
            result.data.gameSessionByCode.items[0]
        )
    }

    async addTeamToGameSessionId(
        gameSessionId: string,
        name: string,
        questionId: string | null
    ): Promise<ITeam> {
        const input: CreateTeamInput = {
            name,
            score: 0,
            selectedAvatarIndex: 0,
            teamQuestionId: questionId,
            gameSessionTeamsId: gameSessionId,
            teamQuestionGameSessionId: gameSessionId,
        }
        const variables: CreateTeamMutationVariables = { input }
        const team = await this.callGraphQL<CreateTeamMutation>(
            createTeam,
            variables
        )
        if (
            isNullOrUndefined(team.data) ||
            isNullOrUndefined(team.data.createTeam)
        ) {
            throw new Error(`Failed to create team`)
        }
        return TeamParser.teamFromAWSTeam(team.data.createTeam as AWSTeam)
    }

    async addTeamMemberToTeam(
        teamId: string,
        isFacilitator: boolean = false,
        deviceId: string
    ): Promise<ITeamMember> {
        const input: CreateTeamMemberInput = {
            isFacilitator,
            deviceId,
            teamTeamMembersId: teamId,
        }
        const variables: CreateTeamMemberMutationVariables = { input }
        const member = await this.callGraphQL<CreateTeamMemberMutation>(
            createTeamMember,
            variables
        )
        if (
            isNullOrUndefined(member.data) ||
            isNullOrUndefined(member.data.createTeamMember)
        ) {
            throw new Error(`Failed to create team member`)
        }
        return TeamMemberParser.teamMemberFromAWSTeamMember(member.data.createTeamMember as AWSTeamMember)
    }

    async addTeamAnswer(
        teamMemberId: string,
        questionId: string,
        text: string,
        answerContents: string,
        isChosen: boolean = false,
        isTrickAnswer: boolean = false
    ): Promise<ITeamAnswer> {
        const awsAnswerContents = JSON.stringify(answerContents)
        const input: CreateTeamAnswerInput = {
            questionId,
            isChosen,
            isTrickAnswer,
            text, // leaving this in to prevent breaking current build, will be removed when answerContents is finalized
            awsAnswerContents, 
            teamMemberAnswersId: teamMemberId,
            confidenceLevel: ConfidenceLevel.NOT_RATED
        }
        const variables: CreateTeamAnswerMutationVariables = { input }
        const answer = await this.callGraphQL<CreateTeamAnswerMutation>(
            createTeamAnswer,
            variables
        )
        if (
            isNullOrUndefined(answer.data) ||
            isNullOrUndefined(answer.data.createTeamAnswer)
        ) {
            throw new Error(`Failed to create team answer`)
        }
        return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(answer.data.createTeamAnswer) as ITeamAnswer
    }

    async updateTeamAnswer(
        teamAnswerId: string,
        isChosen: boolean | null = null,
        confidenceLevel: ConfidenceLevel
    ): Promise<ITeamAnswer> {
        const input: UpdateTeamAnswerInput = {
            id: teamAnswerId,
            isChosen,
            confidenceLevel
        }
        const variables: UpdateTeamAnswerMutationVariables = { input }
        const answer = await this.callGraphQL<UpdateTeamAnswerMutation>(
            updateTeamAnswer,
            variables
        )
        if (
            isNullOrUndefined(answer.data) ||
            isNullOrUndefined(answer.data.updateTeamAnswer)
        ) {
            throw new Error(`Failed to update team answer`)
        }
        return TeamAnswerParser.teamAnswerFromAWSTeamAnswer(answer.data.updateTeamAnswer) as ITeamAnswer
    }

    async updateTeam(
        teamInput: UpdateTeamInput
    ): Promise<ITeam> {
        const input: UpdateTeamInput = teamInput
        const variables: UpdateTeamMutationVariables = { input }
        const team = await this.callGraphQL<UpdateTeamMutation>(
            updateTeam,
            variables
        )
        if (
            isNullOrUndefined(team.data) ||
            isNullOrUndefined(team.data.updateTeam)
        ) {
            throw new Error(`Failed to update team`)
        }
        return team.data.updateTeam as ITeam
    }

    async updateQuestion(
        questionInput: UpdateQuestionInput    
    ): Promise<IQuestion> {
        const input: UpdateQuestionInput = questionInput
        const variables: UpdateQuestionMutationVariables = { input }
        const question = await this.callGraphQL<UpdateQuestionMutation>(
            updateQuestion,
            variables
        )
        if (
            isNullOrUndefined(question.data) ||
            isNullOrUndefined(question.data.updateQuestion)
        ) {
            throw new Error(`Failed to update question`)
        }
        return question.data.updateQuestion as IQuestion
    }

    // Private methods
    private subscribeGraphQL<T>(
        subscription: any,
        callback: (value: T) => void
    ) {
        //@ts-ignore
        return API.graphql(subscription).subscribe({
            next: (response: SubscriptionValue<T>) => {
                if (!isNullOrUndefined(response.value.errors)) {
                    console.error(response.value.errors)
                }
                callback(response.value.data)
            },
            error: (error: any) => console.warn(error),
        })
    }

    private async callGraphQL<T>(
        query: any,
        options?: GraphQLOptions
    ): Promise<GraphQLResult<T>> {
        return (await API.graphql(
            graphqlOperation(query, options)
        )) as GraphQLResult<T>
    }

    private mapUpdateGameSessionMutation(
        updateGameSession: UpdateGameSessionMutation
    ): IGameSession {
        return GameSessionParser.gameSessionFromMutation(updateGameSession)
    }

    private mapOnGameSessionUpdatedByIdSubscription(
        subscription: OnGameSessionUpdatedByIdSubscription
    ): IGameSession {
        return GameSessionParser.gameSessionFromSubscriptionById(subscription)
    }

    private mapOnCreateTeamSubscription(
        subscription: OnCreateTeamSubscription
    ): ITeam {
        return TeamParser.teamFromCreateTeamSubscription(subscription)
    }

    private mapOnDeleteTeamSubscription(
        subscription: OnDeleteTeamSubscription
    ): ITeam {
        return TeamParser.teamFromDeleteTeamSubscription(subscription)
    }

    private mapOnUpdateTeamMemberSubscription(
        subscription: OnUpdateTeamMemberSubscription
    ): ITeamMember {
        return TeamMemberParser.teamMemberFromTeamMemberSubscription(
            subscription
        )
    }

    private mapOnCreateTeamAnswerSubscription(
        subscription: OnCreateTeamAnswerSubscription
    ): ITeamAnswer {
        return TeamAnswerParser.teamAnswerFromCreateTeamAnswerSubscription(
            subscription
        )
    }

    private mapOnUpdateTeamAnswerSubscription(
        subscription: OnUpdateTeamAnswerSubscription
    ): ITeamAnswer {
        return TeamAnswerParser.teamAnswerFromUpdateTeamAnswerSubscription(
            subscription
        )
    }
}

// ~~~~~~~~~GAMETEMPLATE~~~~~~~~~~~~~~
class GameTemplateParser {
    static gameTemplateFromAWSGameTemplate(
        awsGameTemplate: AWSGameTemplate
    ): IGameTemplate {
        // parse the IQuestionTemplate[] from IModelGameQuestionConnection
       let questionTemplates: IQuestionTemplate[] = [];
        if (!isNullOrUndefined(awsGameTemplate) && !isNullOrUndefined(awsGameTemplate.questionTemplates) && !isNullOrUndefined(awsGameTemplate.questionTemplates.items)) {
            for (const item of awsGameTemplate.questionTemplates.items) {

                if (item && item.questionTemplate) {
                    const { gameTemplates, ...rest } = item.questionTemplate;
        
                    // Only add to questionTemplates if 'rest' is not empty
                    if (Object.keys(rest).length > 0) {
                        questionTemplates.push(rest as IQuestionTemplate);
                    }
                }
            }
        }

        const {
            id,
            title,
            owner,
            version,
            description,
            domain,
            cluster,
            grade,
            standard,
            phaseOneTime,
            phaseTwoTime,
            imageUrl,
            createdAt,
            updatedAt
        } = awsGameTemplate || {}

        if (isNullOrUndefined(id) ||
            isNullOrUndefined(title) ||
            isNullOrUndefined(owner) ||
            isNullOrUndefined(version) ||
            isNullOrUndefined(description) ||
            isNullOrUndefined(phaseOneTime) ||
            isNullOrUndefined(phaseTwoTime) ||
            isNullOrUndefined(imageUrl) ||
            isNullOrUndefined(createdAt) ||
            isNullOrUndefined(updatedAt)) {
            throw new Error(
                "Game Template has null field for the attributes that are not nullable"
            )
        }

        const gameTemplate: IGameTemplate = {
            id,
            title,
            owner,
            version,
            description,
            domain,
            cluster,
            grade,
            standard,
            phaseOneTime,
            phaseTwoTime,
            imageUrl,
            questionTemplates,
            createdAt,
            updatedAt
        }
        return gameTemplate
    }
}

class QuestionTemplateParser {
    static questionTemplateFromAWSQuestionTemplate(
        awsQuestionTemplate: AWSQuestionTemplate
    ): IQuestionTemplate {
        let gameTemplates: IGameTemplate[] = [];
        if (!isNullOrUndefined(awsQuestionTemplate) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates) && !isNullOrUndefined(awsQuestionTemplate.gameTemplates.items)) {
            gameTemplates = awsQuestionTemplate.gameTemplates.items.map((item: any) => {
                const { gameTemplate } = item;
                const { gameTemplates, questionTemplates, ...rest } = gameTemplate;
                return rest as IGameTemplate;
            });
        } 

        const {
            id,
            title,
            owner,
            version,
            choices,
            instructions,
            answerSettings,
            domain,
            cluster,
            grade,
            standard,
            imageUrl,
            createdAt,
            updatedAt
        } = awsQuestionTemplate || {}
        if (isNullOrUndefined(id) ||
            isNullOrUndefined(title) ||
            isNullOrUndefined(owner) ||
            isNullOrUndefined(version) ||
            isNullOrUndefined(choices) ||
            isNullOrUndefined(instructions) ||
            isNullOrUndefined(answerSettings) ||
            isNullOrUndefined(imageUrl) ||
            isNullOrUndefined(createdAt) ||
            isNullOrUndefined(updatedAt)) {
            throw new Error(
                "Question Template has null field for the attributes that are not nullable"
            )
        }

        const questionTemplate: IQuestionTemplate = {
            id,
            title,
            owner,
            version,
            choices,
            instructions,
            answerSettings,
            domain: domain ?? null,
            cluster: cluster ?? null,
            grade: grade ?? null,
            standard: standard ?? null,
            imageUrl,
            gameTemplates,
            createdAt,
            updatedAt
        }
        return questionTemplate
    }
}

export class GameSessionParser {
    static gameSessionFromSubscription(
        subscription: OnUpdateGameSessionSubscription
    ): IGameSession {
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

    static gameSessionFromAWSGameSession(
        awsGameSession: AWSGameSession
    ): IGameSession {
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
            isAdvancedMode,
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
            throw new Error(
                "GameSession has null field for the attributes that are not nullable"
            )
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
            title,
        }
        return gameSession
    }

    static gameSessionFromSubscriptionById(
        subscription: OnGameSessionUpdatedByIdSubscription
    ): IGameSession {
        const updateGameSession = subscription.onGameSessionUpdatedById
        console.log(updateGameSession);
        if (isNullOrUndefined(updateGameSession)) {
            throw new Error("subscription.onUpdateGameSession can't be null.")
        }
        //@ts-ignore
        return this.gameSessionFromAWSGameSession(updateGameSession)
    }

    static mapTeams(
        awsTeams: { items: (AWSTeam | null)[] } | null | undefined
    ): Array<ITeam> {
        if (isNullOrUndefined(awsTeams) || isNullOrUndefined(awsTeams.items)) {
            return []
        }
        return awsTeams.items.map((awsTeam) => {
            if (isNullOrUndefined(awsTeam)) {
                throw new Error("Team can't be null in the backend.")
            }

            const team: ITeam = {
                id: awsTeam.id,
                name: awsTeam.name,
                teamQuestionId: awsTeam.teamQuestionId,
                score: awsTeam.score,
                selectedAvatarIndex: awsTeam.selectedAvatarIndex,
                createdAt: awsTeam.createdAt,
                updatedAt: awsTeam.updatedAt,
                gameSessionTeamsId: awsTeam.gameSessionTeamsId,
                teamQuestionGameSessionId: awsTeam.teamQuestionGameSessionId,
                teamMembers: TeamMemberParser.mapTeamMembers(
                    awsTeam.teamMembers?.items
                ),
            }
            return team
        })
    }

    private static parseServerArray<T>(input: any | T[]): Array<T> {
        if (input instanceof Array) {
            return input as T[]
        } else if (typeof input === "string") {
            return JSON.parse(input as string)
        }
        return []
    }

    private static mapQuestions(
        awsQuestions: Array<AWSQuestion | null>
    ): Array<IQuestion> {
        return awsQuestions
            .map((awsQuestion) => {
                if (isNullOrUndefined(awsQuestion)) {
                    throw new Error("Question cannot be null.")
                }
                const question: IQuestion = {
                    id: awsQuestion.id,
                    text: awsQuestion.text,
                    choices: isNullOrUndefined(awsQuestion.choices)
                        ? []
                        : this.parseServerArray<IChoice>(awsQuestion.choices),
                    responses: [],
                    imageUrl: awsQuestion.imageUrl,
                    instructions: isNullOrUndefined(awsQuestion.instructions)
                        ? []
                        : this.parseServerArray<string>(
                            awsQuestion.instructions
                        ),
                    standard: awsQuestion.standard,
                    cluster: awsQuestion.cluster,
                    domain: awsQuestion.domain,
                    grade: awsQuestion.grade,
                    gameSessionId: awsQuestion.gameSessionId,
                    order: awsQuestion.order,
                    isConfidenceEnabled: awsQuestion.isConfidenceEnabled,
                    isShortAnswerEnabled: awsQuestion.isShortAnswerEnabled,
                    isHintEnabled: awsQuestion.isHintEnabled
                }
                return question
            })
            .sort((lhs, rhs) => {
                return lhs.order - rhs.order
            })
    }
}

class TeamParser {
    static teamFromCreateTeamSubscription(
        subscription: OnCreateTeamSubscription
    ): ITeam {
        const createTeam = subscription.onCreateTeam
        if (isNullOrUndefined(createTeam)) {
            throw new Error(
                "subscription.teamFromCreateTeamSubscription can't be null."
            )
        }
        //@ts-ignore
        return this.teamFromAWSTeam(createTeam)
    }

    static teamFromDeleteTeamSubscription(
        subscription: OnDeleteTeamSubscription
    ): ITeam {
        const deleteTeam = subscription.onDeleteTeam
        if (isNullOrUndefined(deleteTeam)) {
            throw new Error(
                "subscription.teamFromDeleteTeamSubscription can't be null."
            )
        }
        //@ts-ignore
        return this.teamFromAWSTeam(deleteTeam)
    }

    static teamFromAWSTeam(awsTeam: AWSTeam): ITeam {
        const {
            id,
            name,
            teamMembers,
            score,
            selectedAvatarIndex,
            createdAt,
            updatedAt,
            gameSessionTeamsId,
            teamQuestionId,
            teamQuestionGameSessionId,
        } = awsTeam || {}

        if (isNullOrUndefined(id)) {
            throw new Error(
                "Team has null field for the attributes that are not nullable"
            )
        }

        const team: ITeam = {
            id,
            name,
            teamMembers: TeamMemberParser.mapTeamMembers(teamMembers?.items),
            score,
            selectedAvatarIndex,
            createdAt,
            updatedAt,
            gameSessionTeamsId,
            teamQuestionId,
            teamQuestionGameSessionId,
        }
        return team
    }
}

class TeamMemberParser {
    static teamMemberFromTeamMemberSubscription(
        subscription: OnUpdateTeamMemberSubscription
    ): ITeamMember {
        const updateTeamMember = subscription.onUpdateTeamMember
        if (isNullOrUndefined(updateTeamMember)) {
            throw new Error("subscription.onUpdateGameSession can't be null.")
        }
        //@ts-ignore
        return this.teamMemberFromAWSTeamMember(updateTeamMember)
    }

    static mapTeamMembers(
        awsTeamMembers: Array<AWSTeamMember | null> | null | undefined
    ): Array<ITeamMember> {
        if (isNullOrUndefined(awsTeamMembers)) {
            return []
        }

        return awsTeamMembers.map((awsTeamMember) => {
            if (isNullOrUndefined(awsTeamMember)) {
                throw new Error("Team can't be null in the backend.")
            }
            return this.teamMemberFromAWSTeamMember(awsTeamMember)
        })
    }

    static teamMemberFromAWSTeamMember(
        awsTeamMember: AWSTeamMember
    ): ITeamMember {
        const {
            id,
            isFacilitator,
            answers,
            deviceId,
            createdAt,
            updatedAt,
            teamTeamMembersId,
        } = awsTeamMember || {}

        if (isNullOrUndefined(id) || isNullOrUndefined(teamTeamMembersId)) {
            throw new Error(
                "Team member has null field for the attributes that are not nullable"
            )
        }

        const teamMember: ITeamMember = {
            id,
            isFacilitator,
            answers: TeamAnswerParser.mapTeamAnswers(answers?.items),
            deviceId,
            createdAt,
            updatedAt,
            teamTeamMembersId,
        }
        return teamMember
    }
}

class TeamAnswerParser {
    static teamAnswerFromCreateTeamAnswerSubscription(
        subscription: OnCreateTeamAnswerSubscription
    ): ITeamAnswer {
        const createTeamAnswer = subscription.onCreateTeamAnswer
        if (isNullOrUndefined(createTeamAnswer)) {
            throw new Error("subscription.onCreateTeamAnswer can't be null.")
        }
        return this.teamAnswerFromAWSTeamAnswer(createTeamAnswer)
    }

    static teamAnswerFromUpdateTeamAnswerSubscription(
        subscription: OnUpdateTeamAnswerSubscription
    ): ITeamAnswer {
        const updateTeamAnswer = subscription.onUpdateTeamAnswer
        if (isNullOrUndefined(updateTeamAnswer)) {
            throw new Error("subscription.onCreateTeamAnswer can't be null.")
        }
        return this.teamAnswerFromAWSTeamAnswer(updateTeamAnswer)
    }

    static mapTeamAnswers(
        awsTeamAnswers: Array<AWSTeamAnswer | null> | null | undefined
    ): Array<ITeamAnswer> {
        if (isNullOrUndefined(awsTeamAnswers)) {
            return []
        }

        return awsTeamAnswers.map((awsTeamAnswer) => {
            if (isNullOrUndefined(awsTeamAnswer)) {
                throw new Error("Team can't be null in the backend.")
            }
            return this.teamAnswerFromAWSTeamAnswer(awsTeamAnswer)
        })
    }

    static teamAnswerFromAWSTeamAnswer(
        awsTeamAnswer: AWSTeamAnswer
    ): ITeamAnswer {
        const {
            id,
            questionId,
            isChosen,
            isTrickAnswer,
            text,
            awsAnswerContents,
            createdAt,
            updatedAt,
            teamMemberAnswersId,
            confidenceLevel
        } = awsTeamAnswer || {}

        if (isNullOrUndefined(id) ||
            isNullOrUndefined(teamMemberAnswersId) ||
            isNullOrUndefined(questionId) ||
            isNullOrUndefined(text) ||
            isNullOrUndefined(awsAnswerContents)) {
            throw new Error(
                "Team answer has null field for the attributes that are not nullable"
            )
        }

        const teamAnswer: ITeamAnswer = {
            id,
            questionId,
            isChosen,
            isTrickAnswer,
            text,
            answerContents: awsAnswerContents,
            createdAt,
            updatedAt,
            teamMemberAnswersId,
            confidenceLevel
        }
        return teamAnswer
    }
}
