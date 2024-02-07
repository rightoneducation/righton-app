import { IGameQuestion } from "../../Models";
import { CreateGameQuestionsInput } from "../../AWSMobileApi";

export interface IGameQuestionAPIClient {
  createGameQuestions(
    createGameQuestionsInput: CreateGameQuestionsInput
  ): Promise<IGameQuestion>;

  getGameQuestions(
    id: string
  ): Promise<IGameQuestion>;

  deleteGameQuestion(
    id: string
  ): Promise<IGameQuestion>;

  listGameQuestions(
    limit: number,
    nextToken: string | null,
  ): Promise<{ gameQuestions: IGameQuestion[], nextToken: string }>;
}