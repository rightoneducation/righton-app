import { PublicPrivateType } from '../APIClients';
import { IQuestionTemplate, IQuestionTemplateOrder } from './IQuestionTemplate';

export interface IGameTemplate {
  id: string,
  userId: string,
  publicPrivateType: PublicPrivateType,
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
  ccssDescription?: string | null | undefined,
  phaseOneTime: number,
  phaseTwoTime: number,
  imageUrl?: string | null | undefined,
  timesPlayed?: number | null,
  publicQuestionIds?: string[] | null,
  privateQuestionIds?: string[] | null,
  questionTemplates?: { questionTemplate: IQuestionTemplate, gameQuestionId: string }[] | null,
  questionTemplatesCount: number,
  questionTemplatesOrder: IQuestionTemplateOrder[],
  createdAt?: Date | null,
  updatedAt?: Date | null
}