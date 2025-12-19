import { PublicPrivateType } from "../../BaseAPIClient";
import { IGameQuestion } from "../../../Models";
import { 
  CreatePublicGameQuestionsInput, 
  CreatePrivateGameQuestionsInput,
  CreateDraftGameQuestionsInput,
  CreatePublicGameQuestionsMutationVariables,
  CreatePublicGameQuestionsMutation,
  CreatePrivateGameQuestionsMutationVariables,
  CreatePrivateGameQuestionsMutation,
  CreateDraftGameQuestionsMutationVariables,
  CreateDraftGameQuestionsMutation,
  GetPublicGameQuestionsQuery,
  GetPublicGameQuestionsQueryVariables,
  GetPrivateGameQuestionsQuery,
  GetPrivateGameQuestionsQueryVariables,
  GetDraftGameQuestionsQuery,
  GetDraftGameQuestionsQueryVariables,
  DeletePublicGameQuestionsInput,
  DeletePublicGameQuestionsMutationVariables,
  DeletePublicGameQuestionsMutation,
  DeletePrivateGameQuestionsInput,
  DeletePrivateGameQuestionsMutationVariables,
  DeletePrivateGameQuestionsMutation,
  DeleteDraftGameQuestionsInput,
  DeleteDraftGameQuestionsMutationVariables,
  DeleteDraftGameQuestionsMutation,
  ListPublicGameQuestionsQueryVariables,
  ListPublicGameQuestionsQuery,
  ListPrivateGameQuestionsQueryVariables,
  ListPrivateGameQuestionsQuery,
  ListDraftGameQuestionsQueryVariables,
  ListDraftGameQuestionsQuery,
} from "../../../AWSMobileApi";
import {
  createPublicGameQuestions,
  createPrivateGameQuestions,
  createDraftGameQuestions,
  getPublicGameQuestions,
  getPrivateGameQuestions,
  getDraftGameQuestions,
  deletePublicGameQuestions,
  deletePrivateGameQuestions,
  deleteDraftGameQuestions,
  listPublicGameQuestions,
  listPrivateGameQuestions,
  listDraftGameQuestions,
} from "../../../graphql";

export interface IPublicGameQuestion {
  create: {
    input: CreatePublicGameQuestionsInput;
    variables: CreatePublicGameQuestionsMutationVariables;
    query: CreatePublicGameQuestionsMutation;
  },
  get: {
    variables: GetPublicGameQuestionsQueryVariables;
    query: GetPublicGameQuestionsQuery;
  },
  delete: {
    input: DeletePublicGameQuestionsInput;
    variables: DeletePublicGameQuestionsMutationVariables;
    query: DeletePublicGameQuestionsMutation;
  },
  list: {
    variables: ListPublicGameQuestionsQueryVariables;
    query: ListPublicGameQuestionsQuery;
  }
}

export interface IPrivateGameQuestion {
  create: {
    input: CreatePrivateGameQuestionsInput;
    variables: CreatePrivateGameQuestionsMutationVariables;
    query: CreatePrivateGameQuestionsMutation;
  },
  get: {
    variables: GetPrivateGameQuestionsQueryVariables;
    query: GetPrivateGameQuestionsQuery;
  },
  delete: {
    input: DeletePrivateGameQuestionsInput;
    variables: DeletePrivateGameQuestionsMutationVariables;
    query: DeletePrivateGameQuestionsMutation;
  },
  list: {
    variables: ListPrivateGameQuestionsQueryVariables;
    query: ListPrivateGameQuestionsQuery;
  }
}

export interface IDraftGameQuestion {
  create: {
    input: CreateDraftGameQuestionsInput;
    variables: CreateDraftGameQuestionsMutationVariables;
    query: CreateDraftGameQuestionsMutation;
  },
  get: {
    variables: GetDraftGameQuestionsQueryVariables;
    query: GetDraftGameQuestionsQuery;
  },
  delete: {
    input: DeleteDraftGameQuestionsInput;
    variables: DeleteDraftGameQuestionsMutationVariables;
    query: DeleteDraftGameQuestionsMutation;
  },
  list: {
    variables: ListDraftGameQuestionsQueryVariables;
    query: ListDraftGameQuestionsQuery;
  }
}
// runtime mapping of game question type to mutation function
export const gameQuestionRuntimeMap = {
  Public: {
    create: {
      queryFunction: createPublicGameQuestions,
    },
    get: {
      queryFunction: getPublicGameQuestions,
    },
    delete: {
      queryFunction: deletePublicGameQuestions,
    },
    list: {
      queryFunction: listPublicGameQuestions,
    },
  },
  Private: {
    create: {
      queryFunction: createPrivateGameQuestions,
    },
    get: {
      queryFunction: getPrivateGameQuestions,
    },
    delete: {
      queryFunction: deletePrivateGameQuestions,
    },
    list: {
      queryFunction: listPrivateGameQuestions,
    },
  },
  Draft: {
    create: {
      queryFunction: createDraftGameQuestions,
    },
    get: {
      queryFunction: getDraftGameQuestions,
    },
    delete: {
      queryFunction: deleteDraftGameQuestions,
    },
    list: {
      queryFunction: listDraftGameQuestions,
    },
  },
};

export type GameQuestionType<T extends PublicPrivateType> =
  T extends "Public"  ? IPublicGameQuestion  :
  T extends "Private" ? IPrivateGameQuestion :
  IDraftGameQuestion;

export interface IGameQuestionsAPIClient {
  createGameQuestions<T extends PublicPrivateType>(
    type: T,
    createGameQuestionsInput: GameQuestionType<T>['create']['input']
  ): Promise<IGameQuestion>;

  getGameQuestions<T extends PublicPrivateType>(
    type: T,
    id: string,
  ): Promise<IGameQuestion>;

  deleteGameQuestions<T extends PublicPrivateType>(
    type: T,
    id: string,
  ): Promise<boolean>;

  listGameQuestions<T extends PublicPrivateType>(
    type: T,
    limit: number,
    nextToken: string | null,
  ): Promise<{ gameQuestions: IGameQuestion[], nextToken: string }>;
}