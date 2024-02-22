import { 
  IGameTemplateAPIClient,
  IQuestionTemplateAPIClient,
  IGameQuestionsAPIClient,
  IGameSessionAPIClient,
  ITeamAPIClient,
  ITeamMemberAPIClient,
  ITeamAnswerAPIClient
 } from './interfaces';
import { GameTemplateAPIClient } from './GameTemplateAPIClient';
import { QuestionTemplateAPIClient } from './QuestionTemplateAPIClient';
import { GameQuestionsAPIClient } from './GameQuestionsAPIClient';
import { GameSessionAPIClient } from './GameSessionAPIClient';
import { TeamAPIClient } from './TeamAPIClient';
import { TeamMemberAPIClient } from './TeamMemberAPIClient';
import { TeamAnswerAPIClient } from './TeamAnswerAPIClient';
import { Environment } from './BaseAPIClient';
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

export class APIClients {
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;

  constructor(env: Environment) {
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
    this.configAmplify(awsconfig);
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}