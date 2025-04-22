import { BaseAPIClient } from "../BaseAPIClient";
import { QuestionParser } from "../../Parsers/QuestionParser";
import { IQuestion, AWSQuestion } from "../../Models";
import {
  UpdateQuestionInput,
  UpdateQuestionMutation,
  UpdateQuestionMutationVariables,
} from "../../AWSMobileApi";
import {
  updateQuestion
} from "../../graphql";

import { isNullOrUndefined } from "../../global";
import { IQuestionAPIClient } from "./interfaces/IQuestionAPIClient";

export class QuestionAPIClient
  extends BaseAPIClient
  implements IQuestionAPIClient
{

  async updateQuestion(
    questionInput: UpdateQuestionInput    
  ): Promise<IQuestion> {
      const input: UpdateQuestionInput = questionInput
      const variables: UpdateQuestionMutationVariables = { input }
      console.log('here');
      let question: any = {data: {updateQuestion: null}};
      try {
      question = await this.callGraphQL<UpdateQuestionMutation>(
          updateQuestion,
          variables
      )
    } catch (error) {
      console.log(error);
    }
      console.log('now here');
      if (
          isNullOrUndefined(question.data) ||
          isNullOrUndefined(question.data.updateQuestion)
      ) {
          throw new Error(`Failed to update question`)
      }
      return QuestionParser.questionFromAWSQuestion(question.data.updateQuestion as AWSQuestion) as IQuestion
  }
}