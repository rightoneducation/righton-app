import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IGameQuestionsAPIClient } from "./interfaces";
import { IGameQuestions, AWSGameQuestions } from "../Models";
import { createGameQuestions, listGameTemplates } from "../graphql";
import { CreateGameQuestionsInput, CreateGameQuestionsMutation, CreateGameQuestionsMutationVariables } from "../AWSMobileApi";
import { isNullOrUndefined } from "../IApiClient";

export default class GameQuestionsAPIClient
  extends BaseAPIClient
  implements IGameQuestionsAPIClient
{
  async createGameQuestions(
    id: string,
    gameTemplateID: string,
    questionTemplateID: string,
): Promise<IGameQuestions | null> {
    const input: CreateGameQuestionsInput = {
       id,
       gameTemplateID,
       questionTemplateID,
    }
    const variables: CreateGameQuestionsMutationVariables = { input }
    const gameQuestions = await this.callGraphQL<CreateGameQuestionsMutation>(
        createGameQuestions,
        variables
    );
    if (
        isNullOrUndefined(gameQuestions?.data) ||
        isNullOrUndefined(gameQuestions?.data.createGameQuestions)
    ) {
        throw new Error(`Failed to create game template.`)
    }
    return gameQuestions as IGameQuestions;
}

async listGameQuestions(limit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestions[], nextToken: string } | null> {
    let result = (await API.graphql(
        graphqlOperation(listGameTemplates, {limit, nextToken })
    )) as { data: any }
    const parsedGameQuestions = result.data.listGameTemplates.items.map((gameTemplate: AWSGameQuestions) => {
        return gameTemplate as IGameQuestions;
    });
    const parsedNextToken = result.data.listGameTemplates.nextToken;
    
    return { gameQuestions: parsedGameQuestions, nextToken: parsedNextToken };
}
}