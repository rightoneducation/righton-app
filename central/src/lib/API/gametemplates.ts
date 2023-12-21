import {
  Environment,
  IGameTemplate,
  IGameTemplateAPIClient,
  GameTemplateAPIClient,
  CreateGameTemplateInput,
  UpdateGameTemplateInput
} from '@righton/networking';

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

export const getSortedGameTemplates = async (queryLimit: number, nextToken: string | null): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null> => {
  try {
    const games = await gameTemplateAPIClient.listGameTemplates(queryLimit, nextToken);
    return games;
  } catch (e) {
    console.log(e);
  }
  return null;
};