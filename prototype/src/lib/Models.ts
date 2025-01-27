import { ExplanationRegenType } from "./Constants";

export interface IQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswer1: string;
  wrongAnswer2: string;
  wrongAnswer3: string;
}

export type IWrongAnswerExplanations = string[];

export interface IQuestionToSave {
  question: string;
  correctAnswer: string;
  wrongAnswers: 
    {
      answer: string;
      selectedExplanation: string;
      editedExplanation?: string;
      editedReason?: string;
      dismissedExplanations: {
        explanation: string;
        prompt?: string;
      }[];
    }[];
  discardedExplanations: string[];
  version: string;
}

export interface IRegenInput {
  question: IQuestionToSave;
  action: ExplanationRegenType;
  index: number | null;
}

export interface IQualityData {
  version: {
    version: string;
    quality: number;
  }[];
}

export interface IDiscardedExplanationToSave {
  question: string
  explanation: string,
  discardText?: string,
  version: string
}