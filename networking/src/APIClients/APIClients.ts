import { 
  IGameTemplateAPIClient,
  IQuestionTemplateAPIClient,
  IGameQuestionsAPIClient,
  IGameSessionAPIClient,
  IQuestionAPIClient,
  ITeamAPIClient,
  ITeamMemberAPIClient,
  ITeamAnswerAPIClient
 } from './interfaces';
import { GameTemplateAPIClient } from './GameTemplateAPIClient';
import { QuestionTemplateAPIClient } from './QuestionTemplateAPIClient';
import { GameQuestionsAPIClient } from './GameQuestionsAPIClient';
import { GameSessionAPIClient } from './GameSessionAPIClient';
import { QuestionAPIClient } from './QuestionAPIClient';
import { TeamAPIClient } from './TeamAPIClient';
import { TeamMemberAPIClient } from './TeamMemberAPIClient';
import { TeamAnswerAPIClient } from './TeamAnswerAPIClient';
import { Environment } from './BaseAPIClient';
import { PlayDataManagerAPIClient } from './datamanagers/PlayDataManagerAPIClient';
import { IPlayDataManagerAPIClient } from './datamanagers/interfaces/IPlayDataManagerAPIClient';
import { HostDataManagerAPIClient } from './datamanagers/HostDataManagerAPIClient';
import { IHostDataManagerAPIClient } from './datamanagers/interfaces/IHostDataManagerAPIClient';
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

export enum AppType {
  HOST,
  PLAY
}

export class APIClients {
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  question: IQuestionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;
  dataManager: IPlayDataManagerAPIClient | IHostDataManagerAPIClient;

  constructor(env: Environment, appType: AppType) {
    this.configAmplify(awsconfig);
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.question = new QuestionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
    this.dataManager = this.setDataManager(env, appType);
  }

  setDataManager(env: Environment, appType: AppType) {
    if (appType === AppType.PLAY) {
      return new PlayDataManagerAPIClient(
        env,
        this.gameSession,
      );
    } else {
      return new HostDataManagerAPIClient(
        env,
        this.gameSession,
        this.question,
        this.team,
        this.teamMember,
        this.teamAnswer
      );
    }
  }
  
  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}