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

  private constructor(env: Environment, authClient: IAuthAPIClient) {
    this.auth = authClient;
    this.gameTemplate = new GameTemplateAPIClient(env, this.auth);
    this.questionTemplate = new QuestionTemplateAPIClient(env, this.auth);
    this.gameQuestions = new GameQuestionsAPIClient(env, this.auth);
    this.gameSession = new GameSessionAPIClient(env, this.auth);
    this.question = new QuestionAPIClient(env, this.auth);
    this.team = new TeamAPIClient(env, this.auth);
    this.teamMember = new TeamMemberAPIClient(env, this.auth);
    this.teamAnswer = new TeamAnswerAPIClient(env, this.auth);
  }
  static async create(env: Environment): Promise<APIClients> {
    const authClient = new AuthAPIClient();
    await authClient.init(); // Ensure the auth client is initialized
    return new APIClients(env, authClient); 
  }

}