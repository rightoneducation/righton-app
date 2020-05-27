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
  updated: number | null;
};

export type APIGame = {
  GameID: string;
  title: string;
  cluster: string | null;
  description: string | null;
  domain: string | null;
  grade: string | null;
  q1: string | null;
  q2: string | null;
  q3: string | null;
  q4: string | null;
  q5: string | null;
  standard: string | null;
  updated: number | null;
};