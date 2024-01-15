import { IGameQuestions } from "../../Models";
import { CreateGameQuestionsInput } from "../../AWSMobileApi";

export interface IGameQuestionAPIClient {
  createGameQuestions(
    createGameQuestionsInput: CreateGameQuestionsInput
  ): Promise<IGameQuestions | null>;

  getGameQuestions(
    id: string
  ): Promise<IGameQuestions | null>;

  deleteGameQuestion(
    id: string
  ): Promise<IGameQuestions | null>;

  listGameQuestions(
    limit: number,
    nextToken: string | null,
  ): Promise<{ gameQuestions: IGameQuestions[], nextToken: string } | null>;
}