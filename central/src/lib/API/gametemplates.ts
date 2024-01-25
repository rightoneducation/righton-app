import {
  Environment,
  IGameTemplate,
  IGameTemplateAPIClient,
  GameTemplateAPIClient,
  CreateGameTemplateInput,
  UpdateGameTemplateInput
} from '@righton/networking';
import { IListQuerySettings, SortField } from './QueryInputs';

let gameTemplateAPIClient: IGameTemplateAPIClient = new GameTemplateAPIClient(Environment.Testing);

export const createGameTemplate = async (createGameTemplateInput: CreateGameTemplateInput): Promise<IGameTemplate | null> => {
  try {
    const game = await gameTemplateAPIClient.createGameTemplate(createGameTemplateInput);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
}

export const getGameTemplate = async (id: string): Promise<IGameTemplate | null> => {
  try {
    const game = await gameTemplateAPIClient.getGameTemplate(id);
    return game;

  } catch (e) {
    console.log(e);
  }
  return null;
}

export const updateGameTemplate = async (updateGameTemplateInput: UpdateGameTemplateInput): Promise<IGameTemplate | null> => {
  try {
    const game = await gameTemplateAPIClient.updateGameTemplate(updateGameTemplateInput);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const deleteGameTemplate = async (id: string): Promise<IGameTemplate | null> => {
  try {
    const game = await gameTemplateAPIClient.deleteGameTemplate(id);
    return game;
  } catch (e) {
    console.log(e);
  }
  return null;
};

export const listGameTemplates = async (queryLimit: number, nextToken: string | null, listQuerySettings: IListQuerySettings | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> => {
  try {
    const sortDirection = listQuerySettings?.sortDirection ?? null;
    const sortField = listQuerySettings?.sortField ?? null;
    const filterString = listQuerySettings?.filterString ?? null;
    switch (sortField) {
      case SortField.GRADE:
        return await gameTemplateAPIClient.listGameTemplatesByGrade(queryLimit, nextToken, sortDirection, filterString);
      case SortField.UPDATEDAT:
        return await gameTemplateAPIClient.listGameTemplatesByDate(queryLimit, nextToken, sortDirection, filterString);
      case SortField.QUESTIONCOUNT:
        break;
      default:
        return await gameTemplateAPIClient.listGameTemplates(queryLimit, nextToken, filterString);
    }
  } catch (e) {
    console.log(e);
  }
  return null;
};