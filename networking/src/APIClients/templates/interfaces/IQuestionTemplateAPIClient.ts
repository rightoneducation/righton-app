import { UploadDataWithPathOutput } from 'aws-amplify/storage';
import { PublicPrivateType, GradeTarget } from "../../BaseAPIClient";
import { CentralQuestionTemplateInput, IQuestionTemplate } from "../../../Models";
import {
  createPublicQuestionTemplate,
  createPrivateQuestionTemplate,
  getPublicQuestionTemplate,
  getPrivateQuestionTemplate,
  updatePublicQuestionTemplate,
  updatePrivateQuestionTemplate,
  deletePublicQuestionTemplate,
  deletePrivateQuestionTemplate,
  listPublicQuestionTemplates,
  publicQuestionTemplatesByDate,
  publicQuestionTemplatesByGrade,
  publicQuestionTemplatesByPublicGameTemplatesCount,
  listPrivateQuestionTemplates,
  privateQuestionTemplatesByDate,
  privateQuestionTemplatesByGrade,
  privateQuestionTemplatesByPrivateGameTemplatesCount
} from "../../../graphql";
import {
  CreatePublicQuestionTemplateInput,
  CreatePublicQuestionTemplateMutationVariables,
  CreatePublicQuestionTemplateMutation,
  CreatePrivateQuestionTemplateInput,
  CreatePrivateQuestionTemplateMutationVariables,
  CreatePrivateQuestionTemplateMutation,
  GetPublicQuestionTemplateQueryVariables,
  GetPublicQuestionTemplateQuery,
  GetPrivateQuestionTemplateQueryVariables,
  GetPrivateQuestionTemplateQuery,
  UpdatePublicQuestionTemplateInput,
  UpdatePublicQuestionTemplateMutationVariables,
  UpdatePublicQuestionTemplateMutation,
  UpdatePrivateQuestionTemplateInput,
  UpdatePrivateQuestionTemplateMutationVariables,
  UpdatePrivateQuestionTemplateMutation,
  DeletePublicQuestionTemplateInput,
  DeletePublicQuestionTemplateMutationVariables,
  DeletePublicQuestionTemplateMutation,
  DeletePrivateQuestionTemplateInput,
  DeletePrivateQuestionTemplateMutationVariables,
  DeletePrivateQuestionTemplateMutation,
  ListPublicQuestionTemplatesQueryVariables,
  ListPublicQuestionTemplatesQuery,
  ListPrivateQuestionTemplatesQueryVariables,
  ListPrivateQuestionTemplatesQuery
} from "../../../AWSMobileApi";

export interface IPublicQuestionTemplate {
  create: {
    input: CreatePublicQuestionTemplateInput;
    variables: CreatePublicQuestionTemplateMutationVariables;
    query: CreatePublicQuestionTemplateMutation;
  },
  get: {
    variables: GetPublicQuestionTemplateQueryVariables;
    query: GetPublicQuestionTemplateQuery;
  },
  update: {
    input: UpdatePublicQuestionTemplateInput;
    variables: UpdatePublicQuestionTemplateMutationVariables;
    query: UpdatePublicQuestionTemplateMutation;
  },
  delete: {
    input: DeletePublicQuestionTemplateInput;
    variables: DeletePublicQuestionTemplateMutationVariables;
    query: DeletePublicQuestionTemplateMutation;
  },
  list: {
    variables: ListPublicQuestionTemplatesQueryVariables;
    query: ListPublicQuestionTemplatesQuery;
  }
}

export interface IPrivateQuestionTemplate {
  create: {
    input: CreatePrivateQuestionTemplateInput;
    variables: CreatePrivateQuestionTemplateMutationVariables;
    query: CreatePrivateQuestionTemplateMutation;
  },
  get: {
    variables: GetPrivateQuestionTemplateQueryVariables;
    query: GetPrivateQuestionTemplateQuery;
  },
  update: {
    input: UpdatePrivateQuestionTemplateInput;
    variables: UpdatePrivateQuestionTemplateMutationVariables;
    query: UpdatePrivateQuestionTemplateMutation;
  },
  delete: {
    input: DeletePrivateQuestionTemplateInput;
    variables: DeletePrivateQuestionTemplateMutationVariables;
    query: DeletePrivateQuestionTemplateMutation;
  },
  list: {
    variables: ListPrivateQuestionTemplatesQueryVariables;
    query: ListPrivateQuestionTemplatesQuery;
  }
}

export const questionTemplateRuntimeMap = {
  Public: {
    create: {
      queryFunction: createPublicQuestionTemplate,
    },
    get: {
      queryFunction: getPublicQuestionTemplate,
    },
    update: {
      queryFunction: updatePublicQuestionTemplate,
    },
    delete: {
      queryFunction: deletePublicQuestionTemplate,
    },
    list: {
      queryFunction: {
        default: listPublicQuestionTemplates,
        byDate: publicQuestionTemplatesByDate,
        byGrade: publicQuestionTemplatesByGrade,
        byGameTemplatesCount: publicQuestionTemplatesByPublicGameTemplatesCount
      },
    },
  },
  Private: {
    create: {
      queryFunction: createPrivateQuestionTemplate,
    },
    get: {
      queryFunction: getPrivateQuestionTemplate,
    },
    update: {
      queryFunction: updatePrivateQuestionTemplate,
    },
    delete: {
      queryFunction: deletePrivateQuestionTemplate,
    },
    list: {
      queryFunction: {
        default: listPrivateQuestionTemplates,
        byDate: privateQuestionTemplatesByDate,
        byGrade: privateQuestionTemplatesByGrade,
        byGameTemplatesCount: privateQuestionTemplatesByPrivateGameTemplatesCount
      },
    },
  }
}

export type QuestionTemplateType<T extends PublicPrivateType> = T extends 'Public' ? IPublicQuestionTemplate : IPrivateQuestionTemplate;

export interface IQuestionTemplateAPIClient {
  createQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    imageUrl: string,
    createQuestionTemplateInput: CentralQuestionTemplateInput
  ): Promise<IQuestionTemplate>;

  storeImageInS3(
    image: File,
  ): Promise<UploadDataWithPathOutput>;

  storeImageUrlInS3(
    imageUrl: string,
  ): Promise<string>;

  getQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<IQuestionTemplate>;

  updateQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    updateQuestionTemplateInput: QuestionTemplateType<T>['update']['input'] | IQuestionTemplate
  ): Promise<IQuestionTemplate>;

  deleteQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<boolean>;

  listQuestionTemplates<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByDate<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByGrade<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByGameTemplatesCount<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[]
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;
}
