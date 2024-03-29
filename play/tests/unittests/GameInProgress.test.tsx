/** @jest-environment jsdom */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactModal from 'react-modal';
import {
  GameSessionState,
  IGameSession,
  IChoice,
  IQuestion,
} from '@righton/networking';
import apiClient from './mock/ApiClient.mock';
import {
  createTeamAnswerMock,
  localModelLoaderMock,
  createValidGameSession,
} from './mock/MockHelperFunctions';
import Theme from '../../src/lib/Theme';
import i18n from '../../src/i18n.mock';
import GameInProgress from '../../src/pages/GameInProgress';

ReactModal.setAppElement('body');
apiClient.updateTeam = jest.fn().mockResolvedValue({});

// function for rendering phase results with theme, router, and translation
// intakes a mock gamesession based on test parameters
function renderWithThemeRouterTranslation(
  gameSession: IGameSession,
  mockAnswerChoices: {
    id: string;
    text: string;
    isCorrectAnswer: boolean;
    reason: string;
  }[],
  currentTimer: number
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          <GameInProgress
            {...gameSession}
            apiClient={apiClient}
            teamMemberId={gameSession!.teams![0].teamMembers![0]!.id}
            teamAvatar={0}
            answerChoices={mockAnswerChoices}
            teamId={gameSession.teams![0].id}
            score={100}
            hasRejoined
            currentTimer={currentTimer}
            localModel={localModelLoaderMock()}
          />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

// function for getting answer choices from a question
const getAnswerChoices = (mockCurrentQuestion: IQuestion) => {
  return (
    mockCurrentQuestion?.choices?.map((choice: IChoice) => ({
      id: uuidv4(),
      text: choice.text,
      isCorrectAnswer: choice.isAnswer,
      reason: choice.reason ?? '',
    })) ?? []
  );
};

describe('GameInProgress', () => {
  it('tests if timer is > 0, button on answer card is still enabled', async () => {
    // mock gameSession with timer at 0
    const gameSession = await createValidGameSession(2);
    gameSession.teams![0].teamMembers![0]!.answers!.push(
      createTeamAnswerMock(0, true, false, '3'),
      createTeamAnswerMock(0, false, true, '1')
    );
    gameSession.currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices, 120);
    });
    // expects answer card button to be enabled
    expect(screen.getByTestId('answer-button-disabled')).toBeInTheDocument();
  });

  it('tests if timer is < 0, button on answer card is disabled', async () => {
    // mock gameSession with timer at 0
    const gameSession = await createValidGameSession(2);
    gameSession.teams![0].teamMembers![0]!.answers!.push(
      createTeamAnswerMock(0, true, false, '3'),
      createTeamAnswerMock(0, false, true, '1')
    );
    gameSession.currentState = GameSessionState.CHOOSE_CORRECT_ANSWER;
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices, -1);
    });
    // expects answer card button to be disabled
    expect(screen.getByTestId('answer-button-disabled')).toBeInTheDocument();
  });
});
