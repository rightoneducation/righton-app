import { IGameTemplate } from "../../Models";
import { CreateGameTemplateInput, UpdateGameTemplateInput } from "../../AWSMobileApi";
import { GradeTarget } from "../BaseAPIClient";

export interface IGameTemplateAPIClient {
  createGameTemplate(
    createGameTemplateInput: CreateGameTemplateInput | IGameTemplate
  ): Promise<IGameTemplate>;

  getGameTemplate(
    id: string
  ): Promise<IGameTemplate>;

  updateGameTemplate(
    updateGameTemplateInput: UpdateGameTemplateInput | IGameTemplate
  ): Promise<IGameTemplate>;

  deleteGameTemplate(
    id: string
  ): Promise<boolean>;

  listGameTemplates(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByDate(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByGrade(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;

  listGameTemplatesByQuestionTemplatesCount(
    limit: number | null,
    nextToken: string | null,
    sortDirection: string | null,
    filterString: string | null,
    gradeTargets: GradeTarget[],
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}