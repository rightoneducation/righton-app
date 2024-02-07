import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IQuestionTemplateAPIClient } from "./interfaces";
import { 
  createQuestionTemplate, 
  getQuestionTemplate,
  updateQuestionTemplate,
  deleteQuestionTemplate,
  listQuestionTemplates 
} from "../graphql";
import { 
  CreateQuestionTemplateInput, 
  CreateQuestionTemplateMutation, 
  CreateQuestionTemplateMutationVariables,
  GetQuestionTemplateQuery,
  GetQuestionTemplateQueryVariables,
  UpdateQuestionTemplateInput,
  UpdateQuestionTemplateMutation,
  UpdateQuestionTemplateMutationVariables,
  DeleteQuestionTemplateInput,
  DeleteQuestionTemplateMutation,
  DeleteQuestionTemplateMutationVariables
} from "../AWSMobileApi";
import { QuestionTemplateParser } from '../Parsers/QuestionTemplateParser';
import { IQuestionTemplate, AWSQuestionTemplate } from "../Models";
import { isNullOrUndefined, doesObjectHaveDate } from "../global";

export class QuestionTemplateAPIClient
  extends BaseAPIClient
  implements IQuestionTemplateAPIClient
{
  async createQuestionTemplate(createQuestionTemplateInput: CreateQuestionTemplateInput | IQuestionTemplate): Promise<IQuestionTemplate> {
    if (doesObjectHaveDate(createQuestionTemplateInput) && createQuestionTemplateInput.createdAt && createQuestionTemplateInput.updatedAt) {
      createQuestionTemplateInput = {
        ...createQuestionTemplateInput,
        createdAt: createQuestionTemplateInput.createdAt.toString(),
        updatedAt: createQuestionTemplateInput.updatedAt.toString()
      }
    }
    const variables: CreateQuestionTemplateMutationVariables = {input: createQuestionTemplateInput as CreateQuestionTemplateInput}
    const questionTemplate = await this.callGraphQL<CreateQuestionTemplateMutation>(
        createQuestionTemplate,
        variables
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
    const variables: GetQuestionTemplateQueryVariables = { id }
    const result = await this.callGraphQL<GetQuestionTemplateQuery>(
      getQuestionTemplate,
      { variables }
    )
    if (
      isNullOrUndefined(result.data) ||
      isNullOrUndefined(result.data.getQuestionTemplate)
    ) {
      throw new Error(`Failed to get question template`)
    }  
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(result.data.getQuestionTemplate as AWSQuestionTemplate);
  }

  async updateQuestionTemplate(updateQuestionTemplateInput: UpdateQuestionTemplateInput | IQuestionTemplate): Promise<IQuestionTemplate> {
    if (doesObjectHaveDate(updateQuestionTemplateInput) && updateQuestionTemplateInput.createdAt && updateQuestionTemplateInput.updatedAt) {
      updateQuestionTemplateInput = {
        ...updateQuestionTemplateInput,
        createdAt: updateQuestionTemplateInput.createdAt.toString(),
        updatedAt: updateQuestionTemplateInput.updatedAt.toString()
      }
    }
    const input: UpdateQuestionTemplateInput = updateQuestionTemplateInput as UpdateQuestionTemplateInput;
    const variables: UpdateQuestionTemplateMutationVariables = { input };
    const questionTemplate = await this.callGraphQL<UpdateQuestionTemplateMutation>(
        updateQuestionTemplate,
        variables
    );
    if (
        isNullOrUndefined(questionTemplate.data) ||
        isNullOrUndefined(questionTemplate.data.updateQuestionTemplate)
    ) {
        throw new Error(`Failed to update question template`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.updateQuestionTemplate as AWSQuestionTemplate);
  }

  async deleteQuestionTemplate(id: string): Promise<IQuestionTemplate> {
    const input: DeleteQuestionTemplateInput = {id};
    const variables: DeleteQuestionTemplateMutationVariables = { input };
    const questionTemplate = await this.callGraphQL<DeleteQuestionTemplateMutation>(
        deleteQuestionTemplate,
        variables
    );
    if (
        isNullOrUndefined(questionTemplate.data) ||
        isNullOrUndefined(questionTemplate.data.deleteQuestionTemplate)
    ) {
        throw new Error(`Failed to delete question template`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.deleteQuestionTemplate as AWSQuestionTemplate);
  }

  async listQuestionTemplates(limit: number, nextToken: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    try{
    let result = (await API.graphql(
        graphqlOperation(listQuestionTemplates, {limit: limit, nextToken })
    )) as { data: any }
    const parsedQuestionTemplates = result.data.listQuestionTemplates.items.map((questionTemplate: AWSQuestionTemplate) => {
        return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate)
    });
    const parsedNextToken = result.data.listQuestionTemplates.nextToken;
    return { questionTemplates: parsedQuestionTemplates, nextToken: parsedNextToken };
    } catch (e) {
        console.log(e);
        return null;
    }
  }
}