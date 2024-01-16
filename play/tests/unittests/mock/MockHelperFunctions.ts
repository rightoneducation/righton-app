import { randomUUID } from 'crypto';
import {
  IGameSession,
  ITeam,
  ITeamMember,
  ITeamAnswer,
  ConfidenceLevel
} from '@righton/networking';
import apiClient from './ApiClient.mock';
import { LocalModel } from '../../../src/lib/PlayModels';

export const createTeamMemberMock = (): ITeamMember => {
  return {
    id: randomUUID(),
    isFacilitator: false,
    answers: [],
    deviceId: randomUUID(),
    createdAt: Date().toString(),
    updatedAt: Date().toString(),
    teamTeamMembersId: randomUUID(),
  };
};

export const createTeamMock = (
  gameSession: IGameSession,
  teamName: string,
  score: number
): ITeam => {
  return {
    id: randomUUID(),
    name: teamName,
    teamMembers: [createTeamMemberMock()],
    score,
    selectedAvatarIndex: 0,
    createdAt: Date().toString(),
    updatedAt: Date().toString(),
    gameSessionTeamsId: gameSession.id,
    teamQuestionId: String(gameSession.questions[0].id),
    teamQuestionGameSessionId: gameSession.id,
  } as ITeam;
};

export const createTeamAnswerMock = (
  questionId: number,
  isChosen: boolean,
  isTrickAnswer: boolean,
  text: string
): ITeamAnswer => {
  return {
    id: randomUUID(),
    isChosen,
    text,
    questionId: '',
    isTrickAnswer,
    createdAt: Date().toString(),
    updatedAt: Date().toString(),
    teamMemberAnswersId: randomUUID(),
    answerContents: '',
    confidenceLevel: ConfidenceLevel.NOT_RATED,
  } as ITeamAnswer;
};

export const localModelLoaderMock = () => {
  const currentTime = new Date().getTime() / 60000;
  return {
    currentTime,
    gameSessionId: randomUUID(),
    teamId: randomUUID(),
    teamMemberId: randomUUID(),
    selectedAvatar: 0,
    hasRejoined: false,
    currentTimer: currentTime - 100,
  } as LocalModel;
};

/**
 * Creates a valid game session
 * Validate game session by checking for .toBeDefined() on all properties
 * Populate gameSession with correct number of teams in default configuration
 * @param numberOfTeams
 * @returns valid game session with teams and team members
 */
export const createValidGameSession = async (numberOfTeams: number) => {
  const gameSession = await apiClient.createGameSession(1111, false);
  const defaultTeamName = 'Team Name';
  const defaultScore = 0;
  expect(gameSession).toBeDefined();
  expect(gameSession.teams).toBeDefined();
  expect(gameSession.currentQuestionIndex).toBeDefined();
  expect(
    gameSession.questions[gameSession.currentQuestionIndex]
  ).toBeDefined();
  for (let i = 0; i < numberOfTeams; i += 1) {
    gameSession.teams.push(
      createTeamMock(gameSession, defaultTeamName, defaultScore)
    );
  }
  if (gameSession.teams) {
    expect(gameSession).toHaveProperty('teams');
    gameSession.teams.forEach((team) => {
      expect(team).toHaveProperty('teamMembers');
      team.teamMembers.forEach((teamMember) => {
        expect(teamMember).toHaveProperty('answers');
      });
    });
  }
  return gameSession as IGameSession;
};
