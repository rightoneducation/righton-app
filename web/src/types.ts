export type Question = {
  text: string;
  answer: string;
  distrators: string[];
  image: string;
  instructions: string[];
};

export type Game = {
  GameID: string;
  title: string;
  cluster: string | null;
  description: string | null;
  domain: string | null;
  grade: string | null;
  q1: Question | null;
  q2: Question | null;
  q3: Question | null;
  q4: Question | null;
  q5: Question | null;
  standard: string | null;
};