import { IGameTemplate } from './IGameTemplate';

export interface IQuestionTemplateOrder {
  questionTemplateId: string,
  index: number
}

export interface IQuestionTemplate {
  id: string,
  title: string,
  owner: string,
  version: number,
  choices?: string | null,
  instructions?: string | null,
  answerSettings?: string | null,
  domain: string;
  cluster: string;
  grade: string;
  standard: string;
  imageUrl?: string | null | undefined,
  gameTemplates?: { gameTemplate: IGameTemplate, gameQuestionId: string }[] | null,
  gameTemplatesCount: number,
  createdAt?: Date | null,
  updatedAt?: Date | null
}