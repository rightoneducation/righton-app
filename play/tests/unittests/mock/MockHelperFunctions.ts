import { randomUUID, randomInt } from 'crypto'
import { 
  IGameSession, 
  ITeam,
  ITeamMember,
  ITeamAnswer
} from '@righton/networking';
import { LocalModel } from '../../../src/lib/PlayModels';

export const createTeamMock = (gameSession: IGameSession): ITeam => {
  return {
    id: randomUUID(),
    name: "Team Name",
    teamMembers: [createTeamMemberMock()],
    score: 0,
    selectedAvatarIndex: 0,
    createdAt: Date().toString(),
    updatedAt: Date().toString(),
    gameSessionTeamsId: gameSession.id,
    teamQuestionId: String(gameSession.questions[0].id),
    teamQuestionGameSessionId: gameSession.id
  } as ITeam;
};

export const createTeamMemberMock = (): ITeamMember => {
  return {
    id: randomUUID(),
    isFacilitator: false,
    answers: [],
    deviceId: randomUUID(),
    createdAt: Date().toString(),
    updatedAt: Date().toString(),
    teamTeamMembersId: randomUUID()
  }
};

export const createTeamAnswerMock = (
  questionId: number,
  isChosen: boolean,
  isTrickAnswer: boolean,
  text: string
): ITeamAnswer => {
  return {
    id: randomUUID(),
    isChosen: isChosen,
    text: text,
    questionId: questionId,
    isTrickAnswer: isTrickAnswer,
    createdAt: Date().toString(),
    updatedAt: Date().toString(),
    teamMemberAnswersId: randomUUID(),
  } as ITeamAnswer;
};

export const localModelLoaderMock = () => {
  const currentTime = randomInt(100, 999);
  return {
    currentTime: currentTime,
    gameSessionId: randomUUID(),
    teamId: randomUUID(),
    teamMemberId: randomUUID(),
    selectedAvatar: 0,
    hasRejoined: false,
    currentTimer: currentTime - 100,
  } as LocalModel;
}