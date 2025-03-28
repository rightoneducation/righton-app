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
  discardedExplanations: string[];
  version: string;
}

export type IWrongAnswerExplanations = string[];
export type IWrongAnswerExplanation = string;

export interface IExplanationToSave {
  question: string;
  correctAnswer: string;
  wrongAnswer: string;
  genExplanation:{
    explanation: string;
    editedExplanation?: string;
    editReason?: string;
    regenExplanations?: {
      reason: IChipData | null;
      prompt?: string;
    }[];
  }
  discardedExplanations: string[];
  version: string;
}

export interface ILocalExplanation extends IExplanationToSave {
  date: string;
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
  reason?: IChipData | null,
  discardText?: string,
  version: string
}

export interface IDiscardedExplanationSaveInput {
  question: string
  explanation: string,
  reason?: string,
  discardText?: string,
  version: string
}

export interface IChipData {
  incorrect: boolean;
  unclear: boolean;
  other: boolean;
}