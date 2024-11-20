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

// object to handle error checking for create question flow
// respective booleans are passed to individual components to trigger styling changes
export type CreateQuestionErrorCheck = {
  isQuestionSubmitted: boolean;
  isQuestionCardComplete: boolean;
  isCorrectAnswerComplete: boolean;
  isIncorrectAnswer1Complete: boolean;
  isIncorrectAnswer2Complete: boolean;
  isIncorrectAnswer3Complete: boolean;
}

// object that handles all input variables in the create question flow for the client side exclusively
// these then get based into the more structured IQuestion/AWSQuestion objects when the API request is made
export type CreateQuestionTemplateInput = {
  title: string;
  image: File | null;
  correctAnswer: string;
  correctAnswerSteps: string[];
  incorrectAnswers: {answer: string, explanation: string}[];
  ccss: string;
}