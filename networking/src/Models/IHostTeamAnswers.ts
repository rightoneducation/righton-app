import { ConfidenceLevel } from "../AWSMobileApi";

export interface IHostTeamAnswersResponse {
  normAnswer: number[] | string[];
  rawAnswer: string;
  count: number;
  multiChoiceCharacter: string;
  isCorrect: boolean;
  teams: string[];
  reason?: string;
  isSelectedMistake?: boolean;
}

export interface IHostTeamAnswersConfidenceResponse {
  team: string;
  rawAnswer: string;
}

export interface IHostTeamAnswersConfidence {
  level: ConfidenceLevel;
  label: string;
  correct: IHostTeamAnswersConfidenceResponse[];
  incorrect: IHostTeamAnswersConfidenceResponse[];
}

export interface IHostTeamAnswersHint {
  rawHint: string;
  team: string;
}

export interface IHostTeamAnswersGPTHint {
  themeText: string;
  teams: {
    name: string;
    rawHint: string;
  }[];
  teamCount: number;
}

export interface IHostTeamAnswersPerPhase {
  responses: IHostTeamAnswersResponse[],
  confidences?: IHostTeamAnswersConfidence[],
  hints?: IHostTeamAnswersHint[],
  gptHints?: IHostTeamAnswersGPTHint[] 
}

export interface IHostTeamAnswersQuestion {
  questionId: string,
  phase1: IHostTeamAnswersPerPhase,
  phase2: IHostTeamAnswersPerPhase,
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
  questions: IHostTeamAnswersQuestion[]
}


export interface IGPTHints {
  themeText: string,
  teams: string[],
  teamCount: number
}[]
