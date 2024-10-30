import { IGameTemplate, IQuestionTemplate } from "../../../Models";
import { PublicPrivateType, SortDirection, SortType, GradeTarget } from "../../BaseAPIClient";


export interface ICentralDataManagerAPIClient {
  initGames: () => Promise<{ nextToken: string | null, games: IGameTemplate[] }>;
  initQuestions: () => Promise<{ nextToken: string | null, questions: IQuestionTemplate[] }>;
  searchForGameTemplates: (
    type: PublicPrivateType, 
    limit: number | null, 
    nextToken: string | null, 
    search: string, 
    sortDirection: SortDirection, 
    sortType: SortType, 
    gradeTargets: GradeTarget[]
  ) => Promise<{ nextToken: string | null, games: IGameTemplate[] }>;
  searchForQuestionTemplates: (
    type: PublicPrivateType, 
    limit: number | null, 
    nextToken: string | null, 
    search: string, 
    sortDirection: SortDirection, 
    sortType: SortType, 
    gradeTargets: GradeTarget[]
  ) => Promise<{ nextToken: string | null, questions: IQuestionTemplate[] }>;
}