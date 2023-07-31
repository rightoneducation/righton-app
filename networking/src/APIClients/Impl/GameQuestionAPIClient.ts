import {
  CreateGameQuestionInput,
  CreateGameQuestionMutation,
  CreateGameQuestionMutationVariables,
  DeleteGameQuestionInput,
  DeleteGameQuestionMutation,
  DeleteGameQuestionMutationVariables,
} from "../../GraphQLAPI";
import { IGameQuestion } from "../../Models";
import QuestionParser from "../../Parsers/QuestionParser";
import { deleteGameQuestion } from "../../graphql";
import { BaseAPIClient } from "./BaseAPIClient";
import IGameQuestionAPIClient from "../IGameQuestionAPIClient";

export default class GameQuestionAPIClient
  extends BaseAPIClient
  implements IGameQuestionAPIClient
{
  async createGameQuestion(
    createGameQuestion: CreateGameQuestionInput
  ): Promise<IGameQuestion> {
    let input: CreateGameQuestionMutationVariables = {
      input: createGameQuestion,
    };
    let result = await this.callGraphQLThrowOnError<CreateGameQuestionMutation>(
      createGameQuestion,
      input
    );
    return QuestionParser.gameQuestionFromAWSGameQuestion(
      result.createGameQuestion
    );
  }

  async deleteQuestion(
    deleteGameQuestionInput: DeleteGameQuestionInput
  ): Promise<IGameQuestion> {
    let variables: DeleteGameQuestionMutationVariables = {
      input: deleteGameQuestionInput,
    };
    let result = await this.callGraphQLThrowOnError<DeleteGameQuestionMutation>(
      deleteGameQuestion,
      variables
    );
    return QuestionParser.gameQuestionFromAWSGameQuestion(
      result.deleteGameQuestion
    );
  }
}
