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
import { createGameQuestion, deleteGameQuestion } from "../../graphql";
import { IGameQuestionAPIClient } from "../IGameQuestionAPIClient";
import { BaseGraphQLAPIClient } from "./BaseGraphQLAPIClient";

export class GameQuestionAPIClient
  extends BaseGraphQLAPIClient
  implements IGameQuestionAPIClient
{
  async createGameQuestion(
    createGameQuestionInput: CreateGameQuestionInput
  ): Promise<IGameQuestion> {
    let input: CreateGameQuestionMutationVariables = {
      input: createGameQuestionInput,
    };
    let result = await this.callGraphQLThrowOnError<CreateGameQuestionMutation>(
      createGameQuestion,
      input
    );
    return QuestionParser.gameQuestionFromAWSGameQuestion(
      result.createGameQuestion
    );
  }

  async deleteQuestion(id: string): Promise<IGameQuestion> {
    let input: DeleteGameQuestionInput = { id };
    let variables: DeleteGameQuestionMutationVariables = { input };

    let result = await this.callGraphQLThrowOnError<DeleteGameQuestionMutation>(
      deleteGameQuestion,
      variables
    );
    return QuestionParser.gameQuestionFromAWSGameQuestion(
      result.deleteGameQuestion
    );
  }
}
