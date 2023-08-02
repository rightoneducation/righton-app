import { AWSBaseQuestion } from "./AWSBaseQuestion";

export type AWSGameQuestion = AWSBaseQuestion & {
  gameId: string;
};
