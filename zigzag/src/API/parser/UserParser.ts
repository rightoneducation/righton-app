import { IUser } from "../models/IUser";
import { IAWSUser } from "../models/IAWSUser";

export default class UserParser {
  static parseIUserfromIAWSUser(user: IAWSUser): IUser {
    let parsedQuestions;
    let parsedAnswers;
    
    try {
      parsedQuestions = JSON.parse(user.question);
    } catch (error) {
      console.warn('Failed to parse user.question as JSON:', error);
      parsedQuestions = [];
    }
    
    try {
      parsedAnswers = JSON.parse(user.answer);
    } catch (error) {
      console.warn('Failed to parse user.answer as JSON:', error);
      parsedAnswers = [];
    }

    return {
      id: user.id,
      date: user.date,
      question: parsedQuestions,
      answer: parsedAnswers,
      isCorrect: user.isCorrect,
    }
  }
}