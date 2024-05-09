import { 
  IGameTemplateAPIClient, 
  IQuestionTemplateAPIClient, 
  IGameQuestionsAPIClient 
} from './templates/interfaces';
import {
  IGameSessionAPIClient,
  IQuestionAPIClient,
  ITeamAPIClient,
  ITeamMemberAPIClient,
  ITeamAnswerAPIClient
} from './gamesession/interfaces';
import { GameTemplateAPIClient } from './templates/GameTemplateAPIClient';
import { QuestionTemplateAPIClient } from './templates/QuestionTemplateAPIClient';
import { GameQuestionsAPIClient } from './templates/GameQuestionsAPIClient';
import { GameSessionAPIClient } from './gamesession/GameSessionAPIClient';
import { QuestionAPIClient } from './gamesession/QuestionAPIClient';
import { TeamAPIClient } from './gamesession/TeamAPIClient';
import { TeamMemberAPIClient } from './gamesession/TeamMemberAPIClient';
import { TeamAnswerAPIClient } from './gamesession/TeamAnswerAPIClient';
import { Environment } from './BaseAPIClient';
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

export enum UserType {
  TEACHER_AUTH = 0,
  TEACHER_GUEST = 1,
  STUDENT_GUEST = 2
}

export type APIClient = TeacherAuthAPIClient;

export abstract class BaseAPIClien2t<T> {
  abstract configAWS(awsconfig: any): void;
  abstract configAuth(userType: T): void;
};

export class TeacherAuthAPIClient extends BaseAPIClien2t<UserType.TEACHER_AUTH> {
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  question: IQuestionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;

  constructor(env: Environment) {
    super();
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.question = new QuestionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
    this.configAWS();
    this.configAuth(UserType.TEACHER_AUTH);
  }

  configAWS(): void {
    Amplify.configure(awsconfig);
  }
  configAuth(userType: UserType.TEACHER_AUTH): void {
    console.log(userType);
  }
};

export class apiClientFactory {
  static createAPIClient(userType: UserType): any {
    switch (userType) {
      // case UserType.TEACHER_AUTH:
      //   return new TeacherAuthAPIClient();
      // case UserType.TEACHER_AUTH:
      //   return new TeacherGuestAPIClient();
      // case UserType.STUDENT_AUTH:
      //   return new StudentGuestAPIClient();
      // default:
      //   break;
    }

  }
};