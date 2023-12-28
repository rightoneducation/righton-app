import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IGameTemplateAPIClient } from "./interfaces";
import { IGameTemplate } from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { 
  createGameTemplate,
  getGameTemplate,
  updateGameTemplate,
  deleteGameTemplate,
  listGameTemplates 
} from "../graphql";
import { 
  CreateGameTemplateInput, 
  CreateGameTemplateMutation, 
  CreateGameTemplateMutationVariables, 
  GetGameTemplateQuery,
  GetGameTemplateQueryVariables,
  UpdateGameTemplateInput, 
  UpdateGameTemplateMutation, 
  UpdateGameTemplateMutationVariables,
  DeleteGameTemplateInput,
  DeleteGameTemplateMutation,
  DeleteGameTemplateMutationVariables
} from "../AWSMobileApi";
import { AWSGameTemplate } from "../Models";
import { isNullOrUndefined } from "../IApiClient";

export class GameTemplateAPIClient
  extends BaseAPIClient
  implements IGameTemplateAPIClient
{
  async createGameTemplate( 
    createGameTemplateInput: CreateGameTemplateInput
  ): Promise<IGameTemplate | null> {
    const variables: CreateGameTemplateMutationVariables = { input: createGameTemplateInput }
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

  async getGameTemplate(id: string): Promise<IGameTemplate | null> {
    const variables: GetGameTemplateQueryVariables = { id }
    const result = await this.callGraphQL<GetGameTemplateQuery>(
      getGameTemplate,
      { variables }
    )
    if (
      isNullOrUndefined(result.data) ||
      isNullOrUndefined(result.data.getGameTemplate)
    ) {
      throw new Error(`Failed to get game template`)
    }  
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(result.data.getGameTemplate as AWSGameTemplate);
  }

  async updateGameTemplate(updateGameTemplateInput: UpdateGameTemplateInput): Promise<IGameTemplate | null> {
    const input: UpdateGameTemplateInput = updateGameTemplateInput;
    const variables: UpdateGameTemplateMutationVariables = { input };
    const gameTemplate = await this.callGraphQL<UpdateGameTemplateMutation>(
        updateGameTemplate,
        variables
    );
    if (
        isNullOrUndefined(gameTemplate.data) ||
        isNullOrUndefined(gameTemplate.data.updateGameTemplate)
    ) {
        throw new Error(`Failed to update game template`);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.updateGameTemplate as AWSGameTemplate);
  }

  async deleteGameTemplate(id: string): Promise<IGameTemplate | null> {
    const input: DeleteGameTemplateInput = {id};
    const variables: DeleteGameTemplateMutationVariables = { input };
    const gameTemplate = await this.callGraphQL<DeleteGameTemplateMutation>(
        deleteGameTemplate,
        variables
    );
    if (
        isNullOrUndefined(gameTemplate.data) ||
        isNullOrUndefined(gameTemplate.data.deleteGameTemplate)
    ) {
        throw new Error(`Failed to delete game template`);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.deleteGameTemplate as AWSGameTemplate);
  }

  async listGameTemplates(limit: number, nextToken: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    let result = (await API.graphql(
        graphqlOperation(listGameTemplates, {limit, nextToken})
    )) as { data: any }
    const parsedGameTemplates = result.data.listGameTemplates.items.map((gameTemplate: AWSGameTemplate) => {
      console.log(gameTemplate);
        return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate)
    });
    const parsedNextToken = result.data.listGameTemplates.nextToken;
    return { gameTemplates: parsedGameTemplates, nextToken: parsedNextToken };
  }
}