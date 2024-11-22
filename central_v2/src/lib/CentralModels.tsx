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

// object that handles all input variables in the create question flow for the client side exclusively
export type IncorrectAnswer = {
  id?: string;
  answer: string;
  explanation: string;
  isCardComplete?: boolean;
}

// these then get based into the more structured IQuestion/AWSQuestion objects when the API request is made
export type CreateQuestionTemplateInput = {
  title: string;
  image: File | null;
  correctAnswer: string;
  correctAnswerSteps: string[];
  incorrectAnswers: IncorrectAnswer[];
  ccss: string;
}