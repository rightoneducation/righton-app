import { IQuestionTemplate } from "../../../Models";
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
  public: {
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
  private: {
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

export type QuestionTemplateType<T extends 'public' | 'private'> = T extends 'public' ? IPublicQuestionTemplate : IPrivateQuestionTemplate;

export interface IQuestionTemplateAPIClient {
  createQuestionTemplate<T extends 'public' | 'private'>(
    type: T,
    createQuestionTemplateInput: QuestionTemplateType<T>['create']['input'] | IQuestionTemplate
  ): Promise<IQuestionTemplate>;

  getQuestionTemplate<T extends 'public' | 'private'>(
    type: T,
    id: string
  ): Promise<IQuestionTemplate>;

  updateQuestionTemplate<T extends 'public' | 'private'>(
    type: T,
    updateQuestionTemplateInput: QuestionTemplateType<T>['update']['input'] | IQuestionTemplate
  ): Promise<IQuestionTemplate>;

  deleteQuestionTemplate<T extends 'public' | 'private'>(
    type: T,
    id: string
  ): Promise<boolean>;

  listQuestionTemplates<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByDate<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByGrade<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByGameTemplatesCount<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;
}
