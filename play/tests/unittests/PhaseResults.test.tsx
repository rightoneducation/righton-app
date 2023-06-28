/** @jest-environment jsdom */
import React from 'react';
import { render, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactModal from 'react-modal';
import {
  ApiClient,
  Environment,
  GameSessionParser,
  IAWSGameSession,
  IGameSession,
  IChoice,
  IQuestion,
} from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from './mock/translations/mockTranslations';
import PhaseResults from '../../src/pages/PhaseResults';
import mockPhaseOneZeroPointsGameSession from './mock/gamesessions/scoretests/phaseOneZeroPointsGameSession.json';
import mockPhaseOneTenPointsGameSession from './mock/gamesessions/scoretests/phaseOneTenPointsGameSession.json';
import mockPhaseTwoUnpopularAnswerGamesession from './mock/gamesessions/scoretests/phaseTwoUnpopularAnswerGameSession.json';
import mockPhaseTwoPopularAnswerGamesession from './mock/gamesessions/scoretests/phaseTwoPopularAnswerGameSession.json';

ReactModal.setAppElement('body');

// Mock the ApiClient.updateTeam method
jest.mock('@righton/networking', () => ({
  ...jest.requireActual('@righton/networking'),
  ApiClient: jest.fn().mockImplementation(() => ({
    updateTeam: jest.fn(),
  })),
}));
const apiClient = new ApiClient(Environment.Staging);
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
  // tests if player has answered incorrectly on phase 1 (starting score: 0, ending score: 0)
  it('Phase 1, wrong answer', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockPhaseOneZeroPointsGameSession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
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

  // tests if player has answered correctly on phase 1 (starting score: 120, ending score: 130)
  it('Phase 1, correct answer', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockPhaseOneTenPointsGameSession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
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

  // tests if player has answered correctly on phase 1 (starting score: 120, ending score: 130)
  it('Phase 2, unpopular trick answer', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockPhaseTwoUnpopularAnswerGamesession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices);
    });

    await waitFor(() => expect(apiClient.updateTeam).toHaveBeenCalled());

    // tests that new score indicator has value of +10
    expect(apiClient.updateTeam).toHaveBeenCalledWith({
      id: gameSession.teams![0].id,
      score: 120,
    });
  });

  // tests if player has answered correctly on phase 1 (starting score: 120, ending score: 130)
  it('Phase 2, popular trick answer', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockPhaseTwoPopularAnswerGamesession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion =
      gameSession.questions[gameSession.currentQuestionIndex!];
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
  });
});
