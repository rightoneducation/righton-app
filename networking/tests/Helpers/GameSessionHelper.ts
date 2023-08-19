import { randomInt, randomUUID } from "crypto";
import { GameSessionState } from "../../src";
import { IGameSession } from "../../src/Models/IGameSession";
import { IQuestion } from "../../src/Models/IQuestion";
import QuestionHelper from "./QuestionHelper";
class GameSessionHelper {
  private static phaseOneTime = 300;
  private static phaseTwoTime = 300;

  static generateGameCode(): number {
    return randomInt(1000, 9999);
  }

  static gameSession(
    question: IQuestion = QuestionHelper.simpleQuestion(),
    question2: IQuestion = QuestionHelper.simpleQuestion()
  ) {
    return {
      id: randomUUID(),
      gameId: randomUUID(),
      startTime: null,
      phaseOneTime: this.phaseOneTime,
      phaseTwoTime: this.phaseTwoTime,
      teams: [],
      currentQuestionIndex: 0,
      currentState: GameSessionState.NOT_STARTED,
      gameCode: this.generateGameCode(),
      isAdvancedMode: false,
      currentTimer: null,
      questions: [question, question2],
      title: "Game Session Title",
      updatedAt: Date().toString(),
      createdAt: Date().toString(),
    } as IGameSession;
  }
}

export default GameSessionHelper;
