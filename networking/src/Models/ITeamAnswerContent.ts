import { AnswerType } from "./AnswerClasses";

export interface IExtractedAnswer {
  value: string;
  type: AnswerType;
}
export interface INormAnswer {
    [AnswerType.NUMBER]: number[];
    [AnswerType.STRING]: string[];
    [AnswerType.EXPRESSION]: string[];
}