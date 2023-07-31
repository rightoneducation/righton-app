import { IBaseQuestion } from "./IBaseQuestion";

export interface IQuestion extends IBaseQuestion {
  gameSessionId: string;
  order: number;
}
