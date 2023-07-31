import { AWSGameQuestion } from "./AWSGameQuestion";

export type AWSGame = {
  id: string;
  title?: string | null;
  description?: string | null;
  cluster?: string | null;
  domain?: string | null;
  grade?: string | null;
  standard?: string | null;
  phaseOneTime?: number | null;
  phaseTwoTime?: number | null;
  imageUrl?: string | null;
  questions?: {
    items?: Array<AWSGameQuestion | null> | null;
  } | null;
  updatedAt: string;
  createdAt: string;
};
