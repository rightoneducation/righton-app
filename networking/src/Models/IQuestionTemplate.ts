import { IGameTemplate } from './IGameTemplate';

export interface IQuestionTemplate {
  id: string,
  title?: string | null,
  owner?: string | null,
  version?: number | null,
  choices?: string | null,
  instructions?: string | null,
  domain: string;
  cluster: string;
  grade: string;
  standard: string;
  imageUrl?: string | null | undefined,
  gameTemplates?: IGameTemplate[] | null,
  createdAt?: string | null | undefined,
  updatedAt?: string | null
}