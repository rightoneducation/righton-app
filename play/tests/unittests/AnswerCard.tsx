/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../src/lib/Theme';
import AnswerCard from '../../src/components/AnswerCard';
import { GameSessionState } from '@righton/networking';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({ t: (key: string) => key })
  }));

export function renderWithTheme(children: React.ReactElement) {
   return render(<ThemeProvider theme={Theme}>{children}</ThemeProvider>);
}

const answersMock = [
    { text: 'answer1', isCorrectAnswer: false },
    { text: 'answer2', isCorrectAnswer: false },
    { text: 'answer3', isCorrectAnswer: true },
    { text: 'answer4', isCorrectAnswer: false}
];

const handleSubmitAnswer = jest.fn(async () => {
  return true;
});

const handleSelectAnswer = jest.fn(() => {return true}); 

describe('AnwerCard', () => {
  it('should render the AnswerCard component', async () => {
      const {debug} = renderWithTheme( <AnswerCard answers={answersMock} isSubmitted={false} handleSubmitAnswer={handleSubmitAnswer} currentState={GameSessionState.CHOOSE_CORRECT_ANSWER} selectedAnswer={1} handleSelectAnswer={handleSelectAnswer}  /> );
      expect(screen.getByTestId('gameCode-inputtextfield')).toBeInTheDocument();
      // debug();
  });
});