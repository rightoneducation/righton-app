import { BaseAPIClient, PublicPrivateType } from "../BaseAPIClient";
import { IGameQuestionsAPIClient, GameQuestionType, gameQuestionRuntimeMap } from "./interfaces";
import { IGameQuestion, AWSGameQuestion } from "../../Models";
import { GameQuestionParser } from "../../Parsers/GameQuestionParser";
import { isNullOrUndefined } from "../../global";

export class GameQuestionsAPIClient extends BaseAPIClient implements IGameQuestionsAPIClient {
    async createGameQuestions<T extends PublicPrivateType>(
        type: T,
        input: GameQuestionType<T>['create']['input']
    ): Promise<IGameQuestion> {

        // use abridged versions of the mutations here
        // to avoid null errors from the API when it tries to return deeply nested elements with orphaned data

        const customCreatePublicGameQuestions = /* GraphQL */ `
            mutation CreatePublicGameQuestions(
                $input: CreatePublicGameQuestionsInput!
                $condition: ModelPublicGameQuestionsConditionInput
            ) {
                createPublicGameQuestions(input: $input, condition: $condition) {
                    id
                    publicGameTemplateID
                    publicQuestionTemplateID
                    publicGameTemplate {
                        id
                        userId
                        publicPrivateType
                        finalPublicPrivateType
                        title
                        lowerCaseTitle
                        version
                        description
                        lowerCaseDescription
                        ccss
                        ccssDescription
                        domain
                        cluster
                        grade
                        gradeFilter
                        standard
                        phaseOneTime
                        phaseTwoTime
                        imageUrl
                        timesPlayed
                        questionTemplatesCount
                        questionTemplatesOrder
                        createdAt
                        updatedAt
                        type
                        owner
                    }
                    publicQuestionTemplate {
                        id
                        userId
                        publicPrivateType
                        finalPublicPrivateType
                        title
                        lowerCaseTitle
                        version
                        choices
                        instructions
                        answerSettings
                        ccss
                        ccssDescription
                        domain
                        cluster
                        grade
                        gradeFilter
                        standard
                        imageUrl
                        timesPlayed
                        gameTemplatesCount
                        createdAt
                        updatedAt
                        type
                        owner
                    }
                    createdAt
                    updatedAt
                    owner
                }
            }
        `;

        const customCreatePrivateGameQuestions = /* GraphQL */ `
            mutation CreatePrivateGameQuestions(
                $input: CreatePrivateGameQuestionsInput!
                $condition: ModelPrivateGameQuestionsConditionInput
            ) {
                createPrivateGameQuestions(input: $input, condition: $condition) {
                    id
                    privateGameTemplateID
                    privateQuestionTemplateID
                    privateGameTemplate {
                        id
                        userId
                        publicPrivateType
                        finalPublicPrivateType
                        title
                        lowerCaseTitle
                        version
                        description
                        lowerCaseDescription
                        ccss
                        ccssDescription
                        domain
                        cluster
                        grade
                        gradeFilter
                        standard
                        phaseOneTime
                        phaseTwoTime
                        imageUrl
                        timesPlayed
                        questionTemplatesCount
                        questionTemplatesOrder
                        createdAt
                        updatedAt
                        type
                        owner
                    }
                    privateQuestionTemplate {
                        id
                        userId
                        publicPrivateType
                        finalPublicPrivateType
                        title
                        lowerCaseTitle
                        version
                        choices
                        instructions
                        answerSettings
                        ccss
                        ccssDescription
                        domain
                        cluster
                        grade
                        gradeFilter
                        standard
                        imageUrl
                        timesPlayed
                        gameTemplatesCount
                        createdAt
                        updatedAt
                        type
                        owner
                    }
                    createdAt
                    updatedAt
                    owner
                }
            }
        `;

        const customCreateDraftGameQuestions = /* GraphQL */ `
            mutation CreateDraftGameQuestions(
                $input: CreateDraftGameQuestionsInput!
                $condition: ModelDraftGameQuestionsConditionInput
            ) {
                createDraftGameQuestions(input: $input, condition: $condition) {
                    id
                    draftGameTemplateID
                    draftQuestionTemplateID
                    draftGameTemplate {
                        id
                        userId
                        publicPrivateType
                        finalPublicPrivateType
                        title
                        lowerCaseTitle
                        version
                        description
                        lowerCaseDescription
                        ccss
                        ccssDescription
                        domain
                        cluster
                        grade
                        gradeFilter
                        standard
                        phaseOneTime
                        phaseTwoTime
                        imageUrl
                        timesPlayed
                        questionTemplatesCount
                        questionTemplatesOrder
                        publicQuestionIds
                        privateQuestionIds
                        createdAt
                        updatedAt
                        type
                        owner
                    }
                    draftQuestionTemplate {
                        id
                        userId
                        publicPrivateType
                        finalPublicPrivateType
                        title
                        lowerCaseTitle
                        version
                        choices
                        instructions
                        answerSettings
                        ccss
                        ccssDescription
                        domain
                        cluster
                        grade
                        gradeFilter
                        standard
                        imageUrl
                        timesPlayed
                        gameTemplatesCount
                        createdAt
                        updatedAt
                        type
                        owner
                    }
                    createdAt
                    updatedAt
                    owner
                }
            }
        `;

        const createFunctionMap: Partial<Record<PublicPrivateType, string>> = {
            [PublicPrivateType.PUBLIC]: customCreatePublicGameQuestions,
            [PublicPrivateType.PRIVATE]: customCreatePrivateGameQuestions,
            [PublicPrivateType.DRAFT]: customCreateDraftGameQuestions,
        };

        const variables: GameQuestionType<T>['create']['variables'] = { input } as GameQuestionType<T>['create']['variables'];
        const queryFunction = createFunctionMap[type];
        
        if (!queryFunction) {
            throw new Error(`Create operation not supported for type: ${type}`);
        }

        try{
            const gameQuestions = await this.callGraphQL<GameQuestionType<T>['create']['query']>(
                queryFunction, variables
            ) as { data: any };
            let createType = '';
            switch (type) {
                case PublicPrivateType.PRIVATE:
                    createType = `createPrivateGameQuestions`;
                    break;
                case PublicPrivateType.DRAFT:
                    createType = `createDraftGameQuestions`;
                    break;
                case PublicPrivateType.PUBLIC:
                default:
                    createType = `createPublicGameQuestions`;
                    break;
            }
            
            if (isNullOrUndefined(gameQuestions?.data || gameQuestions?.data[createType])) {
                throw new Error(`Failed to create gameQuestions.`);
            }
            return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions?.data[createType] as AWSGameQuestion, type) as IGameQuestion;
          }catch (error) {
            console.error('Error creating game questions:', error);
            throw new Error(`Failed to create gameQuestions: ${error}`);
        }
    }

    async getGameQuestions<T extends PublicPrivateType>(
        type: T,
        id: string
    ): Promise<IGameQuestion> {
        const variables: GameQuestionType<T>['get']['variables'] = { id }
        const { queryFunction } = gameQuestionRuntimeMap[type as keyof typeof gameQuestionRuntimeMap]['get'];
        const result = await this.callGraphQL<GameQuestionType<T>['get']['query']>(
        queryFunction,
        { variables }
        ) as {data: any};
        if (
            isNullOrUndefined(result.data) ||
            isNullOrUndefined(result.data.getGameQuestions)
        ) {
            throw new Error(`Failed to create gameQuestions.`)
        }
        return GameQuestionParser.gameQuestionFromAWSGameQuestion(result.data.getGameQuestions as AWSGameQuestion, type) as IGameQuestion;
    }

    async deleteGameQuestions<T extends PublicPrivateType>(
        type: T,
        id: string
    ): Promise<boolean> {

        // unfortunately, we need to use abridged versions of the mutations here
        // otherwise we get null errors from the API when it tries to return deleted elements

        const customDeletePublicGameQuestions = /* GraphQL */ `
            mutation DeletePublicGameQuestions(
                $input: DeletePublicGameQuestionsInput!
                $condition: ModelPublicGameQuestionsConditionInput
            ) {
                deletePublicGameQuestions(input: $input, condition: $condition) {
                id
                }
            }
        `;

        const customDeletePrivateGameQuestions = /* GraphQL */ `
            mutation DeletePrivateGameQuestions(
                $input: DeletePrivateGameQuestionsInput!
                $condition: ModelPrivateGameQuestionsConditionInput
            ) {
                deletePrivateGameQuestions(input: $input, condition: $condition) {
                id
                }
            }
        `;

        const customDeleteDraftGameQuestions = /* GraphQL */ `
            mutation DeleteDraftGameQuestions(
                $input: DeleteDraftGameQuestionsInput!
                $condition: ModelDraftGameQuestionsConditionInput
            ) {
                deleteDraftGameQuestions(input: $input, condition: $condition) {
                id
                }
            }
        `;

        const deleteFunctionMap: Partial<Record<PublicPrivateType, string>> = {
            [PublicPrivateType.PUBLIC]: customDeletePublicGameQuestions,
            [PublicPrivateType.PRIVATE]: customDeletePrivateGameQuestions,
            [PublicPrivateType.DRAFT]: customDeleteDraftGameQuestions,
        };

        const variables: GameQuestionType<T>['delete']['variables'] = {input: {id}};
        const queryFunction = deleteFunctionMap[type];
        if (!queryFunction) {
            throw new Error(`Delete operation not supported for type: ${type}`);
        }
        const result = await this.callGraphQL<GameQuestionType<T>['delete']['query']>(
            queryFunction,
            variables
        ) as {data: any};
        if (
            isNullOrUndefined(result)
        ) {
            throw new Error(`Failed to delete gameQuestions.`)
        }
        return true;
    }

    async listGameQuestions<T extends PublicPrivateType>(
        type: T, 
        limit: number, 
        nextToken: string | null
    ): Promise<{ gameQuestions: IGameQuestion[], nextToken: string }> {

        // use abridged versions of the queries here
        // to avoid null errors from the API when it tries to return deeply nested elements with orphaned data

        const customListPublicGameQuestions = /* GraphQL */ `
            query ListPublicGameQuestions(
                $filter: ModelPublicGameQuestionsFilterInput
                $limit: Int
                $nextToken: String
            ) {
                listPublicGameQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
                    items {
                        id
                        publicGameTemplateID
                        publicQuestionTemplateID
                        publicGameTemplate {
                            id
                            userId
                            publicPrivateType
                            finalPublicPrivateType
                            title
                            lowerCaseTitle
                            version
                            description
                            lowerCaseDescription
                            ccss
                            ccssDescription
                            domain
                            cluster
                            grade
                            gradeFilter
                            standard
                            phaseOneTime
                            phaseTwoTime
                            imageUrl
                            timesPlayed
                            questionTemplatesCount
                            questionTemplatesOrder
                            publicQuestionIds
                            privateQuestionIds
                            createdAt
                            updatedAt
                            type
                            owner
                        }
                        publicQuestionTemplate {
                            id
                            userId
                            publicPrivateType
                            finalPublicPrivateType
                            title
                            lowerCaseTitle
                            version
                            choices
                            instructions
                            answerSettings
                            ccss
                            ccssDescription
                            domain
                            cluster
                            grade
                            gradeFilter
                            standard
                            imageUrl
                            timesPlayed
                            gameTemplatesCount
                            createdAt
                            updatedAt
                            type
                            owner
                        }
                        createdAt
                        updatedAt
                        owner
                    }
                    nextToken
                }
            }
        `;

        const customListPrivateGameQuestions = /* GraphQL */ `
            query ListPrivateGameQuestions(
                $filter: ModelPrivateGameQuestionsFilterInput
                $limit: Int
                $nextToken: String
            ) {
                listPrivateGameQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
                    items {
                        id
                        privateGameTemplateID
                        privateQuestionTemplateID
                        privateGameTemplate {
                            id
                            userId
                            publicPrivateType
                            finalPublicPrivateType
                            title
                            lowerCaseTitle
                            version
                            description
                            lowerCaseDescription
                            ccss
                            ccssDescription
                            domain
                            cluster
                            grade
                            gradeFilter
                            standard
                            phaseOneTime
                            phaseTwoTime
                            imageUrl
                            timesPlayed
                            questionTemplatesCount
                            questionTemplatesOrder
                            publicQuestionIds
                            privateQuestionIds
                            createdAt
                            updatedAt
                            type
                            owner
                        }
                        privateQuestionTemplate {
                            id
                            userId
                            publicPrivateType
                            finalPublicPrivateType
                            title
                            lowerCaseTitle
                            version
                            choices
                            instructions
                            answerSettings
                            ccss
                            ccssDescription
                            domain
                            cluster
                            grade
                            gradeFilter
                            standard
                            imageUrl
                            timesPlayed
                            gameTemplatesCount
                            createdAt
                            updatedAt
                            type
                            owner
                        }
                        createdAt
                        updatedAt
                        owner
                    }
                    nextToken
                }
            }
        `;

        const customListDraftGameQuestions = /* GraphQL */ `
            query ListDraftGameQuestions(
                $filter: ModelDraftGameQuestionsFilterInput
                $limit: Int
                $nextToken: String
            ) {
                listDraftGameQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
                    items {
                        id
                        draftGameTemplateID
                        draftQuestionTemplateID
                        draftGameTemplate {
                            id
                            userId
                            publicPrivateType
                            finalPublicPrivateType
                            title
                            lowerCaseTitle
                            version
                            description
                            lowerCaseDescription
                            ccss
                            ccssDescription
                            domain
                            cluster
                            grade
                            gradeFilter
                            standard
                            phaseOneTime
                            phaseTwoTime
                            imageUrl
                            timesPlayed
                            questionTemplatesCount
                            questionTemplatesOrder
                            publicQuestionIds
                            privateQuestionIds
                            createdAt
                            updatedAt
                            type
                            owner
                        }
                        draftQuestionTemplate {
                            id
                            userId
                            publicPrivateType
                            finalPublicPrivateType
                            title
                            lowerCaseTitle
                            version
                            choices
                            instructions
                            answerSettings
                            ccss
                            ccssDescription
                            domain
                            cluster
                            grade
                            gradeFilter
                            standard
                            imageUrl
                            timesPlayed
                            gameTemplatesCount
                            createdAt
                            updatedAt
                            type
                            owner
                        }
                        createdAt
                        updatedAt
                        owner
                    }
                    nextToken
                }
            }
        `;

        const listFunctionMap: Partial<Record<PublicPrivateType, string>> = {
            [PublicPrivateType.PUBLIC]: customListPublicGameQuestions,
            [PublicPrivateType.PRIVATE]: customListPrivateGameQuestions,
            [PublicPrivateType.DRAFT]: customListDraftGameQuestions,
        };

        const variables: GameQuestionType<T>['list']['variables'] = { limit, nextToken };
        const queryFunction = listFunctionMap[type];

        if (!queryFunction) {
            throw new Error(`List operation not supported for type: ${type}`);
        }

        let result = await this.callGraphQL<GameQuestionType<T>['list']['query']>(
            queryFunction,
            { variables }
        ) as { data: any };

        let listType = '';
        switch (type) {
            case PublicPrivateType.PRIVATE:
                listType = `listPrivateGameQuestions`;
                break;
            case PublicPrivateType.DRAFT:
                listType = `listDraftGameQuestions`;
                break;
            case PublicPrivateType.PUBLIC:
            default:
                listType = `listPublicGameQuestions`;
                break;
        }

        const parsedGameQuestions = result.data[listType].items.map((gameQuestions: AWSGameQuestion) => {
            return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions, type) as IGameQuestion;
        });
        const parsedNextToken = result.data[listType].nextToken;

        return { gameQuestions: parsedGameQuestions, nextToken: parsedNextToken };

    }
}