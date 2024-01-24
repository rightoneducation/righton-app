import { IQuestionTemplate } from './IQuestionTemplate';

export interface IGameTemplate {
  id: string,
  title: string,
  owner: string,
  version: number,
  description: string,
  domain?: string | null | undefined,
  cluster?: string | null | undefined,
  grade?: string | null | undefined,
  standard?: string | null | undefined,
  phaseOneTime: number,
  phaseTwoTime: number,
  imageUrl?: string | null | undefined,
  questionTemplates?: { questionTemplate: IQuestionTemplate, gameQuestionId: string }[] | null,
  createdAt?: string | null | undefined,
  updatedAt?: string | null
}