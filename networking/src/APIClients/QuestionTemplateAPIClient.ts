import { API, graphqlOperation } from "aws-amplify";
import { BaseAPIClient } from "./BaseAPIClient";
import { IQuestionTemplateAPIClient } from "./interfaces";
import { createQuestionTemplate, listQuestionTemplates } from "../graphql";
import { CreateQuestionTemplateInput, CreateQuestionTemplateMutation, CreateQuestionTemplateMutationVariables } from "../AWSMobileApi";
import { QuestionTemplateParser } from '../Parsers/QuestionTemplateParser';
import { IQuestionTemplate, AWSQuestionTemplate } from "../Models";
import { isNullOrUndefined } from "../IApiClient";

export default class QuestionTemplateAPIClient
  extends BaseAPIClient
  implements IQuestionTemplateAPIClient
{
  async createQuestionTemplate(inputParams: CreateQuestionTemplateInput): Promise<IQuestionTemplate | null> {
    const variables: CreateQuestionTemplateMutationVariables = {input: inputParams}
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

  async listQuestionTemplates(limit: number, nextToken: string | null): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    try{
    let result = (await API.graphql(
        graphqlOperation(listQuestionTemplates, {limit: limit, nextToken })
    )) as { data: any }
    const parsedQuestionTemplates = result.data.listQuestionTemplates.items.map((questionTemplate: AWSQuestionTemplate) => {
        return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate)
    });
    const parsedNextToken = result.data.listQuestionTemplates.nextToken;
    console.log(result);
    return { questionTemplates: parsedQuestionTemplates, nextToken: parsedNextToken };
    } catch (e) {
        console.log(e);
        return null;
    }
  }
}