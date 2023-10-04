enum AnswerType {
  MULTICHOICE,
  TEXT,
  FORMULA,
  NULL
}

export interface IAnswerContent {
  answerTexts: string[];
  answerTypes: AnswerType[];
  multiChoiceAnswerIndex?: number | null;
  isSubmitted: boolean;
}