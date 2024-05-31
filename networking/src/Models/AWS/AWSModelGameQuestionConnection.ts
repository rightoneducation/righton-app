import { AWSQuestionTemplate } from "./AWSQuestionTemplate";
import { AWSGameTemplate } from "./AWSGameTemplate";

export type AWSModelGameQuestionConnection = {
  items: Array<AWSGameQuestion>;
  nextToken: string | null;
}

export type AWSGameQuestion = {
  id: string,
  privateGameTemplateID?: string,
  publicGameTemplateID?: string,
  privateQuestionTemplateID?: string,
  publicQuestionTemplateID?: string,
  privateQuestionTemplate?: AWSQuestionTemplate | null | undefined,
  publicQuestionTemplate?: AWSQuestionTemplate | null | undefined,
  privateGameTemplate?: AWSGameTemplate | null | undefined,
  publicGameTemplate?: AWSGameTemplate | null | undefined,
  createdAt: string,
  updatedAt: string,
};