import { PlayDataManagerAPIClient } from './PlayDataManagerAPIClient';
import { IQuestionAPIClient, ITeamAPIClient, ITeamMemberAPIClient, ITeamAnswerAPIClient } from '../interfaces';
import { IQuestion, IChoice } from '../../Models/IQuestion';
import { IHostTeamAnswers } from '../../Models';
import { Environment } from '../interfaces/IBaseAPIClient';
import { IGameSessionAPIClient } from '../interfaces';
import { IGameSession } from '../../Models/IGameSession';
import { BackendAnswer, Answer, NumericAnswer, MultiChoiceAnswer, AnswerFactory, AnswerType } from '../../Models/AnswerClasses';
import { GameSessionState } from '../../AWSMobileApi';

export class HostDataManagerAPIClient extends PlayDataManagerAPIClient {
  protected questionAPIClient: IQuestionAPIClient;
  protected teamAPIClient: ITeamAPIClient;
  protected teamMemberAPIClient: ITeamMemberAPIClient;
  protected teamAnswerAPIClient: ITeamAnswerAPIClient;
  private hostTeamAnswers: IHostTeamAnswers;
  private createTeamAnswerSubscription: any;
  private updateTeamAnswerSubscription: any;
  private noResponseCharacter: string;

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
    this.hostTeamAnswers = {questions:[]};
    this.noResponseCharacter = `-`;
  }

  async init(gameSessionId: string){
    this.gameSessionId = gameSessionId;
    this.gameSession = await this.gameSessionAPIClient.getGameSession(this.gameSessionId).then(
      (gameSession: IGameSession) => {
        this.gameSession = gameSession;
        this.hostTeamAnswers = this.buildHostTeamAnswers(gameSession);
        return gameSession;
      }
    );
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
  async subscribeToUpdateGameSession(gameSessionId: string, callback: (gameSession: IGameSession) => void): Promise<IGameSession> {
    try {
      this.gameSessionId = gameSessionId;
      const fetchedGame = await this.gameSessionAPIClient.getGameSession(this.gameSessionId);
      // const currentQuestion = fetchedGame.questions[fetchedGame.currentQuestionIndex];
      // const correctAnswer = ModelHelper.getCorrectAnswer(currentQuestion) ?? null;
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
  // type guard to check for answer type at runtime (to ensure normAnswer: string[] | number[] is typesafe)
  private isAnswerNumeric (answer: Answer): answer is NumericAnswer {
    return answer instanceof NumericAnswer;
  }

  // type guard to check for answer type at runtime (to ensure normAnswer: string[] | number[] is typesafe)
  private isAnswerMultiChoice (answer: Answer): answer is MultiChoiceAnswer {
    return answer instanceof MultiChoiceAnswer;
  }

  private createAnswerFromBackendData = (ans: any): Answer => {
    const { rawAnswer, answerType } = ans;
    switch (answerType) {
      case AnswerType.NUMBER:
        return AnswerFactory.createAnswer(rawAnswer, answerType, ans.answerPrecision);
      case AnswerType.MULTICHOICE:
        return AnswerFactory.createAnswer(rawAnswer, answerType, undefined, ans.multiChoiceCharacter);
      default:
        return AnswerFactory.createAnswer(rawAnswer, answerType);
    }
  };

  private processAnswer(ans: any, teamAnswersQuestion: any, phase: string, teamName: string) {
    const answerObj = this.createAnswerFromBackendData(ans.answer);
    if (answerObj) {
      answerObj.normalizeAnswer(answerObj.rawAnswer);
      const existingAnswer = teamAnswersQuestion[phase].responses.find((response: any) => {
        if (this.isAnswerNumeric(answerObj)) {
          return answerObj.isEqualTo(response.normAnswer as number[]);
        }
        return answerObj.isEqualTo(response.normAnswer as string[]);
      });
      if (existingAnswer) {
        existingAnswer.count += 1;
        existingAnswer.teams.push(teamName);
      } else {
        teamAnswersQuestion[phase].responses.push({
          normAnswer: answerObj.normAnswer as string[] | number[],
          rawAnswer: answerObj.rawAnswer,
          count: 1,
          isCorrect: ans.isCorrect,
          multiChoiceCharacter: this.isAnswerMultiChoice(answerObj) ? answerObj.multiChoiceCharacter : '',
          teams: [teamName]
        });
      }
      teamAnswersQuestion[phase].responses.sort((a: any, b: any) => b.multiChoiceCharacter.localeCompare(a.multiChoiceCharacter));
    }
  }

  private incrementNoResponseCount(teamAnswersQuestion: any, phase: string, teamName: string) {
    const noResponse = teamAnswersQuestion[phase].responses.find((response: any) => response.rawAnswer === this.noResponseCharacter);
    if (noResponse) {
      noResponse.count += 1;
      noResponse.teams.push(teamName);
    }
  }

  private decrementNoResponseCount(teamAnswersQuestion: any, phase: string, teamName: string) {
    const noResponse = teamAnswersQuestion[phase].responses.find((response: any) => response.rawAnswer === this.noResponseCharacter);
    if (noResponse) {
      noResponse.count -= 1;
      noResponse.teams = noResponse.teams.filter((team: string) => team !== teamName);
    }
  }

  private buildEmptyHostTeamAnswerShortAnswer() {
    return {
      phase1: {
          responses: [{
          normAnswer: [],
          rawAnswer: this.noResponseCharacter,
          count: 0,
          isCorrect: false,
          multiChoiceCharacter: this.noResponseCharacter,
          teams: []
          }],
          confidences: [],
      },
      phase2: {
          responses: [{
          normAnswer: [],
          rawAnswer: this.noResponseCharacter,
          count: 0,
          isCorrect: false,
          multiChoiceCharacter: this.noResponseCharacter,
          teams: []
          }],
          hints: []
      }
    }
  }

  private buildEmptyHostTeamAnswerMultiChoice(question: IQuestion) {
    return {
      phase1: {
          responses: [
            {
              normAnswer: [],
              rawAnswer: this.noResponseCharacter,
              count: 0,
              isCorrect: false,
              multiChoiceCharacter: this.noResponseCharacter,
              teams: []
            },
            ...question.choices.map((choice: IChoice, index: number) => {
              return {
                normAnswer: [choice.text],
                rawAnswer: choice.text,
                count: 0,
                isCorrect: choice.isAnswer,
                multiChoiceCharacter: String.fromCharCode(65 + index),
                teams: []
              }
            })
          ],
          confidences: [],
      },
      phase2: 
        {
          responses: [
            {
              normAnswer: [],
              rawAnswer: this.noResponseCharacter,
              count: 0,
              isCorrect: false,
              multiChoiceCharacter: this.noResponseCharacter,
              teams: []
            },
            ...question.choices.map((choice: IChoice, index: number) => {
              return {
              normAnswer: [choice.text],
              rawAnswer: choice.text,
              count: 0,
              isCorrect: choice.isAnswer,
              multiChoiceCharacter: String.fromCharCode(65 + index),
              teams: []
              }
            })
          ],
          hints: []
        }
    }
  }

  buildHostTeamAnswers(gameSession: IGameSession){
    let teamAnswers: any;
    if (gameSession.questions.length > 0) {
      teamAnswers = {
        questions: gameSession.questions.map((question) => {
          return {
            questionId: question.id,
            ...question.isShortAnswerEnabled ? this.buildEmptyHostTeamAnswerShortAnswer() : this.buildEmptyHostTeamAnswerMultiChoice(question)
          }
        })
      } as IHostTeamAnswers;
      console.log(teamAnswers);
      gameSession.teams.forEach((team) => {
        team.teamMembers.forEach((teamMember) => {
          gameSession.questions.forEach((question) => {
            const teamAnswersQuestion = teamAnswers.questions.find((teamAnswerQuestion: any) => teamAnswerQuestion.questionId === question.id);
            if (!teamAnswersQuestion) return;

            let answeredPhase1 = false;
            let answeredPhase2 = false;
    
            teamMember.answers?.forEach((answer) => {
              if (answer?.questionId === question.id) {
                const phase = answer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
                this.processAnswer(answer, teamAnswersQuestion, phase, team.name);
                if (phase === 'phase1') {
                  answeredPhase1 = true;
                } else {
                  answeredPhase2 = true;
                }
              }
            });
    
            if (!answeredPhase1) {
              this.incrementNoResponseCount(teamAnswersQuestion, 'phase1', team.name);
            }
            if (!answeredPhase2) {
              this.incrementNoResponseCount(teamAnswersQuestion, 'phase2', team.name);
            }
          });
        });
      });
    }
    return teamAnswers;
  }
  getHostTeamAnswers() {
    return this.hostTeamAnswers
  }


  private updateHostTeamAnswers(teamAnswer: BackendAnswer): IHostTeamAnswers {
    console.log(teamAnswer);
    console.log(this.hostTeamAnswers);
    const answerPhase = teamAnswer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
    let answerQuestion = this.hostTeamAnswers.questions.find((question: any) => question.questionId === teamAnswer.questionId);
    this.processAnswer(teamAnswer, answerQuestion, answerPhase, teamAnswer.teamName);
    this.decrementNoResponseCount(answerQuestion, answerPhase, teamAnswer.teamName);
    if (teamAnswer.hint){
      console.log('hint');
    }

    if (!teamAnswer) {
      console.error('Error: Invalid team answer');
      return this.hostTeamAnswers;
    }
    
    return this.hostTeamAnswers;
  }

  async subscribeToCreateTeamAnswer(callback: (hostTeamAnswers: IHostTeamAnswers) => void) {
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
      callback(this.hostTeamAnswers);
    });
  }

  async subscribeToUpdateTeamAnswer(callback: (teamAnswer: any) => void) {
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
      callback(this.hostTeamAnswers);
    });
  }
}