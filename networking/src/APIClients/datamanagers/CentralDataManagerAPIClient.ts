import { Environment } from '../interfaces/IBaseAPIClient';
import { ICentralDataManagerAPIClient } from './interfaces/ICentralDataManagerAPIClient';
import { IGameTemplateAPIClient, IQuestionTemplateAPIClient } from '../templates';
import { PublicPrivateType, SortDirection, GradeTarget, SortType } from "../BaseAPIClient";
import { IAuthAPIClient } from '../auth';
import { IUserAPIClient } from '../user';
import { IUser } from '../../Models/IUser';

export class CentralDataManagerAPIClient implements ICentralDataManagerAPIClient{
  protected env: Environment;
  protected authAPIClient: IAuthAPIClient;
  protected userAPIClient: IUserAPIClient;
  protected gameTemplateAPIClient: IGameTemplateAPIClient;
  protected questionTemplateAPIClient: IQuestionTemplateAPIClient;

  constructor (
    env: Environment,
    authAPIClient: IAuthAPIClient,
    userAPIClient: IUserAPIClient,
    gameTemplateAPIClient: IGameTemplateAPIClient,
    questionTemplateAPIClient: IQuestionTemplateAPIClient,
  ) {
    this.env = env;
    this.authAPIClient = authAPIClient;
    this.userAPIClient = userAPIClient;
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
    const response = await this.questionTemplateAPIClient.listQuestionTemplates(PublicPrivateType.PUBLIC, 24, null, SortDirection.DESC, null, []);
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

  public signUpSendConfirmationCode = async (signUpInput: {username: string, password: string, email: string}) => {
    return this.authAPIClient.awsSignUp(signUpInput.username, signUpInput.email, signUpInput.password ?? '');
  };

  public signUpConfirmAndBuildBackendUser = async (user: IUser, confirmationCode: string, frontImage: File, backImage: File) => {
    try {
      this.authAPIClient.awsConfirmSignUp(user.email, confirmationCode).then(() => {
        this.authAPIClient.awsSignIn(user.email, user.password ?? '').then(() => {
          this.userAPIClient.createUser(user).then((user: any) => {
            const frontImagePromise = this.authAPIClient.awsUploadImagePrivate(frontImage);
            const backImagePromise = this.authAPIClient.awsUploadImagePrivate(backImage);
            Promise.all([frontImagePromise, backImagePromise]).then((images: any) => {
              return { user, images };
            });
          });
        });
      });
    } catch (e: any) {
      throw new Error(e);
    }
  };
}