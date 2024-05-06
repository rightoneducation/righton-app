import { IGameSession } from "../../Models";
import { GameSessionParser } from "../../Parsers/GameSessionParser";
import { BaseAPIClient, HTTPMethod, GraphQLOptions } from "../BaseAPIClient";
import {
  createGameSessionFromTemplate,
  gameSessionByCode,
  getGameSession,
  onGameSessionUpdatedById,
  updateGameSession,
} from "../../graphql";
import {
  OnGameSessionUpdatedByIdSubscription,
  CreateGameSessionFromTemplateMutationVariables,
  UpdateGameSessionInput,
  UpdateGameSessionMutation,
  UpdateGameSessionMutationVariables,
} from "../../AWSMobileApi";
import { isNullOrUndefined } from "../../global";
import { IGameSessionAPIClient } from "./interfaces/IGameSessionAPIClient";

export class GameSessionAPIClient
  extends BaseAPIClient
  implements IGameSessionAPIClient
{

  async createGameSessionFromTemplate(id: string): Promise<string | null> {
    let variables: CreateGameSessionFromTemplateMutationVariables = {
      input: { gameTemplateId: id },
    };
    try {      
        const response = await this.mutateGraphQL(createGameSessionFromTemplate, variables) as {data: { createGameSessionFromTemplate: string }};
        const result = response.data.createGameSessionFromTemplate;
        return result;
    } catch (e) {
        console.error(e);
        return null;
    }
  }

  createGameSession(
    gameId: number,
    isAdvancedMode: Boolean
  ): Promise<IGameSession> {
    return fetch(this.endpoint, {
      method: HTTPMethod.Post,
      headers: {
        "content-type": "application/json",
        connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        gameId: gameId,
        isAdvancedMode: isAdvancedMode,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        return GameSessionParser.gameSessionFromAWSGameSession(response);
      });
  }

  async getGameSession(id: string): Promise<IGameSession> {
    let result = (await this.callGraphQL(getGameSession, { id } as unknown as GraphQLOptions) as { data: any });
    return GameSessionParser.gameSessionFromAWSGameSession(
      result.data.getGameSession
    );
  }

  async updateGameSession(
    gameSessionInput: UpdateGameSessionInput
  ): Promise<IGameSession> {
    let variables: UpdateGameSessionMutationVariables = {
      input: gameSessionInput,
    };
    console.log(gameSessionInput);
    console.log(variables);
    console.log('~~~~~~~');
    let result = await this.mutateGraphQL<UpdateGameSessionMutation>(
      updateGameSession,
      variables
    );
    if (result.errors != null) {
      throw new Error(`failed to update game session: ${result.errors}`);
    }

    if (result.data == null) {
      throw new Error("Failed to update the game session");
    }

    return this.mapUpdateGameSessionMutation(result.data);
  }

  subscribeUpdateGameSession(
    id: string,
    callback: (result: IGameSession) => void
  ) {
    return this.subscribeGraphQL<OnGameSessionUpdatedByIdSubscription>(
      {
        query: onGameSessionUpdatedById,
        variables: {
          id: id,
        },
      },
      (value: OnGameSessionUpdatedByIdSubscription) => {
        let gameSession = this.mapOnGameSessionUpdatedByIdSubscription(value);
        callback(gameSession);
      }
    );
  }

  async getGameSessionByCode(gameCode: number): Promise<IGameSession | null> {
    let result = (await this.callGraphQL({ query: gameSessionByCode, variables: {gameCode}})) as { data: any };
    if (
      isNullOrUndefined(result.data) ||
      isNullOrUndefined(result.data.gameSessionByCode) ||
      isNullOrUndefined(result.data.gameSessionByCode.items) ||
      result.data.gameSessionByCode.items.length == 0
    ) {
      return null;
    }
    if (result.data.gameSessionByCode.items.length > 1) {
      throw new Error(`Multiple game sessions exist for ${gameCode}`);
    }
    return GameSessionParser.gameSessionFromAWSGameSession(
      result.data.gameSessionByCode.items[0]
    );
  }

  private mapUpdateGameSessionMutation(
    updateGameSession: UpdateGameSessionMutation
  ): IGameSession {
    return GameSessionParser.gameSessionFromMutation(updateGameSession);
  }

  private mapOnGameSessionUpdatedByIdSubscription(
    subscription: OnGameSessionUpdatedByIdSubscription
  ): IGameSession {
    return GameSessionParser.gameSessionFromSubscriptionById(subscription);
  }

  async groupHints(
    hints: string[],
    questionText: string,
    correctAnswer: string
  ):Promise<string> {
      try { 
      const attempt = fetch(this.hintEndpoint, {
          method: HTTPMethod.Post,
          headers: {
              "content-type": "application/json",
              connection: "close",
              "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
              hints: hints,
              questionText: questionText,
              correctAnswer: correctAnswer
          }),
      })
      .then((response) => {
          if (!response.ok) {
            console.error(response.statusText)
          }
          return response.json()
      })
      
      return attempt;
      } catch (e) {
          console.log(e)
      }
    return "";
  }
}