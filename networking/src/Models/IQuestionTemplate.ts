import { IGameTemplate } from './IGameTemplate';

export interface IQuestionTemplate {
  id: string,
  title: string,
  owner: string,
  version: number,
  choices?: string | null,
  instructions?: string | null,
  answerSettings?: string | null,
  domain: string | null;
  cluster: string | null;
  grade: string | null;
  standard: string | null;
  imageUrl?: string | null | undefined,
  gameTemplates?: IGameTemplate[] | null,
  createdAt?: string | null | undefined,
  updatedAt?: string | null
}