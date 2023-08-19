import { CreateGameQuestionInput } from "../GraphQLAPI";
import { IGameQuestion } from "../Models";

export interface IGameQuestionAPIClient {
  createGameQuestion(
    createGameQuestion: CreateGameQuestionInput
  ): Promise<IGameQuestion>;
  deleteQuestion(id: string): Promise<IGameQuestion>;
}
