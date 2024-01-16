import { IQuestionTemplate } from "../../Models";
import { CreateQuestionTemplateInput, UpdateQuestionTemplateInput } from "../../AWSMobileApi";

export interface IQuestionTemplateAPIClient {
  createQuestionTemplate(
    input: CreateQuestionTemplateInput
  ): Promise<IQuestionTemplate>;

  getQuestionTemplate(
    id: string
  ): Promise<IQuestionTemplate>;

  updateQuestionTemplate(
    updateQuestionTemplateInput: UpdateQuestionTemplateInput
  ): Promise<IQuestionTemplate>;

  deleteQuestionTemplate(
    id: string
  ): Promise<IQuestionTemplate>;

  listQuestionTemplates(
    limit: number,
    nextToken: string | null,
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;
}