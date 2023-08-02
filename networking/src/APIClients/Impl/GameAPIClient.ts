import {
  CreateGameInput,
  CreateGameMutation,
  CreateGameMutationVariables,
  DeleteGameInput,
  DeleteGameMutation,
  DeleteGameMutationVariables,
  CreateGameQuestionInput,
  GetGameQueryVariables,
  UpdateGameInput,
  UpdateGameMutation,
  UpdateGameMutationVariables,
} from "../../GraphQLAPI";
import { IGame, IGameQuestion } from "../../Models";
import { BaseAPIClient } from "./BaseAPIClient";
import { createGame, getGame, listGames, updateGame } from "../../graphql";
import { GameParser } from "../../Parsers";
import { GetGameQuery, ListGamesQuery } from "../../GraphQLAPI";
import { isNullOrUndefined } from "../../IApiClient";
import GameQuestionAPIClient from "./GameQuestionAPIClient";
import IGameAPIClient from "../IGameAPIClient";

export default class GameAPIClient
  extends BaseAPIClient
  implements IGameAPIClient
{
  async listGames(): Promise<Array<IGame>> {
    let result = await this.callGraphQLThrowOnError<ListGamesQuery>(listGames);
    return GameParser.gamesFromAWSGames(result);
  }

  async getGame(id: string): Promise<IGame> {
    const variables: GetGameQueryVariables = { id };
    let result = await this.callGraphQLThrowOnError<GetGameQuery>(getGame, {
      variables,
    });
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

  async updateGame(updateGameInput: UpdateGameInput): Promise<IGame> {
    let variables: UpdateGameMutationVariables = {
      input: updateGameInput,
    };
    let result = await this.callGraphQLThrowOnError<UpdateGameMutation>(
      updateGame,
      {
        variables,
      }
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
    };
    let input: CreateGameMutationVariables = {
      input: createGameInput,
    };
    let result = await this.callGraphQLThrowOnError<CreateGameMutation>(
      createGame,
      input
    );

    let clonedGame = GameParser.gameFromAWSGame(result.createGame);

    let createGameQuestionInputs = (game.questions ?? [])
      .filter((question) => !isNullOrUndefined(question))
      .map((question) => {
        let unwrappedQuestion = question as IGameQuestion;
        return {
          gameId: clonedGame.id,
          text: unwrappedQuestion.text,
          choices: JSON.stringify(unwrappedQuestion.choices),
          imageUrl: unwrappedQuestion.imageUrl,
          instructions: unwrappedQuestion.instructions,
          cluster: unwrappedQuestion.cluster,
          domain: unwrappedQuestion.domain,
          grade: unwrappedQuestion.grade,
          standard: unwrappedQuestion.standard,
        } as CreateGameQuestionInput;
      });

    let questionAPIClient = new GameQuestionAPIClient(this.env);
    let createQuestionPromises = createGameQuestionInputs.map(
      (createGameQuestionInput) => {
        return questionAPIClient.createGameQuestion(createGameQuestionInput);
      }
    );

    Promise.all(createQuestionPromises).then((questions) => {
      clonedGame.questions = questions;
    });

    return clonedGame;
  }

  async deleteGame(id: string): Promise<IGame> {
    let input: DeleteGameInput = { id };
    let variables: DeleteGameMutationVariables = { input };
    let result = await this.callGraphQLThrowOnError<DeleteGameMutation>(
      this.deleteGame,
      variables
    );
    return GameParser.gameFromAWSGame(result.deleteGame);
  }
}
