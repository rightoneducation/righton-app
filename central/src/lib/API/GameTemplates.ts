import {
  IAPIClients,
  IGameTemplate,
  PublicPrivateType,
  CreatePublicGameTemplateInput,
  CreatePrivateGameTemplateInput,
  UpdatePublicGameTemplateInput,
  UpdatePrivateGameTemplateInput
} from '@righton/networking';
import { IListQuerySettings, SortField } from './QueryInputs';

export const createGameTemplate = async (
  type: PublicPrivateType, 
  apiClients: IAPIClients, 
  createGameTemplateInput: CreatePublicGameTemplateInput | CreatePrivateGameTemplateInput
): Promise<IGameTemplate | null> => {
  try {
    const game = await apiClients.gameTemplate.createGameTemplate(type, createGameTemplateInput);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameTemplate = async (
  type: PublicPrivateType, 
  apiClients: IAPIClients, 
  id: string
): Promise<IGameTemplate | null> => {
  try {
    const game = await apiClients.gameTemplate.getGameTemplate(type, id);
    return game;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const updateGameTemplate = async (
  type: PublicPrivateType, 
  apiClients: IAPIClients, 
  updateGameTemplateInput: UpdatePublicGameTemplateInput | UpdatePrivateGameTemplateInput
): Promise<IGameTemplate | null> => {
  try {
    // need to ensure that the createdAt and updatedAt fields are in the correct string format for graphql
    const existingCreatedAt = updateGameTemplateInput.createdAt;
    const existingUpdatedAt = updateGameTemplateInput.updatedAt;
    updateGameTemplateInput.createdAt = new Date(existingCreatedAt ?? '').toISOString();
    updateGameTemplateInput.updatedAt = new Date(existingUpdatedAt ?? '').toISOString();
    const game = await apiClients.gameTemplate.updateGameTemplate(type, updateGameTemplateInput);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const deleteGameTemplate = async (
  type: PublicPrivateType, 
  apiClients: IAPIClients, 
  id: string
): Promise<boolean> => {
  const gameTemplate = await apiClients.gameTemplate.getGameTemplate(type, id);
  if (gameTemplate?.questionTemplates) {
    await Promise.all(gameTemplate.questionTemplates.map(async (questionTemplate) => {
      try {
        await apiClients.gameQuestions.deleteGameQuestions(type, questionTemplate.gameQuestionId);
      } catch (error) {
        console.error("Error deleting game question:", error);
        return false;
      }
    }));
  }
  return await apiClients.gameTemplate.deleteGameTemplate(type, id);
};

export const listGameTemplates = async (
  type: PublicPrivateType, 
  apiClients: IAPIClients, 
  listQuerySettings: IListQuerySettings | null
): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> => {
  try {
    console.log('sup');
    console.log(listQuerySettings);
    console.log(type);
    const nextToken = listQuerySettings?.nextToken ?? null;
    const sortDirection = listQuerySettings?.sortDirection ?? null;
    const sortField = listQuerySettings?.sortField ?? null;
    const filterString = (listQuerySettings?.filterString && listQuerySettings?.filterString != "") ? listQuerySettings?.filterString : null;
    const queryLimit = listQuerySettings?.queryLimit ?? null;
    switch (sortField) {
      case SortField.GRADE:
        return await apiClients.gameTemplate.listGameTemplatesByGrade(type, queryLimit, nextToken, sortDirection, filterString);
      case SortField.UPDATEDAT:
        return await apiClients.gameTemplate.listGameTemplatesByDate(type, queryLimit, nextToken, sortDirection, filterString);
      case SortField.COUNT:
        return await apiClients.gameTemplate.listGameTemplatesByQuestionTemplatesCount(type, queryLimit, nextToken, sortDirection, filterString);
      default:
        return await apiClients.gameTemplate.listGameTemplates(type, queryLimit, nextToken, sortDirection, filterString);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};