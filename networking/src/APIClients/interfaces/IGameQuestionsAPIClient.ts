import { IGameQuestions } from "../../Models";
import { CreateGameQuestionsInput } from "../../AWSMobileApi";

export interface IGameQuestionsAPIClient {
  createGameQuestions(
    createGameQuestionsInput: CreateGameQuestionsInput
  ): Promise<IGameQuestions>;

  getGameQuestions(
    id: string
  ): Promise<IGameQuestions>;

  deleteGameQuestions(
    id: string
  ): Promise<IGameQuestions>;

  listGameQuestions(
    limit: number,
    nextToken: string | null,
  ): Promise<{ gameQuestions: IGameQuestions[], nextToken: string }>;
}