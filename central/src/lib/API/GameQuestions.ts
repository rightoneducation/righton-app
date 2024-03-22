import {
  IAPIClients,
  IGameQuestion,
  CreateGameQuestionsInput
} from '@righton/networking';

export const createGameQuestions = async (apiClients: IAPIClients, createGameQuestionsInput: CreateGameQuestionsInput): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await apiClients.gameQuestions.createGameQuestions(createGameQuestionsInput);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameQuestions = async (apiClients: IAPIClients, id: string): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await apiClients.gameQuestions.getGameQuestions(id);
    return gameQuestions;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const deleteGameQuestions = async (apiClients: IAPIClients, id: string): Promise<boolean> => {
    return await apiClients.gameQuestions.deleteGameQuestions(id);
};

export const getSortedGameQuestionss = async (apiClients: IAPIClients, queryLimit: number, nextToken: string | null): Promise<{ gameQuestions: IGameQuestion[], nextToken: string } | null> => {
  try {
    const gameQuestions = await apiClients.gameQuestions.listGameQuestions(queryLimit, nextToken);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
};
