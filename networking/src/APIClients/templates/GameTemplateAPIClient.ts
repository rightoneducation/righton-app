import { BaseAPIClient } from "../BaseAPIClient";
import { IGameTemplateAPIClient } from "./interfaces";
import { IGameTemplate } from "../../Models";
import { GameTemplateParser } from "../../Parsers/GameTemplateParser";
import { 
  createGameTemplate,
  getGameTemplate,
  updateGameTemplate,
  deleteGameTemplate,
  listGameTemplates,
  gameTemplatesByDate,
  gameTemplatesByGrade,
  gameTemplatesByQuestionTemplatesCount
} from "../../graphql";
import { 
  CreateGameTemplateInput, 
  CreateGameTemplateMutation, 
  GetGameTemplateQuery,
  UpdateGameTemplateInput, 
  UpdateGameTemplateMutation, 
  UpdateGameTemplateMutationVariables,
  DeleteGameTemplateInput,
  DeleteGameTemplateMutation,
  DeleteGameTemplateMutationVariables
} from "../../AWSMobileApi";
import { AWSGameTemplate } from "../../Models";
import { isNullOrUndefined } from "../../global";
import { GraphQLOptions } from "../BaseAPIClient";

export class GameTemplateAPIClient
  extends BaseAPIClient
  implements IGameTemplateAPIClient
{
  async createGameTemplate( 
    createGameTemplateInput: CreateGameTemplateInput
  ): Promise<IGameTemplate> {
    const variables: GraphQLOptions = { input: createGameTemplateInput as CreateGameTemplateInput }
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

  async getGameTemplate(id: string): Promise<IGameTemplate> {
    try{
      const result = await this.callGraphQL<GetGameTemplateQuery>(
        getGameTemplate,
        { id } as unknown as GraphQLOptions
      )
      if (
        isNullOrUndefined(result.data) ||
        isNullOrUndefined(result.data.getGameTemplate)
      ) {
        throw new Error(`Failed to get game template`)
      }
      return GameTemplateParser.gameTemplateFromAWSGameTemplate(result.data.getGameTemplate as AWSGameTemplate);
    } catch (e) {
      console.log(e);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate({} as AWSGameTemplate);
  }

  async updateGameTemplate(updateGameTemplateInput: UpdateGameTemplateInput): Promise<IGameTemplate> {
    const input: UpdateGameTemplateInput = updateGameTemplateInput as UpdateGameTemplateInput;
    const variables: UpdateGameTemplateMutationVariables = { input };
    const gameTemplate = await this.callGraphQL<UpdateGameTemplateMutation>(
        updateGameTemplate,
        variables as unknown as GraphQLOptions
    );
    if (
        isNullOrUndefined(gameTemplate.data) ||
        isNullOrUndefined(gameTemplate.data.updateGameTemplate)
    ) {
        throw new Error(`Failed to update game template`);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.updateGameTemplate as AWSGameTemplate);
  }

  async deleteGameTemplate(id: string): Promise<boolean> {
    const input: DeleteGameTemplateInput = {id};
    const variables: DeleteGameTemplateMutationVariables = { input };
    const result = await this.callGraphQL<DeleteGameTemplateMutation>(
        deleteGameTemplate,
        variables as unknown as GraphQLOptions
    );
    // if return is true, the delete was successful
    return (!isNullOrUndefined(result));
  }

  async listGameTemplates(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", listGameTemplates, "listGameTemplates"); 
    return response;
  }

  async listGameTemplatesByDate(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", gameTemplatesByDate, "gameTemplatesByDate");
    return response;
  }

  async listGameTemplatesByGrade(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", gameTemplatesByGrade, "gameTemplatesByGrade");
    return response; 
  }

  async listGameTemplatesByQuestionTemplatesCount(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", gameTemplatesByQuestionTemplatesCount, "gameTemplatesByQuestionTemplatesCount");
    return response;
  }
}