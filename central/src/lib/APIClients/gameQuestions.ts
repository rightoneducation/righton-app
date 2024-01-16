import {
  Environment,
  IGameQuestions,
  IGameQuestionAPIClient,
  GameQuestionsAPIClient,
  CreateGameQuestionsInput,
  UpdateGameQuestionsInput
} from '@righton/networking';

let gameQuestionsAPIClient: IGameQuestionAPIClient = new GameQuestionsAPIClient(Environment.Testing);
export const createGameQuestions = async (createGameQuestionsInput: CreateGameQuestionsInput): Promise<IGameQuestions | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.createGameQuestions(createGameQuestionsInput);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameQuestions = async (id: string): Promise<IGameQuestions | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.getGameQuestions(id);
    return gameQuestions;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const deleteGameQuestions = async (id: string): Promise<IGameQuestions | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.deleteGameQuestion(id);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const getSortedGameQuestionss = async (queryLimit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestions[], nextToken: string } | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.listGameQuestions(queryLimit, nextToken);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
};
