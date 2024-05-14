import { IGameQuestion } from "../../../Models";
import { 
  CreatePublicGameQuestionsInput, 
  CreatePrivateGameQuestionsInput,
  CreatePublicGameQuestionsMutationVariables,
  CreatePublicGameQuestionsMutation,
  CreatePrivateGameQuestionsMutationVariables,
  CreatePrivateGameQuestionsMutation,
  GetPublicGameQuestionsQuery,
  GetPublicGameQuestionsQueryVariables,
  GetPrivateGameQuestionsQuery,
  GetPrivateGameQuestionsQueryVariables,
  DeletePublicGameQuestionsInput,
  DeletePublicGameQuestionsMutationVariables,
  DeletePublicGameQuestionsMutation,
  DeletePrivateGameQuestionsInput,
  DeletePrivateGameQuestionsMutationVariables,
  DeletePrivateGameQuestionsMutation,
  ListPublicGameQuestionsQueryVariables,
  ListPublicGameQuestionsQuery,
  ListPrivateGameQuestionsQueryVariables,
  ListPrivateGameQuestionsQuery
} from "../../../AWSMobileApi";
import {
  createPublicGameQuestions,
  createPrivateGameQuestions,
  getPublicGameQuestions,
  getPrivateGameQuestions,
  deletePublicGameQuestions,
  deletePrivateGameQuestions,
  listPublicGameQuestions,
  listPrivateGameQuestions
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

// runtime mapping of game question type to mutation function
export const gameQuestionRuntimeMap = {
  public: {
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
  private: {
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
  }
};

export type GameQuestionType<T extends 'public' | 'private'> = 
    T extends 'public' ? IPublicGameQuestion : IPrivateGameQuestion;

export interface IGameQuestionsAPIClient {
  createGameQuestions<T extends 'public' | 'private'>(
    type: T,
    createGameQuestionsInput: GameQuestionType<T>['create']['input']
  ): Promise<IGameQuestion>;

  getGameQuestions<T extends 'public' | 'private'>(
    type: T,
    id: string,
  ): Promise<IGameQuestion>;

  deleteGameQuestions<T extends 'public' | 'private'>(
    type: T,
    id: string,
  ): Promise<boolean>;

  listGameQuestions<T extends 'public' | 'private'>(
    type: T,
    limit: number,
    nextToken: string | null,
  ): Promise<{ gameQuestions: IGameQuestion[], nextToken: string }>;
}