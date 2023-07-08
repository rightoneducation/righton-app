import { randomInt, randomUUID } from 'crypto'
import { 
  ApiClient, 
  Environment, 
  IGameSession, 
  GameSessionState, 
  IQuestion,
} from '@righton/networking';

const apiClient = new ApiClient(Environment.Staging);

const createQuestion = () => {
  return {
    id: Math.abs(randomInt(Math.pow(2, 31))),
    gameSessionId: randomUUID(),
    text: "Question text",
    instructions: [
        "hint 1",
        "hint 2",
        "hint 3"
    ],
    standard: "standard",
    cluster: "cluster",
    domain: "domain",
    grade: "grade",
    order: 1,
    choices: [
      {
          text: "1",
          reason: "reason",
          isAnswer: false,
      },
      {
          text: "2",
          reason: "reason",
          isAnswer: false,
      },
      {
          text: "3",
          reason: "reason",
          isAnswer: true,
      },
      {
          text: "4",
          reason: "reason",
          isAnswer: false,
      }
    ]
} as IQuestion
}

const mockCreateGameSession = (): IGameSession => {
  return {
    id: randomUUID(),
    gameId: Math.abs(randomInt(Math.pow(2, 31))),
    startTime: null,
    phaseOneTime: 300,
    phaseTwoTime: 300,
    currentQuestionIndex: 0,
    currentState: GameSessionState.NOT_STARTED,
    gameCode: randomInt(1000, 9999),
    isAdvancedMode: false,
    currentTimer: null,
    questions: [createQuestion(), createQuestion()],
    title: "Game Session Title",
    updatedAt: Date().toString(),
    createdAt: Date().toString(),
    teams: []
  }
};

apiClient.createGameSession = jest.fn().mockImplementation(mockCreateGameSession);
apiClient.updateTeam = jest.fn().mockResolvedValue({});

export default apiClient;