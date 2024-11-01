import {
  IAuthAPIClient
} from './auth/interfaces';
import {
  IUserAPIClient
} from './user/interfaces/IUserAPIClient';
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
import { AuthAPIClient } from './auth/AuthAPIClient';
import { UserAPIClient } from './user/UserAPIClient';
import { GameTemplateAPIClient } from './templates/GameTemplateAPIClient';
import { QuestionTemplateAPIClient } from './templates/QuestionTemplateAPIClient';
import { GameQuestionsAPIClient } from './templates/GameQuestionsAPIClient';
import { GameSessionAPIClient } from './gamesession/GameSessionAPIClient';
import { QuestionAPIClient } from './gamesession/QuestionAPIClient';
import { TeamAPIClient } from './gamesession/TeamAPIClient';
import { TeamMemberAPIClient } from './gamesession/TeamMemberAPIClient';
import { TeamAnswerAPIClient } from './gamesession/TeamAnswerAPIClient';
import { Environment } from './BaseAPIClient';
import { PlayDataManagerAPIClient } from './datamanagers/PlayDataManagerAPIClient';
import { IPlayDataManagerAPIClient } from './datamanagers/interfaces/IPlayDataManagerAPIClient';
import { HostDataManagerAPIClient } from './datamanagers/HostDataManagerAPIClient';
import { IHostDataManagerAPIClient } from './datamanagers/interfaces/IHostDataManagerAPIClient';
import { CentralDataManagerAPIClient } from './datamanagers/CentralDataManagerAPIClient';
import { ICentralDataManagerAPIClient } from './datamanagers/interfaces/ICentralDataManagerAPIClient';
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

export enum AppType {
  HOST,
  PLAY,
  CENTRAL
}

export class APIClients {
  auth: IAuthAPIClient;
  user: IUserAPIClient;
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  question: IQuestionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;
  hostDataManager?: IHostDataManagerAPIClient;
  playDataManager?: IPlayDataManagerAPIClient;
  centralDataManager?: ICentralDataManagerAPIClient;

  constructor(env: Environment,  authClient: IAuthAPIClient, appType: AppType) {
    this.configAmplify(awsconfig);
    this.auth = authClient;
    this.user = new UserAPIClient(env, this.auth);
    this.gameTemplate = new GameTemplateAPIClient(env, this.auth);
    this.questionTemplate = new QuestionTemplateAPIClient(env, this.auth);
    this.gameQuestions = new GameQuestionsAPIClient(env, this.auth);
    this.gameSession = new GameSessionAPIClient(env, this.auth);
    this.question = new QuestionAPIClient(env, this.auth);
    this.team = new TeamAPIClient(env, this.auth);
    this.teamMember = new TeamMemberAPIClient(env, this.auth);
    this.teamAnswer = new TeamAnswerAPIClient(env, this.auth);
    if (appType === AppType.PLAY) {
      this.playDataManager = new PlayDataManagerAPIClient(env, this.gameSession);
    } else if (appType ===AppType.HOST) {
      this.hostDataManager = new HostDataManagerAPIClient(env, this.gameSession, this.question, this.team, this.teamMember, this.teamAnswer);
    } else {
      this.centralDataManager = new CentralDataManagerAPIClient(env, this.gameTemplate, this.questionTemplate);
    }
  }
  static async create(env: Environment, appType: AppType): Promise<APIClients> {
    const authClient = new AuthAPIClient();
    await authClient.init(); // Ensure the auth client is initialized
    return new APIClients(env, authClient, appType); 
  }
    
  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}