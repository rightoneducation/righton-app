import React from 'react';
import { GameSessionState } from '@righton/networking';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import AnswerCard from './AnswerCard';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/AnswerCard',
  component: AnswerCard,
} as Meta<typeof AnswerCard>;

const Template: StoryFn<typeof AnswerCard> = function AnswerCardTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <AnswerCard {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

export const CorrectAnswer = Template.bind({});

CorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
  answers: [
    { text: 'Answer 1', isAnswer: true },
    { text: 'Answer 2', isAnswer: false },
    { text: 'Answer 3', isAnswer: false },
    { text: 'Answer 4', isAnswer: false },
  ],
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  answers: [
    { text: 'Answer 1', isAnswer: true },
    { text: 'Answer 2', isAnswer: false },
    { text: 'Answer 3', isAnswer: false },
    { text: 'Answer 4', isAnswer: false },
  ],
};
