import { IAuthAPIClient } from '../auth/interfaces/IAuthAPIClient';
import { IGameTemplateAPIClient } from '../templates/interfaces/IGameTemplateAPIClient';
import { IQuestionTemplateAPIClient } from '../templates/interfaces/IQuestionTemplateAPIClient';
import { IGameQuestionsAPIClient } from '../templates/interfaces/IGameQuestionsAPIClient';
import { IQuestionAPIClient } from '../gamesession/interfaces/IQuestionAPIClient';
import { IGameSessionAPIClient } from '../gamesession/interfaces/IGameSessionAPIClient';
import { ITeamAPIClient } from '../gamesession/interfaces/ITeamAPIClient';
import { ITeamMemberAPIClient } from '../gamesession/interfaces/ITeamMemberAPIClient';
import { ITeamAnswerAPIClient } from '../gamesession/interfaces/ITeamAnswerAPIClient';
import { ICentralDataManagerAPIClient, IHostDataManagerAPIClient, IPlayDataManagerAPIClient } from '../datamanagers';
import IAIAPIClient from '../AI/interfaces/IAIAPIClient';

export interface IAPIClients {
  auth: IAuthAPIClient;
  AI: IAIAPIClient;
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
}