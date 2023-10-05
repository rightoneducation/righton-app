enum AnswerType {
  MULTICHOICE,
  TEXT,
  NUMBER,
  FORMULA,
  NULL
}
export interface IAnswerText {
  rawText: string;
  normText?: string;
  type: AnswerType;
}
export interface IAnswerContent {
  answers: [IAnswerText];
  percent?: number;
  multiChoiceAnswerIndex?: number | null;
  isSubmitted: boolean;
}