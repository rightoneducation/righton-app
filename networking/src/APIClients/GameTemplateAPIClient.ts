import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IGameTemplateAPIClient } from "./interfaces";
import { IGameTemplate } from "../Models";
import { GameTemplateParser } from "../Parsers/GameTemplateParser";
import { createGameTemplate, listGameTemplates } from "../graphql";
import { CreateGameTemplateInput, CreateGameTemplateMutation, CreateGameTemplateMutationVariables } from "../AWSMobileApi";
import { AWSGameTemplate } from "../Models";
import { isNullOrUndefined } from "../IApiClient";

export default class GameTemplateAPIClient
  extends BaseAPIClient
  implements IGameTemplateAPIClient
{
  async createGameTemplate(
    id: string,
    title: string,
    owner: string,
    version: number,
    description: string,
    domain: string | null,
    cluster: string | null,
    grade: string | null,
    standard: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    imageUrl: string
  ): Promise<IGameTemplate | null> {
    const input: CreateGameTemplateInput = {
      id,
      title,
      owner,
      version,
      description,
      domain,
      cluster,
      grade,
      standard,
      phaseOneTime,
      phaseTwoTime,
      imageUrl
    }
    const variables: CreateGameTemplateMutationVariables = { input }
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

  async listGameTemplates(limit: number, nextToken: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> {
    let result = (await API.graphql(
        graphqlOperation(listGameTemplates, {limit, nextToken})
    )) as { data: any }
    const parsedGameTemplates = result.data.listGameTemplates.items.map((gameTemplate: AWSGameTemplate) => {
        return GameTemplateParser.gameTemplateFromAWSGameTemplate(gameTemplate)
    });
    const parsedNextToken = result.data.listGameTemplates.nextToken;
    return { gameTemplates: parsedGameTemplates, nextToken: parsedNextToken };
  }
}