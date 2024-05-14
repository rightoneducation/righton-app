import { BaseAPIClient } from "../BaseAPIClient";
import { GameTemplateType, gameTemplateRuntimeMap, IGameTemplateAPIClient } from "./interfaces/IGameTemplateAPIClient";
import { IGameTemplate } from "../../Models";
import { GameTemplateParser } from "../../Parsers/GameTemplateParser";
import { AWSGameTemplate } from "../../Models";
import { isNullOrUndefined } from "../../global";
import { GraphQLOptions } from "../BaseAPIClient";

export class GameTemplateAPIClient
  extends BaseAPIClient
  implements IGameTemplateAPIClient
{
  async createGameTemplate<T extends 'public' | 'private'>( 
    type: T,
    createGameTemplateInput: GameTemplateType<T>['create']['input'] | IGameTemplate
  ): Promise<IGameTemplate> {
    const variables: GraphQLOptions = { input: createGameTemplateInput as GameTemplateType<T>['create']['input']};
    const queryFunction = gameTemplateRuntimeMap[type].create.queryFunction;
    const gameTemplate = await this.callGraphQL<GameTemplateType<T>['create']['query']>(
        queryFunction,
        variables
    ) as { data: any};
    if (
        isNullOrUndefined(gameTemplate?.data) ||
        isNullOrUndefined(gameTemplate?.data.createGameTemplate)
    ) {
        throw new Error(`Failed to create game template.`)
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.createGameTemplate as AWSGameTemplate)
  } 

  async getGameTemplate<T extends 'public' | 'private'>(
    type: T,
    id: string
  ): Promise<IGameTemplate> {
    try{
      const queryFunction = gameTemplateRuntimeMap[type].get.queryFunction;
      const result = await this.callGraphQL<GameTemplateType<T>['get']['query']>(
        queryFunction,
        { id } as unknown as GraphQLOptions
      ) as { data: any };
      if (
        isNullOrUndefined(result?.data) ||
        isNullOrUndefined(result?.data.getGameTemplate)
      ) {
        throw new Error(`Failed to get game template`)
      }
      return GameTemplateParser.gameTemplateFromAWSGameTemplate(result.data.getGameTemplate as AWSGameTemplate);
    } catch (e) {
      console.log(e);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate({} as AWSGameTemplate);
  }

  async updateGameTemplate<T extends 'public' | 'private'>(
    type: T,
    updateGameTemplateInput: GameTemplateType<T>['update']['input']
  ): Promise<IGameTemplate> {
    const queryFunction = gameTemplateRuntimeMap[type].update.queryFunction;
    const variables: GameTemplateType<T>['update']['variables'] = { input: updateGameTemplateInput };
    const gameTemplate = await this.callGraphQL<GameTemplateType<T>['update']['query']>(
        queryFunction,
        variables
    ) as {data: any};
    if (
        isNullOrUndefined(gameTemplate?.data) ||
        isNullOrUndefined(gameTemplate?.data.updateGameTemplate)
    ) {
        throw new Error(`Failed to update game template`);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.updateGameTemplate as AWSGameTemplate);
  }

  async deleteGameTemplate<T extends 'public' | 'private'>(
    type: T,
    id: string
  ): Promise<boolean> {
    const queryFunction = gameTemplateRuntimeMap[type].delete.queryFunction;
    const input: GameTemplateType<T>['delete']['input'] = {id};
    const variables: GameTemplateType<T>['delete']['variables'] = { input };
    const result = await this.callGraphQL<GameTemplateType<T>['delete']['query']>(
        queryFunction,
        variables
    ) as {data: any};
    // if return is true, the delete was successful
    return (!isNullOrUndefined(result));
  }

  async listGameTemplates<T extends 'public' | 'private'>(
    type: T,
    limit: number, 
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.default;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", queryFunction, "listGameTemplates"); 
    return response;
  }

  async listGameTemplatesByDate<T extends 'public' | 'private'>(
    type: T,
    limit: number, 
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.byDate;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", queryFunction, "gameTemplatesByDate");
    return response;
  }

  async listGameTemplatesByGrade<T extends 'public' | 'private'>(
    type: T,
    limit: number, 
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.byGrade;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", queryFunction, "gameTemplatesByGrade");
    return response; 
  }

  async listGameTemplatesByQuestionTemplatesCount<T extends 'public' | 'private'>(
    type: T,
    limit: number,
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.byQuestionTemplatesCount;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "GameTemplate", queryFunction, "gameTemplatesByQuestionTemplatesCount");
    return response;
  }
}