import { GameSessionState } from "../AWSMobileApi";
enum AnswerType {
  MULTICHOICE,
  TEXT,
  NUMBER,
  FORMULA,
  NULL
}
export interface IAnswerText {
  rawText: string;
  normText?: (string | number)[];
  type: AnswerType;
}
export interface IAnswerContent {
  answers: IAnswerText[];
  percent?: number;
  multiChoiceAnswerIndex?: number | null;
  isSubmitted: boolean;
  currentState: GameSessionState | null;
  currentQuestionIndex: number | null;
}