import { IQuestionTemplate } from "../../Models";
import { CreateQuestionTemplateInput, UpdateQuestionTemplateInput } from "../../AWSMobileApi";

export interface IQuestionTemplateAPIClient {
  createQuestionTemplate(
    input: CreateQuestionTemplateInput
  ): Promise<IQuestionTemplate | null>;

  getQuestionTemplate(
    id: string
  ): Promise<IQuestionTemplate | null>;

  updateQuestionTemplate(
    updateQuestionTemplateInput: UpdateQuestionTemplateInput
  ): Promise<IQuestionTemplate | null>;

  deleteQuestionTemplate(
    id: string
  ): Promise<IQuestionTemplate | null>;

  listQuestionTemplates(
    limit: number,
    nextToken: string | null,
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;
}