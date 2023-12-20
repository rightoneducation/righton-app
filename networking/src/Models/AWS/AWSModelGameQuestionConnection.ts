import { AWSQuestionTemplate } from "./AWSQuestionTemplate";
import { AWSGameTemplate } from "./AWSGameTemplate";

export type AWSModelGameQuestionConnection = {
  items: Array<AWSGameQuestions>;
  __typename: string;
  nextToken: string | null;
}

export type AWSGameQuestions = {
id: string,
questionTemplateID: string,
gameTemplateID: string,
questionTemplate?: AWSQuestionTemplate | null | undefined,
gameTemplate?: AWSGameTemplate | null | undefined,
createdAt: string,
updatedAt: string,
__typename: string
};