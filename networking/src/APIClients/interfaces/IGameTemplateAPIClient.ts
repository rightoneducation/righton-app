import { IGameTemplate } from "../../Models";
import { CreateGameTemplateInput, UpdateGameTemplateInput } from "../../AWSMobileApi";

export interface IGameTemplateAPIClient {
  createGameTemplate(
    createGameTemplateInput: CreateGameTemplateInput
  ): Promise<IGameTemplate | null>;

  getGameTemplate(
    id: string
  ): Promise<IGameTemplate | null>;

  updateGameTemplate(
    updateGameTemplateInput: UpdateGameTemplateInput
  ): Promise<IGameTemplate | null>;

  deleteGameTemplate(
    id: string
  ): Promise<IGameTemplate | null>;

  listGameTemplates(
    limit: number,
    nextToken: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByDate(
    limit: number,
    nextToken: string | null,
    sortDirection: string
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}