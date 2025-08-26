import { IDailyQuestion } from "../models/DailyQuestion/IDailyQuestion";
import { AWSDailyQuestion } from "../models/DailyQuestion/IAWSDailyQuestion";

// Helper function for null/undefined checks
function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

export class QuestionParser {
  static dailyQuestionFromAWSDailyQuestion(awsDailyQuestion: AWSDailyQuestion): IDailyQuestion {
    if (isNullOrUndefined(awsDailyQuestion)) {
      throw new Error("DailyQuestion is null");
    }

    let parsedQuestion: any = null;
    let parsedAnswerAnalytics: any = null;
    let parsedComments: any = null;
    
    // Parse question JSON
    if (!isNullOrUndefined(awsDailyQuestion.question)) {
      try {
        parsedQuestion = JSON.parse(awsDailyQuestion.question!);
      } catch (error) {
        console.warn('Failed to parse question as JSON:', error);
        parsedQuestion = null;
      }
    }
    
    // Parse answerAnalytics JSON
    if (!isNullOrUndefined(awsDailyQuestion.answerAnalytics)) {
      try {
        parsedAnswerAnalytics = JSON.parse(awsDailyQuestion.answerAnalytics!);
      } catch (error) {
        console.warn('Failed to parse answerAnalytics as JSON:', error);
        parsedAnswerAnalytics = null;
      }
    }

    // Parse comments JSON
    if (!isNullOrUndefined(awsDailyQuestion.comments)) {
      try {
        parsedComments = JSON.parse(awsDailyQuestion.comments!);
      } catch (error) {
        console.warn('Failed to parse comments as JSON:', error);
        parsedComments = [];
      }
    }

    // Validate required fields
    if (isNullOrUndefined(awsDailyQuestion.id) ||
        isNullOrUndefined(awsDailyQuestion.updatedAt)) {
      throw new Error("DailyQuestion has null field for the attributes that are not nullable");
    }

    const {
      id,
      createdAt,
      topic,
      imageUrl,
      shareCount
    } = awsDailyQuestion || {};

    const dailyQuestion: IDailyQuestion = {
      _id: id,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      topic: topic || '',
      question: {
        questionText: parsedQuestion?.questionText || '',
        options: (parsedQuestion?.options || []).map((option: any) => ({
          key: option.key || '',
          answer: option.answer || '',
          isAnswer: option.isAnswer
        })),
        phaseOne: {
          correctAnswer: {
            answerKey: parsedQuestion?.phaseOne?.correctAnswer?.answerKey || '',
            explanation: parsedQuestion?.phaseOne?.correctAnswer?.explanation || ''
          },
          incorrectAnswerExplanation: parsedQuestion?.phaseOne?.incorrectAnswerExplanation || ''
        },
        phaseTwo: parsedQuestion?.phaseTwo ? {
          correctAnswer: {
            answerKey: parsedQuestion.phaseTwo.correctAnswer?.answerKey || '',
            explanation: parsedQuestion.phaseTwo.correctAnswer?.explanation || ''
          },
          incorrectAnswerExplanation: parsedQuestion.phaseTwo.incorrectAnswerExplanation || ''
        } : undefined
      },
      imageUrl: imageUrl || undefined,
      answerAnalytics: parsedAnswerAnalytics ? {
        totalAnswers: parsedAnswerAnalytics.totalAnswers || 0,
        leaderboards: (parsedAnswerAnalytics.leaderboards || []).map((leader: any) => ({
          userId: leader.userId || '',
          points: leader.points || 0
        })),
        phaseOne: {
          optionCounts: {
            A: parsedAnswerAnalytics.phaseOne?.optionCounts?.A || 0,
            B: parsedAnswerAnalytics.phaseOne?.optionCounts?.B || 0,
            C: parsedAnswerAnalytics.phaseOne?.optionCounts?.C || 0,
            D: parsedAnswerAnalytics.phaseOne?.optionCounts?.D || 0
          }
        },
        phaseTwo: {
          optionCounts: {
            A: parsedAnswerAnalytics.phaseTwo?.optionCounts?.A || 0,
            B: parsedAnswerAnalytics.phaseTwo?.optionCounts?.B || 0,
            C: parsedAnswerAnalytics.phaseTwo?.optionCounts?.C || 0,
            D: parsedAnswerAnalytics.phaseTwo?.optionCounts?.D || 0
          }
        },
        updatedAt: parsedAnswerAnalytics.updatedAt || new Date()
      } : undefined,
      comments: parsedComments && parsedComments.length > 0 ? {
        id: parsedComments[0].id || '',
        userId: parsedComments[0].userId || '',
        comment: parsedComments[0].comment || '',
        commentDate: parsedComments[0].commentDate || new Date()
      } : {
        id: '',
        userId: '',
        comment: '',
        commentDate: new Date()
      },
      shareCount: shareCount || undefined
    } as IDailyQuestion;

    return dailyQuestion;
  }
}