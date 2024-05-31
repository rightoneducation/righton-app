import { IQuestionTemplate } from "../../Models";
import { CreateQuestionTemplateInput, UpdateQuestionTemplateInput } from "../../AWSMobileApi";
import { QueryType } from "./IBaseAPIClient";

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
  ): Promise<boolean>;

  listQuestionTemplates(
    limit: number | null,
    nextToken: string | null,
    sortdirection: string | null,
    filterString: string | null, 
    queryType: QueryType
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByDate(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null, 
    queryType: QueryType
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;

  listQuestionTemplatesByGrade(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null, 
    queryType: QueryType
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;

  listQuestionTemplatesByGameTemplatesCount(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null, 
    queryType: QueryType
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null>;
}