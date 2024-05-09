import {
  IAuthAPIClient
} from './auth/interfaces';
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
import { GameTemplateAPIClient } from './templates/GameTemplateAPIClient';
import { QuestionTemplateAPIClient } from './templates/QuestionTemplateAPIClient';
import { GameQuestionsAPIClient } from './templates/GameQuestionsAPIClient';
import { GameSessionAPIClient } from './gamesession/GameSessionAPIClient';
import { QuestionAPIClient } from './gamesession/QuestionAPIClient';
import { TeamAPIClient } from './gamesession/TeamAPIClient';
import { TeamMemberAPIClient } from './gamesession/TeamMemberAPIClient';
import { TeamAnswerAPIClient } from './gamesession/TeamAnswerAPIClient';
import { Environment } from './BaseAPIClient';

export class APIClients {
  auth: IAuthAPIClient;
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  question: IQuestionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;


  constructor(env: Environment) {
    this.auth = new AuthAPIClient();
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.question = new QuestionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
 
  }

  
}