/** @jest-environment jsdom */
import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactModal from 'react-modal';
import {
  IGameSession,
  IChoice,
  IQuestion,
  GameSessionState,
} from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from './mock/translations/mockTranslations';
import PhaseResults from '../../src/pages/PhaseResults';
import apiClient from './mock/ApiClient.mock';
import {
  createTeamAnswerMock,
  createValidGameSession,
} from './mock/MockHelperFunctions';

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
  }[]
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          <PhaseResults
            apiClient={apiClient}
            teams={gameSession.teams}
            currentState={gameSession.currentState}
            teamAvatar={0}
            currentQuestionIndex={gameSession.currentQuestionIndex}
            teamId={gameSession.teams![0].id}
            gameSession={gameSession}
            answerChoices={mockAnswerChoices}
            score={120}
            hasRejoined={false}
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

describe('PhaseResults', () => {
  it('tests that score doesnt increase when player has answered incorrectly on Phase One', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = await createValidGameSession(2);
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
    gameSession.teams![0].teamMembers![0]!.answers!.push(
      createTeamAnswerMock(mockCurrentQuestion.id, true, false, '1')
    );
    gameSession.currentState = GameSessionState.PHASE_1_RESULTS;
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices);
    });
    // wait for updateTeam to be called (there's a useEffect and a mocked api happening in the component here)
    await waitFor(() => expect(apiClient.updateTeam).toHaveBeenCalled());
    // tests that new score has a value of 0
    expect(apiClient.updateTeam).toHaveBeenCalledWith({
      id: gameSession.teams![0].id,
      score: 120,
    });
  });

  it('tests that score is increased by 10 pts when player answers correctly on Phase One', async () => {
    // mock gameSession with team that answered correctly on first question
    const gameSession = await createValidGameSession(2);
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
    gameSession.teams![0].teamMembers![0]!.answers!.push(
      createTeamAnswerMock(mockCurrentQuestion.id, true, false, '3')
    );
    gameSession.currentState = GameSessionState.PHASE_1_RESULTS;
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices);
    });
    await waitFor(() => expect(apiClient.updateTeam).toHaveBeenCalled());
    // tests that new score indicator has value of +10
    expect(apiClient.updateTeam).toHaveBeenCalledWith({
      id: gameSession.teams![0].id,
      score: 130,
    });
  });

  it('test that a players score doesnt increase when picking an unpopular answer on Phase Two', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = await createValidGameSession(3);
    if (gameSession.teams) {
      const mockCurrentQuestion =
        gameSession.questions[gameSession.currentQuestionIndex!];
      gameSession.teams[0].teamMembers![0]!.answers!.push(
        createTeamAnswerMock(mockCurrentQuestion.id, true, false, '1'),
        createTeamAnswerMock(mockCurrentQuestion.id, false, true, '2')
      );
      gameSession.teams[1].teamMembers![0]!.answers!.push(
        createTeamAnswerMock(mockCurrentQuestion.id, true, false, '3'),
        createTeamAnswerMock(mockCurrentQuestion.id, false, true, '3')
      );
      gameSession.teams[2].teamMembers![0]!.answers!.push(
        createTeamAnswerMock(mockCurrentQuestion.id, true, false, '3'),
        createTeamAnswerMock(mockCurrentQuestion.id, false, true, '3')
      );
      gameSession.currentState = GameSessionState.PHASE_2_RESULTS;
      const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
      act(() => {
        renderWithThemeRouterTranslation(gameSession, mockAnswerChoices);
      });
      await waitFor(() => expect(apiClient.updateTeam).toHaveBeenCalled());
      expect(apiClient.updateTeam).toHaveBeenCalledWith({
        id: gameSession.teams![0].id,
        score: 120,
      });
    }
  });

  it('tests that a player is awarded points equal to the percentage of players that answered their selection in Phase One', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = await createValidGameSession(3);
    if (gameSession.teams) {
      const mockCurrentQuestion =
        gameSession.questions[gameSession.currentQuestionIndex!];
      gameSession.teams![0].teamMembers![0]!.answers!.push(
        createTeamAnswerMock(mockCurrentQuestion.id, true, false, '3'),
        createTeamAnswerMock(mockCurrentQuestion.id, false, true, '2')
      );
      gameSession.teams![1].teamMembers![0]!.answers!.push(
        createTeamAnswerMock(mockCurrentQuestion.id, true, false, '2'),
        createTeamAnswerMock(mockCurrentQuestion.id, false, true, '1')
      );
      gameSession.teams![2].teamMembers![0]!.answers!.push(
        createTeamAnswerMock(mockCurrentQuestion.id, true, false, '2'),
        createTeamAnswerMock(mockCurrentQuestion.id, false, true, '1')
      );
      gameSession.currentState = GameSessionState.PHASE_2_RESULTS;
      const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
      act(() => {
        renderWithThemeRouterTranslation(gameSession, mockAnswerChoices);
      });
      await waitFor(() => {
        expect(apiClient.updateTeam).toHaveBeenCalled();
      });
      // tests that new score indicator has value of +10
      expect(apiClient.updateTeam).toHaveBeenCalledWith({
        id: gameSession.teams![0].id,
        score: 187,
      });
    }
  });
});
