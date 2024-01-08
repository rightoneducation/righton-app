import {
  Environment,
  IGameQuestions,
  IGameQuestionsAPIClient,
  GameQuestionsAPIClient,
  CreateGameQuestionsInput,
  UpdateGameQuestionsInput
} from '@righton/networking';

let gameQuestionsAPIClient: IGameQuestionsAPIClient = new GameQuestionsAPIClient(Environment.Testing);
export const createGameQuestions = async (createGameQuestionsInput: CreateGameQuestionsInput): Promise<IGameQuestions | null> => {
  try {
    return await gameQuestionsAPIClient.createGameQuestions(createGameQuestionsInput);
  } catch (e) {
    throw new Error (`Error creating gameQuestion: ${e}`);
  }
}

export const getGameQuestions = async (id: string): Promise<IGameQuestions | null> => {
  try {
    return await gameQuestionsAPIClient.getGameQuestions(id);
  } catch (e) {
    throw new Error (`Error getting gameQuestion: ${e}`);
  }
}

export const deleteGameQuestions = async (id: string): Promise<IGameQuestions | null> => {
  try {
    return await gameQuestionsAPIClient.deleteGameQuestions(id);
  } catch (e) {
    throw new Error (`Error deleting gameQuestion: ${e}`);
  }
};

export const getSortedGameQuestions = async (queryLimit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestions[], nextToken: string } | null> => {
  try {
    return await gameQuestionsAPIClient.listGameQuestions(queryLimit, nextToken);
  } catch (e) {
    throw new Error (`Error listing gameQuestions: ${e}`);
  }
};
