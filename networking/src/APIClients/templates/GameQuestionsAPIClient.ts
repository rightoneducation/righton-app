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
        const variables: GameQuestionType<T>['create']['variables'] = { input } as GameQuestionType<T>['create']['variables'];
        const { queryFunction } = gameQuestionRuntimeMap[type]['create'];
        try{
            const gameQuestions = await this.callGraphQL<GameQuestionType<T>['create']['query']>(
                queryFunction, variables
            ) as { data: any };
        
            const createType = `create${type}GameQuestions`;
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
        const { queryFunction } = gameQuestionRuntimeMap[type]['get'];
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
                $input: DeleteDraftGameDraftQuestionsInput!
                $condition: ModelDraftGameDraftQuestionsConditionInput
            ) {
                deleteDraftGameDraftQuestions(input: $input, condition: $condition) {
                id
                }
            }
        `;

        const customDeleteDraftGamePublicQuestions = /* GraphQL */ `
            mutation DeleteDraftGamePublicQuestions(
                $input: DeleteDraftGamePublicQuestionsInput!
                $condition: ModelDraftGamePublicQuestionsConditionInput
            ) {
                deleteDraftGamePublicQuestions(input: $input, condition: $condition) {
                id
                }
            }
        `;

        const customDeleteDraftGamePrivateQuestions = /* GraphQL */ `
            mutation DeleteDraftGamePrivateQuestions(
                $input: DeleteDraftGamePrivateQuestionsInput!
                $condition: ModelDraftGamePrivateQuestionsConditionInput
            ) {
                deleteDraftGamePrivateQuestions(input: $input, condition: $condition) {
                id
                }
            }
        `;

        const deleteFunctionMap: Record<PublicPrivateType, string> = {
            [PublicPrivateType.PUBLIC]: customDeletePublicGameQuestions,
            [PublicPrivateType.PRIVATE]: customDeletePrivateGameQuestions,
            [PublicPrivateType.DRAFT]: customDeleteDraftGameQuestions,
            [PublicPrivateType.DRAFT_PUBLIC]: customDeleteDraftGamePublicQuestions,
            [PublicPrivateType.DRAFT_PRIVATE]: customDeleteDraftGamePrivateQuestions,
        };

        const variables: GameQuestionType<T>['delete']['variables'] = {input: {id}};
        const queryFunction = deleteFunctionMap[type];
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
        const variables: GameQuestionType<T>['list']['variables'] = { limit, nextToken };
        const { queryFunction } = gameQuestionRuntimeMap[type]['list'];
        let result = await this.callGraphQL<GameQuestionType<T>['list']['query']>(
            queryFunction,
            { variables }
        ) as { data: any };
        const parsedGameQuestions = result.data.listGameQuestions.items.map((gameQuestions: AWSGameQuestion) => {
            return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions, type) as IGameQuestion;
        });
        const parsedNextToken = result.data.listGameQuestions.nextToken;

        return { gameQuestions: parsedGameQuestions, nextToken: parsedNextToken };

    }
}