import { IQuestionTemplate } from "../../Models";
import { CreateQuestionTemplateInput, UpdateQuestionTemplateInput } from "../../AWSMobileApi";

export interface IQuestionTemplateAPIClient {
  createQuestionTemplate(
    input: CreateQuestionTemplateInput | IQuestionTemplate
  ): Promise<IQuestionTemplate>;

  getQuestionTemplate(
    id: string
  ): Promise<IQuestionTemplate>;

  updateQuestionTemplate(
    updateQuestionTemplateInput: UpdateQuestionTemplateInput | IQuestionTemplate
  ): Promise<IQuestionTemplate>;

  deleteQuestionTemplate(
    id: string
  ): Promise<IQuestionTemplate>;

  listQuestionTemplates(
    limit: number,
    nextToken: string | null,
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;
}