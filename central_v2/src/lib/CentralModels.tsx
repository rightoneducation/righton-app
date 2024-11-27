import { CentralQuestionTemplateInput, IncorrectCard } from "@righton/networking";

export enum ScreenType {
  GAMES,
  QUESTIONS,
  LIBRARY,
  SIGNUP
}

export enum ScreenSize {
  SMALL,
  MEDIUM,
  LARGE,
}

export enum CardType {
  CORRECT,
  INCORRECT,
}

export enum BorderStyle {
  DASHED_BORDER = 'dashedBorder',
  SOLID_BORDER = 'solid',
  CORNER_BORDER = 'corner',
  SVG = 'svg',
}

// enum to track the highlight card in the create question flow
export enum CreateQuestionHighlightCard {
  QUESTIONCARD = 'questionCard',
  CORRECTANSWER = 'correctAnswer',
  INCORRECTANSWER1 = 'card-1',
  INCORRECTANSWER2 = 'card-2',
  INCORRECTANSWER3 = 'card-3',
}

// key for storage to localStorage  
export const StorageKey = 'rightOnCentral';

// type that shapes retreived storage for createQuestion 
export type CreateQuestionLocalData = {
  draftQuestion?: CentralQuestionTemplateInput | null,
  incompleteCards?: IncorrectCard[] | null,
  completeCards?: IncorrectCard[] | null
}