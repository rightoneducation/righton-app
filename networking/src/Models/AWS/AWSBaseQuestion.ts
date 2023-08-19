export type AWSBaseQuestion = {
  id: string;
  text: string;
  imageUrl?: string | null;
  instructions?: string | null;
  cluster?: string | null;
  domain?: string | null;
  grade?: string | null;
  standard?: string | null;
  choices?: string | null;
};
