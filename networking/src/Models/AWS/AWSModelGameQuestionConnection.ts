import { AWSQuestionTemplate } from "./AWSQuestionTemplate";
import { AWSGameTemplate } from "./AWSGameTemplate";

export type AWSModelGameQuestionConnection = {
  items: Array<AWSGameQuestion>;
  nextToken: string | null;
}

export type AWSGameQuestion = {
  id: string,
  questionTemplateID: string,
  gameTemplateID: string,
  questionTemplate?: AWSQuestionTemplate | null | undefined,
  gameTemplate?: AWSGameTemplate | null | undefined,
  createdAt: string,
  updatedAt: string,
};