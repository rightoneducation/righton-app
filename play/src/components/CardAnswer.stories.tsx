import React from 'react';
import { GameSessionState } from '@righton/networking';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import CardAnswer from './CardAnswer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/3_Organisms/CardAnswer',
  component: CardAnswer,
} as ComponentMeta<typeof CardAnswer>;

const Template: ComponentStory<typeof CardAnswer> = function CardAnswerTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <CardAnswer {...args} />
    </ThemeProvider>
  );
};

export const CorrectAnswer = Template.bind({});

CorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
  answers: [
    { text: 'Answer 1', isCorrectAnswer: true },
    { text: 'Answer 2', isCorrectAnswer: false },
    { text: 'Answer 3', isCorrectAnswer: false },
    { text: 'Answer 4', isCorrectAnswer: false },
  ],
};

export const TrickAnswer = Template.bind({});
TrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  answers: [
    { text: 'Answer 1', isCorrectAnswer: true },
    { text: 'Answer 2', isCorrectAnswer: false },
    { text: 'Answer 3', isCorrectAnswer: false },
    { text: 'Answer 4', isCorrectAnswer: false },
  ],
};
