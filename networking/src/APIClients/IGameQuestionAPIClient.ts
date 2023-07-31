import {
  CreateGameQuestionInput,
  DeleteGameQuestionInput,
} from "../GraphQLAPI";
import { IGameQuestion } from "../Models";

export default interface IGameQuestionAPIClient {
  createGameQuestion(
    createGameQuestion: CreateGameQuestionInput
  ): Promise<IGameQuestion>;
  deleteQuestion(
    deleteGameQuestionInput: DeleteGameQuestionInput
  ): Promise<IGameQuestion>;
}
