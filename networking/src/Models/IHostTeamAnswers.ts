import { ConfidenceLevel } from "../AWSMobileApi";
import { Answer } from "./AnswerClasses";

export interface IHostTeamAnswersResponse {
  normAnswer: number[] | string[];
  rawAnswer: string;
  count: number;
  isCorrect: boolean;
  teams: string[];
}

export interface IHostTeamAnswersConfidence {
  level: ConfidenceLevel;
  responses: {
    team: string;
    answer: Answer;
    isCorrect: boolean;
  }[]
}

export interface IHostTeamAnswersHint {
  themeText: string;
  teams: {
    name: string;
    rawHint: string;
  }[];
  teamCount: number;
}
/* 
 * IHostTeamAnswers
 * Interface that types the answer object required for host to
 * display all the content easily via Victory Charts:
 * responses -> Real Time Responses
 * confidence -> Confidence Meter
 * hints -> Hints
 */
export interface IHostTeamAnswers {
  responses: IHostTeamAnswersResponse[],
  confidences: IHostTeamAnswersConfidence[],
  hints: IHostTeamAnswersHint[] 
}