import { IGameTemplateAPIClient } from '../templates/interfaces/IGameTemplateAPIClient';
import { IQuestionTemplateAPIClient } from '../templates/interfaces/IQuestionTemplateAPIClient';
import { IGameQuestionsAPIClient } from '../templates/interfaces/IGameQuestionsAPIClient';
import { IGameSessionAPIClient } from '../gamesession/interfaces/IGameSessionAPIClient';
import { ITeamAPIClient } from '../gamesession/interfaces/ITeamAPIClient';
import { ITeamMemberAPIClient } from '../gamesession/interfaces/ITeamMemberAPIClient';
import { ITeamAnswerAPIClient } from '../gamesession/interfaces/ITeamAnswerAPIClient';

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