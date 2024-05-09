import { BaseAPIClient } from "../BaseAPIClient";
import { IQuestionTemplateAPIClient } from "./interfaces";
import { 
  createQuestionTemplate, 
  getQuestionTemplate,
  updateQuestionTemplate,
  deleteQuestionTemplate,
  listQuestionTemplates,
  questionTemplatesByDate,
  questionTemplatesByGrade,
  questionTemplatesByGameTemplatesCount
} from "../../graphql";
import { 
  CreateQuestionTemplateInput, 
  CreateQuestionTemplateMutation, 
  CreateQuestionTemplateMutationVariables,
  GetQuestionTemplateQuery,
  UpdateQuestionTemplateInput,
  UpdateQuestionTemplateMutation,
  UpdateQuestionTemplateMutationVariables,
  DeleteQuestionTemplateInput,
  DeleteQuestionTemplateMutation,
  DeleteQuestionTemplateMutationVariables
} from "../../AWSMobileApi";
import { QuestionTemplateParser } from '../../Parsers/QuestionTemplateParser';
import { IQuestionTemplate, AWSQuestionTemplate } from "../../Models";
import { GraphQLOptions } from "../BaseAPIClient";
import { isNullOrUndefined } from "../../global";

export class QuestionTemplateAPIClient
  extends BaseAPIClient
  implements IQuestionTemplateAPIClient
{
  async createQuestionTemplate(createQuestionTemplateInput: CreateQuestionTemplateInput): Promise<IQuestionTemplate> {
    const variables: CreateQuestionTemplateMutationVariables = {input: createQuestionTemplateInput as CreateQuestionTemplateInput}
    const questionTemplate = await this.callGraphQL<CreateQuestionTemplateMutation>(
        createQuestionTemplate,
        variables as unknown as GraphQLOptions
    )
    if (
        isNullOrUndefined(questionTemplate.data) ||
        isNullOrUndefined(questionTemplate.data.createQuestionTemplate)
    ) {
        throw new Error(`Failed to create question template.`)
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.createQuestionTemplate as AWSQuestionTemplate)
  }
  async getQuestionTemplate(id: string): Promise<IQuestionTemplate> {
    const result = await this.callGraphQL<GetQuestionTemplateQuery>(
      getQuestionTemplate,
      { id } as unknown as GraphQLOptions
    )
    if (
      isNullOrUndefined(result.data) ||
      isNullOrUndefined(result.data.getQuestionTemplate)
    ) {
      throw new Error(`Failed to get question template`)
    }  
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(result.data.getQuestionTemplate as AWSQuestionTemplate);
  }

  async updateQuestionTemplate(updateQuestionTemplateInput: UpdateQuestionTemplateInput): Promise<IQuestionTemplate> {

    const input: UpdateQuestionTemplateInput = updateQuestionTemplateInput as UpdateQuestionTemplateInput;
    const variables: UpdateQuestionTemplateMutationVariables = { input };
    const questionTemplate = await this.callGraphQL<UpdateQuestionTemplateMutation>(
        updateQuestionTemplate,
        variables as unknown as GraphQLOptions
    );
    if (
        isNullOrUndefined(questionTemplate.data) ||
        isNullOrUndefined(questionTemplate.data.updateQuestionTemplate)
    ) {
        throw new Error(`Failed to update question template`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.updateQuestionTemplate as AWSQuestionTemplate);
  }

  async deleteQuestionTemplate(id: string): Promise<boolean> {
    const input: DeleteQuestionTemplateInput = {id};
    const variables: DeleteQuestionTemplateMutationVariables = { input };
    const result = await this.callGraphQL<DeleteQuestionTemplateMutation>(
        deleteQuestionTemplate,
        variables as unknown as GraphQLOptions
    );
    // if return is true, the delete was successful
    return (!isNullOrUndefined(result));
  }

  
  async listQuestionTemplates(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", listQuestionTemplates, "listQuestionTemplates");
  }

  async listQuestionTemplatesByDate(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", questionTemplatesByDate, "questionTemplatesByDate");
  }

  async listQuestionTemplatesByGrade(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", questionTemplatesByGrade, "questionTemplatesByGrade");
  }

  async listQuestionTemplatesByGameTemplatesCount(limit: number, nextToken: string | null, sortDirection: string | null, filterString: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    return this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", questionTemplatesByGameTemplatesCount, "questionTemplatesByGameTemplatesCount");
  }
}