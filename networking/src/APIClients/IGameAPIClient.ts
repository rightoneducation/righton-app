import { CreateGameInput, UpdateGameInput } from "./../GraphQLAPI";
import { IGame } from "../Models";

export interface IGameAPIClient {
  listGames(): Promise<Array<IGame>>;

  getGame(id: string): Promise<IGame>;

  createGame(createGameInput: CreateGameInput): Promise<IGame>;

  updateGameByUpdateGameInput(updateGameInput: UpdateGameInput): Promise<IGame>;

  updateGameByGame(game: IGame): Promise<IGame>;

  clone(game: IGame): Promise<IGame>;

  deleteGame(id: string): Promise<IGame>;
}
