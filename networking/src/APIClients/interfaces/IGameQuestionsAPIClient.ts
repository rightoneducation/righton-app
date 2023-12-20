import { IGameQuestions } from "../../Models";

export interface IGameQuestionsAPIClient {
  createGameQuestions(
    id: string,
    gameTemplateID: string,
    questionTemplateID: string,
  ): Promise<IGameQuestions | null>;

  listGameQuestions(
    limit: number,
    nextToken: string
  ): Promise<{ gameQuestions: IGameQuestions[], nextToken: string } | null>;
}