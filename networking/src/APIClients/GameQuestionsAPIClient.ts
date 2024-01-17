import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IGameQuestionAPIClient } from "./interfaces";
import { IGameQuestion, AWSGameQuestion } from "../Models";
import { 
    createGameQuestions, 
    listGameQuestions,
    getGameQuestions,
    deleteGameQuestions,
 } from "../graphql";
import { 
    CreateGameQuestionsInput, 
    CreateGameQuestionsMutation, 
    CreateGameQuestionsMutationVariables,
    GetGameQuestionsQuery,
    GetGameQuestionsQueryVariables,
    DeleteGameQuestionsMutation,
    DeleteGameQuestionsMutationVariables,
} from "../AWSMobileApi";
import { GameQuestionParser } from "../Parsers/GameQuestionParser";
import { isNullOrUndefined } from "../global";

export class GameQuestionsAPIClient
  extends BaseAPIClient
  implements IGameQuestionAPIClient
{
  async createGameQuestions(
    createGameQuestionsInput: CreateGameQuestionsInput
): Promise<IGameQuestion> {
    const variables: CreateGameQuestionsMutationVariables = { input: createGameQuestionsInput }
    const gameQuestions = await this.callGraphQL<CreateGameQuestionsMutation>(
        createGameQuestions,
        variables
    );
    if (
        isNullOrUndefined(gameQuestions?.data) ||
        isNullOrUndefined(gameQuestions?.data.createGameQuestions)
    ) {
        throw new Error(`Failed to create gameQuestions.`)
    }
    return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions.data.createGameQuestions as AWSGameQuestion) as IGameQuestion;
}

async getGameQuestions(id: string): Promise<IGameQuestion> {
    const variables: GetGameQuestionsQueryVariables = { id }
    const result = await this.callGraphQL<GetGameQuestionsQuery>(
      getGameQuestions,
      { variables }
    )
    if (
        isNullOrUndefined(result.data) ||
        isNullOrUndefined(result.data.getGameQuestions)
    ) {
        throw new Error(`Failed to create gameQuestions.`)
    }
    return GameQuestionParser.gameQuestionFromAWSGameQuestion(result.data.getGameQuestions as AWSGameQuestion) as IGameQuestion;
}

async deleteGameQuestions(id: string): Promise<IGameQuestion> {
    const variables: DeleteGameQuestionsMutationVariables = { input: { id } }
    const gameQuestions = await this.callGraphQL<DeleteGameQuestionsMutation>(
        deleteGameQuestions,
        variables
    );
    if (
        isNullOrUndefined(gameQuestions?.data) ||
        isNullOrUndefined(gameQuestions?.data.deleteGameQuestions)
    ) {
        throw new Error(`Failed to create gameQuestions.`)
    }
    return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions.data.deleteGameQuestions as AWSGameQuestion) as IGameQuestion;
}

async listGameQuestions(limit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestion[], nextToken: string }> {
    let result = (await API.graphql(
        graphqlOperation(listGameQuestions, {limit, nextToken })
    )) as { data: any }
    const parsedGameQuestions = result.data.listGameQuestions.items.map((gameQuestions: AWSGameQuestion) => {
        return GameQuestionParser.gameQuestionFromAWSGameQuestion(gameQuestions) as IGameQuestion;
    });
    const parsedNextToken = result.data.listGameQuestions.nextToken;
    
    return { gameQuestions: parsedGameQuestions, nextToken: parsedNextToken };
}
}