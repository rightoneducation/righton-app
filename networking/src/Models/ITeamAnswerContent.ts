import { GameSessionState } from "../AWSMobileApi";
enum AnswerType {
  MULTICHOICE,
  TEXT,
  NUMBER,
  FORMULA,
  NULL
}

export interface INormAnswerSubObj {
  value: string | number;
  type: AnswerType;
}

export interface INormAnswer {
  raw: string;
  norm?: INormAnswerSubObj[];
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