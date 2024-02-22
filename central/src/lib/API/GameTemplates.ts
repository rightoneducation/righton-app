import {
  IAPIClients,
  IGameTemplate,
  CreateGameTemplateInput,
  UpdateGameTemplateInput
} from '@righton/networking';
import { IListQuerySettings, SortField } from './QueryInputs';

export const createGameTemplate = async (apiClients: IAPIClients, createGameTemplateInput: CreateGameTemplateInput): Promise<IGameTemplate | null> => {
  try {
    const game = await apiClients.gameTemplate.createGameTemplate(createGameTemplateInput);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameTemplate = async (apiClients: IAPIClients, id: string): Promise<IGameTemplate | null> => {
  try {
    const game = await apiClients.gameTemplate.getGameTemplate(id);
    return game;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const updateGameTemplate = async (apiClients: IAPIClients, updateGameTemplateInput: UpdateGameTemplateInput): Promise<IGameTemplate | null> => {
  try {
    const game = await apiClients.gameTemplate.updateGameTemplate(updateGameTemplateInput);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const deleteGameTemplate = async (apiClients: IAPIClients, id: string): Promise<IGameTemplate | null> => {
  try {
    const game = await apiClients.gameTemplate.deleteGameTemplate(id);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const listGameTemplates = async (apiClients: IAPIClients, listQuerySettings: IListQuerySettings | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> => {
  try {
    const nextToken = listQuerySettings?.nextToken ?? null;
    const sortDirection = listQuerySettings?.sortDirection ?? null;
    const sortField = listQuerySettings?.sortField ?? null;
    const filterString = (listQuerySettings?.filterString && listQuerySettings?.filterString != "") ? listQuerySettings?.filterString : null;
    const queryLimit = listQuerySettings?.queryLimit ?? null;
    switch (sortField) {
      case SortField.GRADE:
        return await apiClients.gameTemplate.listGameTemplatesByGrade(queryLimit, nextToken, sortDirection, filterString);
      case SortField.UPDATEDAT:
        return await apiClients.gameTemplate.listGameTemplatesByDate(queryLimit, nextToken, sortDirection, filterString);
      case SortField.COUNT:
        return await apiClients.gameTemplate.listGameTemplatesByQuestionTemplatesCount(queryLimit, nextToken, sortDirection, filterString);
      default:
        return await apiClients.gameTemplate.listGameTemplates(queryLimit, nextToken, sortDirection, filterString);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};