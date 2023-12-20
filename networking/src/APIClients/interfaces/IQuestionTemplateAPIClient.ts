import { IQuestionTemplate } from "../../Models";
import { CreateQuestionTemplateInput } from "../../AWSMobileApi";

export interface IQuestionTemplateAPIClient {
  createQuestionTemplate(
    input: CreateQuestionTemplateInput
  ): Promise<IQuestionTemplate | null>;

  listQuestionTemplates(
    limit: number,
    nextToken: string
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;
}