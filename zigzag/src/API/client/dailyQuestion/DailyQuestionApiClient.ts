import { IDailyQuestion } from "../../models/DailyQuestion/IDailyQuestion";
import { IDailyQuestionAPIClient } from "./interfaces/IDailyQuestionApiClient";
// Minimal references to generated GraphQL docs; calls kept commented
import { getDailyQuestion } from "../../../graphql/queries";
import { updateDailyQuestion, createDailyQuestion, deleteDailyQuestion,  } from "../../../graphql/mutations";
import { BaseAPIClient, GraphQLOptions } from "../../BaseAPIClient";
import { CreateDailyQuestionMutation, DeleteDailyQuestionMutation, GetDailyQuestionQuery, UpdateDailyQuestionMutation } from "../../../../AWSMobileApi";
import { QuestionParser } from "../../parser/questionParser";

export class DailyQuestionAPIClient extends BaseAPIClient {

  async getDailyQuestion(id: string): Promise<IDailyQuestion | undefined> {
    try {
   const queryFunction = getDailyQuestion;
   const variables: GraphQLOptions = { input: { id } };

   const question = await this.callGraphQL<GetDailyQuestionQuery>(
    queryFunction, 
    variables
  );
   
   if(!question.data.getDailyQuestion) {
    throw new Error("Daily question not found.");
  }
  
  return QuestionParser.dailyQuestionFromAWSDailyQuestion(question.data.getDailyQuestion);
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching daily question.");
  }
}

 async updateDailyQuestion(questionId: string, input: IDailyQuestion): Promise<IDailyQuestion | undefined> {
  try {
    const queryFunction = updateDailyQuestion;
    const variables: GraphQLOptions = { input: { id: questionId, input } };

    const question = await this.callGraphQL<UpdateDailyQuestionMutation>(
      queryFunction,
      variables
    );

    if(!question.data.updateDailyQuestion) {
      throw new Error("Daily question not found.");
    }

    return QuestionParser.dailyQuestionFromAWSDailyQuestion(question.data.updateDailyQuestion);
  } catch (error) {
    console.error(error);
    throw new Error("Error updating daily question.");
  } 
 }

  async createDailyQuestion(input: IDailyQuestion): Promise<IDailyQuestion | undefined> {
    try {
      const queryFunction = createDailyQuestion;
      const variables: GraphQLOptions = { input };

      const question = await this.callGraphQL<CreateDailyQuestionMutation>(
        queryFunction,
        variables
      );

      if(!question.data.createDailyQuestion) {
        throw new Error("Failed to create daily question.");
      }

      return QuestionParser.dailyQuestionFromAWSDailyQuestion(question.data.createDailyQuestion);
    } catch (error) {
  }
}

async deleteDailyQuestion(id: string): Promise<void> {
  try {
    const queryFunction = deleteDailyQuestion;
    const variables: GraphQLOptions = { input: { id } };

    const question = await this.callGraphQL<DeleteDailyQuestionMutation>(
      queryFunction,
      variables
    );

    if(!question.data.deleteDailyQuestion) {
      throw new Error("Failed to delete daily question.");
    }

  } catch (error) {
    console.error(error);
    throw new Error("Error deleting daily question.");
  }
  }
}