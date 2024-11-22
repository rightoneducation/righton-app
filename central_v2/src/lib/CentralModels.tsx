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

// type to handle input variables for question card on createquestion flow
export type QuestionCard = {
  title: string;
  image?: File;
  ccss: string;
  isFirstEdit: boolean;
  isCardComplete: boolean;
}

// type to handle input variables for correct card on createquestion flow
export type CorrectCard = {
  answer: string;
  answerSteps: string[];
  isFirstEdit: boolean;
  isCardComplete: boolean;
}

// type to handle input variables for correct card on createquestion flow
export type IncorrectCard = {
  id?: string;
  answer: string;
  explanation: string;
  isFirstEdit?: boolean;
  isCardComplete: boolean;
}

// object that handles all input variables in the create question flow for the client side exclusively
// these then get based into the more structured IQuestion/AWSQuestion objects when the API request is made
export type CreateQuestionTemplateInput = {
  questionCard: QuestionCard;
  correctCard: CorrectCard;
  incorrectCards: IncorrectCard[];
}