import { AWSBaseQuestion } from "./AWSBaseQuestion";

export type AWSQuestion = AWSBaseQuestion & {
  gameSessionId: string;
  order: number;
};
