import { CreateGameInput, UpdateGameInput } from "./../GraphQLAPI";
import { IGame } from "../Models";
import { BaseAPIClient } from "./Impl/BaseAPIClient";

export default interface IGameAPIClient extends BaseAPIClient {
  listGames(): Promise<Array<IGame>>;

  getGame(id: string): Promise<IGame>;

  createGame(createGameInput: CreateGameInput): Promise<IGame>;

  updateGame(updateGameInput: UpdateGameInput): Promise<IGame>;

  clone(game: IGame): Promise<IGame>;

  deleteGame(id: string): Promise<IGame>;
}
