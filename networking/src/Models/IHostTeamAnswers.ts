import { ConfidenceLevel } from "../AWSMobileApi";

/* 
 * IHostTeamAnswers
 * Interface that types the answer object required for host to
 * display all the content easily via Victory Charts:
 * answer -> Real Time Responses
 * confidence -> Confidence Meter
 * hints -> Hints
 */
export interface IHostTeamAnswers {
  answers: {
    normAnswer: number[] | string[];
    rawAnswer: string;
    count: number;
    isCorrect: boolean;
    teams: string[];
  }[],
  confidence: {
    level: ConfidenceLevel;
    responses: {
      team: string;
      answer: Answer;
      isCorrect: boolean;
    }[]
  }[],
  hints: {
    themeText: string;
    teams: {
      name: string;
      rawHint: string;
    }[];
    teamCount: number;
  }[]
}