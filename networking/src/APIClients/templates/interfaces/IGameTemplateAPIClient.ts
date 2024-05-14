import { IGameTemplate } from "../../../Models";
import { 
  createPublicGameTemplate,
  createPrivateGameTemplate,
  getPublicGameTemplate,
  getPrivateGameTemplate,
  updatePublicGameTemplate,
  updatePrivateGameTemplate,
  deletePublicGameTemplate,
  deletePrivateGameTemplate,
  listPublicGameTemplates,
  publicGameTemplatesByDate,
  publicGameTemplatesByGrade,
  publicGameTemplatesByPublicQuestionTemplatesCount,
  listPrivateGameTemplates,
  privateGameTemplatesByDate,
  privateGameTemplatesByGrade,
  privateGameTemplatesByPrivateQuestionTemplatesCount
} from "../../../graphql";
import {
  CreatePublicGameTemplateInput,
  CreatePublicGameTemplateMutationVariables,
  CreatePublicGameTemplateMutation,
  CreatePrivateGameTemplateInput,
  CreatePrivateGameTemplateMutationVariables,
  CreatePrivateGameTemplateMutation,
  GetPublicGameTemplateQueryVariables,
  GetPublicGameTemplateQuery,
  GetPrivateGameTemplateQueryVariables,
  GetPrivateGameTemplateQuery,
  UpdatePublicGameTemplateInput,
  UpdatePublicGameTemplateMutationVariables,
  UpdatePublicGameTemplateMutation,
  UpdatePrivateGameTemplateInput,
  UpdatePrivateGameTemplateMutationVariables,
  UpdatePrivateGameTemplateMutation,
  DeletePublicGameTemplateInput,
  DeletePublicGameTemplateMutationVariables,
  DeletePublicGameTemplateMutation,
  DeletePrivateGameTemplateInput,
  DeletePrivateGameTemplateMutationVariables,
  DeletePrivateGameTemplateMutation,
  ListPublicGameTemplatesQueryVariables,
  ListPublicGameTemplatesQuery,
  ListPrivateGameTemplatesQueryVariables,
  ListPrivateGameTemplatesQuery
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

export const gameTemplateRuntimeMap = {
  public: {
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
        byQuestionTemplatesCount: publicGameTemplatesByPublicQuestionTemplatesCount
      },
    },
  },
  private: {
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
  }

}

export type GameTemplateType<T extends 'public' | 'private'> = T extends 'public' ? IPublicGameTemplate : IPrivateGameTemplate;

export interface IGameTemplateAPIClient {
  createGameTemplate<T extends 'public' | 'private'>(
    type: T,
    createGameTemplateInput: GameTemplateType<T>['create']['input'] | IGameTemplate
  ): Promise<IGameTemplate>;

  getGameTemplate<T extends 'public' | 'private'>(
    type: T,
    id: string
  ): Promise<IGameTemplate>;

  updateGameTemplate<T extends 'public' | 'private'>(
    type: T,
    updateGameTemplateInput: GameTemplateType<T>['update']['input'] | IGameTemplate
  ): Promise<IGameTemplate>;

  deleteGameTemplate<T extends 'public' | 'private'>(
    type: T,
    id: string
  ): Promise<boolean>;

  listGameTemplates<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByDate<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByGrade<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByQuestionTemplatesCount<T extends 'public' | 'private'>(
    type: T,
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}