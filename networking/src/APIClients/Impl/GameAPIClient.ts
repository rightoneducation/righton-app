import {
  CreateGameInput,
  CreateGameMutation,
  CreateGameMutationVariables,
  DeleteGameInput,
  DeleteGameMutation,
  DeleteGameMutationVariables,
  GetGameQueryVariables,
  UpdateGameInput,
  UpdateGameMutation,
  UpdateGameMutationVariables,
} from "../../GraphQLAPI";
import { IGame } from "../../Models";
import {
  createGame,
  deleteGame,
  getGame,
  listGames,
  updateGame,
} from "../../graphql";
import { GameParser } from "../../Parsers";
import { GetGameQuery, ListGamesQuery } from "../../GraphQLAPI";
import { IGameAPIClient } from "../IGameAPIClient";
import { BaseGraphQLAPIClient } from "./BaseGraphQLAPIClient";

export class GameAPIClient
  extends BaseGraphQLAPIClient
  implements IGameAPIClient
{
  async listGames(): Promise<Array<IGame>> {
    let result = await this.callGraphQLThrowOnError<ListGamesQuery>(listGames);
    return GameParser.gamesFromAWSGames(result);
  }

  async getGame(id: string): Promise<IGame> {
    const variables: GetGameQueryVariables = { id };
    let result = await this.callGraphQLThrowOnError<GetGameQuery>(
      getGame,
      variables
    );
    return GameParser.gameFromAWSGame(result.getGame);
  }

  async createGame(createGameInput: CreateGameInput): Promise<IGame> {
    let variables: CreateGameMutationVariables = {
      input: createGameInput,
    };
    let result = await this.callGraphQLThrowOnError<CreateGameMutation>(
      createGame,
      variables
    );
    return GameParser.gameFromAWSGame(result.createGame);
  }

  async updateGameByGame(game: IGame): Promise<IGame> {
    return this.updateGameByUpdateGameInput({
      id: game.id,
      title: game.title,
      description: game.description,
      phaseOneTime: game.phaseOneTime,
      phaseTwoTime: game.phaseTwoTime,
      imageUrl: game.imageUrl,
      questions: JSON.stringify(game.questions),
    });
  }

  async updateGameByUpdateGameInput(
    updateGameInput: UpdateGameInput
  ): Promise<IGame> {
    let variables: UpdateGameMutationVariables = {
      input: updateGameInput,
    };
    let result = await this.callGraphQLThrowOnError<UpdateGameMutation>(
      updateGame,
      variables
    );
    return GameParser.gameFromAWSGame(result.updateGame);
  }

  async clone(game: IGame): Promise<IGame> {
    let createGameInput: CreateGameInput = {
      title: game.title,
      description: game.description,
      phaseOneTime: game.phaseOneTime,
      phaseTwoTime: game.phaseTwoTime,
      imageUrl: game.imageUrl,
      questions: JSON.stringify(game.questions),
    };
    let input: CreateGameMutationVariables = {
      input: createGameInput,
    };
    let result = await this.callGraphQLThrowOnError<CreateGameMutation>(
      createGame,
      input
    );

    return GameParser.gameFromAWSGame(result.createGame);
  }

  async deleteGame(id: string): Promise<IGame> {
    let input: DeleteGameInput = { id };
    let variables: DeleteGameMutationVariables = { input };

    let result = await this.callGraphQLThrowOnError<DeleteGameMutation>(
      deleteGame,
      variables
    );
    return GameParser.gameFromAWSGame(result.deleteGame);
  }
}
