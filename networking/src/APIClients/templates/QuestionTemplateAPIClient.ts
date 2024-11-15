import { uploadData } from 'aws-amplify/storage';
import { BaseAPIClient, PublicPrivateType, GradeTarget } from "../BaseAPIClient";
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
    const createType = `create${type}QuestionTemplate`;
    const questionTemplate = await this.callGraphQL<QuestionTemplateType<T>['create']['query']>(
        queryFunction,
        variables
    ) as { data: any };
    
    if (
        isNullOrUndefined(questionTemplate?.data)
    ) {
        throw new Error(`Failed to create question template.`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data[createType] as AWSQuestionTemplate, type);
  }

  async storeImageInS3 (image: File) {
    uploadData({path: image.name, data: image, options: {contentType: image.type}});
  };

  async getQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<IQuestionTemplate> {
    try {
      const queryFunction = questionTemplateRuntimeMap[type].get.queryFunction;
      const getType = `get${type}QuestionTemplate`;
      const result = await this.callGraphQL<QuestionTemplateType<T>['get']['query']>(
        queryFunction,
        { id } as unknown as GraphQLOptions
      ) as { data: any };
      if (
        isNullOrUndefined(result?.data)
      ) {
        throw new Error(`Failed to get question template`);
      }
      return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(result.data[getType] as AWSQuestionTemplate, type);
    } catch (e) {
      console.log(e);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate({} as AWSQuestionTemplate, type);
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
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data.updateQuestionTemplate as AWSQuestionTemplate, type);
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
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.default;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `list${type}QuestionTemplates`, queryFunction, type, gradeTargets);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByDate<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byDate;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByDate`, queryFunction, type, gradeTargets);

    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByGrade<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byGrade;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByGrade`, queryFunction, type, gradeTargets);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByGameTemplatesCount<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byGameTemplatesCount;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByGameTemplatesCount`, queryFunction, type, gradeTargets);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }
}