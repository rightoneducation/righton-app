import { generateClient } from "aws-amplify/api";

import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';

import { validateQuestion } from './validation';
import { CreateQuestionOfTheDayInput, UpdateQuestionOfTheDayInput } from "../../AWSMobileApi";

export class QuestionService 
{
    // Create a new question (Admin only)
    async createQuestion(input: CreateQuestionOfTheDayInput) {
      await validateQuestion(input); // Ensures exactly 1 correct answer
      const client = generateClient({});

      return await client.graphql({
        query: mutations.createQuestionOfTheDay,
        variables: { input },
        authMode: 'userPool'
      });
    }
  
    // Update existing question (Admin only)
    async updateQuestion(updates: UpdateQuestionOfTheDayInput) {
      if (updates.options) await validateQuestion(updates);
      const client = generateClient({});

      return await client.graphql({
        query: mutations.updateQuestionOfTheDay,
        variables: { input: {...updates } },
        authMode: 'userPool'
      });
    }
  
    // Delete question (Admin only)
    async deleteQuestion(id: string) {
      const client = generateClient({});

      return await client.graphql({
        query: mutations.deleteQuestionOfTheDay,
        variables: { input: { id } },
        authMode: 'userPool'
      });
    }
  
    // Get today's question (Public)
    async getTodaysQuestion(date: string): Promise<any> {
      const client = generateClient({});

      return await client.graphql({
        query: queries.questionByDate,
        variables: { date },
        authMode: 'iam' // Public access
      });
    }
  }
