export type AWSGame = {
  id: string;
  title?: string | null;
  description?: string | null;
  phaseOneTime?: number | null;
  phaseTwoTime?: number | null;
  imageUrl?: string | null;
  questions?: string | null;
  updatedAt: string;
  createdAt: string;
};
