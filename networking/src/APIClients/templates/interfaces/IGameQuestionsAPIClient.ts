import { IGameQuestion } from "../../../Models";
import { CreateGameQuestionsInput } from "../../../AWSMobileApi";

export interface IGameQuestionsAPIClient {
  createGameQuestions(
    createGameQuestionsInput: CreateGameQuestionsInput
  ): Promise<IGameQuestion>;

  getGameQuestions(
    id: string
  ): Promise<IGameQuestion>;

  deleteGameQuestions(
    id: string
  ): Promise<boolean>;

  listGameQuestions(
    limit: number,
    nextToken: string | null,
  ): Promise<{ gameQuestions: IGameQuestion[], nextToken: string }>;
}