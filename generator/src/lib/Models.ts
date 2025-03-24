import { ExplanationRegenType } from "./Constants";

export enum ScreenSize {
  SMALL,
  MEDIUM,
  LARGE,
}

export interface IQuestion {
  question: string;
  correctAnswer: string;
  wrongAnswers: string[];
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
        explanation: IChipData | null;
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

export interface IChipData {
  incorrect: boolean;
  unclear: boolean;
  other: boolean;
}