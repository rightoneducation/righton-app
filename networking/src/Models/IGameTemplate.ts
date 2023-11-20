export interface IGameTemplate {
  id: string,
  title: string,
  owner: string,
  version: number,
  description: string,
  cluster?: string | null | undefined,
  domain?: string | null | undefined,
  standard?: string | null | undefined,
  phaseOneTime?: number | null | undefined,
  phaseTwoTime?: number | null | undefined,
  imageUrl?: string | null | undefined,
  createdAt?: string | null | undefined,
  updatedAt?: string | null
}