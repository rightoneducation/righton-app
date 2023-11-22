import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import { GameSessionState } from '@righton/networking';
import { I18nextProvider } from 'react-i18next';
import HeaderContent from './HeaderContent';
import Theme from '../lib/Theme';
import i18n from '../i18n.mock';

export default {
  title: 'Design System/3_Organisms/HeaderContent',
  component: HeaderContent,
} as Meta<typeof HeaderContent>;

const Template: StoryFn<typeof HeaderContent> = function HeaderContentTemplate(
  args
) {
  return (
    <ThemeProvider theme={Theme}>
      <I18nextProvider i18n={i18n}>
        <HeaderContent {...args} />
      </I18nextProvider>
    </ThemeProvider>
  );
};

const handleTimerIsFinished = () => {
  console.debug('finished');
};

export const ChooseCorrectAnswer = Template.bind({});
ChooseCorrectAnswer.args = {
  currentState: GameSessionState.CHOOSE_CORRECT_ANSWER,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const ChooseTrickAnswer = Template.bind({});
ChooseTrickAnswer.args = {
  currentState: GameSessionState.CHOOSE_TRICKIEST_ANSWER,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const Phase1Discuss = Template.bind({});
Phase1Discuss.args = {
  currentState: GameSessionState.PHASE_1_DISCUSS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const Phase2Discuss = Template.bind({});
Phase2Discuss.args = {
  currentState: GameSessionState.PHASE_2_DISCUSS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const Phase1Results = Template.bind({});
Phase1Results.args = {
  currentState: GameSessionState.PHASE_1_RESULTS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const Phase2Results = Template.bind({});
Phase2Results.args = {
  currentState: GameSessionState.PHASE_2_RESULTS,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const Correct = Template.bind({});
Correct.args = {
  isCorrect: true,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const Incorrect = Template.bind({});
Incorrect.args = {
  isIncorrect: true,
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};
