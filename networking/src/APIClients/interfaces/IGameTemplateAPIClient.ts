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
    limit: number | null,
    nextToken: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByDate(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByGrade(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByQuestionTemplatesCount(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}