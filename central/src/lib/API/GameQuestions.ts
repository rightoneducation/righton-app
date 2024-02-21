import {
  Environment,
  IGameQuestion,
  IGameQuestionAPIClient,
  GameQuestionsAPIClient,
  CreateGameQuestionsInput
} from '@righton/networking';

let gameQuestionsAPIClient: IGameQuestionAPIClient = new GameQuestionsAPIClient(Environment.Testing);
export const createGameQuestions = async (createGameQuestionsInput: CreateGameQuestionsInput): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.createGameQuestions(createGameQuestionsInput);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameQuestions = async (id: string): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.getGameQuestions(id);
    return gameQuestions;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const deleteGameQuestions = async (id: string): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.deleteGameQuestions(id);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const getSortedGameQuestionss = async (queryLimit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestion[], nextToken: string } | null> => {
  try {
    const gameQuestions = await gameQuestionsAPIClient.listGameQuestions(queryLimit, nextToken);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
};
