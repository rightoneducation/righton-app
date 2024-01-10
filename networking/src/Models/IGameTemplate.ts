import { IQuestionTemplate } from './IQuestionTemplate';

export interface IGameTemplate {
  id: string,
  title: string,
  owner: string,
  version: number,
  description: string,
  domain?: string | null,
  cluster?: string | null,
  grade?: string | null,
  standard?: string | null,
  phaseOneTime: number,
  phaseTwoTime: number,
  imageUrl?: string | null,
  questionTemplates: { questionTemplate: IQuestionTemplate, gameQuestionId: string }[] | [],
  createdAt: Date,
  updatedAt: Date
}