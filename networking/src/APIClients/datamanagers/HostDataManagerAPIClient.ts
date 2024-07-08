import { PlayDataManagerAPIClient } from './PlayDataManagerAPIClient';
import { IQuestionAPIClient, ITeamAPIClient, ITeamMemberAPIClient, ITeamAnswerAPIClient } from '../interfaces';
import { IQuestion, IChoice } from '../../Models/IQuestion';
import { IHostTeamAnswers, IHostTeamAnswersHint } from '../../Models';
import { Environment } from '../interfaces/IBaseAPIClient';
import { IGameSessionAPIClient } from '../interfaces';
import { IGameSession } from '../../Models/IGameSession';
import { BackendAnswer, Answer, NumericAnswer, MultiChoiceAnswer, AnswerFactory, AnswerType } from '../../Models/AnswerClasses';
import { GameSessionState, ConfidenceLevel } from '../../AWSMobileApi';

export enum HTTP {
  Post = "POST",
}

export class HostDataManagerAPIClient extends PlayDataManagerAPIClient {
  protected questionAPIClient: IQuestionAPIClient;
  protected teamAPIClient: ITeamAPIClient;
  protected teamMemberAPIClient: ITeamMemberAPIClient;
  protected teamAnswerAPIClient: ITeamAnswerAPIClient;
  private hostTeamAnswers: IHostTeamAnswers;
  private createTeamAnswerSubscription: any;
  private updateTeamAnswerSubscription: any;
  private noResponseCharacter: string;
  private lambdaHintEndpoint: string;

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
    this.noResponseCharacter = '–';
    this.lambdaHintEndpoint = `https://yh5ionr9rg.execute-api.us-east-1.amazonaws.com/groupHints/groupHints`;
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
      console.log(error);
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
      if (this.isAnswerMultiChoice(answerObj))
        teamAnswersQuestion[phase].responses.sort((a: any, b: any) => b.multiChoiceCharacter.localeCompare(a.multiChoiceCharacter));
      else{
        teamAnswersQuestion[phase].responses.sort((a: any, b: any) => a.rawAnswer.localeCompare(b.rawAnswer));
        const noResponse = teamAnswersQuestion[phase].responses.filter((response: any) => response.rawAnswer === this.noResponseCharacter);
        const otherResponses = teamAnswersQuestion[phase].responses.filter((response: any) => response.rawAnswer !== this.noResponseCharacter);
        teamAnswersQuestion[phase].responses = [...otherResponses, ...noResponse];
      }
    }
  }

  private processConfidenceLevel(ans: any, teamAnswersQuestion: any, teamName: string){
    const confidenceLevel = teamAnswersQuestion['phase1'].confidences.find((confidence: any) => confidence.level === ans.confidenceLevel);
    console.log(confidenceLevel);
    if (confidenceLevel){
      if (ans.isCorrect) {
        console.log('confidences');
        console.log(teamAnswersQuestion['phase1'].confidences);
        console.log(teamAnswersQuestion['phase1'].confidences.find ((confidence: any) => { confidence.correct = confidence.correct.filter((team: any) => team.team !== teamName)}));
        teamAnswersQuestion['phase1'].confidences = teamAnswersQuestion['phase1'].confidences.filter((confidence: any) => {
          return confidence.team !== null && confidence.correct.every((team: any) => team.team !== teamName);
        });
        confidenceLevel.correct.push({
          team: teamName,
          rawAnswer: ans.answer.rawAnswer
        });
      } else {
        teamAnswersQuestion['phase1'].confidences = teamAnswersQuestion['phase1'].confidences.filter((confidence: any) => {
          return confidence.team !== null && confidence.incorrect.every((team: any) => team.team !== teamName);
        });
        confidenceLevel.incorrect.push({
          team: teamName,
          rawAnswer: ans.answer.rawAnswer
        });
      }
    }
  }

  private processHint(ans: any, teamAnswersQuestion: any){
    const hints = teamAnswersQuestion['phase2'].hints;
    const hint = JSON.parse(ans.hint);
    if (hint){
      hints.push({
        rawHint: hint.rawHint,
        teamName: hint.teamName  
      })
    }
  }

  public async processGPTHints(
    hints: IHostTeamAnswersHint[],
    questionText: string,
    correctAnswer: string
  ):Promise<any> {
    console.log(hints);
      try { 
      const attempt = fetch(this.lambdaHintEndpoint, {
          method: HTTP.Post,
          headers: {
              "content-type": "application/json",
              connection: "close",
              "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
              hints,
              questionText: questionText,
              correctAnswer: correctAnswer
          }),
      })
      .then((response) => {
          if (!response.ok) {
            console.error(response.statusText)
          }
          console.log(response);
          return response.json();
      })
      
      return attempt;
      } catch (e) {
          console.log(e)
      }
    return "";
  }

  private incrementNoResponseCount(teamAnswersQuestion: any, phase: string, teamName: string) {
    const noResponse = teamAnswersQuestion[phase].responses.find((response: any) => response.multiChoiceCharacter === this.noResponseCharacter);
    if (noResponse) {
      noResponse.count += 1;
      noResponse.teams.push(teamName);
    }
  }

  private decrementNoResponseCount(teamAnswersQuestion: any, phase: string, teamName: string) {
    const noResponse = teamAnswersQuestion[phase].responses.find((response: any) => response.multiChoiceCharacter === this.noResponseCharacter);
    if (noResponse) {
      noResponse.count -= 1;
      noResponse.teams = noResponse.teams.filter((team: string) => team !== teamName);
    }
  }

  private ConfidenceLevelDictionary: { [key in ConfidenceLevel]: string } = {
    [ConfidenceLevel.NOT_RATED]: 'Not\nRated',
    [ConfidenceLevel.NOT_AT_ALL]: 'Not\nAt All',
    [ConfidenceLevel.KINDA]: 'Kinda',
    [ConfidenceLevel.QUITE]: 'Quite',
    [ConfidenceLevel.VERY]: 'Very',
    [ConfidenceLevel.TOTALLY]: 'Totally',
  };

  private buildEmptyHostTeamAnswerConfidences() {
    let confidenceArray = [];
    for (const [key, value] of Object.entries(this.ConfidenceLevelDictionary)) {
      confidenceArray.push({
        level: key,
        label: value,
        correct: [],
        incorrect: []
      });
    }
    return confidenceArray;
  };

  private buildEmptyHostTeamAnswerShortAnswer() {
    return {
      phase1: {
          responses: [{
          normAnswer: [],
          rawAnswer: 'No response',
          count: 0,
          isCorrect: false,
          multiChoiceCharacter: this.noResponseCharacter,
          teams: []
          }],
          confidences: this.buildEmptyHostTeamAnswerConfidences(),
      },
      phase2: {
          responses: [{
          normAnswer: [],
          rawAnswer: 'No response',
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
          confidences: this.buildEmptyHostTeamAnswerConfidences(),
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
                if (phase === 'phase1' && answer.confidenceLevel) 
                  this.processConfidenceLevel(answer, teamAnswersQuestion, team.name);
                if (phase === 'phase2' && answer.hint)
                  this.processHint(answer, teamAnswersQuestion);
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
    const answerPhase = teamAnswer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
    let answerQuestion = this.hostTeamAnswers.questions.find((question: any) => question.questionId === teamAnswer.questionId);
    this.processAnswer(teamAnswer, answerQuestion, answerPhase, teamAnswer.teamName);
    this.decrementNoResponseCount(answerQuestion, answerPhase, teamAnswer.teamName);
    if (!teamAnswer) {
      console.error('Error: Invalid team answer');
      return this.hostTeamAnswers;
    }
    
    return this.hostTeamAnswers;
  }

  private updateHostTeamAnswerConfidenceHint(teamAnswer: BackendAnswer): IHostTeamAnswers{
    const answerPhase = teamAnswer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? 'phase1' : 'phase2';
    let answerQuestion = this.hostTeamAnswers.questions.find((question: any) => question.questionId === teamAnswer.questionId);
    if (answerPhase === 'phase1' && teamAnswer.confidenceLevel){
      this.processConfidenceLevel(teamAnswer, answerQuestion, teamAnswer.teamName);
    }
    if (answerPhase === 'phase2' && teamAnswer.hint){
      this.processHint(teamAnswer, answerQuestion);
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
      this.hostTeamAnswers = this.updateHostTeamAnswerConfidenceHint(teamAnswer);
      callback(this.hostTeamAnswers);
    });
  }
}