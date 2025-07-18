import { IGameTemplate } from './IGameTemplate';
import { IChoice } from "../Models/IQuestion";
import {AnswerType, AnswerPrecision} from "../Models/AnswerClasses";
import { PublicPrivateType } from "../APIClients";

export interface IQuestionTemplateOrder {
  questionTemplateId: string,
  index: number
}

export interface IQuestionTemplate {
  id: string,
  userId: string,
  publicPrivateType: PublicPrivateType,
  title: string,
  lowerCaseTitle: string,
  owner?: string,
  version: number,
  choices?: IChoice[] | null,
  instructions?: string[] | null,
  answerSettings?: AnswerSettingsType | null,
  ccss: string,
  ccssDescription: string,
  domain: string;
  cluster: string;
  grade: string;
  gradeFilter: string;
  standard: string;
  imageUrl?: string | null | undefined,
  timesPlayed?: number | null,
  gameTemplates?: { gameTemplate: IGameTemplate, gameQuestionId: string }[] | null,
  gameTemplatesCount: number,
  createdAt?: Date | null,
  updatedAt?: Date | null
}

// type to handle input variables for question card on createquestion flow
export type QuestionCard = {
  title: string;
  image?: File;
  imageUrl?: string;
  ccss: string;
  isFirstEdit: boolean;
  isCardComplete: boolean;
}

export type AnswerSettingsType = {
  answerType: AnswerType;
  answerPrecision?: AnswerPrecision;
}

// type to handle input variables for correct card on createquestion flow
export type CorrectCard = {
  answer: string;
  answerSteps: string[];
  answerSettings: {
    answerType: AnswerType;
    answerPrecision?: AnswerPrecision;
  }
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
export type CentralQuestionTemplateInput = {
  questionCard: QuestionCard;
  correctCard: CorrectCard;
  incorrectCards: IncorrectCard[];
}