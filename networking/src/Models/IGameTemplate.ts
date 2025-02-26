import { IQuestionTemplate, IQuestionTemplateOrder } from './IQuestionTemplate';

export interface IGameTemplate {
  id: string,
  title: string,
  lowerCaseTitle: string,
  owner: string,
  version: number,
  description: string,
  lowerCaseDescription: string,
  domain?: string | null | undefined,
  cluster?: string | null | undefined,
  grade?: string | null | undefined,
  standard?: string | null | undefined,
  ccss?: string | null | undefined,
  phaseOneTime: number,
  phaseTwoTime: number,
  imageUrl?: string | null | undefined,
  questionTemplates?: { questionTemplate: IQuestionTemplate, gameQuestionId: string }[] | null,
  questionTemplatesCount: number,
  questionTemplatesOrder: IQuestionTemplateOrder[],
  createdAt?: Date | null,
  updatedAt?: Date | null
}