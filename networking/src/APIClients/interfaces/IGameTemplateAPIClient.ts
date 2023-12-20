import { IGameTemplate } from "../../Models";

export interface IGameTemplateAPIClient {
  createGameTemplate(
    id: string,
    title: string,
    owner: string,
    version: number,
    description: string,
    domain: string | null,
    cluster: string | null,
    grade: string | null,
    standard: string | null,
    phaseOneTime: number,
    phaseTwoTime: number,
    imageUrl: string
  ): Promise<IGameTemplate | null>;

  listGameTemplates(
    limit: number,
    nextToken: string
  ): Promise<{ gameTemplates: IGameTemplate[], nextToken: string } | null>;
}