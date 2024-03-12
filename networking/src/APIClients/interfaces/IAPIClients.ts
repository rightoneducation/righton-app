import { IGameTemplateAPIClient } from './IGameTemplateAPIClient';
import { IQuestionTemplateAPIClient } from './IQuestionTemplateAPIClient';
import { IGameQuestionsAPIClient } from './IGameQuestionsAPIClient';
import { IGameSessionAPIClient } from './IGameSessionAPIClient';
import { ITeamAPIClient } from './ITeamAPIClient';
import { ITeamMemberAPIClient } from './ITeamMemberAPIClient';
import { ITeamAnswerAPIClient } from './ITeamAnswerAPIClient';

export interface IAPIClients {
  gameTemplate: IGameTemplateAPIClient;
  questionTemplate: IQuestionTemplateAPIClient;
  gameQuestions: IGameQuestionsAPIClient;
  gameSession: IGameSessionAPIClient;
  team: ITeamAPIClient;
  teamMember: ITeamMemberAPIClient;
  teamAnswer: ITeamAnswerAPIClient;
  configAmplify(awsconfig: any): void;
}