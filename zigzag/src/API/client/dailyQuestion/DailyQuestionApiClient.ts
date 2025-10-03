import { IDailyQuestion } from "../../models/DailyQuestion/IDailyQuestion";
import { IDailyQuestionAPIClient } from "./interfaces/IDailyQuestionApiClient";
// Minimal references to generated GraphQL docs; calls kept commented
import { getDailyQuestion } from "../../../graphql/queries";
import { updateDailyQuestion, createDailyQuestion, deleteDailyQuestion,  } from "../../../graphql/mutations";
import { BaseAPIClient, GraphQLOptions, client } from "../../BaseAPIClient";
import { CreateDailyQuestionMutation, DeleteDailyQuestionMutation, GetDailyQuestionQuery, UpdateDailyQuestionMutation } from "../../../../AWSMobileApi";
import { QuestionParser } from "../../parser/questionParser";

export class DailyQuestionAPIClient extends BaseAPIClient {

  async getDailyQuestion(id: string): Promise<IDailyQuestion | undefined> {
    try {
      const queryFunction = getDailyQuestion;
      const variables = { id };

      const response = await client.graphql({ 
        query: queryFunction, 
        variables: variables as any
      });
   
      if(!response.data.getDailyQuestion) {
        throw new Error("Daily question not found.");
      }
      
      return QuestionParser.dailyQuestionFromAWSDailyQuestion(response.data.getDailyQuestion);
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching daily question.");
    }
  }

 async updateDailyQuestion(questionId: string, input: IDailyQuestion): Promise<IDailyQuestion | undefined> {
  try {
    const queryFunction = updateDailyQuestion;
    
    // Convert IDailyQuestion to AWS format for mutation
    const awsInput = this.convertIDailyQuestionToAWSInput(input);
    awsInput.id = questionId; // Ensure ID is set for update
    
    const variables = { input: awsInput };

    const response = await client.graphql({ 
      query: queryFunction, 
      variables: variables as any
    });

    if(!response.data.updateDailyQuestion) {
      throw new Error("Daily question not found.");
    }

    return QuestionParser.dailyQuestionFromAWSDailyQuestion(response.data.updateDailyQuestion);
  } catch (error) {
    console.error(error);
    throw new Error("Error updating daily question.");
  } 
 }

  async createDailyQuestion(input: IDailyQuestion): Promise<IDailyQuestion | undefined> {
    try {
      const queryFunction = createDailyQuestion;
      
      // Convert IDailyQuestion to AWS format for mutation
      const awsInput = this.convertIDailyQuestionToAWSInput(input);
      
      const variables = { input: awsInput };

      const response = await client.graphql({ 
        query: queryFunction, 
        variables: variables as any
      });

      if(!response.data.createDailyQuestion) {
        throw new Error("Failed to create daily question.");
      }

      return QuestionParser.dailyQuestionFromAWSDailyQuestion(response.data.createDailyQuestion);
    } catch (error) {
      console.error(error);
      throw new Error("Error creating daily question.");
    }
}

  async deleteDailyQuestion(id: string): Promise<void> {
  try {
    const queryFunction = deleteDailyQuestion;
    const variables = { input: { id } };

    const response = await client.graphql({ 
      query: queryFunction, 
      variables: variables as any
    });

    if(!response.data.deleteDailyQuestion) {
      throw new Error("Failed to delete daily question.");
    }

  } catch (error) {
    console.error(error);
    throw new Error("Error deleting daily question.");
  }
  }

  // Helper method to convert IDailyQuestion to AWS input format
  private convertIDailyQuestionToAWSInput(input: IDailyQuestion): any {
    const awsInput: any = {};

    if (input.topic !== undefined) awsInput.topic = input.topic;
    if (input.imageUrl !== undefined) awsInput.imageUrl = input.imageUrl;
    if (input.shareCount !== undefined) awsInput.shareCount = input.shareCount;
    if (input.question !== undefined) awsInput.question = JSON.stringify(input.question);
    if (input.answerAnalytics !== undefined) awsInput.answerAnalytics = JSON.stringify(input.answerAnalytics);
    if (input.comments !== undefined) awsInput.comments = JSON.stringify(input.comments);

    return awsInput;
  }
}