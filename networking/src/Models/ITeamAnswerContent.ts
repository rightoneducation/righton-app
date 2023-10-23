import { GameSessionState } from "../AWSMobileApi";
export enum AnswerType {
  MULTICHOICE,
  STRING,
  NUMBER,
  EXPRESSION,
  NULL
}

export interface IExtractedAnswer {
  value: string;
  type: AnswerType;
}
export interface INormAnswer {
  value: string | number;
  type: AnswerType;
}

export interface ITeamAnswerContent {
  delta?: string;
  rawAnswer?: string; 
  normAnswer?: INormAnswer[];
  percent?: number;
  multiChoiceAnswerIndex?: number | null;
  isSubmitted?: boolean;
  currentState: GameSessionState | null;
  currentQuestionIndex: number | null;
}