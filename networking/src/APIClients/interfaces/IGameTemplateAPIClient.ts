import { IGameTemplate } from "../../Models";
import { CreateGameTemplateInput, UpdateGameTemplateInput } from "../../AWSMobileApi";

export interface IGameTemplateAPIClient {
  createGameTemplate(
    createGameTemplateInput: CreateGameTemplateInput
  ): Promise<IGameTemplate>;

  getGameTemplate(
    id: string
  ): Promise<IGameTemplate>;

  updateGameTemplate(
    updateGameTemplateInput: UpdateGameTemplateInput
  ): Promise<IGameTemplate>;

  deleteGameTemplate(
    id: string
  ): Promise<IGameTemplate>;

  listGameTemplates(
    limit: number,
    nextToken: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}