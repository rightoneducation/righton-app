/** @jest-environment jsdom */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  ApiClient,
  Environment,
  GameSessionParser,
  IAWSGameSession,
  IGameSession,
  IChoice,
} from '@righton/networking';
import Theme from '../../src/lib/Theme';
import i18n from './mock/translations/mockTranslations';
import PhaseResults from '../../src/pages/PhaseResults';
import mockPhaseOneZeroPointsGameSession from './mock/gamesessions/scoretests/phaseOneZeroPointsGameSession.json';
import mockPhaseOneTenPointsGameSession from './mock/gamesessions/scoretests/phaseOneTenPointsGameSession.json';

export function renderWithThemeRouterTranslation(children: React.ReactElement) {
  return render(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={Theme}>
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
}

const apiClient = new ApiClient(Environment.Staging);


describe ('PhaseResults', () => {
  // tests if player has answered incorrectly on phase 1 (starting score: 0, ending score: 0)
  // it('Phase 1, wrong answer', async () => {
  //   // mock gameSession with team that answered incorrectly on first question
  //   const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
  //     mockPhaseOneZeroPointsGameSession as IAWSGameSession
  //   ) as IGameSession;
  //   const mockCurrentQuestion = gameSession.questions[gameSession.currentQuestionIndex!];
  //   const mockAnswerChoices =
  //     mockCurrentQuestion?.choices?.map((choice: IChoice) => ({
  //       id: uuidv4(),
  //       text: choice.text,
  //       isCorrectAnswer: choice.isAnswer,
  //       reason: choice.reason ?? '',
  //   })) ?? [];

  //   renderWithThemeRouterTranslation(
  //     <PhaseResults
  //       apiClient={apiClient}
  //       teams={gameSession.teams}
  //       currentState={gameSession.currentState}
  //       teamAvatar={0}
  //       currentQuestionIndex={gameSession.currentQuestionIndex}
  //       teamId={gameSession.teams![0].id}
  //       gameSession={gameSession}
  //       answerChoices={mockAnswerChoices}
  //       score={0}
  //       hasRejoined={false}
  //     />
  //   );

  //   // tests that new score indicator isn't displayed 
  //   expect(screen.queryByTestId('scoreindicator-newpoints')).not.toBeInTheDocument(); 
  // });

   // tests if player has answered correctly on phase 1 (starting score: 120, ending score: 130)
   it('Phase 1, correct answer', async () => {
    // mock gameSession with team that answered incorrectly on first question
    const gameSession = GameSessionParser.gameSessionFromAWSGameSession(
      mockPhaseOneTenPointsGameSession as IAWSGameSession
    ) as IGameSession;
    const mockCurrentQuestion = gameSession.questions[gameSession.currentQuestionIndex!];
    const mockAnswerChoices =
      mockCurrentQuestion?.choices?.map((choice: IChoice) => ({
        id: uuidv4(),
        text: choice.text,
        isCorrectAnswer: choice.isAnswer,
        reason: choice.reason ?? '',
    })) ?? [];

    await act(async () => {
      renderWithThemeRouterTranslation(
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
      );
    });

    // tests that new score indicator has value of +10
    // await waitFor(() => {
    //   expect(screen.getByTestId('scoreindicator-newpoints')).toHaveTextContent('130');
    // });
  });

});


//   expect(screen.getByTestId('scoreindicator-newpoints')).toHaveTextContent('0');
// describe ('PhaseResults', () => {
//   it('Phase 1, correct answer', async () => {

//   });
// });

// describe ('PhaseResults', () => {
//   it('Phase 2, wrong answer', async () => {

//   });
// });

// describe ('PhaseResults', () => {
//   it('Phase 2, correct answer', async () => {

//   });
// });