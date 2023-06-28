/** @jest-environment jsdom */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
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
  IQuestion
} from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from './mock/translations/mockTranslations';
import GameInProgress from '../../src/pages/GameInProgress';
import mockGameSession from './mock/gamesessions/chooseCorrectGameSession.json';
import mockLocalModel from './mock/localModel.json';

ReactModal.setAppElement('body');

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
  }[],
  currentTimer: number,
) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
        <GameInProgress
          {...gameSession}
          apiClient={apiClient}
          teamMemberId={gameSession!.teams![0].teamMembers![0]!.id} // es-lint-disable-line @typescript-eslint/no-non-null-assertion
          teamAvatar={0}
          answerChoices={mockAnswerChoices}
          teamId={gameSession.teams![0].id} // es-lint-disable-line @typescript-eslint/no-non-null-assertion
          score={100}
          hasRejoined
          currentTimer={currentTimer}
          localModel={mockLocalModel}
        />
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

// function for getting answer choices from a question
const getAnswerChoices = (mockCurrentQuestion: IQuestion) => {
  return mockCurrentQuestion?.choices?.map((choice: IChoice) => ({
      id: uuidv4(),
      text: choice.text,
      isCorrectAnswer: choice.isAnswer,
      reason: choice.reason ?? '',
  })) ?? [];
};

describe ('GameInProgress', () => {
  // tests if timer is > 0, button on answer card is still enabled
  it('Timer has time, isSubmitted === false', async () => {
    // mock gameSession with timer at 0
    const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockGameSession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion = gameSession.questions[gameSession.currentQuestionIndex!]; // es-lint-disable-line @typescript-eslint/no-non-null-assertion
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices, 120);
    });
    // expects answer card button to be enabled
    expect(screen.getByTestId('answer-button-disabled')).toBeInTheDocument();
  });

    // tests if timer is finished (-1 here), function with timerIsFinished is called (so that isSubmitted === true)
  it('Timer has time, isSubmitted === false', async () => {
    // mock gameSession with timer at 0
     const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockGameSession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion = gameSession.questions[gameSession.currentQuestionIndex!]; // es-lint-disable-line @typescript-eslint/no-non-null-assertion
    const mockAnswerChoices = getAnswerChoices(mockCurrentQuestion);
    act(() => {
      renderWithThemeRouterTranslation(gameSession, mockAnswerChoices, -1);
    });
     // expects answer card button to be disabled
    expect(screen.getByTestId('answer-button-disabled')).toBeInTheDocument();
  });
});