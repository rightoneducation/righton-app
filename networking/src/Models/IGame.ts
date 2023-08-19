import { IGameQuestion } from "./IGameQuestion";

export interface IGame {
  id: string;
  title: string;
  description?: string | null;
  phaseOneTime?: number | null;
  phaseTwoTime?: number | null;
  imageUrl?: string | null;
  questions: Array<IGameQuestion>;
  updatedAt: number;
  createdAt: number;
}
