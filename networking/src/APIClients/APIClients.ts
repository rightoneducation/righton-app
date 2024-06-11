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
import { SubscriptionManagerAPIClient } from './subscription/SubscriptionManagerAPIClient';
import { ISubscriptionManagerAPIClient } from './subscription';
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
  subscriptionManager: ISubscriptionManagerAPIClient;

  constructor(env: Environment) {
    this.configAmplify(awsconfig);
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.question = new QuestionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
    this.subscriptionManager = new SubscriptionManagerAPIClient(
      env,
      this.gameSession,
      this.question,
      this.team,
      this.teamMember,
      this.teamAnswer
    );
    //this.setSubscription(env);
  }

  // setSubscription(env: Environment) {
  //   // if (appType === AppType.PLAY) {
  //   //   this.subscription = new SubscriptionManagerAPIClient(
  //   //     env,
  //   //     this.gameSession,
  //   //   );
  //   // } else {
  //     this.subscription = new SubscriptionManagerAPIClient(
  //       env,
  //       this.gameSession,
  //       this.question,
  //       this.team,
  //       this.teamMember,
  //       this.teamAnswer
  //     );
  //     //); //going to be SubscriptionsAPIClient(env, auth.this);
  // }
  
  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }
}