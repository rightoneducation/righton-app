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

export class APIClients {
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  question: IQuestionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;

  constructor(env: Environment) {
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.question = new QuestionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
    this.configAmplify(awsconfig);
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}