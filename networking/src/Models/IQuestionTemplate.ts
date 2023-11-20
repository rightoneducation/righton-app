export interface IQuestionTemplate {
  id: string,
  title?: string | null,
  owner?: string | null,
  version?: number | null,
  choices?: string | null,
  instructions?: string | null,
  domain?: string | null | undefined,
  cluster?: string | null | undefined,
  grade?: string | null | undefined,
  standard?: string | null | undefined,
  imageUrl?: string | null | undefined,
  createdAt?: string | null | undefined,
  updatedAt?: string | null
}