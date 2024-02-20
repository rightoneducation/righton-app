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
    limit: number | null,
    nextToken: string | null,
    sortdirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByDate(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;

  listQuestionTemplatesByGrade(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;

  listQuestionTemplatesByGameTemplatesCount(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;
}