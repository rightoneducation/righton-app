import { BaseAPIClient, PublicPrivateType } from "../BaseAPIClient";
import { QuestionTemplateType, questionTemplateRuntimeMap, IQuestionTemplateAPIClient } from "./interfaces/IQuestionTemplateAPIClient";
import { IQuestionTemplate } from "../../Models";
import { QuestionTemplateParser } from "../../Parsers/QuestionTemplateParser";
import { AWSQuestionTemplate } from "../../Models";
import { isNullOrUndefined } from "../../global";
import { GraphQLOptions } from "../BaseAPIClient";

export class QuestionTemplateAPIClient
  extends BaseAPIClient
  implements IQuestionTemplateAPIClient
{
  async createQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    createQuestionTemplateInput: QuestionTemplateType<T>['create']['input'] | IQuestionTemplate
  ): Promise<IQuestionTemplate> {
    const variables: GraphQLOptions = { input: createQuestionTemplateInput as QuestionTemplateType<T>['create']['input'] };
    const queryFunction = questionTemplateRuntimeMap[type].create.queryFunction;
    const questionTemplate = await this.callGraphQL<QuestionTemplateType<T>['create']['query']>(
        queryFunction,
        variables
    ) as { data: any };
    if (
        isNullOrUndefined(questionTemplate?.data) ||
        isNullOrUndefined(questionTemplate?.data.createQuestionTemplate)
    ) {
        throw new Error(`Failed to create question template.`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.createQuestionTemplate as AWSQuestionTemplate);
  }

  async getQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<IQuestionTemplate> {
    try {
      const queryFunction = questionTemplateRuntimeMap[type].get.queryFunction;
      const result = await this.callGraphQL<QuestionTemplateType<T>['get']['query']>(
        queryFunction,
        { id } as unknown as GraphQLOptions
      ) as { data: any };
      if (
        isNullOrUndefined(result?.data) ||
        isNullOrUndefined(result?.data.getQuestionTemplate)
      ) {
        throw new Error(`Failed to get question template`);
      }
      return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(result.data.getQuestionTemplate as AWSQuestionTemplate);
    } catch (e) {
      console.log(e);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate({} as AWSQuestionTemplate);
  }

  async updateQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    updateQuestionTemplateInput: QuestionTemplateType<T>['update']['input']
  ): Promise<IQuestionTemplate> {
    const queryFunction = questionTemplateRuntimeMap[type].update.queryFunction;
    const variables: QuestionTemplateType<T>['update']['variables'] = { input: updateQuestionTemplateInput };
    const questionTemplate = await this.callGraphQL<QuestionTemplateType<T>['update']['query']>(
        queryFunction,
        variables
    ) as { data: any };
    if (
        isNullOrUndefined(questionTemplate?.data) ||
        isNullOrUndefined(questionTemplate?.data.updateQuestionTemplate)
    ) {
        throw new Error(`Failed to update question template`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.updateQuestionTemplate as AWSQuestionTemplate);
  }

  async deleteQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<boolean> {
    const queryFunction = questionTemplateRuntimeMap[type].delete.queryFunction;
    const input: QuestionTemplateType<T>['delete']['input'] = { id };
    const variables: QuestionTemplateType<T>['delete']['variables'] = { input };
    const result = await this.callGraphQL<QuestionTemplateType<T>['delete']['query']>(
        queryFunction,
        variables
    ) as { data: any };
    // if return is true, the delete was successful
    return (!isNullOrUndefined(result));
  }

  async listQuestionTemplates<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.default;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", queryFunction, "listQuestionTemplates");
    return response;
  }

  async listQuestionTemplatesByDate<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byDate;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", queryFunction, "questionTemplatesByDate");
    return response;
  }

  async listQuestionTemplatesByGrade<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byGrade;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", queryFunction, "questionTemplatesByGrade");
    return response;
  }

  async listQuestionTemplatesByGameTemplatesCount<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byGameTemplatesCount;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, "QuestionTemplate", queryFunction, "questionTemplatesByGameTemplatesCount");
    return response;
  }
}