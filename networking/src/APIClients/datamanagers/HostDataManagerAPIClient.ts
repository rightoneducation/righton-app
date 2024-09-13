import { PlayDataManagerAPIClient } from './PlayDataManagerAPIClient';
import { IQuestionAPIClient, ITeamAPIClient, ITeamMemberAPIClient, ITeamAnswerAPIClient } from '../interfaces';
import { IQuestion, IChoice } from '../../Models/IQuestion';
import { IHostTeamAnswers, IHostTeamAnswersQuestion, IHostTeamAnswersHint, IHostTeamAnswersConfidence, IHostTeamAnswersResponse, IHostTeamAnswersPerPhase, ITeam } from '../../Models';
import { Environment } from '../interfaces/IBaseAPIClient';
import { IGameSessionAPIClient } from '../interfaces';
import { IGameSession } from '../../Models/IGameSession';
import { BackendAnswer, Answer, NumericAnswer, MultiChoiceAnswer, AnswerFactory, AnswerType } from '../../Models/AnswerClasses';
import { GameSessionState, ConfidenceLevel } from '../../AWSMobileApi';

export enum HTTP {
  Post = "POST",
}

export enum IPhase {
  ONE = 'phase1',
  TWO = 'phase2'
}

export class HostDataManagerAPIClient extends PlayDataManagerAPIClient {
  protected questionAPIClient: IQuestionAPIClient;
  protected teamAPIClient: ITeamAPIClient;
  protected teamMemberAPIClient: ITeamMemberAPIClient;
  protected teamAnswerAPIClient: ITeamAnswerAPIClient;
  protected createTeamSubscription: any;
  protected updateTeamSubscription: any;
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

  // get game session from backend and build host team answers object for use in Victory graphs
  async init(gameSessionId: string){
    this.gameSessionId = gameSessionId;
    this.gameSession = await this.gameSessionAPIClient.getGameSession(this.gameSessionId).then(
      (gameSession: IGameSession) => {
        this.gameSession = gameSession;
        if (gameSession.currentState !== GameSessionState.TEAMS_JOINING)
          this.initHostTeamAnswers(gameSession);
        return gameSession;
      }
    );
  }

  cleanupSubscription() {
    if (this.gameSessionSubscription && this.gameSessionSubscription.unsubscribe) {
      this.gameSessionSubscription.unsubscribe();
    }
    if (this.createTeamSubscription && this.createTeamSubscription.unsubscribe) {
      this.createTeamSubscription.unsubscribe();
    }
    if (this.updateTeamSubscription && this.updateTeamSubscription.unsubscribe) {
      this.updateTeamSubscription.unsubscribe();
    }
    if (this.createTeamAnswerSubscription && this.createTeamAnswerSubscription.unsubscribe) {
      this.createTeamAnswerSubscription.unsubscribe();
    }
    if (this.updateTeamAnswerSubscription && this.updateTeamAnswerSubscription.unsubscribe) {
      this.updateTeamAnswerSubscription.unsubscribe();
    } 
  }

  //subscribe to created teams, when players are joining in the lobby
  subscribeToCreateTeam(callback: (updatedGameSession: IGameSession | null) => void): void {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
  
    this.createTeamSubscription = this.teamAPIClient.subscribeCreateTeam(this.gameSessionId, (team: ITeam) => {
      if (!team) {
        console.error('Error: Invalid team');
        return;
      }
      const newGameSession = { ...this.gameSession as IGameSession };
      newGameSession.teams.push(team);
      this.gameSession = newGameSession;
      callback(newGameSession);
    });
  }


  //subscribe to updated teams, when players' scores are being assigned
  subscribeToUpdateTeam(callback: (updatedGameSession: IGameSession | null) => void): void {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
  
    this.updateTeamSubscription = this.teamAPIClient.subscribeUpdateTeam(this.gameSessionId, (team: ITeam) => {
      if (!team) {
        console.error('Error: Invalid team');
        return;
      }
      const newGameSession = { ...this.gameSession as IGameSession };
      newGameSession.teams[newGameSession.teams.findIndex((t) => t.id === team.id)] = team;
      this.gameSession = newGameSession;
      callback(newGameSession);
    });
  }

  async updateTime(newTime: number) {
    if (this.gameSession && this.gameSessionId && this.gameSession.startTime){
      try {  
        await this.gameSessionAPIClient.updateGameSession({id: this.gameSessionId, startTime: newTime.toString()}).then((gameSession: IGameSession) => {
          this.gameSession = gameSession;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }


  async updateGameSession(gameSessionUpdates: any) {
    if (this.gameSession && this.gameSessionId){
      try {  
        await this.gameSessionAPIClient.updateGameSession({id: this.gameSessionId, ...gameSessionUpdates }).then((gameSession: IGameSession) => {
          this.gameSession = gameSession;
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async deleteTeam(teamId: string, callback: (gameSession: IGameSession) => void) {
    try {
      await this.teamAPIClient.deleteTeam(teamId).then(() => {
        if (this.gameSession)
          this.gameSessionAPIClient.getGameSession(this.gameSession.id).then((gameSession: IGameSession) => {
            this.gameSession = gameSession;
            callback(gameSession);
          });
    });
    } catch(e) {
      console.log(e)
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

  private processAnswer(ans: any, teamAnswersQuestion: any, phase: IPhase, teamName: string) {
    const answerObj = this.createAnswerFromBackendData(ans.answer);
    let newResponses = [...teamAnswersQuestion[phase].responses];
    if (answerObj) {
      answerObj.normalizeAnswer(answerObj.rawAnswer);
      const existingAnswer = teamAnswersQuestion[phase].responses.find((response: any) => {
        if (answerObj.rawAnswer.toString() === response.rawAnswer.toString())
          return true;
        if (this.isAnswerNumeric(answerObj)) {
          return answerObj.isEqualTo(response.normAnswer as number[]);
        }
        return answerObj.isEqualTo(response.normAnswer as string[]);
      });
      if (existingAnswer) {
        newResponses = newResponses.map((response: any) => {
          if (response === existingAnswer) {
            return {
              ...response,
              count: response.count + 1,
              teams: [...response.teams, teamName]
            };
          }
          return response;
        });
      } else {
        const newAnswer = {
          normAnswer: answerObj.normAnswer as string[] | number[],
          rawAnswer: answerObj.rawAnswer,
          count: 1,
          isCorrect: ans.isCorrect,
          multiChoiceCharacter: this.isAnswerMultiChoice(answerObj) ? answerObj.multiChoiceCharacter : '',
          teams: [teamName]
        };
        newResponses.push(newAnswer);
      }
      if (this.isAnswerMultiChoice(answerObj))
        newResponses.sort((a: any, b: any) => b.multiChoiceCharacter.localeCompare(a.multiChoiceCharacter));
      else{
        newResponses.sort((a: any, b: any) => a.rawAnswer.localeCompare(b.rawAnswer));
        const noResponse = newResponses.filter((response: any) => response.multiChoiceCharacter === this.noResponseCharacter);
        const otherResponses = newResponses.filter((response: any) => response.multiChoiceCharacter !== this.noResponseCharacter);
        newResponses = [...otherResponses, ...noResponse];
      }
    }
    return newResponses;
  }

  private processConfidenceLevel(ans: BackendAnswer, teamAnswersQuestion: IHostTeamAnswersQuestion, teamName: string){
    let newConfidences: IHostTeamAnswersConfidence[] = []
    if (teamAnswersQuestion[IPhase.ONE].confidences)
      newConfidences = [...teamAnswersQuestion[IPhase.ONE].confidences];
    // step one: remove the old confidence value
    if (ans.isCorrect)
      newConfidences = newConfidences.map((confidence) => { return {...confidence, correct: confidence.correct.filter((entry) => entry.team !== teamName)}});
    else
      newConfidences = newConfidences.map((confidence) => { return {...confidence, incorrect: confidence.incorrect.filter((entry) => entry.team !== teamName)}});
    // step two: push the new confidence value into the correct object
    const confidenceLevel = newConfidences.find((confidence: any) => confidence.level === ans.confidenceLevel);
    if (confidenceLevel) {
      if (ans.isCorrect){
        confidenceLevel.correct.push({
          team: teamName,
          rawAnswer: ans.answer.rawAnswer
        });
      } else {
        confidenceLevel.incorrect.push({
          team: teamName,
          rawAnswer: ans.answer.rawAnswer
        });
      }
    // step three: splices in the new confidenceLevel created above into the newConfidences array, replacing the old one
    const matchingIndex = newConfidences.findIndex((confidence: IHostTeamAnswersConfidence) => confidence.level === confidenceLevel.level);
    if (matchingIndex !== -1 && teamAnswersQuestion.phase1.confidences && matchingIndex) 
      newConfidences[matchingIndex] = confidenceLevel;
    }
    return newConfidences;
  }

  private processHint(ans: any, teamAnswersQuestion: any){
    const hints = [...teamAnswersQuestion[IPhase.TWO].hints];
    const hint = JSON.parse(ans.hint);
    if (hint){
      hints.push({
        rawHint: hint.rawHint,
        teamName: hint.teamName  
      })
    }
    return hints;
  }

  public async processGPTHints(
    hints: IHostTeamAnswersHint[],
    questionText: string,
    correctAnswer: string
  ):Promise<any> {
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
          return response.json();
      })
      
      return attempt;
      } catch (e) {
          console.log(e)
      }
    return "";
  }

  private decrementNoResponseCount(teamAnswersQuestion: any, phase: IPhase, teamName: string) {
    const noResponse = teamAnswersQuestion[phase].responses.find((response: any) => response.multiChoiceCharacter === this.noResponseCharacter);
    if (noResponse) {
      noResponse.count = Math.max(noResponse.count - 1,0);
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
        level: key as ConfidenceLevel,
        label: value,
        correct: [],
        incorrect: []
      });
    }
    return confidenceArray;
  };

  private buildEmptyHostTeamAnswerShortAnswer(teamsCount: number) {
    return {
      phase1: {
          responses: [{
          normAnswer: [],
          rawAnswer: 'No response',
          count: teamsCount,
          isCorrect: false,
          multiChoiceCharacter: this.noResponseCharacter,
          teams: [],
          isSelectedMistake: false,
          }],
          confidences: this.buildEmptyHostTeamAnswerConfidences()
      },
      phase2: {
          responses: [{
          normAnswer: [],
          rawAnswer: 'No response',
          count: teamsCount,
          isCorrect: false,
          multiChoiceCharacter: this.noResponseCharacter,
          teams: [],
          }],
          hints: []
      }
    }
  }

  private buildEmptyHostTeamAnswerMultiChoice(question: IQuestion, teamsCount: number) {
    const emptyMultiChoiceTeamAnswer = {
      phase1: {
          responses: [
            {
              normAnswer: [],
              rawAnswer: this.noResponseCharacter,
              count: teamsCount,
              isCorrect: false,
              multiChoiceCharacter: this.noResponseCharacter,
              teams: [],
            },
            ...question.choices.map((choice: IChoice, index: number) => {
              return {
                normAnswer: [choice.text],
                rawAnswer: choice.text,
                count: 0,
                isCorrect: choice.isAnswer,
                multiChoiceCharacter: String.fromCharCode(65 + index),
                teams: [],
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
              count: teamsCount,
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
    emptyMultiChoiceTeamAnswer.phase1.responses.sort((a: any, b: any) => b.multiChoiceCharacter.localeCompare(a.multiChoiceCharacter));
    emptyMultiChoiceTeamAnswer.phase2.responses.sort((a: any, b: any) => b.multiChoiceCharacter.localeCompare(a.multiChoiceCharacter));
    return (emptyMultiChoiceTeamAnswer);
  }

  /* builds out predetermined teamAnswer object that will receive and maintain all student data over the course of a game
   * used for populated Victory graphs rapidly, without continuously having to do find commands through nested data structures etc
   * @params {IGameSesssion} - game session that teacher has created
   * @returns {IHostTeamAnswers} - team answers object that will be mainted throughout the game 
   */
  buildHostTeamAnswers(gameSession: IGameSession){
    let teamAnswers: IHostTeamAnswers = {
      questions: []
    };
    // this generates empty objects for either the multichoice or short answer questions, so that they can be populated later
    if (gameSession.questions.length > 0) {
      teamAnswers.questions = gameSession.questions.map((question) => ({
        questionId: question.id,
        ...question.isShortAnswerEnabled ? this.buildEmptyHostTeamAnswerShortAnswer(this.gameSession?.teams.length ?? 0) : this.buildEmptyHostTeamAnswerMultiChoice(question, this.gameSession?.teams.length ?? 0)
      }));
    }
    const numTeams = gameSession.teams.length;
    // this is populating existing answers into the hostTeamAnswers object
    // for each question in the object we just built, loop through all the team answers and populate the object if they apply
    teamAnswers.questions.forEach((question) => {
      gameSession.teams.forEach((team) => {
        team.teamMembers.forEach((teamMember) => {
            teamMember.answers?.forEach((answer) => {
              if (answer?.questionId === question.questionId) {
                const phase: IPhase = answer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? IPhase.ONE : IPhase.TWO;
                // step one: update the responses with the new answer
                question[phase].responses = this.processAnswer(answer, question, phase, team.name);
                // step two: if we're in phase one, check if the player has also provided a confidence and update data accordingly
                if (phase === IPhase.ONE){
                  if (answer?.confidenceLevel)
                    question[phase].confidences = this.processConfidenceLevel(answer, question, team.name);
                }
                // step three: if we're in phase two, check if the player has also provided a hint and update data accordingly
                if (answer?.hint && phase === IPhase.TWO){
                  if (answer?.hint)
                    question[phase].hints = this.processHint(answer, question);
                }
              }
            });
          });
        });
        Object.values(IPhase).forEach((phase) => {
          const teamsAnswered = question[phase].responses
            .reduce<string[]>((acc, response) => {
              if (response.multiChoiceCharacter !== '–') {
                acc.push(...response.teams);
              }
              return acc;
            }, []);
          const teamsUnanswered = gameSession.teams.map((team) => team.name).filter((team) => !teamsAnswered.includes(team));
          const numNoResponses = numTeams - teamsAnswered.length;
          const noResponses = question[phase].responses.find((response: any) => response.multiChoiceCharacter === '–');
          if (noResponses) {
            noResponses.count = numNoResponses ?? 0;
            noResponses.teams = teamsUnanswered;
          }
        });
      });
    return teamAnswers;
  }

  // ensures that featured mistakes that the teacher has selected (sometimes sorted by popularity)
  // are randomized when displayed to students in O(n)
  // Fisher-Yates shuffle per: https://bost.ocks.org/mike/shuffle/
  shuffleSelectedMistakes(updatedResponses: IHostTeamAnswersResponse[]){
    let length = updatedResponses.length, t, i;

    while (length){
      i = Math.floor(Math.random() * length--);
      t = updatedResponses[length];
      updatedResponses[length] = updatedResponses[i];
      updatedResponses[i] = t;
    }
    return updatedResponses;
  }

  updateHostTeamAnswersSelectedMistakes(currentMistakes: any, currentQuestion: IQuestion): IHostTeamAnswers {
    const updatedQuestions = this.hostTeamAnswers.questions.map((question) => {
      if (question.questionId !== currentQuestion.id) {
        return question;
      }
      const updatedResponses = question.phase1.responses.map((response) => {
        const matchingMistake = currentMistakes.find((mistake: any) => mistake.answer === response.rawAnswer);
        if (matchingMistake)
          return {...response, isSelectedMistake: matchingMistake.isSelectedMistake}
        return response;
        }
      );
      return {
        ...question,
        phase1: {
          ...question.phase1,
          responses: updatedResponses,
        },
      };
    });
    this.hostTeamAnswers = {
      ...this.hostTeamAnswers,
      questions: updatedQuestions,
    };
    return this.hostTeamAnswers;
  }

  getHostTeamAnswers() {
    return this.hostTeamAnswers
  }

  getResponsesForQuestion(currentQuestionId: string, currentPhase: IPhase) {
    const currentQuestion = this.hostTeamAnswers.questions.find((question) => question.questionId === currentQuestionId);
    if (!currentQuestion) {
      console.error('Error: Invalid question id');
      return [];
    }
    let responses = currentQuestion[currentPhase].responses; 
    if (currentPhase === IPhase.ONE)
      responses = this.shuffleSelectedMistakes(responses);
    return responses;
  }

  initHostTeamAnswers(inputGameSession: IGameSession) {
      this.hostTeamAnswers = this.buildHostTeamAnswers(inputGameSession);
    return this.hostTeamAnswers;
  }

  private updateHostTeamAnswerResponses(teamAnswer: BackendAnswer, currentResponses: IHostTeamAnswersResponse[], currentQuestion: IHostTeamAnswersQuestion, phase: IPhase): IHostTeamAnswersResponse[] {
    let newResponses = [...currentResponses];
    newResponses = this.processAnswer(teamAnswer, currentQuestion, phase, teamAnswer.teamName);
    this.decrementNoResponseCount(currentQuestion, phase, teamAnswer.teamName);
    
    if (!teamAnswer) {
      console.error('Error: Invalid team answer');
      return newResponses;
    }
    return newResponses;
  }

  subscribeToCreateTeamAnswer(callback: (createdHostTeamAnswers: IHostTeamAnswers | null) => void): void {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
    this.createTeamAnswerSubscription = this.teamAnswerAPIClient.subscribeCreateTeamAnswer(this.gameSessionId, (teamAnswer: BackendAnswer) => {
      if (!teamAnswer) {
        console.error('Error: Invalid team answer');
        return;
      }
      const questionIndex = this.hostTeamAnswers.questions.findIndex((question: any) => question.questionId === teamAnswer.questionId);
      const currentQuestion = this.hostTeamAnswers.questions[questionIndex];
      const phase = teamAnswer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? IPhase.ONE : IPhase.TWO;
      const currentPhase = this.hostTeamAnswers.questions[questionIndex][phase];
      const currentResponses = this.hostTeamAnswers.questions[questionIndex][phase].responses;
      const newResponses = this.updateHostTeamAnswerResponses(teamAnswer, currentResponses, currentQuestion, phase);
  
      // Explicitly working with copies of objects to preserve immutability
      const updatedPhase: IHostTeamAnswersPerPhase = {
        ...currentPhase,
        responses: newResponses
      };
  
      const createdHostTeamAnswers = {
        ...this.hostTeamAnswers,
        questions: this.hostTeamAnswers.questions.map((question, index) => 
          index === questionIndex ? { ...question, [phase]: updatedPhase } : question
        )
      };
      
      this.hostTeamAnswers = createdHostTeamAnswers;
      callback(createdHostTeamAnswers);
    });
  }
  
  subscribeToUpdateTeamAnswer(callback: (updatedHostTeamAnswers: IHostTeamAnswers) => void): void {
    if (!this.gameSessionId) {
      console.error('Error: Invalid game session id');
      return;
    }
    this.updateTeamAnswerSubscription = this.teamAnswerAPIClient.subscribeUpdateTeamAnswer(this.gameSessionId, (teamAnswer: BackendAnswer) => {
      if (!teamAnswer) {
        console.error('Error: Invalid team answer');
        return;
      }
      const questionIndex = this.hostTeamAnswers.questions.findIndex((question: any) => question.questionId === teamAnswer.questionId);
      const currentQuestion = this.hostTeamAnswers.questions[questionIndex];
      const phase = teamAnswer.currentState === GameSessionState.CHOOSE_CORRECT_ANSWER ? IPhase.ONE : IPhase.TWO;
      const currentPhase = currentQuestion[phase];
      let newConfidences = [];
      let newHints = [];
      let newPhase = currentPhase;
      if (phase === IPhase.ONE) {
        newConfidences = this.processConfidenceLevel(teamAnswer, currentQuestion, teamAnswer.teamName);
        newPhase = {...currentPhase, confidences: newConfidences};
      } else {
        newHints = this.processHint(teamAnswer, currentQuestion);
        newPhase = {...currentPhase, hints: newHints};
      }
      const updatedHostTeamAnswers = {
        ...this.hostTeamAnswers,
        questions: this.hostTeamAnswers.questions.map((question, index) =>
          index === questionIndex ? { ...question, [phase]: newPhase } : question
        )
      };
      this.hostTeamAnswers = updatedHostTeamAnswers;
      callback(updatedHostTeamAnswers);
    });
  }
}