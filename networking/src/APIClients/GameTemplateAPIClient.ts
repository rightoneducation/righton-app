import { BaseAPIClient } from "./BaseAPIClient";
import { IGameTemplateAPIClient } from "./interfaces";
import { IGameTemplate } from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { 
  createGameTemplate,
  getGameTemplate,
  updateGameTemplate,
  deleteGameTemplate,
  listGameTemplates,
  gameTemplatesByDate,
  gameTemplatesByGrade,
  gameTemplatesByQuestionTemplatesCount
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
import { isNullOrUndefined, doesObjectHaveDate } from "../global";

export class GameTemplateAPIClient
  extends BaseAPIClient
  implements IGameTemplateAPIClient
{
  async createGameTemplate( 
    createGameTemplateInput: CreateGameTemplateInput | IGameTemplate
  ): Promise<IGameTemplate> {
    if (doesObjectHaveDate(createGameTemplateInput) && createGameTemplateInput.createdAt && createGameTemplateInput.updatedAt) {
      createGameTemplateInput = {
        ...createGameTemplateInput,
        createdAt: createGameTemplateInput.createdAt,
        updatedAt: createGameTemplateInput.updatedAt
      }
    }
    const variables: CreateGameTemplateMutationVariables = { input: createGameTemplateInput as CreateGameTemplateInput }
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

  async updateGameTemplate(updateGameTemplateInput: UpdateGameTemplateInput | IGameTemplate): Promise<IGameTemplate> {
    if (doesObjectHaveDate(updateGameTemplateInput) && updateGameTemplateInput.createdAt && updateGameTemplateInput.updatedAt) {
      updateGameTemplateInput = {
        ...updateGameTemplateInput,
        createdAt: updateGameTemplateInput.createdAt,
        updatedAt: updateGameTemplateInput.updatedAt
      }
    }
    const input: UpdateGameTemplateInput = updateGameTemplateInput as UpdateGameTemplateInput;
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

  async deleteGameTemplate(id: string): Promise<IGameTemplate> {
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

  async listGameTemplates(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", listGameTemplates, "listGameTemplates");
  }

  async listGameTemplatesByDate(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", gameTemplatesByDate, "gameTemplatesByDate");
  }

  async listGameTemplatesByGrade(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", gameTemplatesByGrade, "gameTemplatesByGrade");
  }

  async listGameTemplatesByQuestionTemplatesCount(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", gameTemplatesByQuestionTemplatesCount, "gameTemplatesByQuestionTemplatesCount");
  }
}