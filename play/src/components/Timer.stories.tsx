import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import Timer from './Timer';
import Theme from '../lib/Theme';

export default {
  title: 'Design System/2_Molecules/Timer',
  component: Timer,
} as ComponentMeta<typeof Timer>;

const handleTimerIsFinished = () => {
  console.debug('finished');
};

const Template: ComponentStory<typeof Timer> = function TimerTemplate(args) {
  return (
    <ThemeProvider theme={Theme}>
      <Timer {...args} />
    </ThemeProvider>
  );
};

export const FiveSecondTimer = Template.bind({});
FiveSecondTimer.args = {
  totalTime: 5,
  isPaused: false,
  handleTimerIsFinished,
};

export const FifteenSecondTimer = Template.bind({});
FifteenSecondTimer.args = {
  totalTime: 15,
  isPaused: false,
  handleTimerIsFinished,
};

export const TwoMinuteFiveSecondTimer = Template.bind({});
TwoMinuteFiveSecondTimer.args = {
  totalTime: 125,
  isPaused: false,
  handleTimerIsFinished,
};
