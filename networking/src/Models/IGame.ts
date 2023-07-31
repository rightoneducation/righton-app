import { IGameQuestion } from "./IGameQuestion";

export interface IGame {
  id: string;
  title: string;
  description?: string | null;
  cluster?: string | null;
  domain?: string | null;
  grade?: string | null;
  standard?: string | null;
  phaseOneTime?: number | null;
  phaseTwoTime?: number | null;
  imageUrl?: string | null;
  questions?: Array<IGameQuestion | null> | null;
  updatedAt: string;
  createdAt: string;
}
