export interface IBaseQuestion {
  id: string;
  text: string;
  choices?: Array<IChoice> | null;
  imageUrl?: string | null;
  instructions?: Array<string> | null;
  standard?: string | null;
  cluster?: string | null;
  domain?: string | null;
  grade?: string | null;
  gameSessionId: string;
}

export interface IChoice {
  text: string;
  reason: string | null;
  isAnswer: boolean;
}
