import { uploadData, UploadDataWithPathOutput } from 'aws-amplify/storage';
import { BaseAPIClient, PublicPrivateType, TemplateType, GradeTarget } from "../BaseAPIClient";
import { QuestionTemplateType, questionTemplateRuntimeMap, IQuestionTemplateAPIClient } from "./interfaces/IQuestionTemplateAPIClient";
import { CentralQuestionTemplateInput, IQuestionTemplate } from "../../Models";
import { QuestionTemplateParser } from "../../Parsers/QuestionTemplateParser";
import { AWSQuestionTemplate } from "../../Models";
import { isNullOrUndefined } from "../../global";
import { GraphQLOptions } from "../BaseAPIClient";
import { UploadExternalImageToS3Input, UploadExternalImageToS3Mutation, UploadExternalImageToS3MutationVariables } from '../../AWSMobileApi';
import { uploadExternalImageToS3 } from '../../graphql';

interface MimeTypes {
  [key: string]: string;
}


export class QuestionTemplateAPIClient
  extends BaseAPIClient
  implements IQuestionTemplateAPIClient
{
  async createQuestionTemplate<T extends TemplateType>(
    type: T,
    imageUrl: string,
    userId: string,
    createQuestionTemplateInput: CentralQuestionTemplateInput
  ): Promise<IQuestionTemplate> {
    const parsedInput = QuestionTemplateParser.centralQuestionTemplateInputToIQuestionTemplate<T>(imageUrl, userId, createQuestionTemplateInput);
    const questionTemplateInput = {...parsedInput, publicPrivateType: type} as QuestionTemplateType<T>['create']['input'];
    const variables: GraphQLOptions = { input: questionTemplateInput };
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

  // function to store image as a File in S3
  async storeImageInS3 (
    image: File
  ): Promise<UploadDataWithPathOutput> {
    const mimeTypes: MimeTypes = {
      'image/jpeg': '.jpeg',
      'image/jpg': '.jpg',
      'image/png': '.png',
    };
    const extension = mimeTypes[image.type] || '';
    const filename = `image_${Date.now()}${extension}`
    return uploadData({path: filename, data: image, options: {contentType: image.type}});
  };

  // function to store imageUrl as a File in S3
  // image is fetched via a server-side proxy to avoid CORS issues
  async storeImageUrlInS3 (
    imageUrl: string
  ): Promise<string> {
    const input: UploadExternalImageToS3Input = {imageUrl};
    const variables: UploadExternalImageToS3MutationVariables = { input }
    const response = await this.callGraphQL<UploadExternalImageToS3Mutation>(
        uploadExternalImageToS3,
        variables as unknown as GraphQLOptions
    )
    if (
        isNullOrUndefined(response?.data) ||
        isNullOrUndefined(response?.data.uploadExternalImageToS3)
    ) {
        throw new Error(`Failed to store image in S3`);
    }
    return response.data.uploadExternalImageToS3;
  }

  async getQuestionTemplate<T extends TemplateType>(
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

  async getQuestionTemplateJoinTableIds<T extends TemplateType>(
    type: T,
    id: string
  ): Promise<string[]> {
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
      const joinIds =
        result?.data?.[getType]?.gameTemplates?.items?.map(
          (item: { id: string }) => item.id
        ) ?? [];
      return joinIds;
    } catch (e) {
      console.log(e);
    }
    return [];
  }

  async updateQuestionTemplate<T extends TemplateType>(
    type: T,
    imageUrl: string,
    userId: string,
    updateQuestionTemplateInput: CentralQuestionTemplateInput,
    questionId: string
  ): Promise<IQuestionTemplate> {
    const parsedInput = QuestionTemplateParser.centralQuestionTemplateInputToIQuestionTemplate<T>(imageUrl, userId, updateQuestionTemplateInput, questionId);
    // For draft questions, set finalPublicPrivateType from the input's publicPrivateType
    const questionTemplateInput = type === PublicPrivateType.DRAFT
      ? {...parsedInput, finalPublicPrivateType: updateQuestionTemplateInput.publicPrivateType} as QuestionTemplateType<T>['update']['input']
      : parsedInput as QuestionTemplateType<T>['update']['input'];
    const variables: GraphQLOptions = { input: questionTemplateInput };
    const queryFunction = questionTemplateRuntimeMap[type].update.queryFunction;
    const updateType = `update${type}QuestionTemplate`;
    const questionTemplate = await this.callGraphQL<QuestionTemplateType<T>['update']['query']>(
        queryFunction,
        variables
    ) as { data: any };
    if (
        isNullOrUndefined(questionTemplate?.data) 
    ) {
        throw new Error(`Failed to update question template`);
    }
    return QuestionTemplateParser.questionTemplateFromAWSQuestionTemplate(questionTemplate.data[updateType] as AWSQuestionTemplate, type);
  }

  async deleteQuestionTemplate<T extends TemplateType>(
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

  async listQuestionTemplates<T extends TemplateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.default;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `list${type}QuestionTemplates`, queryFunction, type, gradeTargets, favIds);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByDate<T extends TemplateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byDate;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByDate`, queryFunction, type, gradeTargets, favIds);

    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByGrade<T extends TemplateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byGrade;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByGrade`, queryFunction, type, gradeTargets, favIds);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByGameTemplatesCount<T extends TemplateType>(
    type: T,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.byGameTemplatesCount;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByGameTemplatesCount`, queryFunction, type, gradeTargets, favIds);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByUserDate(
    type: typeof PublicPrivateType.PUBLIC,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    userId: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.libByUserDate;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByUserDate`, queryFunction, type, gradeTargets, favIds, false, userId);

    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByUserGrade(
    type: typeof PublicPrivateType.PUBLIC,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    userId: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.libByUserGrade;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByUserGrade`, queryFunction, type, gradeTargets, favIds, false, userId);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }

  async listQuestionTemplatesByUserPublicGameTemplatesCount(
    type: typeof PublicPrivateType.PUBLIC,
    limit: number,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    userId: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string } | null> {
    const queryFunction = questionTemplateRuntimeMap[type].list.queryFunction.libByUserQuestionTemplatesCount;
    const awsType = `${type}QuestionTemplate`;
    const response = await this.executeQuery(limit, nextToken, sortDirection, filterString, awsType, `${type.toLowerCase()}QuestionTemplatesByUserPublicGameTemplatesCount`, queryFunction, type, gradeTargets, favIds, false, userId);
    return response as { questionTemplates: IQuestionTemplate[]; nextToken: string; };
  }
}