import { PlayDataManagerAPIClient } from './PlayDataManagerAPIClient';
import { IQuestionAPIClient, ITeamAPIClient, ITeamMemberAPIClient, ITeamAnswerAPIClient } from '../interfaces';
import { IHostTeamAnswers } from '../../Models';
import { Environment } from '../interfaces/IBaseAPIClient';
import { IGameSessionAPIClient } from '../interfaces';
import { IGameSession } from '../../Models/IGameSession';
import { BackendAnswer, Answer, NumericAnswer} from '../../Models/AnswerClasses';
import { ModelHelper } from '../../ModelHelper';

export class HostDataManagerAPIClient extends PlayDataManagerAPIClient {
  protected questionAPIClient: IQuestionAPIClient;
  protected teamAPIClient: ITeamAPIClient;
  protected teamMemberAPIClient: ITeamMemberAPIClient;
  protected teamAnswerAPIClient: ITeamAnswerAPIClient;
  private hostTeamAnswers: IHostTeamAnswers;
  private createTeamAnswerSubscription: any;
  private updateTeamAnswerSubscription: any;

  constructor (
    env: Environment,
    gameSessionAPIClient: IGameSessionAPIClient,
    questionAPIClient: IQuestionAPIClient,
    teamAPIClient: ITeamAPIClient,
    teamMemberAPIClient: ITeamMemberAPIClient,
    teamAnswerAPIClient: ITeamAnswerAPIClient,
  ) {
    super(env, gameSessionAPIClient);
    this.questionAPIClient = questionAPIClient;
    this.teamAPIClient = teamAPIClient;
    this.teamMemberAPIClient = teamMemberAPIClient;
    this.teamAnswerAPIClient = teamAnswerAPIClient;
    this.hostTeamAnswers = {answers: [], confidence: [], hints: []};
  }

  cleanupSubscription() {
    if (this.gameSessionSubscription && this.gameSessionSubscription.unsubscribe) {
      this.gameSessionSubscription.unsubscribe();
    }
    if (this.createTeamAnswerSubscription && this.createTeamAnswerSubscription.unsubscribe) {
      this.createTeamAnswerSubscription.unsubscribe();
    }
    if (this.updateTeamAnswerSubscription && this.updateTeamAnswerSubscription.unsubscribe) {
      this.updateTeamAnswerSubscription.unsubscribe();
    } 
  }

  // GameSession handling 

  async initUpdateGameSessionSubscription(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession> {
    try {
      this.gameSessionId = gameSessionId;
      const fetchedGame = await this.gameSessionAPIClient.getGameSession(this.gameSessionId);
      const currentQuestion = fetchedGame.questions[fetchedGame.currentQuestionIndex];
      const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion) ?? null;
      if (correctAnswer){
        this.hostTeamAnswers.answers.push({
          normAnswer: [correctAnswer.text] as string[] | number[],
          rawAnswer: correctAnswer.text,
          count: 0,
          isCorrect: true,
          teams: []
        });
      }
      if (!fetchedGame || !fetchedGame.id) {
        throw new Error('Invalid game session');
      }
      this.gameSession = fetchedGame;
      this.subscribeToGameSessionUpdates(callback);
      return this.gameSession;
    } catch (error) {
      throw new Error (`Error: ${error}`)
    }
  }

  // TeamAnswers handling 

  getHostTeamAnswers() {
    return this.hostTeamAnswers
  }

  async initCreateTeamAnswerSubscription(gameSessionId: string, callback: (teamAnswer: BackendAnswer) => void): Promise<IHostTeamAnswers> {
    try {
      this.gameSessionId = gameSessionId;
      this.subscribeToCreateTeamAnswer(callback);
      return this.hostTeamAnswers;
    } catch (error) {
      throw new Error (`Error: ${error}`)
    }
  }

  async initUpdateTeamAnswerSubscription(gameSessionId: string, callback: (teamAnswer: BackendAnswer) => void): Promise<IHostTeamAnswers> {
    try {
      this.gameSessionId = gameSessionId;
      this.subscribeToUpdateTeamAnswer(callback);
      return this.hostTeamAnswers;
    } catch (error) {
      throw new Error (`Error: ${error}`)
    }
  }

  // type guard to check for answer type at runtime (to ensure normAnswer: string[] | number[] is typesafe)
  private isAnswerNumeric (answer: Answer): answer is NumericAnswer {
    return answer instanceof NumericAnswer;
  }

  private updateHostTeamAnswers(teamAnswer: BackendAnswer): IHostTeamAnswers {
    let isExistingAnswer = false;  
    let isCorrect = false;
    this.hostTeamAnswers.answers.forEach((answer) => {
      if (this.isAnswerNumeric(teamAnswer.answer)){
        if(teamAnswer.answer.isEqualTo(answer.normAnswer as number[])){
          isExistingAnswer = true;
          answer.count += 1;
          answer.teams.push(teamAnswer.teamName);
          if (answer.isCorrect)
            isCorrect = true;
        }
      } else if (teamAnswer.answer.isEqualTo(answer.normAnswer as string[])){
        isExistingAnswer = true;
        answer.count += 1;
        answer.teams.push(teamAnswer.teamName);
          if (answer.isCorrect)
            isCorrect = true;
      }
    });

    // if the answer is not already in the array, add it
    if (!isExistingAnswer){
      this.hostTeamAnswers.answers.push({
        normAnswer: teamAnswer.answer.normAnswer as string[] | number[],
        rawAnswer: teamAnswer.answer.rawAnswer,
        count: 1,
        isCorrect,
        teams: [teamAnswer.teamName]
      });
    }

    if (teamAnswer.confidenceLevel) {
      this.hostTeamAnswers.confidence.find((confidence) => confidence.level === teamAnswer.confidenceLevel)?.responses.push({
        team: teamAnswer.teamName,
        answer: teamAnswer.answer,
        isCorrect
      });
    }
    if (teamAnswer.hint){
      console.log('hint');
    }

    if (!teamAnswer) {
      console.error('Error: Invalid team answer');
      return this.hostTeamAnswers;
    }
    return this.hostTeamAnswers;
  }

  protected async subscribeToCreateTeamAnswer(callback: (teamAnswer: any) => void) {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
    this.createTeamAnswerSubscription = await this.teamAnswerAPIClient.subscribeCreateTeamAnswer(this.gameSessionId, (teamAnswer: BackendAnswer) => {
      if (!teamAnswer) {
        console.error('Error: Invalid team answer');
        return;
      }
      this.hostTeamAnswers = this.updateHostTeamAnswers(teamAnswer);
      callback(teamAnswer);
    });
  }

  protected async subscribeToUpdateTeamAnswer(callback: (teamAnswer: any) => void) {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
    this.updateTeamAnswerSubscription = await this.teamAnswerAPIClient.subscribeUpdateTeamAnswer(this.gameSessionId, (teamAnswer: BackendAnswer) => {
      if (!teamAnswer) {
        console.error('Error: Invalid team answer');
        return;
      }
      this.hostTeamAnswers = this.updateHostTeamAnswers(teamAnswer);
      callback(teamAnswer);
    });
  }
}