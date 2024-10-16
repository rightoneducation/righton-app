import { Environment } from '../interfaces/IBaseAPIClient';
import { ICentralDataManagerAPIClient } from './interfaces/ICentralDataManagerAPIClient';
import { IGameTemplateAPIClient, IQuestionTemplateAPIClient } from '../templates';
import { PublicPrivateType, SortDirection, GradeTarget, SortType } from "../BaseAPIClient";

export class CentralDataManagerAPIClient implements ICentralDataManagerAPIClient{
  protected env: Environment;
  protected gameTemplateAPIClient: IGameTemplateAPIClient;
  protected questionTemplateAPIClient: IQuestionTemplateAPIClient;

  constructor (
    env: Environment,
    gameTemplateAPIClient: IGameTemplateAPIClient,
    questionTemplateAPIClient: IQuestionTemplateAPIClient,
  ) {
    this.env = env;
    this.gameTemplateAPIClient = gameTemplateAPIClient;
    this.questionTemplateAPIClient = questionTemplateAPIClient;
  } 
  
  public initGames = async () => {
    const response = await this.gameTemplateAPIClient.listGameTemplates(PublicPrivateType.PUBLIC, 12, null, SortDirection.DESC, null, []);
    if (response){
      return { nextToken: response.nextToken, games: response.gameTemplates };
    }
    return { nextToken: null, games: [] };
  };

  public initQuestions = async () => {
    const response = await this.questionTemplateAPIClient.listQuestionTemplates(PublicPrivateType.PUBLIC, 12, null, SortDirection.DESC, null, []);
    if (response)
      return { nextToken: response.nextToken, questions: response.questionTemplates };
    return { nextToken: null, questions: [] };
  };

  public searchForGameTemplates = async (type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[]) => {
    switch(sortType){
      case SortType.listGameTemplatesByDate: {
        const response = await this.gameTemplateAPIClient.listGameTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplatesByGrade: {
        const response = await this.gameTemplateAPIClient.listGameTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplatesByQuestionCount: {
        const response = await this.gameTemplateAPIClient.listGameTemplatesByQuestionTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break;
      }
      case SortType.listGameTemplates:
      default: {
        const response = await this.gameTemplateAPIClient.listGameTemplates(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, games: response.gameTemplates };
        }
        break; 
      }
    }
    return {nextToken: null, games: []};
  };

  public searchForQuestionTemplates = async (type: PublicPrivateType, limit: number | null, nextToken: string | null, search: string, sortDirection: SortDirection, sortType: SortType, gradeTargets: GradeTarget[]) => {
    switch(sortType){
      case SortType.listQuestionTemplatesByDate: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplatesByDate(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplatesByGrade: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplatesByGrade(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplatesByGameCount: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplatesByGameTemplatesCount(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break;
      }
      case SortType.listQuestionTemplates:
      default: {
        const response = await this.questionTemplateAPIClient.listQuestionTemplates(type, limit, nextToken, sortDirection, search, gradeTargets);
        if (response){
          return { nextToken: response.nextToken, questions: response.questionTemplates };
        }
        break; 
      }
    }
    return {nextToken: null, questions: []};
  };
}