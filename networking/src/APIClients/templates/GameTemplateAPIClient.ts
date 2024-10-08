import { BaseAPIClient, PublicPrivateType, GradeTarget } from "../BaseAPIClient";
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
  async createGameTemplate<T extends PublicPrivateType>( 
    type: T,
    createGameTemplateInput: GameTemplateType<T>['create']['input'] | IGameTemplate
  ): Promise<IGameTemplate> {
    const variables: GraphQLOptions = { input: createGameTemplateInput as GameTemplateType<T>['create']['input']};
    const queryFunction = gameTemplateRuntimeMap[type].create.queryFunction;
    const createType = `create${type}GameTemplate`;
    const gameTemplate = await this.callGraphQL<GameTemplateType<T>['create']['query']>(
        queryFunction,
        variables
    ) as { data: any};
    if (
        isNullOrUndefined(gameTemplate?.data)
    ) {
        throw new Error(`Failed to create game template.`)
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data[createType] as AWSGameTemplate, type)
  } 

  async getGameTemplate<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<IGameTemplate> {
    try{
      const queryFunction = gameTemplateRuntimeMap[type].get.queryFunction;
      const getType = `get${type}GameTemplate`;
      const result = await this.callGraphQL<GameTemplateType<T>['get']['query']>(
        queryFunction,
        { id } as unknown as GraphQLOptions
      ) as { data: any };
      console.log(result);
      if (
        isNullOrUndefined(result?.data)
      ) {
        throw new Error(`Failed to get game template`)
      }
      return GameTemplateParser.gameTemplateFromAWSGameTemplate(result.data[getType] as AWSGameTemplate, type);
    } catch (e) {
      console.log(e);
    }
    return GameTemplateParser.gameTemplateFromAWSGameTemplate({} as AWSGameTemplate, type);
  }

  async updateGameTemplate<T extends PublicPrivateType>(
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
    return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate.data.updateGameTemplate as AWSGameTemplate, type);
  }

  async deleteGameTemplate<T extends PublicPrivateType>(
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

  async listGameTemplates<T extends PublicPrivateType>(
    type: T,
    limit: number, 
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.default;
    const awsType = `${type}GameTemplate`;
    const queryName = `list${type}GameTemplates`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, queryName, queryFunction, type, gradeTargets); 
    return response as { gameTemplates: IGameTemplate[]; nextToken: string; };
  }

  async listGameTemplatesByDate<T extends PublicPrivateType>(
    type: T,
    limit: number, 
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.byDate;
    const awsType = `${type}GameTemplate`;
    const queryName = `${type.toLowerCase()}GameTemplatesByDate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, queryName, queryFunction, type, gradeTargets);
    return response as { gameTemplates: IGameTemplate[]; nextToken: string; };
  }

  async listGameTemplatesByGrade<T extends PublicPrivateType>(
    type: T,
    limit: number, 
    nextToken: string | null, 
    sortDirection: string | null, 
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.byGrade;
    const awsType = `${type}GameTemplate`;
    const queryName = `${type.toLowerCase()}GameTemplatesByGrade`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, queryName, queryFunction, type, gradeTargets);
    return response as { gameTemplates: IGameTemplate[]; nextToken: string; }; 
  }

  async listGameTemplatesByQuestionTemplatesCount<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null, 
    sortDirection: string | null,  
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    const queryFunction = gameTemplateRuntimeMap[type].list.queryFunction.byQuestionTemplatesCount;
    const awsType = `${type}GameTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}GameTemplatesByDate`, queryFunction, type, gradeTargets);
    return response as { gameTemplates: IGameTemplate[]; nextToken: string; };
  }
}