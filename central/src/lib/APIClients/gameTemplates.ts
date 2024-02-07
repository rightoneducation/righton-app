import {
  Environment,
  IGameTemplate,
  IGameTemplateAPIClient,
  GameTemplateAPIClient,
  CreateGameTemplateInput,
  UpdateGameTemplateInput
} from '@righton/networking';

let gameTemplateAPIClient: IGameTemplateAPIClient = new GameTemplateAPIClient(Environment.Testing);

export const createGameTemplate = async (createGameTemplateInput: CreateGameTemplateInput | IGameTemplate): Promise<IGameTemplate | null> => {
  try {
    return await gameTemplateAPIClient.createGameTemplate(createGameTemplateInput);
  } catch (e) {
    throw new Error (`Error creating gameTemplate: ${e}`);
  }
}

export const getGameTemplate = async (id: string): Promise<IGameTemplate | null> => {
  try {
    return await gameTemplateAPIClient.getGameTemplate(id);
  } catch (e) {
    throw new Error (`Error getting gameTemplate: ${e}`);
  }
}

export const updateGameTemplate = async (updateGameTemplateInput: UpdateGameTemplateInput | IGameTemplate): Promise<IGameTemplate | null> => {
  try {
    return await gameTemplateAPIClient.updateGameTemplate(updateGameTemplateInput);
  } catch (e) {
    throw new Error (`Error updating gameTemplate: ${e}`);
  }
};

export const deleteGameTemplate = async (id: string): Promise<IGameTemplate | null> => {
  try {
    return await gameTemplateAPIClient.deleteGameTemplate(id);
  } catch (e) {
    throw new Error (`Error deleting gameTemplate: ${e}`);
  }
};

export const listGameTemplates = async (queryLimit: number, nextToken: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> => {
  try {
    return await gameTemplateAPIClient.listGameTemplates(queryLimit, nextToken);
  } catch (e) {
    throw new Error (`Error listing gameTemplate: ${e}`);
  }
};