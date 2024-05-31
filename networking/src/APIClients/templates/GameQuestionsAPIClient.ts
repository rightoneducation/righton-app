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
        console.log(variables);
        const gameQuestions = await this.callGraphQL<GameQuestionType<T>['create']['query']>(
            queryFunction, variables
        ) as { data: any };

        if (isNullOrUndefined(gameQuestions?.data) || isNullOrUndefined(gameQuestions?.data.createGameQuestions)) {
            throw new Error(`Failed to create gameQuestions.`);
        }
        return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions.data.createGameQuestions as AWSGameQuestion) as IGameQuestion;
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
        return GameQuestionParser.gameQuestionFromAWSGameQuestion(result.data.getGameQuestions as AWSGameQuestion) as IGameQuestion;
    }

    async deleteGameQuestions<T extends PublicPrivateType>(
        type: T,
        id: string
    ): Promise<boolean> {
        const variables: GameQuestionType<T>['delete']['variables'] = {input: {id}};
        const { queryFunction } = gameQuestionRuntimeMap[type]['get'];
        const result = await this.callGraphQL<GameQuestionType<T>['delete']['query']>(
            queryFunction,
            variables
        ) as {data: any};
        if (
            isNullOrUndefined(result.data) ||
            isNullOrUndefined(result.data.deleteGameQuestions)
        ) {
            throw new Error(`Failed to delete gameQuestions.`)
        }
        return (!isNullOrUndefined(result));
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
            return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions) as IGameQuestion;
        });
        const parsedNextToken = result.data.listGameQuestions.nextToken;

        return { gameQuestions: parsedGameQuestions, nextToken: parsedNextToken };

    }
}