import { AWSBaseQuestion } from "./AWSBaseQuestion";

export type AWSGameQuestion = AWSBaseQuestion & {
  updatedAt: string;
  createdAt: string;
};
