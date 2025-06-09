import { UploadDataWithPathOutput } from 'aws-amplify/storage';
import { PublicPrivateType, GradeTarget } from "../../BaseAPIClient";
import { CentralQuestionTemplateInput, IQuestionTemplate } from "../../../Models";
import {
  createPublicQuestionTemplate,
  createPrivateQuestionTemplate,
  createDraftQuestionTemplate,
  getPublicQuestionTemplate,
  getPrivateQuestionTemplate,
  getDraftQuestionTemplate,
  updatePublicQuestionTemplate,
  updatePrivateQuestionTemplate,
  updateDraftQuestionTemplate,
  deletePublicQuestionTemplate,
  deletePrivateQuestionTemplate,
  deleteDraftQuestionTemplate,
  listPublicQuestionTemplates,
  publicQuestionTemplatesByDate,
  publicQuestionTemplatesByGrade,
  publicQuestionTemplatesByPublicGameTemplatesCount,
  listPrivateQuestionTemplates,
  privateQuestionTemplatesByDate,
  privateQuestionTemplatesByGrade,
  privateQuestionTemplatesByPrivateGameTemplatesCount,
  listDraftQuestionTemplates,
  draftQuestionTemplatesByDate,
  draftQuestionTemplatesByGrade,
  draftQuestionTemplatesByDraftGameTemplatesCount
} from "../../../graphql";
import {
  CreatePublicQuestionTemplateInput,
  CreatePublicQuestionTemplateMutationVariables,
  CreatePublicQuestionTemplateMutation,
  CreatePrivateQuestionTemplateInput,
  CreatePrivateQuestionTemplateMutationVariables,
  CreatePrivateQuestionTemplateMutation,
  CreateDraftQuestionTemplateInput,
  CreateDraftQuestionTemplateMutationVariables,
  CreateDraftQuestionTemplateMutation,
  GetPublicQuestionTemplateQueryVariables,
  GetPublicQuestionTemplateQuery,
  GetPrivateQuestionTemplateQueryVariables,
  GetPrivateQuestionTemplateQuery,
  GetDraftQuestionTemplateQueryVariables,
  GetDraftQuestionTemplateQuery,
  UpdatePublicQuestionTemplateInput,
  UpdatePublicQuestionTemplateMutationVariables,
  UpdatePublicQuestionTemplateMutation,
  UpdatePrivateQuestionTemplateInput,
  UpdatePrivateQuestionTemplateMutationVariables,
  UpdatePrivateQuestionTemplateMutation,
  UpdateDraftQuestionTemplateInput,
  UpdateDraftQuestionTemplateMutationVariables,
  UpdateDraftQuestionTemplateMutation,
  DeletePublicQuestionTemplateInput,
  DeletePublicQuestionTemplateMutationVariables,
  DeletePublicQuestionTemplateMutation,
  DeletePrivateQuestionTemplateInput,
  DeletePrivateQuestionTemplateMutationVariables,
  DeletePrivateQuestionTemplateMutation,
  DeleteDraftQuestionTemplateInput,
  DeleteDraftQuestionTemplateMutationVariables,
  DeleteDraftQuestionTemplateMutation,
  ListPublicQuestionTemplatesQueryVariables,
  ListPublicQuestionTemplatesQuery,
  ListPrivateQuestionTemplatesQueryVariables,
  ListPrivateQuestionTemplatesQuery,
  ListDraftQuestionTemplatesQueryVariables,
  ListDraftQuestionTemplatesQuery
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

export interface IDraftQuestionTemplate {
  create: {
    input: CreateDraftQuestionTemplateInput;
    variables: CreateDraftQuestionTemplateMutationVariables;
    query: CreateDraftQuestionTemplateMutation;
  },
  get: {
    variables: GetDraftQuestionTemplateQueryVariables;
    query: GetDraftQuestionTemplateQuery;
  },
  update: {
    input: UpdateDraftQuestionTemplateInput;
    variables: UpdateDraftQuestionTemplateMutationVariables;
    query: UpdateDraftQuestionTemplateMutation;
  },
  delete: {
    input: DeleteDraftQuestionTemplateInput;
    variables: DeleteDraftQuestionTemplateMutationVariables;
    query: DeleteDraftQuestionTemplateMutation;
  },
  list: {
    variables: ListDraftQuestionTemplatesQueryVariables;
    query: ListDraftQuestionTemplatesQuery;
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
  },
  Draft: {
    create: {
      queryFunction: createDraftQuestionTemplate,
    },
    get: {
      queryFunction: getDraftQuestionTemplate,
    },
    update: {
      queryFunction: updateDraftQuestionTemplate,
    },
    delete: {
      queryFunction: deleteDraftQuestionTemplate,
    },
    list: {
      queryFunction: {
        default: listDraftQuestionTemplates,
        byDate: draftQuestionTemplatesByDate,
        byGrade: draftQuestionTemplatesByGrade,
        byGameTemplatesCount: draftQuestionTemplatesByDraftGameTemplatesCount
      }
   }
  }
}

export type QuestionTemplateType<T extends PublicPrivateType> =
  T extends "Public" ? IPublicQuestionTemplate :
  T extends "Private" ? IPrivateQuestionTemplate :
  IDraftQuestionTemplate;


export interface IQuestionTemplateAPIClient {
  createQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    imageUrl: string,
    userId: string,
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

  getQuestionTemplateJoinTableIds<T extends PublicPrivateType>(
    type: T,
    id: string
  ): Promise<string[]>;

  updateQuestionTemplate<T extends PublicPrivateType>(
    type: T,
    imageUrl: string,
    userId: string,
    updateQuestionTemplateInput: CentralQuestionTemplateInput,
    questionId: string
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
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByDate<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByGrade<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;

  listQuestionTemplatesByGameTemplatesCount<T extends PublicPrivateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ questionTemplates: IQuestionTemplate[], nextToken: string | null } | null>;
}
