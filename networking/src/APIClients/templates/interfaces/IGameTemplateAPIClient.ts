import { PublicPrivateType, TemplateType, GradeTarget } from "../../BaseAPIClient";
import { UploadDataWithPathOutput } from 'aws-amplify/storage';
import { IGameTemplate } from "../../../Models";
import { 
  createPublicGameTemplate,
  createPrivateGameTemplate,
  createDraftGameTemplate,
  getPublicGameTemplate,
  getPrivateGameTemplate,
  getDraftGameTemplate,
  updatePublicGameTemplate,
  updatePrivateGameTemplate,
  updateDraftGameTemplate,
  deletePublicGameTemplate,
  deletePrivateGameTemplate,
  deleteDraftGameTemplate,
  listPublicGameTemplates,
  publicGameTemplatesByDate,
  publicGameTemplatesByGrade,
  publicGameTemplatesByPublicQuestionTemplatesCount,
  publicGameTemplatesByUserDate,
  publicGameTemplatesByUserGrade,
  publicGameTemplatesByUserPublicQuestionTemplatesCount,
  listPrivateGameTemplates,
  privateGameTemplatesByDate,
  privateGameTemplatesByGrade,
  privateGameTemplatesByPrivateQuestionTemplatesCount,
  listDraftGameTemplates,
  draftGameTemplatesByDate,
  draftGameTemplatesByGrade,
  draftGameTemplatesByDraftQuestionTemplatesCount
} from "../../../graphql";
import {
  CreatePublicGameTemplateInput,
  CreatePublicGameTemplateMutationVariables,
  CreatePublicGameTemplateMutation,
  CreatePrivateGameTemplateInput,
  CreatePrivateGameTemplateMutationVariables,
  CreatePrivateGameTemplateMutation,
  CreateDraftGameTemplateInput,
  CreateDraftGameTemplateMutationVariables,
  CreateDraftGameTemplateMutation,
  GetPublicGameTemplateQueryVariables,
  GetPublicGameTemplateQuery,
  GetPrivateGameTemplateQueryVariables,
  GetPrivateGameTemplateQuery,
  GetDraftGameTemplateQueryVariables,
  GetDraftGameTemplateQuery,
  UpdatePublicGameTemplateInput,
  UpdatePublicGameTemplateMutationVariables,
  UpdatePublicGameTemplateMutation,
  UpdatePrivateGameTemplateInput,
  UpdatePrivateGameTemplateMutationVariables,
  UpdatePrivateGameTemplateMutation,
  UpdateDraftGameTemplateInput,
  UpdateDraftGameTemplateMutationVariables,
  UpdateDraftGameTemplateMutation,
  DeletePublicGameTemplateInput,
  DeletePublicGameTemplateMutationVariables,
  DeletePublicGameTemplateMutation,
  DeletePrivateGameTemplateInput,
  DeletePrivateGameTemplateMutationVariables,
  DeletePrivateGameTemplateMutation,
  DeleteDraftGameTemplateInput,
  DeleteDraftGameTemplateMutationVariables,
  DeleteDraftGameTemplateMutation,
  ListPublicGameTemplatesQueryVariables,
  ListPublicGameTemplatesQuery,
  ListPrivateGameTemplatesQueryVariables,
  ListPrivateGameTemplatesQuery,
  ListDraftGameTemplatesQueryVariables,
  ListDraftGameTemplatesQuery
} from "../../../AWSMobileApi";

export interface IPublicGameTemplate {
  create: {
    input: CreatePublicGameTemplateInput;
    variables: CreatePublicGameTemplateMutationVariables;
    query: CreatePublicGameTemplateMutation;
  },
  get: {
    variables: GetPublicGameTemplateQueryVariables;
    query: GetPublicGameTemplateQuery;
  },
  update: {
    input: UpdatePublicGameTemplateInput;
    variables: UpdatePublicGameTemplateMutationVariables;
    query: UpdatePublicGameTemplateMutation;
  },
  delete: {
    input: DeletePublicGameTemplateInput;
    variables: DeletePublicGameTemplateMutationVariables;
    query: DeletePublicGameTemplateMutation;
  },
  list: {
    variables: ListPublicGameTemplatesQueryVariables;
    query: ListPublicGameTemplatesQuery;
  }
}

export interface IPrivateGameTemplate {
  create: {
    input: CreatePrivateGameTemplateInput;
    variables: CreatePrivateGameTemplateMutationVariables;
    query: CreatePrivateGameTemplateMutation;
  },
  get: {
    variables: GetPrivateGameTemplateQueryVariables;
    query: GetPrivateGameTemplateQuery;
  },
  update: {
    input: UpdatePrivateGameTemplateInput;
    variables: UpdatePrivateGameTemplateMutationVariables;
    query: UpdatePrivateGameTemplateMutation;
  },
  delete: {
    input: DeletePrivateGameTemplateInput;
    variables: DeletePrivateGameTemplateMutationVariables;
    query: DeletePrivateGameTemplateMutation;
  },
  list: {
    variables: ListPrivateGameTemplatesQueryVariables;
    query: ListPrivateGameTemplatesQuery;
  }
}


export interface IDraftGameTemplate {
  create: {
    input: CreateDraftGameTemplateInput;
    variables: CreateDraftGameTemplateMutationVariables;
    query: CreateDraftGameTemplateMutation;
  },
  get: {
    variables: GetDraftGameTemplateQueryVariables;
    query: GetDraftGameTemplateQuery;
  },
  update: {
    input: UpdateDraftGameTemplateInput;
    variables: UpdateDraftGameTemplateMutationVariables;
    query: UpdateDraftGameTemplateMutation;
  },
  delete: {
    input: DeleteDraftGameTemplateInput;
    variables: DeleteDraftGameTemplateMutationVariables;
    query: DeleteDraftGameTemplateMutation;
  },
  list: {
    variables: ListDraftGameTemplatesQueryVariables;
    query: ListDraftGameTemplatesQuery;
  }
}

export const gameTemplateRuntimeMap = {
  Public: {
    create: {
      queryFunction: createPublicGameTemplate,
    },
    get: {
      queryFunction: getPublicGameTemplate,
    },
    update: {
      queryFunction: updatePublicGameTemplate,
    },
    delete: {
      queryFunction: deletePublicGameTemplate,
    },
    list: {
      queryFunction: {
        default: listPublicGameTemplates,
        byDate: publicGameTemplatesByDate,
        byGrade: publicGameTemplatesByGrade,
        byQuestionTemplatesCount: publicGameTemplatesByPublicQuestionTemplatesCount,
        libByUserDate: publicGameTemplatesByUserDate,
        libByUserGrade: publicGameTemplatesByUserGrade,
        libByUserQuestionTemplatesCount: publicGameTemplatesByUserPublicQuestionTemplatesCount
      },
    },
  },
  Private: {
    create: {
      queryFunction: createPrivateGameTemplate,
    },
    get: {
      queryFunction: getPrivateGameTemplate,
    },
    update: {
      queryFunction: updatePrivateGameTemplate,
    },
    delete: {
      queryFunction: deletePrivateGameTemplate,
    },
    list: {
      queryFunction: {
        default: listPrivateGameTemplates,
        byDate: privateGameTemplatesByDate,
        byGrade: privateGameTemplatesByGrade,
        byQuestionTemplatesCount: privateGameTemplatesByPrivateQuestionTemplatesCount
      },
    },
  },
  Draft: {
    create: {
      queryFunction: createDraftGameTemplate,
    },
    get: {
      queryFunction: getDraftGameTemplate,
    },
    update: {
      queryFunction: updateDraftGameTemplate,
    },
    delete: {
      queryFunction: deleteDraftGameTemplate,
    },
    list: {
      queryFunction: {
        default: listDraftGameTemplates,
        byDate: draftGameTemplatesByDate,
        byGrade: draftGameTemplatesByGrade,
        byQuestionTemplatesCount: draftGameTemplatesByDraftQuestionTemplatesCount
      },
    },
  }
}

export type GameTemplateType<T extends TemplateType> =
  T extends PublicPrivateType.PUBLIC ? IPublicGameTemplate :
  T extends PublicPrivateType.PRIVATE ? IPrivateGameTemplate :
  IDraftGameTemplate;

export interface IGameTemplateAPIClient {
  createGameTemplate<T extends TemplateType>(
    type: T,
    createGameTemplateInput: GameTemplateType<T>['create']['input'] | IGameTemplate
  ): Promise<IGameTemplate>;

  storeImageInS3(
    image: File,
  ): Promise<UploadDataWithPathOutput>;
  
  storeImageUrlInS3(
    imageUrl: string,
  ): Promise<string>;
  

  getGameTemplate<T extends TemplateType>(
    type: T,
    id: string
  ): Promise<IGameTemplate>;

  updateGameTemplate<T extends TemplateType>(
    type: T,
    updateGameTemplateInput: GameTemplateType<T>['update']['input'] | IGameTemplate
  ): Promise<IGameTemplate>;

  deleteGameTemplate<T extends TemplateType>(
    type: T,
    id: string
  ): Promise<boolean>;

  listGameTemplates<T extends TemplateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    isExploreGames?: boolean
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByDate<T extends TemplateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByGrade<T extends TemplateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByQuestionTemplatesCount<T extends TemplateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByFavorite<T extends TemplateType>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    favIds: string[]
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByUserDate(
    type: typeof PublicPrivateType.PUBLIC,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    userId: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByUserGrade(
    type: typeof PublicPrivateType.PUBLIC,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    userId: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByUserPublicQuestionTemplatesCount(
    type: typeof PublicPrivateType.PUBLIC,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
    favIds: string[] | null,
    userId: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}