import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IGameQuestionAPIClient } from "./interfaces";
import { IGameQuestions, AWSGameQuestions } from "../Models";
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
import { isNullOrUndefined } from "../IApiClient";

export class GameQuestionsAPIClient
  extends BaseAPIClient
  implements IGameQuestionAPIClient
{
  async createGameQuestions(
    createGameQuestionsInput: CreateGameQuestionsInput
): Promise<IGameQuestions | null> {
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
    return gameQuestions.data.createGameQuestions as IGameQuestions;
}

async getGameQuestions(id: string): Promise<IGameQuestions | null> {
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
    return result.data.getGameQuestions as IGameQuestions;
}

async deleteGameQuestion(id: string): Promise<IGameQuestions | null> {
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
    return gameQuestions.data.deleteGameQuestions as IGameQuestions;
}

async listGameQuestions(limit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestions[], nextToken: string } | null> {
    let result = (await API.graphql(
        graphqlOperation(listGameQuestions, {limit, nextToken })
    )) as { data: any }
    const parsedGameQuestions = result.data.listGameQuestions.items.map((gameQuestions: AWSGameQuestions) => {
        return gameQuestions as IGameQuestions;
    });
    const parsedNextToken = result.data.listGameQuestions.nextToken;
    
    return { gameQuestions: parsedGameQuestions, nextToken: parsedNextToken };
}
}