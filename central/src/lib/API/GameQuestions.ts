import {
  IAPIClients,
  IGameQuestion,
  CreatePublicGameQuestionsInput,
  CreatePrivateGameQuestionsInput
} from '@righton/networking';

export const createGameQuestions = async (
  type: 'public' | 'private',
  apiClients: IAPIClients, 
  createGameQuestionsInput: CreatePublicGameQuestionsInput | CreatePrivateGameQuestionsInput
): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await apiClients.gameQuestions.createGameQuestions(type, createGameQuestionsInput);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameQuestions = async (
  type: 'public' | 'private',
  apiClients: IAPIClients,
  id: string
): Promise<IGameQuestion | null> => {
  try {
    const gameQuestions = await apiClients.gameQuestions.getGameQuestions(type, id);
    return gameQuestions;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const deleteGameQuestions = async (
  type: 'public' | 'private',
  apiClients: IAPIClients, 
  id: string
): Promise<boolean> => {
    return await apiClients.gameQuestions.deleteGameQuestions(type, id);
};

export const getSortedGameQuestionss = async (
  type: 'public' | 'private',
  apiClients: IAPIClients, 
  queryLimit: number, 
  nextToken: string | null
): Promise<{ gameQuestions: IGameQuestion[], nextToken: string } | null> => {
  try {
    const gameQuestions = await apiClients.gameQuestions.listGameQuestions(type, queryLimit, nextToken);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
};
