import {
  IAPIClients,
  IGameQuestion,
  CreatePublicGameQuestionsInput,
  CreatePrivateGameQuestionsInput,
  PublicPrivateType
} from '@righton/networking';

export const createGameQuestions = async (
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  ids: { questionTemplateID: string, gameTemplateID: string }
): Promise<IGameQuestion | null> => {
  try {
    let createGameQuestionsInput: CreatePublicGameQuestionsInput | CreatePrivateGameQuestionsInput | null = null;
    if (type === PublicPrivateType.PUBLIC) 
      createGameQuestionsInput = { publicQuestionTemplateID: ids.questionTemplateID, publicGameTemplateID: ids.gameTemplateID };
    else
      createGameQuestionsInput = { privateQuestionTemplateID: ids.questionTemplateID, privateGameTemplateID: ids.gameTemplateID };
    const gameQuestions = await apiClients.gameQuestions.createGameQuestions(type, createGameQuestionsInput);
    return gameQuestions;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameQuestions = async (
  type: PublicPrivateType,
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
  type: PublicPrivateType,
  apiClients: IAPIClients, 
  id: string
): Promise<boolean> => {
    return await apiClients.gameQuestions.deleteGameQuestions(type, id);
};

export const getSortedGameQuestionss = async (
  type: PublicPrivateType,
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
