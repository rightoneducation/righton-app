import { Amplify } from "aws-amplify";
import { Hub } from 'aws-amplify/utils';
import { signUp, confirmSignUp, signIn, signInWithRedirect, signOut } from 'aws-amplify/auth';
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
  isUserAuth: boolean;

  constructor(env: Environment) {
    this.gameTemplate = new GameTemplateAPIClient(env);
    this.questionTemplate = new QuestionTemplateAPIClient(env);
    this.gameQuestions = new GameQuestionsAPIClient(env);
    this.gameSession = new GameSessionAPIClient(env);
    this.question = new QuestionAPIClient(env);
    this.team = new TeamAPIClient(env);
    this.teamMember = new TeamMemberAPIClient(env);
    this.teamAnswer = new TeamAnswerAPIClient(env);
    this.isUserAuth = false;
    this.configAmplify(awsconfig);
    this.authEvents(null);
    this.authListener();
  }

  configAmplify(awsconfig: any) {
    Amplify.configure(awsconfig);
  }

  authEvents (payload: any) {
    if (!payload) {
      this.isUserAuth = false;
      return;
    }
    switch (payload.event) {
      case 'signedIn':
      case 'signInWithRedirect':
        this.isUserAuth = true;
        break;
      default:
        this.isUserAuth = false;
        break;
    }
  }

  authListener() {
    Hub.listen('auth', ({ payload }) => {
      this.authEvents(payload);
      }
    );
  }

  async awsSignUp(email: string, password: string) {
    await signUp({
      username: email,
      password: password,
      options: {
        userAttributes: {
          email
        },
      }
    });
  }

  async awsConfirmSignUp(email: string, code: string) {
    await confirmSignUp({username: email, confirmationCode: code});
  }

  async awsSignIn(email: string, password: string) {
    await signIn({username: email, password: password});
  }

  async awsSignInFederated () {
    await signInWithRedirect(
      {provider: 'Google'}
    );
  }

  async awsSignOut() {
    await signOut();
  }
}