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
    [AnswerType.NUMBER]: number[];
    [AnswerType.STRING]: string[];
    [AnswerType.EXPRESSION]: string[];
}

export interface ITeamAnswerContent {
  delta?: string;
  rawAnswer?: string; 
  normAnswer?: INormAnswer;
  percent?: number;
  multiChoiceAnswerIndex?: number | null;
  isSubmitted?: boolean;
  currentState: GameSessionState | null;
  currentQuestionIndex: number | null;
}