import { PublicPrivateType } from "../../BaseAPIClient";
import { IGameQuestion } from "../../../Models";
import { 
  CreatePublicGameQuestionsInput, 
  CreatePrivateGameQuestionsInput,
  CreateDraftGameDraftQuestionsInput,
  CreateDraftGamePublicQuestionsInput,
  CreateDraftGamePrivateQuestionsInput,
  CreatePublicGameQuestionsMutationVariables,
  CreatePublicGameQuestionsMutation,
  CreatePrivateGameQuestionsMutationVariables,
  CreatePrivateGameQuestionsMutation,
  CreateDraftGameDraftQuestionsMutationVariables,
  CreateDraftGameDraftQuestionsMutation,
  CreateDraftGamePublicQuestionsMutationVariables,
  CreateDraftGamePublicQuestionsMutation,
  CreateDraftGamePrivateQuestionsMutationVariables,
  CreateDraftGamePrivateQuestionsMutation,
  GetPublicGameQuestionsQuery,
  GetPublicGameQuestionsQueryVariables,
  GetPrivateGameQuestionsQuery,
  GetPrivateGameQuestionsQueryVariables,
  GetDraftGameDraftQuestionsQuery,
  GetDraftGameDraftQuestionsQueryVariables,
  GetDraftGamePublicQuestionsQuery,
  GetDraftGamePublicQuestionsQueryVariables,
  GetDraftGamePrivateQuestionsQuery,
  GetDraftGamePrivateQuestionsQueryVariables,
  DeletePublicGameQuestionsInput,
  DeletePublicGameQuestionsMutationVariables,
  DeletePublicGameQuestionsMutation,
  DeletePrivateGameQuestionsInput,
  DeletePrivateGameQuestionsMutationVariables,
  DeletePrivateGameQuestionsMutation,
  DeleteDraftGameDraftQuestionsInput,
  DeleteDraftGameDraftQuestionsMutationVariables,
  DeleteDraftGameDraftQuestionsMutation,
  DeleteDraftGamePublicQuestionsInput,
  DeleteDraftGamePublicQuestionsMutationVariables,
  DeleteDraftGamePublicQuestionsMutation,
  DeleteDraftGamePrivateQuestionsInput,
  DeleteDraftGamePrivateQuestionsMutationVariables,
  DeleteDraftGamePrivateQuestionsMutation,
  ListPublicGameQuestionsQueryVariables,
  ListPublicGameQuestionsQuery,
  ListPrivateGameQuestionsQueryVariables,
  ListPrivateGameQuestionsQuery,
  ListDraftGameDraftQuestionsQueryVariables,
  ListDraftGameDraftQuestionsQuery,
  ListDraftGamePublicQuestionsQueryVariables,
  ListDraftGamePublicQuestionsQuery,
  ListDraftGamePrivateQuestionsQueryVariables,
  ListDraftGamePrivateQuestionsQuery
} from "../../../AWSMobileApi";
import {
  createPublicGameQuestions,
  createPrivateGameQuestions,
  createDraftGameDraftQuestions,
  createDraftGamePublicQuestions,
  createDraftGamePrivateQuestions,
  getPublicGameQuestions,
  getPrivateGameQuestions,
  getDraftGameDraftQuestions,
  getDraftGamePublicQuestions,
  getDraftGamePrivateQuestions,
  deletePublicGameQuestions,
  deletePrivateGameQuestions,
  deleteDraftGameDraftQuestions,
  deleteDraftGamePublicQuestions,
  deleteDraftGamePrivateQuestions,
  listPublicGameQuestions,
  listPrivateGameQuestions,
  listDraftGameDraftQuestions,
  listDraftGamePublicQuestions,
  listDraftGamePrivateQuestions
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
    input: CreateDraftGameDraftQuestionsInput;
    variables: CreateDraftGameDraftQuestionsMutationVariables;
    query: CreateDraftGameDraftQuestionsMutation;
  },
  get: {
    variables: GetDraftGameDraftQuestionsQueryVariables;
    query: GetDraftGameDraftQuestionsQuery;
  },
  delete: {
    input: DeleteDraftGameDraftQuestionsInput;
    variables: DeleteDraftGameDraftQuestionsMutationVariables;
    query: DeleteDraftGameDraftQuestionsMutation;
  },
  list: {
    variables: ListDraftGameDraftQuestionsQueryVariables;
    query: ListDraftGameDraftQuestionsQuery;
  }
}

export interface IDraftGamePublicQuestion {
  create: {
    input: CreateDraftGamePublicQuestionsInput;
    variables: CreateDraftGamePublicQuestionsMutationVariables;
    query: CreateDraftGamePublicQuestionsMutation;
  },
  get: {
    variables: GetDraftGamePublicQuestionsQueryVariables;
    query: GetDraftGamePublicQuestionsQuery;
  },
  delete: {
    input: DeleteDraftGamePublicQuestionsInput;
    variables: DeleteDraftGamePublicQuestionsMutationVariables;
    query: DeleteDraftGamePublicQuestionsMutation;
  },
  list: {
    variables: ListDraftGamePublicQuestionsQueryVariables;
    query: ListDraftGamePublicQuestionsQuery;
  }
}

export interface IDraftGamePrivateQuestion {
  create: {
    input: CreateDraftGamePrivateQuestionsInput;
    variables: CreateDraftGamePrivateQuestionsMutationVariables;
    query: CreateDraftGamePrivateQuestionsMutation;
  },
  get: {
    variables: GetDraftGamePrivateQuestionsQueryVariables;
    query: GetDraftGamePrivateQuestionsQuery;
  },
  delete: {
    input: DeleteDraftGamePrivateQuestionsInput;
    variables: DeleteDraftGamePrivateQuestionsMutationVariables;
    query: DeleteDraftGamePrivateQuestionsMutation;
  },
  list: {
    variables: ListDraftGamePrivateQuestionsQueryVariables;
    query: ListDraftGamePrivateQuestionsQuery;
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
      queryFunction: createDraftGameDraftQuestions,
    },
    get: {
      queryFunction: getDraftGameDraftQuestions,
    },
    delete: {
      queryFunction: deleteDraftGameDraftQuestions,
    },
    list: {
      queryFunction: listDraftGameDraftQuestions,
    },
  },
  DraftPublic: {
    create: {
      queryFunction: createDraftGamePublicQuestions,
    },
    get: {
      queryFunction: getDraftGamePublicQuestions,
    },
    delete: {
      queryFunction: deleteDraftGamePublicQuestions,
    },
    list: {
      queryFunction: listDraftGamePublicQuestions,
    },
  },
  DraftPrivate: {
    create: {
      queryFunction: createDraftGamePrivateQuestions,
    },
    get: {
      queryFunction: getDraftGamePrivateQuestions,
    },
    delete: {
      queryFunction: deleteDraftGamePrivateQuestions,
    },
    list: {
      queryFunction: listDraftGamePrivateQuestions,
    },
  }
};

export type GameQuestionType<T extends PublicPrivateType> =
  T extends "Public"  ? IPublicGameQuestion  :
  T extends "Private" ? IPrivateGameQuestion :
  T extends "Draft" ? IDraftGameQuestion :
  T extends "DraftPublic" ? IDraftGamePublicQuestion :
  T extends "DraftPrivate" ? IDraftGamePrivateQuestion :
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